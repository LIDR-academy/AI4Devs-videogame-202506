class Bullet {
    constructor(x, y, direction, speed = GAME_CONFIG.BULLET_SPEED, owner = null) {
        this.position = new Vector2(x, y);
        this.direction = direction;
        this.speed = speed;
        this.owner = owner; // Referencia al tanque que disparó
        this.size = GAME_CONFIG.BULLET_SIZE;
        this.active = true;
        this.canDestroySteel = false; // Se activa con power-up estrella
        
        // Vector de dirección para el movimiento
        this.velocity = Utils.getDirectionVector(direction).multiply(speed);
    }

    update(deltaTime, map) {
        if (!this.active) return;

        // Mover la bala
        this.position = this.position.add(this.velocity.multiply(deltaTime / 16.67)); // Normalizar a 60fps

        // Verificar límites del canvas
        if (this.position.x < 0 || this.position.x > GAME_CONFIG.CANVAS_WIDTH ||
            this.position.y < 0 || this.position.y > GAME_CONFIG.CANVAS_HEIGHT) {
            this.active = false;
            return;
        }

        // Verificar colisión con el mapa
        this.checkMapCollision(map);
    }

    checkMapCollision(map) {
        const gridPos = Utils.pixelToGrid(this.position.x, this.position.y);
        
        if (!Utils.isValidGridPosition(gridPos.x, gridPos.y)) {
            this.active = false;
            return;
        }

        const tile = map.getTile(gridPos.x, gridPos.y);
        
        switch (tile) {
            case TILE_TYPES.BRICK:
                map.destroyTile(gridPos.x, gridPos.y);
                this.active = false;
                soundManager.playSound('brickDestroy');
                break;
                
            case TILE_TYPES.STEEL:
                if (this.canDestroySteel) {
                    map.destroyTile(gridPos.x, gridPos.y);
                    soundManager.playSound('steelDestroy');
                }
                this.active = false;
                break;
                
            case TILE_TYPES.WATER:
                // Las balas pasan sobre el agua
                break;
                
            case TILE_TYPES.BASE:
                console.log('BASE HIT! Bullet owner:', this.owner ? (this.owner.isPlayer ? 'Player' : 'Enemy') : 'Unknown');
                console.log('Bullet position:', this.position.x, this.position.y);
                console.log('Grid position:', gridPos.x, gridPos.y);
                console.log('Bullet direction:', this.direction);
                
                // Verificar si es una bala del jugador que está muy cerca del spawn inicial
                if (this.owner && this.owner.isPlayer) {
                    const playerSpawns = [
                        { x: 6, y: 21 },  // Spawn real del jugador 1
                        { x: 18, y: 21 }  // Spawn real del jugador 2
                    ];
                    
                    // Verificar si el jugador está en su spawn inicial y disparó hacia arriba
                    const playerGridPos = Utils.pixelToGrid(this.owner.position.x, this.owner.position.y);
                    const isAtSpawn = playerSpawns.some(spawn => 
                        Math.abs(playerGridPos.x - spawn.x) <= 1 && 
                        Math.abs(playerGridPos.y - spawn.y) <= 1
                    );
                    
                    // Solo prevenir si el jugador está en su spawn y disparó hacia arriba
                    if (isAtSpawn && this.direction === DIRECTIONS.UP) {
                        console.log('Prevented friendly fire on base from spawn area');
                        this.active = false;
                        return;
                    }
                }
                
                // Solo destruir la base si no es fuego amigo del spawn
                console.log('BASE DESTROYED!');
                map.destroyBase();
                this.active = false;
                soundManager.playSound('baseDestroy');
                break;
                
            default:
                // Tile vacío o árboles, la bala continúa
                break;
        }
    }

    checkTankCollision(tank) {
        if (!this.active || !tank.active) return false;
        
        // No colisionar con el tanque que disparó
        if (this.owner === tank) return false;

        const bulletRect = {
            x: this.position.x - this.size / 2,
            y: this.position.y - this.size / 2,
            width: this.size,
            height: this.size
        };

        const tankRect = {
            x: tank.position.x - tank.size / 2,
            y: tank.position.y - tank.size / 2,
            width: tank.size,
            height: tank.size
        };

        if (Utils.rectangleIntersection(bulletRect, tankRect)) {
            this.active = false;
            return true;
        }

        return false;
    }

    checkBulletCollision(otherBullet) {
        if (!this.active || !otherBullet.active || this === otherBullet) return false;

        const distance = this.position.distance(otherBullet.position);
        if (distance < this.size) {
            this.active = false;
            otherBullet.active = false;
            
            // Crear animación de colisión
            animationManager.addAnimation(new Animation(
                (this.position.x + otherBullet.position.x) / 2,
                (this.position.y + otherBullet.position.y) / 2,
                300,
                'explosion'
            ));
            
            soundManager.playSound('bulletCollision');
            return true;
        }

        return false;
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        
        // Color de la bala dependiendo del propietario
        if (this.owner && this.owner.isPlayer) {
            ctx.fillStyle = '#ffff00'; // Amarillo para balas del jugador
        } else {
            ctx.fillStyle = '#ff0000'; // Rojo para balas enemigas
        }

        // Dibujar la bala como un pequeño rectángulo
        ctx.fillRect(
            this.position.x - this.size / 2,
            this.position.y - this.size / 2,
            this.size,
            this.size
        );

        // Agregar un pequeño brillo
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(
            this.position.x - this.size / 4,
            this.position.y - this.size / 4,
            this.size / 2,
            this.size / 2
        );

        ctx.restore();
    }

    // Métodos de utilidad
    isActive() {
        return this.active;
    }

    destroy() {
        this.active = false;
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

    // Método para mejorar la bala (power-up estrella)
    upgrade() {
        this.canDestroySteel = true;
        this.speed *= 1.5; // Aumentar velocidad
        this.velocity = Utils.getDirectionVector(this.direction).multiply(this.speed);
    }
}
