class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, angle) {
    super(scene, x, y, "bullet");

    // Añadir a la escena y habilitar física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configuración de la bala
    this.speed = 400; // Velocidad fija en píxeles por segundo
    this.lifeTime = 2000; // Vida de 2 segundos en milisegundos
    this.isActive = true;

    // ESCALADO AUTOMÁTICO: Reducir la bala a tamaño pequeño
    const targetSize = 8; // Tamaño objetivo para la bala
    const currentSize = Math.max(this.width, this.height);
    const scaleRatio = targetSize / currentSize;

    console.log(
      `Bullet: Original size ${currentSize}px, scaled to ${scaleRatio.toFixed(
        2
      )}`
    );

    // CONFIGURAR FÍSICA ANTES DEL ESCALADO
    const radius = targetSize / 2;
    this.body.setCircle(radius);

    // APLICAR ESCALADO DESPUÉS de configurar física
    this.setScale(scaleRatio);

    // FORZAR tamaño del cuerpo después del escalado para evitar que se escale automáticamente
    this.body.setCircle(radius);

    this.setRotation(angle); // Establecer rotación inicial

    console.log(
      `Bullet body configured: circle radius=${radius}, original size=${currentSize}, scale=${scaleRatio.toFixed(
        2
      )}`
    ); // DEBUG: Crear una caja visual para debug
    if (this.scene.physics.world.drawDebug) {
      this.debugRect = this.scene.add.rectangle(0, 0, targetSize, targetSize);
      this.debugRect.setStrokeStyle(2, 0xff0000);
      this.debugRect.setOrigin(0.5, 0.5);
    }

    // Calcular velocidad basada en el ángulo ajustado para nueva orientación
    const velocityX = Math.sin(angle) * this.speed;
    const velocityY = -Math.cos(angle) * this.speed;

    // Aplicar velocidad
    this.body.setVelocity(velocityX, velocityY);

    // Configurar límites del mundo con wrap-around
    this.body.setCollideWorldBounds(false);

    // Iniciar timer de auto-destrucción
    this.startLifeTimer();

    console.log(
      `Bullet created at (${x}, ${y}) with angle ${angle}, velocity (${velocityX.toFixed(
        2
      )}, ${velocityY.toFixed(2)})`
    );
  }

  startLifeTimer() {
    // Timer que destruye la bala después del tiempo de vida
    this.scene.time.delayedCall(this.lifeTime, () => {
      this.destroy();
    });
  }

  update() {
    if (!this.isActive) return;

    // DEBUG: Actualizar posición del rectángulo de debug
    if (this.debugRect) {
      this.debugRect.x = this.x;
      this.debugRect.y = this.y;
    }

    // Wrap-around: si la bala sale de los límites, aparece del otro lado
    this.wrapAroundWorld();

    // Verificar si sigue siendo válida
    if (!this.active) {
      this.isActive = false;
    }
  }

  wrapAroundWorld() {
    // Usar la nueva función wrap de WorldUtils
    WrapUtils.wrap(this);
  }

  onCollision() {
    // Método llamado cuando la bala colisiona con algo
    this.explode();
  }

  explode() {
    // Crear efecto de explosión simple
    this.createExplosionEffect();

    // Auto-destruirse
    this.destroy();
  }

  createExplosionEffect() {
    // Verificar que la escena esté disponible
    if (!this.scene || !this.scene.add) {
      console.warn("Cannot create explosion effect: scene not available");
      return;
    }

    // Crear pequeñas partículas amarillas para el efecto de impacto
    for (let i = 0; i < 3; i++) {
      const particle = this.scene.add.image(
        this.x + Phaser.Math.Between(-5, 5),
        this.y + Phaser.Math.Between(-5, 5),
        "particle"
      );

      // Animación de desvanecimiento
      this.scene.tweens.add({
        targets: particle,
        alpha: 0,
        scale: 0.5,
        duration: 200,
        onComplete: () => {
          particle.destroy();
        },
      });
    }
  }

  destroy() {
    // Marcar como inactiva antes de destruir
    this.isActive = false;

    // Limpiar elementos de debug
    if (this.debugRect) {
      this.debugRect.destroy();
    }

    // Llamar al método destroy del padre
    super.destroy();

    console.log("Bullet destroyed");
  }

  // Método estático para crear balas desde otras clases
  static fire(scene, x, y, angle) {
    return new Bullet(scene, x, y, angle);
  }
}
