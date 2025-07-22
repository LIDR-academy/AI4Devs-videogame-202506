# Prompts para Generar Dodge Game con Phaser 3

## Prompt 1: Desarrollo Completo del Juego

### # Rol
Eres un experto desarrollador de juegos con Phaser 3 y JavaScript, especializado en juegos de plataformas estilo dodge game.

### # Objetivo
Dado el proyecto de juego dodge game Clone, desarrolla un juego completo y funcional con todas las mecánicas especificadas, siguiendo las mejores prácticas de Phaser 3.

### # Historia de Usuario: dodge game Clone
#### ## Resumen
Como desarrollador de juegos, deseo crear un juego de plataformas estilo dodge game usando Phaser 3 que incluya un personaje animado, enemigos que caen desde arriba, monedas coleccionables, y una plataforma única donde el jugador debe esquivar obstáculos y recolectar puntos. El juego debe ser completamente funcional con controles fluidos, efectos visuales, y sistema de vidas.

#### ## Descripción de la Funcionalidad
El juego debe incluir las siguientes características:

**Estructura del Proyecto:**
- index.html con CDN de Phaser 3.80.0 y estilos CSS integrados
- main.js con todo el código del juego (preload, create, update, funciones auxiliares)
- assets/images/ con sprites del personaje y elementos del juego
- README.md con documentación completa

**División de Archivos:**
- **index.html**: Contiene la estructura HTML básica, CDN de Phaser 3.80.0, y estilos CSS integrados para el canvas y fondo
- **main.js**: Contiene todo el código JavaScript del juego incluyendo configuración, preload, create, update, y todas las funciones del juego
- **CSS**: Integrado en el index.html con estilos para centrar el canvas, fondo degradado, y tipografía del juego

**Configuración del Juego:**
- Resolución: 800x600 píxeles
- Física: Arcade con gravedad 500
- Fondo: Imagen de cielo
- Plataforma: Una sola plataforma en la parte inferior

**Personaje Principal:**
- Sprites animados: Idle, Run, Jump, Fall, Hit
- Controles: Flechas izquierda/derecha para movimiento, flecha arriba para salto
- Física: Bounce 0.2, colisión con bordes del mundo
- Escala: 1.5

**Sistema de Enemigos:**
- Generación continua desde arriba cada 3 segundos
- Velocidad de caída: 60 píxeles/segundo
- Desaparición al tocar la plataforma
- Colisión con jugador causa pérdida de vida

**Sistema de Monedas:**
- Generación continua desde arriba cada 3.5 segundos
- Velocidad de caída: 40 píxeles/segundo
- Desaparición al tocar la plataforma o ser recolectadas
- +10 puntos por moneda recolectada

**Efectos Visuales:**
- Shake de cámara al recolectar monedas (50ms, 0.01 intensidad)
- Shake de cámara al recibir daño (200ms, 0.02 intensidad)
- Tinte rojo temporal al recibir daño
- Inmunidad temporal (transparencia 50% por 1 segundo)

**Sistema de Vidas:**
- 3 vidas iniciales
- -1 vida por tocar enemigo
- Game Over cuando las vidas llegan a 0
- Pantalla de Game Over con puntuación final y opción de reinicio

---

## Prompt 2: Optimización de Velocidades y Jugabilidad

### # Rol
Eres un experto en game design y balance de dificultad, especializado en ajustar parámetros de velocidad y frecuencia para optimizar la experiencia de juego.

### # Objetivo
Dado el juego dodge game Clone existente, optimiza las velocidades de caída y frecuencias de generación de elementos para crear una experiencia de juego equilibrada y divertida.

### # Historia de Usuario: Balance de Dificultad
#### ## Resumen
Como diseñador de juegos, necesito ajustar las velocidades de caída de enemigos y monedas, así como las frecuencias de generación, para que el juego sea desafiante pero no frustrante, permitiendo al jugador tiempo suficiente para reaccionar y moverse cómodamente.

#### ## Descripción de la Funcionalidad
Los ajustes deben incluir:

**Velocidades de Caída:**
- Monedas: Velocidad muy suave (40 píxeles/segundo)
- Enemigos: Velocidad moderada (60 píxeles/segundo)
- Tiempo de caída: 15 segundos para monedas, 10 segundos para enemigos

**Frecuencias de Generación:**
- Monedas: Cada 3.5 segundos
- Enemigos: Cada 3 segundos
- Evitar saturación de elementos en pantalla

**Balance de Dificultad:**
- Dificultad progresiva pero no abrumadora
- Tiempo suficiente para reaccionar y planificar movimientos
- Experiencia de juego fluida y entretenida

---

## Prompt 3: Sistema de Colisiones y Física

### # Rol
Eres un experto en física de juegos y sistemas de colisiones, especializado en implementar detección precisa de colisiones y respuestas físicas realistas.

### # Objetivo
Dado el juego dodge game Clone, implementa un sistema de colisiones robusto que maneje correctamente la interacción entre el jugador, enemigos, monedas y la plataforma.

### # Historia de Usuario: Sistema de Colisiones
#### ## Resumen
Como desarrollador de juegos, necesito implementar un sistema de colisiones que permita que los enemigos y monedas desaparezcan inmediatamente al tocar la plataforma, mientras que el jugador pueda moverse libremente sobre ella y recolectar monedas sin problemas.

#### ## Descripción de la Funcionalidad
El sistema debe incluir:

**Colisiones Destructivas:**
- Enemigos desaparecen al tocar la plataforma
- Monedas desaparecen al tocar la plataforma
- Función de callback para destruir elementos automáticamente

**Colisiones del Jugador:**
- Jugador puede moverse libremente sobre la plataforma
- Colisión con enemigos activa función hitEnemy
- Overlap con monedas activa función collectCoin

**Limpieza de Elementos:**
- Función cleanupElements para elementos fuera de pantalla
- Destrucción automática de elementos que salen de los límites
- Optimización de rendimiento evitando elementos perdidos

**Física del Juego:**
- Gravedad aplicada correctamente
- Velocidades de caída controladas
- Rebote del jugador en la plataforma

---

## Prompt 4: Animaciones y Efectos Visuales

### # Rol
Eres un experto en animaciones de juegos y efectos visuales, especializado en crear transiciones fluidas y efectos que mejoren la experiencia del usuario.

### # Objetivo
Dado el juego dodge game Clone, implementa un sistema completo de animaciones para el personaje y efectos visuales que hagan el juego más atractivo y responsivo.

### # Historia de Usuario: Sistema de Animaciones
#### ## Resumen
Como desarrollador de juegos, necesito implementar animaciones fluidas para el personaje principal y efectos visuales que proporcionen feedback inmediato al jugador sobre sus acciones y el estado del juego.

#### ## Descripción de la Funcionalidad
El sistema debe incluir:

**Animaciones del Personaje:**
- Idle: Animación de reposo (frames 0-10, 10 FPS, repetir infinito)
- Left/Right: Animación de carrera (frames 0-11, 15 FPS, repetir infinito)
- Jump: Animación de salto (frame 0, 10 FPS)
- Fall: Animación de caída (frame 0, 10 FPS)
- Hit: Animación de daño (frames 0-6, 10 FPS, sin repetir)

**Transiciones de Animación:**
- Cambio automático entre idle, run, jump, fall
- Flip horizontal para dirección izquierda/derecha
- Transiciones suaves entre estados

**Efectos Visuales:**
- Shake de cámara al recolectar monedas
- Shake de cámara al recibir daño
- Tinte rojo temporal al recibir daño
- Inmunidad temporal con transparencia
- Efectos de partículas (opcional)

**Feedback Visual:**
- Indicadores claros de estado del jugador
- Efectos que refuercen las acciones del usuario
- Mejora de la inmersión en el juego

---

## Prompt 5: Sistema de Puntuación y Game Over

### # Rol
Eres un experto en sistemas de puntuación y mecánicas de game over, especializado en crear sistemas que motiven al jugador y proporcionen una experiencia de juego completa.

### # Objetivo
Dado el juego dodge game Clone, implementa un sistema de puntuación atractivo y una pantalla de Game Over funcional que permita al jugador reiniciar el juego fácilmente.

### # Historia de Usuario: Sistema de Puntuación
#### ## Resumen
Como desarrollador de juegos, necesito implementar un sistema de puntuación que recompense al jugador por recolectar monedas y una pantalla de Game Over que muestre la puntuación final y permita reiniciar el juego.

#### ## Descripción de la Funcionalidad
El sistema debe incluir:

**Sistema de Puntuación:**
- +10 puntos por cada moneda recolectada
- Puntuación en tiempo real visible en pantalla
- Actualización inmediata al recolectar monedas
- Persistencia de puntuación durante la sesión

**Sistema de Vidas:**
- 3 vidas iniciales
- -1 vida por tocar enemigo
- Visualización de vidas restantes
- Inmunidad temporal tras recibir daño

**Pantalla de Game Over:**
- Activación cuando las vidas llegan a 0
- Pausa de la física del juego
- Tinte rojo del jugador
- Textos centrados: "GAME OVER", puntuación final, instrucciones
- Botón o tecla ENTER para reiniciar

**Función de Reinicio:**
- Reset completo de variables (score=0, lives=3)
- Limpieza de todos los elementos del juego
- Reinicio de la escena completa
- Restauración del estado inicial

**UI y Textos:**
- Puntuación en esquina superior izquierda
- Vidas en esquina superior derecha
- Estilos consistentes con el tema del juego
- Textos claros y legibles

---

## Prompt 6: Estructura de Archivos y Organización

### # Rol
Eres un experto en arquitectura de software y organización de proyectos de juegos, especializado en crear estructuras limpias y mantenibles.

### # Objetivo
Dado el juego dodge game Clone, organiza la estructura de archivos y la arquitectura del código para que sea fácil de mantener, entender y modificar.

### # Historia de Usuario: Organización del Proyecto
#### ## Resumen
Como desarrollador de juegos, necesito crear una estructura de proyecto clara y organizada que permita fácil mantenimiento, modificación y escalabilidad del juego dodge game Clone.

#### ## Descripción de la Funcionalidad
La estructura debe incluir:

**Organización de Archivos:**
```
dodgeGame-SP/
├── index.html          # HTML principal con CDN de Phaser y CSS integrado
├── main.js            # Código principal del juego (JavaScript)
├── README.md          # Documentación completa
└── assets/
    └── images/
        ├── sky.png
        ├── ground.png
        ├── coin.png
        ├── enemy.png
        └── Mask Dude/
            ├── Run.png
            ├── Idle.png
            ├── Jump.png
            ├── Fall.png
            └── Hit.png
```

**División de Responsabilidades por Archivo:**

**index.html:**
- Estructura HTML básica con DOCTYPE y meta tags
- Inclusión del CDN de Phaser 3.80.0
- Estilos CSS integrados para:
  - Centrado del canvas en pantalla
  - Fondo degradado azul cielo
  - Tipografía del juego
  - Estilos del body y html
- Referencia al archivo main.js con parámetro de versión para cache busting

**main.js:**
- Configuración completa del juego Phaser (tipo, ancho, alto, física)
- Función preload() para cargar todos los assets con cache busting
- Función create() para inicializar el juego, sprites, grupos y eventos
- Función update() para lógica de movimiento, animaciones y limpieza
- Funciones auxiliares: spawnEnemy(), spawnCoin(), cleanupElements()
- Funciones de colisión: hitEnemy(), collectCoin()
- Función gameOver() para manejo del fin del juego
- Variables globales del juego (score, lives, gameOver)

**CSS (Integrado en index.html):**
- Estilos para centrar el canvas horizontal y verticalmente
- Fondo degradado azul cielo (linear-gradient)
- Reset de márgenes y padding
- Tipografía y colores del juego
- Estilos responsivos básicos

**Estructura del Código:**
- Configuración del juego al inicio
- Variables globales bien definidas
- Funciones organizadas por responsabilidad
- Comentarios descriptivos en cada sección

**Documentación:**
- README.md con instrucciones completas
- Comentarios en el código explicando la lógica
- Guías de instalación y ejecución
- Descripción de características y controles

**Mantenibilidad:**
- Código modular y reutilizable
- Fácil modificación de parámetros
- Estructura escalable para nuevas características
- Separación clara de responsabilidades

---

## Prompt 7: Optimización de Rendimiento

### # Rol
Eres un experto en optimización de rendimiento de juegos, especializado en mejorar la eficiencia y fluidez de juegos desarrollados con Phaser 3.

### # Objetivo
Dado el juego dodge game Clone, optimiza el rendimiento para que funcione de manera fluida sin lag o problemas de FPS, especialmente con la generación continua de elementos.

### # Historia de Usuario: Optimización de Rendimiento
#### ## Resumen
Como desarrollador de juegos, necesito optimizar el rendimiento del juego dodge game Clone para que funcione de manera fluida, especialmente considerando la generación continua de enemigos y monedas que caen desde arriba.

#### ## Descripción de la Funcionalidad
Las optimizaciones deben incluir:

**Gestión de Memoria:**
- Limpieza automática de elementos fuera de pantalla
- Destrucción inmediata de elementos que tocan la plataforma
- Evitar acumulación de objetos en memoria
- Pool de objetos para reutilización (opcional)

**Optimización de Renderizado:**
- Uso eficiente de sprites y texturas
- Minimizar cambios de estado en cada frame
- Optimización de animaciones
- Reducir llamadas innecesarias a funciones

**Gestión de Colisiones:**
- Colisiones eficientes con grupos de objetos
- Evitar verificaciones redundantes
- Optimización de overlap y collider
- Limpieza periódica de elementos inactivos

**Control de Frecuencia:**
- Timers optimizados para generación de elementos
- Evitar saturación de elementos en pantalla
- Balance entre dificultad y rendimiento
- Monitoreo de FPS y uso de memoria

**Estructura de Datos:**
- Uso eficiente de arrays y objetos
- Minimizar búsquedas y iteraciones
- Optimización de acceso a propiedades
- Reducir complejidad algorítmica

---

