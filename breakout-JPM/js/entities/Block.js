class Block {
    constructor(scene, x, y, type = 'normal') {
        this.scene = scene;
        this.type = type; // 'normal', 'revenge'
        this.width = 75;
        this.height = 25;
        this.hitCount = 0;
        this.id = `block_${x}_${y}`;
        
        // Create block sprite
        this.sprite = scene.add.rectangle(x, y, this.width, this.height, this.getColor());
        
        // Enable physics
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setImmovable(true);
        
        // Visual styling
        this.sprite.setStrokeStyle(2, 0xffffff);
        
        // Store reference to this block in the sprite
        this.sprite.blockInstance = this;
        
        // Initialize block data for AI
        this.initializeBlockData();
        
        // Revenge block properties
        this.lastShotTime = 0;
        this.shotInterval = 3000; // 3 seconds
    }
    
    getColor() {
        switch (this.type) {
            case 'revenge':
                return 0xe74c3c; // Red
            case 'normal':
            default:
                const colors = [0x3498db, 0x2ecc71, 0x9b59b6, 0xf39c12];
                return colors[Math.floor(Math.random() * colors.length)];
        }
    }
    
    initializeBlockData() {
        if (!gameState.blockData.has(this.id)) {
            gameState.blockData.set(this.id, {
                id: this.id,
                hitCount: 0,
                lastHitTime: 0,
                positionHits: { x: 0, y: 0 },
                dangerLevel: 0.0,
                originalPosition: { x: this.sprite.x, y: this.sprite.y }
            });
        }
    }
    
    onHit(ball) {
        this.hitCount++;
        
        // Update block data for AI
        const blockData = gameState.blockData.get(this.id);
        if (blockData) {
            blockData.hitCount++;
            blockData.lastHitTime = Date.now();
            blockData.positionHits.x = (blockData.positionHits.x + ball.getPosition().x) / 2;
            blockData.positionHits.y = (blockData.positionHits.y + ball.getPosition().y) / 2;
            blockData.dangerLevel = Math.min(1.0, blockData.hitCount * 0.2);
        }
        
        // Check if should become revenge block
        if (this.type === 'normal' && this.hitCount >= 3) {
            this.becomeRevengeBlock();
            return false; // Don't destroy, it became revenge block
        }
        
        // Play sound
        if (gameState.audioManager) {
            gameState.audioManager.playBreak();
        }
        
        // Update score (but don't destroy yet - GameScene will handle destruction)
        const points = this.type === 'revenge' ? 200 : 100;
        updateScore(gameState.score + points);
        
        // Don't create destroy effect here - will be created when actually destroyed
        
        return true; // Block should be destroyed
    }
    
    becomeRevengeBlock() {
        this.type = 'revenge';
        this.sprite.setFillStyle(this.getColor());
        
        // Add pulsing effect
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        console.log(`Block ${this.id} became a revenge block!`);
    }
    
    update() {
        if (this.type === 'revenge') {
            const currentTime = Date.now();
            if (currentTime - this.lastShotTime > this.shotInterval) {
                this.shootProjectile();
                this.lastShotTime = currentTime;
            }
        }
    }
    
    shootProjectile() {
        // Find paddle position
        const paddle = this.scene.paddle;
        if (!paddle) return;
        
        const paddlePos = paddle.getPosition();
        const blockPos = { x: this.sprite.x, y: this.sprite.y };
        
        // Calculate direction to paddle
        const dx = paddlePos.x - blockPos.x;
        const dy = paddlePos.y - blockPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const direction = {
            x: dx / distance,
            y: dy / distance
        };
        
        // Create projectile
        new Projectile(this.scene, blockPos.x, blockPos.y, direction);
        
        // Play sound
        if (gameState.audioManager) {
            gameState.audioManager.playShoot();
        }
        
        console.log(`Revenge block ${this.id} shot a projectile!`);
    }
    
    createDestroyEffect() {
        // Simple particle effect
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.circle(
                this.sprite.x + Phaser.Math.Between(-20, 20),
                this.sprite.y + Phaser.Math.Between(-10, 10),
                Phaser.Math.Between(2, 4),
                this.sprite.fillColor
            );
            
            this.scene.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-50, 50),
                y: particle.y + Phaser.Math.Between(-50, 50),
                alpha: 0,
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }
    
    getSprite() {
        return this.sprite;
    }
    
    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }
    
    destroy() {
        // Create particle effect when actually destroying
        this.createDestroyEffect();
        
        // Remove from block data
        gameState.blockData.delete(this.id);
        
        // Destroy sprite
        this.sprite.destroy();
    }
}