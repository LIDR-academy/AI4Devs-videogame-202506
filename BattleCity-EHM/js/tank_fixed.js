class Tank {
    constructor(x, y, isPlayer = false, playerId = 1) {
        this.position = new Vector2(x, y);
        this.direction = DIRECTIONS.UP;
        this.size = GAME_CONFIG.TANK_SIZE;
        this.speed = 2;
        this.isPlayer = isPlayer;
        this.playerId = playerId;
        this.active = true;
        this.health = 1;
        this.maxHealth = 1;
        
        // Propiedades de disparo
        this.canShoot = true;
        this.shootCooldown = 0;
        this.maxShootCooldown = 300; // ms
        this.bulletSpeed = GAME_CONFIG.BULLET_SPEED;
        this.maxBullets = 1;
        this.activeBullets = [];
        this.lastShootTime = 0;
        
        // Power-ups
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.upgraded = false;
        this.upgradeLevel = 0;
        
        // Animación
        this.animationFrame = 0;
        this.animationTime = 0;
        this.animationSpeed = 200; // ms por frame
        
        // Propiedades de movimiento
        this.lastValidPosition = this.position.copy();
        this.moving = false;
        this.onIce = false;
        this.iceVelocity = new Vector2(0, 0);
        this.iceFriction = 0.92;
        
        // Color del tanque
        this.color = isPlayer ? (playerId === 1 ? '#ffff00' : '#00ff00') : '#808080';
    }

    update(deltaTime, map, otherTanks = []) {
        this.moving = false;
        
        // Actualizar cooldowns
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
            if (this.shootCooldown <= 0) {
                this.canShoot = true;
            }
        }

        // Actualizar invulnerabilidad
        if (this.invulnerable) {
            this.invulnerabilityTime -= deltaTime;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
            }
        }

        // Actualizar animación
        if (this.moving) {
            this.animationTime += deltaTime;
            if (this.animationTime >= this.animationSpeed) {
                this.animationFrame = (this.animationFrame + 1) % 2;
                this.animationTime = 0;
            }
        }

        // Actualizar movimiento en hielo
        this.updateIceMovement(deltaTime, map, otherTanks);

        // Actualizar balas
        this.updateBullets(deltaTime, map);

        // Lógica específica del jugador
        if (this.isPlayer) {
            this.handlePlayerInput(map, otherTanks);
        }
    }

    updateIceMovement(deltaTime, map, otherTanks) {
        if (this.onIce && (this.iceVelocity.x !== 0 || this.iceVelocity.y !== 0)) {
            const slidePosition = new Vector2(
                this.position.x + this.iceVelocity.x,
                this.position.y + this.iceVelocity.y
            );
            
            if (!this.checkMapCollision(slidePosition, map) && 
                !this.checkTankCollisions(slidePosition, otherTanks)) {
                this.position = slidePosition;
            } else {
                this.iceVelocity.x = 0;
                this.iceVelocity.y = 0;
            }
            
            this.iceVelocity.x *= this.iceFriction;
            this.iceVelocity.y *= this.iceFriction;
            
            if (Math.abs(this.iceVelocity.x) < 0.1 && Math.abs(this.iceVelocity.y) < 0.1) {
                this.iceVelocity.x = 0;
                this.iceVelocity.y = 0;
            }
        }
    }

    checkTerrainType(position, map) {
        const centerGridPos = Utils.pixelToGrid(position.x, position.y);
        
        if (Utils.isValidGridPosition(centerGridPos.x, centerGridPos.y)) {
            const tile = map.getTile(centerGridPos.x, centerGridPos.y);
            
            if (tile === TILE_TYPES.ICE) {
                this.onIce = true;
                const direction = this.getDirectionVector();
                this.iceVelocity.x += direction.x * 0.5;
                this.iceVelocity.y += direction.y * 0.5;
            } else {
                this.onIce = false;
            }
        }
    }

    handlePlayerInput(map, otherTanks) {
        const input = inputManager;
        let newDirection = this.direction;
        let shouldMove = false;

        if (this.playerId === 1) {
            if (input.isKeyDown(KEYS.W)) {
                newDirection = DIRECTIONS.UP;
                shouldMove = true;
            } else if (input.isKeyDown(KEYS.S)) {
                newDirection = DIRECTIONS.DOWN;
                shouldMove = true;
            } else if (input.isKeyDown(KEYS.A)) {
                newDirection = DIRECTIONS.LEFT;
                shouldMove = true;
            } else if (input.isKeyDown(KEYS.D)) {
                newDirection = DIRECTIONS.RIGHT;
                shouldMove = true;
            }

            if (input.isKeyDown(KEYS.SPACE)) {
                this.shoot();
            }
        } else if (this.playerId === 2) {
            if (input.isKeyDown(KEYS.UP)) {
                newDirection = DIRECTIONS.UP;
                shouldMove = true;
            } else if (input.isKeyDown(KEYS.DOWN)) {
                newDirection = DIRECTIONS.DOWN;
                shouldMove = true;
            } else if (input.isKeyDown(KEYS.LEFT)) {
                newDirection = DIRECTIONS.LEFT;
                shouldMove = true;
            } else if (input.isKeyDown(KEYS.RIGHT)) {
                newDirection = DIRECTIONS.RIGHT;
                shouldMove = true;
            }

            if (input.isKeyDown(KEYS.ENTER)) {
                this.shoot();
            }
        }

        if (shouldMove) {
            this.direction = newDirection;
            this.move(newDirection, map, otherTanks);
        }
    }

    move(direction, map = null, otherTanks = []) {
        this.direction = direction;
        
        let moveX = 0, moveY = 0;
        switch (direction) {
            case DIRECTIONS.UP:
                moveY = -this.speed;
                break;
            case DIRECTIONS.DOWN:
                moveY = this.speed;
                break;
            case DIRECTIONS.LEFT:
                moveX = -this.speed;
                break;
            case DIRECTIONS.RIGHT:
                moveX = this.speed;
                break;
        }

        const newPosition = new Vector2(
            this.position.x + moveX,
            this.position.y + moveY
        );

        const halfSize = this.size / 2;
        if (newPosition.x - halfSize < 0 || newPosition.x + halfSize > GAME_CONFIG.CANVAS_WIDTH ||
            newPosition.y - halfSize < 0 || newPosition.y + halfSize > GAME_CONFIG.CANVAS_HEIGHT) {
            return false;
        }

        if (map && this.checkMapCollision(newPosition, map)) {
            return false;
        }

        if (this.checkTankCollisions(newPosition, otherTanks)) {
            return false;
        }

        this.checkTerrainType(newPosition, map);

        this.lastValidPosition = this.position.copy();
        this.position = newPosition;
        this.moving = true;
        return true;
    }

    checkMapCollision(newPosition, map) {
        const halfSize = this.size / 2;
        
        const corners = [
            { x: newPosition.x - halfSize + 2, y: newPosition.y - halfSize + 2 },
            { x: newPosition.x + halfSize - 2, y: newPosition.y - halfSize + 2 },
            { x: newPosition.x - halfSize + 2, y: newPosition.y + halfSize - 2 },
            { x: newPosition.x + halfSize - 2, y: newPosition.y + halfSize - 2 }
        ];

        for (const corner of corners) {
            const gridPos = Utils.pixelToGrid(corner.x, corner.y);
            
            if (!Utils.isValidGridPosition(gridPos.x, gridPos.y)) {
                return true;
            }
            
            const tile = map.getTile(gridPos.x, gridPos.y);
            if (tile === TILE_TYPES.BRICK || tile === TILE_TYPES.STEEL || 
                tile === TILE_TYPES.WATER) {
                return true;
            }
        }

        return false;
    }

    checkTankCollisions(newPosition, otherTanks) {
        const halfSize = this.size / 2;
        
        for (const tank of otherTanks) {
            if (tank === this || !tank.active) continue;
            
            const otherHalfSize = tank.size / 2;
            const distance = newPosition.distance(tank.position);
            
            if (distance < (halfSize + otherHalfSize - 4)) {
                return true;
            }
        }
        
        return false;
    }

    shoot() {
        if (!this.canShoot || this.activeBullets.length >= this.maxBullets) {
            return false;
        }

        const currentTime = performance.now();
        if (currentTime - this.lastShootTime < this.maxShootCooldown) {
            return false;
        }

        const bulletStartPos = this.getBulletStartPosition();
        const bullet = new Bullet(
            bulletStartPos.x,
            bulletStartPos.y,
            this.direction,
            this.bulletSpeed,
            this
        );

        this.activeBullets.push(bullet);
        this.canShoot = false;
        this.shootCooldown = this.maxShootCooldown;
        this.lastShootTime = currentTime;

        return true;
    }

    getBulletStartPosition() {
        const halfSize = this.size / 2;
        const bulletOffset = halfSize + 2;
        
        let x = this.position.x;
        let y = this.position.y;
        
        switch (this.direction) {
            case DIRECTIONS.UP:
                y -= bulletOffset;
                break;
            case DIRECTIONS.DOWN:
                y += bulletOffset;
                break;
            case DIRECTIONS.LEFT:
                x -= bulletOffset;
                break;
            case DIRECTIONS.RIGHT:
                x += bulletOffset;
                break;
        }
        
        return new Vector2(x, y);
    }

    updateBullets(deltaTime, map) {
        this.activeBullets = this.activeBullets.filter(bullet => bullet.active);
    }

    takeDamage(amount = 1) {
        if (this.invulnerable) {
            return false;
        }

        this.health -= amount;
        
        if (this.health <= 0) {
            this.destroy();
            return true;
        }
        
        return false;
    }

    destroy() {
        this.active = false;
        this.health = 0;
        
        const explosion = new Animation(
            this.position.x,
            this.position.y,
            'explosion',
            500
        );
        animationManager.addAnimation(explosion);
    }

    makeInvulnerable(duration) {
        this.invulnerable = true;
        this.invulnerabilityTime = duration;
    }

    upgradeWeapon() {
        this.upgradeLevel = Math.min(this.upgradeLevel + 1, 3);
        this.maxBullets = Math.min(this.maxBullets + 1, 2);
        this.bulletSpeed = Math.min(this.bulletSpeed + 1, 12);
    }

    reset(x, y) {
        this.position = new Vector2(x, y);
        this.direction = DIRECTIONS.UP;
        this.active = true;
        this.health = this.maxHealth;
        this.activeBullets = [];
        this.canShoot = true;
        this.shootCooldown = 0;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.onIce = false;
        this.iceVelocity = new Vector2(0, 0);
    }

    getDirectionVector() {
        switch (this.direction) {
            case DIRECTIONS.UP:
                return new Vector2(0, -1);
            case DIRECTIONS.DOWN:
                return new Vector2(0, 1);
            case DIRECTIONS.LEFT:
                return new Vector2(-1, 0);
            case DIRECTIONS.RIGHT:
                return new Vector2(1, 0);
            default:
                return new Vector2(0, 0);
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        
        // Efecto de parpadeo cuando es invulnerable
        if (this.invulnerable) {
            const flashTime = 100;
            const flashPhase = Math.floor(this.invulnerabilityTime / flashTime) % 2;
            if (flashPhase === 0) {
                ctx.globalAlpha = 0.3;
            }
        }

        // Dibujar el tanque
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x - this.size / 2,
            this.position.y - this.size / 2,
            this.size,
            this.size
        );

        // Dibujar la dirección
        ctx.fillStyle = '#000000';
        const directionSize = 8;
        let dirX = this.position.x;
        let dirY = this.position.y;
        
        switch (this.direction) {
            case DIRECTIONS.UP:
                dirY -= this.size / 4;
                break;
            case DIRECTIONS.DOWN:
                dirY += this.size / 4;
                break;
            case DIRECTIONS.LEFT:
                dirX -= this.size / 4;
                break;
            case DIRECTIONS.RIGHT:
                dirX += this.size / 4;
                break;
        }
        
        ctx.fillRect(
            dirX - directionSize / 2,
            dirY - directionSize / 2,
            directionSize,
            directionSize
        );

        // Dibujar balas
        this.activeBullets.forEach(bullet => {
            bullet.draw(ctx);
        });

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.position.x - this.size / 2,
            y: this.position.y - this.size / 2,
            width: this.size,
            height: this.size
        };
    }

    getGridPosition() {
        return Utils.pixelToGrid(this.position.x, this.position.y);
    }

    isAlive() {
        return this.active && this.health > 0;
    }
}
