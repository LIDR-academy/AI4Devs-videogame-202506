class LevelValidator {
    constructor() {
        this.generator = new MapGenerator();
        this.originalLevels = null;
        this.adjustedLevels = null;
    }

    /**
     * Carga y analiza todos los niveles
     */
    async loadAndAnalyzeLevels() {
        try {
            const response = await fetch('./levels/levels.json');
            const levelsData = await response.json();
            this.originalLevels = levelsData;
            
            console.log("🎮 BATTLE CITY - ANÁLISIS DE MAPAS");
            console.log("=".repeat(50));
            
            // Analizar niveles originales
            const analysis = this.generator.analyzeLevels(levelsData);
            
            return analysis;
        } catch (error) {
            console.error("❌ Error cargando niveles:", error);
            return null;
        }
    }

    /**
     * Ajusta todos los niveles y muestra comparación
     */
    async adjustLevels() {
        if (!this.originalLevels) {
            console.log("❌ Primero carga los niveles con loadAndAnalyzeLevels()");
            return;
        }

        console.log("\n🔧 AJUSTANDO NIVELES...");
        console.log("=".repeat(50));
        
        this.adjustedLevels = this.generator.adjustAllLevels(this.originalLevels);
        
        // Analizar niveles ajustados
        console.log("\n📊 ANÁLISIS POST-AJUSTE:");
        console.log("-".repeat(30));
        const newAnalysis = this.generator.analyzeLevels(this.adjustedLevels);
        
        return this.adjustedLevels;
    }

    /**
     * Genera el archivo JSON con los niveles ajustados
     */
    generateAdjustedLevelsJSON() {
        if (!this.adjustedLevels) {
            console.log("❌ Primero ajusta los niveles con adjustLevels()");
            return;
        }

        const jsonString = JSON.stringify(this.adjustedLevels, null, 2);
        
        // Crear elemento para descargar
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'levels_adjusted.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log("📁 Archivo 'levels_adjusted.json' generado y descargado");
        return jsonString;
    }

    /**
     * Muestra comparación detallada antes/después
     */
    showComparison() {
        if (!this.originalLevels || !this.adjustedLevels) {
            console.log("❌ Necesitas cargar y ajustar los niveles primero");
            return;
        }

        console.log("\n📊 COMPARACIÓN ANTES/DESPUÉS:");
        console.log("=".repeat(60));
        console.log("Nivel".padEnd(20) + "Antes".padEnd(10) + "Después".padEnd(10) + "Cambio");
        console.log("-".repeat(60));

        let totalImprovement = 0;
        let adjustedCount = 0;

        for (const levelKey of Object.keys(this.originalLevels)) {
            const originalValidation = this.generator.validateMapOccupancy(this.originalLevels[levelKey]);
            const adjustedValidation = this.generator.validateMapOccupancy(this.adjustedLevels[levelKey]);
            
            const originalPerc = parseFloat(originalValidation.percentage);
            const adjustedPerc = parseFloat(adjustedValidation.percentage);
            const change = adjustedPerc - originalPerc;
            
            const originalStatus = originalValidation.isValid ? "✅" : "❌";
            const adjustedStatus = adjustedValidation.isValid ? "✅" : "❌";
            
            console.log(
                `${originalStatus} ${levelKey.padEnd(15)} ${originalPerc.toFixed(1)}%`.padEnd(25) +
                `${adjustedStatus} ${adjustedPerc.toFixed(1)}%`.padEnd(15) +
                `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
            );

            if (Math.abs(change) > 0.1) {
                adjustedCount++;
                totalImprovement += Math.abs(change);
            }
        }

        console.log("-".repeat(60));
        console.log(`📈 Niveles ajustados: ${adjustedCount}`);
        console.log(`📊 Mejora promedio: ${adjustedCount > 0 ? (totalImprovement / adjustedCount).toFixed(1) : 0}%`);
        
        // Verificar que todos están en rango
        const finalAnalysis = this.generator.analyzeLevels(this.adjustedLevels);
        if (finalAnalysis.needAdjustment === 0) {
            console.log("🎉 ¡Todos los niveles ahora están en el rango 40-50%!");
        } else {
            console.log(`⚠️  Aún quedan ${finalAnalysis.needAdjustment} niveles fuera del rango`);
        }
    }

    /**
     * Función de utilidad para ejecutar todo el proceso
     */
    async runFullProcess() {
        console.clear();
        console.log("🚀 Iniciando proceso completo de validación y ajuste...\n");
        
        // 1. Cargar y analizar
        const analysis = await this.loadAndAnalyzeLevels();
        if (!analysis) return;
        
        // 2. Si hay niveles que necesitan ajuste, proceder
        if (analysis.needAdjustment > 0) {
            await this.adjustLevels();
            this.showComparison();
            
            // 3. Preguntar si quiere generar el archivo
            const shouldGenerate = confirm("¿Quieres descargar el archivo con los niveles ajustados?");
            if (shouldGenerate) {
                this.generateAdjustedLevelsJSON();
            }
        } else {
            console.log("🎉 ¡Todos los niveles ya están en el rango correcto!");
        }
        
        return this.adjustedLevels;
    }

    /**
     * Generar niveles adicionales si se necesitan más
     */
    generateAdditionalLevels(count = 5) {
        console.log(`\n🎲 Generando ${count} niveles adicionales...\n`);
        
        const startLevel = Object.keys(this.adjustedLevels || this.originalLevels || {}).length + 1;
        const newLevels = {};
        
        for (let i = 0; i < count; i++) {
            const levelNumber = startLevel + i;
            const levelKey = `level${levelNumber}`;
            newLevels[levelKey] = this.generator.generateBalancedMap(levelNumber);
            
            console.log(`✅ ${levelKey}: ${newLevels[levelKey].occupancy}% ocupado`);
        }
        
        console.log(`\n🎮 ${count} niveles adicionales generados con ocupación 40-50%`);
        return newLevels;
    }
}

// Hacer disponible globalmente
window.LevelValidator = LevelValidator;

// Funciones de utilidad para usar en consola
window.validateLevels = async function() {
    const validator = new LevelValidator();
    return await validator.runFullProcess();
};

window.quickAnalysis = async function() {
    const validator = new LevelValidator();
    return await validator.loadAndAnalyzeLevels();
};

console.log("🛠️  LevelValidator cargado. Usa estas funciones en consola:");
console.log("   - validateLevels() : Proceso completo de validación y ajuste");
console.log("   - quickAnalysis()  : Solo análisis de niveles actuales");
console.log("   - O crea una instancia: const validator = new LevelValidator()");
