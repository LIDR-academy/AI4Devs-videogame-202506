const config = {
    type: Phaser.AUTO,
    width: 448,
    height: 496,
    parent: 'game-container',
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let pacman;
let cursors;
let speed = 2; // velocidad en píxeles por frame
let walls;
let dots;
let currentDirection = null;
let nextDirection = null;
let ghosts = [];
let ghostDirections = [];
let ghostSpeed = 2;
let gameOver = false;
let powerPellets = [];
let powerActive = false;
let powerTimer = null;
let score = 0;
let scoreText;
let ghostFlashTimer = null;
let gameOverText;
let level = 1;

// Matriz del laberinto: 0 = camino, 1 = pared, 2 = punto
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,2,1,2,1,2,1,2,1,2,1,2,2,1],
    [1,2,1,2,2,2,1,2,2,2,1,2,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,2,2,1],
    [1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,2,1,1,1,1,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,2,1,2,1,2,1,2,1,1,1,1],
    [1,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const TILE_SIZE = 32;
const GHOST_POSITIONS = [
    {row: 1, col: 12},
    {row: 13, col: 1},
    {row: 13, col: 12},
    {row: 7, col: 7}
];

function preload() {
    // No se necesitan imágenes por ahora
}

function create() {
    walls = this.physics.add.staticGroup();
    dots = this.physics.add.staticGroup();
    ghosts = [];
    ghostDirections = [];
    powerPellets = [];
    gameOver = false;
    score = 0;

    // Construir el laberinto a partir de la matriz
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            let x = col * TILE_SIZE + TILE_SIZE / 2;
            let y = row * TILE_SIZE + TILE_SIZE / 2;
            if (maze[row][col] === 1) {
                let wall = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0x0000ff).setOrigin(0.5);
                walls.add(wall);
            } else if (maze[row][col] === 2) {
                let dot = this.add.circle(x, y, 5, 0xffffff).setOrigin(0.5);
                dots.add(dot);
            }
        }
    }

    // Crear a Pac-Man en una celda de camino (por ejemplo, [1,1])
    let pacmanX = 1 * TILE_SIZE + TILE_SIZE / 2;
    let pacmanY = 1 * TILE_SIZE + TILE_SIZE / 2;
    pacman = this.add.circle(pacmanX, pacmanY, 16, 0xFFFF00);
    this.physics.add.existing(pacman);
    pacman.body.setCollideWorldBounds(true);
    pacman.body.setImmovable(true);

    // Crear fantasmas
    for (let i = 0; i < GHOST_POSITIONS.length; i++) {
        let pos = GHOST_POSITIONS[i];
        let ghostX = pos.col * TILE_SIZE + TILE_SIZE / 2;
        let ghostY = pos.row * TILE_SIZE + TILE_SIZE / 2;
        let ghost = this.add.circle(ghostX, ghostY, 16, 0xffffff);
        this.physics.add.existing(ghost);
        ghost.body.setImmovable(true);
        ghosts.push(ghost);
        ghostDirections.push(randomValidDirection(pos.row, pos.col));
    }

    // Crear power pellets aleatoriamente (uno por fantasma)
    for (let i = 0; i < GHOST_POSITIONS.length; i++) {
        let pelletPos = randomEmptyCell();
        if (!pelletPos) continue;
        // Si hay un punto blanco en la celda, eliminarlo
        dots.getChildren().forEach(dot => {
            let dotCol = Math.round((dot.x - TILE_SIZE / 2) / TILE_SIZE);
            let dotRow = Math.round((dot.y - TILE_SIZE / 2) / TILE_SIZE);
            if (dotCol === pelletPos.col && dotRow === pelletPos.row) {
                dot.destroy();
            }
        });
        let pelletX = pelletPos.col * TILE_SIZE + TILE_SIZE / 2;
        let pelletY = pelletPos.row * TILE_SIZE + TILE_SIZE / 2;
        let pellet = this.add.circle(pelletX, pelletY, 8, 0xff0000).setOrigin(0.5);
        this.physics.add.existing(pellet);
        pellet.body.setImmovable(true);
        powerPellets.push(pellet);
    }

    // Colisiones
    this.physics.add.collider(pacman, walls);
    this.physics.add.overlap(pacman, dots, eatDot, null, this);
    for (let ghost of ghosts) {
        this.physics.add.overlap(pacman, ghost, hitGhost, null, this);
    }
    for (let pellet of powerPellets) {
        this.physics.add.overlap(pacman, pellet, eatPowerPellet, null, this);
    }

    // Controles de teclado
    cursors = this.input.keyboard.createCursorKeys();
    currentDirection = null;
    nextDirection = null;

    // Mostrar puntaje
    scoreText = this.add.text(10, 10, 'Puntaje: 0', { font: '20px Arial', fill: '#fff' }).setScrollFactor(0);
}

function update() {
    if (gameOver) return;

    // Movimiento de Pac-Man (tile-based)
    if (cursors.left.isDown) nextDirection = 'left';
    else if (cursors.right.isDown) nextDirection = 'right';
    else if (cursors.up.isDown) nextDirection = 'up';
    else if (cursors.down.isDown) nextDirection = 'down';

    let col = Math.round((pacman.x - TILE_SIZE / 2) / TILE_SIZE);
    let row = Math.round((pacman.y - TILE_SIZE / 2) / TILE_SIZE);
    let centerX = col * TILE_SIZE + TILE_SIZE / 2;
    let centerY = row * TILE_SIZE + TILE_SIZE / 2;

    if (Math.abs(pacman.x - centerX) < 2 && Math.abs(pacman.y - centerY) < 2) {
        pacman.x = centerX;
        pacman.y = centerY;
        if (canMove(row, col, nextDirection)) {
            currentDirection = nextDirection;
        }
        if (!canMove(row, col, currentDirection)) {
            currentDirection = null;
        }
    }

    if (currentDirection === 'left') pacman.x -= speed;
    else if (currentDirection === 'right') pacman.x += speed;
    else if (currentDirection === 'up') pacman.y -= speed;
    else if (currentDirection === 'down') pacman.y += speed;

    // Movimiento de fantasmas
    for (let i = 0; i < ghosts.length; i++) {
        let ghost = ghosts[i];
        let gCol = Math.round((ghost.x - TILE_SIZE / 2) / TILE_SIZE);
        let gRow = Math.round((ghost.y - TILE_SIZE / 2) / TILE_SIZE);
        let gCenterX = gCol * TILE_SIZE + TILE_SIZE / 2;
        let gCenterY = gRow * TILE_SIZE + TILE_SIZE / 2;

        // Si está alineado con el centro de una celda, decidir nueva dirección si es necesario
        if (Math.abs(ghost.x - gCenterX) < 2 && Math.abs(ghost.y - gCenterY) < 2) {
            ghost.x = gCenterX;
            ghost.y = gCenterY;
            // Obtener direcciones válidas (no reversa)
            let validDirs = validGhostDirections(gRow, gCol, ghostDirections[i]);
            // Elegir aleatoriamente una dirección válida
            if (validDirs.length > 0) {
                ghostDirections[i] = validDirs[Math.floor(Math.random() * validDirs.length)];
            }
        }
        // Mover fantasma
        if (ghostDirections[i] === 'left') ghost.x -= ghostSpeed;
        else if (ghostDirections[i] === 'right') ghost.x += ghostSpeed;
        else if (ghostDirections[i] === 'up') ghost.y -= ghostSpeed;
        else if (ghostDirections[i] === 'down') ghost.y += ghostSpeed;
    }

    // Verificar victoria
    if (dots.countActive(true) === 0 && !gameOver) {
        gameOver = true;
        // Mostrar mensaje de victoria en el centro
        if (!gameOverText) {
            gameOverText = pacman.scene.add.text(
                config.width / 2,
                config.height / 2,
                '¡GANASTE!',
                { font: '48px Arial', fill: '#00ff00', fontWeight: 'bold' }
            ).setOrigin(0.5);
        } else {
            gameOverText.setText('¡GANASTE!');
            gameOverText.setVisible(true);
        }
        setTimeout(() => {
            const continuar = confirm('¡Ganaste! ¿Deseas continuar a otro nivel? (Aceptar = Sí, Cancelar = Finalizar)');
            if (continuar) {
                nextLevel(pacman.scene);
            } else {
                setTimeout(() => {
                    alert('¡Gracias por jugar! Puedes cerrar la pestaña cuando quieras.');
                }, 100);
            }
        }, 500);
    }
}

function canMove(row, col, direction) {
    if (!direction) return false;
    if (direction === 'left') return maze[row][col - 1] !== 1;
    if (direction === 'right') return maze[row][col + 1] !== 1;
    if (direction === 'up') return maze[row - 1]?.[col] !== 1;
    if (direction === 'down') return maze[row + 1]?.[col] !== 1;
    return false;
}

function eatDot(pacman, dot) {
    dot.destroy();
    score += 1;
    scoreText.setText('Puntaje: ' + score);
}

function eatPowerPellet(pacman, pellet) {
    pellet.destroy();
    powerActive = true;
    if (powerTimer) clearTimeout(powerTimer);
    if (ghostFlashTimer) clearInterval(ghostFlashTimer);
    let flash = false;
    // Cambiar fantasmas a azul y titilar
    ghostFlashTimer = setInterval(() => {
        for (let ghost of ghosts) {
            if (!ghost.active) continue;
            ghost.fillColor = flash ? 0x0000ff : 0xffffff;
        }
        flash = !flash;
    }, 300);
    powerTimer = setTimeout(() => {
        powerActive = false;
        clearInterval(ghostFlashTimer);
        for (let ghost of ghosts) {
            if (ghost.active) ghost.fillColor = 0xffffff;
        }
    }, 6000);
}

function hitGhost(pacman, ghost) {
    if (powerActive) {
        // Destruir fantasma y sumar puntos
        ghost.destroy();
        score += 5;
        scoreText.setText('Puntaje: ' + score);
    } else {
        gameOver = true;
        // Mostrar mensaje de Game Over en el centro
        if (!gameOverText) {
            gameOverText = pacman.scene.add.text(
                config.width / 2,
                config.height / 2,
                'GAME OVER',
                { font: '48px Arial', fill: '#ff0000', fontWeight: 'bold' }
            ).setOrigin(0.5);
        } else {
            gameOverText.setVisible(true);
        }
        setTimeout(() => {
            const reiniciar = confirm('¡Has perdido! Pac-Man fue atrapado por un fantasma.\n¿Quieres reiniciar el juego? (Aceptar = Reiniciar, Cancelar = Salir)');
            if (reiniciar) {
                location.reload();
            } else {
                setTimeout(() => {
                    alert('¡Gracias por jugar! Puedes cerrar la pestaña cuando quieras.');
                }, 100);
            }
        }, 500);
    }
}

function randomValidDirection(row, col) {
    let dirs = [];
    if (canMove(row, col, 'left')) dirs.push('left');
    if (canMove(row, col, 'right')) dirs.push('right');
    if (canMove(row, col, 'up')) dirs.push('up');
    if (canMove(row, col, 'down')) dirs.push('down');
    return dirs[Math.floor(Math.random() * dirs.length)] || 'left';
}

function validGhostDirections(row, col, prevDir) {
    // No permitir reversa directa
    const opposites = {left: 'right', right: 'left', up: 'down', down: 'up'};
    let dirs = [];
    if (canMove(row, col, 'left') && prevDir !== 'right') dirs.push('left');
    if (canMove(row, col, 'right') && prevDir !== 'left') dirs.push('right');
    if (canMove(row, col, 'up') && prevDir !== 'down') dirs.push('up');
    if (canMove(row, col, 'down') && prevDir !== 'up') dirs.push('down');
    // Si no hay más opción, permitir reversa
    if (dirs.length === 0 && prevDir) dirs.push(opposites[prevDir]);
    return dirs;
}

function randomEmptyCell() {
    let emptyCells = [];
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 0 || maze[row][col] === 2) {
                // Verificar que no haya ya un pellet en esa celda
                let pelletExists = powerPellets.some(pellet => {
                    let pelletCol = Math.round((pellet.x - TILE_SIZE / 2) / TILE_SIZE);
                    let pelletRow = Math.round((pellet.y - TILE_SIZE / 2) / TILE_SIZE);
                    return pelletCol === col && pelletRow === row;
                });
                if (!pelletExists) {
                    emptyCells.push({ row, col });
                }
            }
        }
    }
    if (emptyCells.length === 0) return null;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function nextLevel(scene) {
    // Aumentar nivel y velocidad
    level++;
    speed += 0.5;
    ghostSpeed += 0.5;
    // Limpiar escena
    if (gameOverText) gameOverText.setVisible(false);
    for (let ghost of ghosts) if (ghost.active) ghost.destroy();
    for (let pellet of powerPellets) if (pellet.active) pellet.destroy();
    for (let dot of dots.getChildren()) if (dot.active) dot.destroy();
    pacman.destroy();
    // Generar nuevo laberinto (puedes mejorar esto para hacerlo aleatorio)
    // Por ahora, simplemente reiniciamos el mismo laberinto
    scene.scene.restart();
} 