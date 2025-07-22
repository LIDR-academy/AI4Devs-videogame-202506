class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene" });
  }

  create() {
    console.log("UIScene: Initialized");

    // Variables de UI
    this.score = 0;
    this.lives = 3;
    this.level = 1;

    // Crear elementos de UI
    this.createScoreDisplay();
    this.createLivesDisplay();
    this.createLevelDisplay();
  }

  createScoreDisplay() {
    this.scoreText = this.add.text(20, 20, `SCORE: ${this.score}`, {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "monospace",
    });
  }

  createLivesDisplay() {
    this.livesText = this.add.text(20, 50, `LIVES: ${this.lives}`, {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "monospace",
    });
  }

  createLevelDisplay() {
    this.levelText = this.add.text(20, 80, `LEVEL: ${this.level}`, {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "monospace",
    });
  }

  updateScore(points) {
    this.score += points;
    this.scoreText.setText(`SCORE: ${this.score}`);
  }

  updateLives(lives) {
    this.lives = lives;
    this.livesText.setText(`LIVES: ${this.lives}`);
  }

  updateLevel(level) {
    this.level = level;
    this.levelText.setText(`LEVEL: ${this.level}`);
  }

  showGameOver() {
    console.log("UI: Showing Game Over state");

    // Cambiar color de las vidas a rojo para indicar Game Over
    this.livesText.setColor("#ff0000");
    this.livesText.setText("LIVES: 0 - GAME OVER");

    // Opcional: agregar más elementos de UI para Game Over
  }

  update() {
    // Actualización de elementos de UI si es necesario
  }
}
