class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
        
        // Title
        this.add.text(400, 150, 'BREAKOUT EVOLUTIVO', {
            fontSize: '48px',
            fill: '#ffff00',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(400, 200, 'Los bloques aprenden... ¿puedes ganar?', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Instructions
        const instructions = [
            'Controles:',
            '• Mouse: Mover paleta',
            '• A/D o ←/→: Mover paleta',
            '',
            'Objetivo:',
            '• Destruye todos los bloques',
            '• Los bloques aprenden y se reorganizan',
            '• Cuidado con los bloques venganza (rojos)',
            '',
            'Haz clic para comenzar'
        ];
        
        instructions.forEach((line, index) => {
            this.add.text(400, 280 + (index * 25), line, {
                fontSize: '16px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
        });
        
        // Start button (invisible, covers whole screen)
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('GameScene');
            });
        
        // Keyboard start
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}