# Arquitectura Técnica - Juego de Carreras

## Tecnologías Utilizadas
- **HTML5**: Estructura de la página
- **CSS3**: Estilos y layout
- **JavaScript ES6+**: Lógica del juego
- **Canvas API**: Renderizado gráfico

## Estructura de Archivos

```
minigp-JGF/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── js/
│   ├── game.js             # Lógica principal del juego
│   ├── assets.js           # Gestión de recursos
│   ├── car.js              # Clase del vehículo
│   ├── input.js            # Sistema de controles
│   ├── hud.js              # Interfaz de usuario
│   └── utils.js            # Utilidades generales
├── assets/
│   ├── circuit.jpg         # Circuito de carreras
│   ├── car.gif            # Coche del jugador
│   └── OSD2011/           # Elementos de interfaz
└── docs/                   # Documentación
```

## Arquitectura del Juego

### 1. Game Engine (game.js)
```javascript
class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.car = null;
        this.input = null;
        this.hud = null;
        this.assets = null;
        this.gameState = 'loading';
        this.lastTime = 0;
    }
    
    init() { /* Inicialización */ }
    update(deltaTime) { /* Lógica del juego */ }
    render() { /* Renderizado */ }
    gameLoop(currentTime) { /* Loop principal */ }
}
```

### 2. Sistema de Assets (assets.js)
```javascript
class AssetManager {
    constructor() {
        this.images = new Map();
        this.loadedCount = 0;
        this.totalCount = 0;
    }
    
    loadImage(key, src) { /* Cargar imagen */ }
    getImage(key) { /* Obtener imagen */ }
    isLoaded() { /* Verificar carga completa */ }
}
```

### 3. Clase del Vehículo (car.js)
```javascript
class Car {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.angle = 0;
        this.acceleration = 0;
        this.maxSpeed = 200;
        this.turnSpeed = 0.05;
        this.friction = 0.98;
    }
    
    update(deltaTime) { /* Física del coche */ }
    accelerate() { /* Acelerar */ }
    brake() { /* Frenar */ }
    turnLeft() { /* Girar izquierda */ }
    turnRight() { /* Girar derecha */ }
    render(ctx) { /* Renderizar coche */ }
}
```

### 4. Sistema de Input (input.js)
```javascript
class InputManager {
    constructor() {
        this.keys = new Set();
        this.setupEventListeners();
    }
    
    setupEventListeners() { /* Configurar eventos */ }
    isKeyPressed(key) { /* Verificar tecla presionada */ }
    update() { /* Actualizar estado de input */ }
}
```

### 5. Sistema HUD (hud.js)
```javascript
class HUD {
    constructor() {
        this.rpmSprites = [];
        this.fontSprites = [];
        this.chronoSprite = null;
    }
    
    renderSpeed(speed) { /* Mostrar velocidad */ }
    renderChrono(time) { /* Mostrar cronómetro */ }
    renderLapTime(time) { /* Mostrar tiempo de vuelta */ }
}
```

## Estados del Juego

### 1. Loading State
- Cargar todos los assets necesarios
- Mostrar pantalla de carga con progreso
- Transición a estado inicial

### 2. Initial State
- Posicionar coche en última curva
- Mostrar instrucciones
- Esperar input del jugador

### 3. Racing State
- Cronómetro activo
- Controles completos habilitados
- Detección de línea de meta

### 4. Finished State
- Cronómetro detenido
- Aceleración deshabilitada
- Mostrar tiempo final
- Opción de reiniciar

## Sistema de Física

### Movimiento del Coche
```javascript
// Aceleración
this.velocity += this.acceleration * deltaTime;

// Límite de velocidad
this.velocity = Math.min(this.velocity, this.maxSpeed);

// Fricción
this.velocity *= this.friction;

// Movimiento
this.x += Math.cos(this.angle) * this.velocity * deltaTime;
this.y += Math.sin(this.angle) * this.velocity * deltaTime;
```

### Sistema de Giro
```javascript
// Giro basado en velocidad
const turnAmount = this.turnSpeed * (this.velocity / this.maxSpeed);
this.angle += turnAmount; // o -turnAmount para dirección opuesta
```

## Sistema de Colisiones

### Línea de Meta
```javascript
class FinishLine {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    checkCollision(car) {
        return car.x >= this.x && 
               car.x <= this.x + this.width &&
               car.y >= this.y && 
               car.y <= this.y + this.height;
    }
}
```

### Límites del Circuito
```javascript
class CircuitBounds {
    constructor() {
        this.bounds = []; // Array de polígonos
    }
    
    checkCollision(car) {
        // Detectar colisión con límites
        // Implementar rebote o detención
    }
}
```

## Sistema de Cronómetro

### Tiempo de Vuelta
```javascript
class LapTimer {
    constructor() {
        this.startTime = 0;
        this.lapTime = 0;
        this.isRunning = false;
    }
    
    start() {
        this.startTime = performance.now();
        this.isRunning = true;
    }
    
    stop() {
        if (this.isRunning) {
            this.lapTime = performance.now() - this.startTime;
            this.isRunning = false;
        }
    }
    
    getCurrentTime() {
        if (this.isRunning) {
            return performance.now() - this.startTime;
        }
        return this.lapTime;
    }
}
```

## Optimizaciones de Rendimiento

### Game Loop Optimizado
```javascript
gameLoop(currentTime) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Limitar FPS
    if (deltaTime < 16) return; // ~60 FPS
    
    this.update(deltaTime);
    this.render();
    
    requestAnimationFrame(this.gameLoop.bind(this));
}
```

### Renderizado Eficiente
```javascript
render() {
    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Renderizar fondo (solo si es necesario)
    this.renderBackground();
    
    // Renderizar coche
    this.car.render(this.ctx);
    
    // Renderizar HUD
    this.hud.render(this.ctx);
}
```

## Consideraciones de Compatibilidad

### Navegadores Soportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Fallbacks
- Canvas no soportado → Mensaje de error
- Imágenes no cargadas → Placeholders
- Audio no soportado → Sin sonido

## Escalabilidad

### Características Futuras
- Múltiples circuitos
- Sistema de récords
- Modo multijugador local
- Efectos de sonido
- Partículas y efectos visuales
- Modo carrera completa (múltiples vueltas)

### Modularidad
- Separación clara de responsabilidades
- Interfaces bien definidas
- Fácil extensión de funcionalidades
- Sistema de plugins para características adicionales 