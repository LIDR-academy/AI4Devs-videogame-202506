# 🎮 Battle City Clone

## 📖 Historia del Juego

En el año 1985, en las profundidades de la Guerra Fría, una nueva amenaza emerge en el campo de batalla. Los tanques enemigos han invadido territorio aliado y han establecido bases fortificadas protegidas por muros de ladrillo. Como comandante de la unidad de tanques de élite, tu misión es eliminar todas las fuerzas enemigas y liberar el territorio ocupado.

**Battle City Clone** es una recreación moderna del clásico juego de NES "Battle City" (1985), desarrollado por Namco. Este clon mantiene la esencia del juego original mientras añade mejoras visuales y efectos modernos, ofreciendo una experiencia nostálgica pero renovada para los jugadores de todas las edades.

## 🎯 Objetivo del Juego

Tu misión es controlar un tanque militar y eliminar a todos los enemigos en cada nivel. El juego cuenta con 3 niveles únicos que se repiten en ciclo infinito, manteniendo tu puntaje acumulado. Debes proteger tu base mientras destruyes las fortificaciones enemigas y eliminas sus tanques.

## 🎮 Características del Juego

### ✨ Características Principales
- **3 Niveles Únicos**: Cada nivel presenta un diseño de laberinto diferente
- **Sistema de Vidas**: 3 vidas por partida
- **Puntaje Persistente**: El puntaje se mantiene entre niveles
- **Enemigos Progresivos**: 10 enemigos por nivel que aparecen gradualmente
- **Efectos Visuales**: Partículas de explosión con colores diferenciados
- **Música y Sonidos**: Efectos de sonido para una experiencia inmersiva

### 🎨 Elementos Visuales
- **Tanques Detallados**: Diseño realista de tanques militares
- **Animaciones Fluidas**: Movimiento suave y rotación de tanques
- **Efectos de Partículas**: Explosiones coloridas al destruir bloques y tanques
- **Interfaz Moderna**: Paneles informativos con diseño atractivo
- **Menú Animado**: Tanque animado en el menú principal



## 🕹️ Controles

### 🎮 Controles del Jugador
- **Flechas Direccionales**: Mover el tanque
  - ↑ Flecha Arriba: Mover hacia arriba
  - ↓ Flecha Abajo: Mover hacia abajo
  - ← Flecha Izquierda: Mover hacia la izquierda
  - → Flecha Derecha: Mover hacia la derecha
- **Barra Espaciadora**: Disparar

### 🎯 Controles de Menú
- **START**: Iniciar nueva partida
- **Volver al Menú**: Regresar al menú principal desde la pantalla de Game Over

## 🏗️ Estructura del Juego

### 📊 Sistema de Puntuación
- **Eliminar Enemigo**: +100 puntos
- **Puntaje Total**: Se acumula entre niveles
- **Enemigos Eliminados**: Contador total de enemigos destruidos

### 🎯 Sistema de Niveles
- **Nivel 1**: Laberinto simple con caminos básicos
- **Nivel 2**: Laberinto con caminos laterales y mayor complejidad
- **Nivel 3**: Laberinto con centro abierto y máxima dificultad
- **Ciclo Infinito**: Después del nivel 3, vuelve al nivel 1

### 🛡️ Sistema de Vidas
- **3 Vidas Iniciales**: El jugador comienza con 3 vidas
- **Invencibilidad Temporal**: 1.5 segundos de invencibilidad al reaparecer
- **Game Over**: Cuando se pierden todas las vidas

## 🎨 Elementos del Juego

### 🏗️ Bloques y Obstáculos
- **Ladrillos Destruibles**: Bloques marrones que se pueden destruir
- **Muros de Laberinto**: Forman pasillos y obstáculos
- **Partículas de Destrucción**: Efectos visuales al destruir bloques

### 🎯 Enemigos
- **Tanques Enemigos**: Tanques grises con marca de cruz roja
- **IA Básica**: Movimiento aleatorio y disparos automáticos
- **Spawn Progresivo**: Aparecen gradualmente durante el nivel
- **10 Enemigos por Nivel**: Cantidad fija de enemigos por nivel

### 🎮 Jugador
- **Tanque Aliado**: Tanque verde militar con detalles realistas
- **Movimiento Fluido**: Control preciso con las flechas
- **Sistema de Disparo**: Una bala a la vez
- **Colisión Inteligente**: Detección precisa de colisiones

## 🚀 Instalación y Uso

### 📋 Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado

### 🛠️ Instalación
1. Descarga todos los archivos del proyecto
2. Abre `index.html` en tu navegador web
3. ¡Disfruta del juego!

### 📁 Estructura de Archivos
```
BattleCity-WC/
├── index.html          # Archivo principal del juego
├── game.js             # Lógica principal del juego
├── levels.js           # Configuración de niveles
├── styles.css          # Estilos y diseño
├── README.md           # Este archivo

```

## 🎯 Mecánicas de Juego

### 🎮 Gameplay
1. **Inicio**: Presiona START en el menú principal
2. **Movimiento**: Usa las flechas para mover tu tanque
3. **Disparo**: Presiona la barra espaciadora para disparar
4. **Objetivo**: Elimina todos los enemigos del nivel
5. **Progresión**: Completa los 3 niveles en ciclo infinito

### ⚡ Características Especiales
- **Efectos de Partículas**: Explosiones coloridas diferenciadas por tipo
- **Sistema de Invencibilidad**: Protección temporal al reaparecer
- **Limpieza de Municiones**: Todas las balas desaparecen al morir
- **Transiciones Suaves**: Animaciones fluidas entre estados

## 🎨 Diseño y Estética

### 🎨 Paleta de Colores
- **Fondo**: Negro profundo (#111)
- **Tanque Jugador**: Verde militar (#4a5d23)
- **Tanques Enemigos**: Gris metálico (#5a5a5a)
- **Bloques**: Marrón ladrillo (#b55239)
- **UI**: Dorado (#f1c40f) y blanco

### 🎭 Efectos Visuales
- **Partículas de Explosión**: 8 partículas por explosión
- **Parpadeo de Invencibilidad**: Efecto visual cuando el jugador es invencible
- **Rotación de Tanques**: Los tanques rotan según su dirección
- **Animación de Menú**: Tanque animado en el menú principal

## 🔧 Tecnologías Utilizadas

### 💻 Frontend
- **HTML5**: Estructura del juego
- **CSS3**: Estilos y animaciones
- **JavaScript ES6+**: Lógica del juego
- **Canvas API**: Renderizado gráfico

### 🎮 Características Técnicas
- **Game Loop**: Basado en requestAnimationFrame
- **Sistema de Colisiones**: Detección precisa de colisiones
- **Gestión de Estados**: Control de estados del juego
- **Sistema de Partículas**: Efectos visuales dinámicos

## 🎯 Consejos de Juego

### 💡 Estrategias
1. **Movimiento Defensivo**: Mantén distancia de los enemigos
2. **Uso de Cobertura**: Usa los bloques como protección
3. **Disparos Precisos**: Apunta cuidadosamente antes de disparar
4. **Gestión de Munición**: Solo puedes disparar una bala a la vez
5. **Aprovecha la Invencibilidad**: Usa el tiempo de invencibilidad para reposicionarte

### ⚠️ Precauciones
- Los enemigos disparan automáticamente
- Los bloques se pueden destruir
- El tiempo de invencibilidad es limitado
- Los enemigos aparecen progresivamente

## 🏆 Logros y Objetivos

### 🎯 Objetivos a Corto Plazo
- Completar el primer nivel
- Alcanzar 1000 puntos
- Sobrevivir sin perder vidas

### 🏅 Objetivos a Largo Plazo
- Completar múltiples ciclos de niveles
- Alcanzar puntajes altos
- Mejorar la precisión de disparo

## 🔄 Versiones y Actualizaciones

### 📝 Versión Actual: 1.0
- Sistema completo de juego
- 3 niveles únicos
- Efectos visuales avanzados
- Sistema de partículas
- Interfaz moderna

### 🚀 Próximas Características
- Más tipos de enemigos
- Power-ups y mejoras
- Niveles adicionales
- Modo multijugador
- Sistema de guardado

## 👨‍💻 Desarrollo

### 🛠️ Herramientas de Desarrollo
- **Editor**: Cualquier editor de código (VS Code, Sublime Text, etc.)
- **Navegador**: Para pruebas y depuración
- **Git**: Control de versiones

### 🐛 Reporte de Errores
Si encuentras algún error o tienes sugerencias, por favor:
1. Revisa la consola del navegador para errores
2. Documenta los pasos para reproducir el problema
3. Incluye información sobre tu navegador y sistema operativo

## 📄 Licencia

Este proyecto es una recreación educativa del clásico juego Battle City. Todos los derechos del juego original pertenecen a Namco.

---

## 🎮 ¡Disfruta del Juego!

¡Gracias por jugar Battle City Clone! Esperamos que disfrutes de esta recreación moderna del clásico juego de tanques. ¡Que la victoria esté de tu lado, comandante!

**¡BATTLE CITY AWAITS!** 🚀 