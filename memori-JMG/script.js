/**
 * JUEGO DE MEMORIA CON EMOJIS
 * Autor: GitHub Copilot
 * Fecha: Julio 2025
 * 
 * Descripción: Juego de memoria progresivo con múltiples niveles de dificultad
 * que utiliza emojis como cartas. El jugador debe encontrar todos los pares
 * para avanzar al siguiente nivel.
 */

class MemoryGame {
    constructor() {
        // Configuración inicial del juego
        this.currentLevel = 1;
        this.moves = 0;
        this.matches = 0;
        this.flippedCards = [];
        this.isProcessing = false;
        this.startTime = null;
        this.timerInterval = null;
        this.gameStarted = false;
        this.soundEnabled = true;
        this.showHints = false;
        this.distractionsEnabled = false;
        this.powerUpsEnabled = true;
        this.gameMode = 'normal'; // 'normal', 'timed', 'endless'
        this.distractionInterval = null;
        this.hintsUsed = 0;
        this.powerUps = [];
        
        // Configuración de niveles ampliada
        this.levelConfig = {
            1: { pairs: 7, timeLimit: 120, flipDelay: 1000, distractions: false },
            2: { pairs: 10, timeLimit: 180, flipDelay: 800, distractions: false },
            3: { pairs: 13, timeLimit: 240, flipDelay: 600, distractions: true },
            4: { pairs: 16, timeLimit: 300, flipDelay: 400, distractions: true },
            5: { pairs: 20, timeLimit: 360, flipDelay: 300, distractions: true }
        };
        
        // Emojis disponibles para el juego
        this.emojiSets = {
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆'],
            fruits: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍑', '🍒', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🌶️', '🥒'],
            objects: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥍', '🏒', '🏑', '🥅', '🎯', '🎮', '🕹️', '🎲', '♠️', '♥️'],
            nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌵', '🌲', '🌳', '🌴', '🌿', '🍀', '🍃', '🌊', '⭐', '🌟', '💫', '✨', '🌈', '☀️']
        };
        
        // Elementos del DOM
        this.initializeElements();
        
        // Event listeners
        this.attachEventListeners();
        
        // Cargar datos guardados
        this.loadGameData();
        
        // Actualizar interfaz
        this.updateDisplay();
        this.resetPowerUps();
    }
    
    /**
     * Inicializa las referencias a los elementos del DOM
     */
    initializeElements() {
        this.gameBoard = document.getElementById('game-board');
        this.levelDisplay = document.getElementById('level-display');
        this.movesDisplay = document.getElementById('moves-display');
        this.timerDisplay = document.getElementById('timer-display');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.nextLevelBtn = document.getElementById('next-level-btn');
        this.gameMessage = document.getElementById('game-message');
        this.messageTitle = document.getElementById('message-title');
        this.messageText = document.getElementById('message-text');
        this.messageBtn = document.getElementById('message-btn');
        this.bestScore = document.getElementById('best-score');
        this.maxLevel = document.getElementById('max-level');
        
        // Nuevos elementos para Fase 3
        this.gameSettings = document.getElementById('game-settings');
        this.distractionsToggle = document.getElementById('distractions-toggle');
        this.soundToggle = document.getElementById('sound-toggle');
        this.powerupsToggle = document.getElementById('powerups-toggle');
        this.powerupsBar = document.getElementById('powerups-bar');
        this.hintPowerup = document.getElementById('hint-powerup');
        this.freezePowerup = document.getElementById('freeze-powerup');
        this.shufflePowerup = document.getElementById('shuffle-powerup');
        this.hintCount = document.getElementById('hint-count');
        this.freezeCount = document.getElementById('freeze-count');
        this.shuffleCount = document.getElementById('shuffle-count');
    }
    
    /**
     * Configura todos los event listeners del juego
     */
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.nextLevelBtn.addEventListener('click', () => this.nextLevel());
        this.messageBtn.addEventListener('click', () => this.hideMessage());
        
        // Event listeners para configuraciones
        this.distractionsToggle.addEventListener('change', (e) => {
            this.distractionsEnabled = e.target.checked;
            console.log(`🌪️ Distracciones ${this.distractionsEnabled ? 'activadas' : 'desactivadas'}`);
        });
        
        this.soundToggle.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            if (this.soundEnabled) this.playSound('flip');
            console.log(`🔊 Sonido ${this.soundEnabled ? 'activado' : 'desactivado'}`);
        });
        
        this.powerupsToggle.addEventListener('change', (e) => {
            this.powerUpsEnabled = e.target.checked;
            this.powerupsBar.style.display = this.powerUpsEnabled ? 'flex' : 'none';
            console.log(`⚡ Power-ups ${this.powerUpsEnabled ? 'activados' : 'desactivados'}`);
        });
        
        // Event listeners para power-ups
        this.hintPowerup.addEventListener('click', () => this.usePowerUp('hint'));
        this.freezePowerup.addEventListener('click', () => this.usePowerUp('freeze'));
        this.shufflePowerup.addEventListener('click', () => this.usePowerUp('shuffle'));
        
        // Event listener para cerrar mensaje con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.gameMessage.classList.contains('hidden')) {
                this.hideMessage();
            }
            
            // Teclas rápidas para power-ups
            if (this.gameStarted && this.powerUpsEnabled) {
                if (e.key === '1') this.usePowerUp('hint');
                if (e.key === '2') this.usePowerUp('freeze');
                if (e.key === '3') this.usePowerUp('shuffle');
            }
        });
        
        // Prevenir comportamiento por defecto en botones
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => e.preventDefault());
        });
    }
    
    /**
     * Inicia un nuevo juego
     */
    startGame() {
        this.gameStarted = true;
        this.moves = 0;
        this.matches = 0;
        this.flippedCards = [];
        this.isProcessing = false;
        this.startTime = Date.now();
        this.hintsUsed = 0;
        
        // Resetear power-ups
        this.resetPowerUps();
        
        this.createBoard();
        this.startTimer();
        this.updateDisplay();
        
        // Iniciar distracciones si están habilitadas
        if (this.distractionsEnabled && this.levelConfig[this.currentLevel].distractions) {
            this.startDistractions();
        }
        
        // Cambiar visibilidad de botones y configuraciones
        this.startBtn.classList.add('hidden');
        this.nextLevelBtn.classList.add('hidden');
        this.gameSettings.style.opacity = '0.5';
        this.gameSettings.style.pointerEvents = 'none';
        
        // Mostrar mensaje de inicio del nivel con efectos de transición
        this.showLevelTransition();
        
        console.log(`🎮 Juego iniciado - Nivel ${this.currentLevel}`);
    }
    
    /**
     * Reinicia el juego actual
     */
    restartGame() {
        // Mostrar confirmación si el juego está en progreso
        if (this.gameStarted && this.matches > 0) {
            this.showMessage(
                '🔄 ¿Reiniciar Juego?',
                '¿Estás seguro de que quieres reiniciar? Perderás el progreso actual.',
                () => this.performRestart(),
                null,
                true // Mostrar botón cancelar
            );
            return;
        }
        
        this.performRestart();
    }
    
    /**
     * Ejecuta el reinicio del juego
     */
    performRestart() {
        this.stopTimer();
        this.stopDistractions();
        this.gameStarted = false;
        this.moves = 0;
        this.matches = 0;
        this.flippedCards = [];
        this.isProcessing = false;
        this.hintsUsed = 0;
        
        // Limpiar el tablero
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = 'game-board';
        
        // Mostrar configuraciones y botón de inicio
        this.startBtn.classList.remove('hidden');
        this.nextLevelBtn.classList.add('hidden');
        this.gameSettings.style.opacity = '1';
        this.gameSettings.style.pointerEvents = 'auto';
        
        this.updateDisplay();
        console.log('🔄 Juego reiniciado');
    }
    
    /**
     * Avanza al siguiente nivel
     */
    nextLevel() {
        this.currentLevel++;
        this.startGame();
    }
    
    /**
     * Crea el tablero de juego con las cartas
     */
    createBoard() {
        const config = this.levelConfig[this.currentLevel];
        const totalCards = config.pairs * 2;
        
        // Generar emojis para este nivel
        const emojis = this.generateEmojis(config.pairs);
        
        // Duplicar emojis para crear pares
        const cards = [...emojis, ...emojis];
        
        // Barajar las cartas
        this.shuffleArray(cards);
        
        // Limpiar tablero
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = `game-board level-${Math.min(this.currentLevel, 3)}`;
        
        // Crear elementos de carta
        cards.forEach((emoji, index) => {
            const card = this.createCard(emoji, index);
            this.gameBoard.appendChild(card);
        });
        
        console.log(`🃏 Tablero creado: ${totalCards} cartas, ${config.pairs} pares`);
    }
    
    /**
     * Crea un elemento de carta individual
     * @param {string} emoji - El emoji de la carta
     * @param {number} index - Índice de la carta
     * @returns {HTMLElement} Elemento de carta
     */
    createCard(emoji, index) {
        const card = document.createElement('div');
        card.className = 'card back';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        
        // Event listener para voltear carta
        card.addEventListener('click', () => this.flipCard(card));
        
        return card;
    }
    
    /**
     * Voltea una carta y maneja la lógica del juego
     * @param {HTMLElement} card - Elemento de carta a voltear
     */
    flipCard(card) {
        // Verificar si se puede voltear la carta
        if (!this.canFlipCard(card)) return;
        
        // Voltear la carta
        card.classList.remove('back');
        card.classList.add('flipped');
        card.textContent = card.dataset.emoji;
        card.classList.add('flip-animation');
        
        // Agregar a cartas volteadas
        this.flippedCards.push(card);
        
        // Reproducir sonido si está habilitado
        this.playSound('flip');
        
        // Verificar si hay dos cartas volteadas
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkForMatch();
        }
        
        console.log(`🔄 Carta volteada: ${card.dataset.emoji} (${this.flippedCards.length}/2)`);
    }
    
    /**
     * Verifica si una carta se puede voltear
     * @param {HTMLElement} card - Carta a verificar
     * @returns {boolean} Si se puede voltear
     */
    canFlipCard(card) {
        return this.gameStarted && 
               !this.isProcessing && 
               !card.classList.contains('flipped') && 
               !card.classList.contains('matched') && 
               this.flippedCards.length < 2;
    }
    
    /**
     * Verifica si las dos cartas volteadas coinciden
     */
    checkForMatch() {
        this.isProcessing = true;
        const [card1, card2] = this.flippedCards;
        
        const isMatch = card1.dataset.emoji === card2.dataset.emoji;
        
        if (isMatch) {
            // ¡Coincidencia!
            this.playSound('match');
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                
                this.matches++;
                this.flippedCards = [];
                this.isProcessing = false;
                
                // Verificar si se completó el nivel
                this.checkLevelComplete();
                
                console.log(`✅ ¡Coincidencia! ${card1.dataset.emoji} - Parejas: ${this.matches}/${this.levelConfig[this.currentLevel].pairs}`);
            }, 500);
            
        } else {
            // No coinciden
            this.playSound('wrong');
            card1.classList.add('wrong');
            card2.classList.add('wrong');
            
            const config = this.levelConfig[this.currentLevel];
            setTimeout(() => {
                card1.classList.remove('flipped', 'wrong', 'flip-animation');
                card2.classList.remove('flipped', 'wrong', 'flip-animation');
                card1.classList.add('back');
                card2.classList.add('back');
                card1.textContent = '';
                card2.textContent = '';
                
                this.flippedCards = [];
                this.isProcessing = false;
                
                console.log(`❌ No coinciden: ${card1.dataset.emoji} ≠ ${card2.dataset.emoji}`);
            }, config.flipDelay);
        }
    }
    
    /**
     * Verifica si se completó el nivel actual
     */
    checkLevelComplete() {
        const config = this.levelConfig[this.currentLevel];
        
        if (this.matches === config.pairs) {
            this.stopTimer();
            this.stopDistractions();
            this.playSound('complete');
            const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const score = this.calculateScore(timeElapsed);
            
            // Guardar progreso
            this.saveGameData(score);
            
            // Mostrar mensaje de victoria
            this.showMessage(
                '🎉 ¡Nivel Completado!',
                `¡Excelente trabajo! Completaste el nivel ${this.currentLevel} en ${timeElapsed} segundos con ${this.moves} movimientos.\n\nPuntuación: ${score}`,
                () => {
                    if (this.currentLevel < Object.keys(this.levelConfig).length) {
                        this.nextLevelBtn.classList.remove('hidden');
                    } else {
                        this.showMessage('🏆 ¡Juego Completado!', '¡Has completado todos los niveles disponibles! Eres un maestro de la memoria.', () => {
                            this.currentLevel = 1;
                            this.startBtn.classList.remove('hidden');
                        });
                    }
                }
            );
            
            console.log(`🎉 ¡Nivel ${this.currentLevel} completado! Puntuación: ${score}`);
        }
    }
    
    /**
     * Calcula la puntuación basada en tiempo, movimientos y power-ups
     * @param {number} timeElapsed - Tiempo transcurrido en segundos
     * @returns {number} Puntuación calculada
     */
    calculateScore(timeElapsed) {
        const config = this.levelConfig[this.currentLevel];
        const timeBonus = Math.max(0, config.timeLimit - timeElapsed);
        const movesPenalty = Math.max(0, this.moves - config.pairs);
        const baseScore = config.pairs * 100;
        
        // Bonificaciones por eficiencia
        const efficiencyBonus = this.moves === config.pairs ? 500 : 0; // Juego perfecto
        const hintsUsedPenalty = this.hintsUsed * 50; // Penalización por usar pistas
        
        // Bonus por nivel de dificultad
        const levelMultiplier = this.currentLevel * 0.1 + 1; // 1.1x, 1.2x, 1.3x, etc.
        
        const finalScore = Math.round(
            (baseScore + (timeBonus * 5) + efficiencyBonus - (movesPenalty * 10) - hintsUsedPenalty) 
            * levelMultiplier
        );
        
        return Math.max(0, finalScore);
    }
    
    /**
     * Genera emojis aleatorios para el nivel
     * @param {number} count - Número de emojis únicos necesarios
     * @returns {string[]} Array de emojis
     */
    generateEmojis(count) {
        // Combinar todos los conjuntos de emojis
        const allEmojis = Object.values(this.emojiSets).flat();
        
        // Seleccionar emojis aleatorios
        const selectedEmojis = [];
        const usedEmojis = new Set();
        
        while (selectedEmojis.length < count && selectedEmojis.length < allEmojis.length) {
            const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
            if (!usedEmojis.has(randomEmoji)) {
                selectedEmojis.push(randomEmoji);
                usedEmojis.add(randomEmoji);
            }
        }
        
        return selectedEmojis;
    }
    
    /**
     * Baraja un array usando el algoritmo Fisher-Yates
     * @param {Array} array - Array a barajar
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    /**
     * Inicia el temporizador del juego
     */
    startTimer() {
        const config = this.levelConfig[this.currentLevel];
        let remainingTime = config.timeLimit;
        
        this.timerInterval = setInterval(() => {
            remainingTime--;
            
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Cambiar color cuando queda poco tiempo
            if (remainingTime <= 30) {
                this.timerDisplay.style.color = '#ef4444';
            } else if (remainingTime <= 60) {
                this.timerDisplay.style.color = '#f59e0b';
            }
            
            // Tiempo agotado
            if (remainingTime <= 0) {
                this.stopTimer();
                this.gameOver();
            }
        }, 1000);
    }
    
    /**
     * Detiene el temporizador
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.timerDisplay.style.color = '#1f2937';
    }
    
    /**
     * Maneja el fin del juego por tiempo agotado
     */
    gameOver() {
        this.gameStarted = false;
        this.stopDistractions();
        this.showMessage(
            '⏰ Tiempo Agotado',
            `¡Se acabó el tiempo! Lograste ${this.matches} de ${this.levelConfig[this.currentLevel].pairs} parejas en el nivel ${this.currentLevel}.`,
            () => {
                this.startBtn.classList.remove('hidden');
                this.gameSettings.style.opacity = '1';
                this.gameSettings.style.pointerEvents = 'auto';
            }
        );
        
        console.log(`⏰ Tiempo agotado en nivel ${this.currentLevel}`);
    }
    
    /**
     * Muestra un mensaje modal
     * @param {string} title - Título del mensaje
     * @param {string} text - Texto del mensaje
     * @param {Function} callback - Función a ejecutar al cerrar
     * @param {number} autoClose - Milisegundos para auto-cerrar (opcional)
     * @param {boolean} showCancel - Mostrar botón cancelar (opcional)
     */
    showMessage(title, text, callback = null, autoClose = null, showCancel = false) {
        this.messageTitle.textContent = title;
        this.messageText.textContent = text;
        this.gameMessage.classList.remove('hidden');
        
        // Configurar botones
        if (showCancel) {
            // Cambiar texto del botón principal
            this.messageBtn.textContent = 'Confirmar';
            this.messageBtn.className = 'btn btn-restart';
            
            // Crear botón cancelar si no existe
            let cancelBtn = document.getElementById('cancel-btn');
            if (!cancelBtn) {
                cancelBtn = document.createElement('button');
                cancelBtn.id = 'cancel-btn';
                cancelBtn.className = 'btn btn-primary';
                cancelBtn.textContent = 'Cancelar';
                cancelBtn.style.marginLeft = '10px';
                this.messageBtn.parentNode.appendChild(cancelBtn);
                
                cancelBtn.addEventListener('click', () => this.hideMessage());
            }
            cancelBtn.style.display = 'inline-flex';
        } else {
            this.messageBtn.textContent = 'OK';
            this.messageBtn.className = 'btn btn-primary';
            
            const cancelBtn = document.getElementById('cancel-btn');
            if (cancelBtn) {
                cancelBtn.style.display = 'none';
            }
        }
        
        // Configurar callback
        this.messageCallback = callback;
        
        // Auto-cerrar si se especifica
        if (autoClose) {
            this.autoCloseTimeout = setTimeout(() => {
                this.hideMessage();
            }, autoClose);
        }
    }
    
    /**
     * Oculta el mensaje modal
     */
    hideMessage() {
        // Limpiar auto-close si existe
        if (this.autoCloseTimeout) {
            clearTimeout(this.autoCloseTimeout);
            this.autoCloseTimeout = null;
        }
        
        this.gameMessage.classList.add('hidden');
        
        // Ejecutar callback si existe
        if (this.messageCallback) {
            const callback = this.messageCallback;
            this.messageCallback = null;
            callback();
        }
    }
    
    /**
     * Actualiza la interfaz con los datos actuales
     */
    updateDisplay() {
        this.levelDisplay.textContent = this.currentLevel;
        this.movesDisplay.textContent = this.moves;
        
        // Actualizar estadísticas
        const savedData = this.loadGameData();
        this.bestScore.textContent = savedData.bestScore || '-';
        this.maxLevel.textContent = savedData.maxLevel || 1;
    }
    
    /**
     * Guarda los datos del juego en localStorage
     * @param {number} score - Puntuación actual
     */
    saveGameData(score) {
        const savedData = this.loadGameData();
        
        // Actualizar mejor puntuación
        if (!savedData.bestScore || score > savedData.bestScore) {
            savedData.bestScore = score;
        }
        
        // Actualizar nivel máximo
        if (this.currentLevel > savedData.maxLevel) {
            savedData.maxLevel = this.currentLevel;
        }
        
        // Guardar en localStorage
        localStorage.setItem('memoryGameData', JSON.stringify(savedData));
        
        console.log('💾 Datos guardados:', savedData);
    }
    
    /**
     * Carga los datos guardados del juego
     * @returns {Object} Datos del juego
     */
    loadGameData() {
        try {
            const data = localStorage.getItem('memoryGameData');
            return data ? JSON.parse(data) : { bestScore: 0, maxLevel: 1 };
        } catch (error) {
            console.warn('⚠️ Error cargando datos:', error);
            return { bestScore: 0, maxLevel: 1 };
        }
    }
    
    /**
     * Reproduce un sonido de juego usando Web Audio API (sin archivos externos)
     * @param {string} type - Tipo de sonido (flip, match, wrong, complete)
     */
    playSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Configurar sonidos según el tipo
            switch (type) {
                case 'flip':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
                    
                case 'match':
                    // Sonido de éxito - acorde mayor
                    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
                    frequencies.forEach((freq, index) => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                        gain.gain.setValueAtTime(0.05, audioContext.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                        osc.start(audioContext.currentTime + index * 0.05);
                        osc.stop(audioContext.currentTime + 0.4);
                    });
                    break;
                    
                case 'wrong':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;
                    
                case 'complete':
                    // Melodía de victoria
                    const victoryNotes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]; // C5-C6
                    victoryNotes.forEach((freq, index) => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                        gain.gain.setValueAtTime(0.05, audioContext.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                        osc.start(audioContext.currentTime + index * 0.1);
                        osc.stop(audioContext.currentTime + index * 0.1 + 0.2);
                    });
                    break;
            }
        } catch (error) {
            // Silenciar errores de audio en navegadores que no lo soportan
            console.debug('Audio no disponible:', error);
        }
    }
    
    /**
     * Obtiene estadísticas del juego actual
     * @returns {Object} Estadísticas del juego
     */
    getGameStats() {
        const timeElapsed = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
        const accuracy = this.moves > 0 ? Math.round((this.matches * 2 / this.moves) * 100) : 0;
        
        return {
            level: this.currentLevel,
            moves: this.moves,
            matches: this.matches,
            timeElapsed,
            accuracy,
            completed: this.matches === this.levelConfig[this.currentLevel].pairs
        };
    }
    
    /**
     * Activa/desactiva el sonido del juego
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.playSound('flip'); // Sonido de confirmación
        console.log(`🔊 Sonido ${this.soundEnabled ? 'activado' : 'desactivado'}`);
    }
    
    /**
     * Resetea los power-ups al inicio de cada nivel
     */
    resetPowerUps() {
        this.powerUps = {
            hint: 3,
            freeze: 2,
            shuffle: 1
        };
        this.updatePowerUpsDisplay();
    }
    
    /**
     * Actualiza la visualización de los power-ups
     */
    updatePowerUpsDisplay() {
        this.hintCount.textContent = this.powerUps.hint;
        this.freezeCount.textContent = this.powerUps.freeze;
        this.shuffleCount.textContent = this.powerUps.shuffle;
        
        // Actualizar clases visuales
        this.hintPowerup.classList.toggle('disabled', this.powerUps.hint === 0);
        this.freezePowerup.classList.toggle('disabled', this.powerUps.freeze === 0);
        this.shufflePowerup.classList.toggle('disabled', this.powerUps.shuffle === 0);
        
        // Actualizar clases de contador
        this.hintCount.classList.toggle('zero', this.powerUps.hint === 0);
        this.freezeCount.classList.toggle('zero', this.powerUps.freeze === 0);
        this.shuffleCount.classList.toggle('zero', this.powerUps.shuffle === 0);
    }
    
    /**
     * Usa un power-up específico
     * @param {string} type - Tipo de power-up (hint, freeze, shuffle)
     */
    usePowerUp(type) {
        if (!this.gameStarted || !this.powerUpsEnabled || this.powerUps[type] === 0) return;
        
        this.powerUps[type]--;
        this.updatePowerUpsDisplay();
        
        // Animación de activación
        const powerupElement = document.getElementById(`${type}-powerup`);
        powerupElement.style.animation = 'powerupActivate 0.6s ease-in-out';
        setTimeout(() => {
            powerupElement.style.animation = '';
        }, 600);
        
        switch (type) {
            case 'hint':
                this.activateHint();
                break;
            case 'freeze':
                this.activateFreeze();
                break;
            case 'shuffle':
                this.activateShuffle();
                break;
        }
        
        this.playSound('flip');
        console.log(`⚡ Power-up ${type} activado`);
    }
    
    /**
     * Activa el power-up de pista (muestra una pareja por 3 segundos)
     */
    activateHint() {
        const unmatched = this.getUnmatchedCards();
        if (unmatched.length < 2) return;
        
        // Encontrar una pareja válida
        const pairs = {};
        unmatched.forEach(card => {
            const emoji = card.dataset.emoji;
            if (!pairs[emoji]) pairs[emoji] = [];
            pairs[emoji].push(card);
        });
        
        // Seleccionar la primera pareja disponible
        for (const emoji in pairs) {
            if (pairs[emoji].length >= 2) {
                const [card1, card2] = pairs[emoji].slice(0, 2);
                
                // Mostrar las cartas con efecto de brillo
                card1.classList.add('glow-hint');
                card2.classList.add('glow-hint');
                card1.textContent = emoji;
                card2.textContent = emoji;
                
                setTimeout(() => {
                    card1.classList.remove('glow-hint');
                    card2.classList.remove('glow-hint');
                    if (card1.classList.contains('back')) card1.textContent = '';
                    if (card2.classList.contains('back')) card2.textContent = '';
                }, 3000);
                
                this.hintsUsed++;
                break;
            }
        }
    }
    
    /**
     * Activa el power-up de congelamiento (para el tiempo por 10 segundos)
     */
    activateFreeze() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            
            // Cambiar color del timer para indicar congelamiento
            this.timerDisplay.style.color = '#3b82f6';
            this.timerDisplay.style.fontWeight = 'bold';
            
            // Aplicar efecto visual a las cartas
            document.querySelectorAll('.card').forEach(card => {
                card.classList.add('frozen');
            });
            
            setTimeout(() => {
                this.startTimer();
                this.timerDisplay.style.color = '#1f2937';
                this.timerDisplay.style.fontWeight = 'normal';
                
                document.querySelectorAll('.card').forEach(card => {
                    card.classList.remove('frozen');
                });
            }, 10000);
        }
    }
    
    /**
     * Activa el power-up de reorganización (baraja cartas no emparejadas)
     */
    activateShuffle() {
        const unmatched = this.getUnmatchedCards();
        if (unmatched.length < 2) return;
        
        // Obtener emojis de cartas no emparejadas
        const emojis = unmatched.map(card => card.dataset.emoji);
        this.shuffleArray(emojis);
        
        // Reasignar emojis barajados
        unmatched.forEach((card, index) => {
            card.dataset.emoji = emojis[index];
        });
        
        // Efecto visual de reorganización
        this.gameBoard.classList.add('shake-distraction');
        setTimeout(() => {
            this.gameBoard.classList.remove('shake-distraction');
        }, 500);
    }
    
    /**
     * Obtiene todas las cartas no emparejadas
     * @returns {HTMLElement[]} Array de cartas no emparejadas
     */
    getUnmatchedCards() {
        return Array.from(this.gameBoard.querySelectorAll('.card:not(.matched)'));
    }
    
    /**
     * Inicia las distracciones visuales
     */
    startDistractions() {
        if (!this.distractionsEnabled) return;
        
        this.distractionInterval = setInterval(() => {
            this.createDistraction();
        }, 5000 + Math.random() * 5000); // Entre 5-10 segundos
    }
    
    /**
     * Detiene las distracciones visuales
     */
    stopDistractions() {
        if (this.distractionInterval) {
            clearInterval(this.distractionInterval);
            this.distractionInterval = null;
        }
        
        // Limpiar partículas existentes
        document.querySelectorAll('.distraction-particle').forEach(particle => {
            particle.remove();
        });
    }
    
    /**
     * Crea una distracción visual aleatoria
     */
    createDistraction() {
        const distractionTypes = ['particles', 'shake', 'blur'];
        const type = distractionTypes[Math.floor(Math.random() * distractionTypes.length)];
        
        switch (type) {
            case 'particles':
                this.createFloatingParticles();
                break;
            case 'shake':
                this.gameBoard.classList.add('shake-distraction');
                setTimeout(() => {
                    this.gameBoard.classList.remove('shake-distraction');
                }, 500);
                break;
            case 'blur':
                this.gameBoard.classList.add('blur-distraction');
                setTimeout(() => {
                    this.gameBoard.classList.remove('blur-distraction');
                }, 2000);
                break;
        }
    }
    
    /**
     * Crea partículas flotantes como distracción
     */
    createFloatingParticles() {
        const particles = ['🌟', '💫', '✨', '🎭', '🎪', '🎨', '🎭'];
        const container = this.gameBoard;
        
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'distraction-particle';
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }
    }
    
    /**
     * Muestra la transición de nivel con efectos especiales
     */
    showLevelTransition() {
        const transition = document.createElement('div');
        transition.className = 'level-transition';
        transition.innerHTML = `
            <div class="level-transition-content">
                <h2>🎯 Nivel ${this.currentLevel}</h2>
                <p>${this.levelConfig[this.currentLevel].pairs} pares - ${this.levelConfig[this.currentLevel].timeLimit}s</p>
                ${this.levelConfig[this.currentLevel].distractions ? '<p>⚠️ ¡Cuidado con las distracciones!</p>' : ''}
            </div>
        `;
        
        document.body.appendChild(transition);
        
        setTimeout(() => {
            transition.remove();
        }, 2500);
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Iniciando Juego de Memoria...');
    const game = new MemoryGame();
    console.log('✅ Juego inicializado correctamente');
});
