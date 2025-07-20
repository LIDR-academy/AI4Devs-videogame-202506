class MapGenerator {
    constructor() {
        this.mapSize = 26;
        this.totalCells = this.mapSize * this.mapSize; // 676
        this.minOccupancy = 0.40; // 40%
        this.maxOccupancy = 0.50; // 50%
        this.minElements = Math.floor(this.totalCells * this.minOccupancy); // 270
        this.maxElements = Math.floor(this.totalCells * this.maxOccupancy); // 338
    }

    /**
     * Valida si un mapa cumple con el porcentaje de ocupación requerido
     */
    validateMapOccupancy(mapData) {
        let occupied = 0;
        const tiles = mapData.tiles || mapData;
        
        for (let y = 0; y < this.mapSize; y++) {
            for (let x = 0; x < this.mapSize; x++) {
                if (tiles[y] && tiles[y][x] && tiles[y][x] !== 0) {
                    occupied++;
                }
            }
        }
        
        const percentage = (occupied / this.totalCells) * 100;
        return {
            occupied: occupied,
            total: this.totalCells,
            percentage: percentage.toFixed(1),
            isValid: percentage >= 40 && percentage <= 50
        };
    }

    /**
     * Ajusta un mapa existente para cumplir con el rango de ocupación 40-50%
     */
    adjustMapOccupancy(levelData) {
        const tiles = JSON.parse(JSON.stringify(levelData.tiles)); // Deep copy
        const validation = this.validateMapOccupancy(tiles);
        
        console.log(`Nivel "${levelData.name}": ${validation.percentage}% ocupado`);
        
        if (validation.isValid) {
            return levelData; // Ya está en el rango correcto
        }
        
        if (validation.percentage < 40) {
            // Necesita más elementos
            const elementsToAdd = this.minElements - validation.occupied;
            this.addElementsToMap(tiles, elementsToAdd);
            console.log(`  ✅ Agregados ${elementsToAdd} elementos`);
        } else {
            // Necesita menos elementos
            const elementsToRemove = validation.occupied - this.maxElements;
            this.removeElementsFromMap(tiles, elementsToRemove);
            console.log(`  ✅ Removidos ${elementsToRemove} elementos`);
        }
        
        // Verificar resultado final
        const finalValidation = this.validateMapOccupancy(tiles);
        console.log(`  📊 Resultado final: ${finalValidation.percentage}% ocupado`);
        
        return {
            ...levelData,
            tiles: tiles
        };
    }

    /**
     * Agrega elementos al mapa manteniendo áreas críticas protegidas
     */
    addElementsToMap(tiles, elementsToAdd) {
        let added = 0;
        const maxAttempts = 2000; // Evitar bucle infinito
        let attempts = 0;
        
        while (added < elementsToAdd && attempts < maxAttempts) {
            const x = Math.floor(Math.random() * this.mapSize);
            const y = Math.floor(Math.random() * this.mapSize);
            
            if (this.canPlaceElement(tiles, x, y)) {
                const elementType = this.selectElementType(y);
                tiles[y][x] = elementType;
                added++;
            }
            attempts++;
        }
        
        console.log(`    Agregados ${added}/${elementsToAdd} elementos en ${attempts} intentos`);
    }

    /**
     * Remueve elementos del mapa de forma estratégica
     */
    removeElementsFromMap(tiles, elementsToRemove) {
        let removed = 0;
        const removalPriority = [3, 1, 5, 4, 2]; // Árboles, Ladrillos, Hielo, Agua, Acero
        
        for (const tileType of removalPriority) {
            if (removed >= elementsToRemove) break;
            
            for (let y = 0; y < this.mapSize && removed < elementsToRemove; y++) {
                for (let x = 0; x < this.mapSize && removed < elementsToRemove; x++) {
                    if (tiles[y][x] === tileType && this.canRemoveElement(tiles, x, y)) {
                        if (Math.random() < 0.4) { // 40% probabilidad de remover
                            tiles[y][x] = 0;
                            removed++;
                        }
                    }
                }
            }
        }
        
        console.log(`    Removidos ${removed}/${elementsToRemove} elementos`);
    }

    /**
     * Verifica si se puede colocar un elemento en una posición
     */
    canPlaceElement(tiles, x, y) {
        // Verificar límites
        if (x < 0 || x >= this.mapSize || y < 0 || y >= this.mapSize) {
            return false;
        }
        
        // Verificar si ya está ocupado
        if (tiles[y][x] !== 0) {
            return false;
        }
        
        // Proteger spawns de enemigos (esquinas superiores)
        const enemySpawns = [
            {x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1},
            {x: 12, y: 0}, {x: 13, y: 0}, {x: 12, y: 1}, {x: 13, y: 1},
            {x: 24, y: 0}, {x: 25, y: 0}, {x: 24, y: 1}, {x: 25, y: 1}
        ];
        
        for (const spawn of enemySpawns) {
            if (x === spawn.x && y === spawn.y) {
                return false;
            }
        }
        
        // Proteger área de la base (parte inferior central)
        if (y >= 22 && x >= 10 && x <= 15) {
            return false;
        }
        
        return true;
    }

    /**
     * Verifica si se puede remover un elemento de una posición
     */
    canRemoveElement(tiles, x, y) {
        // No remover la base
        if (tiles[y][x] === 6) {
            return false;
        }
        
        // No remover elementos cerca de la base
        if (y >= 22 && x >= 10 && x <= 15) {
            return false;
        }
        
        return true;
    }

    /**
     * Selecciona el tipo de elemento basado en la posición y distribución deseada
     */
    selectElementType(y) {
        const rand = Math.random();
        
        // Distribución variable según la altura del mapa
        if (y < 8) { // Parte superior - más variedad
            if (rand < 0.50) return 1; // Ladrillos 50%
            if (rand < 0.70) return 2; // Acero 20%
            if (rand < 0.85) return 3; // Árboles 15%
            if (rand < 0.95) return 4; // Agua 10%
            return 5; // Hielo 5%
        } else if (y < 18) { // Parte media - balance
            if (rand < 0.60) return 1; // Ladrillos 60%
            if (rand < 0.75) return 2; // Acero 15%
            if (rand < 0.85) return 3; // Árboles 10%
            if (rand < 0.92) return 4; // Agua 7%
            return 5; // Hielo 8%
        } else { // Parte inferior - más defensiva
            if (rand < 0.70) return 1; // Ladrillos 70%
            if (rand < 0.85) return 2; // Acero 15%
            if (rand < 0.92) return 3; // Árboles 7%
            if (rand < 0.96) return 4; // Agua 4%
            return 5; // Hielo 4%
        }
    }

    /**
     * Genera un mapa completamente nuevo con la ocupación deseada
     */
    generateBalancedMap(levelNumber = 1) {
        const tiles = Array(this.mapSize).fill(null).map(() => Array(this.mapSize).fill(0));
        
        // Colocar base
        tiles[24][12] = 6;
        tiles[24][13] = 6;
        
        // Protección inicial de la base
        const baseProtection = [
            [23, 11], [23, 12], [23, 13], [23, 14],
            [24, 11], [24, 14],
            [25, 11], [25, 12], [25, 13], [25, 14]
        ];
        
        let elementsPlaced = 2; // Base cuenta como 2 elementos
        
        baseProtection.forEach(([y, x]) => {
            if (tiles[y] && tiles[y][x] === 0) {
                tiles[y][x] = 1; // Ladrillos
                elementsPlaced++;
            }
        });
        
        // Calcular elementos objetivo
        const targetElements = this.minElements + Math.floor(Math.random() * (this.maxElements - this.minElements));
        const elementsToAdd = targetElements - elementsPlaced;
        
        // Llenar hasta el objetivo
        this.addElementsToMap(tiles, elementsToAdd);
        
        const validation = this.validateMapOccupancy(tiles);
        
        return {
            name: `Nivel ${levelNumber} - Generado`,
            enemyCount: 20,
            enemyTypes: this.generateEnemyTypes(levelNumber),
            tiles: tiles,
            generated: true,
            occupancy: validation.percentage
        };
    }

    /**
     * Genera tipos de enemigos basados en el nivel
     */
    generateEnemyTypes(level) {
        const types = [];
        const totalEnemies = 20;
        
        if (level <= 5) {
            // Niveles fáciles
            for (let i = 0; i < totalEnemies; i++) {
                if (i < 14) types.push("BASIC");
                else if (i < 18) types.push("FAST");
                else if (i < 19) types.push("POWER");
                else types.push("BONUS");
            }
        } else if (level <= 15) {
            // Niveles medios
            for (let i = 0; i < totalEnemies; i++) {
                if (i < 10) types.push("BASIC");
                else if (i < 15) types.push("FAST");
                else if (i < 18) types.push("POWER");
                else if (i < 19) types.push("HEAVY");
                else types.push("BONUS");
            }
        } else {
            // Niveles difíciles
            for (let i = 0; i < totalEnemies; i++) {
                if (i < 6) types.push("BASIC");
                else if (i < 10) types.push("FAST");
                else if (i < 14) types.push("POWER");
                else if (i < 18) types.push("HEAVY");
                else types.push("BONUS");
            }
        }
        
        return types;
    }

    /**
     * Analiza todos los niveles del archivo JSON
     */
    analyzeLevels(levelsData) {
        console.log("🔍 Analizando ocupación de niveles...\n");
        
        const analysis = {
            total: 0,
            valid: 0,
            needAdjustment: 0,
            averageOccupancy: 0,
            details: []
        };
        
        let totalOccupancy = 0;
        
        for (const [levelKey, levelData] of Object.entries(levelsData)) {
            const validation = this.validateMapOccupancy(levelData);
            const status = validation.isValid ? "✅" : "❌";
            
            analysis.details.push({
                level: levelKey,
                name: levelData.name,
                occupancy: parseFloat(validation.percentage),
                occupied: validation.occupied,
                isValid: validation.isValid
            });
            
            analysis.total++;
            if (validation.isValid) analysis.valid++;
            else analysis.needAdjustment++;
            
            totalOccupancy += parseFloat(validation.percentage);
            
            console.log(`${status} ${levelKey}: ${validation.percentage}% ocupado (${validation.occupied}/${validation.total} elementos)`);
        }
        
        analysis.averageOccupancy = (totalOccupancy / analysis.total).toFixed(1);
        
        console.log("\n📊 RESUMEN DEL ANÁLISIS:");
        console.log(`📋 Total de niveles: ${analysis.total}`);
        console.log(`✅ Niveles válidos (40-50%): ${analysis.valid}`);
        console.log(`❌ Niveles que necesitan ajuste: ${analysis.needAdjustment}`);
        console.log(`📈 Ocupación promedio: ${analysis.averageOccupancy}%`);
        console.log(`🎯 Rango objetivo: 40-50%`);
        
        return analysis;
    }

    /**
     * Ajusta todos los niveles para cumplir con el rango de ocupación
     */
    adjustAllLevels(levelsData) {
        console.log("🔧 Ajustando todos los niveles...\n");
        
        const adjustedLevels = {};
        
        for (const [levelKey, levelData] of Object.entries(levelsData)) {
            adjustedLevels[levelKey] = this.adjustMapOccupancy(levelData);
        }
        
        console.log("\n✅ Todos los niveles han sido ajustados");
        return adjustedLevels;
    }
}

// Hacer disponible globalmente
window.MapGenerator = MapGenerator;
