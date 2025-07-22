# Brief de Desarrollo: Breakout Evolutivo

## 📋 Especificaciones del Proyecto

### **Tecnologías**
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Motor 2D**: Phaser 3 (CDN o npm)
- **Audio**: Howler.js para efectos de sonido
- **Plataforma**: Web Browser (responsive)

### **Estructura de Archivos Sugerida**
```
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── game.js (archivo principal)
│   ├── scenes/
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   └── GameOverScene.js
│   ├── entities/
│   │   ├── Paddle.js
│   │   ├── Ball.js
│   │   ├── Block.js
│   │   └── Projectile.js
│   └── managers/
│       ├── AudioManager.js
│       └── BlockAI.js
├── assets/
│   ├── sounds/
│   └── images/
└── README.md
```

## 🎮 Mecánicas del Juego

### **Nivel 1: Básico**
- 1 pelota
- Bloques estáticos en formación rectangular
- Paleta controlada por mouse/teclado
- Física de rebote básica

### **Nivel 2: Evolutivo**
- 2 pelotas simultáneas
- Bloques "aprenden" patrones de impacto
- Bloques se reorganizan hacia "zonas seguras" (menos impactadas)
- Introducción de 2-3 bloques "venganza" que disparan proyectiles simples

### **Nivel 3: Avanzado**
- 3 pelotas simultáneas
- IA de bloques más agresiva (reorganización más frecuente)
- 5-6 bloques "venganza" activos
- Bloques cambian resistencia según datos de impacto

## 🧠 Sistema de "Aprendizaje" de Bloques

### **Recolección de Datos**
```javascript
// Cada bloque registra:
blockData = {
    id: "block_x_y",
    hitCount: 0,
    lastHitTime: timestamp,
    positionHits: {x: 0, y: 0}, // promedio de posiciones de impacto
    dangerLevel: 0.0 // 0-1 basado en frecuencia de impactos cercanos
}
```

### **Lógica de Reorganización**
- **Trigger**: Al completar cada nivel
- **Algoritmo**: Bloques con `dangerLevel > 0.6` se mueven hacia esquinas
- **Movimiento**: Animación suave de 1 segundo hacia nueva posición
- **Restricción**: Mantener formación jugable (no agruparse demasiado)

### **Bloques Venganza**
- **Activación**: `hitCount >= 3` convierte bloque normal en "venganza"
- **Visual**: Cambio de color (rojo pulsante)
- **Comportamiento**: Dispara proyectil cada 3-5 segundos hacia la paleta
- **Proyectil**: Velocidad constante, destruible por pelota

## 🎵 Sistema de Audio

### **Efectos Necesarios**
1. **bounce.wav** - Rebote de pelota (paleta/bloques/paredes)
2. **break.wav** - Destrucción de bloque
3. **shoot.wav** - Disparo de bloque venganza
4. **powerup.wav** - Eventos especiales
5. **music_loop.mp3** - Música de fondo (loop)

### **Fuentes de Audio Libre**
- Freesound.org (efectos)
- OpenGameArt.org (música)
- Zapsplat.com (cuenta gratuita)

## 📐 Configuración de Phaser

### **Configuración Base**
```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene, GameOverScene]
};
```

### **Física Requerida**
- **Rebotes**: elasticidad en pelotas (bounce: 1)
- **Colisiones**: detección entre pelota-bloque, pelota-paleta, proyectil-paleta
- **Límites**: paredes laterales y superior rebote, inferior = pérdida de vida

## 🔄 Flujo de Desarrollo (3 días)

### **Día 1: Fundación**
1. Configurar Phaser + estructura de archivos
2. Crear paleta con controles
3. Crear pelota con física básica
4. Grid de bloques estáticos
5. Sistema de colisiones básico
6. Integrar audio básico

### **Día 2: Mecánicas Core**
1. Sistema de vidas y puntuación
2. Múltiples pelotas (nivel 2+)
3. Implementar BlockAI básico (recolección de datos)
4. Lógica de reorganización de bloques
5. Transiciones entre niveles

### **Día 3: Features Evolutivas**
1. Sistema de bloques "venganza"
2. Proyectiles y colisiones
3. Refinamiento de IA de bloques
4. Polish visual y audio
5. Testing y debug

## 🎨 Estilo Visual

### **Paleta de Colores**
- **Fondo**: Gradiente azul oscuro (#1a1a2e → #16213e)
- **Paleta**: Blanco/gris claro (#ffffff)
- **Pelotas**: Amarillo brillante (#ffff00)
- **Bloques normales**: Azul/verde/púrpura (#3498db, #2ecc71, #9b59b6)
- **Bloques venganza**: Rojo pulsante (#e74c3c)
- **Proyectiles**: Naranja (#f39c12)

### **Efectos Visuales**
- Partículas al destruir bloques
- Trail de movimiento en pelotas
- Pulsado en bloques venganza
- Animaciones de reorganización

## 🔧 Comandos de Instalación

```bash
# Opción 1: CDN (más simple para 3 días)
# Agregar en HTML:
<script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/howler@2.2.3/dist/howler.min.js"></script>

# Opción 2: NPM (si prefieres bundling)
npm init -y
npm install phaser howler
```

## 🎯 Criterios de Éxito

- [ ] Juego completamente jugable en browser
- [ ] 3 niveles con dificultad creciente
- [ ] Bloques que se reorganizan visiblemente
- [ ] Sistema de venganza funcionando
- [ ] Audio integrado y funcional
- [ ] Múltiples pelotas en niveles 2 y 3
- [ ] Controles responsivos (mouse + teclado)

## 📝 Notas para el Copiloto

1. **Priorizar funcionalidad sobre perfección visual** (3 días es ajustado)
2. **Usar console.log extensivamente** para debugging de IA de bloques
3. **Implementar en orden**: básico → múltiples pelotas → IA → venganza
4. **Testear frecuentemente** en browser real, no solo dev tools
5. **Mantener código modular** para fácil debugging y expansión