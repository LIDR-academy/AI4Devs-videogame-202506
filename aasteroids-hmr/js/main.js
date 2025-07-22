// Configuración principal del juego
const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // Sin gravedad para el espacio
      debug: false,
    },
  },
  scene: [MenuScene, BootScene, GameScene, UIScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

// Inicializar el juego
const game = new Phaser.Game(gameConfig);

// Variables globales del juego (si es necesario)
window.gameState = {
  score: 0,
  lives: 3,
  level: 1,
  gameOver: false,
};

console.log("Asteroids Game: Phaser 3 initialized with 800x600 canvas");
console.log("Scenes configured: BootScene, GameScene, UIScene");
