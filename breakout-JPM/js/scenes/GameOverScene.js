class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        this.finalScore = data.score || 0;
        this.finalLevel = data.level || 1;
        this.won = data.won || false;
    }
    
    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
        
        // Title
        const title = this.won ? 'VICTORIA!' : 'GAME OVER';
        const titleColor = this.won ? '#2ecc71' : '#e74c3c';
        
        this.add.text(400, 150, title, {
            fontSize: '48px',
            fill: titleColor,
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Score display
        this.add.text(400, 220, `Puntuación Final: ${this.finalScore}`, {
            fontSize: '24px',
            fill: '#ffff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.add.text(400, 250, `Nivel Alcanzado: ${this.finalLevel}`, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Message based on result
        let message = '';
        if (this.won) {
            message = '¡Has derrotado a los bloques evolutivos!';
        } else {
            message = 'Los bloques han evolucionado más que tú...';
        }
        
        this.add.text(400, 320, message, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Restart button
        const restartButton = this.add.text(400, 400, 'JUGAR DE NUEVO', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        restartButton.setInteractive()
            .on('pointerover', () => {
                restartButton.setScale(1.1);
                restartButton.setFill('#2ecc71');
            })
            .on('pointerout', () => {
                restartButton.setScale(1);
                restartButton.setFill('#3498db');
            })
            .on('pointerdown', () => {
                this.restartGame();
            });
        
        // Menu button
        const menuButton = this.add.text(400, 450, 'MENÚ PRINCIPAL', {
            fontSize: '20px',
            fill: '#95a5a6',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        menuButton.setInteractive()
            .on('pointerover', () => {
                menuButton.setScale(1.1);
                menuButton.setFill('#ffffff');
            })
            .on('pointerout', () => {
                menuButton.setScale(1);
                menuButton.setFill('#95a5a6');
            })
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            });
        
        // Keyboard controls
        this.input.keyboard.on('keydown-SPACE', () => {
            this.restartGame();
        });
        
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }
    
    restartGame() {
        // Reset game state
        gameState.score = 0;
        gameState.lives = 3;
        gameState.level = 1;
        gameState.ballsActive = 1;
        gameState.maxBalls = 1;
        gameState.blockData.clear();
        
        // Update UI
        updateScore(0);
        updateLives(3);
        updateLevel(1);
        
        // Start game
        this.scene.start('GameScene');
    }
}