/**
 * GameOverScene.js - Escena de Game Over
 * Iron Man vs Ultron - Fase 1
 */

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        // Recibir datos de la escena anterior
        this.finalScore = data.score || gameState.score;
        this.finalLevel = data.level || gameState.currentLevel;
        this.victory = data.victory || false;
    }

    create() {
        console.log('🎮 GameOverScene iniciada');

        // Fondo degradado
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Título principal
        const mainTitle = this.victory ? '¡VICTORIA!' : 'FIN DEL JUEGO';
        const titleColor = this.victory ? '#00ff00' : '#ff0000';
        
        this.add.text(512, 150, mainTitle, {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: titleColor,
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Subtítulo
        const subtitle = this.victory ? '¡Has derrotado a Ultron!' : 'Ultron ha vencido esta vez...';
        this.add.text(512, 200, subtitle, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Estadísticas finales
        this.createStatistics();

        // Botones de acción
        this.createButtons();

        // Controles de teclado
        this.setupControls();

        // Efecto de partículas
        this.createParticleEffect();
    }

    createStatistics() {
        // Panel de estadísticas
        const statsPanel = this.add.graphics();
        statsPanel.fillStyle(0x000000, 0.7);
        statsPanel.fillRoundedRect(312, 250, 400, 200, 15);
        statsPanel.lineStyle(3, 0xffd700);
        statsPanel.strokeRoundedRect(312, 250, 400, 200, 15);

        // Título de estadísticas
        this.add.text(512, 270, 'ESTADÍSTICAS FINALES', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffd700',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Puntuación final
        this.add.text(512, 310, `Puntuación Final: ${this.finalScore}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Nivel alcanzado
        this.add.text(512, 340, `Nivel Alcanzado: ${this.finalLevel}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Monedas recolectadas
        this.add.text(512, 370, `Monedas Recolectadas: ${gameState.coinsCollected}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Tiempo de juego
        const gameTimeFormatted = GameUtils.formatTime(gameState.gameTime);
        this.add.text(512, 400, `Tiempo: ${gameTimeFormatted}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Calcular rango
        const rank = this.calculateRank(this.finalScore);
        this.add.text(512, 425, `Rango: ${rank}`, {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffd700',
            fontWeight: 'bold'
        }).setOrigin(0.5);
    }

    createButtons() {
        // Botón de reintentar
        const retryButton = this.add.text(400, 500, 'REINTENTAR', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#00ff00',
            stroke: '#000',
            strokeThickness: 2,
            backgroundColor: '#333333',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);

        // Botón de menú principal
        const menuButton = this.add.text(624, 500, 'MENÚ PRINCIPAL', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#000',
            strokeThickness: 2,
            backgroundColor: '#333333',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5);

        // Hacer botones interactivos
        this.setupButton(retryButton, () => this.restartGame());
        this.setupButton(menuButton, () => this.goToMenu());

        // Instrucciones
        this.add.text(512, 540, 'ESPACIO - Reintentar | ESC - Menú Principal', {
            fontSize: '14px',
            fontFamily: 'Arial',
            color: '#cccccc'
        }).setOrigin(0.5);
    }

    setupButton(button, callback) {
        button.setInteractive({ useHandCursor: true });
        
        button.on('pointerover', () => {
            button.setStyle({ 
                backgroundColor: '#555555',
                color: '#ffffff'
            });
        });
        
        button.on('pointerout', () => {
            button.setStyle({ 
                backgroundColor: '#333333',
                color: button.text === 'REINTENTAR' ? '#00ff00' : '#ffff00'
            });
        });
        
        button.on('pointerdown', callback);
    }

    setupControls() {
        // Tecla de reintentar
        this.input.keyboard.on('keydown-SPACE', () => {
            this.restartGame();
        });

        // Tecla de menú
        this.input.keyboard.on('keydown-ESC', () => {
            this.goToMenu();
        });

        // Enter también funciona para reintentar
        this.input.keyboard.on('keydown-ENTER', () => {
            this.restartGame();
        });
    }

    createParticleEffect() {
        // Efecto de partículas dependiendo del resultado
        const particleColor = this.victory ? 0x00ff00 : 0xff0000;
        
        // Crear partículas simples usando gráficos
        for (let i = 0; i < 20; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(particleColor);
            particle.fillCircle(0, 0, 3);
            
            const x = Phaser.Math.Between(100, 924);
            const y = Phaser.Math.Between(100, 500);
            particle.setPosition(x, y);
            
            // Animación de flotación
            this.tweens.add({
                targets: particle,
                y: y - 50,
                alpha: 0,
                duration: 3000,
                ease: 'Power2',
                delay: i * 100,
                repeat: -1,
                yoyo: true
            });
        }
    }

    calculateRank(score) {
        // Sistema de rangos basado en puntuación
        if (score >= 10000) return 'LEYENDA DE HIERRO';
        if (score >= 5000) return 'HÉROE SUPREMO';
        if (score >= 2000) return 'VENGADOR';
        if (score >= 1000) return 'DEFENSOR';
        if (score >= 500) return 'ROOKIE';
        return 'NOVATO';
    }

    restartGame() {
        console.log('🔄 Reiniciando juego...');
        
        // Reiniciar estado del juego manualmente
        if (this.game.globals && this.game.globals.resetGameState) {
            this.game.globals.resetGameState();
        } else {
            // Fallback manual
            GameUtils.resetGameState();
        }
        
        // Resetear puntuación específicamente
        if (gameState) {
            gameState.score = 0;
            gameState.coinsCollected = 0;
            gameState.currentLevel = 1;
            gameState.difficulty = 1;
            gameState.startTime = Date.now();
            gameState.gameTime = 0;
        }
        
        // Detener todas las escenas y reiniciar limpiamente
        this.scene.manager.stop('GameOverScene');
        this.scene.manager.start('GameScene');
    }

    goToMenu() {
        console.log('🏠 Volviendo al menú principal...');
        
        // Detener escena actual y ir al menú limpiamente
        this.scene.manager.stop('GameOverScene');
        this.scene.manager.start('MenuScene');
    }
}

console.log('📝 GameOverScene.js cargado'); 