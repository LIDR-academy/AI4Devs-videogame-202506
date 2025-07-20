// Constantes del juego
const GAME_CONFIG = {
    CANVAS_WIDTH: 832,
    CANVAS_HEIGHT: 832,
    TILE_SIZE: 32,
    GRID_WIDTH: 26,
    GRID_HEIGHT: 26,
    TANK_SIZE: 32,
    BULLET_SIZE: 8,
    BULLET_SPEED: 8,
    MAX_ENEMIES_ON_SCREEN: 4,
    TOTAL_ENEMIES_PER_LEVEL: 20,
    PLAYER_LIVES: 3,
    BASE_POSITION: { x: 12, y: 24 }, // Posición de la base en la grilla
    SCALE_FACTOR: 1 // Factor de escala dinámico
};

// Tipos de tiles del mapa
const TILE_TYPES = {
    EMPTY: 0,
    BRICK: 1,
    STEEL: 2,
    WATER: 3,
    TREES: 4,
    ICE: 5,
    BASE: 6
};

// Direcciones
const DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};

// Tipos de tanques enemigos
const ENEMY_TYPES = {
    BASIC: { 
        speed: 1, 
        health: 1, 
        points: 100, 
        color: '#808080',
        bulletSpeed: 1,
        shootInterval: 2000,
        name: 'Básico'
    },
    FAST: { 
        speed: 2.5, 
        health: 1, 
        points: 200, 
        color: '#ff6600',
        bulletSpeed: 1.2,
        shootInterval: 1500,
        name: 'Rápido'
    },
    POWER: { 
        speed: 1, 
        health: 4, 
        points: 300, 
        color: '#00ff00',
        bulletSpeed: 1.5,
        shootInterval: 1800,
        name: 'Blindado'
    },
    ARMOR: { 
        speed: 0.8, 
        health: 4, 
        points: 400, 
        color: '#ffff00',
        bulletSpeed: 1,
        shootInterval: 2500,
        name: 'Pesado'
    },
    BONUS: {
        speed: 1.5,
        health: 1,
        points: 500,
        color: '#ff69b4',
        bulletSpeed: 1,
        shootInterval: 2000,
        name: 'Bonus',
        flashing: true // Tanque parpadeante que deja power-up
    }
};

// Tipos de power-ups
const POWERUP_TYPES = {
    BOMB: { 
        color: '#ff0000', 
        duration: 0,
        name: 'Bomba',
        description: 'Elimina todos los enemigos en pantalla'
    },
    HELMET: { 
        color: '#ffff00', 
        duration: 10000,
        name: 'Casco',
        description: 'Invulnerabilidad temporal'
    },
    SHOVEL: { 
        color: '#808080', 
        duration: 20000,
        name: 'Pala',
        description: 'Fortifica la base con acero'
    },
    STAR: { 
        color: '#ffffff', 
        duration: 0,
        name: 'Estrella',
        description: 'Mejora el tanque del jugador'
    },
    TANK: { 
        color: '#00ff00', 
        duration: 0,
        name: 'Tanque',
        description: 'Vida extra'
    },
    CLOCK: { 
        color: '#00ffff', 
        duration: 8000,
        name: 'Reloj',
        description: 'Congela enemigos temporalmente'
    }
};

// Teclas de control
const KEYS = {
    // Jugador 1
    W: 87, A: 65, S: 83, D: 68, SPACE: 32,
    // Jugador 2
    UP: 38, LEFT: 37, DOWN: 40, RIGHT: 39, ENTER: 13,
    // Generales
    P: 80, ESC: 27
};

// Utilidades matemáticas
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    }

    distance(vector) {
        return this.subtract(vector).magnitude();
    }

    copy() {
        return new Vector2(this.x, this.y);
    }
}

// Utilidades generales
class Utils {
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static rectangleIntersection(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    static gridToPixel(gridX, gridY) {
        return {
            x: gridX * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
            y: gridY * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2
        };
    }

    static pixelToGrid(pixelX, pixelY) {
        return {
            x: Math.floor(pixelX / GAME_CONFIG.TILE_SIZE),
            y: Math.floor(pixelY / GAME_CONFIG.TILE_SIZE)
        };
    }

    static isValidGridPosition(gridX, gridY) {
        return gridX >= 0 && gridX < GAME_CONFIG.GRID_WIDTH &&
               gridY >= 0 && gridY < GAME_CONFIG.GRID_HEIGHT;
    }

    static getDirectionVector(direction) {
        switch (direction) {
            case DIRECTIONS.UP: return new Vector2(0, -1);
            case DIRECTIONS.RIGHT: return new Vector2(1, 0);
            case DIRECTIONS.DOWN: return new Vector2(0, 1);
            case DIRECTIONS.LEFT: return new Vector2(-1, 0);
            default: return new Vector2(0, 0);
        }
    }

    static getOppositeDirection(direction) {
        return (direction + 2) % 4;
    }

    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    static radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    static formatScore(score) {
        return score.toString().padStart(6, '0');
    }

    static formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Gestor de entrada de teclado
class InputManager {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.keyCode] = true;
            // Prevenir comportamiento por defecto para teclas de juego
            if (Object.values(KEYS).includes(e.keyCode)) {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false;
        });

        // Manejar pérdida de foco
        window.addEventListener('blur', () => {
            this.keys = {};
        });
    }

    isKeyDown(keyCode) {
        return !!this.keys[keyCode];
    }

    isKeyPressed(keyCode) {
        return this.keys[keyCode] && !this.previousKeys[keyCode];
    }

    isKeyReleased(keyCode) {
        return !this.keys[keyCode] && this.previousKeys[keyCode];
    }

    update() {
        this.previousKeys = { ...this.keys };
    }
}

// Gestor de sonidos (placeholder para futura implementación)
class SoundManager {
    constructor() {
        this.sounds = {};
        this.muted = false;
    }

    loadSound(name, src) {
        // Implementación futura para cargar sonidos
    }

    playSound(name, volume = 1) {
        // Implementación futura para reproducir sonidos
        if (!this.muted && this.sounds[name]) {
            // Reproducir sonido
        }
    }

    setMuted(muted) {
        this.muted = muted;
    }
}

// Gestor de animaciones
class AnimationManager {
    constructor() {
        this.animations = [];
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    update(deltaTime) {
        this.animations = this.animations.filter(animation => {
            animation.update(deltaTime);
            return !animation.isFinished();
        });
    }

    draw(ctx) {
        this.animations.forEach(animation => animation.draw(ctx));
    }

    clear() {
        this.animations = [];
    }
}

// Clase para animaciones simples
class Animation {
    constructor(x, y, duration, type = 'explosion') {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.elapsed = 0;
        this.type = type;
        this.finished = false;
    }

    update(deltaTime) {
        this.elapsed += deltaTime;
        if (this.elapsed >= this.duration) {
            this.finished = true;
        }
    }

    draw(ctx) {
        if (this.finished) return;

        const progress = this.elapsed / this.duration;
        
        if (this.type === 'explosion') {
            this.drawExplosion(ctx, progress);
        }
    }

    drawExplosion(ctx, progress) {
        const size = 32 * (1 + progress);
        const alpha = 1 - progress;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${progress * 60}, 100%, 50%)`;
        ctx.fillRect(this.x - size/2, this.y - size/2, size, size);
        ctx.restore();
    }

    isFinished() {
        return this.finished;
    }
}

// Gestor de escalado responsivo
class ResponsiveManager {
    constructor() {
        this.canvas = null;
        this.baseWidth = GAME_CONFIG.CANVAS_WIDTH;
        this.baseHeight = GAME_CONFIG.CANVAS_HEIGHT;
        this.currentScale = 1;
        this.actualCanvasWidth = this.baseWidth;
        this.actualCanvasHeight = this.baseHeight;
    }

    initialize(canvas) {
        this.canvas = canvas;
        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        if (!this.canvas) return;

        // Configurar el canvas con resolución base
        this.canvas.width = this.baseWidth;
        this.canvas.height = this.baseHeight;
        
        // Aplicar escalado inicial
        this.updateCanvasSize();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.updateCanvasSize();
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.updateCanvasSize();
            }, 100);
        });
    }

    updateCanvasSize() {
        if (!this.canvas) return;

        const container = this.canvas.parentElement;
        if (!container) return;

        // Calcular el espacio disponible
        const maxWidth = Math.min(window.innerWidth * 0.9, container.offsetWidth);
        const maxHeight = Math.min(window.innerHeight * 0.7, container.offsetHeight);

        // Calcular el factor de escala manteniendo la proporción
        const scaleX = maxWidth / this.baseWidth;
        const scaleY = maxHeight / this.baseHeight;
        const scale = Math.min(scaleX, scaleY, 1); // No escalar más grande que el original

        // Aplicar el nuevo tamaño
        this.currentScale = scale;
        this.actualCanvasWidth = this.baseWidth * scale;
        this.actualCanvasHeight = this.baseHeight * scale;

        // Actualizar el CSS del canvas
        this.canvas.style.width = this.actualCanvasWidth + 'px';
        this.canvas.style.height = this.actualCanvasHeight + 'px';

        // Actualizar el factor de escala global
        GAME_CONFIG.SCALE_FACTOR = scale;

        console.log(`Canvas scaled to: ${this.actualCanvasWidth}x${this.actualCanvasHeight} (${(scale * 100).toFixed(1)}%)`);
    }

    getScale() {
        return this.currentScale;
    }

    getActualSize() {
        return {
            width: this.actualCanvasWidth,
            height: this.actualCanvasHeight
        };
    }

    // Convertir coordenadas de pantalla a coordenadas del juego
    screenToGame(screenX, screenY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (screenX - rect.left) / this.currentScale;
        const y = (screenY - rect.top) / this.currentScale;
        return { x, y };
    }

    // Convertir coordenadas del juego a coordenadas de pantalla
    gameToScreen(gameX, gameY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (gameX * this.currentScale) + rect.left;
        const y = (gameY * this.currentScale) + rect.top;
        return { x, y };
    }
}

// Instancias globales
const inputManager = new InputManager();
const soundManager = new SoundManager();
const animationManager = new AnimationManager();
const responsiveManager = new ResponsiveManager();
