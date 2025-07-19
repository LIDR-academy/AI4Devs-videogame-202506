const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32; // 13x13 tiles
let currentLevel = 0;
let score = 0;
let lives = 3;
let totalEnemiesEliminated = 0;

// Crear imágenes de tanques
let playerTankImg, enemyTankImg;

function createTankImages() {
    // Crear imagen del tanque del jugador (verde militar)
    const playerCanvas = document.createElement('canvas');
    playerCanvas.width = 28;
    playerCanvas.height = 28;
    const playerCtx = playerCanvas.getContext('2d');
    
    // Cuerpo principal del tanque (más ancho)
    playerCtx.fillStyle = '#4a5d23';
    playerCtx.fillRect(2, 8, 24, 12);
    
    // Torre del tanque
    playerCtx.fillStyle = '#6b7c2e';
    playerCtx.fillRect(8, 6, 12, 8);
    
    // Cañón principal (más largo y grueso)
    playerCtx.fillStyle = '#2d2d2d';
    playerCtx.fillRect(13, 2, 2, 12);
    
    // Detalles de la torre
    playerCtx.fillStyle = '#2d2d2d';
    playerCtx.fillRect(10, 8, 2, 2); // Escotilla
    playerCtx.fillRect(16, 8, 2, 2); // Escotilla
    
    // Orugas del tanque
    playerCtx.fillStyle = '#1a1a1a';
    playerCtx.fillRect(2, 20, 24, 4);
    
    // Ruedas de las orugas
    playerCtx.fillStyle = '#333';
    for (let i = 0; i < 6; i++) {
        playerCtx.fillRect(4 + i * 4, 18, 2, 8);
    }
    
    // Detalles de sombra
    playerCtx.fillStyle = '#2d2d2d';
    playerCtx.fillRect(2, 8, 2, 12);
    playerCtx.fillRect(24, 8, 2, 12);
    
    // Reflejos
    playerCtx.fillStyle = '#7a8c3e';
    playerCtx.fillRect(4, 10, 2, 2);
    playerCtx.fillRect(22, 10, 2, 2);
    
    playerTankImg = new Image();
    playerTankImg.src = playerCanvas.toDataURL();
    
    // Crear imagen del tanque enemigo (gris metálico)
    const enemyCanvas = document.createElement('canvas');
    enemyCanvas.width = 28;
    enemyCanvas.height = 28;
    const enemyCtx = enemyCanvas.getContext('2d');
    
    // Cuerpo principal del tanque enemigo
    enemyCtx.fillStyle = '#5a5a5a';
    enemyCtx.fillRect(2, 8, 24, 12);
    
    // Torre del tanque enemigo
    enemyCtx.fillStyle = '#7a7a7a';
    enemyCtx.fillRect(8, 6, 12, 8);
    
    // Cañón principal enemigo
    enemyCtx.fillStyle = '#2d2d2d';
    enemyCtx.fillRect(13, 2, 2, 12);
    
    // Detalles de la torre enemiga
    enemyCtx.fillStyle = '#2d2d2d';
    enemyCtx.fillRect(10, 8, 2, 2); // Escotilla
    enemyCtx.fillRect(16, 8, 2, 2); // Escotilla
    
    // Orugas del tanque enemigo
    enemyCtx.fillStyle = '#1a1a1a';
    enemyCtx.fillRect(2, 20, 24, 4);
    
    // Ruedas de las orugas enemigas
    enemyCtx.fillStyle = '#333';
    for (let i = 0; i < 6; i++) {
        enemyCtx.fillRect(4 + i * 4, 18, 2, 8);
    }
    
    // Detalles de sombra enemiga
    enemyCtx.fillStyle = '#4a4a4a';
    enemyCtx.fillRect(2, 8, 2, 12);
    enemyCtx.fillRect(24, 8, 2, 12);
    
    // Reflejos enemigos
    enemyCtx.fillStyle = '#8a8a8a';
    enemyCtx.fillRect(4, 10, 2, 2);
    enemyCtx.fillRect(22, 10, 2, 2);
    
    // Marca de enemigo (cruz roja)
    enemyCtx.fillStyle = '#d44';
    enemyCtx.fillRect(12, 10, 4, 2);
    enemyCtx.fillRect(13, 9, 2, 4);
    
    enemyTankImg = new Image();
    enemyTankImg.src = enemyCanvas.toDataURL();
}

// Función para animar el tanque en el menú
function animateMenuTank() {
    const menuCanvas = document.getElementById('menuTankCanvas');
    const menuCtx = menuCanvas.getContext('2d');
    let menuTankX = 40;
    let menuTankDirection = 1;
    let menuTankTime = 0;
    
    function drawMenuTank() {
        // Limpiar canvas
        menuCtx.fillStyle = '#1a1a1a';
        menuCtx.fillRect(0, 0, 80, 80);
        
        // Mover tanque de manera más realista
        menuTankTime += 0.03;
        menuTankX = 40 + Math.sin(menuTankTime) * 20;
        
        // Cambiar dirección del cañón basado en el movimiento
        let tankAngle = 0;
        if (Math.cos(menuTankTime) > 0) {
            tankAngle = Math.PI / 2; // Mirando hacia la derecha
        } else {
            tankAngle = -Math.PI / 2; // Mirando hacia la izquierda
        }
        
        // Dibujar tanque del jugador más grande
        menuCtx.save();
        menuCtx.translate(menuTankX, 40);
        menuCtx.rotate(tankAngle);
        
        // Cuerpo principal del tanque
        menuCtx.fillStyle = '#4a5d23';
        menuCtx.fillRect(-12, -6, 24, 12);
        
        // Torre del tanque
        menuCtx.fillStyle = '#6b7c2e';
        menuCtx.fillRect(-8, -8, 16, 8);
        
        // Cañón principal
        menuCtx.fillStyle = '#2d2d2d';
        menuCtx.fillRect(-1, -16, 2, 16);
        
        // Detalles de la torre
        menuCtx.fillStyle = '#2d2d2d';
        menuCtx.fillRect(-6, -4, 2, 2);
        menuCtx.fillRect(4, -4, 2, 2);
        
        // Orugas del tanque
        menuCtx.fillStyle = '#1a1a1a';
        menuCtx.fillRect(-12, 6, 24, 4);
        
        // Ruedas de las orugas
        menuCtx.fillStyle = '#333';
        for (let i = 0; i < 6; i++) {
            menuCtx.fillRect(-10 + i * 4, 4, 2, 8);
        }
        
        // Detalles de sombra
        menuCtx.fillStyle = '#2d2d2d';
        menuCtx.fillRect(-12, -6, 2, 12);
        menuCtx.fillRect(10, -6, 2, 12);
        
        // Reflejos
        menuCtx.fillStyle = '#7a8c3e';
        menuCtx.fillRect(-8, -4, 2, 2);
        menuCtx.fillRect(6, -4, 2, 2);
        
        menuCtx.restore();
        
        // Continuar animación
        requestAnimationFrame(drawMenuTank);
    }
    
    drawMenuTank();
}

function drawMap(levelIdx) {
    const map = levels[levelIdx];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            switch(map[y][x]) {
                case 1: // Ladrillo
                    ctx.fillStyle = '#b55239';
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    break;
                case 2: // Acero
                    ctx.fillStyle = '#aaa';
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    break;
                case 3: // Agua
                    ctx.fillStyle = '#3498db';
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    break;
                case 4: // Arbusto
                    ctx.fillStyle = '#27ae60';
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    break;
                case 5: // Base
                    ctx.fillStyle = '#f1c40f';
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    break;
                default:
                    ctx.clearRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('level').textContent = currentLevel + 1;
    const totalRestantes = enemiesToSpawn + enemies.length;
    document.getElementById('enemiesLeft').textContent = totalRestantes;
}

let gameLoopId = null;
let gameActive = false;

function stopGameLoop() {
    if (gameLoopId !== null) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
    gameActive = false;
}

function showGameOver() {
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('ui').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('finalScore').textContent = `Puntaje: ${score}`;
    document.getElementById('finalEnemies').textContent = `Enemigos eliminados: ${totalEnemiesEliminated}`;
    stopGameLoop();
}

document.getElementById('backToMenuBtn').onclick = () => {
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('startMenu').style.display = 'flex';
    score = 0;
    lives = 3;
    currentLevel = 0;
    totalEnemiesEliminated = 0;
    clearAllBullets();
    clearAllParticles();
    updateUI();
    stopGameLoop();
};

// Modificar loseLife para mostrar pantalla de fin de juego
function loseLife() {
    lives--;
    if (lives <= 0) {
        showGameOver();
        return;
    }
    
    // Ocultar jugador temporalmente y limpiar todas las municiones
    player.x = -100; // Mover fuera de pantalla
    
    // Limpiar todas las municiones del juego
    clearAllBullets();
    
    // Esperar un poco para que las partículas se reproduzcan completamente
    setTimeout(() => {
        resetPlayer();
        resetEnemies();
        updateUI();
        // Hacer al jugador invencible por 1.5 segundos después de reaparecer
        player.invincible = true;
        setTimeout(() => {
            player.invincible = false;
        }, 1500);
    }, 800); // 0.8 segundos de delay
}

// --- Lógica de jugador y movimiento ---
const PLAYER_SIZE = 28;
const PLAYER_SPEED = 2;
let player = {
    x: Math.floor((13 * TILE_SIZE) / 2 - PLAYER_SIZE / 2),
    y: 12 * TILE_SIZE + 2,
    dir: 'up', // 'up', 'down', 'left', 'right'
    moving: false,
    invincible: false
};
let keys = {};

function resetPlayer() {
    player.x = Math.floor((13 * TILE_SIZE) / 2 - PLAYER_SIZE / 2);
    player.y = 12 * TILE_SIZE + 2;
    player.dir = 'up';
    player.moving = false;
    player.invincible = false;
}

// Función para limpiar todas las municiones del juego
function clearAllBullets() {
    // Limpiar bala del jugador
    bullet = null;
    
    // Limpiar todas las balas de enemigos
    enemyBullets = [];
    
    // Limpiar referencias de balas en todos los enemigos
    for (let enemy of enemies) {
        if (enemy && enemy.bullet) {
            enemy.bullet = null;
        }
    }
}

// Función para limpiar todas las partículas
function clearAllParticles() {
    particles = [];
}

function drawPlayer() {
    // No dibujar si está fuera de pantalla (durante el delay de muerte)
    if (player.x < 0) return;
    
    ctx.save();
    
    // Efecto de parpadeo si está invencible
    if (player.invincible) {
        const time = Date.now() * 0.01;
        if (Math.sin(time) < 0) {
            ctx.globalAlpha = 0.5;
        }
    }
    
    ctx.translate(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
    switch (player.dir) {
        case 'up': ctx.rotate(0); break;
        case 'right': ctx.rotate(Math.PI / 2); break;
        case 'down': ctx.rotate(Math.PI); break;
        case 'left': ctx.rotate(-Math.PI / 2); break;
    }
    ctx.drawImage(playerTankImg, -PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    ctx.restore();
}

function canMoveTo(nx, ny) {
    // Chequeo de colisión con bloques sólidos
    const map = levels[currentLevel];
    // Revisar las 4 esquinas del tanque
    let corners = [
        {x: nx, y: ny},
        {x: nx + PLAYER_SIZE - 1, y: ny},
        {x: nx, y: ny + PLAYER_SIZE - 1},
        {x: nx + PLAYER_SIZE - 1, y: ny + PLAYER_SIZE - 1}
    ];
    for (let c of corners) {
        let px = Math.floor(c.x / TILE_SIZE);
        let py = Math.floor(c.y / TILE_SIZE);
        if (px < 0 || px >= 13 || py < 0 || py >= 13) return false;
        let block = map[py][px];
        if (block === 1) return false;
    }
    return true;
}

function updatePlayer() {
    let moved = false;
    if (keys['ArrowUp']) {
        player.dir = 'up';
        if (canMoveTo(player.x, player.y - PLAYER_SPEED)) {
            player.y -= PLAYER_SPEED;
            moved = true;
        }
    } else if (keys['ArrowDown']) {
        player.dir = 'down';
        if (canMoveTo(player.x, player.y + PLAYER_SPEED)) {
            player.y += PLAYER_SPEED;
            moved = true;
        }
    } else if (keys['ArrowLeft']) {
        player.dir = 'left';
        if (canMoveTo(player.x - PLAYER_SPEED, player.y)) {
            player.x -= PLAYER_SPEED;
            moved = true;
        }
    } else if (keys['ArrowRight']) {
        player.dir = 'right';
        if (canMoveTo(player.x + PLAYER_SPEED, player.y)) {
            player.x += PLAYER_SPEED;
            moved = true;
        }
    }
    player.moving = moved;
}

// --- Balas del jugador ---
let bullet = null;
const BULLET_SIZE = 8;
const BULLET_SPEED = 6;

function shoot() {
    if (bullet) return; // Solo una bala a la vez
    let bx = player.x + PLAYER_SIZE / 2 - BULLET_SIZE / 2;
    let by = player.y + PLAYER_SIZE / 2 - BULLET_SIZE / 2;
    let dir = player.dir;
    bullet = { x: bx, y: by, dir: dir };
}

// --- Ajustar colisión de balas con bloques y tanques ---
let particles = [];

function spawnParticles(x, y, color = '#b55239') {
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const speed = 2 + Math.random() * 1.5;
        particles.push({
            x: x + TILE_SIZE / 2,
            y: y + TILE_SIZE / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 18 + Math.random() * 8,
            color
        });
    }
}

function updateParticles() {
    for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.life--;
    }
    particles = particles.filter(p => p.life > 0);
}

function drawParticles() {
    for (let p of particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life / 20);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        ctx.restore();
    }
}

// Modificar updateBullet para generar partículas al destruir ladrillo
function updateBullet() {
    if (!bullet) return;
    let dx = 0, dy = 0;
    switch (bullet.dir) {
        case 'up': dy = -BULLET_SPEED; break;
        case 'down': dy = BULLET_SPEED; break;
        case 'left': dx = -BULLET_SPEED; break;
        case 'right': dx = BULLET_SPEED; break;
    }
    bullet.x += dx;
    bullet.y += dy;
    // Chequeo de colisión con bloques
    const map = levels[currentLevel];
    let bx = Math.floor(bullet.x / TILE_SIZE);
    let by = Math.floor(bullet.y / TILE_SIZE);
    if (bx < 0 || bx >= 13 || by < 0 || by >= 13) {
        bullet = null; // Sale del mapa
        return;
    }
    let block = map[by][bx];
    if (block === 1) { // Ladrillo destruible
        map[by][bx] = 0;
        spawnParticles(bx * TILE_SIZE, by * TILE_SIZE);
        bullet = null;
        return;
    }
}

function drawBullet() {
    if (!bullet) return;
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.fillRect(bullet.x, bullet.y, BULLET_SIZE, BULLET_SIZE);
    ctx.restore();
}

// --- Enemigos ---
const ENEMY_SIZE = 28;
const ENEMY_SPEED = 1.5;
const ENEMIES_PER_LEVEL = 10;
const ENEMY_SPAWN_POINTS = [
    { x: TILE_SIZE * 0, y: 0 },
    { x: TILE_SIZE * 6, y: 0 },
    { x: TILE_SIZE * 12, y: 0 }
];
let enemies = [];
let enemiesToSpawn = ENEMIES_PER_LEVEL;
let enemySpawnCooldown = 0;

function resetEnemies() {
    enemies = [];
    enemiesToSpawn = ENEMIES_PER_LEVEL;
    enemySpawnCooldown = 0;
}

function spawnEnemy() {
    if (enemiesToSpawn <= 0) return;
    let spawn = ENEMY_SPAWN_POINTS[Math.floor(Math.random() * ENEMY_SPAWN_POINTS.length)];
    enemies.push({
        x: spawn.x + (TILE_SIZE - ENEMY_SIZE) / 2,
        y: spawn.y,
        dir: 'down',
        alive: true
    });
    enemiesToSpawn--;
}

function updateEnemies() {
    // Spawn progresivo
    if (enemies.length < ENEMIES_PER_LEVEL && enemiesToSpawn > 0 && enemySpawnCooldown <= 0) {
        spawnEnemy();
        enemySpawnCooldown = 60; // frames
    }
    if (enemySpawnCooldown > 0) enemySpawnCooldown--;
    for (let enemy of enemies) {
        if (!enemy.alive) continue;
        if (!enemy.moveCooldown || enemy.moveCooldown <= 0) {
            const dirs = ['up', 'down', 'left', 'right'];
            enemy.dir = dirs[Math.floor(Math.random() * 4)];
            enemy.moveCooldown = 30 + Math.random() * 60;
        } else {
            enemy.moveCooldown--;
        }
        let dx = 0, dy = 0;
        switch (enemy.dir) {
            case 'up': dy = -ENEMY_SPEED; break;
            case 'down': dy = ENEMY_SPEED; break;
            case 'left': dx = -ENEMY_SPEED; break;
            case 'right': dx = ENEMY_SPEED; break;
        }
        let nx = enemy.x + dx;
        let ny = enemy.y + dy;
        if (canEnemyMoveTo(nx, ny)) {
            enemy.x = nx;
            enemy.y = ny;
        }
        if (Math.random() < 0.01) {
            enemyShoot(enemy);
        }
    }
    enemies = enemies.filter(e => e.alive);
    updateUI();
}

function drawEnemies() {
    for (let enemy of enemies) {
        if (!enemy.alive) continue;
        ctx.save();
        ctx.translate(enemy.x + ENEMY_SIZE / 2, enemy.y + ENEMY_SIZE / 2);
        switch (enemy.dir) {
            case 'up': ctx.rotate(0); break;
            case 'right': ctx.rotate(Math.PI / 2); break;
            case 'down': ctx.rotate(Math.PI); break;
            case 'left': ctx.rotate(-Math.PI / 2); break;
        }
        ctx.drawImage(enemyTankImg, -ENEMY_SIZE / 2, -ENEMY_SIZE / 2, ENEMY_SIZE, ENEMY_SIZE);
        ctx.restore();
    }
}

function checkBulletEnemyCollision() {
    if (!bullet) return;
    for (let enemy of enemies) {
        if (!enemy.alive) continue;
        if (
            bullet.x < enemy.x + ENEMY_SIZE &&
            bullet.x + BULLET_SIZE > enemy.x &&
            bullet.y < enemy.y + ENEMY_SIZE &&
            bullet.y + BULLET_SIZE > enemy.y
        ) {
            spawnParticles(enemy.x, enemy.y, '#f44'); // Partículas rojas para enemigo
            enemy.alive = false;
            bullet = null;
            score += 100;
            totalEnemiesEliminated++;
            updateUI();
            break;
        }
    }
}

function allEnemiesDefeated() {
    return enemiesToSpawn === 0 && enemies.length === 0;
}

// --- Balas de enemigos ---
const ENEMY_BULLET_SIZE = 8;
const ENEMY_BULLET_SPEED = 5;
let enemyBullets = [];

function enemyShoot(enemy) {
    // Verificar que el enemigo existe y está vivo
    if (!enemy || !enemy.alive) return;
    
    // Solo una bala por enemigo
    if (enemy.bullet) return;
    
    let bx = enemy.x + ENEMY_SIZE / 2 - ENEMY_BULLET_SIZE / 2;
    let by = enemy.y + ENEMY_SIZE / 2 - ENEMY_BULLET_SIZE / 2;
    enemy.bullet = {
        x: bx,
        y: by,
        dir: enemy.dir,
        owner: enemy
    };
    enemyBullets.push(enemy.bullet);
}

function updateEnemyBullets() {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        let b = enemyBullets[i];
        // Verificar que la bala existe y tiene las propiedades necesarias
        if (!b || typeof b.dir === 'undefined') {
            enemyBullets.splice(i, 1);
            continue;
        }
        let dx = 0, dy = 0;
        switch (b.dir) {
            case 'up': dy = -ENEMY_BULLET_SPEED; break;
            case 'down': dy = ENEMY_BULLET_SPEED; break;
            case 'left': dx = -ENEMY_BULLET_SPEED; break;
            case 'right': dx = ENEMY_BULLET_SPEED; break;
        }
        b.x += dx;
        b.y += dy;
        // Chequeo de colisión con bloques
        let bx = Math.floor(b.x / TILE_SIZE);
        let by = Math.floor(b.y / TILE_SIZE);
        const map = levels[currentLevel];
        let remove = false;
        if (bx < 0 || bx >= 13 || by < 0 || by >= 13) {
            remove = true;
        } else {
            let block = map[by][bx];
            if (block === 1) { // Ladrillo destruible
                map[by][bx] = 0;
                spawnParticles(bx * TILE_SIZE, by * TILE_SIZE);
                remove = true;
            }
        }
        // Colisión con jugador
        if (
            !player.invincible &&
            b.x < player.x + PLAYER_SIZE &&
            b.x + ENEMY_BULLET_SIZE > player.x &&
            b.y < player.y + PLAYER_SIZE &&
            b.y + ENEMY_BULLET_SIZE > player.y
        ) {
            spawnParticles(player.x, player.y, '#ff0'); // Partículas amarillas para jugador
            remove = true;
            loseLife();
        }
        if (remove) {
            if (b.owner) b.owner.bullet = null;
            enemyBullets.splice(i, 1);
        }
    }
}

function drawEnemyBullets() {
    for (let b of enemyBullets) {
        // Verificar que la bala existe y tiene las propiedades necesarias
        if (!b || typeof b.x === 'undefined' || typeof b.y === 'undefined') {
            continue;
        }
        ctx.save();
        ctx.fillStyle = '#0ff';
        ctx.fillRect(b.x, b.y, ENEMY_BULLET_SIZE, ENEMY_BULLET_SIZE);
        ctx.restore();
    }
}

function canEnemyMoveTo(nx, ny) {
    const map = levels[currentLevel];
    let corners = [
        {x: nx, y: ny},
        {x: nx + ENEMY_SIZE - 1, y: ny},
        {x: nx, y: ny + ENEMY_SIZE - 1},
        {x: nx + ENEMY_SIZE - 1, y: ny + ENEMY_SIZE - 1}
    ];
    for (let c of corners) {
        let px = Math.floor(c.x / TILE_SIZE);
        let py = Math.floor(c.y / TILE_SIZE);
        if (px < 0 || px >= 13 || py < 0 || py >= 13) return false;
        let block = map[py][px];
        if (block === 1) return false;
    }
    return true;
}

function gameLoop() {
    if (!gameActive) return;
    drawMap(currentLevel);
    updatePlayer();
    updateBullet();
    updateEnemies();
    updateEnemyBullets();
    updateParticles();
    checkBulletEnemyCollision();
    drawPlayer();
    drawBullet();
    drawEnemies();
    drawEnemyBullets();
    drawParticles();
    if (allEnemiesDefeated()) {
        setTimeout(() => {
            currentLevel = (currentLevel + 1) % levels.length;
            startLevel(currentLevel);
            gameLoopId = requestAnimationFrame(gameLoop);
        }, 1000);
        return;
    }
    gameLoopId = requestAnimationFrame(gameLoop);
}

let originalLevels = JSON.parse(JSON.stringify(levels));

function restoreLevelMap(levelIdx) {
    // Restaurar el mapa del nivel desde la copia original
    levels[levelIdx] = JSON.parse(JSON.stringify(originalLevels[levelIdx]));
}

// Modificar inicio de nivel para reiniciar enemigos
function startLevel(levelIdx) {
    restoreLevelMap(levelIdx);
    drawMap(levelIdx);
    resetPlayer();
    resetEnemies();
    clearAllBullets();
    clearAllParticles();
    updateUI();
}

// --- Controles de teclado ---
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Disparo con barra espaciadora
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        shoot();
    }
});

// --- Modificar el inicio del juego para inicializar jugador y loop ---
window.onload = () => {
    // Crear imágenes de tanques
    createTankImages();
    
    // Mostrar solo el menú de inicio
    document.getElementById('startMenu').style.display = 'flex';
    document.getElementById('ui').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'none';


    
    // Animar tanque del menú
    animateMenuTank();

    document.getElementById('startBtn').onclick = () => {
        document.getElementById('startMenu').style.display = 'none';
        document.getElementById('ui').style.display = 'block';
        document.getElementById('gameCanvas').style.display = 'block';
        // Limpiar todo antes de iniciar
        clearAllBullets();
        clearAllParticles();
        startLevel(currentLevel);
        resetPlayer();
        stopGameLoop();
        gameActive = true;
        gameLoopId = requestAnimationFrame(gameLoop);
    };
}; 