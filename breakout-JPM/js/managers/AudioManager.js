class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.initialized = false;
        
        this.initializeSounds();
    }
    
    initializeSounds() {
        try {
            // Create placeholder sounds (will be replaced with actual files later)
            this.sounds = {
                bounce: this.createBeepSound(440, 0.1),
                break: this.createBeepSound(660, 0.2),
                shoot: this.createBeepSound(220, 0.15),
                powerup: this.createBeepSound(880, 0.3),
                lifeLost: this.createLifeLostSound()
            };
            this.initialized = true;
            console.log('AudioManager initialized with placeholder sounds');
        } catch (error) {
            console.log('AudioManager: Using silent mode', error);
            this.initialized = false;
        }
    }
    
    createBeepSound(frequency, duration) {
        // Create a simple beep sound using Web Audio API
        return {
            play: () => {
                if (!this.initialized) return;
                
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = frequency;
                    oscillator.type = 'square';
                    
                    gainNode.gain.setValueAtTime(this.sfxVolume * 0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + duration);
                } catch (error) {
                    console.log('Error playing sound:', error);
                }
            }
        };
    }
    
    createLifeLostSound() {
        // Create a descending "sad" sound for losing life
        return {
            play: () => {
                if (!this.initialized) return;
                
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
                    oscillator.type = 'sawtooth';
                    
                    gainNode.gain.setValueAtTime(this.sfxVolume * 0.15, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.5);
                } catch (error) {
                    console.log('Error playing life lost sound:', error);
                }
            }
        };
    }
    
    playBounce() {
        if (this.sounds.bounce) {
            this.sounds.bounce.play();
        }
    }
    
    playBreak() {
        if (this.sounds.break) {
            this.sounds.break.play();
        }
    }
    
    playShoot() {
        if (this.sounds.shoot) {
            this.sounds.shoot.play();
        }
    }
    
    playPowerup() {
        if (this.sounds.powerup) {
            this.sounds.powerup.play();
        }
    }
    
    playLifeLost() {
        if (this.sounds.lifeLost) {
            this.sounds.lifeLost.play();
        }
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    }
}