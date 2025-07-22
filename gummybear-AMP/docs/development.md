# Documento Técnico de Implementación

## Cambios clave
- El personaje solo puede saltar obstáculos y recoger caramelos, no puede agacharse.
- Al perder, el botón de cambiar personaje lleva a la pantalla de selección de personaje.
- Si se intenta continuar sin personaje seleccionado, debe mostrarse un mensaje de error visual y claro.
- La selección de personaje debe ser visualmente llamativa (borde, animación, sombra, etc.) para indicar cuál está seleccionado.
- **Los obstáculos siempre aparecen a ras de suelo y solo pueden ser saltados.**
- **Las golosinas pueden aparecer aleatoriamente en el suelo o en el aire para ser recogidas saltando.**
- **El personaje solo puede saltar usando la tecla Flecha Arriba (no barra espaciadora).**
- **El salto del personaje es más largo para facilitar esquivar obstáculos.**
- **El fondo es único, infinito y seamless, con un suelo bien definido para que el personaje corra sobre él.**

## 1. Tecnologías y Herramientas
- **Lenguaje principal:** JavaScript (ES6+)
- **Renderizado:** HTML5 Canvas API
- **Estilos:** CSS3 (Flexbox y/o Grid para layout)
- **HTML:** HTML5 semántico
- **Gestión de recursos:** Carga de imágenes y sonidos mediante JavaScript
- **Librerías externas:**
  - [Howler.js](https://howlerjs.com/) v2.2.3 (opcional, para gestión de audio)
  - [p5.js](https://p5js.org/) v1.9.0 (opcional, solo si se prefiere para gráficos, pero Canvas nativo es recomendado)
- **Compatibilidad:** Google Chrome, Firefox, Edge, Safari (últimas 2 versiones)
- **Resolución recomendada:** 1280x720 px (responsive para tablets y móviles)

---

## 2. Estructura de Archivos y Carpetas
```
gummybear-AMP/
  index.html
  styles.css
  main.js
  assets/
    GummyBear.jpg
    gummybear_pirata.png
    gummybear_astronauta.png
    gummybear_policia.png
    (otras variaciones de personaje)
    obstacle1.png
    obstacle2.png
    candy.png
    background_forest_day.png
    background_forest_night.png
    background_city_day.png
    background_city_night.png
    key_up.png
    key_down.png
    key_space.png
    (otros recursos gráficos y de sonido)
  prompts.md
  requirements.md
  design.md
  development.md
```

---

## 3. Estructura de Código y Módulos

### 3.1. index.html
- Estructura semántica.
- Incluir `<canvas id="game-canvas">` para el área de juego.
- Incluir contenedores para pantallas superpuestas (nombre, selección, instrucciones, fin de juego).
- Incluir referencias a `styles.css`, `main.js` y librerías externas (Howler.js/p5.js si se usan).

### 3.2. styles.css
- Definir estilos globales, fuentes infantiles, colores suaves.
- Clases para cada pantalla (pantalla-principal, pantalla-nombre, pantalla-seleccion, pantalla-instrucciones, pantalla-juego, pantalla-fin).
- Estilos para botones grandes, inputs, encabezados, feedback visual.
- Responsive: media queries para tablets y móviles.

### 3.3. main.js
- **Estructura modular (IIFE o ES6 módulos si el entorno lo permite).**
- Módulos sugeridos:
  - `PantallaPrincipal`: Renderiza encabezado, título y botón de inicio.
  - `PantallaNombre`: Input de nombre, validación, feedback.
  - `PantallaSeleccionPersonaje`: Renderiza opciones, gestiona selección.
  - `PantallaInstrucciones`: Muestra controles y reglas.
  - `Juego`: Lógica principal, bucle de animación, control de estados.
  - `Personaje`: Clase para el jugador, animaciones, colisiones.
  - `Obstaculo`: Clase para obstáculos, movimiento, colisiones.
  - `Golosina`: Clase para golosinas, movimiento, colisiones.
  - `Fondo`: Gestión de paisajes y ciclo día/noche.
  - `AudioManager`: (opcional, si se usa Howler.js)
  - `UIManager`: Manejo de overlays, puntaje, mensajes.
- **Estados globales:**
  - `estadoActual`: ('principal', 'nombre', 'seleccion', 'instrucciones', 'jugando', 'fin')
  - `nombreJugador`, `personajeSeleccionado`, `puntaje`, etc.
- **Convenciones:**
  - Nombres de variables y funciones en español, camelCase.
  - Comentarios claros y documentación de funciones.

---

## 4. Flujos y Lógica de Pantallas

### 4.1. Pantalla Principal
- Renderizar encabezado con título "Gummybear Endless Runner" y cara de Gummybear (SVG o PNG).
- Botón "¡Empezar!" inicia flujo de ingreso de nombre.

### 4.2. Pantalla de Ingreso de Nombre
- Input de texto (solo letras, máx. 12 caracteres).
- Botón "¡Listo!" habilitado solo si el campo no está vacío.
- Al continuar, guardar nombre en variable global y pasar a selección de personaje.

### 4.3. Pantalla de Selección de Personaje
- Mostrar al menos 4 opciones (base + 3 variaciones).
- Al seleccionar, resaltar opción y habilitar botón "Continuar".
- Guardar selección en variable global.

### 4.4. Pantalla de Instrucciones
- Mostrar controles (teclas y/o botones táctiles), imágenes animadas.
- Explicar puntaje y objetivo con imágenes y poco texto.
- Botón "¡Jugar!" inicia el juego.

### 4.5. Pantalla de Juego
- Canvas ocupa el área central.
- Renderizar fondo, personaje, obstáculos, golosinas.
- Actualizar y mostrar puntaje y nombre.
- Controles:
  - Teclado: Solo Flecha Arriba para saltar.
  - Móvil: Botón grande en pantalla para saltar.
- Lógica de colisiones:
  - Si colisiona con obstáculo: termina juego.
  - Si recoge golosina: suma puntos.
- Obstáculos:
  - Siempre aparecen a ras de suelo y solo pueden ser saltados.
- Golosinas:
  - Pueden aparecer en el suelo o en el aire (aleatorio).
- Fondo:
  - Fondo único, infinito y seamless, con suelo bien definido.

### 4.6. Pantalla de Fin de Juego
- Mostrar puntaje final y nombre.
- Botón "Intentar de nuevo" reinicia juego.
- Botón "Cambiar personaje/nombre" vuelve a pantallas iniciales.

---

## 5. Detalles Técnicos Específicos

### 5.1. Canvas y Renderizado
- Tamaño recomendado: 1280x720 px (escalable).
- Escalar para dispositivos móviles usando CSS y/o ajuste de canvas.
- Todas las posiciones y tamaños deben ser proporcionales al tamaño del canvas.
- Animaciones mediante `requestAnimationFrame`.

### 5.2. Recursos Gráficos
- Formato PNG o SVG (transparente, fondo removido).
- Spritesheets para animaciones (correr, saltar, agacharse).
- Fondos en capas para parallax.
- Optimizar imágenes para carga rápida (< 200 KB por imagen).

### 5.3. Sonido
- Formato recomendado: OGG y/o MP3.
- Efectos: salto, recoger, colisión, sumar puntos, música de fondo.
- Volumen moderado, sin sonidos estridentes.
- Implementar mute global.

### 5.4. Accesibilidad y UX
- Botones y textos grandes (>32px).
- Contraste alto y colores suaves.
- Feedback visual y sonoro inmediato.
- Navegación por teclado y táctil.
- No usar temporizadores estrictos.
- No recolectar datos personales.

### 5.5. Convenciones de Código
- Variables y funciones en español, camelCase.
- Clases con mayúscula inicial.
- Un archivo JS principal, modularizado por funciones.
- Comentarios JSDoc para funciones y clases.

---

## 6. Librerías y Versiones
- **Howler.js:** v2.2.3 (https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js)
- **p5.js:** v1.9.0 (https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js) (opcional)
- **No usar frameworks pesados (React, Vue, Angular, etc.)**

---

## 7. Testing y Validación
- Probar en Chrome, Firefox, Edge, Safari (desktop y móvil).
- Validar controles táctiles y de teclado.
- Verificar feedback visual y sonoro.
- Revisar tiempos de carga y optimización de recursos.
- Validar accesibilidad (contraste, tamaño, navegación).

---

## 8. Entrega y Documentación
- Código limpio, comentado y estructurado.
- Incluir README con instrucciones de ejecución.
- Documentar dependencias y recursos utilizados.
- Adjuntar todos los assets en la carpeta correspondiente.
- Seguir estrictamente los lineamientos de design.md y requirements.md.

---

Este documento debe ser seguido al pie de la letra para asegurar una implementación técnica robusta, clara y sin ambigüedades del videojuego "Gummybear Endless Runner". 