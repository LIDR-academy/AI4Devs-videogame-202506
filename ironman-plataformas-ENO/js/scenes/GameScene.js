/**
 * GameScene.js - Escena Principal del Juego
 * Iron Man vs Ultron - Fase 2: Integración con Player mejorado
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Variables de la escena
        this.player = null;
        this.platforms = null;
        this.cursors = null;
        this.wasdKeys = null;
        this.spaceKey = null;
        this.shootKey = null;
        this.pauseKey = null;
        this.isPaused = false;
        
        // Enemigos y combate
        this.enemies = null;
        this.projectiles = null;
        this.coins = null;
        this.powerUps = null; // Nuevo grupo para power-ups
        this.score = 0;
        this.cursors = null;
        this.fireKey = null;
        this.backgroundManager = null;
        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 8000;
        this.maxEnemies = 3;
        
        // Power-ups
        this.powerUpSpawnTimer = 0;
        this.powerUpSpawnInterval = 15000; // 15 segundos
        this.activePowerUps = []; // Lista de power-ups activos
        
        // Sistema de audio
        this.audioManager = null;
        
        // Sistema de UI mejorada
        this.uiManager = null;
        
        // Sistema de guardado y logros
        this.saveManager = null;
        
        // Tiempo de juego
        this.gameTime = 0;
        
        // Sistema de niveles
        this.currentLevel = 1;
        this.difficulty = 1;
    }

    preload() {
        // Ya no necesitamos crear gráficos aquí, 
        // la clase Player se encarga de sus propios sprites
        console.log('🎮 GameScene - Cargando recursos...');
        
        // Crear textura de partícula simple para efectos
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
    }

    create() {
        console.log('🎮 Creando escena de juego...');
        
        try {
            // Resetear puntuación al iniciar nueva partida
            this.resetScore();
            
            // Crear fondo hermoso estilo Rayman Legends
            this.createBeautifulBackground();
            
            // Inicializar sistema de audio
            this.audioManager = new AudioManager();
            
            // Inicializar sistema de UI mejorada
            this.uiManager = new UIManager(this);
            
            // Inicializar sistema de guardado y logros
            this.saveManager = new SaveManager();
            
            // Crear grupos
            this.platforms = this.physics.add.staticGroup();
            this.enemies = this.physics.add.group();
            this.coins = this.physics.add.group();
            this.powerUps = this.physics.add.group(); // Nuevo grupo para power-ups
            this.particles = this.add.group();

            // Crear plataformas PRIMERO
            console.log('🏗️ Creando plataformas...');
            this.createThemedPlatforms();

            // Crear jugador SEGUNDO (sin añadirlo dos veces)
            console.log('🦸‍♂️ Creando Iron Man...');
            this.createPlayer();
            
            // Configurar mundo y límites
            console.log('🌍 Configurando mundo...');
            this.setupWorld();
            
            // Iniciar música de fondo (deshabilitada temporalmente)
            // if (this.audioManager) {
            //     this.audioManager.startBackgroundMusic();
            // }

            // Configurar colisiones
            console.log('🔗 Configurando colisiones...');
            this.setupCollisions();

            // Crear enemigos
            console.log('🤖 Creando enemigos...');
            this.spawnTestEnemy();

            // Crear monedas
            console.log('💰 Creando monedas...');
            this.createCoins();

            // Crear power-ups
            console.log('⚡ Creando power-ups...');
            this.createPowerUps();

            // Configurar controles
            console.log('🎮 Configurando controles...');
            this.setupControls();

            // Configurar efectos de partículas
            console.log('✨ Configurando efectos...');
            this.setupParticleEffects();

            // Configurar cámara ÚLTIMO
            console.log('📷 Configurando cámara...');
            this.cameras.main.setBounds(0, 0, 2048, 576);
            this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, 0.1);
            
            console.log('✅ GameScene creada correctamente');
        } catch (error) {
            console.error('❌ Error en create():', error);
            console.error('Stack trace:', error.stack);
        }
    }

    setupWorld() {
        // Configurar límites del mundo físico (más amplio para movimiento completo)
        this.physics.world.setBounds(0, 0, 2048, 576);
        
        // Configurar cámara para seguir al jugador (más amplio)
        this.cameras.main.setBounds(0, 0, 2048, 576);
        this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, 0.1);
        this.cameras.main.setZoom(1); // Asegurar zoom correcto
        
        console.log('🌍 Mundo configurado correctamente (2048px de ancho)');
    }

    createBeautifulBackground() {
        // Crear fondo hermoso estilo Rayman Legends con gradiente (más amplio)
        const graphics = this.add.graphics();
        
        // Gradiente de cielo (azul claro a azul medio)
        graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4682B4, 0x4682B4, 1);
        graphics.fillRect(0, 0, 2048, 576);
        
        // Añadir nubes decorativas
        this.createClouds();
        
        // Añadir montañas en el fondo
        this.createMountains();
        
        console.log('🎨 Fondo hermoso estilo Rayman Legends creado (2048px)');
    }

    createClouds() {
        // Crear nubes decorativas (distribuidas en todo el ancho de 2048px)
        const cloudPositions = [
            { x: 200, y: 100, scale: 0.8 },
            { x: 500, y: 80, scale: 1.2 },
            { x: 800, y: 120, scale: 0.9 },
            { x: 1100, y: 90, scale: 1.1 },
            { x: 1400, y: 110, scale: 0.7 },
            { x: 1700, y: 95, scale: 1.0 },
            { x: 2000, y: 105, scale: 0.8 }
        ];
        
        cloudPositions.forEach((pos, index) => {
            const cloud = this.add.graphics();
            cloud.fillStyle(0xFFFFFF, 0.8);
            cloud.fillEllipse(0, 0, 80, 40);
            cloud.fillEllipse(20, -10, 60, 30);
            cloud.fillEllipse(-20, -5, 50, 25);
            cloud.setPosition(pos.x, pos.y);
            cloud.setScale(pos.scale);
            
            // Animación suave de las nubes
            this.tweens.add({
                targets: cloud,
                x: pos.x + 100,
                duration: 15000 + Math.random() * 5000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });
    }

    createMountains() {
        // Crear montañas en el fondo (cubriendo todo el ancho de 2048px)
        const mountainGraphics = this.add.graphics();
        mountainGraphics.fillStyle(0x2F4F4F, 0.6); // Gris pizarra semi-transparente
        
        // Montaña 1 (0-400)
        mountainGraphics.fillTriangle(0, 576, 400, 576, 200, 300);
        mountainGraphics.fillTriangle(200, 576, 600, 576, 400, 250);
        
        // Montaña 2 (600-1000)
        mountainGraphics.fillTriangle(600, 576, 1000, 576, 800, 280);
        mountainGraphics.fillTriangle(800, 576, 1200, 576, 1000, 320);
        
        // Montaña 3 (1200-1600)
        mountainGraphics.fillTriangle(1200, 576, 1600, 576, 1400, 290);
        mountainGraphics.fillTriangle(1400, 576, 1800, 576, 1600, 310);
        
        // Montaña 4 (1800-2048)
        mountainGraphics.fillTriangle(1800, 576, 2048, 576, 1924, 295);
    }



    createPlatforms() {
        // Crear grupo principal de plataformas (para compatibilidad)
        this.platforms = this.physics.add.staticGroup();
        
        // Suelo principal básico (mantener para física)
        const ground = this.physics.add.staticGroup();
        for (let x = 0; x < 2048; x += 64) {
            const groundPiece = this.add.rectangle(x + 32, 544, 64, 32, 0x8B4513);
            this.physics.add.existing(groundPiece, true);
            ground.add(groundPiece);
            this.platforms.add(groundPiece);
        }
        
        // Crear plataformas temáticas con el nuevo sistema
        this.createThemedPlatforms();
        
        // Añadir elementos decorativos
        this.createDecorativeElements();
    }



    createPlayer() {
        // Crear el jugador usando la nueva clase Player
        this.player = new Player(this, 100, 450);
        
        console.log('✅ Jugador Iron Man creado con la nueva clase');
    }
    
    createEnemySystem() {
        // Crear grupo de enemigos (sin proyectiles enemigos)
        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });
        
        // Spawn inicial de enemigos para testing
        this.spawnTestEnemy();
        
        console.log('✅ Sistema de enemigos Ultron creado (versión simplificada)');
    }
    
    spawnTestEnemy() {
        // Crear 6 enemigos distribuidos por todo el mapa (2048px)
        const enemyPositions = [
            { x: 200, y: 400 },   // Enemigo 1: Suelo izquierda
            { x: 600, y: 300 },   // Enemigo 2: Plataforma central
            { x: 1000, y: 400 },  // Enemigo 3: Suelo derecha
            { x: 1400, y: 250 },  // Enemigo 4: Plataforma alta
            { x: 1800, y: 400 },  // Enemigo 5: Suelo derecha
            { x: 400, y: 200 }    // Enemigo 6: Plataforma alta izquierda
        ];
        
        enemyPositions.forEach((pos, index) => {
            try {
                // Crear enemigo usando la clase Enemy
                const enemy = new Enemy(this, pos.x, pos.y);
                this.enemies.add(enemy);
                console.log(`🤖 Enemigo #${index + 1} creado en (${pos.x}, ${pos.y}) - ${pos.y < 350 ? 'Plataforma' : 'Suelo'}`);
            } catch (error) {
                console.warn(`⚠️ Error creando enemigo #${index + 1}:`, error);
            }
        });
        
        console.log(`✅ ${enemyPositions.length} enemigos creados para testing (distribuidos por todo el mapa)`);
    }
    
    spawnInitialEnemies() {
        // Posiciones de spawn iniciales
        const spawnPositions = [
            { x: 600, y: 400 },
            { x: 1000, y: 300 },
            { x: 1400, y: 450 }
        ];
        
        spawnPositions.forEach(pos => {
            this.spawnEnemy(pos.x, pos.y);
        });
    }
    
    spawnEnemy(x, y) {
        if (this.enemies.children.size >= this.maxEnemies) {
            return null;
        }
        
        const enemy = new Enemy(this, x, y);
        this.enemies.add(enemy);
        
        console.log('🤖 Nuevo Ultron spawneado en:', x, y);
        return enemy;
    }
    
    spawnEnemyAtRandomPosition() {
        // Spawn en posiciones alejadas del jugador
        const playerX = this.player ? this.player.x : 500;
        let spawnX;
        
        // Spawn a la izquierda o derecha del jugador (lejos)
        if (Math.random() > 0.5) {
            spawnX = playerX + 300 + Math.random() * 200;
        } else {
            spawnX = playerX - 300 - Math.random() * 200;
        }
        
        // Asegurar que esté dentro de los límites del mundo
        spawnX = Phaser.Math.Clamp(spawnX, 100, 1900);
        
        // Spawn en una plataforma
        const spawnY = 300 + Math.random() * 100;
        
        return this.spawnEnemy(spawnX, spawnY);
    }

    setupControls() {
        // Configurar controles de cursor
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Configurar teclas WASD
        this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
        
        // Configurar otras teclas
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.configKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C); // Configuración
        
        console.log('🎮 Controles configurados');
        console.log('📋 Controles disponibles:');
        console.log('   - Movimiento: Flechas o WASD');
        console.log('   - Salto: W, ↑, o Espacio');
        console.log('   - Disparar: X o Click');
        console.log('   - Pausa: P');
        console.log('   - Configuración: C');
        
        // Configurar controles de disparo con mouse
        this.input.on('pointerdown', (pointer) => {
            if (!this.isPaused && this.player && this.player.isAlive()) {
                this.player.shoot();
            }
        });
    }






    
    gameOver() {
        console.log('💀 Game Over - Iron Man ha sido derrotado');
        
        // Guardar puntuación final
        if (this.saveManager) {
            const gameTime = this.gameTime || 0;
            const enemiesKilled = 0; // TODO: Implementar contador de enemigos eliminados
            const coinsCollected = 0; // TODO: Implementar contador de monedas recolectadas
            
            this.saveManager.addHighScore(this.score, gameTime, enemiesKilled, coinsCollected);
            this.saveManager.addGamePlayed();
        }
        
        // Cambiar a la escena de Game Over
        this.scene.start('GameOverScene', { 
            score: this.score,
            level: this.currentLevel || 1,
            victory: false
        });
    }

    setupCollisions() {
        // Colisión jugador-plataformas (RESTAURADO - usar getSprite())
        this.physics.add.collider(this.player.getSprite(), this.platforms);
        
        // Colisión enemigos-plataformas
        this.physics.add.collider(this.enemies, this.platforms);
        
        // Colisión láseres jugador-plataformas (CORREGIDO - usar getLasers())
        this.physics.add.collider(this.player.getLasers(), this.platforms, (laser) => {
            laser.destroy();
        });
        
        // Colisión láseres jugador-enemigos (CORREGIDO - usar getLasers())
        this.physics.add.overlap(this.player.getLasers(), this.enemies, this.onPlayerLaserHitEnemy, null, this);
        
        // Colisión jugador-enemigos (daño al jugador) - DAÑO AUMENTADO
        this.physics.add.overlap(this.player.getSprite(), this.enemies, (playerSprite, enemy) => {
            if (!this.player.isInvulnerable) {
                // Crear efecto de daño
                this.createDamageEffect(playerSprite.x, playerSprite.y);
                
                // Aplicar daño y verificar si pierde vida
                const lostLife = this.player.takeDamage(50); // Daño aumentado de 1 a 50
                
                console.log(`💔 Iron Man recibe daño! Salud: ${this.player.health}/100, Vidas: ${this.player.lives}/3`);
                
                // Si perdió la vida, manejar el sistema de vidas
                if (lostLife) {
                    const gameOver = this.player.loseLife();
                    if (gameOver) {
                        this.gameOver();
                    }
                }
            }
        });
        
        // Colisión jugador-monedas con efectos visuales
        this.physics.add.overlap(this.player.getSprite(), this.coins, (playerSprite, coin) => {
            // Crear efecto de partículas
            this.createCoinEffect(coin.x, coin.y);
            
            // Destruir la moneda
            coin.destroy();
            
            // Añadir puntos directamente a this.score
            this.score += 10;
            
            // Actualizar gameState global
            if (typeof gameState !== 'undefined') {
                gameState.score = this.score;
                gameState.coinsCollected++;
            }
            
            // Actualizar SaveManager
            if (this.saveManager) {
                this.saveManager.addCoinCollected();
            }
            
            console.log('💰 Moneda recolectada! +10 puntos. Total: ' + this.score);
            
            // Verificar si se recolectaron todas las monedas
            this.checkLevelCompletion();
        });

        // Colisión jugador-power-ups
        this.physics.add.overlap(this.player.getSprite(), this.powerUps, (playerSprite, powerUp) => {
            // Aplicar efecto del power-up
            if (powerUp.applyEffect(this.player)) {
                // Crear efecto de partículas
                this.createPowerUpEffect(powerUp.x, powerUp.y, powerUp.type);
                
                // Destruir el power-up
                powerUp.destroy();
                
                // Añadir a la lista de power-ups activos
                this.activePowerUps.push({
                    type: powerUp.type,
                    duration: powerUp.duration,
                    timer: powerUp.duration
                });
                
                console.log(`⚡ Power-up ${powerUp.type} recolectado!`);
            }
        });

        // Colisión entre monedas y plataformas
        this.physics.add.collider(this.coins, this.platforms);
        
        // Colisión entre power-ups y plataformas
        this.physics.add.collider(this.powerUps, this.platforms);
    }

    update() {
        // Verificar controles de configuración (siempre activos)
        if (Phaser.Input.Keyboard.JustDown(this.configKey)) {
            if (this.uiManager) {
                this.uiManager.toggleConfig();
            }
        }
        
        // Verificar pausa (siempre activo)
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.togglePause();
        }
        
        // Si está pausado, no actualizar el resto del juego
        if (this.isPaused) return;
        
        // Actualizar tiempo de juego
        this.gameTime += 16; // Aproximadamente 60 FPS
        
        // Actualizar tiempo en SaveManager
        if (this.saveManager) {
            this.saveManager.addPlayTime(16);
        }
        
        // Actualizar el jugador
        if (this.player && this.player.isAlive()) {
            this.player.update();
        }
        
        // Actualizar sistema de enemigos
        this.updateEnemySystem();
        
        // Actualizar power-ups
        this.updatePowerUps();
        
        // Actualizar interfaz
        this.updateUI();
        
        // Verificar condiciones de muerte temporal para testing
        this.checkTestConditions();
    }

    updateUI() {
        if (this.uiManager && this.player) {
            // Actualizar UI usando UIManager
            this.uiManager.updateHealth(this.player.health, this.player.maxHealth);
            this.uiManager.updateLives(this.player.lives, this.player.maxLives);
            this.uiManager.updateScore(this.score);
            
            // Actualizar nivel dinámicamente
            const currentLevel = this.currentLevel || 1;
            this.uiManager.updateLevel(currentLevel);
            
            // Actualizar power-ups activos
            this.activePowerUps.forEach((powerUp) => {
                this.uiManager.updatePowerUp(powerUp.type, true, powerUp.timer);
                this.uiManager.updatePowerUpTimer(powerUp.type, powerUp.timer, powerUp.duration);
            });
            
            // Actualizar estadísticas generales
            this.uiManager.update();
        }
    }

    checkTestConditions() {
        // Condiciones temporales para testing de la escena GameOver
        if (this.player && this.player.isAlive()) {
            const sprite = this.player.getSprite();
            
            // Si el jugador cae fuera del mundo, recibir daño
            if (sprite.y > this.physics.world.bounds.height) {
                console.log('💀 Iron Man cayó al vacío');
                // Aplicar daño letal y manejar pérdida de vida
                const lostLife = this.player.takeDamage(100);
                if (lostLife) {
                    const gameOver = this.player.loseLife();
                    if (gameOver) {
                        this.gameOver();
                    }
                }
            }
            
            // Testing: presionar ESC para simular muerte (temporal)
            if (this.input.keyboard.addKey('ESC').isDown) {
                console.log('🧪 Test: Simulando muerte de Iron Man');
                // Aplicar daño suficiente para matar al jugador
                const lostLife = this.player.takeDamage(100);
                if (lostLife) {
                    const gameOver = this.player.loseLife();
                    if (gameOver) {
                        this.gameOver();
                    }
                }
            }
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.physics.pause();
            
            // Pausar los tweens del jugador si existen
            this.tweens.pauseAll();
            
            // Crear texto de pausa y guardarlo como propiedad
            this.pauseText = this.add.text(512, 288, 'PAUSADO', {
                fontSize: '48px',
                fontFamily: 'Arial',
                color: '#FFFF00',
                stroke: '#000000',
                strokeThickness: 4,
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setScrollFactor(0);
            
            this.pauseSubtext = this.add.text(512, 340, 'Presiona P para continuar', {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 2,
                backgroundColor: '#000000',
                padding: { x: 15, y: 5 }
            }).setOrigin(0.5).setScrollFactor(0);
            
            console.log('⏸️ Juego pausado');
            
        } else {
            this.physics.resume();
            this.tweens.resumeAll();
            
            // Destruir textos de pausa usando las propiedades guardadas
            if (this.pauseText) {
                this.pauseText.destroy();
                this.pauseText = null;
            }
            if (this.pauseSubtext) {
                this.pauseSubtext.destroy();
                this.pauseSubtext = null;
            }
            
            console.log('▶️ Juego reanudado');
        }
    }

    createThemedPlatforms() {
        // PRIMERO: Crear el suelo principal (base sólida) con color hermoso estilo Rayman
        console.log('🏗️ Creando suelo principal...');
        for (let x = 0; x < 2048; x += 64) {
            const groundPiece = this.add.rectangle(x + 32, 544, 64, 32, 0x8B4513); // Marrón tierra hermoso
            this.physics.add.existing(groundPiece, true);
            this.platforms.add(groundPiece);
        }
        console.log('✅ Suelo principal creado (2048px de ancho)');

        // SEGUNDO: Crear plataformas flotantes con colores hermosos estilo Rayman Legends
        const platformPositions = [
            { x: 300, y: 450, width: 128, color: 0x228B22 },  // Verde bosque
            { x: 600, y: 350, width: 128, color: 0x228B22 }, // Verde bosque
            { x: 900, y: 350, width: 128, color: 0x32CD32 },  // Verde lima
            { x: 1200, y: 450, width: 128, color: 0x32CD32 }, // Verde lima
            { x: 1500, y: 250, width: 192, color: 0x4169E1 },  // Azul real
            { x: 1800, y: 300, width: 192, color: 0x4169E1 }, // Azul real
            { x: 400, y: 250, width: 128, color: 0x9370DB },  // Púrpura medio
            { x: 700, y: 200, width: 128, color: 0x9370DB },  // Púrpura medio
            { x: 1100, y: 200, width: 128, color: 0x228B22 }, // Verde bosque
            { x: 1400, y: 150, width: 128, color: 0x32CD32 }, // Verde lima
            { x: 1700, y: 200, width: 128, color: 0x4169E1 }  // Azul real
        ];

        platformPositions.forEach((pos, index) => {
            const platform = this.add.rectangle(pos.x, pos.y, pos.width, 32, pos.color);
            this.physics.add.existing(platform, true);
            this.platforms.add(platform);
            console.log(`✅ Plataforma #${index + 1} creada en (${pos.x}, ${pos.y})`);
        });

        console.log('✅ Todas las plataformas temáticas creadas correctamente');
    }
    

    
    createDecorativeElements() {
        // Elementos decorativos estilo Rayman Legends
        // Temporalmente deshabilitados para debuggear
        console.log('🎭 Elementos decorativos deshabilitados temporalmente');
        
        // TODO: Reactivar cuando se resuelva el problema con Graphics
        // this.platformManager.createDecorativePlatform(400, 380, 'vine');
        // this.platformManager.createDecorativePlatform(800, 180, 'crystal');
        // this.platformManager.createDecorativePlatform(1300, 230, 'tech-panel');
        // this.platformManager.createDecorativePlatform(600, 180, 'crystal');
        // this.platformManager.createDecorativePlatform(1500, 130, 'vine');
    }

    updateEnemySystem() {
        // Actualizar enemigos manualmente, filtrando los muertos
        this.enemies.children.entries.forEach(enemy => {
            if (enemy && enemy.isAlive && enemy.update) {
                enemy.update(this.time.now, this.game.loop.delta);
            }
        });
        
        // Limpiar enemigos muertos del grupo
        this.enemies.children.entries.forEach(enemy => {
            if (enemy && !enemy.isAlive && enemy.active) {
                this.enemies.remove(enemy);
            }
        });
        
        // Spawn automático DESHABILITADO - Solo 4 enemigos iniciales
        // Los enemigos no se reponen automáticamente
    }

    updatePowerUps() {
        // Actualizar power-ups activos
        for (let i = this.activePowerUps.length - 1; i >= 0; i--) {
            const powerUp = this.activePowerUps[i];
            powerUp.timer -= this.game.loop.delta;
            
            if (powerUp.timer <= 0) {
                // Power-up expirado
                console.log(`⚡ Power-up ${powerUp.type} expirado`);
                
                // Remover de la lista de activos
                this.activePowerUps.splice(i, 1);
                
                // Actualizar UI para remover el indicador
                if (this.uiManager) {
                    this.uiManager.updatePowerUp(powerUp.type, false, 0);
                }
            }
        }
        
        // Actualizar power-ups físicos
        this.powerUps.children.entries.forEach(powerUp => {
            if (powerUp && powerUp.update) {
                powerUp.update(this.time.now, this.game.loop.delta);
            }
        });
        
        // Spawn automático de power-ups
        this.powerUpSpawnTimer += this.game.loop.delta;
        if (this.powerUpSpawnTimer >= this.powerUpSpawnInterval) {
            this.spawnRandomPowerUp();
            this.powerUpSpawnTimer = 0;
        }
    }

    spawnRandomPowerUp() {
        const types = ['shield', 'speed', 'damage', 'jetpack'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        // Posición aleatoria en todo el mundo (2048px de ancho)
        const x = Phaser.Math.Between(200, 1848);
        const y = Phaser.Math.Between(100, 400);
        
        try {
            const powerUp = new PowerUp(this, x, y, randomType);
            this.powerUps.add(powerUp);
            console.log(`⚡ Power-up ${randomType} spawneado en (${x}, ${y})`);
        } catch (error) {
            console.warn('⚠️ Error spawneando power-up:', error);
        }
    }
    
    spawnEnemyAtRandomPosition() {
        // Spawn en posiciones alejadas del jugador
        const playerX = this.player ? this.player.x : 500;
        let spawnX;
        
        // Spawn a la izquierda o derecha del jugador (lejos)
        if (Math.random() > 0.5) {
            spawnX = playerX + 400 + Math.random() * 200;
        } else {
            spawnX = playerX - 400 - Math.random() * 200;
        }
        
        // Asegurar que esté dentro de los límites del mundo
        spawnX = Phaser.Math.Clamp(spawnX, 100, 1900);
        
        // Spawn en una plataforma
        let spawnY = 250 + Math.random() * 200;
        
        // Verificar que las coordenadas sean válidas
        if (isNaN(spawnX) || isNaN(spawnY)) {
            console.warn('⚠️ Coordenadas de spawn inválidas, usando valores por defecto');
            spawnX = 500 + Math.random() * 400;
            spawnY = 300 + Math.random() * 100;
        }
        
        const enemy = new Enemy(this, spawnX, spawnY);
        this.enemies.add(enemy);
        
        console.log('🤖 Nuevo Ultron spawneado en:', spawnX, spawnY);
        return enemy;
    }
    
    // Método de colisión láser vs enemigo
    onPlayerLaserHitEnemy(laser, enemy) {
        console.log('🎯 Colisión detectada: Láser vs Enemigo');
        
        // Verificar que el láser y enemigo sean válidos
        if (!laser || !enemy) {
            console.warn('⚠️ Láser o enemigo inválido');
            return;
        }
        
        if (!enemy.isAlive) {
            console.log('⚠️ Enemigo ya está muerto');
            return;
        }
        
        // Verificar que el láser no haya sido procesado ya
        if (laser.getData('processed')) {
            console.log('⚠️ Láser ya procesado');
            return;
        }
        
        console.log(`💥 Láser impacta a Ultron #${enemy.enemyId}`);
        
        // Marcar el láser como procesado para evitar colisiones múltiples
        laser.setData('processed', true);
        
        // Destruir el láser completamente
        laser.destroy();
        
        // Dañar al enemigo
        if (enemy.takeDamage) {
            // Obtener daño del láser (1 por defecto, 2 si tiene power-up de daño)
            const damage = laser.getData('damage') || 1;
            const enemyKilled = enemy.takeDamage(damage);
            
            // Si el enemigo murió, añadir puntos directamente a this.score
            if (enemyKilled) {
                // Crear efecto de explosión
                this.createExplosionEffect(enemy.x, enemy.y);
                
                // Añadir puntos directamente a this.score
                this.score += 100;
                
                // Actualizar SaveManager
                if (this.saveManager) {
                    this.saveManager.addEnemyKilled();
                }
                
                console.log(`🎯 +100 puntos por destruir Ultron #${enemy.enemyId} (daño: ${damage}). Total: ${this.score}`);
            }
        }
        
        console.log('✅ Colisión láser-enemigo procesada correctamente');
    }
    
    // Colisión proyectil enemigo vs jugador
    onEnemyProjectileHitPlayer(projectile, playerSprite) {
        // Destruir el proyectil
        projectile.destroy();
        
        // Dañar al jugador
        if (this.player && this.player.takeDamage) {
            this.player.takeDamage(1);
        }
        
        console.log('💥 Proyectil enemigo impacta a Iron Man');
    }
    
    // Proyectil enemigo vs plataforma
    onEnemyProjectileHitPlatform(projectile, platform) {
        projectile.destroy();
    }
    
    // Métodos de colisión (temporalmente comentados para debugging)
    /*
    onPlayerProjectileHitEnemy(projectile, enemy) {
        if (projectile.getData('isPlayerProjectile')) {
            projectile.destroy();
            
            if (enemy.takeDamage) {
                enemy.takeDamage(1);
            }
            
            console.log('💥 Proyectil del jugador impacta enemigo');
        }
    }
    
    onEnemyProjectileHitPlayer(projectile, playerSprite) {
        if (projectile.getData('isEnemyProjectile')) {
            projectile.destroy();
            
            if (this.player && this.player.takeDamage) {
                this.player.takeDamage(1);
            }
            
            console.log('💥 Proyectil enemigo impacta al jugador');
        }
    }
    
    onPlayerTouchEnemy(playerSprite, enemy) {
        // Colisión directa entre jugador y enemigo
        if (this.player && this.player.takeDamage && enemy.isAlive) {
            this.player.takeDamage(1);
            
            // Empujar al jugador
            const direction = playerSprite.x > enemy.x ? 1 : -1;
            playerSprite.setVelocity(direction * 150, -100);
            
            console.log('💥 Iron Man toca enemigo Ultron');
        }
    }
    
    onProjectileHitPlatform(projectile, platform) {
        // Destruir proyectiles que tocan plataformas
        if (projectile.getData('isEnemyProjectile')) {
            projectile.destroy();
        }
    }
    */

    // Método para obtener referencia al jugador (para futuras fases)
    getPlayer() {
        return this.player;
    }

    setupParticleEffects() {
        // Configurar emisores de partículas
        this.explosionEmitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 100, max: 300 },
            scale: { start: 0.5, end: 0 },
            lifespan: 1000,
            quantity: 15,
            blendMode: 'ADD',
            tint: [0xff0000, 0xff6600, 0xffff00]
        });
        this.explosionEmitter.stop();

        this.damageEmitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.3, end: 0 },
            lifespan: 500,
            quantity: 8,
            blendMode: 'ADD',
            tint: [0xff0000, 0xff4444]
        });
        this.damageEmitter.stop();

        this.coinEmitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 30, max: 80 },
            scale: { start: 0.4, end: 0 },
            lifespan: 800,
            quantity: 5,
            blendMode: 'ADD',
            tint: [0xffff00, 0xffdd00, 0xffaa00]
        });
        this.coinEmitter.stop();
    }

    createExplosionEffect(x, y) {
        // Crear efecto de explosión con partículas
        const explosionEmitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 100, max: 300 },
            scale: { start: 1, end: 0 },
            lifespan: 800,
            quantity: 15,
            blendMode: 'ADD',
            tint: [0xFF0000, 0xFF6600, 0xFFFF00]
        });
        
        explosionEmitter.setPosition(x, y);
        explosionEmitter.explode();
        
        // Reproducir sonido de explosión
        if (this.audioManager) {
            this.audioManager.playExplosionSound();
        }
        
        // Destruir el emisor después del efecto
        this.time.delayedCall(800, () => {
            explosionEmitter.destroy();
        });
    }

    createDamageEffect(x, y) {
        // Crear efecto de daño con partículas
        const damageEmitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            lifespan: 500,
            quantity: 8,
            blendMode: 'ADD',
            tint: [0xFF0000, 0xFF4444]
        });
        
        damageEmitter.setPosition(x, y);
        damageEmitter.explode();
        
        // Reproducir sonido de daño
        if (this.audioManager) {
            this.audioManager.playDamageSound();
        }
        
        // Destruir el emisor después del efecto
        this.time.delayedCall(500, () => {
            damageEmitter.destroy();
        });
    }

    createCoinEffect(x, y) {
        // Crear efecto de moneda con partículas
        const coinEmitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 30, max: 80 },
            scale: { start: 0.4, end: 0 },
            lifespan: 600,
            quantity: 6,
            blendMode: 'ADD',
            tint: [0xFFFF00, 0xFFD700, 0xFFA500]
        });
        
        coinEmitter.setPosition(x, y);
        coinEmitter.explode();
        
        // Reproducir sonido de moneda
        if (this.audioManager) {
            this.audioManager.playCoinSound();
        }
        
        // Destruir el emisor después del efecto
        this.time.delayedCall(600, () => {
            coinEmitter.destroy();
        });
    }

    createPowerUpEffect(x, y, type) {
        // Crear efecto específico según el tipo de power-up
        const colors = {
            shield: [0x00BFFF, 0x87CEEB, 0xFFFFFF],
            speed: [0xFF8C00, 0xFFD700, 0xFFFFFF],
            damage: [0xFF0000, 0xFF4444, 0xFFFF00],
            jetpack: [0x32CD32, 0x90EE90, 0x00FF00]
        };
        
        const powerUpEmitter = this.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.6, end: 0 },
            lifespan: 1000,
            quantity: 10,
            blendMode: 'ADD',
            tint: colors[type] || [0xFFFFFF, 0xFFFF00, 0xFF0000]
        });
        
        powerUpEmitter.setPosition(x, y);
        powerUpEmitter.explode();
        
        // Reproducir sonido de power-up
        if (this.audioManager) {
            this.audioManager.playPowerUpSound(type);
        }
        
        // Destruir el emisor después del efecto
        this.time.delayedCall(1000, () => {
            powerUpEmitter.destroy();
        });
    }

    createCoins() {
        try {
            // Crear monedas distribuidas por todo el mapa (2048px)
            const coinPositions = [
                { x: 400, y: 400 },
                { x: 800, y: 300 },
                { x: 1200, y: 400 },
                { x: 1600, y: 150 },
                { x: 600, y: 200 },
                { x: 1000, y: 150 },
                { x: 1400, y: 300 },
                { x: 1800, y: 200 },
                { x: 300, y: 300 },
                { x: 2000, y: 350 }
            ];

            coinPositions.forEach((pos, index) => {
                try {
                    // Crear moneda como un círculo dorado
                    const coin = this.add.circle(pos.x, pos.y, 12, 0xffff00);
                    this.physics.add.existing(coin);
                    coin.body.setBounce(0.8);
                    coin.body.setCollideWorldBounds(true);
                    coin.body.setVelocityX(Phaser.Math.Between(-50, 50));
                    this.coins.add(coin);
                    console.log(`✅ Moneda ${index + 1} creada en (${pos.x}, ${pos.y})`);
                } catch (error) {
                    console.warn(`⚠️ Error creando moneda ${index + 1}:`, error);
                }
            });

            console.log('✅ Monedas creadas correctamente (distribuidas por todo el mapa)');
        } catch (error) {
            console.error('❌ Error en createCoins:', error);
        }
    }

    createPowerUps() {
        try {
            // Crear power-ups distribuidos por todo el mapa (2048px)
            const powerUpTypes = ['shield', 'speed', 'damage', 'jetpack'];
            const powerUpPositions = [
                { x: 450, y: 350 },
                { x: 900, y: 250 },
                { x: 1300, y: 350 },
                { x: 750, y: 150 },
                { x: 1500, y: 200 },
                { x: 1800, y: 300 }
            ];

            powerUpPositions.forEach((pos, index) => {
                try {
                    const type = powerUpTypes[index % powerUpTypes.length];
                    const powerUp = new PowerUp(this, pos.x, pos.y, type);
                    this.powerUps.add(powerUp);
                    console.log(`⚡ Power-up ${type} creado en (${pos.x}, ${pos.y})`);
                } catch (error) {
                    console.warn(`⚠️ Error creando power-up ${index + 1}:`, error);
                }
            });

            console.log('✅ Power-ups creados correctamente (distribuidos por todo el mapa)');
        } catch (error) {
            console.error('❌ Error en createPowerUps:', error);
        }
    }





    onCoinCollected(coin) {
        // Añadir puntuación
        this.score += 10;
        
        // Actualizar SaveManager
        if (this.saveManager) {
            this.saveManager.addCoinCollected();
        }
        
        // Crear efecto de moneda
        this.createCoinEffect(coin.x, coin.y);
        
        // Reproducir sonido de moneda
        if (this.audioManager) {
            this.audioManager.playCoinSound();
        }
        
        console.log(`💰 Moneda recolectada! Puntuación: ${this.score}`);
    }

    onPowerUpCollected(powerUp) {
        // Añadir puntuación
        this.score += 50;
        
        // Actualizar SaveManager
        if (this.saveManager) {
            this.saveManager.addPowerUpUsed(powerUp.type);
        }
        
        // Crear efecto de power-up
        this.createPowerUpEffect(powerUp.x, powerUp.y, powerUp.type);
        
        // Reproducir sonido de power-up
        if (this.audioManager) {
            this.audioManager.playPowerUpSound(powerUp.type);
        }
        
        // Aplicar efecto al jugador
        if (this.player && powerUp.applyEffect) {
            const applied = powerUp.applyEffect(this.player);
            if (applied) {
                // Añadir a la lista de power-ups activos
                this.activePowerUps.push({
                    type: powerUp.type,
                    timer: powerUp.duration,
                    duration: powerUp.duration
                });
                console.log(`⚡ Power-up ${powerUp.type} añadido a activos. Duración: ${powerUp.duration/1000}s`);
            }
        }
        
        console.log(`⚡ Power-up ${powerUp.type} recolectado! Puntuación: ${this.score}`);
    }

    checkLevelCompletion() {
        // Verificar si se recolectaron todas las monedas
        if (this.coins.children.size === 0) {
            console.log('🎉 ¡Nivel completado! Todas las monedas recolectadas');
            
            // Mostrar mensaje de nivel completado
            this.showLevelCompleteMessage();
            
            // Cambiar al siguiente nivel después de 3 segundos
            this.time.delayedCall(3000, () => {
                this.nextLevel();
            });
        }
    }

    showLevelCompleteMessage() {
        // Crear mensaje de nivel completado
        const levelCompleteText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            '¡NIVEL COMPLETADO!',
            {
                fontSize: '48px',
                fontFamily: 'Arial',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 4,
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000000',
                    blur: 4,
                    fill: true
                }
            }
        );
        levelCompleteText.setOrigin(0.5);
        levelCompleteText.setScrollFactor(0);

        // Efecto de escala
        this.tweens.add({
            targets: levelCompleteText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 2
        });

        // Destruir el texto después de 3 segundos
        this.time.delayedCall(3000, () => {
            levelCompleteText.destroy();
        });

        // Reproducir sonido de victoria
        if (this.audioManager) {
            this.audioManager.playCoinSound(); // Usar sonido de moneda como victoria temporal
        }
    }

    nextLevel() {
        // Incrementar nivel
        this.currentLevel = (this.currentLevel || 1) + 1;
        this.difficulty = (this.difficulty || 1) + 0.5;
        
        console.log(`🚀 Cambiando al Nivel ${this.currentLevel} (Dificultad: ${this.difficulty})`);
        
        // Limpiar elementos del nivel actual
        this.cleanupCurrentLevel();
        
        // Generar nuevo nivel con mayor dificultad
        this.generateNewLevel();
        
        // Actualizar UI
        if (this.uiManager) {
            this.uiManager.updateLevel(this.currentLevel);
        }
    }

    cleanupCurrentLevel() {
        // Limpiar enemigos
        this.enemies.clear(true, true);
        
        // Limpiar power-ups
        this.powerUps.clear(true, true);
        
        // Limpiar partículas
        this.particles.clear(true, true);
        
        // Reposicionar jugador al inicio
        this.player.getSprite().setPosition(100, 300);
        
        console.log('🧹 Nivel anterior limpiado');
    }

    generateNewLevel() {
        console.log(`🏗️ Generando Nivel ${this.currentLevel} con dificultad ${this.difficulty}`);
        
        // Crear nuevas plataformas según la dificultad
        this.createLevelPlatforms();
        
        // Crear nuevos enemigos con mayor dificultad
        this.createLevelEnemies();
        
        // Crear nuevas monedas
        this.createLevelCoins();
        
        // Crear nuevos power-ups
        this.createLevelPowerUps();
        
        console.log(`✅ Nivel ${this.currentLevel} generado exitosamente`);
    }

    createLevelPlatforms() {
        // Limpiar plataformas existentes (excepto el suelo)
        this.platforms.children.entries.forEach(platform => {
            if (platform.y < 544) { // No eliminar el suelo
                platform.destroy();
            }
        });

        // Generar plataformas según el nivel
        const platformCount = Math.min(8 + this.currentLevel, 15); // Máximo 15 plataformas
        const platformPositions = this.generatePlatformPositions(platformCount);
        
        platformPositions.forEach((pos, index) => {
            const platform = this.add.rectangle(pos.x, pos.y, pos.width, 32, pos.color);
            this.physics.add.existing(platform, true);
            this.platforms.add(platform);
            console.log(`✅ Plataforma de nivel ${index + 1} creada en (${pos.x}, ${pos.y})`);
        });
    }

    generatePlatformPositions(count) {
        const positions = [];
        const colors = [0x0066cc, 0x228b22, 0x9932cc, 0x8b4513, 0xff4500];
        
        for (let i = 0; i < count; i++) {
            const x = 200 + (i * 150) + Math.random() * 100;
            const y = 200 + Math.random() * 300; // Entre 200 y 500
            const width = 96 + Math.random() * 96; // Entre 96 y 192
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            positions.push({ x, y, width, color });
        }
        
        return positions;
    }

    createLevelEnemies() {
        // Crear enemigos según la dificultad
        const enemyCount = Math.min(4 + this.currentLevel, 12); // Máximo 12 enemigos
        
        for (let i = 0; i < enemyCount; i++) {
            const x = 300 + (i * 200) + Math.random() * 100;
            const y = 400 + Math.random() * 100;
            this.spawnEnemy(x, y);
        }
        
        console.log(`🤖 ${enemyCount} enemigos creados para el nivel ${this.currentLevel}`);
    }

    createLevelCoins() {
        // Crear monedas según el nivel
        const coinCount = Math.min(8 + this.currentLevel, 15); // Máximo 15 monedas
        
        for (let i = 0; i < coinCount; i++) {
            const x = 200 + (i * 150) + Math.random() * 100;
            const y = 150 + Math.random() * 350;
            
            const coin = this.add.circle(x, y, 12, 0xffff00);
            this.physics.add.existing(coin);
            coin.body.setBounce(0.8);
            coin.body.setCollideWorldBounds(true);
            coin.body.setVelocityX(Phaser.Math.Between(-50, 50));
            this.coins.add(coin);
        }
        
        console.log(`💰 ${coinCount} monedas creadas para el nivel ${this.currentLevel}`);
    }

    createLevelPowerUps() {
        // Crear power-ups según el nivel
        const powerUpCount = Math.min(3 + Math.floor(this.currentLevel / 2), 8); // Máximo 8 power-ups
        const powerUpTypes = ['shield', 'speed', 'damage', 'jetpack'];
        
        for (let i = 0; i < powerUpCount; i++) {
            const x = 400 + (i * 300) + Math.random() * 200;
            const y = 200 + Math.random() * 300;
            const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
            
            const powerUp = new PowerUp(this, x, y, type);
            this.powerUps.add(powerUp);
        }
        
        console.log(`⚡ ${powerUpCount} power-ups creados para el nivel ${this.currentLevel}`);
    }
    
    resetScore() {
        // Resetear puntuación local y global
        this.score = 0;
        this.currentLevel = 1;
        this.difficulty = 1;
        
        // Resetear también en gameState global
        if (typeof gameState !== 'undefined') {
            gameState.score = 0;
            gameState.currentLevel = 1;
            gameState.difficulty = 1;
            gameState.coinsCollected = 0;
            gameState.startTime = Date.now();
            gameState.gameTime = 0;
        }
        
        console.log('🔄 Puntuación reseteada para nueva partida');
    }
}

console.log('📝 GameScene.js actualizada - Fase 4: Enemigos Ultron con IA'); 