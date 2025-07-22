// Breakout Evolutivo - Main Game Configuration

const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-canvas',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene, GameOverScene]
};

// Global game state
const gameState = {
    score: 0,
    lives: 3,
    level: 1,
    ballsActive: 1,
    maxBalls: 1,
    blockData: new Map(),
    audioManager: null
};

// Start the game
const game = new Phaser.Game(gameConfig);

// UI update functions
function updateScore(score) {
    gameState.score = score;
    document.getElementById('score-value').textContent = score;
}

function updateLives(lives) {
    gameState.lives = lives;
    document.getElementById('lives-value').textContent = lives;
}

function updateLevel(level) {
    gameState.level = level;
    gameState.maxBalls = Math.min(level, 3); // Max 3 balls
    document.getElementById('level-value').textContent = level;
}

// Initialize audio manager
window.addEventListener('load', () => {
    gameState.audioManager = new AudioManager();
});