class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
        
        // Set up physics world bounds
        this.physics.world.setBounds(0, 0, 800, 600);
        
        // Initialize game objects
        this.paddle = new Paddle(this, 400, 550);
        this.balls = [];
        this.blocks = [];
        this.projectiles = this.physics.add.group();
        
        // Create initial ball
        this.createBall();
        
        // Create blocks
        this.createBlocks();
        
        // Set up collision detection
        this.setupCollisions();
        
        // Initialize level
        this.initializeLevel();
    }
    
    createBall() {
        const ball = new Ball(this, 400, 500);
        this.balls.push(ball);
        
        // Add to collision group if it exists
        if (this.ballGroup) {
            this.ballGroup.add(ball.getSprite());
        }
        
        return ball;
    }
    
    createBlocks() {
        this.blocks = [];
        const rows = 5;
        const cols = 10;
        const blockWidth = 75;
        const blockHeight = 25;
        const padding = 5;
        const startX = (800 - (cols * (blockWidth + padding) - padding)) / 2 + blockWidth / 2;
        const startY = 80;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * (blockWidth + padding);
                const y = startY + row * (blockHeight + padding);
                
                const block = new Block(this, x, y, 'normal');
                this.blocks.push(block);
            }
        }
        
        console.log(`Created ${this.blocks.length} blocks`);
    }
    
    setupCollisions() {
        // Create physics groups for better collision management
        this.ballGroup = this.physics.add.group();
        this.blockGroup = this.physics.add.group();
        
        // Add existing balls to group
        this.balls.forEach(ball => {
            this.ballGroup.add(ball.getSprite());
        });
        
        // Add existing blocks to group
        this.blocks.forEach(block => {
            this.blockGroup.add(block.getSprite());
        });
        
        // Ball-Paddle collision - using collider but with manual velocity control
        this.physics.add.collider(this.ballGroup, this.paddle.getSprite(), (ballSprite, paddleSprite) => {
            const ball = this.balls.find(b => b.getSprite() === ballSprite);
            if (ball) {
                // Store velocity before Phaser modifies it
                const preCollisionVel = { x: ballSprite.body.velocity.x, y: ballSprite.body.velocity.y };
                console.log('Paddle collision - velocity before:', preCollisionVel.x, preCollisionVel.y);
                
                // Handle collision manually
                ball.handlePaddleCollision(this.paddle);
                
                console.log('Paddle collision - velocity after manual handling:', ballSprite.body.velocity.x, ballSprite.body.velocity.y);
            }
        });
        
        // Ball-Block collision
        this.physics.add.overlap(this.ballGroup, this.blockGroup, (ballSprite, blockSprite) => {
            if (blockSprite.blockInstance && blockSprite.active && !blockSprite.blockInstance.markedForDestruction) {
                const ball = this.balls.find(b => b.getSprite() === ballSprite);
                if (ball) {
                    console.log('Ball hit block at:', blockSprite.x, blockSprite.y);
                    console.log('Ball velocity before collision:', ballSprite.body.velocity.x, ballSprite.body.velocity.y);
                    
                    // Manual bounce calculation
                    const ballPos = { x: ballSprite.x, y: ballSprite.y };
                    const blockPos = { x: blockSprite.x, y: blockSprite.y };
                    const blockBounds = { 
                        width: blockSprite.displayWidth, 
                        height: blockSprite.displayHeight 
                    };
                    
                    // Determine which side of the block was hit
                    const dx = ballPos.x - blockPos.x;
                    const dy = ballPos.y - blockPos.y;
                    const absDx = Math.abs(dx);
                    const absDy = Math.abs(dy);
                    
                    let newVelX = ballSprite.body.velocity.x;
                    let newVelY = ballSprite.body.velocity.y;
                    
                    // If hit from top/bottom more than left/right
                    if (absDy / blockBounds.height > absDx / blockBounds.width) {
                        newVelY = -newVelY; // Reverse Y velocity
                        console.log('Hit from top/bottom - reversing Y velocity');
                    } else {
                        newVelX = -newVelX; // Reverse X velocity
                        console.log('Hit from left/right - reversing X velocity');
                    }
                    
                    // Allow legitimate velocity change
                    ball.allowVelocityChange = true;
                    
                    // Apply new velocity
                    ballSprite.body.setVelocity(newVelX, newVelY);
                    
                    // Update ball's manual velocity tracking
                    ball.manualVelocity = { x: newVelX, y: newVelY };
                    
                    console.log('Ball velocity after bounce:', newVelX, newVelY);
                    
                    // Handle block destruction
                    const shouldDestroy = blockSprite.blockInstance.onHit(ball);
                    if (shouldDestroy) {
                        blockSprite.blockInstance.markedForDestruction = true;
                        blockSprite.blockInstance.destroy();
                        this.removeBlock(blockSprite.blockInstance);
                        this.checkWinCondition();
                    }
                }
            }
        });
        
        // Ball-Projectile collision (ball destroys projectile)
        this.physics.add.overlap(this.ballGroup, this.projectiles, (ballSprite, projectileSprite) => {
            if (projectileSprite.projectileInstance) {
                projectileSprite.projectileInstance.onHitBall();
            }
        });
        
        // Projectile-Paddle collision
        this.physics.add.overlap(this.paddle.getSprite(), this.projectiles, (paddleSprite, projectileSprite) => {
            if (projectileSprite.projectileInstance) {
                projectileSprite.projectileInstance.onHitPaddle();
            }
        });
    }
    
    initializeLevel() {
        // Set max balls based on level
        gameState.maxBalls = Math.min(gameState.level, 3);
        
        // Launch existing balls
        this.balls.forEach(ball => {
            ball.launch(Phaser.Math.Between(-45, 45));
        });
        
        // Add additional balls for higher levels
        while (this.balls.length < gameState.maxBalls) {
            const newBall = this.createBall();
            newBall.launch(Phaser.Math.Between(-45, 45));
        }
        
        console.log(`Level ${gameState.level} initialized with ${this.balls.length} balls`);
    }
    
    update() {
        // Update game objects
        this.paddle.update();
        
        // Update balls with manual collision detection
        this.balls.forEach(ball => {
            ball.update();
            
            // Check ball-block collisions manually
            this.blocks.forEach(block => {
                if (!block.markedForDestruction) {
                    const blockRect = {
                        x: block.getPosition().x,
                        y: block.getPosition().y,
                        width: block.width,
                        height: block.height
                    };
                    
                    if (ball.checkRectangleCollision(blockRect)) {
                        console.log('Ball hit block at:', blockRect.x, blockRect.y);
                        
                        // Handle block destruction
                        const shouldDestroy = block.onHit(ball);
                        if (shouldDestroy) {
                            block.markedForDestruction = true;
                            block.destroy();
                            this.removeBlock(block);
                            this.checkWinCondition();
                        }
                    }
                }
            });
            
            // Check ball-paddle collision manually
            const paddleRect = {
                x: this.paddle.getPosition().x,
                y: this.paddle.getPosition().y,
                width: this.paddle.width,
                height: this.paddle.height
            };
            
            if (ball.checkRectangleCollision(paddleRect)) {
                console.log('Ball hit paddle');
                ball.handlePaddleCollision(this.paddle);
            }
        });
        
        this.blocks.forEach(block => {
            if (block.update) {
                block.update();
            }
        });
        
        // Update projectiles
        this.projectiles.children.entries.forEach(projectileSprite => {
            if (projectileSprite.projectileInstance) {
                projectileSprite.projectileInstance.update();
            }
        });
    }
    
    onBallLost(ball) {
        // Remove ball from array and collision group
        this.balls = this.balls.filter(b => b !== ball);
        
        if (this.ballGroup && ball.getSprite()) {
            this.ballGroup.remove(ball.getSprite());
        }
        
        ball.destroy();
        
        console.log(`Ball lost! Remaining balls: ${this.balls.length}`);
        
        // Check if any balls remain
        if (this.balls.length === 0) {
            // Lose a life
            updateLives(gameState.lives - 1);
            
            console.log(`Life lost! Lives remaining: ${gameState.lives}`);
            
            if (gameState.lives <= 0) {
                // Game over
                console.log('GAME OVER!');
                this.scene.start('GameOverScene', { 
                    score: gameState.score, 
                    level: gameState.level,
                    won: false 
                });
            } else {
                // Respawn ball
                console.log('Respawning ball...');
                const newBall = this.createBall();
                newBall.launch(Phaser.Math.Between(-45, 45));
            }
        }
    }
    
    onProjectileHitPaddle() {
        // Lose a life when hit by projectile
        updateLives(gameState.lives - 1);
        
        if (gameState.lives <= 0) {
            this.scene.start('GameOverScene', { 
                score: gameState.score, 
                level: gameState.level,
                won: false 
            });
        }
    }
    
    removeBlock(block) {
        this.blocks = this.blocks.filter(b => b !== block);
        
        // Remove from collision group
        if (this.blockGroup && block.getSprite()) {
            this.blockGroup.remove(block.getSprite());
        }
    }
    
    checkWinCondition() {
        if (this.blocks.length === 0) {
            // Level complete
            updateLevel(gameState.level + 1);
            
            if (gameState.level > 3) {
                // Game won
                this.scene.start('GameOverScene', { 
                    score: gameState.score, 
                    level: gameState.level,
                    won: true 
                });
            } else {
                // Next level
                this.nextLevel();
            }
        }
    }
    
    nextLevel() {
        console.log(`Advancing to level ${gameState.level}`);
        
        // Clear existing balls
        this.balls.forEach(ball => ball.destroy());
        this.balls = [];
        
        // Clear projectiles
        this.projectiles.clear(true, true);
        
        // Create new blocks
        this.createBlocks();
        
        // Re-setup collisions for new blocks
        this.setupCollisions();
        
        // Initialize new level
        this.initializeLevel();
        
        // Show level transition
        this.showLevelTransition();
    }
    
    showLevelTransition() {
        const levelText = this.add.text(400, 300, `NIVEL ${gameState.level}`, {
            fontSize: '48px',
            fill: '#ffff00',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: levelText,
            alpha: 0,
            scale: 2,
            duration: 2000,
            onComplete: () => levelText.destroy()
        });
    }
}