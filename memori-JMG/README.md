# 🧠 Juego de Memoria - Emojis

Un divertido juego de memoria progresivo desarrollado con JavaScript puro, HTML5 y CSS3. Encuentra todas las parejas de emojis para avanzar a través de múltiples niveles de dificultad creciente.

## 🎮 Características Principales

### ✨ Jugabilidad
- **5 Niveles Progresivos**: Desde 7 pares hasta 20 pares de cartas
- **Temporizador Dinámico**: Tiempo limitado que varía según el nivel
- **Sistema de Puntuación**: Basado en tiempo y eficiencia
- **Efectos de Sonido**: Sonidos generados dinámicamente sin archivos externos
- **Animaciones Fluidas**: Efectos visuales profesionales

### 🎯 Niveles de Dificultad
1. **Nivel 1**: 7 pares - 120 segundos - Delay: 1000ms
2. **Nivel 2**: 10 pares - 180 segundos - Delay: 800ms  
3. **Nivel 3**: 13 pares - 240 segundos - Delay: 600ms
4. **Nivel 4**: 16 pares - 300 segundos - Delay: 400ms
5. **Nivel 5**: 20 pares - 360 segundos - Delay: 300ms

### 🎨 Emojis Incluidos
- **🐶 Animales**: Perros, gatos, pandas, leones y más
- **🍎 Frutas**: Manzanas, plátanos, fresas y frutas exóticas  
- **⚽ Objetos**: Deportes, juegos y elementos cotidianos
- **🌸 Naturaleza**: Flores, estrellas, elementos naturales

## 🚀 Cómo Jugar

1. **Iniciar**: Haz clic en "🎮 Comenzar Juego"
2. **Voltear**: Haz clic en dos cartas para voltearlas
3. **Emparejar**: Las cartas iguales permanecen volteadas
4. **Avanzar**: Completa todos los pares para pasar al siguiente nivel
5. **Competir**: Mejora tu puntuación y alcanza niveles superiores

## 💾 Persistencia de Datos

El juego guarda automáticamente:
- 🏆 **Mejor Puntuación**: Tu record histórico
- 🎯 **Nivel Máximo**: El nivel más alto alcanzado
- 📊 **Estadísticas**: Progreso y logros

## 🎵 Audio y Efectos

### Sonidos Generados Dinámicamente
- **Volteo**: Sonido sutil al voltear cartas
- **Coincidencia**: Acorde mayor de celebración  
- **Error**: Tono grave de alerta
- **Victoria**: Melodía ascendente de triunfo

### Efectos Visuales
- **Animaciones de volteo** con rotación 3D
- **Efectos de coincidencia** con pulso y brillo
- **Animación de error** con movimiento lateral
- **Partículas de celebración** en cartas emparejadas

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Variables custom, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Clases, módulos, async/await
- **Web Audio API**: Sonidos generados sin archivos externos
- **LocalStorage**: Persistencia de datos del usuario

## 📱 Compatibilidad

- ✅ **Responsive Design**: Adaptado a móviles, tablets y escritorio
- ✅ **Cross-Browser**: Chrome, Firefox, Safari, Edge
- ✅ **PWA Ready**: Preparado para aplicación web progresiva
- ✅ **Touch Friendly**: Optimizado para pantallas táctiles

## 🎨 Personalización

El juego está diseñado para ser fácilmente personalizable:

### Agregar Nuevos Niveles
```javascript
this.levelConfig = {
    6: { pairs: 25, timeLimit: 420, flipDelay: 250 }
};
```

### Modificar Emojis
```javascript
this.emojiSets = {
    space: ['🚀', '🌍', '⭐', '🌙', '👽', '🛸']
};
```

### Ajustar Dificultad
```javascript
// Cambiar tiempos de volteo por nivel
flipDelay: 500 // milisegundos
```

## 🏗️ Estructura del Código

```
memori-JMG/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos y animaciones CSS
├── script.js          # Lógica del juego JavaScript
├── README.md          # Este archivo
├── prompts.md         # Historial de prompts de desarrollo
└── historial-conversacion.md  # Log de desarrollo
```

## 🔍 Características Técnicas

### Arquitectura del Código
- **Patrón de Clase**: Código organizado en clase `MemoryGame`
- **Event-Driven**: Manejo de eventos para interacciones
- **State Management**: Estado centralizado del juego
- **Error Handling**: Manejo robusto de errores

### Performance
- **Barajado Eficiente**: Algoritmo Fisher-Yates
- **Gestión de Memoria**: Limpieza automática de timers
- **Lazy Loading**: Carga bajo demanda de recursos
- **Optimized Animations**: CSS transforms y GPU acceleration

## 🎯 Próximas Características

- [ ] Modo multijugador local
- [ ] Temas visuales intercambiables  
- [ ] Logros y medallas
- [ ] Modo oscuro/claro
- [ ] Estadísticas detalladas
- [ ] Exportar/importar progreso

## 📈 Métricas de Juego

El sistema de puntuación considera:
- ⏱️ **Tiempo de Finalización**: Bonos por velocidad
- 🎯 **Eficiencia de Movimientos**: Penalizaciones por intentos extra
- 🏆 **Nivel de Dificultad**: Multiplicadores por nivel

## 🤝 Contribuciones

Este proyecto está abierto a mejoras. Algunas áreas de interés:
- Nuevos temas de emojis
- Efectos visuales adicionales
- Optimizaciones de rendimiento
- Nuevos modos de juego

## 📄 Licencia

Proyecto desarrollado como demostración educativa. Libre para uso personal y educativo.

---

**¡Disfruta del juego y desafía tu memoria!** 🧠✨
