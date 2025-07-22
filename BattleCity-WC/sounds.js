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

// Efecto de sonido para destruir ladrillo
function playBrickDestroySound() {
    // Sonido de ladrillo rompiéndose (tonos graves y secos)
    createTone(150, 0.1, 'square');
    setTimeout(() => createTone(120, 0.1, 'square'), 50);
    setTimeout(() => createTone(100, 0.15, 'square'), 100);
    setTimeout(() => createTone(80, 0.2, 'square'), 150);
}

// Efecto de sonido para perder vida
function playLoseLifeSound() {
    createTone(200, 0.3, 'sawtooth');
    setTimeout(() => createTone(150, 0.3, 'sawtooth'), 100);
    setTimeout(() => createTone(100, 0.3, 'sawtooth'), 200);
}

// Efecto de sonido para muerte final (última vida)
function playDeathSound() {
    // Secuencia de notas descendentes dramáticas para muerte
    const deathNotes = [
        { freq: 440, duration: 0.3 }, // A4
        { freq: 415, duration: 0.3 }, // Ab4
        { freq: 392, duration: 0.3 }, // G4
        { freq: 370, duration: 0.3 }, // F#4
        { freq: 349, duration: 0.3 }, // F4
        { freq: 330, duration: 0.3 }, // E4
        { freq: 311, duration: 0.3 }, // Eb4
        { freq: 294, duration: 0.5 }, // D4
    ];
    
    let currentTime = audioContext.currentTime;
    
    deathNotes.forEach((note, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = note.freq;
        osc.type = 'sawtooth'; // Sonido más dramático y agresivo
        
        // Envelope más dramático
        gain.gain.setValueAtTime(0, currentTime);
        gain.gain.linearRampToValueAtTime(0.4, currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
        
        osc.start(currentTime);
        osc.stop(currentTime + note.duration);
        
        currentTime += note.duration;
    });
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

// Efecto de sonido para menú START
function playStartSound() {
    // Secuencia de tonos para el botón START
    const startNotes = [440, 554, 659]; // A, C#, E
    startNotes.forEach((note, index) => {
        setTimeout(() => {
            createTone(note, 0.2, 'sine');
        }, index * 100);
    });
}

// Variables para la música de fondo
let backgroundMusic = null;
let backgroundMusicGain = null;
let isBackgroundMusicPlaying = false;

// Función para crear música de fondo
function createBackgroundMusic() {
    // Crear nodo de ganancia para controlar el volumen
    backgroundMusicGain = audioContext.createGain();
    backgroundMusicGain.gain.value = 0.1; // Volumen bajo (10%)
    backgroundMusicGain.connect(audioContext.destination);
    
    // Secuencia de notas para la música de fondo tipo guerra (loop)
    const backgroundNotes = [
        { freq: 110, duration: 0.3 }, // A2 - Nota grave
        { freq: 110, duration: 0.1 }, // A2 - Staccato
        { freq: 146, duration: 0.3 }, // D3
        { freq: 146, duration: 0.1 }, // D3 - Staccato
        { freq: 174, duration: 0.3 }, // F3
        { freq: 174, duration: 0.1 }, // F3 - Staccato
        { freq: 220, duration: 0.3 }, // A3
        { freq: 220, duration: 0.1 }, // A3 - Staccato
        { freq: 174, duration: 0.3 }, // F3
        { freq: 174, duration: 0.1 }, // F3 - Staccato
        { freq: 146, duration: 0.3 }, // D3
        { freq: 146, duration: 0.1 }, // D3 - Staccato
    ];
    
    let noteIndex = 0;
    
    function playNextNote() {
        if (!isBackgroundMusicPlaying) return;
        
        const note = backgroundNotes[noteIndex];
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(backgroundMusicGain);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'square'; // Sonido más dramático tipo guerra
        
        // Envelope más agresivo para sonido militar
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + note.duration);
        
        noteIndex = (noteIndex + 1) % backgroundNotes.length;
        
        // Programar la siguiente nota
        setTimeout(playNextNote, note.duration * 1000);
    }
    
    return playNextNote;
}

// Función para iniciar la música de fondo
function startBackgroundMusic() {
    if (isBackgroundMusicPlaying) return;
    
    isBackgroundMusicPlaying = true;
    backgroundMusic = createBackgroundMusic();
    backgroundMusic();
}

// Función para detener la música de fondo
function stopBackgroundMusic() {
    isBackgroundMusicPlaying = false;
}

// Función para activar el contexto de audio (necesario en algunos navegadores)
function initAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
} 