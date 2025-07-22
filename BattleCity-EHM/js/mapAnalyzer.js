// Script de análisis de mapas para Battle City
// Ejecuta este script en la consola del navegador después de cargar el juego

async function analyzeCurrentMaps() {
    console.clear();
    console.log("🎮 BATTLE CITY - ANÁLISIS DE OCUPACIÓN DE MAPAS");
    console.log("=".repeat(60));
    
    try {
        // Cargar los niveles originales
        const response = await fetch('./levels/levels.json');
        const levelsData = await response.json();
        
        // Crear instancia del generador
        const generator = new MapGenerator();
        
        console.log("📊 ANÁLISIS DE OCUPACIÓN ACTUAL:");
        console.log("-".repeat(60));
        console.log("Nivel".padEnd(25) + "Ocupación".padEnd(12) + "Elementos".padEnd(12) + "Estado");
        console.log("-".repeat(60));
        
        let totalLevels = 0;
        let validLevels = 0;
        let totalOccupancy = 0;
        let needMoreElements = 0;
        let needFewerElements = 0;
        
        for (const [levelKey, levelData] of Object.entries(levelsData)) {
            const validation = generator.validateMapOccupancy(levelData);
            const status = validation.isValid ? "✅ OK" : 
                          parseFloat(validation.percentage) < 40 ? "❌ BAJO" : "❌ ALTO";
            
            console.log(
                levelKey.padEnd(25) + 
                `${validation.percentage}%`.padEnd(12) + 
                `${validation.occupied}/676`.padEnd(12) + 
                status
            );
            
            totalLevels++;
            totalOccupancy += parseFloat(validation.percentage);
            
            if (validation.isValid) {
                validLevels++;
            } else if (parseFloat(validation.percentage) < 40) {
                needMoreElements++;
            } else {
                needFewerElements++;
            }
        }
        
        console.log("-".repeat(60));
        console.log("📈 RESUMEN DEL ANÁLISIS:");
        console.log(`📋 Total de niveles: ${totalLevels}`);
        console.log(`✅ Niveles válidos (40-50%): ${validLevels}`);
        console.log(`⬇️  Niveles con poca ocupación (<40%): ${needMoreElements}`);
        console.log(`⬆️  Niveles con mucha ocupación (>50%): ${needFewerElements}`);
        console.log(`📊 Ocupación promedio: ${(totalOccupancy / totalLevels).toFixed(1)}%`);
        console.log(`🎯 Objetivo: 40-50% de ocupación (270-338 elementos de 676 total)`);
        
        console.log("\n🔧 ACCIONES RECOMENDADAS:");
        if (validLevels === totalLevels) {
            console.log("🎉 ¡Perfecto! Todos los niveles están en el rango correcto.");
        } else {
            console.log("⚠️  Se recomienda ajustar los niveles fuera del rango.");
            console.log("💡 Ejecuta: ajustarMapas() para corregir automáticamente");
        }
        
        return {
            total: totalLevels,
            valid: validLevels,
            needMore: needMoreElements,
            needFewer: needFewerElements,
            averageOccupancy: (totalOccupancy / totalLevels).toFixed(1)
        };
        
    } catch (error) {
        console.error("❌ Error analizando mapas:", error);
    }
}

async function ajustarMapas() {
    console.clear();
    console.log("🔧 AJUSTANDO MAPAS PARA CUMPLIR 40-50% OCUPACIÓN");
    console.log("=".repeat(60));
    
    try {
        // Crear validador y ejecutar proceso completo
        const validator = new LevelValidator();
        const adjustedLevels = await validator.runFullProcess();
        
        if (adjustedLevels) {
            console.log("\n💾 ¿Quieres aplicar estos cambios al juego actual?");
            console.log("⚠️  Nota: Esto solo afectará la sesión actual, no el archivo original");
            
            const apply = confirm("¿Aplicar los niveles ajustados al juego actual?");
            if (apply && window.game) {
                window.game.levelData = adjustedLevels;
                console.log("✅ Niveles ajustados aplicados al juego");
                console.log("🔄 Reinicia el nivel actual para ver los cambios");
                
                // Opcionalmente reiniciar el nivel actual
                const restart = confirm("¿Reiniciar el nivel actual para ver los cambios?");
                if (restart) {
                    window.game.restartLevel();
                }
            }
        }
        
        return adjustedLevels;
        
    } catch (error) {
        console.error("❌ Error ajustando mapas:", error);
    }
}

function mostrarEstadisticasDetalladas() {
    console.clear();
    console.log("📊 ESTADÍSTICAS DETALLADAS DE ELEMENTOS");
    console.log("=".repeat(60));
    
    const generator = new MapGenerator();
    const elementNames = {
        0: "Vacío",
        1: "Ladrillo",
        2: "Acero", 
        3: "Árboles",
        4: "Agua",
        5: "Hielo",
        6: "Base"
    };
    
    fetch('./levels/levels.json')
        .then(response => response.json())
        .then(levelsData => {
            for (const [levelKey, levelData] of Object.entries(levelsData)) {
                console.log(`\n🗺️  ${levelKey.toUpperCase()}: ${levelData.name}`);
                console.log("-".repeat(40));
                
                const elementCount = {};
                const tiles = levelData.tiles;
                
                // Contar elementos
                for (let y = 0; y < 26; y++) {
                    for (let x = 0; x < 26; x++) {
                        const element = tiles[y][x];
                        elementCount[element] = (elementCount[element] || 0) + 1;
                    }
                }
                
                // Mostrar estadísticas
                for (const [element, count] of Object.entries(elementCount)) {
                    const name = elementNames[element] || `Tipo ${element}`;
                    const percentage = ((count / 676) * 100).toFixed(1);
                    console.log(`${name.padEnd(10)}: ${count.toString().padStart(3)} (${percentage}%)`);
                }
                
                const validation = generator.validateMapOccupancy(levelData);
                console.log(`${"TOTAL".padEnd(10)}: ${validation.occupied.toString().padStart(3)} (${validation.percentage}%)`);
            }
        });
}

// Hacer funciones disponibles globalmente
window.analyzeCurrentMaps = analyzeCurrentMaps;
window.ajustarMapas = ajustarMapas;
window.mostrarEstadisticasDetalladas = mostrarEstadisticasDetalladas;

console.log("🛠️  Scripts de análisis de mapas cargados.");
console.log("📋 Funciones disponibles:");
console.log("   🔍 analyzeCurrentMaps() - Analiza ocupación de todos los niveles");
console.log("   🔧 ajustarMapas() - Ajusta niveles para cumplir 40-50% ocupación");
console.log("   📊 mostrarEstadisticasDetalladas() - Muestra desglose de elementos por nivel");
console.log("\n💡 Ejecuta cualquiera de estas funciones en la consola para comenzar.");
