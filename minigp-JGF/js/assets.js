/**
 * Sistema de gestión de assets para el juego de carreras
 */

class AssetManager {
    constructor() {
        this.images = new Map();
        this.loadedCount = 0;
        this.totalCount = 0;
        this.onLoadComplete = null;
        this.onProgress = null;
        this.onError = null;
        this.loadingQueue = [];
        this.isLoading = false;
        this.errors = [];
    }

    /**
     * Carga una imagen y la almacena con una clave
     * @param {string} key - Clave para identificar la imagen
     * @param {string} src - Ruta de la imagen
     * @returns {Promise} Promise que se resuelve cuando la imagen está cargada
     */
    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                this.images.set(key, img);
                this.loadedCount++;
                this.updateProgress();
                console.log(`✅ Cargado: ${key} (${src})`);
                resolve(img);
            };

            img.onerror = () => {
                const error = new Error(`No se pudo cargar la imagen: ${src}`);
                this.errors.push({ key, src, error });
                console.error(`❌ Error cargando: ${key} (${src})`);
                reject(error);
            };

            // Intentar cargar la imagen
            img.src = src;
        });
    }

    /**
     * Carga múltiples imágenes con control de concurrencia
     * @param {Object} imageList - Objeto con clave: ruta de imagen
     * @param {number} concurrency - Número máximo de cargas simultáneas
     * @returns {Promise} Promise que se resuelve cuando todas las imágenes están cargadas
     */
    async loadImages(imageList, concurrency = 3) {
        this.totalCount = Object.keys(imageList).length;
        this.loadedCount = 0;
        this.errors = [];
        this.isLoading = true;

        console.log(`🚀 Iniciando carga de ${this.totalCount} assets...`);

        // Crear cola de carga
        const entries = Object.entries(imageList);
        const results = [];

        // Procesar en lotes según concurrencia
        for (let i = 0; i < entries.length; i += concurrency) {
            const batch = entries.slice(i, i + concurrency);
            const batchPromises = batch.map(([key, src]) =>
                this.loadImage(key, src).catch(error => ({ key, error }))
            );

            const batchResults = await Promise.allSettled(batchPromises);
            results.push(...batchResults);

            // Pequeña pausa entre lotes para no sobrecargar
            if (i + concurrency < entries.length) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        this.isLoading = false;

        // Procesar resultados
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        console.log(`📊 Carga completada: ${successful} exitosos, ${failed} fallidos`);

        if (failed > 0) {
            console.warn(`⚠️ ${failed} assets no se pudieron cargar`);
            if (this.onError) {
                this.onError(this.errors);
            }
        }

        if (this.onLoadComplete) {
            this.onLoadComplete();
        }

        return results;
    }

    /**
     * Carga assets críticos primero
     * @returns {Promise} Promise que se resuelve cuando los assets críticos están cargados
     */
    async loadCriticalAssets() {
        const criticalAssets = {
            'circuit': 'assets/circuit.jpg',
            'car': 'assets/car.gif',
            'chrono': 'assets/OSD2011/OSDCrono.png',
            'rpm_01': 'assets/OSD2011/OSDRPM01.png',
            'rpm_13': 'assets/OSD2011/OSDRPM13.png'
        };

        console.log('🎯 Cargando assets críticos...');
        return this.loadImages(criticalAssets, 2);
    }

    /**
     * Carga assets de interfaz
     * @returns {Promise} Promise que se resuelve cuando los assets de interfaz están cargados
     */
    async loadUIAssets() {
        const uiAssets = {
            // Cronómetros
            'chrono_race': 'assets/OSD2011/OSDTiempoCarrera.png',
            'times_01': 'assets/OSD2011/OSDTiempos01.png',
            'times_02': 'assets/OSD2011/OSDTiempos02.png',

            // Indicadores RPM/Velocidad
            'rpm_02': 'assets/OSD2011/OSDRPM02.png',
            'rpm_03': 'assets/OSD2011/OSDRPM03.png',
            'rpm_04': 'assets/OSD2011/OSDRPM04.png',
            'rpm_05': 'assets/OSD2011/OSDRPM05.png',
            'rpm_06': 'assets/OSD2011/OSDRPM06.png',
            'rpm_07': 'assets/OSD2011/OSDRPM07.png',
            'rpm_08': 'assets/OSD2011/OSDRPM08.png',
            'rpm_09': 'assets/OSD2011/OSDRPM09.png',
            'rpm_10': 'assets/OSD2011/OSDRPM10.png',
            'rpm_11': 'assets/OSD2011/OSDRPM11.png',
            'rpm_12': 'assets/OSD2011/OSDRPM12.png',

            // Fuentes
            'font_01': 'assets/OSD2011/OSDFont01.png',
            'font_02': 'assets/OSD2011/OSDFont02.png',
            'font_03': 'assets/OSD2011/OSDFont03.png'
        };

        console.log('🎨 Cargando assets de interfaz...');
        return this.loadImages(uiAssets, 3);
    }

    /**
     * Carga assets adicionales
     * @returns {Promise} Promise que se resuelve cuando los assets adicionales están cargados
     */
    async loadAdditionalAssets() {
        const additionalAssets = {
            // Elementos de interfaz
            'finish_race': 'assets/OSD2011/OSDFinCarrera.png',
            'semaphore': 'assets/OSD2011/Semaforo.png',
            'laps': 'assets/OSD2011/OSDVueltas.png',
            'position': 'assets/OSD2011/OSDPosicion.png',
            'positions_01': 'assets/OSD2011/OSDPosiciones01.png',
            'positions_02': 'assets/OSD2011/OSDPosiciones02.png',
            'pole': 'assets/OSD2011/OSDPole.png',

            // Sectores
            'sectors_01': 'assets/OSD2011/OSDSectores01.png',
            'sectors_02': 'assets/OSD2011/OSDSectores02.png',
            'sectors_03': 'assets/OSD2011/OSDSectores03.png',

            // Radio
            'radio_01': 'assets/OSD2011/OSDRadio01.png',
            'radio_02': 'assets/OSD2011/OSDRadio02.png',

            // Otros elementos
            'penalty': 'assets/OSD2011/OSDPenalizacion.png',
            'boxes': 'assets/OSD2011/OSDBoxes.png',
            'name': 'assets/OSD2011/OSDNombre.png',
            'name_plus': 'assets/OSD2011/OSDNombrePlus.png',

            // Diferencias de tiempo
            'diff_01': 'assets/OSD2011/OSDDiferencias01.png',
            'diff_02': 'assets/OSD2011/OSDDiferencias02.png'
        };

        console.log('🎪 Cargando assets adicionales...');
        return this.loadImages(additionalAssets, 4);
    }

    /**
     * Carga todos los assets en fases
     * @returns {Promise} Promise que se resuelve cuando todos los assets están cargados
     */
    async loadAllAssets() {
        try {
            // Fase 1: Assets críticos
            await this.loadCriticalAssets();

            // Fase 2: Assets de interfaz
            await this.loadUIAssets();

            // Fase 3: Assets adicionales (opcional)
            await this.loadAdditionalAssets();

            console.log('🎉 Todos los assets cargados exitosamente');

        } catch (error) {
            console.error('💥 Error en la carga de assets:', error);
            throw error;
        }
    }

    /**
     * Obtiene una imagen por su clave
     * @param {string} key - Clave de la imagen
     * @returns {HTMLImageElement|null} Imagen o null si no existe
     */
    getImage(key) {
        return this.images.get(key) || null;
    }

    /**
     * Verifica si una imagen está cargada
     * @param {string} key - Clave de la imagen
     * @returns {boolean} True si la imagen está cargada
     */
    hasImage(key) {
        return this.images.has(key);
    }

    /**
     * Obtiene el progreso de carga (0-100)
     * @returns {number} Porcentaje de carga
     */
    getProgress() {
        if (this.totalCount === 0) return 100;
        return Math.round((this.loadedCount / this.totalCount) * 100);
    }

    /**
     * Actualiza el progreso de carga
     */
    updateProgress() {
        const progress = this.getProgress();
        const text = `Cargando assets... ${this.loadedCount}/${this.totalCount}`;

        if (this.onProgress) {
            this.onProgress(progress, text);
        }

        // Actualizar UI
        if (window.GameUtils && window.GameUtils.ScreenUtils) {
            window.GameUtils.ScreenUtils.updateLoadingProgress(progress, text);
        }
    }

    /**
     * Verifica si todos los assets están cargados
     * @returns {boolean} True si todos los assets están cargados
     */
    isLoaded() {
        return this.loadedCount === this.totalCount && !this.isLoading;
    }

    /**
     * Obtiene información de carga
     * @returns {Object} Información de carga
     */
    getLoadInfo() {
        return {
            loaded: this.loadedCount,
            total: this.totalCount,
            progress: this.getProgress(),
            isLoading: this.isLoading,
            errors: this.errors.length
        };
    }

    /**
     * Limpia todos los assets cargados
     */
    clear() {
        this.images.clear();
        this.loadedCount = 0;
        this.totalCount = 0;
        this.errors = [];
        this.isLoading = false;
    }

    /**
     * Precalienta imágenes para mejor rendimiento
     * @param {Array<string>} keys - Claves de las imágenes a precalentar
     */
    preloadImages(keys) {
        keys.forEach(key => {
            const img = this.getImage(key);
            if (img) {
                // Crear un canvas temporal para forzar el renderizado
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            }
        });
    }
}

// Definir la lista de assets del juego
const GAME_ASSETS = {
    // Circuito
    'circuit': 'assets/circuit.jpg',

    // Coche del jugador
    'car': 'assets/car.gif',

    // Cronómetros
    'chrono': 'assets/OSD2011/OSDCrono.png',
    'chrono_race': 'assets/OSD2011/OSDTiempoCarrera.png',
    'times_01': 'assets/OSD2011/OSDTiempos01.png',
    'times_02': 'assets/OSD2011/OSDTiempos02.png',

    // Indicadores RPM/Velocidad
    'rpm_01': 'assets/OSD2011/OSDRPM01.png',
    'rpm_02': 'assets/OSD2011/OSDRPM02.png',
    'rpm_03': 'assets/OSD2011/OSDRPM03.png',
    'rpm_04': 'assets/OSD2011/OSDRPM04.png',
    'rpm_05': 'assets/OSD2011/OSDRPM05.png',
    'rpm_06': 'assets/OSD2011/OSDRPM06.png',
    'rpm_07': 'assets/OSD2011/OSDRPM07.png',
    'rpm_08': 'assets/OSD2011/OSDRPM08.png',
    'rpm_09': 'assets/OSD2011/OSDRPM09.png',
    'rpm_10': 'assets/OSD2011/OSDRPM10.png',
    'rpm_11': 'assets/OSD2011/OSDRPM11.png',
    'rpm_12': 'assets/OSD2011/OSDRPM12.png',
    'rpm_13': 'assets/OSD2011/OSDRPM13.png',

    // Fuentes
    'font_01': 'assets/OSD2011/OSDFont01.png',
    'font_02': 'assets/OSD2011/OSDFont02.png',
    'font_03': 'assets/OSD2011/OSDFont03.png',

    // Elementos de interfaz
    'finish_race': 'assets/OSD2011/OSDFinCarrera.png',
    'semaphore': 'assets/OSD2011/Semaforo.png',
    'laps': 'assets/OSD2011/OSDVueltas.png',
    'position': 'assets/OSD2011/OSDPosicion.png',
    'positions_01': 'assets/OSD2011/OSDPosiciones01.png',
    'positions_02': 'assets/OSD2011/OSDPosiciones02.png',
    'pole': 'assets/OSD2011/OSDPole.png',

    // Sectores
    'sectors_01': 'assets/OSD2011/OSDSectores01.png',
    'sectors_02': 'assets/OSD2011/OSDSectores02.png',
    'sectors_03': 'assets/OSD2011/OSDSectores03.png',

    // Radio
    'radio_01': 'assets/OSD2011/OSDRadio01.png',
    'radio_02': 'assets/OSD2011/OSDRadio02.png',

    // Otros elementos
    'penalty': 'assets/OSD2011/OSDPenalizacion.png',
    'boxes': 'assets/OSD2011/OSDBoxes.png',
    'name': 'assets/OSD2011/OSDNombre.png',
    'name_plus': 'assets/OSD2011/OSDNombrePlus.png',

    // Diferencias de tiempo
    'diff_01': 'assets/OSD2011/OSDDiferencias01.png',
    'diff_02': 'assets/OSD2011/OSDDiferencias02.png'
};

// Configuración de sprites RPM para diferentes velocidades
const RPM_CONFIG = {
    // Velocidad baja (marcha 1)
    low: ['rpm_01', 'rpm_02', 'rpm_03'],

    // Velocidad media-baja (marcha 2)
    mediumLow: ['rpm_04', 'rpm_05', 'rpm_06'],

    // Velocidad media (marcha 3)
    medium: ['rpm_07', 'rpm_08', 'rpm_09'],

    // Velocidad media-alta (marcha 4)
    mediumHigh: ['rpm_10', 'rpm_11'],

    // Velocidad alta (marcha 5-6)
    high: ['rpm_12', 'rpm_13']
};

// Función para obtener el sprite RPM según la velocidad
function getRpmSprite(speed, maxSpeed) {
    const speedPercentage = speed / maxSpeed;

    if (speedPercentage < 0.2) {
        return RPM_CONFIG.low[Math.floor(speedPercentage * 15) % RPM_CONFIG.low.length];
    } else if (speedPercentage < 0.4) {
        return RPM_CONFIG.mediumLow[Math.floor((speedPercentage - 0.2) * 15) % RPM_CONFIG.mediumLow.length];
    } else if (speedPercentage < 0.6) {
        return RPM_CONFIG.medium[Math.floor((speedPercentage - 0.4) * 15) % RPM_CONFIG.medium.length];
    } else if (speedPercentage < 0.8) {
        return RPM_CONFIG.mediumHigh[Math.floor((speedPercentage - 0.6) * 10) % RPM_CONFIG.mediumHigh.length];
    } else {
        return RPM_CONFIG.high[Math.floor((speedPercentage - 0.8) * 10) % RPM_CONFIG.high.length];
    }
}

// Función para obtener la marcha según la velocidad
function getGear(speed, maxSpeed) {
    const speedPercentage = speed / maxSpeed;

    if (speedPercentage < 0.2) return 1;
    if (speedPercentage < 0.4) return 2;
    if (speedPercentage < 0.6) return 3;
    if (speedPercentage < 0.8) return 4;
    return 5;
}

// Crear instancia global del AssetManager
const assetManager = new AssetManager();

// Exportar funciones y objetos globalmente
window.AssetManager = AssetManager;
window.GAME_ASSETS = GAME_ASSETS;
window.RPM_CONFIG = RPM_CONFIG;
window.getRpmSprite = getRpmSprite;
window.getGear = getGear;
window.assetManager = assetManager; 