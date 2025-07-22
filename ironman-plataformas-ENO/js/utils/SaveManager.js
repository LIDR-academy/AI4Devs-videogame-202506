/**
 * SaveManager.js - Sistema de Guardado y Logros para Iron Man vs Ultron
 * Fase 8: Sistema de Guardado y Logros (FINAL)
 */

class SaveManager {
    constructor() {
        this.storageKey = 'ironman_ultron_save';
        this.achievementsKey = 'ironman_ultron_achievements';
        this.scoresKey = 'ironman_ultron_scores';
        this.configKey = 'ironman_ultron_config';
        
        // Datos del juego
        this.gameData = {
            totalPlayTime: 0,
            totalEnemiesKilled: 0,
            totalCoinsCollected: 0,
            totalPowerUpsUsed: 0,
            gamesPlayed: 0,
            bestScore: 0,
            lastPlayed: null
        };
        
        // Logros disponibles
        this.achievements = {
            // Logros de combate
            firstBlood: { id: 'firstBlood', name: 'Primer Sangre', description: 'Eliminar tu primer enemigo', unlocked: false, icon: '🩸' },
            hunter: { id: 'hunter', name: 'Cazador', description: 'Eliminar 10 enemigos', unlocked: false, icon: '🎯', progress: 0, target: 10 },
            exterminator: { id: 'exterminator', name: 'Exterminador', description: 'Eliminar 50 enemigos', unlocked: false, icon: '💀', progress: 0, target: 50 },
            noDamage: { id: 'noDamage', name: 'Sin Daño', description: 'Completar nivel sin recibir daño', unlocked: false, icon: '🛡️' },
            precision: { id: 'precision', name: 'Precisión', description: 'Eliminar 5 enemigos seguidos', unlocked: false, icon: '🎯', progress: 0, target: 5 },
            
            // Logros de recolección
            collector: { id: 'collector', name: 'Coleccionista', description: 'Recolectar 10 monedas', unlocked: false, icon: '💰', progress: 0, target: 10 },
            rich: { id: 'rich', name: 'Rico', description: 'Recolectar 100 monedas', unlocked: false, icon: '💎', progress: 0, target: 100 },
            powerPlayer: { id: 'powerPlayer', name: 'Power Player', description: 'Usar todos los tipos de power-ups', unlocked: false, icon: '⚡', progress: 0, target: 4 },
            efficient: { id: 'efficient', name: 'Eficiente', description: 'Recolectar 5 power-ups en una partida', unlocked: false, icon: '🚀', progress: 0, target: 5 },
            
            // Logros de tiempo
            speedster: { id: 'speedster', name: 'Velocista', description: 'Completar nivel en menos de 2 minutos', unlocked: false, icon: '⚡' },
            marathon: { id: 'marathon', name: 'Maratón', description: 'Jugar por 30 minutos', unlocked: false, icon: '🏃', progress: 0, target: 1800000 },
            persistent: { id: 'persistent', name: 'Persistente', description: 'Jugar 10 partidas', unlocked: false, icon: '🔄', progress: 0, target: 10 },
            
            // Logros de habilidad
            acrobat: { id: 'acrobat', name: 'Acróbata', description: 'Usar jet pack por 30 segundos', unlocked: false, icon: '🦅', progress: 0, target: 30000 },
            perfectShield: { id: 'perfectShield', name: 'Escudo Perfecto', description: 'Usar escudo sin recibir daño', unlocked: false, icon: '🛡️' },
            comboMaster: { id: 'comboMaster', name: 'Combo Master', description: 'Activar 3 power-ups seguidos', unlocked: false, icon: '🔥', progress: 0, target: 3 }
        };
        
        // Puntuaciones altas
        this.highScores = [];
        
        // Configuración guardada
        this.savedConfig = {
            masterVolume: 0.7,
            musicVolume: 0.5,
            sfxVolume: 0.8,
            difficulty: 1
        };
        
        // Inicializar
        this.loadAllData();
        
        console.log('💾 SaveManager inicializado');
    }
    
    // Métodos de guardado
    saveGameData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.gameData));
            console.log('💾 Datos del juego guardados');
        } catch (error) {
            console.warn('⚠️ Error guardando datos del juego:', error);
        }
    }
    
    saveAchievements() {
        try {
            localStorage.setItem(this.achievementsKey, JSON.stringify(this.achievements));
            console.log('🏆 Logros guardados');
        } catch (error) {
            console.warn('⚠️ Error guardando logros:', error);
        }
    }
    
    saveHighScores() {
        try {
            localStorage.setItem(this.scoresKey, JSON.stringify(this.highScores));
            console.log('🏆 Puntuaciones altas guardadas');
        } catch (error) {
            console.warn('⚠️ Error guardando puntuaciones:', error);
        }
    }
    
    saveConfig() {
        try {
            localStorage.setItem(this.configKey, JSON.stringify(this.savedConfig));
            console.log('⚙️ Configuración guardada');
        } catch (error) {
            console.warn('⚠️ Error guardando configuración:', error);
        }
    }
    
    // Métodos de carga
    loadGameData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                this.gameData = { ...this.gameData, ...JSON.parse(data) };
                console.log('📂 Datos del juego cargados');
            }
        } catch (error) {
            console.warn('⚠️ Error cargando datos del juego:', error);
        }
    }
    
    loadAchievements() {
        try {
            const data = localStorage.getItem(this.achievementsKey);
            if (data) {
                this.achievements = { ...this.achievements, ...JSON.parse(data) };
                console.log('🏆 Logros cargados');
            }
        } catch (error) {
            console.warn('⚠️ Error cargando logros:', error);
        }
    }
    
    loadHighScores() {
        try {
            const data = localStorage.getItem(this.scoresKey);
            if (data) {
                this.highScores = JSON.parse(data);
                console.log('🏆 Puntuaciones altas cargadas');
            }
        } catch (error) {
            console.warn('⚠️ Error cargando puntuaciones:', error);
        }
    }
    
    loadConfig() {
        try {
            const data = localStorage.getItem(this.configKey);
            if (data) {
                this.savedConfig = { ...this.savedConfig, ...JSON.parse(data) };
                console.log('⚙️ Configuración cargada');
            }
        } catch (error) {
            console.warn('⚠️ Error cargando configuración:', error);
        }
    }
    
    loadAllData() {
        this.loadGameData();
        this.loadAchievements();
        this.loadHighScores();
        this.loadConfig();
    }
    
    // Métodos de actualización de datos
    updateGameData(newData) {
        this.gameData = { ...this.gameData, ...newData };
        this.saveGameData();
    }
    
    addPlayTime(time) {
        this.gameData.totalPlayTime += time;
        this.saveGameData();
    }
    
    addEnemyKilled() {
        this.gameData.totalEnemiesKilled++;
        this.checkCombatAchievements();
        this.saveGameData();
    }
    
    addCoinCollected() {
        this.gameData.totalCoinsCollected++;
        this.checkCollectionAchievements();
        this.saveGameData();
    }
    
    addPowerUpUsed(type) {
        this.gameData.totalPowerUpsUsed++;
        this.checkPowerUpAchievements(type);
        this.saveGameData();
    }
    
    addGamePlayed() {
        this.gameData.gamesPlayed++;
        this.checkTimeAchievements();
        this.saveGameData();
    }
    
    // Sistema de puntuaciones altas
    addHighScore(score, time, enemiesKilled, coinsCollected) {
        const newScore = {
            score: score,
            date: new Date().toISOString(),
            time: time,
            enemiesKilled: enemiesKilled,
            coinsCollected: coinsCollected
        };
        
        this.highScores.push(newScore);
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 10); // Mantener solo top 10
        
        if (score > this.gameData.bestScore) {
            this.gameData.bestScore = score;
        }
        
        this.saveHighScores();
        this.saveGameData();
        
        console.log(`🏆 Nueva puntuación alta: ${score}`);
    }
    
    // Sistema de logros
    checkCombatAchievements() {
        const totalKilled = this.gameData.totalEnemiesKilled;
        
        // Primer Sangre
        if (totalKilled === 1 && !this.achievements.firstBlood.unlocked) {
            this.unlockAchievement('firstBlood');
        }
        
        // Cazador
        if (totalKilled >= 10 && !this.achievements.hunter.unlocked) {
            this.unlockAchievement('hunter');
        }
        
        // Exterminador
        if (totalKilled >= 50 && !this.achievements.exterminator.unlocked) {
            this.unlockAchievement('exterminator');
        }
        
        // Actualizar progreso
        this.achievements.hunter.progress = Math.min(totalKilled, 10);
        this.achievements.exterminator.progress = Math.min(totalKilled, 50);
    }
    
    checkCollectionAchievements() {
        const totalCoins = this.gameData.totalCoinsCollected;
        
        // Coleccionista
        if (totalCoins >= 10 && !this.achievements.collector.unlocked) {
            this.unlockAchievement('collector');
        }
        
        // Rico
        if (totalCoins >= 100 && !this.achievements.rich.unlocked) {
            this.unlockAchievement('rich');
        }
        
        // Actualizar progreso
        this.achievements.collector.progress = Math.min(totalCoins, 10);
        this.achievements.rich.progress = Math.min(totalCoins, 100);
    }
    
    checkPowerUpAchievements(type) {
        // Power Player - usar todos los tipos
        const usedTypes = new Set();
        // TODO: Implementar tracking de tipos usados
        
        // Eficiente - 5 power-ups en una partida
        // TODO: Implementar tracking por partida
    }
    
    checkTimeAchievements() {
        // Maratón
        if (this.gameData.totalPlayTime >= 1800000 && !this.achievements.marathon.unlocked) {
            this.unlockAchievement('marathon');
        }
        
        // Persistente
        if (this.gameData.gamesPlayed >= 10 && !this.achievements.persistent.unlocked) {
            this.unlockAchievement('persistent');
        }
        
        // Actualizar progreso
        this.achievements.marathon.progress = Math.min(this.gameData.totalPlayTime, 1800000);
        this.achievements.persistent.progress = Math.min(this.gameData.gamesPlayed, 10);
    }
    
    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedDate = new Date().toISOString();
            this.saveAchievements();
            
            console.log(`🏆 Logro desbloqueado: ${achievement.name}`);
            
            // Disparar evento de logro desbloqueado
            this.onAchievementUnlocked(achievement);
        }
    }
    
    onAchievementUnlocked(achievement) {
        // Crear notificación visual
        this.showAchievementNotification(achievement);
        
        // Reproducir sonido de logro
        this.playAchievementSound();
    }
    
    showAchievementNotification(achievement) {
        // Crear notificación emergente
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #FF0000, #FFD700);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-weight: bold;
            animation: slideIn 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 5px;">🏆</div>
            <div style="font-size: 16px;">${achievement.name}</div>
            <div style="font-size: 12px; opacity: 0.8;">${achievement.description}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
        
        // Añadir estilos CSS para animaciones
        if (!document.getElementById('achievement-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    playAchievementSound() {
        // Crear sonido de logro usando Web Audio API
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Sonido de celebración
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
            oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.type = 'sine';
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }
    
    // Métodos de utilidad
    getAchievementProgress(achievementId) {
        const achievement = this.achievements[achievementId];
        if (achievement && achievement.target) {
            return (achievement.progress / achievement.target) * 100;
        }
        return 0;
    }
    
    getUnlockedAchievements() {
        return Object.values(this.achievements).filter(a => a.unlocked);
    }
    
    getLockedAchievements() {
        return Object.values(this.achievements).filter(a => !a.unlocked);
    }
    
    getTotalAchievements() {
        return Object.keys(this.achievements).length;
    }
    
    getUnlockedCount() {
        return this.getUnlockedAchievements().length;
    }
    
    getProgressPercentage() {
        return (this.getUnlockedCount() / this.getTotalAchievements()) * 100;
    }
    
    // Métodos de configuración
    updateConfig(newConfig) {
        this.savedConfig = { ...this.savedConfig, ...newConfig };
        this.saveConfig();
    }
    
    getConfig() {
        return this.savedConfig;
    }
    
    // Métodos de estadísticas
    getGameStats() {
        return {
            ...this.gameData,
            achievements: {
                total: this.getTotalAchievements(),
                unlocked: this.getUnlockedCount(),
                progress: this.getProgressPercentage()
            },
            highScores: this.highScores
        };
    }
    
    // Métodos de limpieza
    clearAllData() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.achievementsKey);
        localStorage.removeItem(this.scoresKey);
        localStorage.removeItem(this.configKey);
        
        // Reinicializar datos
        this.gameData = {
            totalPlayTime: 0,
            totalEnemiesKilled: 0,
            totalCoinsCollected: 0,
            totalPowerUpsUsed: 0,
            gamesPlayed: 0,
            bestScore: 0,
            lastPlayed: null
        };
        
        this.highScores = [];
        
        console.log('🗑️ Todos los datos eliminados');
    }
}

console.log('📝 SaveManager.js cargado - Fase 8: Sistema de Guardado y Logros'); 