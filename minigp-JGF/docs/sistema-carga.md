# Sistema de Carga de Imágenes - Documentación

## Descripción General

El sistema de carga de imágenes del juego está diseñado para proporcionar una experiencia de carga fluida y profesional, con carga progresiva de assets y feedback visual en tiempo real.

## Componentes del Sistema

### 1. AssetManager (assets.js)

#### Características Principales
- **Carga por fases**: Los assets se cargan en orden de prioridad
- **Control de concurrencia**: Limita las cargas simultáneas para evitar sobrecarga
- **Manejo de errores**: Gestión robusta de errores de carga
- **Progreso en tiempo real**: Callbacks para actualizar la UI

#### Métodos Principales

```javascript
// Carga una imagen individual
loadImage(key, src)

// Carga múltiples imágenes con control de concurrencia
loadImages(imageList, concurrency = 3)

// Carga assets críticos (circuito, coche, cronómetro básico)
loadCriticalAssets()

// Carga assets de interfaz (RPM, fuentes, cronómetros)
loadUIAssets()

// Carga assets adicionales (elementos extra)
loadAdditionalAssets()

// Carga todos los assets en fases
loadAllAssets()
```

#### Configuración de Concurrencia
- **Assets críticos**: 2 cargas simultáneas
- **Assets de interfaz**: 3 cargas simultáneas  
- **Assets adicionales**: 4 cargas simultáneas

### 2. Preloader (preloader.js)

#### Características Principales
- **Fases visuales**: 6 fases de carga con descripciones
- **Animaciones suaves**: Transiciones entre fases
- **Progreso detallado**: Información específica de cada fase
- **Manejo de errores**: Visualización de errores de carga

#### Fases del Preloader
1. **Inicializando...** - Preparando el motor del juego
2. **Cargando circuito...** - Preparando la pista de carreras
3. **Cargando vehículo...** - Preparando tu coche de carreras
4. **Cargando interfaz...** - Preparando instrumentos de vuelta
5. **Cargando elementos...** - Preparando elementos adicionales
6. **¡Listo!** - Todo preparado para la carrera

#### Métodos Principales

```javascript
// Inicia el preloader
start()

// Actualiza el progreso de la fase actual
updatePhaseProgress(progress, text)

// Avanza a la siguiente fase
nextPhase()

// Completa el preloader
complete()

// Muestra un mensaje de error
showError(message)
```

## Flujo de Carga

### 1. Inicialización
```javascript
// El juego inicia el preloader
window.preloader.start();

// Se configura el canvas y componentes básicos
this.setupCanvas();
this.setupComponents();
```

### 2. Carga de Assets Críticos
```javascript
// Avanza a fase "Cargando circuito..."
window.preloader.nextPhase();

// Carga: circuito, coche, cronómetro básico, RPM extremos
await this.assets.loadCriticalAssets();
```

### 3. Carga de Assets de Interfaz
```javascript
// Avanza a fase "Cargando interfaz..."
window.preloader.nextPhase();

// Carga: RPM completo, fuentes, cronómetros adicionales
await this.assets.loadUIAssets();
```

### 4. Carga de Assets Adicionales
```javascript
// Avanza a fase "Cargando elementos..."
window.preloader.nextPhase();

// Carga: elementos de interfaz, sectores, radio, etc.
await this.assets.loadAdditionalAssets();
```

### 5. Completado
```javascript
// Completa el preloader con animación
window.preloader.complete();

// Transición a pantalla de inicio
this.changeState(this.states.START);
```

## Assets Organizados

### Assets Críticos (Fase 1)
- `circuit.jpg` - Circuito de carreras
- `car.gif` - Coche del jugador
- `chrono.png` - Cronómetro básico
- `rpm_01.png` - RPM mínimo
- `rpm_13.png` - RPM máximo

### Assets de Interfaz (Fase 2)
- **Cronómetros**: `chrono_race.png`, `times_01.png`, `times_02.png`
- **RPM**: `rpm_02.png` a `rpm_12.png`
- **Fuentes**: `font_01.png`, `font_02.png`, `font_03.png`

### Assets Adicionales (Fase 3)
- **Interfaz**: `finish_race.png`, `semaphore.png`, `laps.png`
- **Posiciones**: `position.png`, `positions_01.png`, `positions_02.png`
- **Sectores**: `sectors_01.png`, `sectors_02.png`, `sectors_03.png`
- **Radio**: `radio_01.png`, `radio_02.png`
- **Otros**: `penalty.png`, `boxes.png`, `name.png`, `name_plus.png`
- **Diferencias**: `diff_01.png`, `diff_02.png`

## Optimizaciones Implementadas

### 1. Control de Concurrencia
- Evita sobrecargar el navegador con demasiadas peticiones simultáneas
- Pausa entre lotes para permitir que el navegador procese

### 2. Carga Progresiva
- Los assets más importantes se cargan primero
- El juego puede funcionar con solo los assets críticos
- Assets adicionales se cargan en segundo plano

### 3. Manejo de Errores
- Los errores de carga no detienen el proceso completo
- Información detallada de errores en consola
- Feedback visual de errores en el preloader

### 4. Precalentamiento
- Las imágenes se renderizan en canvas temporal para optimizar el primer uso
- Reduce lag en el primer renderizado

## Callbacks y Eventos

### AssetManager Callbacks
```javascript
// Progreso de carga
onProgress(progress, text)

// Carga completada
onLoadComplete()

// Error en carga
onError(errors)
```

### Preloader Events
```javascript
// Fase completada
onPhaseComplete(phaseIndex)

// Preloader completado
onComplete()

// Error en preloader
onError(message)
```

## Configuración y Personalización

### Ajustar Concurrencia
```javascript
// En assets.js, modificar los valores de concurrencia
await this.loadCriticalAssets(2);    // 2 cargas simultáneas
await this.loadUIAssets(3);          // 3 cargas simultáneas
await this.loadAdditionalAssets(4);  // 4 cargas simultáneas
```

### Añadir Nuevos Assets
```javascript
// En assets.js, añadir a GAME_ASSETS
const GAME_ASSETS = {
    // ... assets existentes
    'nuevo_asset': 'assets/ruta/al/asset.png'
};
```

### Personalizar Fases del Preloader
```javascript
// En preloader.js, modificar this.phases
this.phases = [
    { name: 'Nueva Fase', description: 'Descripción de la fase' },
    // ... más fases
];
```

## Métricas y Debugging

### Información de Carga
```javascript
// Obtener información del AssetManager
const loadInfo = assetManager.getLoadInfo();
console.log(loadInfo);
// { loaded: 25, total: 30, progress: 83, isLoading: false, errors: 0 }

// Obtener información del Preloader
const preloaderInfo = preloader.getInfo();
console.log(preloaderInfo);
// { currentPhase: 3, phaseProgress: 75, overallProgress: 62, isComplete: false, totalPhases: 6 }
```

### Logs de Consola
- ✅ Assets cargados exitosamente
- ❌ Errores de carga con detalles
- 📊 Estadísticas de carga completada
- 🚀 Inicio de carga de lotes
- 🎯/🎨/🎪 Fases de carga específicas

## Consideraciones de Rendimiento

### Tamaños de Archivo
- **circuit.jpg**: ~5.1MB (requiere optimización)
- **car.gif**: ~1.1KB (tamaño óptimo)
- **Sprites OSD**: 1KB-50KB cada uno

### Optimizaciones Recomendadas
1. **Comprimir circuit.jpg** a WebP o reducir resolución
2. **Crear sprite sheets** para elementos OSD relacionados
3. **Implementar lazy loading** para assets no críticos
4. **Usar CDN** para assets grandes

### Monitoreo de Rendimiento
```javascript
// Medir tiempo de carga
const startTime = performance.now();
await assetManager.loadAllAssets();
const loadTime = performance.now() - startTime;
console.log(`Tiempo total de carga: ${loadTime}ms`);
``` 