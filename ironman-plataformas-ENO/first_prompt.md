# Prompt para Crear Juego de Plataformas Iron Man vs Ultron

## Contexto del Proyecto

Necesito crear un videojuego de plataformas usando **HTML5, CSS3 y JavaScript** con el framework **Phaser 3**. El juego está inspirado en Super Mario Bros pero con temática de Marvel (Iron Man vs Ultron) y mecánicas específicas.

## Especificaciones Técnicas del Framework

- **Framework principal**: Phaser 3 (última versión estable)
- **Motores de física**: Arcade Physics (para movimiento de plataformas)
- **Renderizado**: WebGL con fallback a Canvas
- **Compatibilidad**: Máxima compatibilidad con navegadores web modernos (Chrome, Firefox, Safari, Edge)
- **Estructura**: Código modular y bien organizado

## Descripción del Juego

### Concepto General
Un juego de plataformas donde el jugador controla a un personaje similar a Iron Man, enfrentándose a enemigos tipo Ultron en niveles infinitos con dificultad progresiva.

### Mecánicas Principales
1. **Movimiento**: Caminar, saltar y volar (limitado)
2. **Combate**: Disparar rayos láser para defenderse
3. **Objetivo**: Recolectar todas las monedas del nivel para avanzar
4. **Progresión**: Niveles infinitos con dificultad creciente

## Especificaciones Detalladas

### 1. Personaje Principal (Iron Man)
- **Apariencia**: Robot estilo Iron Man (rojo y dorado)
- **Movimientos**: 
  - Caminar izquierda/derecha (teclas A/D o flechas)
  - Saltar (tecla W, espacio o flecha arriba)
  - Disparar rayos láser (clic del mouse o tecla X)
- **Físicas**: Afectado por gravedad, colisiones con plataformas
- **Animaciones**: Idle, caminar, saltar, disparar

### 2. Enemigos (Ultron)
- **Apariencia**: Robots tipo Ultron (plateado/negro)
- **Comportamiento**: 
  - Patrullaje básico en plataformas
  - Disparar rayos láser al jugador cuando esté en rango
  - Ser destruidos al recibir disparos del jugador
- **IA**: Detección del jugador y disparo automático

### 3. Escenario y Ambiente
- **Estilo visual**: Inspirado en Rayman Legends
  - Colores vibrantes y contrastantes
  - Fondos con múltiples capas de paralaje
  - Elementos orgánicos y fantásticos
- **Plataformas**: Variedad de plataformas, algunas móviles
- **Decoración**: Elementos que den vida al mundo

### 4. Sistema de Niveles
- **Generación**: Niveles infinitos con patrones predefinidos
- **Dificultad progresiva**:
  - Más enemigos por nivel
  - Plataformas más complejas
  - Mayor velocidad de enemigos
  - Menos monedas más difíciles de alcanzar
- **Objetivo**: Recolectar todas las monedas para completar el nivel

### 5. Interfaz de Usuario
- **Idioma**: Todo el texto en español
- **HUD**: 
  - Contador de monedas recolectadas/totales
  - Número de nivel actual
  - Vidas restantes
  - Puntuación
- **Menús**: Pantalla de inicio, pausa, game over

### 6. Elementos de Juego
- **Monedas**: Objetos recolectables dorados brillantes
- **Rayos láser**: Proyectiles del jugador y enemigos
- **Efectos visuales**: Explosiones, partículas, destellos

## Estructura de Archivos Requerida

```
ironman-plataformas-[TUS_INICIALES]/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── scenes/
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   └── GameOverScene.js
│   ├── entities/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   └── Coin.js
│   └── utils/
│       └── LevelGenerator.js
├── assets/
│   ├── sprites/
│   ├── sounds/
│   └── backgrounds/
└── prompts.md
```

## Plan de Desarrollo por Fases

### FASE 1: Configuración Base
- [ ] Estructura básica del proyecto
- [ ] Configuración de Phaser 3
- [ ] Escena básica con físicas
- [ ] Controles básicos del personaje principal

### FASE 2: Personaje Principal
- [ ] Sprite y animaciones de Iron Man
- [ ] Movimiento completo (caminar, saltar)
- [ ] Sistema de disparos del jugador
- [ ] Colisiones básicas

### FASE 3: Mundo del Juego
- [ ] Diseño de niveles básicos
- [ ] Sistema de plataformas
- [ ] Fondo estilo Rayman Legends
- [ ] Sistema de paralaje

### FASE 4: Enemigos y Combate
- [ ] Sprite y animaciones de Ultron
- [ ] IA básica de enemigos
- [ ] Sistema de disparos enemigos
- [ ] Detección de colisiones proyectil-jugador/enemigo

### FASE 5: Sistema de Juego
- [ ] Monedas recolectables
- [ ] Lógica de nivel completado
- [ ] Sistema de vidas y puntuación
- [ ] Interfaz de usuario en español

### FASE 6: Niveles Infinitos
- [ ] Generador de niveles procedural
- [ ] Sistema de dificultad progresiva
- [ ] Transiciones entre niveles

### FASE 7: Pulido y Optimización
- [ ] Efectos visuales y sonoros
- [ ] Optimización de rendimiento
- [ ] Compatibilidad cross-browser
- [ ] Testing y debugging

## Instrucciones Específicas para el Desarrollo

1. **Usar Phaser 3**: Implementar todo usando las mejores prácticas de Phaser 3
2. **Código limpio**: Comentarios en español, código bien estructurado
3. **Compatibilidad**: Asegurar funcionamiento en todos los navegadores principales
4. **Responsive**: El juego debe adaptarse a diferentes tamaños de pantalla
5. **Performance**: Optimizar para 60fps estables

## Textos del Juego (Todo en Español)

- **Menú principal**: "Iron Man vs Ultron", "Jugar", "Puntuaciones"
- **HUD**: "Nivel:", "Monedas:", "Vidas:", "Puntos:"
- **Fin de nivel**: "¡Nivel Completado!", "Siguiente Nivel"
- **Game Over**: "Fin del Juego", "Puntuación Final:", "Reintentar"

## Controles del Juego

- **Movimiento**: Teclas WASD o flechas direccionales
- **Salto**: Espacio o W o flecha arriba
- **Disparo**: Clic izquierdo del mouse o tecla X
- **Pausa**: Tecla P o ESC