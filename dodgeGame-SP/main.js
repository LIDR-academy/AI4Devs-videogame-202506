// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Variables globales del juego
let player;
let platform;
let enemies;
let coins;
let scoreText;
let livesText;
let score = 0;
let lives = 3;
let gameOver = false;
let isImmune = false;
let enemySpawnTimer = 0;
let coinSpawnTimer = 0;

// Crear instancia del juego
const game = new Phaser.Game(config);

// Función para cargar assets
function preload() {
    // Cargar imágenes con cache busting
    this.load.image('sky', 'assets/images/sky.png?v=1.0');
    this.load.image('ground', 'assets/images/ground.png?v=1.0');
    this.load.image('enemy', 'assets/images/enemy.png?v=1.0');
    this.load.image('coin', 'assets/images/coin.png?v=1.0');
    
    // Cargar sprites del personaje
    this.load.spritesheet('player', 'assets/images/Mask Dude/Run.png?v=1.0', { 
        frameWidth: 32, 
        frameHeight: 32 
    });
    this.load.spritesheet('playerIdle', 'assets/images/Mask Dude/Idle.png?v=1.0', { 
        frameWidth: 32, 
        frameHeight: 32 
    });
    this.load.spritesheet('playerJump', 'assets/images/Mask Dude/Jump.png?v=1.0', { 
        frameWidth: 32, 
        frameHeight: 32 
    });
    this.load.spritesheet('playerFall', 'assets/images/Mask Dude/Fall.png?v=1.0', { 
        frameWidth: 32, 
        frameHeight: 32 
    });
    this.load.spritesheet('playerHit', 'assets/images/Mask Dude/Hit.png?v=1.0', { 
        frameWidth: 32, 
        frameHeight: 32 
    });
}

// Función para crear elementos del juego
function create() {
    // Agregar fondo
    this.add.image(400, 300, 'sky');
    
    // Crear plataforma
    platform = this.physics.add.staticImage(400, 580, 'ground');
    
    // Crear grupos para enemigos y monedas
    enemies = this.physics.add.group();
    coins = this.physics.add.group();
    
    // Crear jugador
    player = this.physics.add.sprite(400, 450, 'player');
    player.setScale(1.5);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    // Configurar colisiones
    this.physics.add.collider(player, platform);
    this.physics.add.collider(enemies, platform, enemyHitPlatform, null, this);
    this.physics.add.collider(coins, platform, coinHitPlatform, null, this);
    this.physics.add.collider(player, enemies, hitEnemy, null, this);
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    
    // Crear animaciones del jugador
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 10 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 11 }),
        frameRate: 15,
        repeat: -1
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 11 }),
        frameRate: 15,
        repeat: -1
    });
    
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('playerJump', { start: 0, end: 0 }),
        frameRate: 10
    });
    
    this.anims.create({
        key: 'fall',
        frames: this.anims.generateFrameNumbers('playerFall', { start: 0, end: 0 }),
        frameRate: 10
    });
    
    this.anims.create({
        key: 'hit',
        frames: this.anims.generateFrameNumbers('playerHit', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: 0
    });
    
    // Crear textos de UI
    scoreText = this.add.text(16, 16, 'Puntuación: 0', { 
        fontSize: '24px', 
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 4
    });
    
    livesText = this.add.text(16, 50, 'Vidas: 3', { 
        fontSize: '24px', 
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 4
    });
    
    // Configurar controles
    cursors = this.input.keyboard.createCursorKeys();
    
    // Configurar tecla ENTER para reiniciar
    this.input.keyboard.on('keydown-ENTER', function() {
        if (gameOver) {
            restartGame(this);
        }
    }, this);
}

// Función de actualización del juego
function update() {
    if (gameOver) return;
    
    // Actualizar timers
    enemySpawnTimer += this.game.loop.delta;
    coinSpawnTimer += this.game.loop.delta;
    
    // Generar enemigos cada 3 segundos
    if (enemySpawnTimer >= 3000) {
        spawnEnemy(this);
        enemySpawnTimer = 0;
    }
    
    // Generar monedas cada 3.5 segundos
    if (coinSpawnTimer >= 3500) {
        spawnCoin(this);
        coinSpawnTimer = 0;
    }
    
    // Lógica de movimiento del jugador
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
        player.flipX = false;
    } else {
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }
    
    // Lógica de salto
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
    
    // Animaciones de salto y caída
    if (player.body.velocity.y < 0) {
        player.anims.play('jump', true);
    } else if (player.body.velocity.y > 0) {
        player.anims.play('fall', true);
    }
    
    // Limpiar elementos fuera de pantalla
    cleanupElements();
}

// Función para generar enemigos
function spawnEnemy(scene) {
    const x = Phaser.Math.Between(50, 750);
    const enemy = enemies.create(x, -50, 'enemy');
    enemy.setScale(1.2);
    enemy.setVelocityY(60);
}

// Función para generar monedas
function spawnCoin(scene) {
    const x = Phaser.Math.Between(50, 750);
    const coin = coins.create(x, -50, 'coin');
    coin.setScale(0.8);
    coin.setVelocityY(40);
}

// Función cuando un enemigo toca la plataforma
function enemyHitPlatform(enemy, platform) {
    enemy.destroy();
}

// Función cuando una moneda toca la plataforma
function coinHitPlatform(coin, platform) {
    coin.destroy();
}

// Función cuando el jugador toca un enemigo
function hitEnemy(player, enemy) {
    if (isImmune) return;
    
    enemy.destroy();
    
    // Reducir vida
    lives--;
    livesText.setText('Vidas: ' + lives);
    
    // Efectos visuales
    this.cameras.main.shake(200, 0.02);
    player.setTint(0xff0000);
    player.anims.play('hit', true);
    
    // Inmunidad temporal
    isImmune = true;
    player.setAlpha(0.5);
    
    setTimeout(() => {
        player.clearTint();
        player.setAlpha(1);
        isImmune = false;
    }, 1000);
    
    // Verificar game over
    if (lives <= 0) {
        gameOverFunction(this);
    }
}

// Función para recolectar monedas
function collectCoin(player, coin) {
    coin.destroy();
    
    // Aumentar puntuación
    score += 10;
    scoreText.setText('Puntuación: ' + score);
    
    // Efectos visuales
    this.cameras.main.shake(50, 0.01);
}

// Función para limpiar elementos fuera de pantalla
function cleanupElements() {
    enemies.children.entries.forEach(enemy => {
        if (enemy.y > 650) {
            enemy.destroy();
        }
    });
    
    coins.children.entries.forEach(coin => {
        if (coin.y > 650) {
            coin.destroy();
        }
    });
}

// Función de game over
function gameOverFunction(scene) {
    gameOver = true;
    
    // Pausar física
    scene.physics.pause();
    
    // Efectos visuales
    player.setTint(0xff0000);
    player.anims.play('hit', true);
    
    // Textos de game over
    const gameOverText = scene.add.text(400, 200, 'GAME OVER', {
        fontSize: '64px',
        fill: '#ff0000',
        stroke: '#000',
        strokeThickness: 6
    }).setOrigin(0.5);
    
    const scoreFinalText = scene.add.text(400, 280, 'Puntuación Final: ' + score, {
        fontSize: '32px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0.5);
    
    const restartText = scene.add.text(400, 350, 'Presiona ENTER para reiniciar', {
        fontSize: '24px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 3
    }).setOrigin(0.5);
}

// Función para reiniciar el juego
function restartGame(scene) {
    // Resetear variables
    score = 0;
    lives = 3;
    gameOver = false;
    isImmune = false;
    enemySpawnTimer = 0;
    coinSpawnTimer = 0;
    
    // Reiniciar escena
    scene.scene.restart();
} 