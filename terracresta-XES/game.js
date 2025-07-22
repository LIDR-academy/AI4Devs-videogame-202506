// TerraCresta Clone Game - Main Game File
// Complete implementation with Phaser 3

// Game Configuration
let config;

// Game instance
let game;
let gameState = {
    score: 0,
    lives: 3,
    parts: 0,
    highScore: localStorage.getItem('terracrestaHighScore') || 0
};

// DOM Elements
let loadingScreen, menuOverlay, gameOverOverlay, hud;
let livesCounter, partsCounter, scoreCounter, phoenixStatus;
let startButton, restartButton, menuButton;
let finalScore, highScore;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDOM();
    
    // Initialize config after scene classes are defined
    config = {
        type: Phaser.AUTO,
        width: 384,
        height: 512,
        parent: 'game-container',
        backgroundColor: '#000011',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false, // COMPLETAMENTE DESACTIVADO
                debugShowBody: false,
                debugShowStaticBody: false,
                debugShowVelocity: false,
                debugVelocityColor: 0x00ff00,
                debugBodyColor: 0x0000ff,
                debugStaticBodyColor: 0xffffff
            }
        },
        audio: {
            disableWebAudio: false,
            context: false,
            noAudio: false
        },
        scene: [MenuScene, GameScene, GameOverScene],
        callbacks: {
            postBoot: function (game) {
                // Configurar desbloqueo de audio global
                window.unlockAudio = function() {
                    const scene = game.scene.getScene('GameScene');
                    if (scene && scene.sound && scene.sound.context) {
                        if (scene.sound.context.state === 'suspended') {
                            scene.sound.context.resume().then(() => {
                                console.log('✅ Audio desbloqueado globalmente');
                            });
                        }
                    }
                };
                
                // Escuchar clics en todo el documento
                document.addEventListener('click', window.unlockAudio);
                document.addEventListener('touchstart', window.unlockAudio);
                document.addEventListener('keydown', window.unlockAudio);
            }
        }
    };
    
    game = new Phaser.Game(config);
});

// DOM Initialization
function initializeDOM() {
    loadingScreen = document.getElementById('loading-screen');
    menuOverlay = document.getElementById('menu-overlay');
    gameOverOverlay = document.getElementById('game-over-overlay');
    hud = document.getElementById('hud');
    
    livesCounter = document.getElementById('lives-counter');
    partsCounter = document.getElementById('parts-counter');
    scoreCounter = document.getElementById('score-counter');
    phoenixStatus = document.getElementById('phoenix-status');
    
    startButton = document.getElementById('start-button');
    restartButton = document.getElementById('restart-button');
    menuButton = document.getElementById('menu-button');
    
    finalScore = document.getElementById('final-score');
    highScore = document.getElementById('high-score');
    
    // Event listeners
    startButton.addEventListener('click', () => {
        // Intentar desbloquear audio inmediatamente al hacer clic en Start
        if (game && game.scene && game.scene.getScene('GameScene')) {
            const gameScene = game.scene.getScene('GameScene');
            if (gameScene.sound && !gameScene.sound.unlocked) {
                console.log('🔓 Desbloqueando audio al presionar Start Game...');
                try {
                    if (gameScene.sound.context) {
                        gameScene.sound.context.resume();
                    }
                } catch (e) {
                    console.warn('Error desbloqueando audio en Start:', e);
                }
            }
        }
        
        hideMenu();
        game.scene.start('GameScene');
    });
    
    restartButton.addEventListener('click', () => {
        hideGameOver();
        game.scene.start('GameScene');
    });
    
    menuButton.addEventListener('click', () => {
        hideGameOver();
        showMenu();
    });
}

// UI Functions
function showMenu() {
    menuOverlay.classList.remove('hidden');
    hud.classList.add('hidden');
}

function hideMenu() {
    menuOverlay.classList.add('hidden');
    hud.classList.remove('hidden');
}

function showGameOver() {
    gameOverOverlay.classList.remove('hidden');
    hud.classList.add('hidden');
}

function hideGameOver() {
    gameOverOverlay.classList.add('hidden');
}

function updateHUD() {
    livesCounter.textContent = gameState.lives;
    partsCounter.textContent = gameState.parts;
    scoreCounter.textContent = gameState.score;
    
    if (gameState.parts === 4) {
        phoenixStatus.classList.remove('hidden');
    } else {
        phoenixStatus.classList.add('hidden');
    }
}

// Menu Scene
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        loadingScreen.classList.add('hidden');
        showMenu();
    }
}

// Main Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.enemies = null;
        this.bullets = null;
        this.enemyBullets = null;
        this.powerUps = null;
        this.particles = null;
        this.background = null;
        this.cursors = null;
        this.fireKey = null;
        this.lastFireTime = 0;
        this.fireRate = 200;
        this.enemySpawnTimer = 0;
        this.powerUpSpawnTimer = 0;
        this.score = 0;
        this.lives = 3;
        this.parts = 0;
        this.isPhoenix = false;
        this.platformManager = null; // Added for platform integration
        this.adapterAcopladoSprite = null;
        // En GameScene, usa un objeto para los adaptadores acoplados:
        this.acopladosSprites = {};
    }
    
    preload() {
        // Load external images from assets folder
        this.load.image('player_spaceship', 'assets/nave.png');
        this.load.image('enemy_ship_img', 'assets/enemy.png');
        this.load.image('plataforma', 'assets/plataforma.png');
        this.load.image('num_2_plataforma', 'assets/num_2_plataforma.png');
        this.load.image('num_3_plataforma', 'assets/num_3_plataforma.png');
        this.load.image('num_4_plataforma', 'assets/num_4_plataforma.png');
        this.load.image('num_5_plataforma', 'assets/num_5_plataforma.png');
        // Carga también los adaptadores si los usas
        this.load.image('nave_2_plataforma', 'assets/nave_2_plataforma.png');
        this.load.image('nave_3_plataforma', 'assets/nave_3_plataforma.png');
        this.load.image('nave_4_plataforma', 'assets/nave_4_plataforma.png');
        this.load.image('nave_5_plataforma', 'assets/fenix.png'); // Usar fenix para plataforma 5
        // Create procedural sprites for ships
        this.createShipSprites();
        // this.load.audio('explosion_numero', 'assets/explosion_numero.wav'); // ARCHIVO NO EXISTE
        
        // Cargar audio con mejor configuración y manejo de errores
        this.load.audio('laser', 'assets/laser.wav');
        this.load.audio('explosion', 'assets/explosion.wav');
        
        // Eventos de carga de audio para debug
        this.load.on('filecomplete-audio-laser', () => {
            console.log('✅ Audio laser.wav cargado correctamente');
        });
        
        this.load.on('filecomplete-audio-explosion', () => {
            console.log('✅ Audio explosion.wav cargado correctamente');
        });
        
        this.load.on('loaderror', (file) => {
            console.error('❌ Error cargando archivo:', file.key, file.url);
        });
        
        this.load.image('numero_explotado', 'assets/numero_explotado.png');
        
        console.log('⚠️ Archivos faltantes comentados:');
        console.log('- explosion_numero.wav (sonido números)');
        console.log('✅ Plataforma 5 usa fenix.png como adaptador');
    }
    
    create() {
        // FORZAR desactivación completa de debug
        if (this.physics && this.physics.world) {
            this.physics.world.debugGraphic = null;
            this.physics.world.drawDebug = false;
            this.physics.world.debugShowBody = false;
            this.physics.world.debugShowStaticBody = false;
            this.physics.world.debugShowVelocity = false;
        }
        
        // Diagnóstico de audio al inicio
        this.debugAudioSystem();
        
        // Mostrar notificación de audio si está bloqueado
        this.time.delayedCall(1000, () => {
            if (this.sound && !this.sound.unlocked) {
                this.showAudioNotification();
            }
        });
        
        // Intento adicional de desbloqueo tras 2 segundos
        this.time.delayedCall(2000, () => {
            if (this.sound && !this.sound.unlocked) {
                console.log('🔓 Intento tardío de desbloqueo de audio...');
                this.forceAudioUnlock();
            }
        });
        
        // Reset game state
        this.score = 0;
        this.lives = 3;
        this.parts = 0;
        this.isPhoenix = false;
        
        // Update global state
        gameState.score = this.score;
        gameState.lives = this.lives;
        gameState.parts = this.parts;
        updateHUD();
        
        // Create background
        this.createBackground();
        
        // Particle system disabled - using sprite-based effects instead
        this.particles = null;
        
        // Create groups
        this.enemies = this.physics.add.group();
        this.bullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.powerUps = this.physics.add.group();
        
        // Create player
        this.createPlayer();
        
        // Setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Añadir listeners para desbloquear audio con la primera interacción
        this.setupAudioUnlock();
        
        // Setup collisions
        this.setupCollisions();
        
        // Start spawning
        this.enemySpawnTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
        
        // Power-ups desactivados - el juego usa sistema de plataformas
        // this.powerUpSpawnTimer = this.time.addEvent({
        //     delay: 8000,
        //     callback: this.spawnPowerUp,
        //     callbackScope: this,
        //     loop: true
        // });

        // Initialize platform manager
        this.platformNumbersGroup = this.physics.add.group();
        this.platformManager = new PlatformManager(this);
        this.platformManager.start();
        const scene = this;
        this.physics.add.overlap(this.bullets, this.platformNumbersGroup, (bullet, nSprite) => {
            if (nSprite.getData('alive')) {
                console.log('🎯 COLISIÓN: Bala vs Número de Plataforma');
                console.log('  - Bala:', bullet.texture?.key, 'en', bullet.x, bullet.y);
                console.log('  - Número:', nSprite.texture?.key, 'en', nSprite.x, nSprite.y);
                
                nSprite.setData('alive', false);
                scene.createSmallExplosion(nSprite.x, nSprite.y, true);
                
                // Intentar reproducir sonido específico para números, si no usar explosión general
                if (!scene.playSound('explosion_numero', 0.3)) {
                    console.log('Audio explosion_numero no disponible - usando explosion');
                    if (!scene.playSound('explosion', 0.2)) {
                        scene.playAudioHTML5('explosion', 0.2);
                    }
                }
                if (scene.textures.exists('numero_explotado')) {
                    nSprite.setTexture('numero_explotado');
                    nSprite.setVisible(true);
                    nSprite.setAlpha(1);
                    nSprite.setDepth(9999); // Muy por encima de todo
                    nSprite.setScale(2); // Grande
                    nSprite.clearTint();
                    this.tweens.add({
                        targets: nSprite,
                        alpha: { from: 1, to: 0.5 },
                        yoyo: true,
                        repeat: 2,
                        duration: 80
                    });
                } else {
                    nSprite.setVisible(false);
                }
                bullet.destroy();
                scene.platformManager.notifyNumberDestroyed(nSprite);
            }
        });
    }
    
    createShipSprites() {
        // Create procedural sprites for ships
        const graphics = this.add.graphics();
        
        // Bullet
        graphics.clear();
        graphics.fillStyle(0x00ffff);
        graphics.fillCircle(0, 0, 3);
        graphics.generateTexture('bullet', 6, 6);
        
        // Enemy bullet
        graphics.clear();
        graphics.fillStyle(0xff4444);
        graphics.fillCircle(0, 0, 3);
        graphics.generateTexture('enemy_bullet', 6, 6);
        
        // Particle texture for modern API
        graphics.clear();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(0, 0, 2);
        graphics.generateTexture('particle', 4, 4);
        
        graphics.destroy();
    }
    
    createBackground() {
        // Fondo tipo Terra Cresta con tileado infinito
        const width = this.game.config.width;
        const height = this.game.config.height;
        this.backgroundContainer = this.add.container(0, 0);
        this.bgGraphics = [];
        this.bgScroll = 0;
        const sandColor = 0xd6a94a;
        const sandShadow = 0xb98a2e;
        const craterColor = 0xbfa15c;
        const crackColor = 0x8a6a2e;
        const bushColors = [0x3a7d1c, 0x4caf50, 0x2e5d13];
        this.bgLayers = 0;
        // Calcular cuántas capas hacen falta para cubrir la pantalla y una extra
        this.bgLayers = Math.ceil(this.game.config.height / height) + 2;
        for (let i = 0; i < this.bgLayers; i++) {
            const g = this.add.graphics();
            g.y = -i * height;
            // Arena base
            g.fillStyle(sandColor, 1);
            g.fillRect(0, 0, width, height);
            // Textura granular (puntos oscuros)
            for (let t = 0; t < 400; t++) {
                g.fillStyle(sandShadow, 0.18 + Math.random() * 0.12);
                const tx = Math.random() * width;
                const ty = Math.random() * height;
                g.fillCircle(tx, ty, 1 + Math.random() * 1.2);
            }
            // Grandes manchas de vegetación
            for (let v = 0; v < 4; v++) {
                const vx = 40 + Math.random() * (width - 80);
                const vy = 60 + Math.random() * (height - 120);
                const r = 38 + Math.random() * 38;
                g.fillStyle(bushColors[Math.floor(Math.random() * bushColors.length)], 0.85);
                g.beginPath();
                g.arc(vx, vy, r, 0, Math.PI * 2);
                for (let b = 0; b < 7; b++) {
                    const angle = Math.random() * Math.PI * 2;
                    const br = r * (0.6 + Math.random() * 0.7);
                    g.arc(vx + Math.cos(angle) * r * 0.7, vy + Math.sin(angle) * r * 0.7, br, 0, Math.PI * 2);
                }
                g.closePath();
                g.fillPath();
            }
            // Cráteres
            for (let c = 0; c < 5; c++) {
                const cx = 30 + Math.random() * (width - 60);
                const cy = 40 + Math.random() * (height - 80);
                const cr = 18 + Math.random() * 12;
                g.lineStyle(2, craterColor, 0.7);
                g.strokeEllipse(cx, cy, cr, cr * (0.7 + Math.random() * 0.3));
                g.lineStyle(0);
                g.fillStyle(craterColor, 0.18);
                g.fillEllipse(cx, cy, cr * 0.8, cr * 0.5);
            }
            // Grietas
            for (let k = 0; k < 7; k++) {
                g.lineStyle(1.5, crackColor, 0.5 + Math.random() * 0.3);
                let x = Math.random() * width;
                let y = Math.random() * height;
                g.beginPath();
                g.moveTo(x, y);
                for (let s = 0; s < 8; s++) {
                    x += (Math.random() - 0.5) * 30;
                    y += (Math.random() - 0.2) * 18;
                    g.lineTo(x, y);
                }
                g.strokePath();
            }
            this.backgroundContainer.add(g);
            this.bgGraphics.push(g);
        }
    }
    
    createPlayer() {
        const x = this.game.config.width / 2;
        const y = this.game.config.height - 100;
        
        // Try to use the custom spaceship image, fallback to procedural sprite
        const shipTexture = this.textures.exists('player_spaceship') ? 'player_spaceship' : 'player_ship';
        
        this.player = this.physics.add.sprite(x, y, shipTexture);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.5);
        this.player.setDepth(10000); // Z-index máximo para estar siempre encima
        
        // Si es la imagen personalizada, escalar x1.5
        if (shipTexture === 'player_spaceship') {
            this.player.setScale(1.5);
        }
        // Player properties
        this.player.speed = 300;
        this.player.parts = [];
        this.player.isPhoenix = false;
    }
    
    setupCollisions() {
        // Player bullets vs enemies
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        
        // Enemy bullets vs player - CON LOG DETALLADO
        this.physics.add.overlap(this.enemyBullets, this.player, (player, bullet) => {
            console.log('🔴 COLISIÓN: Bala enemiga vs Player');
            console.log('  - Bala:', bullet.texture?.key, 'en', bullet.x, bullet.y);
            console.log('  - Player:', player.texture?.key, 'en', player.x, player.y);
            this.hitPlayer(player, bullet);
        }, null, this);
        
        // Player vs enemies - CON LOG DETALLADO
        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            console.log('🔴 COLISIÓN: Player vs Enemigo');
            console.log('  - Player:', player.texture?.key, 'en', player.x, player.y);
            console.log('  - Enemigo:', enemy.texture?.key, 'en', enemy.x, enemy.y);
            this.hitPlayer(player, enemy);
        }, null, this);
        
        // Player vs power-ups - CON LOG DETALLADO
        this.physics.add.overlap(this.player, this.powerUps, (player, powerUp) => {
            console.log('🟢 COLISIÓN: Player vs PowerUp');
            console.log('  - Player:', player.texture?.key, 'en', player.x, player.y);
            console.log('  - PowerUp:', powerUp.texture?.key, 'en', powerUp.x, powerUp.y);
            this.collectPowerUp(player, powerUp);
        }, null, this);
    }
    
    update() {
        if (!this.player) return;
        
        // Scroll vertical tileado infinito hacia abajo (como si la nave volara hacia adelante)
        this.bgScroll += 1; // Velocidad de scroll
        const height = this.game.config.height;
        const totalHeight = height * this.bgGraphics.length;
        if (this.bgScroll >= height) this.bgScroll -= height;
        for (let i = 0; i < this.bgGraphics.length; i++) {
            // Corregir dirección: suma el scroll para que vaya hacia abajo
            let y = Math.round((i * height) + (this.bgScroll % height));
            if (y >= height) y -= totalHeight;
            this.bgGraphics[i].y = y;
        }
        
        this.handlePlayerMovement();
        this.handlePlayerShooting();
        this.updateEnemies();
        this.updateBullets();
        this.updatePowerUps();
        this.platformManager.update(); // Update platform manager
        // No mover automáticamente el platformContainer con el fondo,
        // las plataformas se mueven individualmente en platformManager.update()
        
        // LIMPIAR solo gráficos de debug específicos del motor de física
        if (this.physics && this.physics.world && this.physics.world.debugGraphic) {
            this.physics.world.debugGraphic.destroy();
            this.physics.world.debugGraphic = null;
        }
        
        // Detectar objetos sospechosos cerca del player (cada 60 frames para no spamear)
        if (this.time.now % 1000 < 16) { // Aprox cada segundo
            this.children.list.forEach(child => {
                if (child && child !== this.player && this.player) {
                    const distance = Phaser.Math.Distance.Between(child.x, child.y, this.player.x, this.player.y);
                    if (distance < 100 && child.texture?.key && 
                        (child.texture.key.includes('debug') || 
                         child.texture.key === '__DEBUG' ||
                         child.texture.key === '__MISSING' ||
                         child.texture.key === '__DEFAULT' ||
                         child.width < 50 && child.height < 50)) {
                        console.log('🔍 OBJETO DETECTADO cerca del player:');
                        console.log('  - Tipo:', child.texture.key, 'en', child.x, child.y);
                        console.log('  - Tamaño:', child.width, 'x', child.height);
                        console.log('  - Distancia:', Math.round(distance), 'pixels');
                        console.log('  - Depth:', child.depth);
                    }
                }
            });
        }
        
        // Limpieza MUY específica solo para elementos de debug conocidos
        this.children.list.slice().forEach(child => {
            let shouldDestroy = false;
            let reason = '';
            
            // Solo eliminar texturas explícitamente de debug
            if (child && child.texture && child.texture.key) {
                const textureKey = child.texture.key;
                if (textureKey === '__DEBUG' || 
                    textureKey === 'debug' ||
                    textureKey === 'Debug') {
                    shouldDestroy = true;
                    reason = `textura debug: ${textureKey}`;
                }
            }
            
            // Solo eliminar objetos MUY específicos: cuadrados pequeños en esquina inferior izquierda
            if (child && 
                child.x >= 0 && child.x <= 30 && 
                child.y >= this.game.config.height - 30 && child.y <= this.game.config.height &&
                child.width && child.height && 
                child.width <= 30 && child.height <= 30 &&
                child !== this.player && 
                child.texture?.key !== 'plataforma' &&
                child.texture?.key !== 'player_spaceship' &&
                !child.texture?.key?.includes('num_') &&
                !child.texture?.key?.includes('nave_') &&
                !child.texture?.key?.includes('bullet') &&
                !child.texture?.key?.includes('particle')) {
                shouldDestroy = true;
                reason = `cuadrado pequeño en esquina inferior izquierda: ${child.texture?.key} ${child.width}x${child.height} en ${child.x},${child.y}`;
            }
            
            if (shouldDestroy) {
                console.log('🗑️ Eliminando elemento de debug específico:', reason);
                child.destroy();
            }
        });
        
        // Solo actualizar posición de adaptadores si NO está en modo Fénix
        if (this.acopladosSprites && this.player && !this.isPhoenix) {
            for (const num of [2,3,4,5]) {
                const sprite = this.acopladosSprites[num];
                if (sprite && sprite.visible) { // Solo mover adaptadores visibles
                    let offsetX = 0, offsetY = 0;
                    switch (num) {
                        case 2: offsetY = 32; break;
                        case 3: offsetY = -32; break;
                        case 4: offsetX = -32; break;
                        case 5: offsetX = 32; break;
                    }
                    sprite.x = this.player.x + offsetX;
                    sprite.y = this.player.y + offsetY;
                }
            }
        }
        // Mover plataformas que están emergiendo desde abajo
        if (this.platformContainer) {
            const children = this.platformContainer.list.slice(); // Copia para evitar modificación durante iteración
            children.forEach(child => {
                // Si la plataforma está subiendo, moverla hacia arriba
                if (child.isMovingUp && child.targetY !== undefined) {
                    child.y -= 0.8; // Velocidad moderada para emerger
                    
                    // Si llegó a su posición final, detener el movimiento
                    if (child.y <= child.targetY) {
                        child.y = child.targetY;
                        child.isMovingUp = false;
                        console.log('Plataforma llegó a su posición final:', child.x, child.y);
                    }
                }
                
                // Mover todas las plataformas (activas y completadas) con el scroll del fondo hacia abajo
                if (!child.isMovingUp) {
                    child.y += 0.7; // Scroll hacia abajo para salir por la parte inferior
                }
                
                // Solo destruir cuando estén completamente fuera de la parte visible (abajo)
                if (child.y > this.game.config.height + 100) {
                    console.log('Plataforma salió de pantalla, destruyendo:', child.texture?.key, 'en', child.x, child.y);
                    child.destroy();
                }
            });
        }
        
        if (this.platformNumbersGroup) {
            this.platformNumbersGroup.getChildren().forEach(s => {
                // Limpiar sprites en posiciones inválidas, con texturas missing, o elementos de debug
                if ((s.x === 0 && s.y === 0) || 
                    !s.texture || 
                    !s.texture.key ||
                    s.texture.key === '__MISSING' ||
                    s.texture.key === '__DEFAULT' ||
                    s.texture.key === '__DEBUG' ||
                    (s.texture.key && s.texture.key.includes('debug')) ||
                    (s.texture.key && s.texture.key.includes('Debug'))) {
                    console.log('Eliminando sprite huérfano/debug:', s.texture?.key, 'en', s.x, s.y);
                    s.destroy();
                }
                // NO eliminar por posición Y - dejar que salgan naturalmente por arriba
            });
        }
    }
    
    handlePlayerMovement() {
        const cursors = this.cursors;
        const player = this.player;
        
        // Reset velocity
        player.setVelocity(0);
        
        // Handle movement
        if (cursors.left.isDown || this.input.keyboard.addKey('A').isDown) {
            player.setVelocityX(-player.speed);
        } else if (cursors.right.isDown || this.input.keyboard.addKey('D').isDown) {
            player.setVelocityX(player.speed);
        }
        
        if (cursors.up.isDown || this.input.keyboard.addKey('W').isDown) {
            player.setVelocityY(-player.speed);
        } else if (cursors.down.isDown || this.input.keyboard.addKey('S').isDown) {
            player.setVelocityY(player.speed);
        }
        
        // Player ship stays oriented upward (no rotation)
    }
    
    handlePlayerShooting() {
        if (this.fireKey.isDown && this.time.now > this.lastFireTime) {
            this.fireBullets();
            this.lastFireTime = this.time.now + this.fireRate;
        }
    }
    
    fireBullets() {
        const player = this.player;
        const bullets = this.bullets;
        // --- NUEVO: disparos según adaptadores acoplados ---
        const acoplados = this.platformManager ? this.platformManager.acoplados : {};
        // Modo Fénix: todos los adaptadores
        if (acoplados[2] && acoplados[3] && acoplados[4] && acoplados[5]) {
            // Fénix: spread + ráfaga
            this.createBullet(player.x, player.y - 20, 0, -700);
            this.createBullet(player.x - 25, player.y - 15, -300, -600);
            this.createBullet(player.x + 25, player.y - 15, 300, -600);
            this.createBullet(player.x - 15, player.y - 10, -150, -600);
            this.createBullet(player.x + 15, player.y - 10, 150, -600);
            this.createBullet(player.x - 20, player.y + 20, -200, 400);
            this.createBullet(player.x + 20, player.y + 20, 200, 400);
            // Ráfaga central
            this.createBullet(player.x - 10, player.y - 20, -80, -700);
            this.createBullet(player.x + 10, player.y - 20, 80, -700);
            return;
        }
        // Diagonales (nave4)
        if (acoplados[4]) {
            this.createBullet(player.x - 15, player.y - 10, -200, -600);
            this.createBullet(player.x + 15, player.y - 10, 200, -600);
        }
        // Trasero (nave3)
        if (acoplados[3]) {
            this.createBullet(player.x - 10, player.y + 20, -80, 400);
            this.createBullet(player.x + 10, player.y + 20, 80, 400);
        }
        // Cuádruple (nave2)
        if (acoplados[2]) {
            this.createBullet(player.x - 18, player.y - 20, 0, -600);
            this.createBullet(player.x - 6, player.y - 20, 0, -600);
            this.createBullet(player.x + 6, player.y - 20, 0, -600);
            this.createBullet(player.x + 18, player.y - 20, 0, -600);
            return;
        }
        // Base: disparo simple
        this.createBullet(player.x, player.y - 20, 0, -600);
    }
    
    createBullet(x, y, velocityX, velocityY) {
        // Sonido de disparo con fallback HTML5
        if (!this.playSound('laser', 0.3)) {
            this.playAudioHTML5('laser', 0.3);
        }
        
        // Usa estrella.png si existe, si no el sprite de bala
        const bulletTexture = this.textures.exists('estrella') ? 'estrella' : 'bullet';
        // Dos estrellas paralelas
        const offset = 8;
        const bullet1 = this.bullets.create(x - offset, y, bulletTexture);
        bullet1.setVelocity(velocityX, velocityY);
        bullet1.setScale(2.2);
        bullet1.body.setSize(12, 12, true);
        bullet1.setDepth(9998); // Balas por debajo de las naves
        this.createBulletTrail(x - offset, y);
        const bullet2 = this.bullets.create(x + offset, y, bulletTexture);
        bullet2.setVelocity(velocityX, velocityY);
        bullet2.setScale(2.2);
        bullet2.body.setSize(12, 12, true);
        bullet2.setDepth(9998); // Balas por debajo de las naves
        this.createBulletTrail(x + offset, y);
    }
    
    spawnEnemy() {
        const x = Math.random() * (this.game.config.width - 50) + 25;
        
        // Usar siempre la imagen externa para enemigos
        const enemy = this.enemies.create(x, -50, 'enemy_ship_img');
        enemy.setScale(0.15); // Escala más pequeña
        enemy.setAngle(180); // Rotar 180 grados para que apunte hacia abajo
        enemy.speed = 150;
        enemy.health = 1;
        enemy.points = 100;
        
        // Movimiento vertical y horizontal
        const pattern = Math.floor(Math.random() * 4);
        if (pattern === 0) {
            enemy.setVelocity(0, enemy.speed);
        } else if (pattern === 1) {
            enemy.setVelocity(0, enemy.speed);
            this.tweens.add({
                targets: enemy,
                x: enemy.x + 200,
                duration: 2000,
                yoyo: true,
                repeat: -1
            });
        } else if (pattern === 2) {
            enemy.setVelocity(0, enemy.speed * 0.8);
            this.tweens.add({
                targets: enemy,
                x: enemy.x + 150,
                duration: 1500,
                yoyo: true,
                repeat: -1
            });
        } else {
            enemy.setVelocity(0, enemy.speed * 0.6);
            this.tweens.add({
                targets: enemy,
                x: enemy.x + 250,
                duration: 2500,
                yoyo: true,
                repeat: -1
            });
        }
        
        // Probabilidad de disparo
        if (Math.random() < 0.3) {
            enemy.shootEvent = this.time.addEvent({
                delay: 500, // Disparar cada 0.5 segundos
                callback: () => this.enemyShoot(enemy),
                callbackScope: this,
                loop: true
            });
        }
    }
    
    enemyShoot(enemy) {
        if (!enemy.active) return;
        
        const bullet = this.enemyBullets.create(enemy.x, enemy.y + 20, 'enemy_bullet');
        bullet.setVelocity(0, 300);
        bullet.setScale(1.2);
    }
    
    spawnPowerUp() {
        // MÉTODO DESACTIVADO - Power-ups causaban cuadrados verdes por textura 'ship_part' faltante
        // El juego usa el sistema de plataformas y adaptadores en su lugar
        console.log('⚠️ spawnPowerUp desactivado - usa sistema de plataformas');
        return;
        
        // const x = Math.random() * (this.game.config.width - 30) + 15;
        // const powerUp = this.powerUps.create(x, -30, 'ship_part');
        // powerUp.setVelocity(0, 100);
        // powerUp.setScale(1.5);
    }
    
    hitEnemy(bullet, enemy) {
        // Destroy bullet
        bullet.destroy();
        
        // Reduce enemy health
        if (!enemy.health) enemy.health = 1;
        enemy.health--;
        
        if (enemy.health <= 0) {
            // Sonido de explosión con fallback HTML5
            if (!this.playSound('explosion', 0.4)) {
                this.playAudioHTML5('explosion', 0.4);
            }
            
            // Enemy destroyed
            enemy.destroy();
            
            // Add score based on enemy type
            const points = enemy.points || 100;
            this.score += points;
            gameState.score = this.score;
            updateHUD();
            
            // Create explosion
            this.createExplosion(enemy.x, enemy.y);
            
            // Create score popup effect
            this.createScorePopup(enemy.x, enemy.y, `+${points}`);
        } else {
            // Enemy hit but not destroyed
            this.createHitEffect(enemy.x, enemy.y);
            
            // Flash the enemy
            enemy.setTint(0xffffff);
            this.time.delayedCall(100, () => {
                if (enemy.active) {
                    enemy.clearTint();
                }
            });
        }
    }
    
    hitPlayer(player, enemy) {
        // Handle damage based on parts system
        const acopladosArr = Object.entries(this.platformManager.acoplados).filter(([k,v]) => v);
        if (acopladosArr.length > 0) {
            // Quita el último acoplado (el de mayor número)
            const lastNum = parseInt(acopladosArr[acopladosArr.length-1][0]);
            console.log('Perdiendo acople:', lastNum, '. Generando plataforma para recuperarlo.');
            
            this.platformManager.acoplados[lastNum] = false;
            if (this.acopladosSprites[lastNum]) {
                this.acopladosSprites[lastNum].destroy();
                delete this.acopladosSprites[lastNum];
            }
            
            // CANCELAR cualquier plataforma activa y limpiar temporizadores
            if (this.platformManager.platformTimeout) {
                this.platformManager.platformTimeout.remove();
                this.platformManager.platformTimeout = null;
            }
            
            // Limpiar plataforma actual si existe (marcar números como inactivos)
            if (this.platformManager.numbers) {
                this.platformManager.numbers.forEach(s => {
                    if (s && s.active) {
                        s.setData('alive', false);
                        if (this.platformNumbersGroup) {
                            this.platformNumbersGroup.remove(s, false, false);
                        }
                    }
                });
            }
            
            // Establecer el índice correcto para la plataforma perdida pero NO generarla inmediatamente
            const targetIndex = [2,3,4,5].indexOf(lastNum);
            this.platformManager.currentIndex = targetIndex;
            this.platformManager.activePlatform = false; // Permitir nueva plataforma
            this.platformManager.numbersDestroyed = 0; // Resetear contador - IMPORTANTE: todos los números deben reaparecer
            
            // Marcar que necesitamos regenerar esta plataforma cuando sea seguro
            this.platformManager.pendingPlatform = lastNum;
            console.log('🕐 Plataforma', lastNum, 'pendiente (índice', targetIndex, ') - esperando que no haya plataformas en pantalla');
            console.log('  - Se regenerará con LOS 4 NÚMEROS COMPLETOS para explotar de nuevo');
            
            // Sonido cuando pierde un adaptador (tono más agudo)
            console.log('💥 Player hit: perdiendo adaptador');
            if (!this.playSound('explosion', 0.6, 200)) {  // Tono más agudo para pérdida de adaptador
                this.playAudioHTML5('explosion', 0.6);
            }
            
            this.parts--;
            this.updatePlayerShip();
            this.createExplosion(enemy.x, enemy.y);
            enemy.destroy();
            return;
        }
        // Lose a life
        this.lives--;
        gameState.lives = this.lives;
        updateHUD();
        
        // Sonido cuando pierde una vida (más dramático, tono más grave)
        console.log('💥 Player hit: perdiendo vida');
        if (!this.playSound('explosion', 0.8, -300)) {  // Tono más grave para pérdida de vida
            this.playAudioHTML5('explosion', 0.8);
        }
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Reset player position
            player.setPosition(this.game.config.width / 2, this.game.config.height - 100);
            this.createExplosion(player.x, player.y);
        }
        
        // Enhanced screen shake effect
        this.cameras.main.shake(300, 0.03);
        
        // Player hit flash effect
        this.cameras.main.flash(300, 255, 0, 0);
        
        // Create impact effect using sprites
        this.createImpactEffect(player.x, player.y);
    }
    
    collectPowerUp(player, powerUp) {
        powerUp.destroy();
        
        if (this.parts < 4) {
            this.parts++;
            this.updatePlayerShip();
            
            // Update global state
            gameState.parts = this.parts;
            updateHUD();
            
            // Phoenix transformation effect se activa solo con adaptadores específicos, no con power-ups
        }
    }
    
    updatePlayerShip() {
        const player = this.player;
        
        // Solo transformar en Phoenix cuando se tienen TODOS los adaptadores específicos (2,3,4,5)
        const acoplados = this.platformManager ? this.platformManager.acoplados : {};
        if (acoplados[2] && acoplados[3] && acoplados[4] && acoplados[5]) {
            // Usar fenix.png para la transformación Phoenix si está disponible
            const phoenixTexture = this.textures.exists('nave_5_plataforma') ? 'nave_5_plataforma' : 'phoenix_ship';
            player.setTexture(phoenixTexture);
            player.setScale(1.8); // Escala un poco menor para fenix.png
            this.isPhoenix = true;
            
            // OCULTAR todos los adaptadores cuando está en modo Fénix - solo se muestra el Fénix
            this.hideAllAdapters();
        } else {
            const shipTexture = this.textures.exists('player_spaceship') ? 'player_spaceship' : 'player_ship';
            player.setTexture(shipTexture);
            if (shipTexture === 'player_spaceship') {
                player.setScale(1.5 + (this.parts * 0.1));
            } else {
                player.setScale(1.5 + (this.parts * 0.1));
            }
            this.isPhoenix = false;
            
            // MOSTRAR los adaptadores cuando NO está en modo Fénix
            this.showAllAdapters();
        }
    }
    
    hideAllAdapters() {
        // Ocultar todos los adaptadores cuando está en modo Fénix
        if (this.acopladosSprites) {
            for (const num of [2, 3, 4, 5]) {
                if (this.acopladosSprites[num]) {
                    this.acopladosSprites[num].setVisible(false);
                }
            }
        }
        console.log('🔥 Modo Fénix: adaptadores ocultos - solo se muestra el Fénix');
    }
    
    showAllAdapters() {
        // Mostrar los adaptadores correspondientes cuando NO está en modo Fénix
        if (this.acopladosSprites && this.platformManager) {
            const acoplados = this.platformManager.acoplados;
            for (const num of [2, 3, 4, 5]) {
                if (this.acopladosSprites[num]) {
                    // Solo mostrar si realmente está acoplado
                    this.acopladosSprites[num].setVisible(acoplados[num] === true);
                }
            }
        }
        console.log('🚀 Modo normal: mostrando adaptadores acoplados');
    }
    
        playSound(soundKey, volume = 0.5, detune = 0) {
        // Método simplificado y más robusto con variación de tono
        if (!this.sound || !this.cache.audio.exists(soundKey)) {
            return false;
        }

        try {
            // Intento directo de reproducción con configuración de detune
            const audioInstance = this.sound.play(soundKey, { 
                volume: volume,
                detune: detune  // Permite variar el tono (-1200 a +1200 cents)
            });
            
            if (audioInstance) {
                console.log(`🔊 ${soundKey} reproducido (vol: ${volume}, detune: ${detune})`);
                return true;
            }
        } catch (error) {
            // Si falla, intentar desbloquear y reprobar
            if (this.sound.context && this.sound.context.state === 'suspended') {
                this.sound.context.resume().then(() => {
                    try {
                        this.sound.play(soundKey, { 
                            volume: volume,
                            detune: detune 
                        });
                        console.log(`🔊 ${soundKey} reproducido tras desbloqueo`);
                    } catch (e) {
                        console.warn(`⚠️ Audio ${soundKey} falló definitivamente`);
                    }
                });
            }
        }
        
        return false;
    }
    
    playAudioHTML5(soundKey, volume = 0.5) {
        // Fallback usando HTML5 Audio directo
        try {
            const audioPath = `assets/${soundKey}.wav`;
            const audio = new Audio(audioPath);
            audio.volume = volume;
            audio.play().then(() => {
                console.log(`🔊 HTML5 Audio: ${soundKey} reproducido`);
            }).catch(err => {
                console.warn(`⚠️ HTML5 Audio falló: ${soundKey}`, err);
            });
        } catch (error) {
            console.error(`❌ Error HTML5 Audio: ${soundKey}`, error);
        }
    }
     
     forceAudioUnlock() {
         // Método más agresivo para desbloquear audio
         try {
             console.log('🔓 Forzando desbloqueo de audio...');
             
             if (this.sound && this.sound.context) {
                 // Verificar estado del contexto
                 console.log('Estado del contexto:', this.sound.context.state);
                 
                 if (this.sound.context.state === 'suspended') {
                     this.sound.context.resume().then(() => {
                         console.log('✅ Contexto resumido por método forzado');
                         
                         // Crear y reproducir sonido de prueba
                         setTimeout(() => {
                             try {
                                 const testAudio = this.sound.add('laser', { volume: 0.1 });
                                 testAudio.play();
                                 testAudio.stop();
                                 
                                 if (this.sound.unlocked) {
                                     console.log('✅ Audio desbloqueado con método forzado');
                                     this.audioUnlocked = true;
                                 }
                             } catch (e) {
                                 console.error('Error en sonido de prueba:', e);
                             }
                         }, 100);
                         
                     }).catch(err => {
                         console.error('Error en resume forzado:', err);
                     });
                 }
             }
             
         } catch (error) {
             console.error('Error en desbloqueo forzado:', error);
         }
     }
     
     showAudioNotification() {
         // Crear notificación visual de audio bloqueado
         const notification = this.add.text(this.game.config.width / 2, 50, 
             'Haz clic para activar audio', {
             fontSize: '16px',
             fill: '#ffff00',
             backgroundColor: '#000000',
             padding: { x: 10, y: 5 },
             stroke: '#ffffff',
             strokeThickness: 1
         });
         notification.setOrigin(0.5);
         notification.setDepth(10000);
         
         // Hacer parpadear la notificación
         this.tweens.add({
             targets: notification,
             alpha: { from: 1, to: 0.3 },
             duration: 800,
             yoyo: true,
             repeat: -1
         });
         
         // Quitar notificación cuando se desbloquee el audio
         const checkAudio = () => {
             if (this.sound && this.sound.unlocked) {
                 notification.destroy();
                 console.log('🔊 Notificación de audio removida - audio activado');
             } else {
                 this.time.delayedCall(500, checkAudio);
             }
         };
         checkAudio();
     }
     
     debugAudioSystem() {
         console.log('🔊 === DIAGNÓSTICO DE AUDIO ===');
         
         // Verificar sistema de audio general
         console.log('Sistema de audio:', this.sound ? '✅ Disponible' : '❌ No disponible');
         
         if (this.sound) {
             console.log('Contexto de audio:', this.sound.context ? '✅ Activo' : '❌ Inactivo');
             console.log('Audio desbloqueado:', this.sound.unlocked ? '✅ Sí' : '❌ No');
             console.log('Volumen maestro:', this.sound.volume);
             console.log('Audio silenciado:', this.sound.mute);
         }
         
         // Verificar archivos de audio específicos
         const audioFiles = ['laser', 'explosion', 'explosion_numero'];
         audioFiles.forEach(audioKey => {
             const exists = this.cache.audio.exists(audioKey);
             const soundObject = this.sound ? this.sound.get(audioKey) : null;
             console.log(`Audio '${audioKey}': Cache=${exists ? '✅' : '❌'}, Objeto=${soundObject ? '✅' : '❌'}`);
         });
         
         // Probar reproducción de audio
         if (this.sound && this.sound.unlocked) {
             console.log('🎵 Probando reproducción de audio...');
             setTimeout(() => {
                 this.playSound('laser', 0.1);
             }, 1000);
         } else {
             console.log('⚠️ Audio bloqueado - requiere interacción del usuario');
         }
         
         console.log('🔊 === FIN DIAGNÓSTICO ===');
     }
     
     setupAudioUnlock() {
         // Configurar desbloqueo de audio en la primera interacción
         const unlockAudio = () => {
             if (this.sound && !this.sound.unlocked) {
                 console.log('🔓 Intentando desbloquear audio...');
                 
                 try {
                     // Método más directo para desbloquear audio
                     this.sound.context.resume().then(() => {
                         console.log('✅ Contexto de audio resumido');
                         
                         // Reproducir sonido silencioso para confirmar desbloqueo
                         const testSound = this.sound.add('laser', { volume: 0.01 });
                         testSound.play();
                         testSound.stop();
                         
                         setTimeout(() => {
                             if (this.sound.unlocked) {
                                 console.log('✅ Audio completamente desbloqueado');
                                 this.audioUnlocked = true;
                             } else {
                                 console.log('⚠️ Audio parcialmente desbloqueado');
                             }
                         }, 200);
                         
                     }).catch(err => {
                         console.error('❌ Error resumiendo contexto de audio:', err);
                     });
                 } catch (error) {
                     console.error('❌ Error en desbloqueo de audio:', error);
                     
                     // Fallback: método tradicional
                     const silentSound = this.sound.add('laser', { volume: 0 });
                     silentSound.play();
                     silentSound.stop();
                 }
             } else if (this.sound && this.sound.unlocked) {
                 console.log('✅ Audio ya desbloqueado');
                 this.audioUnlocked = true;
             }
         };
         
         // Escuchar eventos de input para desbloquear
         this.input.keyboard.on('keydown', unlockAudio, this);
         this.input.on('pointerdown', unlockAudio, this);
         
         // También intentar cuando se presiona espacio por primera vez
         this.input.keyboard.on('keydown-SPACE', unlockAudio, this);
         
         this.audioUnlocked = false;
     }
     
     createPhoenixEffect() {
        // Create special transformation effect
        const player = this.player;
        
        // Phoenix transformation effect using sprites
        this.createPhoenixBurst(player.x, player.y);
        
        // Screen flash
        this.cameras.main.flash(500, 255, 255, 107);
        
        // Phoenix sound effect (visual feedback)
        this.tweens.add({
            targets: player,
            scaleX: 2.2,
            scaleY: 2.2,
            duration: 200,
            yoyo: true,
            repeat: 1
        });
    }
    
    createExplosion(x, y) {
        // Efecto de explosión sutil
        for (let i = 0; i < 4; i++) { // Menos sprites
            const explosionSprite = this.add.sprite(x, y, 'particle');
            explosionSprite.setScale(0);
            explosionSprite.setTint(0xffc266); // Naranja suave
            explosionSprite.setAlpha(0.5); // Más transparente
            // Pequeño desplazamiento
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            explosionSprite.setPosition(x + offsetX, y + offsetY);
            // Animación más rápida y pequeña
            this.tweens.add({
                targets: explosionSprite,
                scaleX: 0.8 + Math.random() * 0.5,
                scaleY: 0.8 + Math.random() * 0.5,
                alpha: 0,
                duration: 220 + Math.random() * 80,
                ease: 'Power2',
                onComplete: () => {
                    explosionSprite.destroy();
                }
            });
        }
        // Pequeño flash
        this.cameras.main.flash(80, 255, 180, 80, false);
    }
    
    createScorePopup(x, y, text) {
        // Create score popup text
        const scoreText = this.add.text(x, y, text, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
        });
        scoreText.setOrigin(0.5);
        
        // Animate score popup
        this.tweens.add({
            targets: scoreText,
            y: y - 50,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                scoreText.destroy();
            }
        });
    }
    
    createBulletTrail(x, y) {
        // Create bullet trail effect using sprites
        const trailSprite = this.add.sprite(x, y, 'particle');
        trailSprite.setScale(0.5);
        trailSprite.setTint(0x00ffff);
        trailSprite.setAlpha(0.7);
        
        this.tweens.add({
            targets: trailSprite,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                trailSprite.destroy();
            }
        });
    }
    
    createPhoenixBurst(x, y) {
        // Efecto de burst sutil para la transformación Phoenix
        for (let i = 0; i < 8; i++) {
            const burstSprite = this.add.sprite(x, y, 'particle');
            burstSprite.setScale(0);
            burstSprite.setTint(0xffe066); // Amarillo suave
            burstSprite.setAlpha(0.4);
            // Dirección radial
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            this.tweens.add({
                targets: burstSprite,
                x: targetX,
                y: targetY,
                scaleX: 0.7,
                scaleY: 0.7,
                alpha: 0,
                duration: 300 + Math.random() * 100,
                ease: 'Power2',
                onComplete: () => {
                    burstSprite.destroy();
                }
            });
        }
        // Flash breve y suave
        this.cameras.main.flash(80, 255, 255, 180, false);
    }
    
    createImpactEffect(x, y) {
        // Efecto de impacto sutil cuando el jugador es golpeado
        for (let i = 0; i < 4; i++) { // Menos sprites
            const impactSprite = this.add.sprite(x, y, 'particle');
            impactSprite.setScale(0);
            impactSprite.setTint(0x99cfff); // Azul claro suave
            impactSprite.setAlpha(0.4);
            // Desplazamiento pequeño
            const angle = Math.random() * Math.PI * 2;
            const distance = 12 + Math.random() * 18;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            this.tweens.add({
                targets: impactSprite,
                x: targetX,
                y: targetY,
                scaleX: 0.7,
                scaleY: 0.7,
                alpha: 0,
                duration: 180 + Math.random() * 80,
                ease: 'Power2',
                onComplete: () => {
                    impactSprite.destroy();
                }
            });
        }
        // Flash muy breve y suave
        this.cameras.main.flash(60, 180, 220, 255, false);
    }
    
    createHitEffect(x, y) {
        // Create hit effect when enemy is damaged but not destroyed
        for (let i = 0; i < 4; i++) {
            const hitSprite = this.add.sprite(x, y, 'particle');
            hitSprite.setScale(0);
            hitSprite.setTint(0xffff00);
            
            // Random direction and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            
            this.tweens.add({
                targets: hitSprite,
                x: targetX,
                y: targetY,
                scaleX: 0.8,
                scaleY: 0.8,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    hitSprite.destroy();
                }
            });
        }
    }
    
    updateEnemies() {
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.y > this.game.config.height + 50) {
                enemy.destroy();
            }
        });
    }
    
    updateBullets() {
        // Clean up player bullets
        this.bullets.children.entries.forEach(bullet => {
            if (bullet.y < -50) {
                bullet.destroy();
            }
        });
        
        // Clean up enemy bullets
        this.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.y > this.game.config.height + 50) {
                bullet.destroy();
            }
        });
    }
    
    updatePowerUps() {
        // Limpiar todos los power-ups existentes (pueden tener texturas faltantes)
        this.powerUps.children.entries.forEach(powerUp => {
            if (powerUp.texture?.key === '__MISSING' || 
                powerUp.texture?.key === 'ship_part' ||
                powerUp.y > this.game.config.height + 50) {
                console.log('🗑️ Eliminando power-up con textura problemática:', powerUp.texture?.key);
                powerUp.destroy();
            }
        });
    }
    
    gameOver() {
        // Update high score
        if (this.score > gameState.highScore) {
            gameState.highScore = this.score;
            localStorage.setItem('terracrestaHighScore', this.score);
        }
        
        // Show game over screen
        finalScore.textContent = `Final Score: ${this.score}`;
        highScore.textContent = `High Score: ${gameState.highScore}`;
        
        this.scene.pause();
        showGameOver();
    }

    createSmallExplosion(x, y, big = false) {
        const count = big ? 7 : 3;
        const colors = [0xffc266, 0xffe066, 0xff6666, 0xffffff];
        for (let i = 0; i < count; i++) {
            const explosionSprite = this.add.sprite(x, y, 'particle');
            explosionSprite.setScale(0);
            explosionSprite.setTint(colors[Math.floor(Math.random() * colors.length)]);
            explosionSprite.setAlpha(0.8);
            const offsetX = (Math.random() - 0.5) * (big ? 24 : 10);
            const offsetY = (Math.random() - 0.5) * (big ? 24 : 10);
            explosionSprite.setPosition(x + offsetX, y + offsetY);
            this.tweens.add({
                targets: explosionSprite,
                scaleX: (big ? 1.1 : 0.5) + Math.random() * 0.4,
                scaleY: (big ? 1.1 : 0.5) + Math.random() * 0.4,
                alpha: 0,
                duration: (big ? 220 : 120) + Math.random() * 60,
                ease: 'Power2',
                onComplete: () => {
                    explosionSprite.destroy();
                }
            });
        }
    }

    updateAdaptersVisual() {
        // Aquí puedes actualizar la visualización de los adaptadores acoplados si lo necesitas
    }

    acopladosSpritesScale(num) {
        // Define el scale para los adaptadores acoplados
        // El fenix (plataforma 5) es más grande, así que usamos una escala menor
        if (num === 5) {
            return 0.7; // Fenix más pequeño para que se vea proporcional
        }
        return 1; // Otros adaptadores escala normal
    }
}

// --- NUEVO: Plataforma y adaptadores tipo Terra Cresta ---

// Posiciones fijas para las plataformas (puedes ajustar)
const PLATFORM_POSITIONS = [
    { x: 192, y: 120 }, // plataforma 2
    { x: 192, y: 220 }, // plataforma 3
    { x: 96,  y: 320 }, // plataforma 4
    { x: 288, y: 320 }, // plataforma 5
];

const PLATFORM_NUMBERS = [2, 3, 4, 5];

// Clase para gestionar plataformas y adaptadores
class PlatformManager {
    constructor(scene) {
        this.scene = scene;
        this.currentIndex = 0; // 0=plataforma2, 1=plataforma3...
        this.platformGroup = scene.add.group();
        this.numberGroup = scene.add.group();
        this.adapter = null;
        this.adapterActive = false;
        this.adapterSprite = null;
        this.numbersDestroyed = 0;
        this.acoplados = {2: false, 3: false, 4: false, 5: false};
        this.activePlatform = false; // Nuevo flag para controlar la plataforma activa
        this.platformTimeout = null; // Nuevo temporizador para la plataforma inactiva
        this.lastPlatformX = null; // Para recordar la última posición X y alternar
        this.pendingPlatform = null; // Plataforma pendiente por daño
    }

    start() {
        this.spawnPlatform();
    }

    spawnPlatform() {
        console.log('spawnPlatform llamado. activePlatform:', this.activePlatform, 'currentIndex:', this.currentIndex, 'PLATFORM_NUMBERS.length:', PLATFORM_NUMBERS.length);
        
        if (this.activePlatform) {
            console.log('Ya hay una plataforma activa. Saliendo.');
            return; // Si ya hay una plataforma activa, no la generamos
        }
        if (this.currentIndex >= PLATFORM_NUMBERS.length) {
            console.log('currentIndex >= PLATFORM_NUMBERS.length. Todas las plataformas completadas.');
            return;
        }
        
        const num = PLATFORM_NUMBERS[this.currentIndex];
        // X alternando entre izquierda y derecha, Y empieza desde abajo y sube con el paisaje
        const finalY = 380; // Posición final donde se detiene
        const startY = this.scene.game.config.height + 100; // Empieza desde muy abajo, fuera de pantalla
        const xOptions = [96, 288]; // izquierda, derecha
        let x;
        
        if (this.lastPlatformX === null) {
            // Primera plataforma: posición aleatoria
            x = xOptions[Math.floor(Math.random() * xOptions.length)];
        } else {
            // Siguientes plataformas: posición contraria a la anterior
            x = this.lastPlatformX === xOptions[0] ? xOptions[1] : xOptions[0];
        }
        
        this.lastPlatformX = x; // Recordar para la próxima
        console.log('Generando plataforma:', num, 'emergiendo desde abajo en x:', x);
        
        // Log especial si esta plataforma viene de una pérdida de acople
        if (this.scene && this.scene.platformManager && this.scene.platformManager.pendingPlatform === num) {
            console.log('🔄 PLATAFORMA DE RECUPERACIÓN - Se generarán los 4 números completos para recuperar acople', num);
        }
        // Plataforma visual - empieza desde abajo e integrada con el paisaje
        let platform;
        if (this.scene.textures.exists('plataforma')) {
            platform = this.scene.add.sprite(x, startY, 'plataforma');
            platform.setScale(2);
            platform.setDepth(100); // Plataformas por debajo de todo
            
            // La plataforma se mueve hacia arriba junto con el scroll del fondo, 
            // pero se detiene en su posición final
            platform.targetY = finalY;
            platform.isMovingUp = true;
        }
        if (!this.scene.platformContainer) {
            this.scene.platformContainer = this.scene.add.container(0, 0);
        }
        this.scene.platformContainer.add(platform);
        this.platformGroup.add(platform);
        // 4 números con cuerpo físico
        const offsets = [
            { x: 0, y: -32 }, // arriba
            { x: 0, y: 32 },  // abajo
            { x: -32, y: 0 }, // izquierda
            { x: 32, y: 0 },  // derecha
        ];
        this.numbers = [];
        for (let i = 0; i < 4; i++) {
            const textureName = `num_${num}_plataforma`;
            console.log('Intentando crear número con textura:', textureName);
            
            // Verificar que la textura existe antes de crear el sprite
            if (!this.scene.textures.exists(textureName)) {
                console.error('TEXTURA NO ENCONTRADA:', textureName);
                continue; // Saltar este número si no existe la textura
            }
            
            // Los números también empiezan desde abajo y suben con la plataforma
            const nSprite = this.scene.physics.add.sprite(x + offsets[i].x, startY + offsets[i].y, textureName);
            console.log('Número creado exitosamente:', textureName, 'emergiendo desde abajo');
            
            nSprite.setData('alive', true);
            nSprite.setData('index', i);
            nSprite.setData('platformNum', num);
            nSprite.body.immovable = true;
            nSprite.body.allowGravity = false;
            nSprite.setDepth(200); // Números de plataforma por debajo de naves
            
            // Los números también tienen movimiento hacia arriba hasta su posición final
            nSprite.targetY = finalY + offsets[i].y;
            nSprite.isMovingUp = true;
            
            this.scene.platformContainer.add(nSprite);
            this.scene.platformNumbersGroup.add(nSprite); // Asegura que está en el grupo global
            this.numbers.push(nSprite);
        }
        this.numbersDestroyed = 0;
        this.adapterActive = false;
        this.adapterSprite = null;
        this.activePlatform = true; // Marcar la plataforma como activa
        
        // Temporizador de 10 segundos: si no se completa, destruir y reaparecer
        if (this.platformTimeout) {
            this.platformTimeout.remove();
        }
        this.platformTimeout = this.scene.time.delayedCall(10000, () => {
            if (this.activePlatform && this.numbersDestroyed < 4) {
                console.log('⏰ Tiempo agotado para plataforma', num, '- números destruidos:', this.numbersDestroyed, '/4');
                this.destroyPlatform();
            } else {
                console.log('✅ Plataforma', num, 'ya completada o inactiva');
            }
        });
    }

    update() {
        // Si el adaptador está activo, moverlo solo hacia abajo
        if (this.adapterActive && this.adapterSprite) {
            this.adapterSprite.x += this.adapterSprite.vx;
            this.adapterSprite.y += this.adapterSprite.vy;
            // Rebote en los bordes X (opcional, pero no debería moverse)
            if (this.adapterSprite.x < 24) this.adapterSprite.x = 24;
            if (this.adapterSprite.x > this.scene.game.config.width - 24) this.adapterSprite.x = this.scene.game.config.width - 24;
            // Si sale por abajo, lo eliminamos
            if (this.adapterSprite.y > this.scene.game.config.height + 32) {
                this.adapterSprite.destroy();
                this.adapterActive = false;
            }
            // Colisión con el jugador
            if (Phaser.Math.Distance.Between(
                this.adapterSprite.x, this.adapterSprite.y,
                this.scene.player.x, this.scene.player.y) < 32) {
                this.collectAdapter();
            }
        }
        
        // Verificar si hay una plataforma pendiente y no hay plataformas visibles en pantalla
        if (this.pendingPlatform && !this.activePlatform && this.isScreenClearOfPlatforms()) {
            console.log('📍 Pantalla libre de plataformas - generando plataforma pendiente:', this.pendingPlatform);
            console.log('  - currentIndex actual:', this.currentIndex);
            console.log('  - numbersDestroyed actual:', this.numbersDestroyed);
            console.log('  - PLATFORM_NUMBERS:', PLATFORM_NUMBERS);
            
            // Asegurar que el estado esté completamente limpio para la nueva plataforma
            this.numbersDestroyed = 0;
            this.adapterActive = false;
            this.adapterSprite = null;
            
            const pendingNum = this.pendingPlatform;
            this.pendingPlatform = null; // Limpiar flag
            
            console.log('  - Generando plataforma', pendingNum, 'con TODOS los números completos');
            this.spawnPlatform();
        }
    }
    
    isScreenClearOfPlatforms() {
        // Verificar si hay plataformas visibles en pantalla
        if (!this.scene.platformContainer || !this.scene.platformContainer.list) {
            return true; // No hay container, pantalla libre
        }
        
        const screenHeight = this.scene.game.config.height;
        let platformsInScreen = 0;
        
        this.scene.platformContainer.list.forEach(child => {
            if (child && child.active && child.y >= -50 && child.y <= screenHeight + 50) {
                platformsInScreen++;
            }
        });
        
        const isClear = platformsInScreen === 0;
        if (this.pendingPlatform && platformsInScreen > 0) {
            console.log('⏳ Esperando... Plataformas en pantalla:', platformsInScreen);
        }
        
        return isClear;
    }

    spawnAdapter() {
        // Aparece el adaptador correspondiente
        const num = PLATFORM_NUMBERS[this.currentIndex];
        const pos = PLATFORM_POSITIONS[this.currentIndex] || { x: this.numbers[0].x, y: this.numbers[0].y };
        this.adapterSprite = this.scene.add.sprite(pos.x, pos.y, `nave_${num}_plataforma`);
        // Movimiento solo hacia abajo, velocidad moderada
        this.adapterSprite.vx = 0;
        this.adapterSprite.vy = 2.0; // Velocidad moderada
        this.adapterActive = true;
    }

    collectAdapter() {
        const num = PLATFORM_NUMBERS[this.currentIndex];
        console.log('Adaptador recogido para plataforma', num, '. Avanzando currentIndex de', this.currentIndex, 'a', this.currentIndex + 1);
        
        this.acoplados[num] = true;
        this.adapterActive = false;
        if (this.adapterSprite) this.adapterSprite.destroy();
        
        // Limpiar temporizador actual
        if (this.platformTimeout) {
            this.platformTimeout.remove();
            this.platformTimeout = null;
        }
        
        // NO eliminar la plataforma inmediatamente - dejar que se vaya con el scroll
        // Solo marcar los números como inactivos para que no respondan a colisiones
        if (this.numbers) {
            this.numbers.forEach(s => {
                if (s && s.active) {
                    s.setData('alive', false);
                    // Remover del grupo de colisiones pero mantener visible
                    if (this.scene.platformNumbersGroup) {
                        this.scene.platformNumbersGroup.remove(s, false, false);
                    }
                }
            });
        }
        
        this.activePlatform = false;
        this.currentIndex++;
        
        // Generar la SIGUIENTE plataforma tras 10 segundos (si hay más)
        if (this.currentIndex < PLATFORM_NUMBERS.length) {
            console.log('Programando siguiente plataforma tras 10 segundos. Nuevo currentIndex:', this.currentIndex);
            this.platformTimeout = this.scene.time.delayedCall(10000, () => {
                console.log('Apareciendo siguiente plataforma tras completar la anterior');
                this.platformTimeout = null;
                this.spawnPlatform();
            });
        } else {
            console.log('Todas las plataformas completadas!');
        }
        // Añadir adaptador acoplado visualmente en la posición correspondiente
        if (this.scene.acopladosSprites[num]) this.scene.acopladosSprites[num].destroy();
        let offsetX = 0, offsetY = 0;
        switch (num) {
            case 2: {
                const playerH = this.scene.player.displayHeight;
                const adapterH = this.scene.textures.get(`nave_${num}_plataforma`).getSourceImage().height * this.scene.acopladosSpritesScale(num);
                offsetY = playerH / 2 + adapterH / 2 - 3; // -3 para solapamiento completo
                break;
            }
            case 3: {
                const playerH = this.scene.player.displayHeight;
                const adapterH = this.scene.textures.get(`nave_${num}_plataforma`).getSourceImage().height * this.scene.acopladosSpritesScale(num);
                offsetY = -playerH / 2 - adapterH / 2 + 3; // +3 para solapamiento completo
                break;
            }
            case 4: {
                const playerW = this.scene.player.displayWidth;
                const adapterW = this.scene.textures.get(`nave_${num}_plataforma`).getSourceImage().width * this.scene.acopladosSpritesScale(num);
                offsetX = -playerW / 2 - adapterW / 2 + 3;
                break;
            }
            case 5: {
                const playerW = this.scene.player.displayWidth;
                const adapterW = this.scene.textures.get(`nave_${num}_plataforma`).getSourceImage().width * this.scene.acopladosSpritesScale(num);
                offsetX = playerW / 2 + adapterW / 2 - 3;
                break;
            }
        }
        this.scene.acopladosSprites[num] = this.scene.add.sprite(
            this.scene.player.x + offsetX,
            this.scene.player.y + offsetY,
            `nave_${num}_plataforma`
        );
        this.scene.acopladosSprites[num].setDepth(9999); // Justo debajo del player
        this.scene.acopladosSprites[num].setScale(this.scene.player.scaleX, this.scene.player.scaleY);
        // Mejorar disparo
        this.scene.parts++;
        this.scene.updatePlayerShip();
        
        // Efecto Phoenix solo cuando se obtiene el adaptador de la plataforma 5 (fenix)
        if (num === 5 && this.acoplados[2] && this.acoplados[3] && this.acoplados[4] && this.acoplados[5]) {
            this.scene.createPhoenixEffect();
        }
    }

    destroyPlatform() {
        console.log('Destruyendo plataforma. currentIndex:', this.currentIndex);
        
        // NO eliminar la plataforma inmediatamente por timeout - dejar que se vaya con el scroll
        // Solo marcar los números como inactivos para que no respondan a colisiones
        if (this.numbers) {
            this.numbers.forEach(s => {
                if (s && s.active) {
                    s.setData('alive', false);
                    // Remover del grupo de colisiones pero mantener visible
                    if (this.scene.platformNumbersGroup) {
                        this.scene.platformNumbersGroup.remove(s, false, false);
                    }
                }
            });
        }
        
        // Limpiar temporizador actual
        if (this.platformTimeout) {
            this.platformTimeout.remove();
            this.platformTimeout = null;
        }
        
        this.activePlatform = false;
        this.numbersDestroyed = 0; // Resetear el contador de números destruidos
        
        // Programar reaparición de la MISMA plataforma tras 10 segundos
        this.platformTimeout = this.scene.time.delayedCall(10000, () => {
            console.log('🔄 Reapareciendo plataforma tras inactividad. currentIndex:', this.currentIndex, 'PLATFORM_NUMBERS[currentIndex]:', PLATFORM_NUMBERS[this.currentIndex]);
            this.platformTimeout = null;
            this.spawnPlatform(); // Reaparece la misma plataforma
        });
    }



    notifyNumberDestroyed(nSprite) {
        this.numbersDestroyed++;
        console.log('💥 Número destruido. Total:', this.numbersDestroyed, '/4 - Plataforma:', PLATFORM_NUMBERS[this.currentIndex]);
        if (this.numbersDestroyed === 4) {
            console.log('🎉 Plataforma completada! Generando adaptador...');
            this.spawnAdapter();
        }
    }
}

// Game Over Scene
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    create() {
        // This scene is handled by the DOM overlay
    }
} 