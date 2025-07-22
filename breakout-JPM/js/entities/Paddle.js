class Paddle {
    constructor(scene, x, y) {
        this.scene = scene;
        this.width = 120;
        this.height = 20;
        
        // Create paddle sprite
        this.sprite = scene.add.rectangle(x, y, this.width, this.height, 0xffffff);
        
        // Enable physics
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setImmovable(true);
        this.sprite.body.setCollideWorldBounds(true);
        
        // Set up mouse/keyboard controls
        this.setupControls();
        
        // Visual styling
        this.sprite.setStrokeStyle(2, 0xcccccc);
    }
    
    setupControls() {
        // Mouse control
        this.scene.input.on('pointermove', (pointer) => {
            this.sprite.x = Phaser.Math.Clamp(pointer.x, this.width / 2, this.scene.game.config.width - this.width / 2);
        });
        
        // Keyboard controls (optional)
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.wasd = this.scene.input.keyboard.addKeys('W,S,A,D');
    }
    
    update() {
        // Keyboard movement (alternative to mouse)
        const speed = 8;
        
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.sprite.x = Math.max(this.width / 2, this.sprite.x - speed);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.sprite.x = Math.min(this.scene.game.config.width - this.width / 2, this.sprite.x + speed);
        }
    }
    
    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }
    
    getSprite() {
        return this.sprite;
    }
    
    destroy() {
        this.sprite.destroy();
    }
}