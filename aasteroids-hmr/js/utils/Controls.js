// Controls.js - Sistema de controles exportable para la nave
class Controls {
  constructor(scene, ship) {
    this.scene = scene;
    this.ship = ship;

    // Configurar teclas
    this.setupKeys();

    // Estado de las teclas para movimiento direccional
    this.keyStates = {
      up: false, // W/↑ - Arriba
      down: false, // S/↓ - Abajo
      left: false, // A/← - Izquierda
      right: false, // D/→ - Derecha
      shoot: false,
    };

    console.log("Controls system initialized");
  }

  setupKeys() {
    // Mapeo de teclas principales
    this.keys = {
      // Movimiento direccional (WASD)
      w: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),

      // Flechas como alternativa
      up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.DOWN
      ),
      left: this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.LEFT
      ),
      right: this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.RIGHT
      ),

      // Disparo
      space: this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      ),
    };

    // Configurar mouse para disparo
    this.setupMouse();
  }

  setupMouse() {
    // Configurar input del mouse
    this.scene.input.on("pointerdown", (pointer) => {
      if (pointer.leftButtonDown()) {
        // Disparar cuando se hace click izquierdo
        this.mouseShoot = true;
      }
    });

    this.scene.input.on("pointerup", (pointer) => {
      // Detener disparo cuando se suelta el botón
      this.mouseShoot = false;
    });

    // Inicializar estado del mouse
    this.mouseShoot = false;
  }

  update() {
    // Actualizar estado de las teclas
    this.updateKeyStates();

    // Aplicar controles a la nave
    this.applyControls();
  }

  updateKeyStates() {
    // Movimiento direccional absoluto (WASD)
    this.keyStates.up = this.keys.w.isDown || this.keys.up.isDown;
    this.keyStates.down = this.keys.s.isDown || this.keys.down.isDown;
    this.keyStates.left = this.keys.a.isDown || this.keys.left.isDown;
    this.keyStates.right = this.keys.d.isDown || this.keys.right.isDown;

    // Disparo (Espacio O click izquierdo del mouse)
    this.keyStates.shoot = this.keys.space.isDown || this.mouseShoot;
  }

  applyControls() {
    if (!this.ship || !this.ship.isAlive) return;

    // Aplicar movimiento direccional
    this.applyMovement();

    // Rotación automática hacia el mouse - no aplicar rotación manual
    // this.applyRotation();

    // Aplicar disparo
    this.applyShoot();
  }

  applyMovement() {
    if (!this.ship || !this.ship.isAlive) return;

    // Determinar dirección de movimiento basado en teclas presionadas
    const up = this.keyStates.up;
    const down = this.keyStates.down;
    const left = this.keyStates.left;
    const right = this.keyStates.right;

    // Aplicar movimiento direccional con soporte para diagonal
    if (up && left) {
      this.ship.moveUpLeft();
    } else if (up && right) {
      this.ship.moveUpRight();
    } else if (down && left) {
      this.ship.moveDownLeft();
    } else if (down && right) {
      this.ship.moveDownRight();
    } else if (up) {
      this.ship.moveUp();
    } else if (down) {
      this.ship.moveDown();
    } else if (left) {
      this.ship.moveLeft();
    } else if (right) {
      this.ship.moveRight();
    } else {
      // No hay teclas presionadas, detener movimiento
      this.ship.stopMovement();
    }
  }

  applyRotation() {
    const rotationSpeed = 5;

    if (this.keyStates.left) {
      // Rotar hacia la izquierda
      this.ship.setAngularVelocity(-rotationSpeed * 60);
    } else if (this.keyStates.right) {
      // Rotar hacia la derecha
      this.ship.setAngularVelocity(rotationSpeed * 60);
    } else {
      // Detener rotación
      this.ship.setAngularVelocity(0);
    }
  }

  applyShoot() {
    if (this.keyStates.shoot) {
      // Calcular el ángulo hacia el mouse para el disparo
      const mouseAngle = this.ship.getAngleToMouse();

      // Intentar disparar hacia el mouse (la nave maneja el rate limiting)
      this.ship.tryToFire(this.scene.time.now, mouseAngle);
    }
  }

  // Método para obtener el estado actual de los controles
  getControlState() {
    return { ...this.keyStates };
  }

  // Método para verificar si una tecla específica está presionada
  isKeyDown(keyName) {
    return this.keyStates[keyName] || false;
  }

  // Método para cambiar el mapeo de teclas (personalización)
  remapKey(action, keyCode) {
    if (this.keys[keyCode]) {
      // Actualizar el mapeo de teclas
      this.keys[keyCode] = this.scene.input.keyboard.addKey(keyCode);
      console.log(`Key ${keyCode} remapped to action: ${action}`);
    }
  }
}

// Funciones exportables para facilitar el uso
const ControlUtils = {
  // Crear una instancia de controles para una nave
  createShipControls: function (scene, ship) {
    return new Controls(scene, ship);
  },

  // Mapear teclas estándar para Asteroids
  setupStandardMapping: function (scene, ship) {
    const controls = new Controls(scene, ship);
    console.log("Standard Asteroids controls mapped:");
    console.log("W/↑: Forward thrust");
    console.log("S/↓: Backward thrust");
    console.log("A/←: Rotate left");
    console.log("D/→: Rotate right");
    console.log("SPACE: Shoot");
    return controls;
  },

  // Obtener información sobre los controles
  getControlsInfo: function () {
    return {
      movement: {
        forward: ["W", "Arrow Up"],
        backward: ["S", "Arrow Down"],
        rotateLeft: ["A", "Arrow Left"],
        rotateRight: ["D", "Arrow Right"],
      },
      actions: {
        shoot: ["SPACE"],
      },
    };
  },

  // Validar que las teclas están correctamente configuradas
  validateControls: function (controls) {
    const requiredKeys = ["forward", "backward", "left", "right", "shoot"];
    const isValid = requiredKeys.every((key) =>
      controls.keyStates.hasOwnProperty(key)
    );

    console.log(`Controls validation: ${isValid ? "PASSED" : "FAILED"}`);
    return isValid;
  },
};

// Hacer disponible globalmente para uso en otros archivos
window.Controls = Controls;
window.ControlUtils = ControlUtils;
