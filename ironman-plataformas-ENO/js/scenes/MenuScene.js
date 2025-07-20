/**
 * MenuScene.js - Escena del Menú Principal
 * Iron Man vs Ultron - Fase 1
 */

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Crear elementos gráficos simples para la Fase 1
        this.createSimpleGraphics();
    }

    create() {
        console.log('🎮 MenuScene iniciada');

        // Fondo degradado
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Título del juego
        this.add.text(512, 150, 'IRON MAN vs ULTRON', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffd700',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Subtítulo
        this.add.text(512, 200, 'Juego de Plataformas', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Botón de jugar
        const playButton = this.add.text(512, 300, 'JUGAR', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#00ff00',
            stroke: '#000',
            strokeThickness: 3,
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Hacer el botón interactivo
        playButton.setInteractive({ useHandCursor: true });
        
        playButton.on('pointerover', () => {
            playButton.setStyle({ color: '#ffff00', backgroundColor: '#555555' });
        });
        
        playButton.on('pointerout', () => {
            playButton.setStyle({ color: '#00ff00', backgroundColor: '#333333' });
        });
        
        playButton.on('pointerdown', () => {
            this.startGame();
        });

        // Información de controles
        this.add.text(512, 400, 'CONTROLES:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.add.text(512, 430, 'WASD o Flechas - Movimiento', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 450, 'ESPACIO - Saltar', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 470, 'CLIC o X - Disparar', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 490, 'P - Pausa', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Información de versión
        this.add.text(10, 550, 'Fase 1 - v0.1.0', {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#888888'
        });

        // Controles de teclado
        this.input.keyboard.on('keydown-SPACE', () => {
            this.startGame();
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            this.startGame();
        });

        // Efecto de partículas simple
        this.createParticleEffect();
    }

    createSimpleGraphics() {
        // Crear gráficos simples usando las herramientas de Phaser
        // Esto será reemplazado por sprites reales en fases posteriores
        
        // Rectángulo para el jugador temporal
        this.add.graphics()
            .fillStyle(0xff0000)
            .fillRect(50, 50, 32, 32);
    }

    createParticleEffect() {
        try {
            // Crear textura de partícula simple
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffffff);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('particle', 8, 8);
            graphics.destroy();

            // Crear un efecto de partículas simple para dar vida al menú
            const particles = this.add.particles(0, 0, 'particle', {
                x: { min: 0, max: 1024 },
                y: { min: -50, max: -10 },
                scale: { start: 0.1, end: 0.3 },
                speed: { min: 20, max: 50 },
                lifespan: 8000,
                frequency: 200,
                alpha: { start: 0.8, end: 0 }
            });

            particles.start();
            console.log('✅ Efecto de partículas creado en menú');
        } catch (error) {
            console.log('⚠️ Partículas no disponibles en menú:', error);
        }
    }

    startGame() {
        try {
            console.log('🎮 Iniciando GameScene...');
            
            // Reiniciar estado del juego
            if (typeof GameUtils !== 'undefined') {
                GameUtils.resetGameState();
                console.log('✅ Estado del juego reiniciado');
            }
            
            // Cambiar a la escena del juego
            this.scene.start('GameScene');
            console.log('✅ Transición a GameScene iniciada');
        } catch (error) {
            console.error('❌ Error al iniciar GameScene:', error);
        }
    }
}

console.log('📝 MenuScene.js cargado'); 