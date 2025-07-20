/**
 * DATABASE MANAGER - JUEGO DE MEMORIA
 * Sistema de ranking con SQL.js para estadísticas avanzadas
 * Autor: GitHub Copilot
 * Fecha: Julio 2025
 */

class DatabaseManager {
    constructor() {
        this.db = null;
        this.initialized = false;
        this.fallbackStorage = 'memoryGame_fallback';
    }

    /**
     * Inicializa la base de datos SQL.js
     */
    async initialize() {
        try {
            // Cargar SQL.js desde CDN
            const SQL = await this.loadSQLJS();
            
            // Intentar cargar base de datos existente o crear nueva
            const savedDB = localStorage.getItem('memoryGame_database');
            if (savedDB) {
                const uInt8Array = new Uint8Array(JSON.parse(savedDB));
                this.db = new SQL.Database(uInt8Array);
            } else {
                this.db = new SQL.Database();
                this.createTables();
                this.migrateOldData();
            }
            
            this.initialized = true;
            console.log('✅ Base de datos SQLite inicializada correctamente');
            
        } catch (error) {
            console.warn('⚠️ Error inicializando SQLite, usando fallback:', error);
            this.initialized = false;
            this.useFallbackStorage();
        }
    }

    /**
     * Carga la librería SQL.js dinámicamente
     */
    async loadSQLJS() {
        return new Promise((resolve, reject) => {
            if (window.SQL) {
                resolve(window.SQL);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
            script.onload = () => {
                window.initSqlJs({
                    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
                }).then(SQL => {
                    window.SQL = SQL;
                    resolve(SQL);
                }).catch(reject);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Crea las tablas necesarias
     */
    createTables() {
        const createRankingsTable = `
            CREATE TABLE IF NOT EXISTS rankings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL DEFAULT 'Anónimo',
                puntuacion INTEGER NOT NULL,
                nivel INTEGER NOT NULL,
                tiempo INTEGER NOT NULL,
                movimientos INTEGER NOT NULL,
                hints_usados INTEGER DEFAULT 0,
                powerups_usados INTEGER DEFAULT 0,
                eficiencia REAL DEFAULT 0,
                fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                dispositivo TEXT DEFAULT 'Desconocido',
                version TEXT DEFAULT '1.0'
            );
        `;

        const createSessionsTable = `
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                jugador TEXT NOT NULL,
                fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
                fecha_fin DATETIME,
                niveles_completados INTEGER DEFAULT 0,
                puntuacion_total INTEGER DEFAULT 0,
                tiempo_total INTEGER DEFAULT 0,
                partidas_jugadas INTEGER DEFAULT 0
            );
        `;

        const createIndices = `
            CREATE INDEX IF NOT EXISTS idx_puntuacion ON rankings(puntuacion DESC);
            CREATE INDEX IF NOT EXISTS idx_nivel ON rankings(nivel);
            CREATE INDEX IF NOT EXISTS idx_fecha ON rankings(fecha DESC);
            CREATE INDEX IF NOT EXISTS idx_jugador ON rankings(nombre);
            CREATE INDEX IF NOT EXISTS idx_eficiencia ON rankings(eficiencia DESC);
        `;

        this.db.exec(createRankingsTable);
        this.db.exec(createSessionsTable);
        this.db.exec(createIndices);
        
        console.log('✅ Tablas creadas correctamente');
    }

    /**
     * Migra datos antiguos de localStorage
     */
    migrateOldData() {
        try {
            const oldData = localStorage.getItem('memoryGameData');
            if (oldData) {
                const data = JSON.parse(oldData);
                
                // Crear registro inicial con datos antiguos
                this.addRanking({
                    nombre: 'Jugador Anterior',
                    puntuacion: data.bestScore || 0,
                    nivel: data.maxLevel || 1,
                    tiempo: 120,
                    movimientos: 14,
                    hints_usados: 0,
                    powerups_usados: 0
                });
                
                console.log('✅ Datos antiguos migrados');
            }
        } catch (error) {
            console.warn('⚠️ Error migrando datos antiguos:', error);
        }
    }

    /**
     * Guarda la base de datos en localStorage
     */
    save() {
        if (!this.initialized) return;
        
        try {
            const data = this.db.export();
            const buffer = Array.from(data);
            localStorage.setItem('memoryGame_database', JSON.stringify(buffer));
        } catch (error) {
            console.warn('⚠️ Error guardando base de datos:', error);
        }
    }

    /**
     * Añade un nuevo ranking
     */
    addRanking(data) {
        if (!this.initialized) {
            this.addToFallback(data);
            return;
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
        const dispositivo = this.getDeviceInfo();

        const query = `
            INSERT INTO rankings (
                nombre, puntuacion, nivel, tiempo, movimientos, 
                hints_usados, powerups_usados, eficiencia, dispositivo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        this.db.run(query, [
            nombre, puntuacion, nivel, tiempo, movimientos,
            hints_usados, powerups_usados, eficiencia, dispositivo
        ]);

        this.save();
        console.log(`✅ Ranking añadido: ${nombre} - ${puntuacion} pts`);
    }

    /**
     * Obtiene el top rankings global
     */
    getTopRankings(limit = 10) {
        if (!this.initialized) {
            return this.getFromFallback();
        }

        const query = `
            SELECT * FROM rankings 
            ORDER BY puntuacion DESC, tiempo ASC 
            LIMIT ?
        `;

        const stmt = this.db.prepare(query);
        const results = [];
        
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        
        stmt.free();
        return results;
    }

    /**
     * Obtiene rankings por nivel
     */
    getRankingsByLevel(nivel, limit = 5) {
        if (!this.initialized) return [];

        const query = `
            SELECT * FROM rankings 
            WHERE nivel = ?
            ORDER BY puntuacion DESC, tiempo ASC 
            LIMIT ?
        `;

        const stmt = this.db.prepare(query);
        stmt.bind([nivel, limit]);
        const results = [];
        
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        
        stmt.free();
        return results;
    }

    /**
     * Obtiene estadísticas avanzadas
     */
    getAdvancedStats() {
        if (!this.initialized) return this.getFallbackStats();

        const queries = {
            totalPartidas: "SELECT COUNT(*) as total FROM rankings",
            mejorPuntuacion: "SELECT MAX(puntuacion) as mejor FROM rankings",
            promedioTiempo: "SELECT AVG(tiempo) as promedio FROM rankings",
            promedioMovimientos: "SELECT AVG(movimientos) as promedio FROM rankings",
            mejorEficiencia: "SELECT MAX(eficiencia) as mejor FROM rankings",
            jugadorMasActivo: `
                SELECT nombre, COUNT(*) as partidas 
                FROM rankings 
                GROUP BY nombre 
                ORDER BY partidas DESC 
                LIMIT 1
            `,
            distribucionNiveles: `
                SELECT nivel, COUNT(*) as cantidad 
                FROM rankings 
                GROUP BY nivel 
                ORDER BY nivel
            `,
            progresoTemporal: `
                SELECT DATE(fecha) as dia, COUNT(*) as partidas, AVG(puntuacion) as promedio
                FROM rankings 
                WHERE fecha >= date('now', '-7 days')
                GROUP BY DATE(fecha)
                ORDER BY dia
            `
        };

        const stats = {};
        
        for (const [key, query] of Object.entries(queries)) {
            try {
                const stmt = this.db.prepare(query);
                if (key === 'distribucionNiveles' || key === 'progresoTemporal') {
                    const results = [];
                    while (stmt.step()) {
                        results.push(stmt.getAsObject());
                    }
                    stats[key] = results;
                } else {
                    stmt.step();
                    stats[key] = stmt.getAsObject();
                }
                stmt.free();
            } catch (error) {
                console.warn(`Error en consulta ${key}:`, error);
                stats[key] = null;
            }
        }

        return stats;
    }

    /**
     * Busca rankings por nombre de jugador
     */
    searchByPlayer(nombre) {
        if (!this.initialized) return [];

        const query = `
            SELECT * FROM rankings 
            WHERE nombre LIKE ? 
            ORDER BY puntuacion DESC
            LIMIT 20
        `;

        const stmt = this.db.prepare(query);
        stmt.bind([`%${nombre}%`]);
        const results = [];
        
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        
        stmt.free();
        return results;
    }

    /**
     * Calcula la eficiencia del jugador
     */
    calculateEfficiency(puntuacion, tiempo, movimientos) {
        return parseFloat(((puntuacion / (tiempo + movimientos)) * 100).toFixed(2));
    }

    /**
     * Obtiene información del dispositivo
     */
    getDeviceInfo() {
        const ua = navigator.userAgent;
        if (/Mobile|Android|iPhone|iPad/.test(ua)) return 'Móvil';
        if (/Tablet/.test(ua)) return 'Tablet';
        return 'Escritorio';
    }

    /**
     * Sistema de fallback usando localStorage
     */
    useFallbackStorage() {
        console.log('📦 Usando localStorage como fallback');
    }

    addToFallback(data) {
        try {
            const stored = localStorage.getItem(this.fallbackStorage);
            const rankings = stored ? JSON.parse(stored) : [];
            
            rankings.push({
                ...data,
                id: Date.now(),
                fecha: new Date().toISOString(),
                eficiencia: this.calculateEfficiency(data.puntuacion, data.tiempo, data.movimientos)
            });

            rankings.sort((a, b) => b.puntuacion - a.puntuacion);
            localStorage.setItem(this.fallbackStorage, JSON.stringify(rankings));
        } catch (error) {
            console.warn('Error en fallback storage:', error);
        }
    }

    getFromFallback() {
        try {
            const stored = localStorage.getItem(this.fallbackStorage);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Error leyendo fallback storage:', error);
            return [];
        }
    }

    getFallbackStats() {
        const data = this.getFromFallback();
        if (data.length === 0) return {};

        return {
            totalPartidas: { total: data.length },
            mejorPuntuacion: { mejor: Math.max(...data.map(r => r.puntuacion)) },
            promedioTiempo: { promedio: data.reduce((a, b) => a + b.tiempo, 0) / data.length },
            promedioMovimientos: { promedio: data.reduce((a, b) => a + b.movimientos, 0) / data.length }
        };
    }

    /**
     * Limpia la base de datos (solo para desarrollo)
     */
    clearDatabase() {
        if (!this.initialized) {
            localStorage.removeItem(this.fallbackStorage);
            return;
        }

        this.db.exec('DELETE FROM rankings');
        this.db.exec('DELETE FROM sessions');
        this.save();
        console.log('🗑️ Base de datos limpiada');
    }
}

// Instancia global del gestor de base de datos
window.dbManager = new DatabaseManager();
