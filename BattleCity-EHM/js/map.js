class GameMap {
    constructor() {
        this.grid = [];
        this.width = GAME_CONFIG.GRID_WIDTH;
        this.height = GAME_CONFIG.GRID_HEIGHT;
        this.tileSize = GAME_CONFIG.TILE_SIZE;
        this.baseDestroyed = false;
        this.baseProtected = false;
        this.baseProtectionTime = 0;
        this.originalBaseProtection = []; // Para almacenar el estado original de la protección
        
        this.initializeGrid();
    }

    initializeGrid() {
        // Inicializar grid vacío
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = TILE_TYPES.EMPTY;
            }
        }
    }

    loadLevel(levelData) {
        this.initializeGrid();
        this.baseDestroyed = false;
        this.baseProtected = false;
        this.baseProtectionTime = 0;
        
        console.log('Loading level, baseDestroyed reset to false');
        
        if (levelData && levelData.tiles) {
            // Cargar desde datos del nivel
            for (let y = 0; y < this.height && y < levelData.tiles.length; y++) {
                for (let x = 0; x < this.width && x < levelData.tiles[y].length; x++) {
                    this.grid[y][x] = levelData.tiles[y][x];
                }
            }
        } else {
            // Generar nivel por defecto
            this.generateDefaultLevel();
        }
        
        // Asegurar que la base esté en su posición
        this.placeBase();
        
        console.log('Level loaded, base status:', this.baseDestroyed);
    }

    generateDefaultLevel() {
        // Generar un nivel básico para pruebas
        // Los bordes permanecen vacíos (sin ladrillos) según el diseño original
        
        // Algunos obstáculos aleatorios en el área central
        for (let i = 0; i < 25; i++) {
            const x = Utils.random(3, this.width - 4);
            const y = Utils.random(3, this.height - 8);
            
            // Evitar colocar obstáculos cerca de las posiciones de spawn de jugadores
            const baseX = GAME_CONFIG.BASE_POSITION.x;
            const baseY = GAME_CONFIG.BASE_POSITION.y;
            
            // No colocar cerca de la base o posiciones de spawn de jugadores
            if ((Math.abs(x - (baseX - 4)) < 3 && Math.abs(y - (baseY + 2)) < 3) ||
                (Math.abs(x - (baseX + 4)) < 3 && Math.abs(y - (baseY + 2)) < 3)) {
                continue;
            }
            
            if (Math.random() < 0.7) {
                this.grid[y][x] = TILE_TYPES.BRICK;
            } else {
                this.grid[y][x] = TILE_TYPES.STEEL;
            }
        }

        // Algunas áreas de agua
        for (let i = 0; i < 4; i++) {
            const x = Utils.random(4, this.width - 7);
            const y = Utils.random(4, this.height - 10);
            
            // Evitar área de spawn de jugadores
            const baseX = GAME_CONFIG.BASE_POSITION.x;
            const baseY = GAME_CONFIG.BASE_POSITION.y;
            
            if (Math.abs(x - baseX) < 6 && Math.abs(y - baseY) < 4) {
                continue;
            }
            
            // Crear pequeñas áreas de agua
            for (let dy = 0; dy < 2; dy++) {
                for (let dx = 0; dx < 3; dx++) {
                    if (x + dx < this.width && y + dy < this.height) {
                        this.grid[y + dy][x + dx] = TILE_TYPES.WATER;
                    }
                }
            }
        }

        // Algunos árboles
        for (let i = 0; i < 12; i++) {
            const x = Utils.random(2, this.width - 3);
            const y = Utils.random(2, this.height - 8);
            
            // Evitar área de spawn de jugadores
            const baseX = GAME_CONFIG.BASE_POSITION.x;
            const baseY = GAME_CONFIG.BASE_POSITION.y;
            
            if (Math.abs(x - baseX) < 5 && Math.abs(y - baseY) < 3) {
                continue;
            }
            
            this.grid[y][x] = TILE_TYPES.TREES;
        }
    }

    placeBase() {
        const baseX = GAME_CONFIG.BASE_POSITION.x;
        const baseY = GAME_CONFIG.BASE_POSITION.y;
        
        // Colocar la base
        this.grid[baseY][baseX] = TILE_TYPES.BASE;
        
        // Crear protección inicial de ladrillos alrededor de la base
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const x = baseX + dx;
                const y = baseY + dy;
                
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    if (dx === 0 && dy === 0) continue; // No sobrescribir la base
                    this.grid[y][x] = TILE_TYPES.BRICK;
                }
            }
        }
        
        // Asegurar que las posiciones de spawn de jugadores estén libres
        const playerSpawns = this.getPlayerSpawnPoints();
        playerSpawns.forEach(spawn => {
            // Limpiar un área 2x2 alrededor de cada punto de spawn (reducido para no afectar la base)
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const x = spawn.x + dx;
                    const y = spawn.y + dy;
                    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                        // No limpiar si está muy cerca de la base
                        if (Math.abs(x - baseX) <= 2 && Math.abs(y - baseY) <= 2) {
                            continue;
                        }
                        this.grid[y][x] = TILE_TYPES.EMPTY;
                    }
                }
            }
        });
        
        // Asegurar que las posiciones de spawn de enemigos estén libres
        const enemySpawns = this.getSpawnPoints();
        enemySpawns.forEach(spawn => {
            // Limpiar un área 3x3 alrededor de cada punto de spawn
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const x = spawn.x + dx;
                    const y = spawn.y + dy;
                    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                        this.grid[y][x] = TILE_TYPES.EMPTY;
                    }
                }
            }
        });
    }

    update(deltaTime) {
        // Actualizar protección de la base
        if (this.baseProtected) {
            this.baseProtectionTime -= deltaTime;
            if (this.baseProtectionTime <= 0) {
                this.baseProtected = false;
                this.removeBaseProtection();
            }
        }
    }

    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return TILE_TYPES.STEEL; // Bordes tratados como acero
        }
        return this.grid[y][x];
    }

    setTile(x, y, tileType) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[y][x] = tileType;
        }
    }

    destroyTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            const tile = this.grid[y][x];
            
            if (tile === TILE_TYPES.BRICK || tile === TILE_TYPES.STEEL) {
                this.grid[y][x] = TILE_TYPES.EMPTY;
                
                // Crear animación de destrucción
                const pixelPos = Utils.gridToPixel(x, y);
                animationManager.addAnimation(new Animation(
                    pixelPos.x + this.tileSize / 2,
                    pixelPos.y + this.tileSize / 2,
                    200,
                    'destruction'
                ));
                
                return true;
            }
        }
        return false;
    }

    destroyBase() {
        const baseX = GAME_CONFIG.BASE_POSITION.x;
        const baseY = GAME_CONFIG.BASE_POSITION.y;
        
        console.log('BASE BEING DESTROYED AT:', baseX, baseY);
        console.log('Current tile at base position:', this.grid[baseY][baseX]);
        
        this.baseDestroyed = true;
        this.grid[baseY][baseX] = TILE_TYPES.EMPTY;
        
        // Crear animación de destrucción de la base
        const pixelPos = Utils.gridToPixel(baseX, baseY);
        animationManager.addAnimation(new Animation(
            pixelPos.x + this.tileSize / 2,
            pixelPos.y + this.tileSize / 2,
            1000,
            'baseDestruction'
        ));
    }

    // Sistema de fortificación de base
    fortifyBase(enable) {
        const baseX = GAME_CONFIG.BASE_POSITION.x;
        const baseY = GAME_CONFIG.BASE_POSITION.y;
        
        if (enable) {
            // Guardar estado original de la protección
            this.originalBaseProtection = [];
            for (let dy = -1; dy <= 0; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const x = baseX + dx;
                    const y = baseY + dy;
                    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                        this.originalBaseProtection.push({
                            x: x,
                            y: y,
                            type: this.grid[y][x]
                        });
                        // Convertir a acero
                        this.grid[y][x] = TILE_TYPES.STEEL;
                    }
                }
            }
        } else {
            // Restaurar estado original
            if (this.originalBaseProtection) {
                this.originalBaseProtection.forEach(tile => {
                    this.grid[tile.y][tile.x] = tile.type;
                });
                this.originalBaseProtection = [];
            }
        }
    }

    removeBaseProtection() {
        this.fortifyBase(false);
    }

    draw(ctx) {
        ctx.save();
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.grid[y][x];
                if (tile === TILE_TYPES.EMPTY) continue;
                
                const pixelX = x * this.tileSize;
                const pixelY = y * this.tileSize;
                
                this.drawTile(ctx, tile, pixelX, pixelY);
            }
        }
        
        ctx.restore();
    }

    drawTile(ctx, tileType, x, y) {
        switch (tileType) {
            case TILE_TYPES.BRICK:
                this.drawBrick(ctx, x, y);
                break;
            case TILE_TYPES.STEEL:
                this.drawSteel(ctx, x, y);
                break;
            case TILE_TYPES.WATER:
                this.drawWater(ctx, x, y);
                break;
            case TILE_TYPES.TREES:
                this.drawTrees(ctx, x, y);
                break;
            case TILE_TYPES.ICE:
                this.drawIce(ctx, x, y);
                break;
            case TILE_TYPES.BASE:
                this.drawBase(ctx, x, y);
                break;
        }
    }

    drawBrick(ctx, x, y) {
        // Usar textura si está disponible
        if (textureManager && textureManager.getTexture('brick')) {
            textureManager.drawTexturedTile(ctx, 'brick', x, y, this.tileSize);
        } else {
            // Fallback al dibujo original
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x, y, this.tileSize, this.tileSize);
            
            // Dibujar patrón de ladrillos
            ctx.fillStyle = '#654321';
            ctx.fillRect(x + 2, y + 2, this.tileSize - 4, 6);
            ctx.fillRect(x + 2, y + 12, this.tileSize - 4, 6);
            ctx.fillRect(x + 2, y + 22, this.tileSize - 4, 6);
            
            ctx.fillRect(x + 16, y + 8, this.tileSize - 18, 6);
            ctx.fillRect(x + 16, y + 18, this.tileSize - 18, 6);
        }
    }

    drawSteel(ctx, x, y) {
        // Usar textura si está disponible
        if (textureManager && textureManager.getTexture('steel')) {
            textureManager.drawTexturedTile(ctx, 'steel', x, y, this.tileSize);
        } else {
            // Fallback al dibujo original
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(x, y, this.tileSize, this.tileSize);
            
            // Patrón metálico
            ctx.fillStyle = '#808080';
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if ((i + j) % 2 === 0) {
                        ctx.fillRect(x + i * 8, y + j * 8, 8, 8);
                    }
                }
            }
            
            // Brillo metálico
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 2, y + 2, 2, this.tileSize - 4);
            ctx.fillRect(x + 2, y + 2, this.tileSize - 4, 2);
        }
    }

    drawWater(ctx, x, y) {
        // Usar textura si está disponible
        if (textureManager && textureManager.getTexture('water')) {
            textureManager.drawTexturedTile(ctx, 'water', x, y, this.tileSize);
        } else {
            // Fallback al dibujo original con animación
            ctx.fillStyle = '#0066CC';
            ctx.fillRect(x, y, this.tileSize, this.tileSize);
            
            // Ondas de agua (animación simple)
            const time = Date.now() * 0.005;
            ctx.fillStyle = '#0080FF';
            for (let i = 0; i < 3; i++) {
                const waveY = y + 8 + Math.sin(time + i) * 4;
                ctx.fillRect(x, waveY, this.tileSize, 4);
            }
        }
    }

    drawTrees(ctx, x, y) {
        // Usar textura si está disponible
        if (textureManager && textureManager.getTexture('trees')) {
            textureManager.drawTexturedTile(ctx, 'trees', x, y, this.tileSize);
        } else {
            // Fallback al dibujo original
            ctx.fillStyle = '#228B22';
            ctx.fillRect(x, y, this.tileSize, this.tileSize);
            
            // Dibujar árboles
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 12, y + 20, 8, 12);
            
            ctx.fillStyle = '#006400';
            ctx.fillRect(x + 4, y + 4, 24, 20);
            
            // Detalles del follaje
            ctx.fillStyle = '#32CD32';
            for (let i = 0; i < 5; i++) {
                const leafX = x + 6 + (i * 4);
                const leafY = y + 6 + (i % 2) * 4;
                ctx.fillRect(leafX, leafY, 4, 4);
            }
        }
    }

    drawIce(ctx, x, y) {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(x, y, this.tileSize, this.tileSize);
        
        // Efectos de hielo
        ctx.fillStyle = '#B0E0E6';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        ctx.fillRect(x + 16, y + 8, 8, 8);
        ctx.fillRect(x + 8, y + 16, 8, 8);
        
        // Brillo
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 2, y + 2, 2, 2);
        ctx.fillRect(x + 20, y + 6, 2, 2);
        ctx.fillRect(x + 12, y + 20, 2, 2);
    }

    drawBase(ctx, x, y) {
        if (this.baseDestroyed) {
            // Dibujar base destruida
            ctx.fillStyle = '#800000';
            ctx.fillRect(x, y, this.tileSize, this.tileSize);
            
            // Escombros
            ctx.fillStyle = '#400000';
            for (let i = 0; i < 6; i++) {
                const debrisX = x + (i % 3) * 10 + 2;
                const debrisY = y + Math.floor(i / 3) * 15 + 5;
                ctx.fillRect(debrisX, debrisY, 6, 6);
            }
        } else {
            // Usar textura si está disponible
            if (textureManager && textureManager.getTexture('base')) {
                textureManager.drawTexturedTile(ctx, 'base', x, y, this.tileSize);
            } else {
                // Fallback al dibujo original
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(x, y, this.tileSize, this.tileSize);
                
                // Dibujar águila estilizada
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x + 8, y + 8, 16, 16);
                
                ctx.fillStyle = '#000000';
                // Cuerpo del águila
                ctx.fillRect(x + 12, y + 12, 8, 8);
                // Alas
                ctx.fillRect(x + 6, y + 14, 6, 8);
                ctx.fillRect(x + 20, y + 14, 6, 8);
                // Cabeza
                ctx.fillRect(x + 14, y + 8, 4, 6);
            }
        }
        
        // Marco
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, this.tileSize, this.tileSize);
    }

    // Métodos de utilidad
    isBaseDestroyed() {
        return this.baseDestroyed;
    }

    isBaseProtected() {
        return this.baseProtected;
    }

    getBasePosition() {
        return {
            x: GAME_CONFIG.BASE_POSITION.x,
            y: GAME_CONFIG.BASE_POSITION.y
        };
    }

    getSpawnPoints() {
        // Puntos de aparición de enemigos (parte superior del mapa)
        return [
            { x: 1, y: 1 },
            { x: 12, y: 1 },
            { x: 24, y: 1 }
        ];
    }

    getPlayerSpawnPoints() {
        // Puntos de aparición de jugadores (cerca de la base pero seguros)
        const baseX = GAME_CONFIG.BASE_POSITION.x;
        const baseY = GAME_CONFIG.BASE_POSITION.y;
        
        return [
            { x: baseX - 6, y: baseY - 3 }, // Más alejado de la base
            { x: baseX + 6, y: baseY - 3 }  // Más alejado de la base
        ];
    }

    isEmpty(x, y) {
        return this.getTile(x, y) === TILE_TYPES.EMPTY;
    }

    isPassable(x, y) {
        const tile = this.getTile(x, y);
        return tile === TILE_TYPES.EMPTY || tile === TILE_TYPES.TREES || tile === TILE_TYPES.ICE;
    }

    isDestructible(x, y) {
        const tile = this.getTile(x, y);
        return tile === TILE_TYPES.BRICK;
    }

    canShootThrough(x, y) {
        const tile = this.getTile(x, y);
        return tile === TILE_TYPES.EMPTY || tile === TILE_TYPES.TREES || tile === TILE_TYPES.ICE;
    }
}
