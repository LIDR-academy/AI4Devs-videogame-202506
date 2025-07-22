class Projectile {
    constructor(scene, x, y, direction) {
        this.scene = scene;
        this.speed = 200;
        this.direction = direction;
        
        // Create projectile sprite
        this.sprite = scene.add.circle(x, y, 5, 0xf39c12); // Orange
        
        // Enable physics
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setVelocity(
            this.direction.x * this.speed,
            this.direction.y * this.speed
        );
        
        // Visual styling
        this.sprite.setStrokeStyle(1, 0xffffff);
        
        // Store reference
        this.sprite.projectileInstance = this;
        
        // Add to projectiles group if it exists
        if (scene.projectiles) {
            scene.projectiles.add(this.sprite);
        }
        
        // Auto-destroy after 5 seconds
        scene.time.delayedCall(5000, () => {
            if (this.sprite && this.sprite.active) {
                this.destroy();
            }
        });
    }
    
    update() {
        // Check bounds
        if (this.sprite.x < 0 || this.sprite.x > this.scene.game.config.width ||
            this.sprite.y < 0 || this.sprite.y > this.scene.game.config.height) {
            this.destroy();
        }
    }
    
    onHitPaddle() {
        // Damage player (lose life)
        this.scene.onProjectileHitPaddle();
        this.destroy();
    }
    
    onHitBall() {
        // Projectile is destroyed by ball
        this.destroy();
    }
    
    getSprite() {
        return this.sprite;
    }
    
    destroy() {
        if (this.sprite && this.sprite.active) {
            // Remove from group
            if (this.scene.projectiles) {
                this.scene.projectiles.remove(this.sprite);
            }
            
            // Create small explosion effect
            for (let i = 0; i < 4; i++) {
                const particle = this.scene.add.circle(
                    this.sprite.x + Phaser.Math.Between(-5, 5),
                    this.sprite.y + Phaser.Math.Between(-5, 5),
                    2,
                    0xf39c12
                );
                
                this.scene.tweens.add({
                    targets: particle,
                    alpha: 0,
                    scale: 0.1,
                    duration: 200,
                    onComplete: () => particle.destroy()
                });
            }
            
            this.sprite.destroy();
        }
    }
}