// Sistema de efectos de sonido para GalaxyGT

// Crear contexto de audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Función para crear un tono simple
function createTone(frequency, duration, type = 'square') {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    // Envelope para el sonido
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Efecto de sonido para disparo del jugador
function playPlayerShootSound() {
    createTone(800, 0.1, 'square');
}

// Efecto de sonido para destruir enemigo
function playEnemyDestroySound() {
    createTone(400, 0.2, 'sawtooth');
    setTimeout(() => createTone(600, 0.15, 'sawtooth'), 50);
}

// Efecto de sonido para perder vida
function playLoseLifeSound() {
    createTone(200, 0.3, 'sawtooth');
    setTimeout(() => createTone(150, 0.3, 'sawtooth'), 100);
    setTimeout(() => createTone(100, 0.3, 'sawtooth'), 200);
}

// Efecto de sonido para victoria
function playVictorySound() {
    // Secuencia de tonos ascendentes para victoria
    const victoryNotes = [523, 659, 784, 1047, 1319]; // C, E, G, C, E
    victoryNotes.forEach((note, index) => {
        setTimeout(() => {
            createTone(note, 0.3, 'sine');
        }, index * 200);
    });
}

// Función para activar el contexto de audio (necesario en algunos navegadores)
function initAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
} 