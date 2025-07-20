class EnemyTank extends Tank {
    constructor(x, y, type = 'BASIC') {
        super(x, y, false, 0);
        
        this.type = type;
        this.enemyConfig = ENEMY_TYPES[type];
        this.speed = this.enemyConfig.speed;
        this.health = this.enemyConfig.health;
        this.maxHealth = this.enemyConfig.health;
        this.points = this.enemyConfig.points;
        this.color = this.enemyConfig.color;
        
        // Propiedades de IA
        this.aiState = 'MOVING';
        this.aiTimer = 0;
        this.aiChangeInterval = Utils.random(1000, 3000); // Cambiar dirección cada 1-3 segundos
        this.targetDirection = DIRECTIONS.DOWN;
        this.stuckTimer = 0;
        this.maxStuckTime = 500;
        this.lastPosition = this.position.copy();
        
        // Propiedades de disparo
        this.shootTimer = 0;
        this.shootInterval = Utils.random(800, 2000); // Disparar cada 0.8-2 segundos
        this.maxShootCooldown = 500;
        
        // Propiedades especiales
        this.isBonusTank = (type === 'BONUS');
        this.flashTimer = 0;
        this.flashInterval = 200;
        this.isFlashing = false;
        
        // Configurar dirección inicial hacia la base
        this.setInitialDirection();
    }

    update(deltaTime, map, otherTanks = [], playerTanks = []) {
        super.update(deltaTime, map, otherTanks);
        
        // Actualizar timers de IA
        this.aiTimer += deltaTime;
        this.shootTimer += deltaTime;
        this.stuckTimer += deltaTime;
        
        // Efecto de parpadeo para tanques bonus
        if (this.isBonusTank) {
            this.flashTimer += deltaTime;
            if (this.flashTimer >= this.flashInterval) {
                this.isFlashing = !this.isFlashing;
                this.flashTimer = 0;
            }
        }
        
        // Verificar si está atascado
        if (this.position.distance(this.lastPosition) < 1) {
            this.stuckTimer += deltaTime;
            if (this.stuckTimer >= this.maxStuckTime) {
                this.changeDirection();
                this.stuckTimer = 0;
            }
        } else {
            this.stuckTimer = 0;
            this.lastPosition = this.position.copy();
        }
        
        // Lógica de IA
        this.updateAI(deltaTime, map, otherTanks, playerTanks);
    }

    updateAI(deltaTime, map, otherTanks, playerTanks) {
        // Disparar periódicamente
        if (this.shootTimer >= this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
            this.shootInterval = Utils.random(800, 2000);
        }
        
        // Cambiar dirección periódicamente o si está atascado
        if (this.aiTimer >= this.aiChangeInterval) {
            this.aiTimer = 0;
            this.aiChangeInterval = Utils.random(1000, 3000);
            
            // Decisión de IA: ir hacia la base, perseguir jugador o movimiento aleatorio
            const decision = Math.random();
            if (decision < 0.4) {
                this.moveTowardBase();
            } else if (decision < 0.6 && playerTanks.length > 0) {
                this.moveTowardPlayer(playerTanks);
            } else {
                this.changeDirection();
            }
        }
        
        // Intentar moverse en la dirección actual
        if (!this.move(this.direction, map, otherTanks)) {
            // Si no puede moverse, cambiar dirección
            this.changeDirection();
        }
    }

    moveTowardBase() {
        const basePosition = Utils.gridToPixel(GAME_CONFIG.BASE_POSITION.x, GAME_CONFIG.BASE_POSITION.y);
        const direction = new Vector2(basePosition.x - this.position.x, basePosition.y - this.position.y);
        
        // Elegir la dirección más apropiada
        if (Math.abs(direction.x) > Math.abs(direction.y)) {
            this.targetDirection = direction.x > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
        } else {
            this.targetDirection = direction.y > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
        }
        
        this.direction = this.targetDirection;
    }

    moveTowardPlayer(playerTanks) {
        if (playerTanks.length === 0) return;
        
        // Encontrar el jugador más cercano
        let closestPlayer = null;
        let minDistance = Infinity;
        
        for (const player of playerTanks) {
            if (!player.active) continue;
            
            const distance = this.position.distance(player.position);
            if (distance < minDistance) {
                minDistance = distance;
                closestPlayer = player;
            }
        }
        
        if (closestPlayer) {
            const direction = closestPlayer.position.subtract(this.position);
            
            // Elegir la dirección más apropiada
            if (Math.abs(direction.x) > Math.abs(direction.y)) {
                this.targetDirection = direction.x > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
            } else {
                this.targetDirection = direction.y > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
            }
            
            this.direction = this.targetDirection;
        }
    }

    changeDirection() {
        // Cambiar a una dirección aleatoria
        const directions = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];
        // Evitar ir en la dirección opuesta inmediatamente
        const oppositeDirection = Utils.getOppositeDirection(this.direction);
        const availableDirections = directions.filter(dir => dir !== oppositeDirection);
        
        this.direction = Utils.randomChoice(availableDirections);
        this.targetDirection = this.direction;
    }

    setInitialDirection() {
        // Inicialmente, todos los enemigos se mueven hacia abajo
        this.direction = DIRECTIONS.DOWN;
        this.targetDirection = DIRECTIONS.DOWN;
    }

    // Sobrescribir el método de disparo para IA
    shoot() {
        if (!this.canShoot || this.activeBullets.length >= this.maxBullets) return null;

        // Los enemigos pueden disparar con menos restricciones
        const bullet = super.shoot();
        
        if (bullet) {
            soundManager.playSound('enemyShoot');
        }
        
        return bullet;
    }

    // Sobrescribir el método de daño para tanques blindados
    takeDamage(amount = 1) {
        if (this.invulnerable) return false;

        this.health -= amount;
        
        // Cambiar color según el daño para tanques blindados
        if (this.type === 'POWER' || this.type === 'ARMOR') {
            const healthRatio = this.health / this.maxHealth;
            if (healthRatio > 0.75) {
                this.color = this.enemyConfig.color;
            } else if (healthRatio > 0.5) {
                this.color = '#ffaa00';
            } else if (healthRatio > 0.25) {
                this.color = '#ff6600';
            } else {
                this.color = '#ff0000';
            }
        }
        
        if (this.health <= 0) {
            this.destroy();
            return true;
        }

        return false;
    }

    destroy() {
        this.active = false;
        
        // Crear animación de explosión
        animationManager.addAnimation(new Animation(
            this.position.x,
            this.position.y,
            500,
            'explosion'
        ));

        soundManager.playSound('enemyDestroy');
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();

        // Efecto de parpadeo para tanques bonus
        if (this.isBonusTank && this.isFlashing) {
            ctx.globalAlpha = 0.7;
        }

        // Mover al centro del tanque para rotación
        ctx.translate(this.position.x, this.position.y);
        
        // Rotar según la dirección
        const rotation = this.direction * 90;
        ctx.rotate(Utils.degreesToRadians(rotation));

        // Dibujar cuerpo del tanque
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);

        // Dibujar detalles del tanque
        ctx.fillStyle = '#000000';
        ctx.fillRect(-this.size/2 + 4, -this.size/2 + 4, this.size - 8, this.size - 8);

        // Dibujar orugas (animación simple)
        ctx.fillStyle = this.color;
        const trackOffset = this.animationFrame * 2;
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(-this.size/2 + 2, -this.size/2 + 6 + i * 6 + trackOffset, 4, 3);
            ctx.fillRect(this.size/2 - 6, -this.size/2 + 6 + i * 6 + trackOffset, 4, 3);
        }

        // Dibujar cañón
        ctx.fillStyle = '#444444';
        ctx.fillRect(-2, -this.size/2 - 8, 4, 16);

        // Indicador de tanque bonus
        if (this.isBonusTank) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-this.size/2, this.size/2 - 8, this.size, 4);
        }

        // Indicador de salud para tanques blindados
        if ((this.type === 'POWER' || this.type === 'ARMOR') && this.health > 1) {
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < this.health; i++) {
                ctx.fillRect(-this.size/2 + i * 3, -this.size/2 - 2, 2, 2);
            }
        }

        ctx.restore();

        // Dibujar balas
        this.activeBullets.forEach(bullet => bullet.draw(ctx));
    }

    // Métodos específicos de enemigo
    getType() {
        return this.type;
    }

    getPoints() {
        return this.points;
    }

    isBonusTankType() {
        return this.isBonusTank;
    }

    // Crear diferentes tipos de enemigos
    static createBasicTank(x, y) {
        return new EnemyTank(x, y, 'BASIC');
    }

    static createFastTank(x, y) {
        return new EnemyTank(x, y, 'FAST');
    }

    static createPowerTank(x, y) {
        return new EnemyTank(x, y, 'POWER');
    }

    static createArmorTank(x, y) {
        return new EnemyTank(x, y, 'ARMOR');
    }

    static createRandomTank(x, y, level = 1) {
        const types = ['BASIC', 'FAST', 'POWER', 'ARMOR', 'BONUS'];
        let availableTypes = ['BASIC'];
        
        // Agregar tipos según el nivel
        if (level >= 3) availableTypes.push('FAST');
        if (level >= 5) availableTypes.push('POWER');
        if (level >= 8) availableTypes.push('ARMOR');
        
        // Tanque bonus con probabilidad especial
        if (Math.random() < 0.15) { // 15% de probabilidad para tanque bonus
            return new EnemyTank(x, y, 'BONUS');
        }
        
        const selectedType = Utils.randomChoice(availableTypes);
        return new EnemyTank(x, y, selectedType);
    }
}
