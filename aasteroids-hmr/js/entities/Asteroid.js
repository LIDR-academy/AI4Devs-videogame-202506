class Asteroid extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, size = "large") {
    // Usar la imagen real del asteroide
    super(scene, x, y, "asteroid");

    // Añadir a la escena y habilitar física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configuración del asteroide
    this.asteroidSize = size;
    this.isActive = true;

    // Configurar propiedades según el tamaño
    this.setupSizeProperties();

    // Configurar movimiento aleatorio
    this.setupRandomMovement();

    // Configurar física
    this.body.setCollideWorldBounds(false);
    this.body.setBounce(1, 1); // Rebote completo

    console.log(`Asteroid (${size}) created at (${x}, ${y})`);
  }

  setupSizeProperties() {
    // Tamaños objetivo para cada tipo de asteroide
    const sizeConfig = {
      large: {
        targetSize: 70, // Tamaño objetivo en píxeles
        radius: 35,
        speed: 50,
        health: 3,
        points: 20,
        fragments: 2,
      },
      medium: {
        targetSize: 50, // Tamaño objetivo en píxeles
        radius: 25,
        speed: 75,
        health: 2,
        points: 50,
        fragments: 2,
      },
      small: {
        targetSize: 30, // Tamaño objetivo en píxeles
        radius: 15,
        speed: 100,
        health: 1,
        points: 100,
        fragments: 0,
      },
    };

    const config = sizeConfig[this.asteroidSize];

    // ESCALADO AUTOMÁTICO: Calcular escala basada en el tamaño de la imagen original
    const currentSize = Math.max(this.width, this.height);
    const scaleRatio = config.targetSize / currentSize;

    console.log(
      `Asteroid (${
        this.asteroidSize
      }): Original size ${currentSize}px, scaled to ${scaleRatio.toFixed(
        2
      )} (target: ${config.targetSize}px)`
    );

    this.radius = config.radius;
    this.maxSpeed = config.speed;
    this.health = config.health;
    this.points = config.points;
    this.fragmentCount = config.fragments;

    // CONFIGURAR FÍSICA ANTES DEL ESCALADO
    this.body.setCircle(this.radius);

    // APLICAR ESCALADO DESPUÉS de configurar física
    this.setScale(scaleRatio);

    // FORZAR tamaño del cuerpo después del escalado para evitar que se escale automáticamente
    this.body.setCircle(this.radius);

    console.log(
      `Asteroid (${this.asteroidSize}) body configured: circle radius=${
        this.radius
      }, original size=${currentSize}, scale=${scaleRatio.toFixed(2)}`
    ); // DEBUG: Crear una caja visual para debug
    if (this.scene.physics.world.drawDebug) {
      this.debugCircle = this.scene.add.circle(0, 0, this.radius);
      this.debugCircle.setStrokeStyle(2, 0x00ff00);
      this.debugCircle.setOrigin(0.5, 0.5);
    }
  }

  setupRandomMovement() {
    // Velocidad aleatoria
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const speed = Phaser.Math.FloatBetween(this.maxSpeed * 0.5, this.maxSpeed);

    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;

    this.body.setVelocity(velocityX, velocityY);

    // Rotación aleatoria
    const angularVelocity = Phaser.Math.FloatBetween(-100, 100);
    this.body.setAngularVelocity(angularVelocity);
  }

  update() {
    if (!this.isActive) return;

    // DEBUG: Actualizar posición del círculo de debug
    if (this.debugCircle) {
      this.debugCircle.x = this.x;
      this.debugCircle.y = this.y;
    }

    // Wrap-around del mundo
    this.wrapAroundWorld();
  }

  wrapAroundWorld() {
    // Usar la nueva función wrap de WorldUtils con margen basado en el radio
    WrapUtils.wrap(this, null, this.radius);
  }

  takeDamage() {
    this.health--;

    if (this.health <= 0) {
      this.destroy();
      return true;
    }

    return false;
  }

  destroy() {
    if (!this.isActive) return;

    this.isActive = false;

    // Limpiar elementos de debug
    if (this.debugCircle) {
      this.debugCircle.destroy();
    }

    // Crear fragmentos si es un asteroide grande o mediano
    this.createFragments();

    // Crear efecto de explosión
    this.createExplosionEffect();

    // Añadir puntos al score
    this.addScore();

    // Destruir el sprite
    super.destroy();

    console.log(
      `Asteroid (${this.asteroidSize}) destroyed, points: ${this.points}`
    );
  }

  createFragments() {
    if (this.fragmentCount === 0) return;

    const nextSize = this.asteroidSize === "large" ? "medium" : "small";

    for (let i = 0; i < this.fragmentCount; i++) {
      // Posición ligeramente desplazada
      const offsetX = Phaser.Math.Between(-20, 20);
      const offsetY = Phaser.Math.Between(-20, 20);

      const fragment = new Asteroid(
        this.scene,
        this.x + offsetX,
        this.y + offsetY,
        nextSize
      );

      // Añadir al grupo de asteroides si existe
      if (this.scene.asteroids) {
        this.scene.asteroids.add(fragment);
      }
    }

    console.log(`Created ${this.fragmentCount} fragments of size ${nextSize}`);
  }

  createExplosionEffect() {
    // Crear explosión con partículas
    const particleCount =
      this.asteroidSize === "large"
        ? 6
        : this.asteroidSize === "medium"
        ? 4
        : 2;

    for (let i = 0; i < particleCount; i++) {
      const particle = this.scene.add.image(
        this.x + Phaser.Math.Between(-this.radius, this.radius),
        this.y + Phaser.Math.Between(-this.radius, this.radius),
        "particle"
      );

      // Animación de explosión
      this.scene.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-30, 30),
        y: particle.y + Phaser.Math.Between(-30, 30),
        alpha: 0,
        scale: 0.5,
        duration: 300,
        onComplete: () => {
          particle.destroy();
        },
      });
    }
  }

  addScore() {
    // Intentar añadir puntos a través de la UIScene
    const uiScene = this.scene.scene.get("UIScene");
    if (uiScene && uiScene.updateScore) {
      uiScene.updateScore(this.points);
    }
  }

  // Método estático para crear asteroides en posiciones aleatorias
  static createRandom(
    scene,
    size = "large",
    avoidX = 0,
    avoidY = 0,
    avoidRadius = 100
  ) {
    const gameWidth = scene.sys.game.config.width;
    const gameHeight = scene.sys.game.config.height;

    let x, y;
    let attempts = 0;

    // Intentar encontrar una posición que no esté cerca de la zona a evitar
    do {
      x = Phaser.Math.Between(50, gameWidth - 50);
      y = Phaser.Math.Between(50, gameHeight - 50);
      attempts++;
    } while (
      attempts < 20 &&
      Phaser.Math.Distance.Between(x, y, avoidX, avoidY) < avoidRadius
    );

    return new Asteroid(scene, x, y, size);
  }
}
