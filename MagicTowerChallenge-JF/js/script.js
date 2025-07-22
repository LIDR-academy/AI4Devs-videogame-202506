document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const langBtn = document.getElementById('lang-btn');
    const languageModal = document.getElementById('language-modal');
    const closeLanguageBtn = document.getElementById('close-language-btn');
    const langEnBtn = document.getElementById('lang-en-btn');
    const langEsBtn = document.getElementById('lang-es-btn');
    const gameBoard = document.getElementById('game-board');
    const levelDisplay = document.getElementById('level-display');
    const movesDisplay = document.getElementById('moves-display');
    const bestMovesDisplay = document.getElementById('best-moves-display');
    const hintBtn = document.getElementById('hint-btn');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const resetBtn = document.getElementById('reset-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const instructionsBtn = document.getElementById('instructions-btn');
    const instructionsModal = document.getElementById('instructions-modal');
    const closeInstructionsBtn = document.getElementById('close-instructions-btn');

    // --- Sound Synthesis (Tone.js) ---
    const sounds = {
        select: new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 } }).toDestination(),
        place: new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 } }).toDestination(),
        error: new Tone.MonoSynth({ oscillator: { type: 'square' }, filter: { Q: 2, type: 'lowpass', rolloff: -12 }, envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 } }).toDestination(),
        cheer: new Tone.Synth({ oscillator: { type: 'fatsawtooth', count: 3, spread: 20 }, envelope: { attack: 0.01, decay: 0.4, sustain: 0.2, release: 0.4 } }).toDestination(),
    };

    // --- Localization ---
    const translations = {
        en: {
            title: "Magic Tower Challenge ✨",
            subtitle: "Move the disks to the last tower!",
            level: "Level", moves: "Moves", best: "Best",
            btn_instructions: "Instructions", btn_reset: "Reset", btn_language: "Language",
            btn_hint: "Hint", btn_undo: "Undo", btn_redo: "Redo",
            instructions_title: "How to Play",
            instructions_p1: "Welcome to the Magic Tower Challenge! The goal is to move the entire stack of disks from the starting peg to the last peg.",
            instructions_l1: "Only one disk can be moved at a time.",
            instructions_l2: "Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack or on an empty peg.",
            instructions_l3: "<strong>No larger disk may be placed on top of a smaller disk.</strong>",
            instructions_p2: "Complete the level in the fewest moves possible. Good luck! 🧠",
            language_title: "Choose a Language",
            msg_level_start: (level) => `Level ${level} - Good luck!`,
            msg_win: (level) => `Level ${level} Complete!`,
            msg_perfect_score: "Perfect score! 🎉",
            msg_moves_taken: (moves) => `You took ${moves} moves.`,
            msg_all_levels_complete: "You've completed all levels! You're a true Master! 🏆",
            msg_invalid_top_disk: "Oops! Only the top disk can be moved.",
            msg_invalid_size: "A larger disk cannot be placed on a smaller one.",
        },
        es: {
            title: "Desafío de la Torre Mágica ✨",
            subtitle: "¡Mueve los discos a la última torre!",
            level: "Nivel", moves: "Movimientos", best: "Óptimo",
            btn_instructions: "Instrucciones", btn_reset: "Reiniciar", btn_language: "Idioma",
            btn_hint: "Pista", btn_undo: "Deshacer", btn_redo: "Rehacer",
            instructions_title: "Cómo Jugar",
            instructions_p1: "¡Bienvenido al Desafío de la Torre Mágica! El objetivo es mover toda la pila de discos desde la clavija inicial hasta la última.",
            instructions_l1: "Solo se puede mover un disco a la vez.",
            instructions_l2: "Cada movimiento consiste en tomar el disco superior de una de las pilas y colocarlo sobre otra pila o en una clavija vacía.",
            instructions_l3: "<strong>No se puede colocar un disco más grande sobre uno más pequeño.</strong>",
            instructions_p2: "Completa el nivel en la menor cantidad de movimientos posible. ¡Buena suerte! 🧠",
            language_title: "Elige un Idioma",
            msg_level_start: (level) => `Nivel ${level} - ¡Buena suerte!`,
            msg_win: (level) => `¡Nivel ${level} completado!`,
            msg_perfect_score: "¡Puntuación perfecta! 🎉",
            msg_moves_taken: (moves) => `Lo hiciste en ${moves} movimientos.`,
            msg_all_levels_complete: "¡Has completado todos los niveles! ¡Eres un verdadero Maestro! 🏆",
            msg_invalid_top_disk: "¡Uy! Solo se puede mover el disco superior.",
            msg_invalid_size: "Un disco grande no puede ir sobre uno pequeño.",
        }
    };
    
    // --- Game State Variables ---
    let currentLanguage = 'en';
    let pegs = [[], [], []];
    let currentLevel = 1;
    let numDisks = 3;
    let moveCount = 0;
    let selectedDisk = null;
    let moveHistory = [];
    let redoStack = [];
    let hintsLeft = 3;
    const MAX_LEVEL = 7;
    let isSoundEnabled = false;

    /**
     * Sets the language for all UI text elements.
     */
    function setLanguage(lang) {
        currentLanguage = lang;
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.dataset.key;
            if (translations[lang][key]) {
                if (key === 'btn_hint') {
                    // This is a more robust way to update the hint button text
                    elem.innerHTML = `${translations[lang][key]} (<span id="hint-count">${hintsLeft}</span>)`;
                } else {
                    elem.innerHTML = translations[lang][key];
                }
            }
        });
    }

    /**
     * Initializes or resets the game to a specific level.
     */
    function initGame(level) {
        currentLevel = level;
        numDisks = level + 2;
        moveCount = 0;
        hintsLeft = 3;
        moveHistory = [];
        redoStack = [];
        
        pegs = [[], [], []];
        for (let i = numDisks; i > 0; i--) {
            pegs[0].push(i);
        }

        renderGame();
        updateUI();
        setLanguage(currentLanguage);
        showMessage(translations[currentLanguage].msg_level_start(currentLevel), 'info');
    }

    function renderGame() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const pegElement = document.createElement('div');
            pegElement.className = 'peg';
            pegElement.dataset.pegId = i;
            pegElement.addEventListener('click', () => handlePegClick(i));
            pegs[i].forEach(diskSize => {
                const diskElement = createDiskElement(diskSize);
                pegElement.appendChild(diskElement);
            });
            gameBoard.appendChild(pegElement);
        }
    }
    function createDiskElement(diskSize) {
        const diskElement = document.createElement('div');
        diskElement.className = 'disk';
        diskElement.dataset.size = diskSize;
        diskElement.style.width = `${30 + (diskSize * 10)}%`;
        diskElement.style.backgroundColor = `var(--disk-color-${diskSize})`;
        diskElement.textContent = diskSize;
        diskElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const pegId = parseInt(diskElement.parentElement.dataset.pegId);
            handleDiskClick(diskElement, pegId);
        });
        return diskElement;
    }
    function updateUI() {
        levelDisplay.textContent = currentLevel;
        movesDisplay.textContent = moveCount;
        bestMovesDisplay.textContent = Math.pow(2, numDisks) - 1;
        const hintCountSpan = document.getElementById('hint-count');
        if (hintCountSpan) hintCountSpan.textContent = hintsLeft;
        undoBtn.disabled = moveHistory.length === 0;
        redoBtn.disabled = redoStack.length === 0;
        hintBtn.disabled = hintsLeft === 0;
    }

    // --- Event Handlers ---
    document.body.addEventListener('click', () => {
        if (!isSoundEnabled) {
            Tone.start();
            isSoundEnabled = true;
        }
    }, { once: true });

    // Language Modal Logic
    langBtn.addEventListener('click', () => languageModal.classList.remove('hidden'));
    closeLanguageBtn.addEventListener('click', () => languageModal.classList.add('hidden'));
    langEnBtn.addEventListener('click', () => {
        setLanguage('en');
        languageModal.classList.add('hidden');
    });
    langEsBtn.addEventListener('click', () => {
        setLanguage('es');
        languageModal.classList.add('hidden');
    });

    // Instructions Modal Logic
    instructionsBtn.addEventListener('click', () => instructionsModal.classList.remove('hidden'));
    closeInstructionsBtn.addEventListener('click', () => instructionsModal.classList.add('hidden'));

    // Other buttons
    resetBtn.addEventListener('click', () => initGame(currentLevel));
    hintBtn.addEventListener('click', applyHint);
    undoBtn.addEventListener('click', undoMove);
    redoBtn.addEventListener('click', redoMove);
    
    function handleDiskClick(diskElement, pegId) {
        const diskSize = parseInt(diskElement.dataset.size);
        const peg = pegs[pegId];
        if (peg[peg.length - 1] !== diskSize) {
            if(isSoundEnabled) sounds.error.triggerAttackRelease('C2', '0.2s');
            showMessage(translations[currentLanguage].msg_invalid_top_disk, 'error');
            diskElement.classList.add('wobble');
            setTimeout(() => diskElement.classList.remove('wobble'), 500);
            return;
        }
        if (selectedDisk === diskElement) {
            selectedDisk.classList.remove('selected');
            selectedDisk = null;
        } else {
            if (selectedDisk) {
                selectedDisk.classList.remove('selected');
            }
            if(isSoundEnabled) sounds.select.triggerAttackRelease('C4', '0.1s');
            selectedDisk = diskElement;
            selectedDisk.classList.add('selected');
        }
    }

    function handlePegClick(targetPegId) {
        if (!selectedDisk) return;
        const sourcePegId = parseInt(selectedDisk.parentElement.dataset.pegId);
        if (sourcePegId === targetPegId) {
            selectedDisk.classList.remove('selected');
            selectedDisk = null;
            return;
        }
        const diskSize = parseInt(selectedDisk.dataset.size);
        if (isValidMove(diskSize, targetPegId)) {
            animateAndMakeMove(sourcePegId, targetPegId);
        } else {
            if(isSoundEnabled) sounds.error.triggerAttackRelease('C2', '0.2s');
            showMessage(translations[currentLanguage].msg_invalid_size, 'error');
            selectedDisk.classList.add('wobble');
            setTimeout(() => selectedDisk.classList.remove('wobble'), 500);
        }
    }
    
    function isValidMove(diskSize, targetPegId) {
        const targetPeg = pegs[targetPegId];
        return targetPeg.length === 0 || diskSize < targetPeg[targetPeg.length - 1];
    }

    function animateAndMakeMove(sourcePegId, targetPegId) {
        if (!selectedDisk) return;
        const diskToMove = selectedDisk;
        const sourcePegEl = gameBoard.children[sourcePegId];
        const targetPegEl = gameBoard.children[targetPegId];
        const rectSource = sourcePegEl.getBoundingClientRect();
        const rectTarget = targetPegEl.getBoundingClientRect();
        const rectDisk = diskToMove.getBoundingClientRect();
        const dx = (rectTarget.left + rectTarget.width / 2) - (rectSource.left + rectSource.width / 2);
        diskToMove.style.position = 'absolute';
        diskToMove.style.top = `${rectDisk.top - gameBoard.getBoundingClientRect().top}px`;
        diskToMove.style.left = `${rectDisk.left - gameBoard.getBoundingClientRect().left}px`;
        gameBoard.appendChild(diskToMove);
        diskToMove.classList.remove('selected');
        requestAnimationFrame(() => {
            diskToMove.style.transform = `translateX(${dx}px)`;
            diskToMove.classList.add('moving');
        });
        diskToMove.addEventListener('animationend', () => {
             makeMove(sourcePegId, targetPegId);
        }, { once: true });
    }

    function makeMove(sourcePegId, targetPegId, isRedo = false) {
        if(isSoundEnabled) sounds.place.triggerAttackRelease('G4', '0.1s');
        const disk = pegs[sourcePegId].pop();
        pegs[targetPegId].push(disk);
        if (!isRedo) {
            moveCount++;
            moveHistory.push({ from: sourcePegId, to: targetPegId });
            redoStack = [];
        }
        selectedDisk = null;
        renderGame();
        updateUI();
        setTimeout(checkWin, 100);
    }
    
    function checkWin() {
        if (pegs[2].length === numDisks) {
            if(isSoundEnabled) {
                const now = Tone.now();
                sounds.cheer.triggerAttackRelease("C4", "8n", now);
                sounds.cheer.triggerAttackRelease("E4", "8n", now + 0.1);
                sounds.cheer.triggerAttackRelease("G4", "8n", now + 0.2);
                sounds.cheer.triggerAttackRelease("C5", "4n", now + 0.3);
            }
            const minMoves = Math.pow(2, numDisks) - 1;
            let winMessage = translations[currentLanguage].msg_win(currentLevel);
            if (moveCount === minMoves) {
                winMessage += ` ${translations[currentLanguage].msg_perfect_score}`;
            } else {
                winMessage += ` ${translations[currentLanguage].msg_moves_taken(moveCount)}`;
            }
            showMessage(winMessage, 'success');
            setTimeout(() => {
                if (currentLevel < MAX_LEVEL) {
                    initGame(currentLevel + 1);
                } else {
                    showMessage(translations[currentLanguage].msg_all_levels_complete, 'success');
                }
            }, 2500);
        }
    }

    function undoMove() {
        if (moveHistory.length === 0) return;
        const lastMove = moveHistory.pop();
        redoStack.push(lastMove);
        const disk = pegs[lastMove.to].pop();
        pegs[lastMove.from].push(disk);
        moveCount--;
        renderGame();
        updateUI();
    }
    function redoMove() {
        if (redoStack.length === 0) return;
        const nextMove = redoStack.pop();
        moveHistory.push(nextMove);
        const disk = pegs[nextMove.from].pop();
        pegs[nextMove.to].push(disk);
        moveCount++;
        renderGame();
        updateUI();
    }
    function applyHint() {
        if (hintsLeft <= 0) return;
        const optimalMove = findOptimalMove();
        if (optimalMove) {
            hintsLeft--;
            updateUI();
            const { diskElement, targetPegElement } = optimalMove;
            diskElement.classList.add('hint-highlight-disk');
            targetPegElement.classList.add('hint-highlight-peg');
            setTimeout(() => {
                diskElement.classList.remove('hint-highlight-disk');
                targetPegElement.classList.remove('hint-highlight-peg');
            }, 1500);
        }
    }
    function hanoiSolver(n, from, to, aux, moves) {
        if (n === 1) {
            moves.push({ from: from, to: to });
            return;
        }
        hanoiSolver(n - 1, from, aux, to, moves);
        moves.push({ from: from, to: to });
        hanoiSolver(n - 1, aux, to, from, moves);
    }
    function findOptimalMove() {
        const totalMoves = [];
        hanoiSolver(numDisks, 0, 2, 1, totalMoves);
        const nextMove = totalMoves[moveHistory.length];
        if(!nextMove) return null;
        const sourcePeg = pegs[nextMove.from];
        if (sourcePeg.length > 0) {
            const diskToMoveSize = sourcePeg[sourcePeg.length - 1];
            const allPegElements = document.querySelectorAll('.peg');
            const sourcePegElement = allPegElements[nextMove.from];
            const diskElement = sourcePegElement.querySelector(`.disk[data-size='${diskToMoveSize}']`);
            const targetPegElement = allPegElements[nextMove.to];
            return { diskElement, targetPegElement };
        }
        return null;
    }
    function showMessage(text, type) {
        messageText.textContent = text;
        messageBox.className = 'fixed top-[-100px] left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-lg text-white font-bold transition-all duration-500 ease-in-out';
        
        switch(type) {
            case 'success': messageBox.classList.add('bg-green-500'); break;
            case 'error': messageBox.classList.add('bg-red-500'); break;
            default: messageBox.classList.add('bg-blue-500');
        }
        messageBox.style.top = '20px';
        setTimeout(() => { messageBox.style.top = '-100px'; }, 2000);
    }

    // --- Initial Game Start ---
    initGame(currentLevel);
});