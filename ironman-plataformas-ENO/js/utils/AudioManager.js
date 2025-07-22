/**
 * AudioManager.js - Sistema de Audio para Iron Man vs Ultron
 * Fase 6: Efectos de Sonido y Música
 */

class AudioManager {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        
        // Configuración de volumen
        this.masterVolume = 0.7;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.8;
        
        // Estados
        this.isMuted = false;
        this.isMusicMuted = false;
        this.isSfxMuted = false;
        
        // Inicializar sistema de audio
        this.init();
        
        console.log('🎵 AudioManager inicializado');
    }
    
    init() {
        try {
            // Crear contexto de audio
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            
            // Crear nodos de ganancia
            this.masterGain = this.context.createGain();
            this.musicGain = this.context.createGain();
            this.sfxGain = this.context.createGain();
            
            // Configurar conexiones
            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            this.masterGain.connect(this.context.destination);
            
            // Configurar volúmenes iniciales
            this.setMasterVolume(this.masterVolume);
            this.setMusicVolume(this.musicVolume);
            this.setSfxVolume(this.sfxVolume);
            
            console.log('✅ Sistema de audio Web Audio API configurado');
        } catch (error) {
            console.warn('⚠️ Error inicializando audio:', error);
            this.createFallbackAudio();
        }
    }
    
    createFallbackAudio() {
        // Fallback para navegadores sin Web Audio API
        console.log('🔄 Usando sistema de audio fallback');
        this.useFallback = true;
    }
    
    // Métodos de control de volumen
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.context.currentTime);
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVolume, this.context.currentTime);
        }
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGain) {
            this.sfxGain.gain.setValueAtTime(this.isSfxMuted ? 0 : this.sfxVolume, this.context.currentTime);
        }
    }
    
    // Métodos de mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.setMasterVolume(this.masterVolume);
    }
    
    toggleMusicMute() {
        this.isMusicMuted = !this.isMusicMuted;
        this.setMusicVolume(this.musicVolume);
    }
    
    toggleSfxMute() {
        this.isSfxMuted = !this.isSfxMuted;
        this.setSfxVolume(this.sfxVolume);
    }
    
    // Efectos de sonido procedurales
    playLaserSound() {
        if (!this.context || this.isSfxMuted) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        // Configurar sonido de láser
        oscillator.frequency.setValueAtTime(800, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.context.currentTime + 0.1);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
        
        console.log('💥 Sonido de láser reproducido');
    }
    
    playExplosionSound() {
        if (!this.context || this.isSfxMuted) return;
        
        const bufferSize = this.context.sampleRate * 0.5; // 0.5 segundos
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generar ruido de explosión
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }
        
        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();
        
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        gainNode.gain.setValueAtTime(0.5, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
        
        source.start(this.context.currentTime);
        
        console.log('💥 Sonido de explosión reproducido');
    }
    
    playJetSound() {
        if (!this.context || this.isSfxMuted) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        const filter = this.context.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        // Configurar sonido de jet
        oscillator.frequency.setValueAtTime(200, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, this.context.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.context.currentTime);
        
        gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.3);
        
        console.log('🚀 Sonido de jet reproducido');
    }
    
    playCoinSound() {
        if (!this.context || this.isSfxMuted) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        // Configurar sonido de moneda
        oscillator.frequency.setValueAtTime(800, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.context.currentTime + 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
        
        console.log('💰 Sonido de moneda reproducido');
    }
    
    playPowerUpSound(type) {
        if (!this.context || this.isSfxMuted) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        // Configurar según el tipo de power-up
        let frequency = 600;
        let duration = 0.2;
        
        switch (type) {
            case 'shield':
                frequency = 400;
                break;
            case 'speed':
                frequency = 800;
                break;
            case 'damage':
                frequency = 1000;
                break;
            case 'jetpack':
                frequency = 500;
                break;
        }
        
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.context.currentTime + duration);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
        
        console.log(`⚡ Sonido de power-up ${type} reproducido`);
    }
    
    playDamageSound() {
        if (!this.context || this.isSfxMuted) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        // Configurar sonido de daño más suave
        oscillator.frequency.setValueAtTime(400, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, this.context.currentTime + 0.1);
        oscillator.type = 'sine'; // Cambiado de 'square' a 'sine' para sonido más suave
        
        gainNode.gain.setValueAtTime(0.2, this.context.currentTime); // Volumen reducido
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
        
        console.log('💥 Sonido de daño suave reproducido');
    }
    
    // Música de fondo procedural
    startBackgroundMusic() {
        if (!this.context || this.isMusicMuted) return;
        
        // Crear música procedural épica
        this.createEpicMusic();
        
        console.log('🎼 Música de fondo iniciada');
    }
    
    createEpicMusic() {
        // Crear capas de música épica
        this.createBassLayer();
        this.createMelodyLayer();
        this.createPercussionLayer();
    }
    
    createBassLayer() {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.musicGain);
        
        // Bass épico
        oscillator.frequency.setValueAtTime(60, this.context.currentTime);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
        
        oscillator.start(this.context.currentTime);
        
        // Patrón de bass
        this.createBassPattern(oscillator, gainNode);
    }
    
    createBassPattern(oscillator, gainNode) {
        const bassNotes = [60, 65, 67, 72];
        let noteIndex = 0;
        
        const playNote = () => {
            if (this.isMusicMuted) return;
            
            const note = bassNotes[noteIndex];
            oscillator.frequency.setValueAtTime(note, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.05, this.context.currentTime + 0.5);
            
            noteIndex = (noteIndex + 1) % bassNotes.length;
            
            setTimeout(playNote, 1000);
        };
        
        playNote();
    }
    
    createMelodyLayer() {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.musicGain);
        
        oscillator.frequency.setValueAtTime(240, this.context.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.05, this.context.currentTime);
        
        oscillator.start(this.context.currentTime);
        
        console.log('🎵 Capa de melodía creada');
    }
    
    createPercussionLayer() {
        // Percusión procedural
        const playDrum = () => {
            if (this.isMusicMuted) return;
            
            this.playDrumSound();
            setTimeout(playDrum, 2000);
        };
        
        playDrum();
    }
    
    playDrumSound() {
        const bufferSize = this.context.sampleRate * 0.1;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.05));
        }
        
        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();
        
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.musicGain);
        
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        source.start(this.context.currentTime);
    }
    
    // Métodos de utilidad
    resumeAudioContext() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
            console.log('🎵 Contexto de audio resumido');
        }
    }
    
    getAudioState() {
        return {
            masterVolume: this.masterVolume,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            isMuted: this.isMuted,
            isMusicMuted: this.isMusicMuted,
            isSfxMuted: this.isSfxMuted,
            contextState: this.context ? this.context.state : 'unavailable'
        };
    }
}

console.log('📝 AudioManager.js cargado - Fase 6: Sistema de Audio'); 