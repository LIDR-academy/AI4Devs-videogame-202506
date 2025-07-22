class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    console.log("MenuScene: Initialized");

    // Variables
    this.playerName = "";
    this.nameInputActive = false;
    this.leaderboard = this.loadLeaderboard();

    // Crear fondo estrellado
    this.createStarfield();

    // Crear elementos de UI
    this.createTitle();
    this.createControls();
    this.createNameInput();
    this.createLeaderboard();
    this.createStartButton();

    // Configurar input de teclado
    this.setupKeyboardInput();
  }

  createStarfield() {
    // Crear un campo de estrellas simple
    for (let i = 0; i < 150; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);
      const star = this.add.circle(x, y, 1, 0xffffff);
      star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
    }
  }

  createTitle() {
    // Título principal
    this.titleText = this.add.text(400, 80, "ASTEROIDS", {
      fontSize: "48px",
      fill: "#ffffff",
      fontFamily: "Arial",
      stroke: "#0000ff",
      strokeThickness: 3,
    });
    this.titleText.setOrigin(0.5);

    // Subtítulo
    this.subtitleText = this.add.text(400, 130, "HTML5 Edition", {
      fontSize: "20px",
      fill: "#cccccc",
      fontFamily: "Arial",
    });
    this.subtitleText.setOrigin(0.5);
  }

  createControls() {
    // Panel de controles
    const controlsTitle = this.add.text(150, 180, "CONTROLS:", {
      fontSize: "18px",
      fill: "#ffff00",
      fontFamily: "Arial",
      stroke: "#000000",
      strokeThickness: 1,
    });

    const controlsText = [
      "W/A/S/D - Move ship",
      "MOUSE - Aim direction",
      "SPACE/CLICK - Shoot",
      "",
      "Ship automatically rotates",
      "toward mouse position",
    ];

    controlsText.forEach((text, index) => {
      this.add.text(150, 210 + index * 20, text, {
        fontSize: "14px",
        fill: "#ffffff",
        fontFamily: "monospace",
      });
    });
  }

  createNameInput() {
    // Título para entrada de nombre
    this.nameTitle = this.add.text(400, 380, "ENTER YOUR NAME:", {
      fontSize: "20px",
      fill: "#ffff00",
      fontFamily: "Arial",
    });
    this.nameTitle.setOrigin(0.5);

    // Campo de entrada de nombre
    this.nameField = this.add.rectangle(400, 420, 200, 40, 0x333333);
    this.nameField.setStrokeStyle(2, 0xffffff);

    // Texto del nombre
    this.nameText = this.add.text(400, 420, "Player", {
      fontSize: "18px",
      fill: "#ffffff",
      fontFamily: "Arial",
    });
    this.nameText.setOrigin(0.5);
    this.playerName = "Player";

    // Cursor parpadeante
    this.cursor = this.add.text(400, 420, "|", {
      fontSize: "18px",
      fill: "#ffffff",
      fontFamily: "Arial",
    });
    this.cursor.setOrigin(0, 0.5);

    // Activar entrada de nombre por defecto
    this.nameInputActive = true;
    this.updateNameDisplay();

    // Animación del cursor
    this.tweens.add({
      targets: this.cursor,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  createLeaderboard() {
    // Título del leaderboard
    this.leaderboardTitle = this.add.text(550, 180, "LEADERBOARD:", {
      fontSize: "18px",
      fill: "#ffff00",
      fontFamily: "Arial",
      stroke: "#000000",
      strokeThickness: 1,
    });

    this.updateLeaderboardDisplay();
  }

  createStartButton() {
    // Botón de inicio
    this.startButton = this.add.text(400, 500, "PRESS ENTER TO START", {
      fontSize: "24px",
      fill: "#00ff00",
      fontFamily: "Arial",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.startButton.setOrigin(0.5);

    // Animación del botón
    this.tweens.add({
      targets: this.startButton,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Instrucciones adicionales
    this.instructionText = this.add.text(
      400,
      540,
      "Click on name field to edit",
      {
        fontSize: "14px",
        fill: "#cccccc",
        fontFamily: "Arial",
      }
    );
    this.instructionText.setOrigin(0.5);
  }

  setupKeyboardInput() {
    // Configurar teclas especiales
    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    this.backspaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.BACKSPACE
    );

    // Eventos de teclado
    this.enterKey.on("down", () => {
      if (this.nameInputActive && this.playerName.trim().length > 0) {
        this.startGame();
      }
    });

    this.backspaceKey.on("down", () => {
      if (this.nameInputActive && this.playerName.length > 0) {
        this.playerName = this.playerName.slice(0, -1);
        this.updateNameDisplay();
      }
    });

    // Capturar entrada de texto
    this.input.keyboard.on("keydown", (event) => {
      if (this.nameInputActive) {
        const key = event.key;
        if (key.length === 1 && this.playerName.length < 12) {
          // Solo letras, números y algunos símbolos
          if (/[a-zA-Z0-9\-_]/.test(key)) {
            this.playerName += key.toUpperCase();
            this.updateNameDisplay();
          }
        }
      }
    });

    // Click en el campo de nombre
    this.nameField.setInteractive();
    this.nameField.on("pointerdown", () => {
      this.nameInputActive = true;
      this.cursor.setVisible(true);
    });
  }

  updateNameDisplay() {
    const displayName = this.playerName || "Player";
    this.nameText.setText(displayName);

    // Actualizar posición del cursor
    const textWidth = this.nameText.width;
    this.cursor.setPosition(400 + textWidth / 2 + 5, 420);
  }

  updateLeaderboardDisplay() {
    // Limpiar leaderboard anterior si existe
    if (this.leaderboardTexts) {
      this.leaderboardTexts.forEach((text) => text.destroy());
    }
    this.leaderboardTexts = [];

    // Mostrar top 5 scores
    const topScores = this.leaderboard.slice(0, 5);

    topScores.forEach((entry, index) => {
      const rank = index + 1;
      const text = this.add.text(
        550,
        210 + index * 25,
        `${rank}. ${entry.name} - ${entry.score}`,
        {
          fontSize: "16px",
          fill: index === 0 ? "#ffff00" : "#ffffff",
          fontFamily: "monospace",
        }
      );
      this.leaderboardTexts.push(text);
    });

    // Si no hay scores, mostrar mensaje
    if (topScores.length === 0) {
      const noScoresText = this.add.text(550, 210, "No scores yet!", {
        fontSize: "16px",
        fill: "#cccccc",
        fontFamily: "monospace",
      });
      this.leaderboardTexts.push(noScoresText);
    }
  }

  loadLeaderboard() {
    try {
      const saved = localStorage.getItem("asteroids_leaderboard");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Error loading leaderboard:", error);
      return [];
    }
  }

  saveLeaderboard() {
    try {
      localStorage.setItem(
        "asteroids_leaderboard",
        JSON.stringify(this.leaderboard)
      );
    } catch (error) {
      console.warn("Error saving leaderboard:", error);
    }
  }

  addScore(name, score) {
    // Agregar nueva puntuación
    this.leaderboard.push({ name: name.trim(), score: score });

    // Ordenar por puntuación descendente
    this.leaderboard.sort((a, b) => b.score - a.score);

    // Mantener solo top 10
    this.leaderboard = this.leaderboard.slice(0, 10);

    // Guardar
    this.saveLeaderboard();
  }

  startGame() {
    const finalName = this.playerName.trim() || "Player";
    console.log(`Starting game for player: ${finalName}`);

    // Guardar datos del jugador para pasar a través de BootScene
    this.registry.set("playerName", finalName);
    this.registry.set("menuScene", this);

    // Ir a BootScene para cargar assets y luego a GameScene
    this.scene.start("BootScene");
  }

  update() {
    // Actualización si es necesaria
  }
}
