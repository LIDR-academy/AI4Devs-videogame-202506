# 📝 Prompts de Desarrollo - Juego de Memoria

Este archivo documenta todos los prompts y decisiones de desarrollo tomadas durante la creación del juego de memoria.

## 🚀 Prompt Inicial del Usuario

**Fecha**: 21 de julio de 2025

**Prompt Original**:
```
Hola se que eres un experto creando juegos con la tecnologia javascript
Crea un juego de memoria en JavaScript puro (sin frameworks) que utilice emojis como cartas. El juego debe tener niveles de dificultad que aumenten progresivamente. Aquí están los requisitos clave:

Nivel básico (Nivel 1):
- El juego tiene 14 cartas (7 pares de emojis).
- Las cartas deben barajarse aleatoriamente al inicio.
- El jugador puede voltear dos cartas a la vez.
- Si las cartas coinciden, se quedan volteadas.
- Si no coinciden, se voltean de nuevo después de un breve retraso.
- Mostrar un contador de movimientos realizados.
- Un botón para reiniciar el juego.

Dificultad progresiva (Niveles 2 en adelante):
- Aumenta el número de cartas (por ejemplo: nivel 2 = 10 pares, nivel 3 = 13 pares, etc.).
- Reduce el tiempo en que se muestran las cartas si no coinciden.
- Opcional: agregar distracciones visuales, como animaciones o emojis falsos.
- Añadir un temporizador de cuenta atrás para superar el nivel.
- El jugador debe ganar el nivel actual para avanzar al siguiente.

Estilo y funcionalidad:
- Usa HTML, CSS y JavaScript (puede incluir algo de Tailwind si lo deseas).
- Las cartas deben mostrarse con emojis visibles.
- Opcional: guarda el mejor puntaje por nivel (con localStorage).
- El código debe estar bien estructurado y comentado para facilitar su entendimiento y modificación.

crea el juego dentro de la carpeta memori-JMG, ademas crea un reeadme.md, un historial de la combersacion que tengamos y un fichero prompt.md
si tienes alguna duda no dudes en buscar en internet o preguntarme a mi.
Si te es mas facil analiza lo que te pido y dividelo en fases y cuando te diga ejecutar ejecutalo
```

## 🎯 Análisis y Planificación

### División en Fases Propuesta:

**Fase 1: Estructura Base**
- Crear carpeta y archivos básicos
- HTML semántico y estructura visual
- CSS con diseño profesional
- JavaScript con clase principal

**Fase 2: Lógica del Juego Nivel 1** 
- Implementar nivel básico completo
- Sistema de volteo y emparejamiento
- Contador de movimientos y reinicio
- Efectos sonoros básicos

**Fase 3: Sistema de Niveles**
- Progresión de dificultad
- Temporizador por nivel
- Transiciones entre niveles

**Fase 4: Funcionalidades Avanzadas**
- LocalStorage para puntuaciones
- Efectos visuales mejorados
- Optimizaciones finales

**Fase 5: Documentación**
- README completo
- Historial de desarrollo
- Documentación técnica

## 🔧 Decisiones Técnicas Tomadas

### Estructura del Código
```javascript
class MemoryGame {
    constructor() {
        // Inicialización del estado del juego
    }
    
    // Métodos organizados por funcionalidad
    startGame()         // Control del juego
    createBoard()       // Generación del tablero
    flipCard()         // Lógica de cartas
    checkForMatch()    // Verificación de parejas
    playSound()        // Sistema de audio
}
```

### Configuración de Niveles
```javascript
this.levelConfig = {
    1: { pairs: 7, timeLimit: 120, flipDelay: 1000 },
    2: { pairs: 10, timeLimit: 180, flipDelay: 800 },
    3: { pairs: 13, timeLimit: 240, flipDelay: 600 },
    4: { pairs: 16, timeLimit: 300, flipDelay: 400 },
    5: { pairs: 20, timeLimit: 360, flipDelay: 300 }
};
```

### Sistema de Emojis
```javascript
this.emojiSets = {
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
    fruits: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐'],
    objects: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱'],
    nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌵', '🌲']
};
```

## 🎨 Decisiones de Diseño

### Paleta de Colores CSS
```css
:root {
    --primary-color: #4f46e5;    /* Índigo moderno */
    --secondary-color: #10b981;  /* Verde éxito */
    --danger-color: #ef4444;     /* Rojo error */
    --warning-color: #f59e0b;    /* Amarillo advertencia */
}
```

### Grid Responsivo
- **Nivel 1**: Grid 4x4 para 14 cartas
- **Nivel 2**: Grid 5x4 para 20 cartas  
- **Nivel 3+**: Grid 6x5+ adaptativo

### Animaciones Clave
- **flipIn**: Rotación 3D para voltear cartas
- **matchedPulse**: Efecto de éxito en parejas
- **shake**: Animación de error
- **slideInUp**: Entrada de mensajes modales

## 🔊 Sistema de Audio

### Web Audio API Implementation
```javascript
playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configuración específica por tipo de sonido
    switch (type) {
        case 'flip': // Sonido sutil de volteo
        case 'match': // Acorde mayor de éxito  
        case 'wrong': // Tono grave de error
        case 'complete': // Melodía de victoria
    }
}
```

### Ventajas del Enfoque:
- ✅ Sin archivos externos
- ✅ Generación dinámica
- ✅ Control total del audio
- ✅ Lightweight

## 💾 Persistencia de Datos

### LocalStorage Schema
```javascript
{
    "bestScore": 1500,      // Mejor puntuación histórica
    "maxLevel": 3,          // Nivel máximo alcanzado
    "gamesPlayed": 15,      // Total de partidas
    "totalTime": 3600       // Tiempo total jugado
}
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas en Fase 1-2:
- [x] Estructura HTML semántica
- [x] CSS responsive con variables
- [x] Clase JavaScript orientada a objetos
- [x] Sistema de volteo de cartas
- [x] Lógica de emparejamiento
- [x] Barajado aleatorio (Fisher-Yates)
- [x] Contador de movimientos
- [x] Temporizador por nivel
- [x] Sistema de puntuación
- [x] LocalStorage para guardar progreso
- [x] Efectos de sonido generados
- [x] Animaciones CSS fluidas
- [x] Mensajes modales informativos
- [x] Confirmación de reinicio
- [x] 5 niveles de dificultad progresiva
- [x] 4 categorías de emojis diferentes

### 🔄 Optimizaciones Realizadas:
- **Event Listeners**: Manejo eficiente de eventos
- **Memory Management**: Limpieza automática de timers
- **Error Handling**: Manejo robusto de errores
- **Cross-browser**: Compatibilidad con Safari (backdrop-filter)
- **Touch Friendly**: Optimizado para móviles

## 🏆 Sistema de Puntuación

### Fórmula Implementada:
```javascript
calculateScore(timeElapsed) {
    const timeBonus = Math.max(0, timeLimit - timeElapsed);
    const movesPenalty = Math.max(0, moves - pairs);
    const baseScore = pairs * 100;
    
    return Math.round(baseScore + (timeBonus * 5) - (movesPenalty * 10));
}
```

### Factores de Puntuación:
- **Base**: 100 puntos por pareja
- **Bonus de Tiempo**: 5 puntos por segundo restante
- **Penalización**: -10 puntos por movimiento extra

## 🚀 Próximos Desarrollos

### Fase 3 - Sistema de Niveles Avanzado:
- [ ] Distracciones visuales opcionales
- [ ] Cartas especiales (comodines)
- [ ] Efectos de transición entre niveles
- [ ] Modos de juego adicionales

### Fase 4 - Funcionalidades Premium:
- [ ] Modo multijugador
- [ ] Logros y medallas
- [ ] Temas visuales intercambiables
- [ ] Estadísticas detalladas
- [ ] Modo torneo

## 🐛 Resolución de Problemas

### Issues Resueltos:
1. **Estilos inline**: Movidos a CSS con clases utilitarias
2. **Compatibilidad Safari**: Agregado `-webkit-backdrop-filter`
3. **Gestión de estado**: Centralizada en la clase principal
4. **Event bubbling**: Prevención adecuada de comportamiento por defecto

### Testing Manual Realizado:
- ✅ Volteo de cartas funcional
- ✅ Detección de parejas correcta
- ✅ Temporizador funcionando
- ✅ Transición entre niveles
- ✅ LocalStorage persistiendo datos
- ✅ Responsive design en móviles

## 📚 Recursos y Referencias

### Tecnologías Utilizadas:
- **HTML5**: Semántica moderna
- **CSS3**: Grid, Flexbox, Custom Properties
- **ES6+**: Classes, Arrow Functions, Template Literals
- **Web APIs**: AudioContext, LocalStorage, requestAnimationFrame

### Patrones de Código:
- **MVC**: Separación de lógica, vista y datos
- **Event-Driven**: Programación basada en eventos
- **Progressive Enhancement**: Funcionalidad gradual
- **Mobile-First**: Diseño adaptativo

---

**Estado Actual**: Fase 2 completada ✅
**Siguiente**: Fase 3 - Sistema de Niveles Avanzado
