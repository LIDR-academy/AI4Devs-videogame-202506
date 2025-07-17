/**
 * Sistema de preloader visual para el juego
 */

class Preloader {
    constructor() {
        this.currentPhase = 0;
        this.phases = [
            { name: 'Inicializando...', description: 'Preparando el motor del juego' },
            { name: 'Cargando circuito...', description: 'Preparando la pista de carreras' },
            { name: 'Cargando vehículo...', description: 'Preparando tu coche de carreras' },
            { name: 'Cargando interfaz...', description: 'Preparando instrumentos de vuelta' },
            { name: 'Cargando elementos...', description: 'Preparando elementos adicionales' },
            { name: '¡Listo!', description: 'Todo preparado para la carrera' }
        ];

        this.phaseProgress = 0;
        this.overallProgress = 0;
        this.isComplete = false;

        this.setupElements();
    }

    /**
     * Configura los elementos del preloader
     */
    setupElements() {
        this.progressBar = document.getElementById('loading-progress');
        this.loadingText = document.getElementById('loading-text');
        this.phaseText = document.getElementById('phase-text');
        this.descriptionText = document.getElementById('description-text');

        // Crear elementos si no existen
        if (!this.phaseText) {
            this.phaseText = document.createElement('div');
            this.phaseText.id = 'phase-text';
            this.phaseText.className = 'phase-text';
            this.phaseText.style.cssText = `
                font-size: 1.5rem;
                color: #ffd700;
                margin-bottom: 0.5rem;
                font-weight: bold;
            `;

            const loadingContent = document.querySelector('.loading-content');
            if (loadingContent) {
                loadingContent.insertBefore(this.phaseText, this.loadingText);
            }
        }

        if (!this.descriptionText) {
            this.descriptionText = document.createElement('div');
            this.descriptionText.id = 'description-text';
            this.descriptionText.className = 'description-text';
            this.descriptionText.style.cssText = `
                font-size: 1rem;
                color: #ccc;
                margin-bottom: 1rem;
                font-style: italic;
            `;

            const loadingContent = document.querySelector('.loading-content');
            if (loadingContent) {
                loadingContent.insertBefore(this.descriptionText, this.loadingText);
            }
        }
    }

    /**
     * Inicia el preloader
     */
    start() {
        this.currentPhase = 0;
        this.phaseProgress = 0;
        this.overallProgress = 0;
        this.isComplete = false;

        this.updateDisplay();
        this.startPhaseAnimation();
    }

    /**
     * Actualiza el progreso de la fase actual
     * @param {number} progress - Progreso de 0 a 100
     * @param {string} text - Texto descriptivo
     */
    updatePhaseProgress(progress, text) {
        this.phaseProgress = progress;
        this.updateOverallProgress();
        this.updateDisplay();

        if (this.loadingText && text) {
            this.loadingText.textContent = text;
        }
    }

    /**
     * Avanza a la siguiente fase
     */
    nextPhase() {
        if (this.currentPhase < this.phases.length - 1) {
            this.currentPhase++;
            this.phaseProgress = 0;
            this.updateDisplay();
            this.startPhaseAnimation();
        }
    }

    /**
     * Completa el preloader
     */
    complete() {
        this.isComplete = true;
        this.overallProgress = 100;
        this.phaseProgress = 100;
        this.currentPhase = this.phases.length - 1;
        this.updateDisplay();

        // Animación de completado
        setTimeout(() => {
            this.showCompletionAnimation();
        }, 500);
    }

    /**
     * Actualiza el progreso general
     */
    updateOverallProgress() {
        const phaseWeight = 100 / this.phases.length;
        this.overallProgress = (this.currentPhase * phaseWeight) + (this.phaseProgress * phaseWeight / 100);
    }

    /**
     * Actualiza la visualización
     */
    updateDisplay() {
        // Actualizar barra de progreso
        if (this.progressBar) {
            this.progressBar.style.width = `${this.overallProgress}%`;
        }

        // Actualizar texto de fase
        if (this.phaseText && this.phases[this.currentPhase]) {
            this.phaseText.textContent = this.phases[this.currentPhase].name;
        }

        // Actualizar descripción
        if (this.descriptionText && this.phases[this.currentPhase]) {
            this.descriptionText.textContent = this.phases[this.currentPhase].description;
        }

        // Actualizar texto de progreso
        if (this.loadingText) {
            const phase = this.currentPhase + 1;
            const totalPhases = this.phases.length;
            this.loadingText.textContent = `Fase ${phase}/${totalPhases} - ${Math.round(this.phaseProgress)}%`;
        }
    }

    /**
     * Inicia la animación de la fase
     */
    startPhaseAnimation() {
        // Simular progreso de la fase actual
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10 + 5; // Progreso aleatorio entre 5-15%

            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                // Avanzar a la siguiente fase después de un pequeño delay
                setTimeout(() => {
                    if (!this.isComplete) {
                        this.nextPhase();
                    }
                }, 300);
            }

            this.updatePhaseProgress(progress);
        }, 100 + Math.random() * 200); // Intervalo aleatorio entre 100-300ms
    }

    /**
     * Muestra la animación de completado
     */
    showCompletionAnimation() {
        // Efecto de parpadeo
        const elements = [this.phaseText, this.descriptionText, this.loadingText];
        let blinkCount = 0;
        const maxBlinks = 3;

        const blinkInterval = setInterval(() => {
            elements.forEach(el => {
                if (el) {
                    el.style.opacity = el.style.opacity === '0.5' ? '1' : '0.5';
                }
            });

            blinkCount++;
            if (blinkCount >= maxBlinks * 2) {
                clearInterval(blinkInterval);
                elements.forEach(el => {
                    if (el) {
                        el.style.opacity = '1';
                    }
                });

                // Transición suave a la siguiente pantalla
                setTimeout(() => {
                    this.hide();
                }, 1000);
            }
        }, 200);
    }

    /**
     * Oculta el preloader
     */
    hide() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Muestra un mensaje de error
     * @param {string} message - Mensaje de error
     */
    showError(message) {
        if (this.loadingText) {
            this.loadingText.textContent = `Error: ${message}`;
            this.loadingText.style.color = '#ff4444';
        }

        if (this.progressBar) {
            this.progressBar.style.background = '#ff4444';
        }
    }

    /**
     * Obtiene información del preloader
     * @returns {Object} Información del preloader
     */
    getInfo() {
        return {
            currentPhase: this.currentPhase,
            phaseProgress: this.phaseProgress,
            overallProgress: this.overallProgress,
            isComplete: this.isComplete,
            totalPhases: this.phases.length
        };
    }
}

// Crear instancia global del preloader
const preloader = new Preloader();

// Exportar clase y instancia globalmente
window.Preloader = Preloader;
window.preloader = preloader; 