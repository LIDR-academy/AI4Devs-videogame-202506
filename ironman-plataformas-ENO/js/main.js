/**
 * Iron Man vs Ultron - Juego de Plataformas
 * Archivo principal de configuración de Phaser 3
 * Fase 1: Configuración básica y estructura inicial
 */

// Configuración del juego
const gameConfig = {
    type: Phaser.AUTO, // Usar WebGL si está disponible, sino Canvas
    width: 1024,       // Ancho del canvas
    height: 576,       // Alto del canvas
    parent: 'game-canvas', // ID del contenedor HTML
    backgroundColor: '#87CEEB', // Fondo azul cielo hermoso estilo Rayman Legends
    
    // Configuración de físicas
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 }, // Gravedad hacia abajo
            debug: false         // Desactivar debug por defecto
        }
    },
    
    // Configuración de escenas
    scene: [
        MenuScene,    // Escena del menú principal
        GameScene,    // Escena principal del juego
        GameOverScene // Escena de game over
    ],
    
    // Configuración para dispositivos móviles
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1024,
            height: 576
        }
    },
    
    // Configuración de renderizado
    render: {
        antialias: true,
        pixelArt: false
    }
};

// Variables globales del juego
let game;
let gameState = {
    currentLevel: 1,
    score: 0,
    lives: 3,
    coinsCollected: 0,
    totalCoins: 0,
    difficulty: 1,
    startTime: 0,
    gameTime: 0
};

/**
 * Inicializar el juego
 */
function initGame() {
    console.log('🚀 Iniciando Iron Man vs Ultron...');
    
    try {
        // Crear instancia del juego
        game = new Phaser.Game(gameConfig);
        
        // Eventos globales del juego
        game.events.on('ready', () => {
            console.log('✅ Phaser 3 cargado correctamente');
            console.log('🎮 Resolución del juego:', gameConfig.width + 'x' + gameConfig.height);
        });
        
    } catch (error) {
        console.error('❌ Error al inicializar el juego:', error);
        showErrorMessage('Error al cargar el juego. Refresca la página e inténtalo de nuevo.');
    }
}

/**
 * Mostrar mensaje de error
 */
function showErrorMessage(message) {
    const gameContainer = document.getElementById('game-container');
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: #dc143c;
        color: white;
        padding: 20px;
        border-radius: 10px;
        margin: 20px;
        text-align: center;
        font-weight: bold;
    `;
    errorDiv.innerHTML = `
        <h3>⚠️ Error</h3>
        <p>${message}</p>
    `;
    gameContainer.appendChild(errorDiv);
}

/**
 * Funciones utilitarias globales
 */
const GameUtils = {
    // Reiniciar el estado del juego
    resetGameState: function() {
        gameState.currentLevel = 1;
        gameState.score = 0;
        gameState.lives = 3;
        gameState.coinsCollected = 0;
        gameState.totalCoins = 0;
        gameState.difficulty = 1;
        gameState.startTime = Date.now();
        gameState.gameTime = 0;
    },
    
    // Actualizar puntuación
    updateScore: function(points) {
        gameState.score += points;
    },
    
    // Siguiente nivel
    nextLevel: function() {
        gameState.currentLevel++;
        gameState.difficulty += 0.1; // Incrementar dificultad gradualmente
        gameState.coinsCollected = 0;
    },
    
    // Quitar vida
    loseLife: function() {
        gameState.lives--;
        return gameState.lives <= 0;
    },
    
    // Actualizar tiempo de juego
    updateGameTime: function() {
        if (gameState.startTime > 0) {
            gameState.gameTime = Date.now() - gameState.startTime;
        }
    },
    
    // Formatear tiempo para mostrar
    formatTime: function(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
};

// Inicializar cuando la página esté cargada
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado, iniciando juego...');
    
    // Verificar compatibilidad con Phaser
    if (typeof Phaser === 'undefined') {
        console.error('❌ Phaser 3 no se pudo cargar');
        showErrorMessage('No se pudo cargar Phaser 3. Verifica tu conexión a internet.');
        return;
    }
    
    // Inicializar el juego
    initGame();
    
    // Añadir utilidades globales al juego una vez creado
    setTimeout(() => {
        if (game) {
            game.globals = {
                resetGameState: GameUtils.resetGameState,
                addScore: function(points) {
                    GameUtils.updateScore(points);
                },
                getScore: function() {
                    return gameState.score;
                },
                getGameState: function() {
                    return gameState;
                }
            };
        }
    }, 100);
});

// Manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('❌ Error global:', e.error);
});

console.log('📝 Archivo main.js cargado - Fase 1 completada'); 