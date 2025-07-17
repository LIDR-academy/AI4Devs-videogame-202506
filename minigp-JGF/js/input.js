/**
 * Sistema de gestión de input para el juego de carreras
 */

class InputManager {
    constructor() {
        this.keys = new Set();
        this.pressedKeys = new Set();
        this.releasedKeys = new Set();
        this.isEnabled = true;

        this.setupEventListeners();
    }

    /**
     * Configura los event listeners para el teclado
     */
    setupEventListeners() {
        // Evento de tecla presionada
        document.addEventListener('keydown', (event) => {
            if (!this.isEnabled) return;

            const key = event.code;

            // Prevenir comportamiento por defecto para teclas de juego
            if (this.isGameKey(key)) {
                event.preventDefault();
            }

            // Solo registrar si la tecla no estaba presionada antes
            if (!this.keys.has(key)) {
                this.keys.add(key);
                this.pressedKeys.add(key);
            }
        });

        // Evento de tecla liberada
        document.addEventListener('keyup', (event) => {
            if (!this.isEnabled) return;

            const key = event.code;

            // Prevenir comportamiento por defecto para teclas de juego
            if (this.isGameKey(key)) {
                event.preventDefault();
            }

            this.keys.delete(key);
            this.releasedKeys.add(key);
        });

        // Prevenir comportamiento por defecto en el canvas
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        // Manejar pérdida de foco de la ventana
        window.addEventListener('blur', () => {
            this.clearKeys();
        });
    }

    /**
     * Verifica si una tecla está presionada
     * @param {string} key - Código de la tecla
     * @returns {boolean} True si la tecla está presionada
     */
    isKeyPressed(key) {
        return this.keys.has(key);
    }

    /**
     * Verifica si una tecla fue presionada en este frame
     * @param {string} key - Código de la tecla
     * @returns {boolean} True si la tecla fue presionada en este frame
     */
    isKeyJustPressed(key) {
        return this.pressedKeys.has(key);
    }

    /**
     * Verifica si una tecla fue liberada en este frame
     * @param {string} key - Código de la tecla
     * @returns {boolean} True si la tecla fue liberada en este frame
     */
    isKeyJustReleased(key) {
        return this.releasedKeys.has(key);
    }

    /**
     * Verifica si es una tecla de juego
     * @param {string} key - Código de la tecla
     * @returns {boolean} True si es una tecla de juego
     */
    isGameKey(key) {
        const gameKeys = [
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'KeyW', 'KeyA', 'KeyS', 'KeyD',
            'Space', 'Enter', 'Escape'
        ];
        return gameKeys.includes(key);
    }

    /**
     * Obtiene el estado de las teclas de dirección
     * @returns {Object} Objeto con el estado de cada dirección
     */
    getDirectionalInput() {
        return {
            up: this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW'),
            down: this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS'),
            left: this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA'),
            right: this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD')
        };
    }

    /**
     * Obtiene el estado de las teclas de acción
     * @returns {Object} Objeto con el estado de las teclas de acción
     */
    getActionInput() {
        return {
            space: this.isKeyPressed('Space'),
            enter: this.isKeyJustPressed('Enter'),
            escape: this.isKeyJustPressed('Escape')
        };
    }

    /**
     * Limpia todas las teclas
     */
    clearKeys() {
        this.keys.clear();
        this.pressedKeys.clear();
        this.releasedKeys.clear();
    }

    /**
     * Actualiza el estado del input (llamar al final de cada frame)
     */
    update() {
        // Limpiar teclas presionadas y liberadas en este frame
        this.pressedKeys.clear();
        this.releasedKeys.clear();
    }

    /**
     * Habilita o deshabilita el input
     * @param {boolean} enabled - True para habilitar, false para deshabilitar
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            this.clearKeys();
        }
    }

    /**
     * Obtiene información de debug del input
     * @returns {Object} Información de debug
     */
    getDebugInfo() {
        return {
            pressedKeys: Array.from(this.keys),
            pressedThisFrame: Array.from(this.pressedKeys),
            releasedThisFrame: Array.from(this.releasedKeys),
            directional: this.getDirectionalInput(),
            action: this.getActionInput()
        };
    }
}

// Constantes para códigos de teclas
const KEY_CODES = {
    // Direccionales
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',

    // WASD (alternativas)
    W: 'KeyW',
    A: 'KeyA',
    S: 'KeyS',
    D: 'KeyD',

    // Acciones
    SPACE: 'Space',
    ENTER: 'Enter',
    ESCAPE: 'Escape'
};

// Mapeo de teclas para el juego
const GAME_CONTROLS = {
    ACCELERATE: [KEY_CODES.UP, KEY_CODES.W],
    BRAKE: [KEY_CODES.DOWN, KEY_CODES.S],
    TURN_LEFT: [KEY_CODES.LEFT, KEY_CODES.A],
    TURN_RIGHT: [KEY_CODES.RIGHT, KEY_CODES.D],
    PAUSE: [KEY_CODES.ESCAPE],
    CONFIRM: [KEY_CODES.ENTER, KEY_CODES.SPACE]
};

// Función helper para verificar si una acción está activa
function isActionActive(inputManager, action) {
    const keys = GAME_CONTROLS[action];
    return keys.some(key => inputManager.isKeyPressed(key));
}

// Función helper para verificar si una acción fue presionada en este frame
function isActionJustPressed(inputManager, action) {
    const keys = GAME_CONTROLS[action];
    return keys.some(key => inputManager.isKeyJustPressed(key));
}

// Crear instancia global del InputManager
const inputManager = new InputManager();

// Exportar clases y funciones globalmente
window.InputManager = InputManager;
window.KEY_CODES = KEY_CODES;
window.GAME_CONTROLS = GAME_CONTROLS;
window.isActionActive = isActionActive;
window.isActionJustPressed = isActionJustPressed;
window.inputManager = inputManager; 