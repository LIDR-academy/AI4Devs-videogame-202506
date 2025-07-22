# Sistema de Validación de Ocupación de Mapas - Battle City

## 📋 Descripción

Este sistema asegura que todos los mapas del juego Battle City tengan entre **40-50% de ocupación** de elementos (270-338 elementos de las 676 posiciones totales del mapa de 26x26).

## 🎯 Objetivo

- **Rango de ocupación**: 40-50%
- **Elementos por mapa**: 270-338 de 676 posiciones
- **Tipos de elementos**: Ladrillos, Acero, Árboles, Agua, Hielo, Base

## 🛠️ Componentes del Sistema

### 1. `MapGenerator` (mapGenerator.js)
Clase principal que:
- ✅ Valida ocupación de mapas existentes
- ✅ Ajusta mapas fuera del rango 40-50%
- ✅ Genera nuevos mapas proceduralmente
- ✅ Mantiene áreas críticas protegidas (spawns, base)

### 2. `LevelValidator` (levelValidator.js)
Herramienta de validación que:
- ✅ Analiza todos los niveles del archivo JSON
- ✅ Procesa ajustes automáticos
- ✅ Genera comparaciones antes/después
- ✅ Exporta niveles ajustados

### 3. `MapAnalyzer` (mapAnalyzer.js)
Scripts de utilidad para consola:
- ✅ Análisis rápido de ocupación
- ✅ Estadísticas detalladas por nivel
- ✅ Funciones de ajuste interactivo

## 🚀 Uso del Sistema

### Método 1: Automático (Recomendado)
El sistema se ejecuta automáticamente al cargar el juego:

1. **Carga el juego** normalmente
2. **El sistema valida** todos los mapas automáticamente
3. **Ajusta automáticamente** los que estén fuera del rango
4. **Muestra logs** en la consola del navegador

### Método 2: Análisis Manual via Consola

Abre la **consola del navegador** (F12) y ejecuta:

```javascript
// Análisis completo de ocupación
analyzeCurrentMaps()

// Ajuste automático de todos los mapas
ajustarMapas()

// Estadísticas detalladas por nivel
mostrarEstadisticasDetalladas()
```

### Método 3: Uso Avanzado

```javascript
// Crear instancias personalizadas
const generator = new MapGenerator();
const validator = new LevelValidator();

// Análisis específico
const analysis = await validator.loadAndAnalyzeLevels();

// Ajustes personalizados
const adjusted = await validator.adjustLevels();

// Generar niveles adicionales
const newLevels = validator.generateAdditionalLevels(5);
```

## 📊 Información de Salida

### Ejemplo de Análisis:
```
🎮 BATTLE CITY - ANÁLISIS DE OCUPACIÓN DE MAPAS
============================================================
📊 ANÁLISIS DE OCUPACIÓN ACTUAL:
------------------------------------------------------------
Nivel                     Ocupación    Elementos    Estado
------------------------------------------------------------
level1                    28.4%        192/676      ❌ BAJO
level2                    52.7%        356/676      ❌ ALTO
level3                    45.1%        305/676      ✅ OK
------------------------------------------------------------
📈 RESUMEN DEL ANÁLISIS:
📋 Total de niveles: 3
✅ Niveles válidos (40-50%): 1
⬇️  Niveles con poca ocupación (<40%): 1
⬆️  Niveles con mucha ocupación (>50%): 1
📊 Ocupación promedio: 42.1%
🎯 Objetivo: 40-50% de ocupación (270-338 elementos de 676 total)
```

## ⚙️ Configuración

### Parámetros del MapGenerator:
```javascript
mapSize = 26;           // Tamaño del mapa (26x26)
minOccupancy = 0.40;    // 40% mínimo
maxOccupancy = 0.50;    // 50% máximo
minElements = 270;      // Elementos mínimos
maxElements = 338;      // Elementos máximos
```

### Distribución de Elementos:
- **Ladrillos (1)**: 50-70% de los elementos
- **Acero (2)**: 15-20% de los elementos
- **Árboles (3)**: 7-15% de los elementos
- **Agua (4)**: 4-10% de los elementos
- **Hielo (5)**: 4-8% de los elementos
- **Base (6)**: Posición fija

## 🔧 Características Avanzadas

### Protección de Áreas Críticas:
- ✅ **Spawns de enemigos** (esquinas superiores)
- ✅ **Área de la base** (parte inferior central)
- ✅ **Rutas de acceso** básicas

### Distribución Inteligente:
- ✅ **Variación por altura**: Más variedad arriba, más defensivo abajo
- ✅ **Dificultad progresiva**: Más elementos complejos en niveles altos
- ✅ **Balance de elementos**: Evita concentraciones excesivas

### Generación Procedural:
- ✅ **Niveles infinitos**: Genera automáticamente niveles > 3
- ✅ **Escalabilidad**: Dificultad aumenta con el número de nivel
- ✅ **Consistencia**: Mantiene ocupación 40-50% siempre

## 📁 Archivos Generados

### Descarga Automática:
Al usar `ajustarMapas()`, se puede descargar:
- **`levels_adjusted.json`**: Niveles corregidos para reemplazar el original

### Aplicación Temporal:
- Los ajustes se aplican automáticamente durante la sesión
- Para cambios permanentes, reemplaza `levels/levels.json`

## 🐛 Solución de Problemas

### Si los mapas no se ajustan:
1. Verifica que todos los scripts estén cargados
2. Revisa la consola del navegador para errores
3. Asegúrate de que `levels.json` sea accesible

### Si la ocupación sigue fuera del rango:
- El sistema prioriza mantener áreas críticas
- Algunos mapas pueden necesitar ajuste manual
- Usa `generateBalancedMap()` para crear uno nuevo

## 📈 Beneficios del Sistema

### Para el Gameplay:
- ✅ **Balance consistente** entre niveles
- ✅ **Dificultad predecible** basada en ocupación
- ✅ **Experiencia uniforme** para los jugadores

### Para el Desarrollo:
- ✅ **Validación automática** de contenido
- ✅ **Generación procedural** ilimitada
- ✅ **Herramientas de análisis** incorporadas

### Para el Mantenimiento:
- ✅ **Detección automática** de problemas
- ✅ **Corrección automática** de mapas
- ✅ **Documentación completa** del proceso

---

## 🎮 ¡Disfruta jugando Battle City con mapas perfectamente balanceados!

**Recordatorio**: Todos los mapas ahora garantizan entre 40-50% de ocupación para una experiencia de juego óptima.
