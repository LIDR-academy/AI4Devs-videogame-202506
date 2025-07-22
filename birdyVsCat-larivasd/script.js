

// --- Flappy Bird Clone Complete Logic ---

// Asset paths
const ASSETS = {
    backgrounds: [
        'assets/fondos.jpg',
        'assets/fondos2.jpg',
        'assets/fondos3.jpg',
        'assets/fondos4.jpg',
        'assets/fondos5.jpg',
        'assets/fondos6.jpg',
        'assets/fondos7.jpg',
        'assets/fondos8.jpg',
    ],
    bird: ['assets/bird2.png', 'assets/bird.png'],
    pipeTop: 'assets/superior.png',
    pipeBottom: 'assets/inferior.png',
};

// Game state
let gameState = 'start'; // start, playing, gameover
let score = 0;
let obstaclesPassed = 0;
let currentBackground = 0;
let usedBackgrounds = [0];

// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI elements
const playBtn = document.getElementById('play-btn');
const retryBtn = document.getElementById('retry-btn');
const gameOverDiv = document.getElementById('game-over');
const summary = document.getElementById('summary');
const scoreDiv = document.getElementById('score');

// Game constants
const BIRD_X = 80;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 32;
const PIPE_WIDTH = 60;
const PIPE_GAP = 140;
const PIPE_MIN_HEIGHT = 60;
const PIPE_SPEED = 1; // Más lento
const PIPE_VERTICAL_RANGE = 1; // Reducido a la mitad
const PIPE_VERTICAL_SPEED = 0.15; // Velocidad vertical de los tubos
const GRAVITY = 0.08; // Un poco más suave
const JUMP = -2.8; // Un poco más alto
const FPS = 60;

// Game objects
let bird, pipes, pipeTimer, bgImages, birdSprites, pipeTopImg, pipeBottomImg, bgImg;
let birdFrame = 0;
let birdFlapTimeout = null;

function preloadImages(paths, cb) {
    let loaded = 0;
    const imgs = [];
    for (let i = 0; i < paths.length; i++) {
        imgs[i] = new Image();
        imgs[i].src = paths[i];
        imgs[i].onload = () => {
            loaded++;
            if (loaded === paths.length) cb(imgs);
        };
    }
}

function resetBackgrounds() {
    currentBackground = 0;
    usedBackgrounds = [0];
    bgImg = bgImages[0];
}

function randomBackground() {
    // Exclude fondos.jpg (index 0) and already used
    const available = bgImages.map((img, i) => i).filter(i => i !== 0 && !usedBackgrounds.includes(i));
    if (available.length === 0) return 0; // fallback
    const idx = available[Math.floor(Math.random() * available.length)];
    usedBackgrounds.push(idx);
    return idx;
}

function initGame() {
    score = 0;
    obstaclesPassed = 0;
    resetBackgrounds();
    // Bird
    bird = {
        x: BIRD_X,
        y: canvas.height / 2 - BIRD_HEIGHT / 2,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT,
        velocity: 0,
        alive: true
    };
    // Pipes
    pipes = [];
    pipeTimer = 0;
    // Initial pipes: cada uno con posición vertical y offset únicos
    const minY = PIPE_MIN_HEIGHT;
    const maxY = canvas.height - PIPE_MIN_HEIGHT - PIPE_GAP;
    for (let i = 0; i < 3; i++) {
        // Generar gapY y vOffset únicos para cada tubo
        const gapY = minY + Math.random() * (maxY - minY);
        const vDir = Math.random() < 0.5 ? -1 : 1;
        const vSpeed = PIPE_VERTICAL_SPEED + Math.random() * PIPE_VERTICAL_SPEED * 0.5; // Usar la constante
        const vOffset = (Math.random() - 0.5) * PIPE_VERTICAL_RANGE;
        pipes.push({
            x: canvas.width + i * 250, // Aumentar separación inicial entre tubos
            gapY,
            vDir,
            vSpeed,
            vOffset,
            vMax: PIPE_VERTICAL_RANGE * (0.7 + Math.random() * 0.7),
            passed: false
        });
    }
}

function spawnPipe() {
    // Separación mínima entre tubos
    const minY = PIPE_MIN_HEIGHT;
    const maxY = canvas.height - PIPE_MIN_HEIGHT - PIPE_GAP;
    let gapY;
    const MIN_VERTICAL_SEPARATION = 60; // px, separación mínima jugable
    let lastGapY = pipes.length > 0 ? pipes[pipes.length - 1].gapY : null;
    let attempts = 0;
    do {
        gapY = minY + Math.random() * (maxY - minY);
        attempts++;
    } while (lastGapY !== null && Math.abs(gapY - lastGapY) < MIN_VERTICAL_SEPARATION && attempts < 10);

    // Generar movimiento vertical aleatorio para el nuevo tubo
    const vDir = Math.random() < 0.5 ? -1 : 1;
    const vSpeed = PIPE_VERTICAL_SPEED + Math.random() * PIPE_VERTICAL_SPEED * 0.5; // Usar la constante
    const vOffset = (Math.random() - 0.5) * PIPE_VERTICAL_RANGE;
    const vMax = PIPE_VERTICAL_RANGE * (0.7 + Math.random() * 0.7);

    pipes.push({
        x: canvas.width,
        gapY,
        vDir,
        vSpeed,
        vOffset,
        vMax,
        passed: false
    });
}

function updateBird() {
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;
    // Floor and ceiling
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
        bird.alive = false;
    }
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function updatePipes() {
    for (let pipe of pipes) {
        pipe.x -= PIPE_SPEED;
        
        // Movimiento vertical continuo de los tubos (bucle infinito)
        if (pipe.vDir !== 0) {
            // Aplicar el offset al gapY de forma continua
            pipe.gapY += pipe.vDir * pipe.vSpeed;
            
            // Asegurar que los tubos no se salgan de los límites del canvas
            const minY = PIPE_MIN_HEIGHT;
            const maxY = canvas.height - PIPE_MIN_HEIGHT - PIPE_GAP;
            
            // Cuando llega a los límites, cambiar dirección para crear bucle continuo
            if (pipe.gapY <= minY) {
                pipe.gapY = minY;
                pipe.vDir = 1; // Cambiar a dirección hacia abajo
            } else if (pipe.gapY >= maxY) {
                pipe.gapY = maxY;
                pipe.vDir = -1; // Cambiar a dirección hacia arriba
            }
        }
    }
    
    // Remove pipes out of screen
    while (pipes.length && pipes[0].x + PIPE_WIDTH < 0) pipes.shift();
    
    // Spawn new pipe con separación horizontal adecuada
    pipeTimer++;
    if (pipeTimer > 120) { // Aumentar el tiempo entre tubos para mejor separación
        // Verificar que el último tubo esté suficientemente lejos
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
            spawnPipe();
            pipeTimer = 0;
        }
    }
}

function checkCollisions() {
    for (let pipe of pipes) {
        // Top pipe
        let topRect = {
            x: pipe.x,
            y: pipe.gapY - 320,
            width: PIPE_WIDTH,
            height: 320
        };
        // Bottom pipe
        let botRect = {
            x: pipe.x,
            y: pipe.gapY + PIPE_GAP,
            width: PIPE_WIDTH,
            height: 320
        };
        if (rectsCollide(bird, topRect) || rectsCollide(bird, botRect)) {
            bird.alive = false;
        }
        // Score
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
            pipe.passed = true;
            score++;
            obstaclesPassed++;
            scoreDiv.textContent = score;
            // Change background every 10 obstacles
            if (obstaclesPassed % 5 === 0) {
                let idx = randomBackground();
                if (idx !== 0) bgImg = bgImages[idx];
            }
        }
    }
}

function rectsCollide(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function drawBackground() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawPipes() {
    for (let pipe of pipes) {
        // Tubo superior
        ctx.drawImage(pipeTopImg, pipe.x, pipe.gapY - 320, PIPE_WIDTH, 320);
        // Tubo inferior
        ctx.drawImage(pipeBottomImg, pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, 320);
    }
}

function drawBird() {
    ctx.drawImage(birdSprites[birdFrame], bird.x, bird.y, bird.width, bird.height);
}

function drawScore() {
    // Score is drawn in UI, but you can add effects here if needed
}

function gameLoop() {
    if (gameState !== 'playing') return;
    // Update
    updateBird();
    updatePipes();
    checkCollisions();
    // Draw
    drawBackground();
    drawPipes();
    drawBird();
    drawScore();
    // End game if dead
    if (!bird.alive) {
        setTimeout(endGame, 500);
        return;
    }
    requestAnimationFrame(gameLoop);
}

function flapBird() {
    bird.velocity = JUMP;
    birdFrame = 1;
    if (birdFlapTimeout) clearTimeout(birdFlapTimeout);
    birdFlapTimeout = setTimeout(() => {
        birdFrame = 0;
    }, 120);
}

// Event listeners
playBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', startGame);
canvas.addEventListener('mousedown', () => {
    if (gameState === 'playing' && bird.alive) {
        flapBird();
    }
});
document.addEventListener('keydown', (e) => {
    if (gameState === 'playing' && bird.alive && (e.code === 'Space' || e.code === 'ArrowUp')) {
        flapBird();
    }
});

function startGame() {
    gameState = 'playing';
    playBtn.style.display = 'none';
    gameOverDiv.classList.add('hidden');
    scoreDiv.textContent = '0';
    initGame();
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameState = 'gameover';
    summary.textContent = `Obstáculos superados: ${score}`;
    gameOverDiv.classList.remove('hidden');
    playBtn.style.display = 'none';
}

// Preload all images before starting
window.onload = function () {
    preloadImages(ASSETS.backgrounds, (bgs) => {
        bgImages = bgs;
        preloadImages(ASSETS.bird, (birds) => {
            birdSprites = birds;
            pipeTopImg = new Image();
            pipeTopImg.src = ASSETS.pipeTop;
            pipeBottomImg = new Image();
            pipeBottomImg.src = ASSETS.pipeBottom;
            bgImg = bgImages[0];
            // Initial UI state
            playBtn.style.display = 'block';
            gameOverDiv.classList.add('hidden');
            scoreDiv.textContent = '0';
            drawBackground();
        });
    });
}
