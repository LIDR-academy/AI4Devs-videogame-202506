/**
 * Sistema de HUD (Heads Up Display) para el juego
 */

class HUD {
    constructor() {
        // Configuración
        this.config = {
            chronoPosition: { x: 600, y: 50 },
            speedPosition: { x: 100, y: 700 }
        };

        // Estado
        this.lastSpeed = 0;
    }

    /**
     * Actualiza el HUD
     * @param {Car} car - Instancia del coche
     * @param {Object} lapTimer - Cronómetro de vuelta
     */
    update(car, lapTimer) {
        if (!car) return;

        // Actualizar elementos HTML
        this.updateHtmlElements(car, lapTimer);
    }

    /**
     * Actualiza los elementos HTML del HUD
     * @param {Car} car - Instancia del coche
     * @param {Object} lapTimer - Cronómetro de vuelta
     */
    updateHtmlElements(car, lapTimer) {
        // Actualizar velocidad
        const speedText = document.getElementById('speed-text');
        if (speedText) {
            const speedKmh = Math.round(car.getSpeedKmh());
            speedText.textContent = `${speedKmh} km/h`;
        }

        // Actualizar marcha
        const rpmIndicator = document.getElementById('rpm-indicator');
        if (rpmIndicator) {
            const gear = car.getGear();
            rpmIndicator.textContent = gear;
        }

        // Actualizar cronómetro
        if (lapTimer && lapTimer.isRunning) {
            const currentTime = performance.now() - lapTimer.startTime;
            const timeElement = document.getElementById('lap-time');
            if (timeElement) {
                timeElement.textContent = window.GameUtils.TimeUtils.formatTime(currentTime);
            }
        }
    }

    /**
     * Renderiza el HUD en el canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     */
    render(ctx) {
        // Renderizar información adicional
        this.renderAdditionalInfo(ctx);
    }

    /**
     * Renderiza información adicional
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     */
    renderAdditionalInfo(ctx) {
        // Información de debug (opcional)
        if (window.game && window.game.gameState === 'debug') {
            this.renderDebugInfo(ctx);
        }
    }

    /**
     * Renderiza información de debug
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     */
    renderDebugInfo(ctx) {
        ctx.fillStyle = '#00ff00';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';

        let y = 30;
        const lineHeight = 20;

        // FPS
        if (window.game) {
            ctx.fillText(`FPS: ${window.game.fps}`, 10, y);
            y += lineHeight;

            // Estado del juego
            ctx.fillText(`Estado: ${window.game.gameState}`, 10, y);
            y += lineHeight;

            // Información del coche
            if (window.game.car) {
                const carInfo = window.game.car.getDebugInfo();
                ctx.fillText(`Velocidad: ${carInfo.speedKmh} km/h`, 10, y);
                y += lineHeight;
                ctx.fillText(`Marcha: ${carInfo.gear}`, 10, y);
                y += lineHeight;
                ctx.fillText(`Posición: (${carInfo.position.x}, ${carInfo.position.y})`, 10, y);
                y += lineHeight;
                ctx.fillText(`Ángulo: ${carInfo.angle}°`, 10, y);
            }
        }
    }

    /**
     * Muestra un mensaje temporal
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en milisegundos
     */
    showMessage(message, duration = 3000) {
        // Crear elemento de mensaje
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: #ffd700;
            padding: 20px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut ${duration}ms ease-in-out;
        `;

        // Añadir animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);

        // Añadir al DOM
        document.body.appendChild(messageElement);

        // Remover después de la duración
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, duration);
    }

    /**
     * Actualiza la configuración del HUD
     * @param {Object} config - Nueva configuración
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }

    /**
     * Obtiene información de debug del HUD
     * @returns {Object} Información de debug
     */
    getDebugInfo() {
        return {
            config: this.config,
            lastSpeed: this.lastSpeed
        };
    }
}

// Exportar clase globalmente
window.HUD = HUD; 