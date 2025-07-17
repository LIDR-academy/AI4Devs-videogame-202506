/**
 * Clase del vehículo del jugador
 */

class Car {
    constructor(x, y) {
        // Posición y movimiento
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.angle = 1.554255; // Ángulo inicial para la última curva

        // Física
        this.acceleration = 0;
        this.maxSpeed = 600; // Aumentado de 200 a 600 para mayor velocidad
        this.minSpeed = -150; // Velocidad de retroceso aumentada proporcionalmente
        this.accelerationRate = 1.2; // Aumentado de 0.5 a 1.2 para aceleración más rápida
        this.brakeRate = 1.5; // Aumentado de 0.8 a 1.5 para frenado más efectivo
        this.friction = 0.985; // Reducido ligeramente de 0.98 para menos resistencia
        this.turnSpeed = 0.02; // Velocidad de giro constante más suave

        // Dimensiones
        this.width = 40;
        this.height = 20;

        // Estado
        this.accelerationEnabled = true;
        this.isMoving = false;
        this.collisionShake = 0;
        this.lastCollisionTime = 0;

        // Sprite
        this.sprite = null;
        this.spriteScale = 0.5;

        // Animación
        this.animationFrame = 0;
        this.animationSpeed = 0.2;
        this.animationTimer = 0;

        // Límites del canvas
        this.canvasBounds = {
            width: 1200,
            height: 800
        };

        this.loadSprite();
    }

    /**
     * Carga el sprite del coche
     */
    loadSprite() {
        if (window.assetManager) {
            this.sprite = window.assetManager.getImage('car');
        }
    }

    /**
     * Actualiza la lógica del coche
     * @param {number} deltaTime - Tiempo transcurrido desde el último frame
     * @param {InputManager} input - Gestor de input
     */
    update(deltaTime, input) {
        // Convertir deltaTime a segundos
        const dt = deltaTime / 1000;

        // Procesar input
        this.processInput(input, dt);

        // Aplicar física
        this.applyPhysics(dt);

        // Actualizar posición
        this.updatePosition(dt);

        // Mantener dentro de límites
        this.keepInBounds();

        // Actualizar animación
        this.updateAnimation(deltaTime);

        // Actualizar efectos de colisión
        this.updateCollisionEffects(deltaTime);
    }

    /**
     * Procesa el input del jugador
     * @param {InputManager} input - Gestor de input
     * @param {number} dt - Delta time en segundos
     */
    processInput(input, dt) {
        if (!input) return;

        const directional = input.getDirectionalInput();

        // Aceleración
        if (directional.up && this.accelerationEnabled) {
            this.acceleration = this.accelerationRate;
            this.isMoving = true;
        }
        // Frenado
        else if (directional.down) {
            this.acceleration = -this.brakeRate;
            this.isMoving = true;
        }
        // Sin aceleración (fricción)
        else {
            this.acceleration = 0;
            this.isMoving = false;
        }

        // Giro
        if (directional.left) {
            this.turn(-1, dt);
        }
        if (directional.right) {
            this.turn(1, dt);
        }
    }

    /**
 * Aplica la física del coche
 * @param {number} dt - Delta time en segundos
 */
    applyPhysics(dt) {
        // Aplicar aceleración con curva más realista
        if (this.acceleration !== 0) {
            // Curva de aceleración mejorada: más eficiente a velocidades altas
            const accelerationCurve = 1 - (Math.abs(this.velocity) / this.maxSpeed) * 0.15;
            this.velocity += this.acceleration * dt * 60 * accelerationCurve;
        }

        // Limitar velocidad
        this.velocity = window.GameUtils.MathUtils.clamp(this.velocity, this.minSpeed, this.maxSpeed);

        // Aplicar fricción con variación según velocidad
        if (this.acceleration === 0) {
            const frictionCurve = this.friction + (Math.abs(this.velocity) / this.maxSpeed) * 0.02;
            this.velocity *= frictionCurve;
        }

        // Fricción de rodadura (siempre presente) - reducida para mejor velocidad
        const rollingFriction = 0.998;
        this.velocity *= rollingFriction;

        // Detener si la velocidad es muy baja
        if (Math.abs(this.velocity) < 0.5) {
            this.velocity = 0;
        }
    }

    /**
     * Actualiza la posición del coche
     * @param {number} dt - Delta time en segundos
     */
    updatePosition(dt) {
        // Calcular movimiento basado en velocidad y dirección
        // Ajustar el ángulo para que 0 grados apunte hacia la derecha (eje X positivo)
        const moveX = Math.cos(this.angle) * this.velocity * dt;
        const moveY = Math.sin(this.angle) * this.velocity * dt;

        this.x += moveX;
        this.y += moveY;
    }

    /**
 * Gira el coche
 * @param {number} direction - Dirección del giro (-1: izquierda, 1: derecha)
 * @param {number} dt - Delta time en segundos
 */
    turn(direction, dt) {
        // Velocidad de giro constante - más predecible y controlable
        const turnAmount = this.turnSpeed * direction * dt * 60;

        // Aplicar giro directamente sin curvas variables
        this.angle += turnAmount;

        // Normalizar ángulo
        this.angle = window.GameUtils.MathUtils.normalizeAngle(this.angle);
    }

    /**
 * Mantiene el coche dentro de los límites del mapa
 */
    keepInBounds() {
        const margin = 20;
        let collision = false;

        // Usar límites del mapa si están disponibles, sino usar límites del canvas
        const bounds = this.mapBounds || this.canvasBounds;

        // Límites X
        if (this.x < margin) {
            this.x = margin;
            collision = true;
        } else if (this.x > bounds.width - margin) {
            this.x = bounds.width - margin;
            collision = true;
        }

        // Límites Y
        if (this.y < margin) {
            this.y = margin;
            collision = true;
        } else if (this.y > bounds.height - margin) {
            this.y = bounds.height - margin;
            collision = true;
        }

        // Efectos de colisión
        if (collision) {
            this.handleCollision();
        }
    }

    /**
     * Maneja los efectos de colisión
     */
    handleCollision() {
        // Reducir velocidad significativamente
        this.velocity *= 0.3;

        // Añadir vibración temporal
        this.collisionShake = 5;

        // Efecto de rebote (pequeño)
        const bounceForce = 2;
        this.velocity += (Math.random() - 0.5) * bounceForce;

        // Limitar velocidad después de colisión
        this.velocity = window.GameUtils.MathUtils.clamp(this.velocity, -this.maxSpeed * 0.5, this.maxSpeed * 0.5);
    }

    /**
 * Actualiza la animación del sprite
 * @param {number} deltaTime - Tiempo transcurrido desde el último frame
 */
    updateAnimation(deltaTime) {
        if (this.isMoving) {
            this.animationTimer += deltaTime;

            if (this.animationTimer >= this.animationSpeed * 1000) {
                this.animationFrame = (this.animationFrame + 1) % 4; // 4 frames de animación
                this.animationTimer = 0;
            }
        }
    }

    /**
     * Actualiza los efectos de colisión
     * @param {number} deltaTime - Tiempo transcurrido desde el último frame
     */
    updateCollisionEffects(deltaTime) {
        // Reducir vibración de colisión
        if (this.collisionShake > 0) {
            this.collisionShake -= deltaTime * 0.01;
            if (this.collisionShake < 0) {
                this.collisionShake = 0;
            }
        }
    }

    /**
 * Renderiza el coche
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 */
    render(ctx) {
        // Aplicar efectos de colisión
        const shakeOffset = this.collisionShake > 0 ? (Math.random() - 0.5) * this.collisionShake : 0;
        const renderX = this.x + shakeOffset;
        const renderY = this.y + shakeOffset;

        if (this.sprite) {
            // Renderizar sprite rotado con efectos
            window.GameUtils.CanvasUtils.drawRotatedImage(
                ctx,
                this.sprite,
                renderX,
                renderY,
                this.angle,
                this.spriteScale
            );
        } else {
            // Fallback: renderizar rectángulo
            this.renderFallback(ctx, renderX, renderY);
        }

        // Debug: mostrar hitbox
        if (window.game && window.game.gameState === 'debug') {
            this.renderDebug(ctx);
        }
    }

    /**
 * Renderizado de fallback (rectángulo)
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {number} x - Posición X de renderizado
 * @param {number} y - Posición Y de renderizado
 */
    renderFallback(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.angle);

        // Cuerpo del coche
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Detalles
        ctx.fillStyle = '#000';
        ctx.fillRect(-this.width / 2 + 5, -this.height / 2 + 5, this.width - 10, this.height - 10);

        // Dirección
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.width / 2 - 5, -2, 5, 4);

        ctx.restore();
    }

    /**
 * Renderizado de debug
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 */
    renderDebug(ctx) {
        // Hitbox
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );

        // Información de física
        ctx.fillStyle = '#00ff00';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        let yOffset = -20;

        ctx.fillText(`Vel: ${Math.round(this.velocity)}`, this.x + 25, this.y + yOffset);
        yOffset += 15;
        ctx.fillText(`Ang: ${Math.round(window.GameUtils.MathUtils.toDegrees(this.angle))}°`, this.x + 25, this.y + yOffset);
        yOffset += 15;
        ctx.fillText(`Gear: ${this.getGear()}`, this.x + 25, this.y + yOffset);
        yOffset += 15;
        ctx.fillText(`Eff: ${Math.round(this.getGearEfficiency() * 100)}%`, this.x + 25, this.y + yOffset);
        yOffset += 15;

        if (this.collisionShake > 0) {
            ctx.fillStyle = '#ff0000';
            ctx.fillText(`Shake: ${Math.round(this.collisionShake)}`, this.x + 25, this.y + yOffset);
        }
    }

    /**
     * Deshabilita la aceleración
     */
    disableAcceleration() {
        this.accelerationEnabled = false;
        this.acceleration = 0;
    }

    /**
     * Habilita la aceleración
     */
    enableAcceleration() {
        this.accelerationEnabled = true;
    }

    /**
     * Resetea el coche a su estado inicial
     */
    reset() {
        this.x = 6371;
        this.y = 1478;
        this.velocity = 0;
        this.angle = 1.554255;
        this.acceleration = 0;
        this.accelerationEnabled = true;
        this.isMoving = false;
        this.animationFrame = 0;
        this.animationTimer = 0;
    }

    /**
     * Obtiene la velocidad en km/h
     * @returns {number} Velocidad en km/h (escalada linealmente a 0-350 km/h)
     */
    getSpeedKmh() {
        const rawSpeedKmh = Math.abs(this.velocity) * 3.6; // Convertir m/s a km/h
        // Escalar linealmente la velocidad al rango 0-350 km/h para mayor realismo
        // La velocidad máxima real (600 m/s * 3.6 = 2160 km/h) se mapea a 350 km/h
        const maxRealSpeedKmh = this.maxSpeed * 3.6; // 2160 km/h
        const scaledSpeedKmh = (rawSpeedKmh / maxRealSpeedKmh) * 350;
        return Math.min(scaledSpeedKmh, 350);
    }

    /**
     * Obtiene la velocidad como porcentaje del máximo
     * @returns {number} Porcentaje de velocidad (0-1)
     */
    getSpeedPercentage() {
        return Math.abs(this.velocity) / this.maxSpeed;
    }

    /**
     * Obtiene la marcha actual
     * @returns {number} Marcha (1-5)
     */
    getGear() {
        if (!window.getGear) return 1;

        const speed = Math.abs(this.velocity);
        const maxSpeed = this.maxSpeed;
        const speedPercentage = speed / maxSpeed;

        // Sistema de marchas ajustado para mayor velocidad
        if (speedPercentage < 0.12) return 1;
        if (speedPercentage < 0.25) return 2;
        if (speedPercentage < 0.45) return 3;
        if (speedPercentage < 0.70) return 4;
        return 5;
    }

    /**
     * Obtiene la eficiencia de la marcha actual
     * @returns {number} Eficiencia (0-1)
     */
    getGearEfficiency() {
        const speed = Math.abs(this.velocity);
        const maxSpeed = this.maxSpeed;
        const speedPercentage = speed / maxSpeed;
        const gear = this.getGear();

        // Calcular eficiencia basada en la marcha y velocidad
        const gearRanges = [
            { min: 0, max: 0.12, optimal: 0.06 },
            { min: 0.12, max: 0.25, optimal: 0.185 },
            { min: 0.25, max: 0.45, optimal: 0.35 },
            { min: 0.45, max: 0.70, optimal: 0.575 },
            { min: 0.70, max: 1.0, optimal: 0.85 }
        ];

        const currentRange = gearRanges[gear - 1];
        const distanceFromOptimal = Math.abs(speedPercentage - currentRange.optimal);
        const efficiency = 1 - (distanceFromOptimal / (currentRange.max - currentRange.min));

        return window.GameUtils.MathUtils.clamp(efficiency, 0, 1);
    }

    /**
     * Obtiene información de debug
     * @returns {Object} Información de debug
     */
    getDebugInfo() {
        return {
            position: { x: Math.round(this.x), y: Math.round(this.y) },
            velocity: Math.round(this.velocity),
            angle: Math.round(window.GameUtils.MathUtils.toDegrees(this.angle)),
            speedKmh: Math.round(this.getSpeedKmh()),
            gear: this.getGear(),
            gearEfficiency: Math.round(this.getGearEfficiency() * 100),
            accelerationEnabled: this.accelerationEnabled,
            isMoving: this.isMoving,
            collisionShake: Math.round(this.collisionShake),
            acceleration: Math.round(this.acceleration * 100) / 100
        };
    }

    /**
     * Establece los límites del canvas
     * @param {number} width - Ancho del canvas
     * @param {number} height - Alto del canvas
     */
    setCanvasBounds(width, height) {
        this.canvasBounds.width = width;
        this.canvasBounds.height = height;
    }

    /**
     * Establece los límites del mapa real
     * @param {number} width - Ancho del mapa
     * @param {number} height - Alto del mapa
     */
    setMapBounds(width, height) {
        this.mapBounds = {
            width: width,
            height: height
        };
    }
}

// Exportar clase globalmente
window.Car = Car; 