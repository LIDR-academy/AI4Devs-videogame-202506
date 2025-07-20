// --- Parámetros del laberinto ---
const MAZE_ROWS = 15;
const MAZE_COLS = 15;
const CELL_SIZE = 40; // Cada celda será de 40x40 px

// --- Generación de laberinto (DFS) ---
function generateMaze(rows, cols) {
    // 0 = pared, 1 = camino
    let maze = Array.from({ length: rows }, () => Array(cols).fill(0));
    let stack = [];
    let visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function carve(x, y) {
        visited[y][x] = true;
        maze[y][x] = 1;
        let dirs = shuffle([
            [0, -1], // arriba
            [1, 0],  // derecha
            [0, 1],  // abajo
            [-1, 0]  // izquierda
        ]);
        for (let [dx, dy] of dirs) {
            let nx = x + dx * 2;
            let ny = y + dy * 2;
            if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && !visited[ny][nx]) {
                maze[y + dy][x + dx] = 1;
                carve(nx, ny);
            }
        }
    }
    carve(0, 0);
    return maze;
}

// --- Phaser config ---
const config = {
    type: Phaser.AUTO,
    width: MAZE_COLS * CELL_SIZE,
    height: MAZE_ROWS * CELL_SIZE,
    parent: 'game-container',
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
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

let player;
let cursors;
let throwKey;
let facing = 'right';
let canThrow = true;
let maze;
let walls;
let goal;
let walkAnimTimer = 0;
let walkAnimFrame = 1;
let gameOver = false;

function preload() {
    this.load.image('stay', 'assets/images/stay.png');
    this.load.image('jump', 'assets/images/jump.png');
    this.load.image('walk_right_1', 'assets/images/walk_right_1.png');
    this.load.image('walk_right_2', 'assets/images/walk_right_2.png');
    this.load.image('walk_left_1', 'assets/images/walk_left_1.png');
    this.load.image('walk_left_2', 'assets/images/walk_left_2.png');
    this.load.image('throw', 'assets/images/throw.png');
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('wall', 'assets/images/wall.png');
    this.load.image('prize', 'assets/images/prize.png');
    this.load.image('winner', 'assets/images/winner.png'); // Asset para la pantalla final
}

function create() {
    maze = generateMaze(MAZE_ROWS, MAZE_COLS);
    walls = this.physics.add.staticGroup();
    gameOver = false;

    // Dibujar el laberinto usando wall.png para las paredes
    for (let y = 0; y < MAZE_ROWS; y++) {
        for (let x = 0; x < MAZE_COLS; x++) {
            if (maze[y][x] === 0) {
                let wall = walls.create(x * CELL_SIZE + CELL_SIZE/2, y * CELL_SIZE + CELL_SIZE/2, 'wall');
                wall.setDisplaySize(CELL_SIZE, CELL_SIZE).refreshBody();
                let angle = Phaser.Math.Between(0, 3) * 90;
                wall.setAngle(angle);
            }
        }
    }

    // Crear el personaje principal (perro) en la entrada
    player = this.physics.add.sprite(CELL_SIZE/2, CELL_SIZE/2, 'stay');
    player.setCollideWorldBounds(true);
    player.setSize(38, 38);
    player.body.setAllowGravity(false);

    // Meta (esquina opuesta) usando prize.png
    let goalX = MAZE_COLS - 1;
    let goalY = MAZE_ROWS - 1;
    if (maze[goalY][goalX] === 0) {
        let found = false;
        for (let y = MAZE_ROWS - 1; y >= 0 && !found; y--) {
            for (let x = MAZE_COLS - 1; x >= 0; x--) {
                if (maze[y][x] === 1) {
                    goalX = x;
                    goalY = y;
                    found = true;
                    break;
                }
            }
        }
    }
    goal = this.physics.add.staticImage(goalX * CELL_SIZE + CELL_SIZE/2, goalY * CELL_SIZE + CELL_SIZE/2, 'prize');
    goal.setDisplaySize(CELL_SIZE, CELL_SIZE);

    // Colisiones
    this.physics.add.collider(player, walls);

    // Controles
    cursors = this.input.keyboard.createCursorKeys();
    throwKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Checar llegada a la meta
    this.physics.add.overlap(player, goal, () => {
        // Elimina todos los objetos del juego
        player.destroy();
        goal.destroy();
        walls.clear(true, true);
        gameOver = true;

        // Fondo oscuro
        this.add.rectangle(config.width/2, config.height/2, config.width, config.height, 0x222222, 1);

        // Mensaje de victoria
        this.add.text(config.width/2, config.height/2 - 120, '¡Felicidades!', { fontSize: '40px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.image(config.width/2, config.height/2, 'winner').setDisplaySize(200, 200).setOrigin(0.5);
        this.add.text(config.width/2, config.height/2 + 140, 'Shiro ya no pasará hambre', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);

        // Esperar barra espaciadora para reiniciar
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.restart();
        });
    });
}

function update(time, delta) {
    if (gameOver) return;
    let speed = 180; // 120 * 1.5 = 180 (aumenta la velocidad un 50%)
    let moving = false;
    if (cursors.left.isDown) {
        player.setVelocity(-speed, 0);
        facing = 'left';
        moving = true;
        walkAnimTimer += delta;
        if (walkAnimTimer > 120) {
            walkAnimFrame = walkAnimFrame === 1 ? 2 : 1;
            player.setTexture('walk_left_' + walkAnimFrame);
            walkAnimTimer = 0;
        }
    } else if (cursors.right.isDown) {
        player.setVelocity(speed, 0);
        facing = 'right';
        moving = true;
        walkAnimTimer += delta;
        if (walkAnimTimer > 120) {
            walkAnimFrame = walkAnimFrame === 1 ? 2 : 1;
            player.setTexture('walk_right_' + walkAnimFrame);
            walkAnimTimer = 0;
        }
    } else if (cursors.up.isDown) {
        player.setVelocity(0, -speed);
        player.setTexture('jump');
    } else if (cursors.down.isDown) {
        player.setVelocity(0, speed);
        player.setTexture('jump');
    } else {
        player.setVelocity(0, 0);
        player.setTexture('stay');
    }
}

function throwObject(scene, x, y, direction) {
    const ball = scene.physics.add.image(x, y, 'ball');
    ball.setScale(0.7);
    ball.setCollideWorldBounds(true);
    ball.setBounce(0.6);
    ball.body.setAllowGravity(false);
    if (direction === 'right') {
        ball.setVelocity(350, 0);
    } else if (direction === 'left') {
        ball.setVelocity(-350, 0);
    } else {
        ball.setVelocity(0, 0);
    }
    scene.time.delayedCall(2000, () => {
        ball.destroy();
    });
}
