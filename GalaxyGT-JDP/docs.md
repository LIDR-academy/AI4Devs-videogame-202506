# GalaxyGT - Documentación de Prompts

## 📋 Descripción del Juego

**GalaxyGT** es un videojuego espacial desarrollado con **HTML5 Canvas**, **CSS** y **JavaScript vanilla**. El juego se ejecuta completamente en el navegador web sin dependencias externas.

### 🎮 Características Principales
- Juego de disparos espacial tipo "Space Invaders"
- 5 niveles de dificultad progresiva
- Enemigos tipo abeja con movimientos complejos
- Sistema de efectos de sonido
- Interfaz visual atractiva con tema espacial

## 📁 Estructura del Proyecto

```
GalaxyGT-JDP/
├── index.html          # Archivo principal del juego
├── sounds.js           # Sistema de efectos de sonido
└── prompts.md          # Documentación de prompts
```

## 🚀 Prompts Utilizados

### Prompt 1: Estructura Básica del Juego
> **Objetivo**: Crear la base del videojuego

```markdown
Crear un archivo HTML básico para el videojuego GalaxyGT con:
- Canvas HTML5 para el juego
- Pantalla de inicio con botón de start
- Estructura básica de CSS con tema espacial (colores azul/verde)
- JavaScript básico con bucle de juego
- Variables para score y lives
- Funciones update() y draw() preparadas para futuras funcionalidades
```

### Prompt 2: Nave del Jugador y Controles
> **Objetivo**: Implementar la nave espacial y sistema de control

```markdown
Añadir al videojuego GalaxyGT:
- Nave espacial del jugador con diseño detallado (cuerpo verde, cabina azul, motores rojos)
- Controles de movimiento con flechas del teclado (ArrowLeft, ArrowRight, ArrowUp, ArrowDown)
- Sistema de disparos con barra espaciadora
- Balas amarillas con efecto de brillo que se mueven hacia arriba
- Límites de pantalla para evitar que la nave salga del canvas
- Sistema de gestión de balas (crear, actualizar, eliminar cuando salen de pantalla)
```

### Prompt 3: Enemigos Tipo Abeja
> **Objetivo**: Crear el sistema de enemigos básico

```markdown
Añadir al videojuego GalaxyGT:
- Enemigos con diseño de abeja (cuerpo naranja, rayas negras, ojos blancos con pupilas, alas blancas)
- Formación de 3 filas x 8 columnas de enemigos
- Movimiento de rebote horizontal (de lado a lado sin descender)
- Efecto de rebote al tocar los bordes izquierdo y derecho
- Detección de colisiones entre balas y enemigos
- Sistema de puntuación (+10 puntos por enemigo derrotado)
- Actualización automática del contador de score en pantalla
- Sistema de game over cuando enemigos llegan muy cerca del jugador
```

### Prompt 4: Sistema de Niveles
> **Objetivo**: Implementar progresión de niveles

```markdown
Añadir al videojuego GalaxyGT:
- Sistema de niveles progresivos
- Contador de nivel visible en pantalla
- Detección automática cuando todos los enemigos son eliminados
- Mensaje de "Nivel Completado" con diseño atractivo
- Reaparición automática de enemigos para el siguiente nivel
- Incremento automático del contador de nivel
- Delay de 2 segundos entre niveles para mejor experiencia de usuario
```

### Prompt 5: Enemigos que Disparan
> **Objetivo**: Añadir dificultad con enemigos ofensivos

```markdown
Añadir al videojuego GalaxyGT:
- Límite de 5 niveles totales
- Mensaje de victoria cuando se completan los 5 niveles
- Enemigos que disparan desde el nivel 3 en adelante
- Sistema de disparo aleatorio de enemigos
- Máximo 5 balas de enemigos simultáneas
- Balas rojas de enemigos con velocidad más lenta
- Colisiones entre balas de enemigos y jugador
- Sistema de vidas (pierde vida al ser impactado por bala de enemigo)
- Game over cuando se pierden todas las vidas
```

### Prompt 6: Efectos de Sonido
> **Objetivo**: Implementar sistema de audio

```markdown
Añadir al videojuego GalaxyGT:
- Sistema de audio basado en Web Audio API
- Efecto de sonido al disparar la nave del jugador (tono agudo)
- Efecto de sonido al destruir un enemigo (tono doble ascendente)
- Efecto de sonido al perder una vida (secuencia descendente)
- Efecto de sonido de victoria (secuencia de notas ascendentes)
- Inicialización automática del contexto de audio
- Archivo separado sounds.js para gestión de audio
- Diferentes tipos de ondas (square, sawtooth, sine) para variedad
```

### Prompt 7: Movimiento Circular en Nivel 5
> **Objetivo**: Añadir máxima dificultad al nivel final

```markdown
Añadir al videojuego GalaxyGT:
- Movimiento circular COMBINADO con movimiento horizontal limitado en el nivel 5
- Límite de movimiento vertical a la mitad superior del canvas (300px)
- Línea visual punteada roja horizontal para mostrar el límite
- Sistema de posiciones originales para calcular movimiento circular
- Radio ampliado a 35 píxeles para movimiento circular más visible
- Velocidad controlada para el movimiento circular
- Ángulos individuales para cada enemigo (movimiento no sincronizado)
- Efectos visuales especiales para enemigos del nivel 5 (aura roja, ojos rojos)
- Mensaje de advertencia especial al llegar al nivel 5
- Mantener movimiento normal de rebote en niveles 1-4
- Aumentar significativamente la dificultad del nivel final
```

## ✅ Funcionalidades Implementadas

| Funcionalidad | Estado | Descripción |
|---------------|--------|-------------|
| 🚀 Nave del jugador | ✅ Completado | Nave espacial con diseño detallado |
| 🎮 Controles de movimiento | ✅ Completado | Flechas del teclado para movimiento |
| 🔫 Sistema de disparos | ✅ Completado | Barra espaciadora para disparar |
| ✨ Efectos visuales | ✅ Completado | Balas con efectos de brillo |
| 🐝 Enemigos tipo abeja | ✅ Completado | Diseño y movimiento lateral |
| 💥 Sistema de colisiones | ✅ Completado | Detección bala-enemigo |
| 📊 Sistema de puntuación | ✅ Completado | +10 puntos por enemigo |
| 🎯 Sistema de niveles | ✅ Completado | 5 niveles progresivos |
| 🔴 Enemigos que disparan | ✅ Completado | Desde nivel 3 en adelante |
| ❤️ Sistema de vidas | ✅ Completado | 3 vidas con colisiones |
| 🔊 Efectos de sonido | ✅ Completado | Audio completo del juego |
| 🔄 Movimiento circular | ✅ Completado | Nivel 5 con movimiento complejo |

## 🔮 Funcionalidades Futuras

- [ ] Power-ups y mejoras
- [ ] Sistema de puntuación avanzado
- [ ] Diferentes tipos de enemigos
- [ ] Modo multijugador
- [ ] Tabla de puntuaciones

## 🛠️ Notas Técnicas

### Tecnologías Utilizadas
- **HTML5 Canvas**: Renderizado del juego
- **CSS3**: Estilos y animaciones
- **JavaScript ES6+**: Lógica del juego
- **Web Audio API**: Efectos de sonido

### Especificaciones Técnicas
- **Canvas**: 800x600 píxeles
- **FPS**: 60 frames por segundo
- **Compatibilidad**: Navegadores modernos
- **Dependencias**: Ninguna (vanilla JavaScript)

### Arquitectura del Código
- **Modular**: Funciones separadas por responsabilidad
- **Escalable**: Preparado para nuevas funcionalidades
- **Optimizado**: Uso eficiente de recursos
- **Documentado**: Código comentado y estructurado

## 📈 Progreso del Desarrollo

### Fases Completadas
1. ✅ **Fase 1**: Estructura básica y nave del jugador
2. ✅ **Fase 2**: Sistema de enemigos y colisiones
3. ✅ **Fase 3**: Sistema de niveles y progresión
4. ✅ **Fase 4**: Enemigos ofensivos y sistema de vidas
5. ✅ **Fase 5**: Efectos de sonido y audio
6. ✅ **Fase 6**: Movimiento complejo en nivel final

### Próximos Objetivos
- [ ] **Fase 7**: Power-ups y mejoras
- [ ] **Fase 8**: Optimización y pulido final
- [ ] **Fase 9**: Testing y corrección de bugs

---

## 👨‍💻 Desarrollador
**JDP** - Proyecto GalaxyGT

## 📅 Fecha de Creación
Diciembre 2024

## 🎯 Estado del Proyecto
**✅ COMPLETADO** - Juego funcional con todas las características básicas implementadas 