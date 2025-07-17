/**
 * Utilidades generales para el juego de carreras
 */

// Constantes del juego
const GAME_CONFIG = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 800,
    FPS: 60,
    FRAME_TIME: 1000 / 60
};

// Utilidades matemáticas
const MathUtils = {
    /**
     * Convierte grados a radianes
     * @param {number} degrees - Grados
     * @returns {number} Radianes
     */
    toRadians: (degrees) => degrees * (Math.PI / 180),

    /**
     * Convierte radianes a grados
     * @param {number} radians - Radianes
     * @returns {number} Grados
     */
    toDegrees: (radians) => radians * (180 / Math.PI),

    /**
     * Calcula la distancia entre dos puntos
     * @param {number} x1 - Coordenada X del primer punto
     * @param {number} y1 - Coordenada Y del primer punto
     * @param {number} x2 - Coordenada X del segundo punto
     * @param {number} y2 - Coordenada Y del segundo punto
     * @returns {number} Distancia
     */
    distance: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),

    /**
     * Interpola linealmente entre dos valores
     * @param {number} a - Valor inicial
     * @param {number} b - Valor final
     * @param {number} t - Factor de interpolación (0-1)
     * @returns {number} Valor interpolado
     */
    lerp: (a, b, t) => a + (b - a) * t,

    /**
     * Limita un valor entre un mínimo y máximo
     * @param {number} value - Valor a limitar
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {number} Valor limitado
     */
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),

    /**
     * Normaliza un ángulo entre 0 y 2π
     * @param {number} angle - Ángulo en radianes
     * @returns {number} Ángulo normalizado
     */
    normalizeAngle: (angle) => {
        while (angle < 0) angle += 2 * Math.PI;
        while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
        return angle;
    }
};

// Utilidades de tiempo
const TimeUtils = {
    /**
     * Formatea tiempo en milisegundos a formato MM:SS.mmm
     * @param {number} milliseconds - Tiempo en milisegundos
     * @returns {string} Tiempo formateado
     */
    formatTime: (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    },

    /**
     * Obtiene el tiempo actual en milisegundos de alta precisión
     * @returns {number} Tiempo actual
     */
    now: () => performance.now()
};

// Utilidades de colisión
const CollisionUtils = {
    /**
     * Detecta colisión entre dos rectángulos
     * @param {Object} rect1 - Primer rectángulo {x, y, width, height}
     * @param {Object} rect2 - Segundo rectángulo {x, y, width, height}
     * @returns {boolean} True si hay colisión
     */
    rectRect: (rect1, rect2) => {
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    },

    /**
     * Detecta colisión entre un punto y un rectángulo
     * @param {number} x - Coordenada X del punto
     * @param {number} y - Coordenada Y del punto
     * @param {Object} rect - Rectángulo {x, y, width, height}
     * @returns {boolean} True si hay colisión
     */
    pointRect: (x, y, rect) => {
        return x >= rect.x && x <= rect.x + rect.width &&
            y >= rect.y && y <= rect.y + rect.height;
    },

    /**
     * Detecta colisión entre un círculo y un rectángulo
     * @param {Object} circle - Círculo {x, y, radius}
     * @param {Object} rect - Rectángulo {x, y, width, height}
     * @returns {boolean} True si hay colisión
     */
    circleRect: (circle, rect) => {
        const closestX = MathUtils.clamp(circle.x, rect.x, rect.x + rect.width);
        const closestY = MathUtils.clamp(circle.y, rect.y, rect.y + rect.height);

        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;

        return (distanceX * distanceX + distanceY * distanceY) < (circle.radius * circle.radius);
    }
};

// Utilidades de canvas
const CanvasUtils = {
    /**
     * Limpia el canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     * @param {number} width - Ancho del canvas
     * @param {number} height - Alto del canvas
     */
    clear: (ctx, width, height) => {
        ctx.clearRect(0, 0, width, height);
    },

    /**
     * Dibuja un sprite rotado
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     * @param {HTMLImageElement} image - Imagen a dibujar
     * @param {number} x - Posición X
     * @param {number} y - Posición Y
     * @param {number} angle - Ángulo de rotación en radianes
     * @param {number} scale - Escala (opcional, default: 1)
     */
    drawRotatedImage: (ctx, image, x, y, angle, scale = 1) => {
        ctx.save();
        ctx.translate(x, y);
        // Añadir offset de 90 grados (π/2 radianes) para corregir la orientación del sprite
        // El sprite apunta hacia arriba por defecto, pero queremos que apunte hacia la derecha
        ctx.rotate(angle + Math.PI / 2);
        ctx.scale(scale, scale);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
    },

    /**
     * Dibuja texto con sombra
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     * @param {string} text - Texto a dibujar
     * @param {number} x - Posición X
     * @param {number} y - Posición Y
     * @param {string} color - Color del texto
     * @param {string} shadowColor - Color de la sombra
     * @param {number} fontSize - Tamaño de fuente
     */
    drawTextWithShadow: (ctx, text, x, y, color, shadowColor, fontSize) => {
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Sombra
        ctx.fillStyle = shadowColor;
        ctx.fillText(text, x + 2, y + 2);

        // Texto
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }
};

// Utilidades de gestión de pantallas
const ScreenUtils = {
    /**
     * Cambia a una pantalla específica
     * @param {string} screenId - ID de la pantalla
     */
    showScreen: (screenId) => {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar la pantalla especificada
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    },

    /**
     * Actualiza la barra de progreso de carga
     * @param {number} progress - Progreso (0-100)
     * @param {string} text - Texto descriptivo
     */
    updateLoadingProgress: (progress, text) => {
        const progressBar = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (loadingText) {
            loadingText.textContent = text;
        }
    }
};

// Utilidades de debug
const DebugUtils = {
    /**
     * Muestra información de debug en pantalla
     * @param {Object} data - Datos a mostrar
     */
    showDebugInfo: (data) => {
        let debugElement = document.querySelector('.debug-info');

        if (!debugElement) {
            debugElement = document.createElement('div');
            debugElement.className = 'debug-info';
            document.body.appendChild(debugElement);
        }

        const debugText = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

        debugElement.textContent = debugText;
    },

    /**
     * Oculta la información de debug
     */
    hideDebugInfo: () => {
        const debugElement = document.querySelector('.debug-info');
        if (debugElement) {
            debugElement.remove();
        }
    }
};

// Exportar utilidades globalmente
window.GameUtils = {
    MathUtils,
    TimeUtils,
    CollisionUtils,
    CanvasUtils,
    ScreenUtils,
    DebugUtils,
    GAME_CONFIG
}; 