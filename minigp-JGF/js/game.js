/**
 * Juego principal de carreras - MiniGP
 */

class Game {
    constructor() {
        // Canvas y contexto
        this.canvas = null;
        this.ctx = null;

        // Estado del juego
        this.gameState = 'loading';
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;

        // Componentes del juego
        this.car = null;
        this.hud = null;
        this.assets = null;
        this.input = null;

        // Configuración del juego
        this.config = {
            width: 1200,
            height: 800,
            targetFps: 60,
            frameTime: 1000 / 60
        };

        // Sistema de cámara
        this.camera = {
            x: 0,
            y: 0,
            zoom: 2.0, // Zoom 2x
            targetX: 0,
            targetY: 0,
            smoothness: 0.1, // Suavizado de movimiento de cámara
            bounds: {
                minX: 0,
                minY: 0,
                maxX: 0,
                maxY: 0
            }
        };

        // Línea de meta
        this.finishLine = {
            x: 3691,  // Coordenada X de la línea de meta
            y: 2002,  // Coordenada Y inferior de la línea de meta
            width: 20,  // Ancho de 20px para tolerancia
            height: 123  // Altura desde y=2002 hasta y=2125
        };

        // Cronómetro
        this.lapTimer = {
            startTime: 0,
            lapTime: 0,
            isRunning: false,
            hasStarted: false,
            lastFinishLineCross: 0  // Timestamp de la última vez que cruzó la línea de meta
        };

        // Estados del juego
        this.states = {
            LOADING: 'loading',
            START: 'start',
            RACING: 'racing',
            FINISHED: 'finished'
        };

        this.init();
    }

    /**
 * Inicializa el juego
 */
    async init() {
        try {
            console.log('Inicializando juego...');

            // Iniciar preloader
            if (window.preloader) {
                window.preloader.start();
            }

            // Configurar canvas
            this.setupCanvas();

            // Configurar componentes
            this.setupComponents();

            // Configurar event listeners
            this.setupEventListeners();

            // Cargar assets
            await this.loadAssets();

            // Completar preloader
            if (window.preloader) {
                window.preloader.complete();
            }

            // Cambiar a pantalla de inicio
            this.changeState(this.states.START);

            console.log('Juego inicializado correctamente');

        } catch (error) {
            console.error('Error inicializando el juego:', error);
            if (window.preloader) {
                window.preloader.showError('Error al cargar el juego');
            }
            this.showError('Error al cargar el juego');
        }
    }

    /**
     * Configura el canvas y el contexto
     */
    setupCanvas() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            throw new Error('Canvas no encontrado');
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('Contexto 2D no soportado');
        }

        // Configurar dimensiones
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;

        // Configurar contexto
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        console.log(`Canvas configurado: ${this.config.width}x${this.config.height}`);
    }

    /**
     * Configura los componentes del juego
     */
    setupComponents() {
        // Usar componentes globales
        this.assets = window.assetManager;
        this.input = window.inputManager;

        // Configurar callbacks
        this.assets.onProgress = (progress, text) => {
            if (window.GameUtils && window.GameUtils.ScreenUtils) {
                window.GameUtils.ScreenUtils.updateLoadingProgress(progress, text);
            }
        };

        this.assets.onLoadComplete = () => {
            console.log('Todos los assets cargados');
        };
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Botón de inicio
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', () => {
                this.startRace();
            });
        }

        // Botón de reinicio
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                this.restartRace();
            });
        }

        // Botón de menú
        const menuButton = document.getElementById('menu-button');
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                this.showMenu();
            });
        }

        // Tecla Escape para pausar
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape' && this.gameState === this.states.RACING) {
                this.pauseGame();
            }
        });
    }

    /**
 * Carga todos los assets necesarios
 */
    async loadAssets() {
        console.log('Cargando assets...');

        try {
            // Configurar callbacks de progreso
            this.assets.onProgress = (progress, text) => {
                // Actualizar preloader
                if (window.preloader) {
                    window.preloader.updatePhaseProgress(progress, text);
                }

                // Actualizar UI tradicional
                if (window.GameUtils && window.GameUtils.ScreenUtils) {
                    window.GameUtils.ScreenUtils.updateLoadingProgress(progress, text);
                }
            };

            this.assets.onError = (errors) => {
                console.warn('Algunos assets no se pudieron cargar:', errors);
                if (window.preloader) {
                    window.preloader.showError(`${errors.length} assets no se pudieron cargar`);
                }
            };

            this.assets.onLoadComplete = () => {
                console.log('Todos los assets cargados');
            };

            // Cargar assets por fases con sincronización del preloader
            await this.loadAssetsWithPreloader();
            console.log('Assets cargados correctamente');

        } catch (error) {
            console.error('Error cargando assets:', error);
            throw error;
        }
    }

    /**
     * Carga assets sincronizado con el preloader
     */
    async loadAssetsWithPreloader() {
        // Fase 1: Assets críticos
        if (window.preloader) {
            window.preloader.nextPhase(); // Avanzar a "Cargando circuito..."
        }
        await this.assets.loadCriticalAssets();

        // Fase 2: Assets de interfaz
        if (window.preloader) {
            window.preloader.nextPhase(); // Avanzar a "Cargando interfaz..."
        }
        await this.assets.loadUIAssets();

        // Fase 3: Assets adicionales
        if (window.preloader) {
            window.preloader.nextPhase(); // Avanzar a "Cargando elementos..."
        }
        await this.assets.loadAdditionalAssets();
    }

    /**
     * Cambia el estado del juego
     * @param {string} newState - Nuevo estado
     */
    changeState(newState) {
        console.log(`Cambiando estado: ${this.gameState} -> ${newState}`);

        this.gameState = newState;

        // Actualizar pantalla
        if (window.GameUtils && window.GameUtils.ScreenUtils) {
            switch (newState) {
                case this.states.LOADING:
                    window.GameUtils.ScreenUtils.showScreen('loading-screen');
                    break;
                case this.states.START:
                    window.GameUtils.ScreenUtils.showScreen('start-screen');
                    break;
                case this.states.RACING:
                    window.GameUtils.ScreenUtils.showScreen('game-screen');
                    break;
                case this.states.FINISHED:
                    window.GameUtils.ScreenUtils.showScreen('finish-screen');
                    break;
            }
        }

        // Configurar input según el estado
        this.input.setEnabled(newState === this.states.RACING);
    }

    /**
     * Inicia la carrera
     */
    startRace() {
        console.log('Iniciando carrera...');

        // Crear coche en posición inicial (última curva)
        this.car = new Car(6371, 1478); // Posición exacta en la última curva

        // Inicializar límites del coche con las dimensiones del mapa
        const circuitImage = this.assets.getImage('circuit');
        if (circuitImage) {
            this.car.setMapBounds(circuitImage.width, circuitImage.height);
        }

        // Inicializar cámara en la posición del coche
        this.camera.x = this.car.x;
        this.camera.y = this.car.y;
        this.camera.targetX = this.car.x;
        this.camera.targetY = this.car.y;

        // Crear HUD
        this.hud = new HUD();

        // Cambiar estado
        this.changeState(this.states.RACING);

        // Iniciar game loop
        this.startGameLoop();
    }

    /**
     * Inicia el game loop
     */
    startGameLoop() {
        this.lastTime = performance.now();
        this.gameLoop();
    }

    /**
     * Game loop principal
     */
    gameLoop(currentTime = performance.now()) {
        // Calcular delta time
        this.deltaTime = currentTime - this.lastTime;

        // Limitar FPS
        if (this.deltaTime < this.config.frameTime) {
            requestAnimationFrame((time) => this.gameLoop(time));
            return;
        }

        // Actualizar FPS
        this.updateFps(currentTime);

        // Actualizar y renderizar solo si estamos en estado de carrera
        if (this.gameState === this.states.RACING) {
            this.update(this.deltaTime);
            this.render();
        }

        // Actualizar input
        this.input.update();

        this.lastTime = currentTime;

        // Continuar loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * Actualiza la lógica del juego
     * @param {number} deltaTime - Tiempo transcurrido desde el último frame
     */
    update(deltaTime) {
        // Actualizar coche
        if (this.car) {
            this.car.update(deltaTime, this.input);
        }

        // Actualizar cámara
        this.updateCamera();

        // Verificar línea de meta
        this.checkFinishLine();

        // Actualizar cronómetro
        this.updateLapTimer();

        // Actualizar HUD
        if (this.hud) {
            this.hud.update(this.car, this.lapTimer);
        }
    }

    /**
     * Actualiza la posición de la cámara para seguir al coche
     */
    updateCamera() {
        if (!this.car) return;

        // Calcular límites del mapa con zoom
        this.calculateCameraBounds();

        // Posición objetivo de la cámara (centro del coche)
        this.camera.targetX = this.car.x;
        this.camera.targetY = this.car.y;

        // Aplicar suavizado a la cámara
        this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothness;
        this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothness;

        // Mantener cámara dentro de los límites
        this.camera.x = window.GameUtils.MathUtils.clamp(
            this.camera.x,
            this.camera.bounds.minX,
            this.camera.bounds.maxX
        );
        this.camera.y = window.GameUtils.MathUtils.clamp(
            this.camera.y,
            this.camera.bounds.minY,
            this.camera.bounds.maxY
        );
    }

    /**
     * Calcula los límites de la cámara para evitar bordes negros
     */
    calculateCameraBounds() {
        const circuitImage = this.assets.getImage('circuit');
        if (!circuitImage) return;

        // Dimensiones del canvas
        const canvasWidth = this.config.width;
        const canvasHeight = this.config.height;

        // Dimensiones del mapa en coordenadas del mundo real (sin zoom)
        const mapWidth = circuitImage.width;
        const mapHeight = circuitImage.height;

        // Calcular límites para mantener el mapa siempre visible
        // La cámara debe estar centrada en el coche, pero sin mostrar bordes negros
        // Los límites se calculan en coordenadas del mundo real, no con zoom
        const halfCanvasWidth = (canvasWidth / 2) / this.camera.zoom;
        const halfCanvasHeight = (canvasHeight / 2) / this.camera.zoom;

        this.camera.bounds.minX = halfCanvasWidth;
        this.camera.bounds.maxX = mapWidth - halfCanvasWidth;
        this.camera.bounds.minY = halfCanvasHeight;
        this.camera.bounds.maxY = mapHeight - halfCanvasHeight;

        // Asegurar que los límites sean válidos
        if (this.camera.bounds.maxX < this.camera.bounds.minX) {
            this.camera.bounds.maxX = this.camera.bounds.minX;
        }
        if (this.camera.bounds.maxY < this.camera.bounds.minY) {
            this.camera.bounds.maxY = this.camera.bounds.minY;
        }

        // Actualizar límites del coche con las dimensiones reales del mapa
        this.updateCarBounds(circuitImage.width, circuitImage.height);
    }

    /**
     * Actualiza los límites del coche con las dimensiones reales del mapa
     */
    updateCarBounds(mapWidth, mapHeight) {
        if (this.car) {
            this.car.setMapBounds(mapWidth, mapHeight);
        }
    }

    /**
     * Renderiza el juego
     */
    render() {
        // Limpiar canvas
        window.GameUtils.CanvasUtils.clear(this.ctx, this.config.width, this.config.height);

        // Renderizar fondo (circuito)
        this.renderBackground();

        // Renderizar línea de meta (debug)
        this.renderFinishLine();

        // Renderizar coche con transformaciones de cámara
        if (this.car) {
            this.ctx.save();

            // Aplicar transformaciones de cámara para el coche
            this.ctx.translate(this.config.width / 2, this.config.height / 2);
            this.ctx.scale(this.camera.zoom, this.camera.zoom);
            this.ctx.translate(-this.camera.x, -this.camera.y);

            this.car.render(this.ctx);

            this.ctx.restore();
        }

        // Renderizar HUD
        if (this.hud) {
            this.hud.render(this.ctx);
        }
    }

    /**
     * Renderiza el fondo (circuito)
     */
    renderBackground() {
        const circuitImage = this.assets.getImage('circuit');
        if (circuitImage) {
            // Aplicar transformaciones de cámara
            this.ctx.save();

            // Aplicar zoom y traslación de cámara
            this.ctx.translate(this.config.width / 2, this.config.height / 2);
            this.ctx.scale(this.camera.zoom, this.camera.zoom);
            this.ctx.translate(-this.camera.x, -this.camera.y);

            // Dibujar el mapa completo con zoom
            this.ctx.drawImage(circuitImage, 0, 0, circuitImage.width, circuitImage.height);

            this.ctx.restore();
        } else {
            // Fallback: fondo negro
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.config.width, this.config.height);
        }
    }

    /**
     * Renderiza la línea de meta (para debug)
     */
    renderFinishLine() {
        // Aplicar transformaciones de cámara para la línea de meta
        this.ctx.save();

        this.ctx.translate(this.config.width / 2, this.config.height / 2);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        this.ctx.translate(-this.camera.x, -this.camera.y);

        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2 / this.camera.zoom; // Ajustar grosor de línea para el zoom
        this.ctx.strokeRect(
            this.finishLine.x,
            this.finishLine.y,
            this.finishLine.width,
            this.finishLine.height
        );

        this.ctx.restore();
    }

    /**
     * Verifica si el coche ha cruzado la línea de meta
     */
    checkFinishLine() {
        if (!this.car) return;

        const carRect = {
            x: this.car.x - this.car.width / 2,
            y: this.car.y - this.car.height / 2,
            width: this.car.width,
            height: this.car.height
        };

        if (window.GameUtils.CollisionUtils.rectRect(carRect, this.finishLine)) {
            const currentTime = performance.now();
            const timeSinceLastCross = currentTime - this.lapTimer.lastFinishLineCross;

            // Cooldown de 3 segundos (3000ms) para evitar doble detección
            if (timeSinceLastCross < 3000) {
                return; // Ignorar si no han pasado 3 segundos
            }

            if (!this.lapTimer.hasStarted) {
                // Primera vez que cruza la línea
                this.startLapTimer();
                this.lapTimer.lastFinishLineCross = currentTime;
            } else if (this.lapTimer.isRunning) {
                // Completar vuelta
                this.finishLap();
                this.lapTimer.lastFinishLineCross = currentTime;
            }
        }
    }

    /**
     * Inicia el cronómetro de vuelta
     */
    startLapTimer() {
        this.lapTimer.startTime = performance.now();
        this.lapTimer.isRunning = true;
        this.lapTimer.hasStarted = true;
        console.log('Cronómetro iniciado');
    }

    /**
     * Finaliza la vuelta
     */
    finishLap() {
        this.lapTimer.isRunning = false;
        this.lapTimer.lapTime = performance.now() - this.lapTimer.startTime;

        console.log(`Vuelta completada: ${window.GameUtils.TimeUtils.formatTime(this.lapTimer.lapTime)}`);

        // Deshabilitar aceleración
        if (this.car) {
            this.car.disableAcceleration();
        }

        // Cambiar estado
        this.changeState(this.states.FINISHED);

        // Mostrar tiempo final
        this.showFinalTime();
    }

    /**
     * Actualiza el cronómetro de vuelta
     */
    updateLapTimer() {
        if (this.lapTimer.isRunning) {
            const currentTime = performance.now() - this.lapTimer.startTime;
            const timeElement = document.getElementById('lap-time');
            if (timeElement) {
                timeElement.textContent = window.GameUtils.TimeUtils.formatTime(currentTime);
            }
        }
    }

    /**
     * Muestra el tiempo final
     */
    showFinalTime() {
        const finalTimeElement = document.getElementById('final-time-display');
        if (finalTimeElement) {
            finalTimeElement.textContent = window.GameUtils.TimeUtils.formatTime(this.lapTimer.lapTime);
        }
    }

    /**
     * Reinicia la carrera
     */
    restartRace() {
        console.log('Reiniciando carrera...');

        // Resetear cronómetro
        this.lapTimer = {
            startTime: 0,
            lapTime: 0,
            isRunning: false,
            hasStarted: false,
            lastFinishLineCross: 0
        };

        // Reiniciar coche
        if (this.car) {
            this.car.reset();
        }

        // Reiniciar cámara en la posición del coche
        if (this.car) {
            this.camera.x = this.car.x;
            this.camera.y = this.car.y;
            this.camera.targetX = this.car.x;
            this.camera.targetY = this.car.y;
        }

        // Reiniciar límites del coche
        const circuitImage = this.assets.getImage('circuit');
        if (circuitImage && this.car) {
            this.car.setMapBounds(circuitImage.width, circuitImage.height);
        }

        // Cambiar estado
        this.changeState(this.states.RACING);
    }

    /**
     * Muestra el menú principal
     */
    showMenu() {
        console.log('Mostrando menú principal...');
        this.changeState(this.states.START);
    }

    /**
     * Pausa el juego
     */
    pauseGame() {
        console.log('Juego pausado');
        // Implementar pausa si es necesario
    }

    /**
     * Actualiza el contador de FPS
     * @param {number} currentTime - Tiempo actual
     */
    updateFps(currentTime) {
        this.frameCount++;

        if (currentTime - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }
    }

    /**
     * Muestra un error
     * @param {string} message - Mensaje de error
     */
    showError(message) {
        console.error(message);
        alert(message);
    }

    /**
     * Obtiene información de debug
     * @returns {Object} Información de debug
     */
    getDebugInfo() {
        return {
            fps: this.fps,
            deltaTime: this.deltaTime,
            gameState: this.gameState,
            car: this.car ? this.car.getDebugInfo() : null,
            input: this.input.getDebugInfo(),
            lapTimer: this.lapTimer
        };
    }
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando juego...');
    window.game = new Game();
});

// Exportar clase globalmente
window.Game = Game; 