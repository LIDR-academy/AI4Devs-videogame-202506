class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create(data) {
    console.log("GameScene: Asteroids Game Started");

    // Recibir datos del MenuScene
    this.playerName = data.playerName || "Player";
    this.menuScene = data.menuScene;
    console.log(`Game started for player: ${this.playerName}`);

    // Configurar límites del mundo para el sistema Wrap
    WrapUtils.setupBounds(this);
    WrapUtils.setDebugMode(false); // Cambiar a true para debugging

    // DESACTIVAR DEBUG DE FÍSICA temporalmente mientras arreglamos las colisiones
    this.physics.world.drawDebug = false;
    // this.physics.world.debugGraphic = this.add.graphics();

    // Configurar el fondo del espacio
    this.cameras.main.setBackgroundColor("#000011");

    // Crear algunas estrellas de fondo
    this.createStarfield();

    // Crear mira/crosshair para el mouse
    this.createCrosshair();

    // Inicializar todos los sistemas de juego
    this.initializeGameSystems();

    // Crear instancias iniciales
    this.createShip();
    this.createInitialAsteroids();

    // Configurar sistema de colisiones
    this.setupCollisions();

    // Iniciar UIScene como overlay
    this.scene.launch("UIScene");

    console.log(
      "Game systems initialized: Ship, Asteroids, Bullets, Collisions"
    );
  }

  createStarfield() {
    // Crear un campo de estrellas simple
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);
      const star = this.add.circle(x, y, 1, 0xffffff);
      star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
    }
  }

  createCrosshair() {
    // Crear un crosshair simple que sigue el mouse
    this.crosshair = this.add.graphics();
    this.crosshair.lineStyle(2, 0xff0000, 0.8);

    // Dibujar cruz
    this.crosshair.moveTo(-8, 0);
    this.crosshair.lineTo(8, 0);
    this.crosshair.moveTo(0, -8);
    this.crosshair.lineTo(0, 8);

    // Círculo pequeño en el centro
    this.crosshair.strokeCircle(0, 0, 3);

    this.crosshair.setDepth(1000); // Siempre visible encima de todo
  }

  initializeGameSystems() {
    // Usar grupos normales - los objetos ya tienen física individual
    this.bullets = this.add.group();
    this.asteroids = this.add.group();

    // Contadores para debugging
    this.bulletCount = 0;
    this.asteroidCount = 0;

    // Variables de juego
    this.gameRunning = true;
    this.level = 1;
    this.score = 0; // Inicializar score

    console.log(
      "Game systems initialized with normal groups + individual physics"
    );
  }

  createShip() {
    // Crear nave en el centro de la pantalla
    const centerX = this.sys.game.config.width / 2;
    const centerY = this.sys.game.config.height / 2;

    this.ship = new Ship(this, centerX, centerY);

    // Configurar sistema de controles exportable
    this.setupShipControls();

    console.log("Ship created with new controls system");
  }

  setupShipControls() {
    // Usar el sistema de controles exportable
    this.shipControls = ControlUtils.setupStandardMapping(this, this.ship);

    // Asignar el sistema de controles a la nave
    this.ship.setControlsSystem(this.shipControls);

    // Validar que los controles están correctamente configurados
    ControlUtils.validateControls(this.shipControls);

    // Mostrar información de controles en consola
    const controlsInfo = ControlUtils.getControlsInfo();
    console.log("Controls mapped:", controlsInfo);
  }

  createInitialAsteroids() {
    // Crear asteroides iniciales evitando la zona de spawn de la nave
    const shipX = this.ship.x;
    const shipY = this.ship.y;
    const avoidRadius = 150;

    // Crear 4 asteroides grandes iniciales
    for (let i = 0; i < 4; i++) {
      const asteroid = Asteroid.createRandom(
        this,
        "large",
        shipX,
        shipY,
        avoidRadius
      );
      this.asteroids.add(asteroid);
      this.asteroidCount++;
    }

    console.log(`Created ${this.asteroids.children.size} initial asteroids`);
  }

  setupCollisions() {
    console.log("🔧 Setting up MANUAL collision system...");
    console.log(`Bullets group: ${this.bullets?.children?.size || 0} objects`);
    console.log(
      `Asteroids group: ${this.asteroids?.children?.size || 0} objects`
    );
    console.log(`Ship exists: ${this.ship ? "YES" : "NO"}`);

    // EL SISTEMA PHASER NO FUNCIONA - usaremos detección manual por distancia
    // Las colisiones se verificarán en el método update() con matemáticas puras

    console.log(
      "✅ Manual collision system configured - using distance-based detection"
    );
  }

  handleBulletAsteroidCollision(bullet, asteroid) {
    console.log("🎯 Bullet-Asteroid collision detected!");
    console.log("Bullet position:", bullet.x, bullet.y);
    console.log(
      "Asteroid position:",
      asteroid.x,
      asteroid.y,
      "size:",
      asteroid.asteroidSize
    );

    // Primero remover la bala del grupo
    this.bullets.remove(bullet);

    // Luego llamar a onCollision para efectos
    bullet.onCollision();

    // Calcular puntos basados en el tamaño del asteroide
    let points = 0;
    switch (asteroid.asteroidSize) {
      case "large":
        points = 20;
        break;
      case "medium":
        points = 50;
        break;
      case "small":
        points = 100;
        break;
      default:
        points = 10;
    }

    // Agregar puntos al score
    this.score += points;
    console.log(`🏆 +${points} points! Total score: ${this.score}`);

    // Actualizar UI
    const uiScene = this.scene.get("UIScene");
    if (uiScene && uiScene.updateScore) {
      uiScene.updateScore(this.score);
    }

    // Dañar asteroide
    const destroyed = asteroid.takeDamage();

    if (destroyed) {
      this.asteroids.remove(asteroid);
      this.asteroidCount--;
      console.log("🪨 Asteroid destroyed! Remaining:", this.asteroidCount);

      // Verificar si el nivel está completo
      this.checkLevelComplete();
    } else {
      console.log("🪨 Asteroid damaged, health remaining:", asteroid.health);
    }
  }

  handleShipAsteroidCollision(ship, asteroid) {
    // Dañar nave si no es invulnerable
    const shipDestroyed = ship.takeDamage();

    if (shipDestroyed) {
      // Actualizar vidas en UI
      const uiScene = this.scene.get("UIScene");
      if (uiScene && uiScene.updateLives) {
        // Aquí podrías implementar un sistema de vidas
        console.log("Ship destroyed by asteroid");
      }
    }
  }

  checkLevelComplete() {
    // Si no quedan asteroides, pasar al siguiente nivel
    if (this.asteroids.children.size === 0) {
      this.level++;
      this.nextLevel();
    }
  }

  nextLevel() {
    console.log(
      `Level ${this.level} complete! Starting level ${this.level + 1}`
    );

    // Crear más asteroides para el siguiente nivel
    const asteroidCount = Math.min(4 + this.level, 8);

    for (let i = 0; i < asteroidCount; i++) {
      const asteroid = Asteroid.createRandom(
        this,
        "large",
        this.ship.x,
        this.ship.y,
        150
      );
      this.asteroids.add(asteroid);
      this.asteroidCount++;
    }

    // Actualizar UI
    const uiScene = this.scene.get("UIScene");
    if (uiScene && uiScene.updateLevel) {
      uiScene.updateLevel(this.level);
    }
  }

  update(time, delta) {
    if (!this.gameRunning) return;

    // Actualizar posición del crosshair
    this.updateCrosshair();

    // Actualizar nave
    if (this.ship && this.ship.isAlive) {
      this.ship.update(time, delta);
    }

    // Actualizar todas las balas
    this.bullets.children.entries.forEach((bullet) => {
      if (bullet && bullet.update && bullet.isActive) {
        bullet.update();
      }
    });

    // Actualizar todos los asteroides
    this.asteroids.children.entries.forEach((asteroid) => {
      if (asteroid && asteroid.update && asteroid.isActive) {
        asteroid.update();
      }
    });

    // COLISIONES MANUALES - matemáticas puras, no Phaser physics
    this.checkManualCollisions();

    // Limpiar objetos inactivos
    this.bullets.children.entries = this.bullets.children.entries.filter(
      (bullet) => bullet && bullet.active && bullet.isActive
    );

    this.asteroids.children.entries = this.asteroids.children.entries.filter(
      (asteroid) => asteroid && asteroid.active && asteroid.isActive
    );

    // DEBUG: Verificar distancias ocasionalmente
    if (time % 2000 < 50) {
      // Cada 2 segundos aproximadamente
      this.debugCollisionDistances();
    }

    // Debug info (opcional)
    this.updateDebugInfo();
  }

  updateDebugInfo() {
    // Actualizar contadores en consola cada 5 segundos (opcional)
    if (this.time.now % 5000 < 16) {
      console.log(
        `Active entities - Bullets: ${this.bullets.children.size}, Asteroids: ${this.asteroids.children.size}`
      );
    }
  }

  updateCrosshair() {
    // Actualizar posición del crosshair para seguir el mouse
    if (this.crosshair) {
      const pointer = this.input.activePointer;
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      this.crosshair.setPosition(worldPoint.x, worldPoint.y);
    }
  }

  // ======== COLISIONES MANUALES ========
  checkManualCollisions() {
    // 1. Balas vs Asteroides
    this.bullets.children.entries.forEach((bullet) => {
      if (!bullet || !bullet.isActive) return;

      this.asteroids.children.entries.forEach((asteroid) => {
        if (!asteroid || !asteroid.isActive) return;

        const distance = Phaser.Math.Distance.Between(
          bullet.x,
          bullet.y,
          asteroid.x,
          asteroid.y
        );

        // Radio bala (4) + radio asteroide (35) = 39 pixels
        if (distance < 39) {
          console.log(
            `🎯 COLISIÓN DETECTADA! Bala-Asteroide: ${distance.toFixed(2)} < 39`
          );
          this.handleBulletAsteroidCollision(bullet, asteroid);
          return; // Salir del loop interno
        }
      });
    });

    // 2. Nave vs Asteroides
    if (this.ship && this.ship.isAlive) {
      this.asteroids.children.entries.forEach((asteroid) => {
        if (!asteroid || !asteroid.isActive) return;

        const distance = Phaser.Math.Distance.Between(
          this.ship.x,
          this.ship.y,
          asteroid.x,
          asteroid.y
        );

        // Radio nave aproximado (16) + radio asteroide (35) = 51 pixels
        if (distance < 51) {
          console.log(
            `💥 COLISIÓN DETECTADA! Nave-Asteroide: ${distance.toFixed(2)} < 51`
          );
          this.handleShipAsteroidCollision(this.ship, asteroid);
          return;
        }
      });
    }
  }

  debugCollisionDistances() {
    console.log("🔍 === ESTADO ACTUAL DE COLISIONES ===");

    this.bullets.children.entries.forEach((bullet, bulletIndex) => {
      if (!bullet || !bullet.isActive) return;

      this.asteroids.children.entries.forEach((asteroid, asteroidIndex) => {
        if (!asteroid || !asteroid.isActive) return;

        const distance = Phaser.Math.Distance.Between(
          bullet.x,
          bullet.y,
          asteroid.x,
          asteroid.y
        );

        if (distance < 60) {
          console.log(
            `📍 Bala[${bulletIndex}] vs Asteroide[${asteroidIndex}]: ${distance.toFixed(
              2
            )} pixels (umbral: 39)`
          );
        }
      });
    });

    if (this.ship && this.ship.isAlive) {
      this.asteroids.children.entries.forEach((asteroid, asteroidIndex) => {
        if (!asteroid || !asteroid.isActive) return;

        const distance = Phaser.Math.Distance.Between(
          this.ship.x,
          this.ship.y,
          asteroid.x,
          asteroid.y
        );

        if (distance < 80) {
          console.log(
            `🚀 Nave vs Asteroide[${asteroidIndex}]: ${distance.toFixed(
              2
            )} pixels (umbral: 51)`
          );
        }
      });
    }
  }

  // ======== SISTEMA DE GAME OVER ========
  handleGameOver() {
    console.log("🚨 GAME OVER triggered from ship");

    // Detener el juego
    this.gameRunning = false;

    // Mostrar pantalla de Game Over
    this.showGameOverScreen();

    // Notificar a UIScene
    const uiScene = this.scene.get("UIScene");
    if (uiScene && uiScene.showGameOver) {
      uiScene.showGameOver();
    }
  }

  showGameOverScreen() {
    // Guardar score en el leaderboard
    this.saveScoreToLeaderboard(this.playerName, this.score);

    // Crear overlay semitransparente
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    overlay.setDepth(1000);

    // Texto principal GAME OVER
    const gameOverText = this.add.text(400, 200, "GAME OVER", {
      fontSize: "64px",
      fill: "#ff0000",
      fontFamily: "Arial",
      stroke: "#ffffff",
      strokeThickness: 2,
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setDepth(1001);

    // Mostrar score final
    const finalScoreText = this.add.text(
      400,
      280,
      `Final Score: ${this.score}`,
      {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
      }
    );
    finalScoreText.setOrigin(0.5);
    finalScoreText.setDepth(1001);

    // Mostrar nombre del jugador
    const playerText = this.add.text(400, 320, `Player: ${this.playerName}`, {
      fontSize: "24px",
      fill: "#ffff00",
      fontFamily: "Arial",
    });
    playerText.setOrigin(0.5);
    playerText.setDepth(1001);

    // Instrucciones para volver al menú
    const restartText = this.add.text(
      400,
      380,
      "Press SPACE to return to menu",
      {
        fontSize: "24px",
        fill: "#ffffff",
        fontFamily: "Arial",
      }
    );
    restartText.setOrigin(0.5);
    restartText.setDepth(1001);

    // Configurar tecla para volver al menú
    const spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    spaceKey.on("down", () => {
      this.returnToMenu();
    });

    // Guardar referencias para poder limpiarlas
    this.gameOverElements = {
      overlay,
      gameOverText,
      finalScoreText,
      playerText,
      restartText,
      spaceKey,
    };
  }

  returnToMenu() {
    console.log("🔄 Returning to menu...");

    // Limpiar elementos de Game Over
    if (this.gameOverElements) {
      this.gameOverElements.overlay.destroy();
      this.gameOverElements.gameOverText.destroy();
      this.gameOverElements.finalScoreText.destroy();
      this.gameOverElements.playerText.destroy();
      this.gameOverElements.restartText.destroy();
      this.gameOverElements.spaceKey.off("down");
      this.gameOverElements = null;
    }

    // Volver al menú principal
    this.scene.start("MenuScene");
  }

  saveScoreToLeaderboard(playerName, score) {
    try {
      // Cargar leaderboard actual
      const saved = localStorage.getItem("asteroids_leaderboard");
      let leaderboard = saved ? JSON.parse(saved) : [];

      // Agregar nueva puntuación
      leaderboard.push({ name: playerName.trim(), score: score });

      // Ordenar por puntuación descendente
      leaderboard.sort((a, b) => b.score - a.score);

      // Mantener solo top 10
      leaderboard = leaderboard.slice(0, 10);

      // Guardar
      localStorage.setItem(
        "asteroids_leaderboard",
        JSON.stringify(leaderboard)
      );

      console.log(`Score saved to leaderboard: ${playerName} - ${score}`);
    } catch (error) {
      console.warn("Error saving score to leaderboard:", error);
    }
  }
}
