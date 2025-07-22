class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Crear un simple loading bar
    this.createLoadingBar();

    // Cargar imágenes reales desde la carpeta assets
    this.load.image("ship", "assets/images/nave.png");
    this.load.image("asteroid", "assets/images/asteriode.png");
    this.load.image("bullet", "assets/images/bala.png");

    console.log("BootScene: Loading real images from assets/images/");
  }

  createLoadingBar() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
      percentText.setText(parseInt(value * 100) + "%");
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
  }

  create() {
    console.log("BootScene: Real images loaded successfully");

    // Crear partícula procedural para efectos (mantener solo esta)
    const particleCanvas = document.createElement("canvas");
    particleCanvas.width = 3;
    particleCanvas.height = 3;
    const particleCtx = particleCanvas.getContext("2d");
    particleCtx.fillStyle = "#ff6600";
    particleCtx.fillRect(0, 0, 3, 3);
    this.textures.addCanvas("particle", particleCanvas);

    // Verificar que las imágenes se cargaron correctamente
    const assetsLoaded =
      this.textures.exists("ship") &&
      this.textures.exists("asteroid") &&
      this.textures.exists("bullet");

    if (!assetsLoaded) {
      console.error("Error loading some assets!");
      return;
    }

    // Mostrar mensaje de confirmación
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const assetsText = this.add.text(
      width / 2,
      height / 2 + 60,
      "Real Images Loaded Successfully!\nStarting Game...",
      {
        fontSize: "16px",
        fill: "#00ff00",
        fontFamily: "monospace",
        align: "center",
      }
    );
    assetsText.setOrigin(0.5, 0.5);

    // Transición a GameScene
    this.time.delayedCall(1500, () => {
      // Recuperar datos del jugador del registry
      const playerName = this.registry.get("playerName") || "Player";
      const menuScene = this.registry.get("menuScene");

      console.log(
        `BootScene: Passing player data to GameScene - ${playerName}`
      );

      // Pasar datos a GameScene
      this.scene.start("GameScene", {
        playerName: playerName,
        menuScene: menuScene,
      });
    });
  }
}
