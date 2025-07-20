class PowerUp {
    constructor(x, y, type) {
        this.position = new Vector2(x, y);
        this.type = type;
        this.config = POWERUP_TYPES[type];
        this.size = 24;
        this.active = true;
        this.collected = false;
        
        // Propiedades visuales
        this.animationTime = 0;
        this.animationFrame = 0;
        this.flashTimer = 0;
        this.flashInterval = 300;
        this.isVisible = true;
        
        // Duración del power-up en pantalla
        this.lifeTime = 10000; // 10 segundos
        this.elapsed = 0;
        
        // Propiedades de animación
        this.scale = 1;
        this.scaleDirection = 1;
        this.rotation = 0;
    }

    update(deltaTime) {
        if (!this.active) return;

        this.elapsed += deltaTime;
        this.animationTime += deltaTime;
        this.flashTimer += deltaTime;
        
        // Desaparecer después del tiempo de vida
        if (this.elapsed >= this.lifeTime) {
            this.active = false;
            return;
        }

        // Efecto de parpadeo en los últimos 3 segundos
        if (this.lifeTime - this.elapsed < 3000) {
            if (this.flashTimer >= this.flashInterval) {
                this.isVisible = !this.isVisible;
                this.flashTimer = 0;
                this.flashInterval = Math.max(50, this.flashInterval - 10); // Parpadeo más rápido
            }
        }

        // Animación de escala
        this.scale += this.scaleDirection * deltaTime * 0.001;
        if (this.scale >= 1.2) {
            this.scale = 1.2;
            this.scaleDirection = -1;
        } else if (this.scale <= 0.8) {
            this.scale = 0.8;
            this.scaleDirection = 1;
        }

        // Rotación suave
        this.rotation += deltaTime * 0.002;
        if (this.rotation >= Math.PI * 2) {
            this.rotation = 0;
        }
    }

    checkCollision(tank) {
        if (!this.active || this.collected || !tank.active) return false;

        const distance = this.position.distance(tank.position);
        if (distance < (this.size + tank.size) / 2) {
            this.collect(tank);
            return true;
        }

        return false;
    }

    collect(tank) {
        this.collected = true;
        this.active = false;
        
        // Aplicar efecto del power-up
        this.applyEffect(tank);
        
        // Crear animación de recolección
        animationManager.addAnimation(new Animation(
            this.position.x,
            this.position.y,
            300,
            'powerup'
        ));

        soundManager.playSound('powerUpCollect');
    }

    applyEffect(tank) {
        switch (this.type) {
            case 'BOMB':
                this.applyBombEffect();
                break;
            case 'HELMET':
                tank.makeInvulnerable(this.config.duration);
                break;
            case 'SHOVEL':
                this.applyShovelEffect();
                break;
            case 'STAR':
                tank.upgrade();
                break;
            case 'TANK':
                this.applyTankEffect(tank);
                break;
            case 'CLOCK':
                this.applyClockEffect();
                break;
        }
    }

    applyBombEffect() {
        // Destruir todos los enemigos en pantalla
        if (window.game) {
            window.game.destroyAllEnemies();
        }
    }

    applyShovelEffect() {
        // Fortificar la base con acero
        if (window.game && window.game.map) {
            window.game.map.fortifyBase(this.config.duration);
        }
    }

    applyTankEffect(tank) {
        // Vida extra - se maneja en el juego principal
        if (window.game) {
            window.game.addExtraLife(tank.playerId);
        }
    }

    applyClockEffect() {
        // Congelar todos los enemigos
        if (window.game) {
            window.game.freezeEnemies(this.config.duration);
        }
    }

    draw(ctx) {
        if (!this.active || !this.isVisible) return;

        ctx.save();
        
        // Mover al centro del power-up
        ctx.translate(this.position.x, this.position.y);
        
        // Aplicar escala y rotación
        ctx.scale(this.scale, this.scale);
        ctx.rotate(this.rotation);

        // Dibujar fondo del power-up
        ctx.fillStyle = '#000000';
        ctx.fillRect(-this.size/2 - 2, -this.size/2 - 2, this.size + 4, this.size + 4);

        // Dibujar el power-up según su tipo
        ctx.fillStyle = this.config.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);

        // Dibujar símbolo específico del power-up
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const symbol = this.getPowerUpSymbol();
        ctx.fillText(symbol, 0, 0);

        // Brillo exterior
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);

        ctx.restore();
    }

    getPowerUpSymbol() {
        switch (this.type) {
            case 'BOMB': return '💣';
            case 'HELMET': return '🛡️';
            case 'SHOVEL': return '🛠️';
            case 'STAR': return '⭐';
            case 'TANK': return '🎯';
            case 'CLOCK': return '⏰';
            default: return '?';
        }
    }

    // Métodos de utilidad
    isActive() {
        return this.active;
    }

    getType() {
        return this.type;
    }

    getBounds() {
        return {
            x: this.position.x - this.size / 2,
            y: this.position.y - this.size / 2,
            width: this.size,
            height: this.size
        };
    }

    getRemainingTime() {
        return Math.max(0, this.lifeTime - this.elapsed);
    }

    // Métodos estáticos para crear power-ups específicos
    static createBomb(x, y) {
        return new PowerUp(x, y, 'BOMB');
    }

    static createHelmet(x, y) {
        return new PowerUp(x, y, 'HELMET');
    }

    static createShovel(x, y) {
        return new PowerUp(x, y, 'SHOVEL');
    }

    static createStar(x, y) {
        return new PowerUp(x, y, 'STAR');
    }

    static createTank(x, y) {
        return new PowerUp(x, y, 'TANK');
    }

    static createClock(x, y) {
        return new PowerUp(x, y, 'CLOCK');
    }

    static createRandomPowerUp(x, y) {
        const types = Object.keys(POWERUP_TYPES);
        const randomType = Utils.randomChoice(types);
        return new PowerUp(x, y, randomType);
    }
}

// Animación personalizada para power-ups
class PowerUpAnimation extends Animation {
    constructor(x, y) {
        super(x, y, 500, 'powerup');
        this.particles = [];
        
        // Crear partículas
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1,
                decay: 0.02
            });
        }
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Actualizar partículas
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
        });
        
        this.particles = this.particles.filter(particle => particle.life > 0);
    }

    draw(ctx) {
        ctx.save();
        
        // Dibujar partículas
        this.particles.forEach(particle => {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        });
        
        ctx.restore();
    }
}
