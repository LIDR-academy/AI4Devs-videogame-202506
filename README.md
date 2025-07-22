# Breakout Evolutivo - Estructura del Código

## 📁 Arquitectura de Archivos

```
├── index.html              # Archivo principal HTML
├── css/
│   └── styles.css          # Estilos y diseño visual
├── js/
│   ├── game.js             # Configuración principal de Phaser
│   ├── scenes/             # Pantallas del juego
│   │   ├── MenuScene.js    # Pantalla de inicio
│   │   ├── GameScene.js    # Pantalla de juego principal
│   │   └── GameOverScene.js # Pantalla de fin de juego
│   ├── entities/           # Objetos del juego
│   │   ├── Paddle.js       # Paleta controlable
│   │   ├── Ball.js         # Pelota con física manual
│   │   ├── Block.js        # Bloques destructibles
│   │   └── Projectile.js   # Proyectiles de venganza
│   └── managers/           # Sistemas de control
│       └── AudioManager.js # Sonidos y música generados
```

## 🎮 Conceptos Clave de la Implementación

### **Sistema de Física Híbrido**
- **Phaser Physics**: Solo para paddle y proyectiles
- **Física Manual**: Ball usa sistema completamente manual para evitar interferencias
- **Detección Manual**: Colisiones ball-block y ball-paddle calculadas manualmente

### **Scenes (Escenas)**
- Son las "pantallas" del juego (menú, juego, game over)
- Cada escena tiene `create()` para inicializar y `update()` para actualizar cada frame
- Se cambia entre escenas con `this.scene.start('NombreEscena')`

### **Game Objects (Objetos de Juego)**
- Elementos visuales como círculos, rectángulos, texto
- Se crean con `this.add.circle()`, `this.add.rectangle()`, etc.
- Ball solo usa sprite visual, sin physics body

## 🏗️ Flujo del Juego

### **1. Inicialización (game.js)**
```javascript
gameState = {
    score: 0,     // Puntuación actual
    lives: 3,     // Vidas restantes
    level: 1,     // Nivel actual
    ballsActive: 1,
    maxBalls: 1,
    audioManager: null
}
```

### **2. Ciclo Principal (GameScene.js)**
1. `create()` - Crea paddle, pelotas, bloques
2. `setupCollisions()` - Configura detección de colisiones (legacy, no usado)
3. `update()` - Se ejecuta 60 veces por segundo, actualiza todo con detección manual
4. Colisiones manuales ejecutan funciones específicas

### **3. Sistema de Colisiones Manual**
```javascript
// Ball.checkRectangleCollision() - Detecta colisión con blocks/paddle
// Ball.update() - Maneja colisiones con paredes
// GameScene.update() - Loop de detección ball-block y ball-paddle
```

## 🧠 Componentes Principales

### **Ball.js (Pelota) - Sistema Manual**
- **Posición Manual**: `this.position = {x, y}` independiente de Phaser
- **Velocidad Manual**: `this.velocity = {x, y}` controlada completamente por nosotros
- **Física Manual**: `deltaTime` para movimiento consistente
- **Detección Manual**: `checkRectangleCollision()` para blocks y paddle
- **Rebotes Naturales**: Reversión directa de componentes de velocidad
- **Anti-Interferencia**: Inmune a modificaciones externas de Phaser

### **Paddle.js (Paleta)**
- **Controles**: Mouse y teclado (A/D, flechas)
- **Límites**: No sale de la pantalla
- **Física Phaser**: Usa physics body inmóvil tradicional

### **Block.js (Bloques)**
- **Estados**: Normal → Venganza (tras 3 impactos)
- **Datos de IA**: Registra impactos y posiciones para evolución futura
- **Proyectiles**: Bloques venganza disparan cada 3 segundos
- **Efectos Visuales**: Animación pulsante para bloques venganza

### **AudioManager.js (Sonidos)**
- **Web Audio API**: Genera sonidos programáticamente
- **Sonidos Implementados**: Bounce, break, shoot, powerup, lifeLost
- **Frecuencias Específicas**: Cada sonido tiene tono distintivo

## 🔄 Estados y Transiciones

### **Vidas del Jugador**
```
3 vidas → Ball toca suelo → 2 vidas → ... → 0 vidas → Game Over
```

### **Progresión de Niveles**
```
Nivel 1 (1 pelota) → Nivel 2 (2 pelotas) → Nivel 3 (3 pelotas) → Victoria
```

### **Evolución de Bloques**
```
Bloque Normal → 3 impactos → Bloque Venganza → Dispara proyectiles c/3seg
```

## 🎯 Puntos de Entrada para Modificaciones

### **Cambiar Física de la Pelota**
- `Ball.js`: Modificar `this.speed` para velocidad (actual: 300)
- `Ball.js`: Cambiar `deltaTime = 1/60` para diferentes frame rates
- `Ball.js`: Ajustar `checkRectangleCollision()` para mejor detección

### **Cambiar Dificultad**
- `Block.js`: Cambiar `hitCount >= 3` para evolución a venganza
- `Block.js`: Modificar `shotInterval = 3000` para frecuencia de disparo
- `GameScene.js`: Ajustar dimensiones de bloques en `createBlocks()`

### **Agregar/Modificar Sonidos**
- `AudioManager.js`: Cambiar frecuencias en `createBeepSound(frequency, duration)`
- `AudioManager.js`: Ajustar `this.sfxVolume` para volumen general
- Reemplazar Web Audio con archivos reales modificando métodos `play()`

### **Nuevos Power-ups**
- Crear nueva clase en `/entities/`
- Agregar detección manual en `GameScene.update()`
- Implementar efectos en el objeto correspondiente

### **Cambiar Apariencia**
- `styles.css`: Colores de fondo y UI
- Cada `entity`: Modificar colores en constructores
- `gameConfig.backgroundColor` en `game.js`

## 🔧 Debug y Desarrollo

### **Console Logs Útiles**
- `Ball velocity: X Y Speed: Z` - Velocidad actual cada segundo
- `Ball hit left/right/top wall` - Detección de paredes
- `Ball hit block/paddle` - Colisiones detectadas manualmente
- `Block became a revenge block!` - Evolución de bloques
- `Revenge block shot a projectile!` - Bloque disparando

### **Testing de Física**
- Todos los cálculos de velocidad son visibles en logs
- No hay "cajas negras" de Phaser que oculten comportamiento
- Modificar `deltaTime` para cámara lenta/rápida
- Cambiar `this.speed` para testing de velocidades

### **Habilitar Debug Visual**
```javascript
// En game.js, cambiar:
debug: true  // Muestra hitboxes de física (solo paddle y proyectiles)
```

### **Testing Rápido**
- Cambiar `gameState.lives = 999` para vidas infinitas
- Modificar `this.speed` en Ball.js para pelotas más lentas/rápidas
- Reducir número de bloques en `createBlocks()` para testing
- Comentar `this.onBallLost()` para pelota inmortal

## 🏆 Características Técnicas Avanzadas

### **Resolución de Problemas de Física**
- **Problema Original**: Phaser reseteaba Y velocity a 0 misteriosamente
- **Solución Implementada**: Sistema de física completamente manual
- **Ventaja**: Control total sobre el comportamiento de la pelota
- **Resultado**: Rebotes perfectos y predecibles

### **Optimizaciones Implementadas**
- Detección de colisiones eficiente con early exits
- Logs condicionales para debugging sin impacto en performance
- Sistema de flags `markedForDestruction` para evitar múltiples colisiones
- Límites de velocidad y correcciones de posición para estabilidad

### **Arquitectura Escalable**
- Separación clara entre lógica de juego y renderizado
- Sistema modular que permite agregar nuevos tipos de objetos
- Estado global centralizado para persistencia entre niveles
- Sistema de eventos desacoplado para comunicación entre objetos