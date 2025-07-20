/**
 * EJEMPLO DE USO: WorldUtils.js - Sistema de Wrap
 *
 * Este archivo demuestra los diferentes usos del sistema de wrap
 * desarrollado para el juego Asteroids.
 */

// ===========================================
// EJEMPLO 1: Uso Básico
// ===========================================

function ejemploBasico() {
  // Configurar automáticamente desde una escena
  WrapUtils.setupBounds(this); // 'this' = referencia a la escena

  // Hacer wrap de un sprite individual
  WrapUtils.wrap(miSprite);

  // Con margen personalizado
  WrapUtils.wrap(miSprite, null, 20);
}

// ===========================================
// EJEMPLO 2: Límites Personalizados
// ===========================================

function ejemploLimitesPersonalizados() {
  // Crear límites personalizados
  const limitesPersonalizados = WrapUtils.createBounds(100, 50, 600, 400);

  // Usar los límites personalizados
  WrapUtils.wrap(miSprite, limitesPersonalizados);

  // O usar límites estándar de Asteroids
  const limitesEstandar = WrapUtils.getStandardBounds(); // 800x600
  WrapUtils.wrap(miSprite, limitesEstandar);
}

// ===========================================
// EJEMPLO 3: Wrap Múltiple y Grupos
// ===========================================

function ejemploWrapMultiple() {
  // Wrap de array de sprites
  const misAsteroides = [asteroide1, asteroide2, asteroide3];
  const wrapped = WrapUtils.wrapMultiple(misAsteroides);
  console.log(`${wrapped} asteroides hicieron wrap`);

  // Wrap de grupo de Phaser
  const wrappedGroup = WrapUtils.wrapGroup(this.bullets);
  console.log(`${wrappedGroup} balas hicieron wrap`);

  // Wrap con margen para asteroides (basado en su tamaño)
  misAsteroides.forEach((asteroide) => {
    WrapUtils.wrap(asteroide, null, asteroide.radius);
  });
}

// ===========================================
// EJEMPLO 4: Verificaciones y Utilidades
// ===========================================

function ejemploVerificaciones() {
  // Verificar si un sprite está dentro de límites
  const dentroLimites = WrapUtils.isWithinBounds(miSprite);

  if (!dentroLimites) {
    console.log("¡Sprite fuera de límites!");
    WrapUtils.wrap(miSprite);
  }

  // Verificar con margen de tolerancia
  const enZonaSegura = WrapUtils.isWithinBounds(miSprite, null, 50);

  if (!enZonaSegura) {
    console.warn("Sprite cerca del borde");
  }
}

// ===========================================
// EJEMPLO 5: Debug y Monitoreo
// ===========================================

function ejemploDebugging() {
  // Habilitar modo debug
  WrapUtils.setDebugMode(true);

  // Ahora todos los wraps mostrarán información en consola
  WrapUtils.wrap(miSprite); // Mostrará: "Wrapped Ship: left->right"

  // Deshabilitar cuando no se necesite
  WrapUtils.setDebugMode(false);
}

// ===========================================
// EJEMPLO 6: Integración en GameScene
// ===========================================

class EjemploGameScene extends Phaser.Scene {
  create() {
    // Setup inicial
    WrapUtils.setupBounds(this);

    // Crear entidades
    this.crearEntidades();
  }

  update() {
    // Wrap eficiente de todos los grupos
    WrapUtils.wrapGroup(this.bullets);
    WrapUtils.wrapGroup(this.asteroids);

    // Wrap individual de la nave (si existe)
    if (this.ship && this.ship.active) {
      WrapUtils.wrap(this.ship);
    }
  }

  crearEntidades() {
    // Usar en clases de entidades
    this.bullets = this.add.group();
    this.asteroids = this.add.group();

    // Las entidades individuales pueden usar wrap en sus métodos update()
  }
}

// ===========================================
// EJEMPLO 7: Wrap en Clases de Entidades
// ===========================================

class EjemploShip extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "ship");

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  update() {
    // Manejo de input...
    this.handleInput();

    // Wrap automático cada frame
    WrapUtils.wrap(this);
  }

  // Método alternativo con verificación
  updateWithCheck() {
    // Solo hacer wrap si está cerca del borde
    if (!WrapUtils.isWithinBounds(this, null, 30)) {
      WrapUtils.wrap(this);
    }
  }
}

// ===========================================
// EJEMPLO 8: Uso Avanzado con Custom Bounds
// ===========================================

function ejemploAvanzado() {
  // Diferentes zonas de juego
  const zonaJuego = { x: 0, y: 0, width: 800, height: 600 };
  const zonaCombate = { x: 50, y: 50, width: 700, height: 500 };
  const zonaSegura = { x: 100, y: 100, width: 600, height: 400 };

  // Enemigos en zona de combate
  WrapUtils.wrapMultiple(enemigos, zonaCombate);

  // Jugador en zona completa
  WrapUtils.wrap(jugador, zonaJuego);

  // Power-ups en zona segura
  WrapUtils.wrapMultiple(powerUps, zonaSegura, 10);
}

// ===========================================
// EJEMPLO 9: Optimización y Performance
// ===========================================

class OptimizedGameScene extends Phaser.Scene {
  create() {
    WrapUtils.setupBounds(this);

    // Cache de límites para evitar recalculos
    this.gameBounds = WrapUtils.getStandardBounds();
    this.smallMargin = 5;
    this.largeMargin = 20;
  }

  update() {
    // Wrap optimizado: solo entidades activas
    this.bullets.children.entries.forEach((bullet) => {
      if (bullet.active) {
        WrapUtils.wrap(bullet, this.gameBounds, this.smallMargin);
      }
    });

    // Wrap con margen adaptativo basado en velocidad
    this.asteroids.children.entries.forEach((asteroid) => {
      if (asteroid.active) {
        const speedMargin = Math.min(asteroid.body.speed * 0.1, 30);
        WrapUtils.wrap(asteroid, this.gameBounds, speedMargin);
      }
    });
  }
}

// ===========================================
// EJEMPLO 10: Testing y Validación
// ===========================================

function ejemploTesting() {
  // Crear sprite de prueba
  const testSprite = { x: -50, y: 300, width: 20, height: 20 };

  console.log("Posición inicial:", testSprite.x, testSprite.y);

  // Hacer wrap
  const wasWrapped = WrapUtils.wrap(testSprite);

  console.log("Posición después de wrap:", testSprite.x, testSprite.y);
  console.log("¿Se hizo wrap?", wasWrapped);

  // Verificar que está dentro de límites
  const isInside = WrapUtils.isWithinBounds(testSprite);
  console.log("¿Está dentro de límites?", isInside);
}

/**
 * NOTAS DE USO:
 *
 * 1. Siempre llamar WrapUtils.setupBounds(scene) al inicio
 * 2. WrapUtils.wrap() es la función principal
 * 3. Usar márgenes apropiados según el tipo de objeto
 * 4. El sistema es totalmente compatible con Phaser.GameObjects
 * 5. Todas las funciones son seguras ante null/undefined
 * 6. El debug mode ayuda durante desarrollo
 * 7. Las funciones devuelven información útil (boolean/count)
 * 8. Compatible con sprites, groups, y arrays
 */
