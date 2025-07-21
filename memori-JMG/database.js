/**
 * DATABASE MANAGER - JUEGO DE MEMORIA
 * Sistema simplificado con LocalStorage
 */

class DatabaseManager {
    constructor() {
        this.initialized = false;
        this.storageKey = 'memoryGame_rankings';
        this.initialize();
    }

    initialize() {
        try {
            if (typeof Storage !== "undefined") {
                this.initialized = true;
                console.log('✅ Sistema de almacenamiento inicializado');
                this.migrateOldData();
            } else {
                console.error('❌ LocalStorage no está disponible');
            }
        } catch (error) {
            console.error('❌ Error inicializando almacenamiento:', error);
        }
    }

    migrateOldData() {
        const oldData = localStorage.getItem('memoryGameData');
        if (oldData && !localStorage.getItem(this.storageKey)) {
            try {
                const data = JSON.parse(oldData);
                const initialRanking = {
                    id: Date.now(),
                    nombre: 'Jugador Anterior',
                    puntuacion: data.bestScore || 0,
                    nivel: data.maxLevel || 1,
                    tiempo: 120,
                    movimientos: 14,
                    hints_usados: 0,
                    powerups_usados: 0,
                    eficiencia: ((data.bestScore || 0) / 14).toFixed(1),
                    fecha: new Date().toISOString()
                };
                
                this.addRanking(initialRanking);
                console.log('✅ Datos antiguos migrados');
            } catch (error) {
                console.warn('⚠️ Error migrando datos antiguos:', error);
            }
        }
    }

    getRankings() {
        if (!this.initialized) return [];
        
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Error obteniendo rankings:', error);
            return [];
        }
    }

    saveRankings(rankings) {
        console.log('💾 saveRankings iniciado - cantidad:', rankings.length);
        if (!this.initialized) return false;
        
        try {
            const dataToSave = JSON.stringify(rankings);
            console.log('📄 Datos serializados - tamaño:', dataToSave.length);
            
            localStorage.setItem(this.storageKey, dataToSave);
            
            // Verificar que se guardó correctamente
            const verification = localStorage.getItem(this.storageKey);
            const success = verification !== null;
            
            console.log(`✅ Verificación guardado: ${success}`);
            if (success) {
                const parsedVerification = JSON.parse(verification);
                console.log('📊 Datos verificados - cantidad:', parsedVerification.length);
            }
            
            return success;
        } catch (error) {
            console.error('❌ Error guardando rankings:', error);
            return false;
        }
    }

    addRanking(data) {
        console.log('🎯 addRanking llamado con:', data);
        
        if (!this.initialized) {
            console.warn('⚠️ Sistema no inicializado');
            return false;
        }

        const {
            nombre = 'Anónimo',
            puntuacion,
            nivel,
            tiempo,
            movimientos,
            hints_usados = 0,
            powerups_usados = 0
        } = data;

        const eficiencia = this.calculateEfficiency(puntuacion, tiempo, movimientos);
        
        const newRanking = {
            id: Date.now(),
            nombre,
            puntuacion,
            nivel,
            tiempo,
            movimientos,
            hints_usados,
            powerups_usados,
            eficiencia,
            fecha: new Date().toISOString(),
            dispositivo: this.getDeviceInfo()
        };

        console.log('📝 Nuevo ranking creado:', newRanking);

        const rankings = this.getRankings();
        console.log('📊 Rankings existentes:', rankings.length);
        
        rankings.push(newRanking);
        
        rankings.sort((a, b) => b.puntuacion - a.puntuacion);
        rankings.splice(50); // Mantener solo top 50
        
        const saved = this.saveRankings(rankings);
        console.log(`💾 Resultado del guardado: ${saved}`);
        
        if (saved) {
            console.log(`✅ Ranking añadido: ${nombre} - ${puntuacion} pts`);
        }
        
        return saved;
    }

    getTopPlayers(limit = 10) {
        const rankings = this.getRankings();
        return rankings
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .slice(0, limit);
    }
    
    /**
     * Obtiene todos los rankings sin límite
     * @returns {Array} Todos los rankings
     */
    getAllRankings() {
        if (!this.initialized) return [];
        
        const rankings = this.getRankings();
        return rankings.sort((a, b) => {
            // Primero por puntuación descendente
            if (b.puntuacion !== a.puntuacion) {
                return b.puntuacion - a.puntuacion;
            }
            // Si la puntuación es igual, por nivel descendente
            return (b.nivel || 0) - (a.nivel || 0);
        });
    }

    getTotalGames() {
        return this.getRankings().length;
    }

    getAverageTime() {
        const rankings = this.getRankings();
        if (rankings.length === 0) return 0;
        
        const totalTime = rankings.reduce((sum, ranking) => sum + (ranking.tiempo || 0), 0);
        return Math.round(totalTime / rankings.length);
    }

    calculateEfficiency(puntuacion, tiempo, movimientos) {
        if (!puntuacion || !tiempo || !movimientos) return 0;
        
        const efficiency = (puntuacion / (tiempo * movimientos)) * 1000;
        return Math.round(efficiency * 10) / 10;
    }

    getDeviceInfo() {
        return navigator.userAgent.includes('Mobile') ? 'Móvil' : 'Escritorio';
    }

    clearDatabase() {
        if (!this.initialized) return false;
        
        try {
            localStorage.removeItem(this.storageKey);
            console.log('🗑️ Base de datos limpiada');
            return true;
        } catch (error) {
            console.error('❌ Error limpiando base de datos:', error);
            return false;
        }
    }
}

// Instancia global
window.dbManager = new DatabaseManager();