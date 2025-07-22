class Ball {
    constructor(scene, x, y) {
        this.scene = scene;
        this.radius = 10;
        this.speed = 300;
        
        // Create ball sprite (visual only - no physics)
        this.sprite = scene.add.circle(x, y, this.radius, 0xffff00);
        this.sprite.setStrokeStyle(2, 0xffffff);
        
        // Manual physics system
        this.velocity = { x: 0, y: 0 };
        this.position = { x: x, y: y };
        
        // Stuck detection
        this.lastPosition = { x: x, y: y };
        this.stuckTime = 0;
    }
    
    setRandomVelocity() {
        // Launch upward with angle between -45 and 45 degrees from vertical
        const angle = Phaser.Math.Between(-45, 45);
        const radians = Phaser.Math.DegToRad(angle - 90); // -90 to make it upward
        const vx = Math.cos(radians) * this.speed;
        const vy = Math.sin(radians) * this.speed;
        
        this.velocity.x = vx;
        this.velocity.y = vy;
        
        console.log(`Ball launched at angle: ${angle}°, velocity: (${vx}, ${vy})`);
    }
    
    launch(angle = null) {
        if (angle === null) {
            angle = Phaser.Math.Between(-45, 45);
        }
        
        // Convert to radians and make it upward (-90 degrees offset)
        const radians = Phaser.Math.DegToRad(angle - 90);
        const vx = Math.cos(radians) * this.speed;
        const vy = Math.sin(radians) * this.speed;
        
        this.velocity.x = vx;
        this.velocity.y = vy;
        
        console.log(`Ball launched at angle: ${angle}°, velocity: (${vx}, ${vy})`);
    }
    
    update() {
        // Manual physics update - move ball based on velocity
        const deltaTime = 1/60; // Assume 60fps
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        
        // Update sprite position
        this.sprite.setPosition(this.position.x, this.position.y);
        
        // Check if ball fell below paddle (game over condition)
        if (this.position.y > this.scene.game.config.height) {
            this.onBallLost();
            return;
        }
        
        // Manual world bounds collision detection
        let bounced = false;
        
        if (this.position.x <= this.radius && this.velocity.x < 0) {
            console.log('Ball hit left wall, velocity before:', this.velocity.x, this.velocity.y);
            this.position.x = this.radius;
            this.velocity.x = -this.velocity.x; // Reverse X velocity
            bounced = true;
            console.log('Ball velocity after left wall bounce:', this.velocity.x, this.velocity.y);
        } else if (this.position.x >= this.scene.game.config.width - this.radius && this.velocity.x > 0) {
            console.log('Ball hit right wall, velocity before:', this.velocity.x, this.velocity.y);
            this.position.x = this.scene.game.config.width - this.radius;
            this.velocity.x = -this.velocity.x; // Reverse X velocity
            bounced = true;
            console.log('Ball velocity after right wall bounce:', this.velocity.x, this.velocity.y);
        } else if (this.position.y <= this.radius && this.velocity.y < 0) {
            console.log('Ball hit top wall, velocity before:', this.velocity.x, this.velocity.y);
            this.position.y = this.radius;
            this.velocity.y = -this.velocity.y; // Reverse Y velocity
            bounced = true;
            console.log('Ball velocity after top wall bounce:', this.velocity.x, this.velocity.y);
        }
        
        // Log velocity periodically for debugging
        if (this.scene.time.now % 1000 < 16) { // Every ~1 second
            const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            console.log('Ball velocity:', this.velocity.x.toFixed(1), this.velocity.y.toFixed(1), 'Speed:', currentSpeed.toFixed(1));
        }
        
        // Stuck detection
        const currentPos = { x: this.position.x, y: this.position.y };
        const distance = Math.sqrt(
            Math.pow(currentPos.x - this.lastPosition.x, 2) + 
            Math.pow(currentPos.y - this.lastPosition.y, 2)
        );
        
        const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        
        if (distance < 2 && currentSpeed < 50) {
            this.stuckTime += 16; // Assuming 60fps = ~16ms per frame
            if (this.stuckTime > 2000) { // Stuck for more than 2 seconds
                console.log('Ball truly stuck, applying emergency kick');
                const randomAngle = Phaser.Math.Between(-45, 45);
                const radians = Phaser.Math.DegToRad(randomAngle - 90);
                this.velocity.x = Math.cos(radians) * this.speed;
                this.velocity.y = Math.sin(radians) * this.speed;
                this.stuckTime = 0;
            }
        } else {
            this.stuckTime = 0;
        }
        this.lastPosition = { x: currentPos.x, y: currentPos.y };
    }
    
    // Check collision with a rectangle (block or paddle)
    checkRectangleCollision(rect) {
        const ballLeft = this.position.x - this.radius;
        const ballRight = this.position.x + this.radius;
        const ballTop = this.position.y - this.radius;
        const ballBottom = this.position.y + this.radius;
        
        const rectLeft = rect.x - rect.width / 2;
        const rectRight = rect.x + rect.width / 2;
        const rectTop = rect.y - rect.height / 2;
        const rectBottom = rect.y + rect.height / 2;
        
        // Check if collision is occurring
        if (ballRight > rectLeft && ballLeft < rectRight && 
            ballBottom > rectTop && ballTop < rectBottom) {
            
            // Determine collision side
            const dx = this.position.x - rect.x;
            const dy = this.position.y - rect.y;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);
            
            // Check if hit from top/bottom more than left/right
            if (absDy / rect.height > absDx / rect.width) {
                // Hit from top/bottom - reverse Y velocity
                this.velocity.y = -this.velocity.y;
                console.log('Hit rectangle from top/bottom - reversing Y velocity');
                
                // Move ball out of collision
                if (dy < 0) {
                    this.position.y = rectTop - this.radius;
                } else {
                    this.position.y = rectBottom + this.radius;
                }
            } else {
                // Hit from left/right - reverse X velocity
                this.velocity.x = -this.velocity.x;
                console.log('Hit rectangle from left/right - reversing X velocity');
                
                // Move ball out of collision
                if (dx < 0) {
                    this.position.x = rectLeft - this.radius;
                } else {
                    this.position.x = rectRight + this.radius;
                }
            }
            
            return true;
        }
        
        return false;
    }
    
    onBallLost() {
        console.log('Ball lost!');
        
        // Play life lost sound
        if (gameState.audioManager) {
            gameState.audioManager.playLifeLost();
        }
        
        this.scene.onBallLost(this);
    }
    
    handlePaddleCollision(paddle) {
        // Calculate angle based on where ball hits paddle
        const paddleCenter = paddle.getPosition().x;
        const ballX = this.position.x;
        const hitPosition = (ballX - paddleCenter) / (paddle.width / 2);
        
        // Clamp hit position
        const clampedHit = Phaser.Math.Clamp(hitPosition, -1, 1);
        
        // Calculate new angle (max 45 degrees from vertical to reduce horizontal bouncing)
        const maxAngle = 45;
        const angle = clampedHit * maxAngle;
        
        this.launch(angle);
        
        // Play sound effect
        if (gameState.audioManager) {
            gameState.audioManager.playBounce();
        }
    }
    
    getSprite() {
        return this.sprite;
    }
    
    getPosition() {
        return { x: this.position.x, y: this.position.y };
    }
    
    getVelocity() {
        return { x: this.velocity.x, y: this.velocity.y };
    }
    
    destroy() {
        this.sprite.destroy();
    }
}