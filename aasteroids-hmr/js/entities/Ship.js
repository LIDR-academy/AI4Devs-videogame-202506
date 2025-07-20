class Ship extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "ship");

    // Añadir a la escena y habilitar física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configuración de la nave
    this.speed = 200; // Velocidad máxima
    this.rotationSpeed = 5; // Velocidad de rotación
    this.thrust = 300; // Fuerza de propulsión
    this.friction = 0.98; // Fricción en el espacio
    this.isThrusting = false;

    // Estado de la nave
    this.isAlive = true;
    this.invulnerable = false;
    this.invulnerabilityTime = 2000; // 2 segundos de invulnerabilidad tras respawn

    // Sistema de vidas
    this.lives = 3; // Vidas iniciales
    this.maxLives = 3;

    // Configurar orientación correcta - la nave debe apuntar hacia arriba por defecto
    // Ajustar la rotación inicial para que la nave apunte hacia arriba (0 grados = arriba)
    this.setRotation(0);

    // ESCALADO AUTOMÁTICO: Reducir el tamaño de la imagen al tamaño deseado
    // Tamaño objetivo: 32x32 píxeles aproximadamente
    const targetSize = 32;
    const currentSize = Math.max(this.width, this.height);
    const scaleRatio = targetSize / currentSize;
    this.setScale(scaleRatio);

    console.log(
      `Ship: Original size ${this.width}x${
        this.height
      }, scaled to ${scaleRatio.toFixed(2)}`
    );

    // Configurar física
    const collisionSize = targetSize * 0.8;
    this.body.setSize(collisionSize, collisionSize);

    // Offset para centrar el cuerpo de colisión en el sprite escalado
    // El sprite escalado debería tener el tamaño objetivo
    const spriteScaledSize = targetSize;
    const offsetX = (spriteScaledSize - collisionSize) / 2;
    const offsetY = (spriteScaledSize - collisionSize) / 2;
    this.body.setOffset(offsetX, offsetY);

    this.body.setCollideWorldBounds(false); // Sin límites para wrap-around
    this.body.setDrag(50); // Resistencia al movimiento
    this.body.setAngularDrag(100); // Resistencia a la rotación
    this.body.setMaxVelocity(this.speed); // Velocidad máxima

    console.log(
      `Ship body configured: size=${collisionSize}x${collisionSize}, offset=(${offsetX},${offsetY}), sprite size=(${this.width}, ${this.height}), scaled size=(${spriteScaledSize}, ${spriteScaledSize})`
    );

    // DEBUG: Crear una caja visual para debug
    if (this.scene.physics.world.drawDebug) {
      this.debugRect = this.scene.add.rectangle(
        0,
        0,
        collisionSize,
        collisionSize
      );
      this.debugRect.setStrokeStyle(2, 0x0000ff);
      this.debugRect.setOrigin(0.5, 0.5);
    }

    this.body.setCollideWorldBounds(false); // Sin límites para wrap-around
    this.body.setDrag(50); // Resistencia al movimiento
    this.body.setAngularDrag(100); // Resistencia a la rotación
    this.body.setMaxVelocity(this.speed); // Velocidad máxima

    console.log(
      `Ship body configured: size=${collisionSize}x${collisionSize}, offset=(${offsetX},${offsetY})`
    );

    // Configurar controles usando el nuevo sistema
    // Los controles se configurarán externamente
    this.controlsSystem = null;

    // Configurar disparos
    this.fireRate = 200; // Milisegundos entre disparos
    this.lastFired = 0;

    console.log("Ship created at position:", x, y);
  }

  // Método para asignar el sistema de controles
  setControlsSystem(controlsSystem) {
    this.controlsSystem = controlsSystem;
    console.log("Controls system assigned to ship");
  }

  update(time, delta) {
    if (!this.isAlive) return;

    // Rotar automáticamente hacia el mouse
    this.rotateTowardsMouse(delta);

    // Asegurar que no hay velocidad angular residual
    this.setAngularVelocity(0);

    // DEBUG: Actualizar posición del rectángulo de debug
    if (this.debugRect) {
      this.debugRect.x = this.x;
      this.debugRect.y = this.y;
      this.debugRect.rotation = this.rotation;
    }

    // Actualizar controles si están disponibles
    if (this.controlsSystem) {
      this.controlsSystem.update();
    }

    // Aplicar wrap-around
    this.wrapAroundWorld();

    // Manejar efectos visuales
    this.updateVisualEffects();

    // Actualizar estado de invulnerabilidad
    this.updateInvulnerability(time);
  }

  // Métodos de movimiento direccional absoluto (WASD)
  moveUp() {
    this.isThrusting = true;
    this.body.setAcceleration(0, -this.thrust);
  }

  moveDown() {
    this.isThrusting = true;
    this.body.setAcceleration(0, this.thrust * 0.7); // Ligeramente más lento hacia atrás
  }

  moveLeft() {
    this.isThrusting = true;
    this.body.setAcceleration(-this.thrust, 0);
  }

  moveRight() {
    this.isThrusting = true;
    this.body.setAcceleration(this.thrust, 0);
  }

  // Movimiento diagonal
  moveUpLeft() {
    this.isThrusting = true;
    const diagonalThrust = this.thrust * 0.707; // cos(45°) para mantener velocidad constante
    this.body.setAcceleration(-diagonalThrust, -diagonalThrust);
  }

  moveUpRight() {
    this.isThrusting = true;
    const diagonalThrust = this.thrust * 0.707;
    this.body.setAcceleration(diagonalThrust, -diagonalThrust);
  }

  moveDownLeft() {
    this.isThrusting = true;
    const diagonalThrust = this.thrust * 0.707;
    this.body.setAcceleration(-diagonalThrust, diagonalThrust);
  }

  moveDownRight() {
    this.isThrusting = true;
    const diagonalThrust = this.thrust * 0.707;
    this.body.setAcceleration(diagonalThrust, diagonalThrust);
  }

  stopMovement() {
    this.isThrusting = false;
    this.body.setAcceleration(0, 0);
  }

  // Métodos legacy para compatibilidad con sistema anterior
  thrustForward() {
    this.moveUp();
  }

  thrustBackward() {
    this.moveDown();
  }

  stopThrust() {
    this.stopMovement();
  }

  // Método legacy para compatibilidad (deprecated)
  handleInput(time) {
    console.warn("handleInput is deprecated. Use Controls system instead.");
  }

  thrust() {
    // Redirigir al nuevo método
    this.thrustForward();
  }
  tryToFire(time, targetAngle = null) {
    // Verificar rate limit
    if (time - this.lastFired < this.fireRate) return;

    this.fire(targetAngle);
    this.lastFired = time;
  }

  // Calcular el ángulo hacia la posición del mouse
  getAngleToMouse() {
    const pointer = this.scene.input.activePointer;
    const worldPoint = this.scene.cameras.main.getWorldPoint(
      pointer.x,
      pointer.y
    );

    // Calcular el ángulo desde la nave hacia el mouse
    const dx = worldPoint.x - this.x;
    const dy = worldPoint.y - this.y;

    // Usar atan2 para obtener el ángulo correcto
    // Ajustar para que 0 grados sea hacia arriba (como en Phaser)
    return Math.atan2(dx, -dy);
  }

  // Rotar la nave hacia el mouse suavemente
  rotateTowardsMouse(delta) {
    const targetAngle = this.getAngleToMouse();
    const currentAngle = this.rotation;

    // Calcular la diferencia angular más corta
    let angleDiff = targetAngle - currentAngle;

    // Normalizar el ángulo entre -π y π
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    // Velocidad de rotación (ajustable)
    const rotationSpeed = 6; // radianes por segundo
    const maxRotation = rotationSpeed * (delta / 1000);

    // Aplicar rotación limitada por la velocidad máxima
    if (Math.abs(angleDiff) <= maxRotation) {
      // Si estamos cerca, rotar directamente al objetivo
      this.setRotation(targetAngle);
    } else {
      // Rotar hacia el objetivo a velocidad constante
      const rotationDirection = angleDiff > 0 ? 1 : -1;
      this.setRotation(currentAngle + maxRotation * rotationDirection);
    }
  }

  fire(targetAngle = null) {
    // Usar el ángulo objetivo si se proporciona, sino usar la rotación de la nave
    const angle = targetAngle !== null ? targetAngle : this.rotation;

    // Calcular posición de disparo (parte delantera de la nave)
    // Para una nave que apunta hacia arriba (0 grados), calcular la punta frontal
    // Usar 16 píxeles (mitad del tamaño objetivo) como offset hacia el frente
    const frontOffset = 16; // Tamaño fijo basado en el tamaño objetivo de 32px
    const offsetX = Math.sin(this.rotation) * frontOffset;
    const offsetY = -Math.cos(this.rotation) * frontOffset;

    const bulletX = this.x + offsetX;
    const bulletY = this.y + offsetY;

    // Crear bala usando el ángulo especificado (hacia el mouse o hacia la rotación de la nave)
    const bullet = new Bullet(this.scene, bulletX, bulletY, angle);

    // Añadir al grupo de balas de la escena
    if (this.scene.bullets) {
      this.scene.bullets.add(bullet);
    }

    console.log(
      `Ship fired bullet at angle: ${((angle * 180) / Math.PI).toFixed(1)}°`
    );
    return bullet;
  }

  wrapAroundWorld() {
    // Usar la nueva función wrap de WorldUtils
    WrapUtils.wrap(this);
  }

  updateVisualEffects() {
    // Resetear aceleración si no hay propulsión
    if (!this.isThrusting) {
      this.body.setAcceleration(0);
    }

    // Efecto de parpadeo si es invulnerable
    if (this.invulnerable) {
      this.alpha = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
    } else {
      this.alpha = 1;
    }
  }
  updateInvulnerability(time) {
    // Actualizar estado de invulnerabilidad
    if (
      this.invulnerable &&
      time - this.invulnerabilityStart > this.invulnerabilityTime
    ) {
      this.invulnerable = false;
      this.alpha = 1;
    }
  }

  takeDamage() {
    if (this.invulnerable || !this.isAlive) return false;

    // Reducir vidas
    this.lives--;
    console.log(`Ship hit! Lives remaining: ${this.lives}`);

    // Actualizar UI de vidas
    const uiScene = this.scene.scene.get("UIScene");
    if (uiScene && uiScene.updateLives) {
      uiScene.updateLives(this.lives);
    }

    if (this.lives <= 0) {
      // Game Over - no más vidas
      this.gameOver();
      return true;
    } else {
      // Aún hay vidas, hacer respawn
      this.die();
      return false;
    }
  }

  gameOver() {
    this.isAlive = false;
    console.log("GAME OVER - No lives remaining!");

    // Crear efecto de explosión final
    this.createExplosionEffect();

    // Ocultar nave
    this.setVisible(false);

    // Notificar a GameScene sobre Game Over
    if (this.scene.handleGameOver) {
      this.scene.handleGameOver();
    }
  }

  die() {
    this.isAlive = false;

    // Crear efecto de explosión
    this.createExplosionEffect();

    // Respawn después de un delay
    this.scene.time.delayedCall(2000, () => {
      this.respawn();
    });

    // Ocultar nave temporalmente
    this.setVisible(false);

    console.log("Ship destroyed");
  }

  respawn() {
    // Solo hacer respawn si aún hay vidas
    if (this.lives <= 0) {
      console.log("Cannot respawn - no lives remaining");
      return;
    }

    // Reposicionar en el centro
    this.x = this.scene.sys.game.config.width / 2;
    this.y = this.scene.sys.game.config.height / 2;

    // Resetear física
    this.body.setVelocity(0, 0);
    this.body.setAngularVelocity(0);
    this.setRotation(0);

    // Activar invulnerabilidad
    this.isAlive = true;
    this.invulnerable = true;
    this.invulnerabilityStart = this.scene.time.now;
    this.setVisible(true);

    console.log(`Ship respawned - Lives remaining: ${this.lives}`);
  }

  createExplosionEffect() {
    // Crear explosión con partículas
    for (let i = 0; i < 8; i++) {
      const particle = this.scene.add.image(
        this.x + Phaser.Math.Between(-10, 10),
        this.y + Phaser.Math.Between(-10, 10),
        "particle"
      );

      // Animación de explosión
      this.scene.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-50, 50),
        y: particle.y + Phaser.Math.Between(-50, 50),
        alpha: 0,
        scale: 0,
        duration: 500,
        onComplete: () => {
          particle.destroy();
        },
      });
    }
  }

  destroy() {
    // Limpiar elementos de debug
    if (this.debugRect) {
      this.debugRect.destroy();
    }

    // Llamar al método destroy del padre
    super.destroy();
  }
}
