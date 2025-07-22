// WorldUtils.js - Utilidades para manejo del mundo del juego
class WorldUtils {
  constructor() {
    // Configuración por defecto del mundo
    this.defaultBounds = {
      x: 0,
      y: 0,
      width: 800,
      height: 600,
    };
  }

  /**
   * Función principal wrap - Reubica objetos que salen del canvas al lado opuesto
   * @param {Phaser.GameObjects.Sprite} sprite - El sprite a verificar y reposicionar
   * @param {Object} worldBounds - Los límites del mundo {x, y, width, height}
   * @param {number} margin - Margen adicional para el wrap (opcional)
   */
  wrap(sprite, worldBounds = null, margin = 0) {
    // Usar límites por defecto si no se proporcionan
    const bounds = worldBounds || this.defaultBounds;

    // Obtener dimensiones del sprite para cálculos precisos
    const spriteWidth = sprite.displayWidth || sprite.width || 20;
    const spriteHeight = sprite.displayHeight || sprite.height || 20;

    // Calcular offset basado en el tamaño del sprite y margen
    const offsetX = spriteWidth / 2 + margin;
    const offsetY = spriteHeight / 2 + margin;

    // Variables para tracking de wrap (opcional para debugging)
    let wrapped = false;
    let wrapDirection = "";

    // Wrap horizontal
    if (sprite.x < bounds.x - offsetX) {
      sprite.x = bounds.x + bounds.width + offsetX;
      wrapped = true;
      wrapDirection += "left->right ";
    } else if (sprite.x > bounds.x + bounds.width + offsetX) {
      sprite.x = bounds.x - offsetX;
      wrapped = true;
      wrapDirection += "right->left ";
    }

    // Wrap vertical
    if (sprite.y < bounds.y - offsetY) {
      sprite.y = bounds.y + bounds.height + offsetY;
      wrapped = true;
      wrapDirection += "top->bottom ";
    } else if (sprite.y > bounds.y + bounds.height + offsetY) {
      sprite.y = bounds.y - offsetY;
      wrapped = true;
      wrapDirection += "bottom->top ";
    }

    // Log opcional para debugging
    if (wrapped && WorldUtils.debugMode) {
      console.log(
        `Wrapped ${sprite.constructor.name}: ${wrapDirection.trim()}`
      );
    }

    return wrapped;
  }

  /**
   * Wrap múltiples sprites a la vez
   * @param {Array} sprites - Array de sprites a verificar
   * @param {Object} worldBounds - Los límites del mundo
   * @param {number} margin - Margen adicional
   */
  wrapMultiple(sprites, worldBounds = null, margin = 0) {
    let wrappedCount = 0;

    sprites.forEach((sprite) => {
      if (sprite && sprite.active) {
        if (this.wrap(sprite, worldBounds, margin)) {
          wrappedCount++;
        }
      }
    });

    return wrappedCount;
  }

  /**
   * Wrap específico para Phaser Groups
   * @param {Phaser.GameObjects.Group} group - Grupo de Phaser
   * @param {Object} worldBounds - Los límites del mundo
   * @param {number} margin - Margen adicional
   */
  wrapGroup(group, worldBounds = null, margin = 0) {
    if (!group || !group.children) return 0;

    return this.wrapMultiple(group.children.entries, worldBounds, margin);
  }

  /**
   * Configurar límites del mundo basados en una escena de Phaser
   * @param {Phaser.Scene} scene - Escena de Phaser
   */
  setBoundsFromScene(scene) {
    this.defaultBounds = {
      x: 0,
      y: 0,
      width: scene.sys.game.config.width,
      height: scene.sys.game.config.height,
    };

    console.log("World bounds set from scene:", this.defaultBounds);
    return this.defaultBounds;
  }

  /**
   * Verificar si un sprite está dentro de los límites
   * @param {Phaser.GameObjects.Sprite} sprite - El sprite a verificar
   * @param {Object} worldBounds - Los límites del mundo
   * @param {number} margin - Margen de tolerancia
   */
  isWithinBounds(sprite, worldBounds = null, margin = 0) {
    const bounds = worldBounds || this.defaultBounds;
    const spriteWidth = sprite.displayWidth || sprite.width || 20;
    const spriteHeight = sprite.displayHeight || sprite.height || 20;

    const offsetX = spriteWidth / 2 + margin;
    const offsetY = spriteHeight / 2 + margin;

    return (
      sprite.x >= bounds.x - offsetX &&
      sprite.x <= bounds.x + bounds.width + offsetX &&
      sprite.y >= bounds.y - offsetY &&
      sprite.y <= bounds.y + bounds.height + offsetY
    );
  }

  /**
   * Calcular la distancia más corta entre dos puntos considerando wrap-around
   * @param {number} x1, y1 - Primer punto
   * @param {number} x2, y2 - Segundo punto
   * @param {Object} worldBounds - Los límites del mundo
   */
  shortestDistance(x1, y1, x2, y2, worldBounds = null) {
    const bounds = worldBounds || this.defaultBounds;

    // Calcular distancias directas y wrapped
    const dx1 = Math.abs(x2 - x1);
    const dx2 = Math.abs(x2 + bounds.width - x1);
    const dx3 = Math.abs(x2 - (x1 + bounds.width));

    const dy1 = Math.abs(y2 - y1);
    const dy2 = Math.abs(y2 + bounds.height - y1);
    const dy3 = Math.abs(y2 - (y1 + bounds.height));

    const shortestDx = Math.min(dx1, dx2, dx3);
    const shortestDy = Math.min(dy1, dy2, dy3);

    return Math.sqrt(shortestDx * shortestDx + shortestDy * shortestDy);
  }
}

// Instancia global para uso fácil
const worldUtils = new WorldUtils();

// Funciones exportables para uso directo
const WrapUtils = {
  /**
   * Función wrap simplificada para uso directo
   * @param {Phaser.GameObjects.Sprite} sprite - El sprite a wrap
   * @param {Object} worldBounds - Los límites del mundo (opcional)
   * @param {number} margin - Margen adicional (opcional)
   */
  wrap: function (sprite, worldBounds, margin = 0) {
    return worldUtils.wrap(sprite, worldBounds, margin);
  },

  /**
   * Wrap para múltiples sprites
   */
  wrapMultiple: function (sprites, worldBounds, margin = 0) {
    return worldUtils.wrapMultiple(sprites, worldBounds, margin);
  },

  /**
   * Wrap para grupos de Phaser
   */
  wrapGroup: function (group, worldBounds, margin = 0) {
    return worldUtils.wrapGroup(group, worldBounds, margin);
  },

  /**
   * Configurar límites automáticamente desde una escena
   */
  setupBounds: function (scene) {
    return worldUtils.setBoundsFromScene(scene);
  },

  /**
   * Verificar si está dentro de límites
   */
  isWithinBounds: function (sprite, worldBounds, margin = 0) {
    return worldUtils.isWithinBounds(sprite, worldBounds, margin);
  },

  /**
   * Crear límites personalizados
   */
  createBounds: function (x, y, width, height) {
    return { x, y, width, height };
  },

  /**
   * Obtener límites estándar de Asteroids (800x600)
   */
  getStandardBounds: function () {
    return { x: 0, y: 0, width: 800, height: 600 };
  },

  /**
   * Habilitar/deshabilitar debug logging
   */
  setDebugMode: function (enabled) {
    WorldUtils.debugMode = enabled;
    console.log(`Wrap debug mode: ${enabled ? "ENABLED" : "DISABLED"}`);
  },
};

// Variable estática para debug
WorldUtils.debugMode = false;

// Hacer disponible globalmente
window.WorldUtils = WorldUtils;
window.WrapUtils = WrapUtils;
window.worldUtils = worldUtils;
