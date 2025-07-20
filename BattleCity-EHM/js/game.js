class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.running = false;
        this.paused = false;
        this.gameOver = false;
        this.levelComplete = false;
        
        // Configuración del juego
        this.currentLevel = 1;
        this.maxLevel = 35;
        this.score = [0, 0]; // Puntuación para jugador 1 y 2
        this.lives = [GAME_CONFIG.PLAYER_LIVES, GAME_CONFIG.PLAYER_LIVES];
        this.multiplayer = false;
        
        // Objetos del juego
        this.map = new GameMap();
        this.players = [];
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        
        // Control de enemigos
        this.enemiesSpawned = 0;
        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 3000; // 3 segundos
        this.currentSpawnPointIndex = 0; // Índice para spawn secuencial
        
        // Estados especiales
        this.frozenEnemies = false;
        this.freezeTimer = 0;
        this.baseProtected = false;
        this.baseProtectionTimer = 0;
        
        // Estadísticas del nivel
        this.levelStats = {
            tanksDestroyed: {
                basic: 0,
                fast: 0,
                power: 0,
                armor: 0,
                bonus: 0
            },
            powerUpsCollected: 0,
            timeSpent: 0,
            levelStartTime: 0
        };
        
        // Timing
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        
        // Inicializar el gestor de escalado responsivo
        responsiveManager.initialize(this.canvas);
    }

    async setupGame() {
        // Cargar texturas primero
        console.log('Loading textures...');
        await textureManager.loadAllTextures();
        console.log('Textures loaded!');
        
        // Cargar niveles
        await this.loadLevels();
        
        // Crear mapa
        this.map.loadLevel(this.getCurrentLevelData());
        
        // Verificar integridad de la base
        this.verifyBaseIntegrity();
        
        // Crear jugadores
        this.createPlayers();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Hacer la instancia global accesible
        window.game = this;
    }

    async loadLevels() {
        try {
            const response = await fetch('levels/levels.json');
            this.levelData = await response.json();
        } catch (error) {
            console.warn('No se pudieron cargar los niveles, usando niveles por defecto');
            this.levelData = null;
        }
    }

    getCurrentLevelData() {
        if (!this.levelData) return null;
        
        const levelKey = `level${this.currentLevel}`;
        return this.levelData[levelKey] || null;
    }

    createPlayers() {
        this.players = [];
        const spawnPoints = this.map.getPlayerSpawnPoints();
        
        // Jugador 1
        const player1Pos = Utils.gridToPixel(spawnPoints[0].x, spawnPoints[0].y);
        const player1 = new Tank(player1Pos.x, player1Pos.y, true, 1);
        this.players.push(player1);
        
        // Jugador 2 (si está habilitado el multijugador)
        if (this.multiplayer) {
            const player2Pos = Utils.gridToPixel(spawnPoints[1].x, spawnPoints[1].y);
            const player2 = new Tank(player2Pos.x, player2Pos.y, true, 2);
            this.players.push(player2);
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Eventos de teclado para pausa
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === KEYS.P) {
                console.log('P key pressed - toggle pause');
                this.togglePause();
            } else if (e.keyCode === KEYS.ESC) {
                console.log('ESC key pressed - pause game');
                this.pauseGame();
            }
        });

        // Eventos de botones
        const startButton = document.getElementById('startButton');
        const pauseButton = document.getElementById('pauseButton');
        const restartButton = document.getElementById('restartButton');
        const backToMenuButton = document.getElementById('backToMenuButton');
        
        console.log('Found buttons:', {
            startButton: !!startButton,
            pauseButton: !!pauseButton,
            restartButton: !!restartButton,
            backToMenuButton: !!backToMenuButton
        });
        
        startButton.addEventListener('click', () => {
            console.log('Start button clicked');
            this.start();
        });
        
        pauseButton.addEventListener('click', () => {
            console.log('Pause button clicked');
            this.togglePause();
        });
        
        restartButton.addEventListener('click', () => {
            console.log('Restart button clicked');
            this.restart();
        });
        
        backToMenuButton.addEventListener('click', () => {
            console.log('Back to menu button clicked');
            this.backToMenu();
        });
        
        console.log('Event listeners set up successfully');
        
        // Evento de pérdida de foco
        window.addEventListener('blur', () => {
            if (this.running) {
                console.log('Window lost focus - pausing game');
                this.pauseGame();
            }
        });
    }

    start() {
        if (this.running) return;
        
        this.running = true;
        this.paused = false;
        this.gameOver = false;
        this.levelComplete = false;
        
        // Inicializar estadísticas del nivel
        this.levelStats.levelStartTime = performance.now();
        this.resetLevelStats();
        
        // Actualizar UI
        document.getElementById('startButton').disabled = true;
        document.getElementById('pauseButton').disabled = false;
        
        // Iniciar el loop del juego
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    pause() {
        console.log('Pausing game - setting paused to true');
        this.paused = true;
        const pauseButton = document.getElementById('pauseButton');
        pauseButton.textContent = 'REANUDAR';
        console.log('Pause button text changed to:', pauseButton.textContent);
    }

    resume() {
        console.log('Resuming game - setting paused to false');
        this.paused = false;
        const pauseButton = document.getElementById('pauseButton');
        pauseButton.textContent = 'PAUSA';
        console.log('Pause button text changed to:', pauseButton.textContent);
        this.lastFrameTime = performance.now();
    }

    togglePause() {
        console.log('Toggle pause called - running:', this.running, 'gameOver:', this.gameOver, 'paused:', this.paused);
        
        if (!this.running || this.gameOver) {
            console.log('Cannot toggle pause - game not running or game over');
            return;
        }
        
        if (this.paused) {
            console.log('Resuming game');
            this.resume();
        } else {
            console.log('Pausing game');
            this.pause();
        }
    }

    pauseGame() {
        if (this.running && !this.paused) {
            this.pause();
        }
    }

    backToMenu() {
        this.running = false;
        this.paused = false;
        this.gameOver = false;
        this.levelComplete = false;
        
        // Limpiar objetos
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        animationManager.clear();
        
        // Ocultar controles del juego y volver al menú de selección
        document.getElementById('gameInstructions').style.display = 'none';
        document.getElementById('gameButtons').style.display = 'none';
        document.getElementById('playerSelectionMenu').style.display = 'block';
        
        // Resetear botones
        document.getElementById('pauseButton').textContent = 'PAUSA';
        
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    restart() {
        this.running = false;
        this.paused = false;
        this.gameOver = false;
        this.levelComplete = false;
        
        // Resetear valores
        this.currentLevel = 1;
        this.score = [0, 0];
        this.lives = [GAME_CONFIG.PLAYER_LIVES, GAME_CONFIG.PLAYER_LIVES];
        this.enemiesSpawned = 0;
        this.currentSpawnPointIndex = 0;
        this.frozenEnemies = false;
        this.freezeTimer = 0;
        
        // Limpiar objetos
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        animationManager.clear();
        
        // Recrear mapa y jugadores
        this.map.loadLevel(this.getCurrentLevelData());
        this.createPlayers();
        
        // Actualizar UI
        this.updateUI();
        
        // Ocultar controles del juego y volver al menú de selección
        document.getElementById('gameInstructions').style.display = 'none';
        document.getElementById('gameButtons').style.display = 'none';
        document.getElementById('playerSelectionMenu').style.display = 'block';
        
        // Resetear botones
        document.getElementById('startButton').disabled = false;
        document.getElementById('pauseButton').disabled = true;
        document.getElementById('pauseButton').textContent = 'PAUSA';
        
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    gameLoop() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        this.deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        if (!this.paused) {
            this.update(this.deltaTime);
        }
        
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
        if (this.gameOver || this.levelComplete) return;
        
        // Actualizar tiempo del nivel
        this.levelStats.timeSpent = performance.now() - this.levelStats.levelStartTime;
        
        // Actualizar entrada
        inputManager.update();
        
        // Actualizar mapa
        this.map.update(deltaTime);
        
        // Actualizar protección de base
        this.updateBaseProtection(deltaTime);
        
        // Actualizar jugadores
        this.players.forEach(player => {
            if (player.active) {
                player.update(deltaTime, this.map, [...this.players, ...this.enemies]);
            }
        });
        
        // Actualizar enemigos
        this.updateEnemies(deltaTime);
        
        // Actualizar balas
        this.updateBullets(deltaTime);
        
        // Actualizar power-ups
        this.updatePowerUps(deltaTime);
        
        // Actualizar animaciones
        animationManager.update(deltaTime);
        
        // Verificar colisiones
        this.checkCollisions();
        
        // Verificar condiciones de juego
        this.checkGameConditions();
        
        // Actualizar UI
        this.updateUI();
    }

    updateEnemies(deltaTime) {
        // Actualizar congelación
        if (this.frozenEnemies) {
            this.freezeTimer -= deltaTime;
            if (this.freezeTimer <= 0) {
                this.frozenEnemies = false;
            }
        }
        
        // Spawn de enemigos
        if (this.enemiesSpawned < GAME_CONFIG.TOTAL_ENEMIES_PER_LEVEL && 
            this.enemies.length < GAME_CONFIG.MAX_ENEMIES_ON_SCREEN) {
            
            this.enemySpawnTimer -= deltaTime;
            if (this.enemySpawnTimer <= 0) {
                this.spawnEnemy();
                this.enemySpawnTimer = this.enemySpawnInterval;
            }
        }
        
        // Actualizar enemigos existentes
        this.enemies.forEach(enemy => {
            if (enemy.active && !this.frozenEnemies) {
                enemy.update(deltaTime, this.map, this.enemies, this.players);
            }
        });
        
        // Remover enemigos destruidos
        this.enemies = this.enemies.filter(enemy => enemy.active);
    }

    spawnEnemy() {
        if (this.enemiesSpawned >= GAME_CONFIG.TOTAL_ENEMIES_PER_LEVEL) return;
        
        console.log(`Attempting to spawn enemy ${this.enemiesSpawned + 1}/${GAME_CONFIG.TOTAL_ENEMIES_PER_LEVEL}, current enemies: ${this.enemies.length}`);
        
        const spawnPoints = this.map.getSpawnPoints();
        let enemySpawned = false;
        let attempts = 0;
        
        // Intentar spawn secuencial comenzando desde el punto actual
        while (!enemySpawned && attempts < spawnPoints.length) {
            const spawnPoint = spawnPoints[this.currentSpawnPointIndex];
            const pixelPos = Utils.gridToPixel(spawnPoint.x, spawnPoint.y);
            
            // Verificar que el punto de spawn esté libre
            const canSpawn = !this.enemies.some(enemy => 
                enemy.position.distance(new Vector2(pixelPos.x, pixelPos.y)) < 64
            );
            
            if (canSpawn) {
                const enemy = EnemyTank.createRandomTank(pixelPos.x, pixelPos.y, this.currentLevel);
                this.enemies.push(enemy);
                this.enemiesSpawned++;
                enemySpawned = true;
                console.log(`Enemy spawned successfully at spawn point ${this.currentSpawnPointIndex} (${spawnPoint.x}, ${spawnPoint.y})! Total spawned: ${this.enemiesSpawned}`);
                
                // Avanzar al siguiente punto de spawn para la próxima vez
                this.currentSpawnPointIndex = (this.currentSpawnPointIndex + 1) % spawnPoints.length;
            } else {
                console.log(`Spawn point ${this.currentSpawnPointIndex} occupied, trying next point`);
                // Probar el siguiente punto de spawn
                this.currentSpawnPointIndex = (this.currentSpawnPointIndex + 1) % spawnPoints.length;
                attempts++;
            }
        }
        
        if (!enemySpawned) {
            console.log(`Cannot spawn enemy - all spawn points occupied`);
            // Reintentar spawn más rápido si no se puede hacer spawn
            this.enemySpawnTimer = Math.min(this.enemySpawnTimer, 500);
        }
    }

    updateBullets(deltaTime) {
        // Recopilar todas las balas
        this.bullets = [];
        
        // Balas de jugadores
        this.players.forEach(player => {
            this.bullets.push(...player.activeBullets);
        });
        
        // Balas de enemigos
        this.enemies.forEach(enemy => {
            this.bullets.push(...enemy.activeBullets);
        });
        
        // Actualizar balas
        this.bullets.forEach(bullet => {
            bullet.update(deltaTime, this.map);
        });
        
        // Verificar colisiones entre balas
        for (let i = 0; i < this.bullets.length; i++) {
            for (let j = i + 1; j < this.bullets.length; j++) {
                this.bullets[i].checkBulletCollision(this.bullets[j]);
            }
        }
    }

    updatePowerUps(deltaTime) {
        this.powerUps.forEach(powerUp => {
            powerUp.update(deltaTime);
        });
        
        this.powerUps = this.powerUps.filter(powerUp => powerUp.active);
    }

    checkCollisions() {
        // Colisiones bala-tanque
        this.bullets.forEach(bullet => {
            if (!bullet.active) return;
            
            // Colisiones con jugadores
            this.players.forEach(player => {
                if (bullet.checkTankCollision(player)) {
                    if (player.takeDamage()) {
                        this.handlePlayerDestroyed(player);
                    }
                }
            });
            
            // Colisiones con enemigos
            this.enemies.forEach(enemy => {
                if (bullet.checkTankCollision(enemy)) {
                    if (enemy.takeDamage()) {
                        this.handleEnemyDestroyed(enemy, bullet.owner);
                    }
                }
            });
        });
        
        // Colisiones power-up-jugador
        this.powerUps.forEach(powerUp => {
            this.players.forEach(player => {
                if (powerUp.checkCollision(player)) {
                    this.handlePowerUpCollected(powerUp, player);
                }
            });
        });
    }

    handlePlayerDestroyed(player) {
        console.log(`Player ${player.playerId} destroyed! Lives before: ${this.lives[player.playerId - 1]}`);
        console.log('Player position:', player.position.x, player.position.y);
        console.log('Player was active:', player.active);
        
        this.lives[player.playerId - 1]--;
        console.log(`Player ${player.playerId} lives after: ${this.lives[player.playerId - 1]}`);
        
        if (this.lives[player.playerId - 1] > 0) {
            // Respawn del jugador - NO desactivar el jugador aún
            console.log(`Player ${player.playerId} will respawn in 2 seconds`);
            // Mantener al jugador activo durante el respawn
            setTimeout(() => {
                this.respawnPlayer(player);
            }, 2000);
        } else {
            // Jugador eliminado - solo aquí se desactiva
            console.log(`Player ${player.playerId} eliminated! No more lives.`);
            player.active = false;
        }
    }

    handleEnemyDestroyed(enemy, shooter) {
        // Actualizar estadísticas según tipo de enemigo
        const enemyType = enemy.type.toLowerCase();
        if (this.levelStats.tanksDestroyed[enemyType] !== undefined) {
            this.levelStats.tanksDestroyed[enemyType]++;
        }
        
        // Otorgar puntos al jugador que disparó
        if (shooter && shooter.isPlayer) {
            this.score[shooter.playerId - 1] += enemy.getPoints();
        }
        
        // Spawn de power-up si es tanque bonus
        if (enemy.type === 'BONUS' || enemy.isBonusTankType()) {
            this.spawnPowerUp(enemy.position.x, enemy.position.y);
        }
        
        console.log(`Enemy destroyed. Spawned: ${this.enemiesSpawned}, Active: ${this.enemies.length - 1}`);
    }

    handlePowerUpCollected(powerUp, player) {
        // Actualizar estadísticas
        this.levelStats.powerUpsCollected++;
        
        // Aplicar efecto del power-up
        switch (powerUp.type) {
            case 'BOMB':
                this.destroyAllEnemies();
                break;
            case 'HELMET':
                player.makeInvulnerable(POWERUP_TYPES.HELMET.duration);
                break;
            case 'SHOVEL':
                this.fortifyBase(POWERUP_TYPES.SHOVEL.duration);
                break;
            case 'STAR':
                player.upgradeWeapon();
                break;
            case 'TANK':
                this.addExtraLife(player.playerId);
                break;
            case 'CLOCK':
                this.freezeEnemies(POWERUP_TYPES.CLOCK.duration);
                break;
        }
        
        // Otorgar puntos por recoger power-up
        this.score[player.playerId - 1] += 500;
    }

    spawnPowerUp(x, y) {
        const powerUp = PowerUp.createRandomPowerUp(x, y);
        this.powerUps.push(powerUp);
    }

    respawnPlayer(player) {
        console.log(`Respawning player ${player.playerId}`);
        console.log('Player state before respawn:', {
            active: player.active,
            lives: this.lives[player.playerId - 1],
            health: player.health
        });
        
        const spawnPoints = this.map.getPlayerSpawnPoints();
        const spawnPoint = spawnPoints[player.playerId - 1];
        const pixelPos = Utils.gridToPixel(spawnPoint.x, spawnPoint.y);
        
        console.log(`Player ${player.playerId} respawning at grid (${spawnPoint.x}, ${spawnPoint.y}) -> pixel (${pixelPos.x}, ${pixelPos.y})`);
        
        player.reset(pixelPos.x, pixelPos.y);
        player.makeInvulnerable(3000); // 3 segundos de invulnerabilidad
        
        console.log('Player state after respawn:', {
            active: player.active,
            lives: this.lives[player.playerId - 1],
            health: player.health
        });
        
        // Verificar que el jugador esté realmente activo
        if (!player.active) {
            console.error(`ERROR: Player ${player.playerId} is not active after respawn!`);
            player.active = true; // Forzar activación
        }
        
        console.log(`Player ${player.playerId} respawned successfully`);
    }

    // Método de debug para verificar el estado del juego
    debugGameState() {
        console.log('=== DEBUG GAME STATE ===');
        console.log('Game running:', this.running);
        console.log('Game over:', this.gameOver);
        console.log('Level complete:', this.levelComplete);
        console.log('Base destroyed:', this.map.isBaseDestroyed());
        console.log('Players count:', this.players.length);
        console.log('Lives array:', this.lives);
        
        this.players.forEach((player, index) => {
            console.log(`Player ${index + 1}:`, {
                id: player.playerId,
                active: player.active,
                lives: this.lives[player.playerId - 1],
                position: { x: Math.round(player.position.x), y: Math.round(player.position.y) },
                health: player.health,
                invulnerable: player.invulnerable
            });
        });
        
        const alivePlayers = this.players.filter(player => player.active && this.lives[player.playerId - 1] > 0);
        console.log('Alive players count:', alivePlayers.length);
        console.log('========================');
    }

    checkGameConditions() {
        // Verificar si la base fue destruida
        if (this.map.isBaseDestroyed()) {
            console.log('GAME OVER: Base destroyed!');
            this.debugGameState();
            this.gameOver = true;
            this.endGame(false);
            return;
        }
        
        // Verificar si todos los jugadores fueron eliminados
        const alivePlayers = this.players.filter(player => player.active && this.lives[player.playerId - 1] > 0);
        
        if (alivePlayers.length === 0) {
            console.log('GAME OVER: No players alive!');
            this.debugGameState();
            this.gameOver = true;
            this.endGame(false);
            return;
        }
        
        // Verificar si todos los enemigos fueron destruidos
        if (this.enemiesSpawned >= GAME_CONFIG.TOTAL_ENEMIES_PER_LEVEL && this.enemies.length === 0) {
            console.log('LEVEL COMPLETE: All enemies destroyed!');
            this.levelComplete = true;
            this.endLevel();
            return;
        }
    }

    endLevel() {
        // Bonificación por completar nivel
        this.players.forEach(player => {
            if (player.active) {
                this.score[player.playerId - 1] += 1000;
            }
        });
        
        // Mostrar estadísticas del nivel
        this.showLevelStats();
        
        if (this.currentLevel < this.maxLevel) {
            // Avanzar al siguiente nivel
            setTimeout(() => {
                this.nextLevel();
            }, 5000); // Dar tiempo para ver las estadísticas
        } else {
            // Juego completado
            this.endGame(true);
        }
    }

    nextLevel() {
        this.currentLevel++;
        this.levelComplete = false;
        this.enemiesSpawned = 0;
        this.currentSpawnPointIndex = 0;
        this.frozenEnemies = false;
        this.freezeTimer = 0;
        this.baseProtected = false;
        this.baseProtectionTimer = 0;
        
        // Resetear estadísticas del nivel
        this.resetLevelStats();
        this.levelStats.levelStartTime = performance.now();
        
        // Limpiar objetos
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        animationManager.clear();
        
        // Verificar integridad de la base al inicio
        this.verifyBaseIntegrity();
        
        // Cargar nuevo mapa
        this.map.loadLevel(this.getCurrentLevelData());
        
        // Resetear jugadores
        this.players.forEach(player => {
            if (player.active) {
                const spawnPoints = this.map.getPlayerSpawnPoints();
                const spawnPoint = spawnPoints[player.playerId - 1];
                const pixelPos = Utils.gridToPixel(spawnPoint.x, spawnPoint.y);
                player.reset(pixelPos.x, pixelPos.y);
            }
        });
    }

    endGame(victory) {
        this.running = false;
        this.paused = false;
        
        // Mostrar mensaje de fin de juego
        const message = victory ? 
            `¡Felicitaciones! Has completado todos los niveles.\nPuntuación Final: ${this.score[0]}` :
            `Game Over\nPuntuación Final: ${this.score[0]}`;
        
        setTimeout(() => {
            alert(message);
        }, 1000);
        
        // Actualizar UI
        document.getElementById('startButton').disabled = false;
        document.getElementById('pauseButton').disabled = true;
        document.getElementById('pauseButton').textContent = 'PAUSA';
    }

    updateUI() {
        // Actualizar puntuaciones
        document.getElementById('player1-score').textContent = Utils.formatScore(this.score[0]);
        document.getElementById('player2-score').textContent = Utils.formatScore(this.score[1]);
        
        // Actualizar vidas
        document.getElementById('player1-lives').textContent = this.lives[0];
        document.getElementById('player2-lives').textContent = this.lives[1];
        
        // Actualizar nivel
        document.getElementById('current-level').textContent = this.currentLevel;
        
        // Actualizar enemigos restantes (que quedan por aparecer + que están activos)
        const remainingEnemies = (GAME_CONFIG.TOTAL_ENEMIES_PER_LEVEL - this.enemiesSpawned) + this.enemies.length;
        document.getElementById('enemy-count').textContent = remainingEnemies;
    }

    draw() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar mapa
        this.map.draw(this.ctx);
        
        // Dibujar jugadores
        console.log('Drawing players, count:', this.players.length);
        this.players.forEach((player, index) => {
            console.log(`Drawing player ${index + 1}, active:`, player.active);
            player.draw(this.ctx);
        });
        
        // Dibujar enemigos
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx);
        });
        
        // Dibujar power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.draw(this.ctx);
        });
        
        // Dibujar animaciones
        animationManager.draw(this.ctx);
        
        // Dibujar efectos especiales
        this.drawEffects();
    }

    drawEffects() {
        // Efecto de congelación
        if (this.frozenEnemies) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 150, 255, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
        
        // Efecto de pausa
        if (this.paused) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 48px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSA', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.restore();
        }
    }

    // Métodos para power-ups
    destroyAllEnemies() {
        this.enemies.forEach(enemy => {
            enemy.destroy();
        });
        this.enemies = [];
    }

    addExtraLife(playerId) {
        this.lives[playerId - 1]++;
    }

    freezeEnemies(duration) {
        this.frozenEnemies = true;
        this.freezeTimer = duration;
    }

    fortifyBase(duration) {
        this.baseProtected = true;
        this.baseProtectionTimer = duration;
        this.map.fortifyBase(true);
    }

    updateBaseProtection(deltaTime) {
        if (this.baseProtected) {
            this.baseProtectionTimer -= deltaTime;
            if (this.baseProtectionTimer <= 0) {
                this.baseProtected = false;
                this.map.fortifyBase(false);
            }
        }
    }

    // Sistema de estadísticas
    resetLevelStats() {
        this.levelStats.tanksDestroyed = {
            basic: 0,
            fast: 0,
            power: 0,
            armor: 0,
            bonus: 0
        };
        this.levelStats.powerUpsCollected = 0;
        this.levelStats.timeSpent = 0;
    }

    showLevelStats() {
        const stats = this.levelStats;
        const timeInSeconds = Math.floor(stats.timeSpent / 1000);
        const totalTanks = Object.values(stats.tanksDestroyed).reduce((a, b) => a + b, 0);
        
        // Mostrar pantalla de estadísticas
        const statsScreen = document.getElementById('levelStatsScreen');
        const statsContent = document.getElementById('levelStatsContent');
        
        let content = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <strong>Nivel ${this.currentLevel}</strong>
                <span>Tiempo: ${timeInSeconds}s</span>
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Tanques destruidos: ${totalTanks}</strong>
            </div>
            <div style="margin-left: 20px; margin-bottom: 15px;">
                <div>• Básicos: ${stats.tanksDestroyed.basic}</div>
                <div>• Rápidos: ${stats.tanksDestroyed.fast}</div>
                <div>• Blindados: ${stats.tanksDestroyed.power}</div>
                <div>• Pesados: ${stats.tanksDestroyed.armor}</div>
                <div>• Bonus: ${stats.tanksDestroyed.bonus}</div>
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Power-ups recogidos: ${stats.powerUpsCollected}</strong>
            </div>
            <div style="border-top: 1px solid #555; padding-top: 15px; margin-top: 15px;">
                <strong style="color: #ffff00;">Puntuación: ${this.score[0]}</strong>
            </div>
        `;
        
        statsContent.innerHTML = content;
        statsScreen.style.display = 'block';
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            statsScreen.style.display = 'none';
        }, 5000);
    }

    // Método para habilitar multijugador
    enableMultiplayer() {
        this.multiplayer = true;
        this.createPlayers();
    }

    disableMultiplayer() {
        this.multiplayer = false;
        this.createPlayers();
    }

    // Método para verificar integridad de la base
    verifyBaseIntegrity() {
        const baseX = GAME_CONFIG.BASE_POSITION.x;
        const baseY = GAME_CONFIG.BASE_POSITION.y;
        
        // Verificar que la base esté presente
        if (this.map.getTile(baseX, baseY) !== TILE_TYPES.BASE) {
            console.warn('Base missing! Placing base at correct position.');
            this.map.setTile(baseX, baseY, TILE_TYPES.BASE);
        }
        
        // Verificar protección de ladrillos alrededor de la base
        let protectionCount = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue; // Skip the base itself
                const x = baseX + dx;
                const y = baseY + dy;
                
                if (x >= 0 && x < this.map.width && y >= 0 && y < this.map.height) {
                    const tile = this.map.getTile(x, y);
                    if (tile === TILE_TYPES.BRICK || tile === TILE_TYPES.STEEL) {
                        protectionCount++;
                    }
                }
            }
        }
        
        console.log(`Base protection tiles: ${protectionCount}/8`);
        
        // Si hay muy poca protección, restaurar algunos ladrillos
        if (protectionCount < 4) {
            console.warn('Base protection insufficient! Restoring some protection.');
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const x = baseX + dx;
                    const y = baseY + dy;
                    
                    if (x >= 0 && x < this.map.width && y >= 0 && y < this.map.height) {
                        const tile = this.map.getTile(x, y);
                        if (tile === TILE_TYPES.EMPTY) {
                            this.map.setTile(x, y, TILE_TYPES.BRICK);
                        }
                    }
                }
            }
        }
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();
    window.game = game;
    
    // Esperar a que se configure el juego
    await game.setupGame();
    
    // Mostrar canvas inicial
    game.draw();
});
