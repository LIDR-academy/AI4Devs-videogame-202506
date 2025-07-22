# Requisitos y Pauta de Desarrollo: Gummybear Endless Runner

## Cambios clave
- El personaje solo puede saltar obstáculos y recoger caramelos, no puede agacharse.
- Al perder, el botón de cambiar personaje lleva a la pantalla de selección de personaje, no al inicio.
- Si se intenta continuar sin personaje seleccionado, debe mostrarse un mensaje de error claro y visual.
- La selección de personaje debe ser llamativa y resaltar claramente el personaje elegido.
- **Los obstáculos siempre aparecen a ras de suelo y solo pueden ser saltados.**
- **Las golosinas pueden aparecer aleatoriamente en el suelo o en el aire para ser recogidas saltando.**
- **El personaje solo puede saltar usando la tecla Flecha Arriba (no barra espaciadora).**
- **El salto del personaje es más largo para facilitar esquivar obstáculos.**
- **El fondo es único, infinito y seamless, con un suelo bien definido para que el personaje corra sobre él.**

## Concepto del Juego
Juego 2D tipo endless runner donde el personaje principal es Gummybear (osito gominola). El jugador debe saltar y agacharse para esquivar obstáculos y recoger golosinas. El juego es infinito y solo termina cuando el jugador choca con un obstáculo, tras lo cual puede reiniciar.

**Enfoque:** El juego está diseñado para niños de 5 a 6 años, por lo que debe ser colorido, amigable, intuitivo y fácil de jugar.

## Encabezado de la Pantalla Principal
- En la pantalla principal debe aparecer como encabezado el título del juego: **"Gummybear Endless Runner"**.
- El título debe tener un diseño infantil y llamativo, utilizando colores suaves y amigables.
- Debe incluir la cara de Gummybear junto al texto o integrada en el diseño del título.
- El encabezado debe ser grande, estar centrado y ser lo primero que vea el usuario al ingresar al juego.

## Personalización: Ingreso del Nombre
Antes de comenzar a jugar, el juego debe mostrar una pantalla donde el niño pueda ingresar su nombre. Este nombre se usará para personalizar la experiencia, por ejemplo:
- Mostrar el nombre en la pantalla de juego y en la puntuación.
- Usar el nombre en mensajes de ánimo o felicitación.

La interfaz para ingresar el nombre debe ser sencilla, con un campo de texto grande y botones claros, adecuada para niños pequeños.

## Selección de Personaje (Pantalla Inicial)
Al principio del juego, se debe mostrar una pantalla donde el jugador pueda elegir su personaje. La imagen base será `GummyBear.jpg`, y se ofrecerán varias variaciones del personaje, por ejemplo:
- Diferente ropa o colores
- Accesorios (gafas, gorra, bufanda, etc.)
- Disfraces temáticos (pirata, astronauta, policía, etc.)

Cada variación debe ser visualmente atractiva y fácil de identificar para los niños. La selección debe ser gráfica, mostrando los personajes como íconos grandes y coloridos.

## Instrucciones Claras y Gráficas (Pantalla de Inicio)
Antes de comenzar el juego, se debe mostrar una pantalla de instrucciones muy visual y sencilla, que explique:

- **Cómo jugar:**
  - Mostrar imágenes o íconos grandes de las teclas a usar:
    - **Flecha Arriba** o **Barra Espaciadora**: Saltar
    - **Flecha Abajo**: Agacharse
  - Incluir animaciones o imágenes del personaje saltando y agachándose junto a las teclas correspondientes.
- **Cómo se acumulan puntos:**
  - Mostrar un obstáculo y una flecha indicando que al saltarlo o agacharse para esquivarlo se suman puntos.
  - Mostrar una golosina/gomita y una flecha indicando que al recogerla se suman puntos extra.
- **Objetivo:**
  - Esquivar todos los obstáculos y recoger la mayor cantidad de golosinas posibles.
  - El juego termina si chocas con un obstáculo, pero puedes volver a intentarlo.
- **Claridad visual:**
  - Usar colores vivos, íconos grandes y poco texto.
  - Instrucciones acompañadas de imágenes o animaciones para evitar ambigüedades.

## Mecánicas Principales
- **Movimiento automático:** Gummybear avanza automáticamente hacia la derecha.
- **Saltar:** El jugador puede saltar obstáculos (tecla Flecha Arriba).
- **Recoger golosinas:** Aparecen golosinas que el jugador puede recoger para sumar puntos. Las golosinas pueden estar en el suelo o en el aire (aleatorio).
- **Puntaje:**
  - Se otorgan puntos por cada obstáculo esquivado.
  - Se otorgan puntos adicionales por cada golosina recogida.
  - El puntaje se reinicia a cero cada vez que el jugador pierde y el juego comienza de nuevo.
- **Colisiones:** Si el personaje choca con un obstáculo, el juego termina y se puede reiniciar.
- **Fondo:**
  - El fondo es único, infinito y seamless, con un suelo bien definido para el personaje.

## Recursos Necesarios
- Sprites o imágenes para:
  - Gummybear base (`GummyBear.jpg`)
  - Variaciones del personaje (diferente ropa, accesorios, disfraces: pirata, astronauta, policía, etc.)
  - Animaciones de correr, saltar, agacharse para cada variación
  - Obstáculos (varios tipos, amigables y coloridos)
  - Golosinas/gomitas
  - Fondos para diferentes paisajes y versiones día/noche
  - Íconos grandes de teclas (flechas, barra espaciadora) para la pantalla de instrucciones
- Efectos de sonido (opcional): salto, recoger golosina, choque
- Música de fondo suave y alegre (opcional)

## Estructura de Archivos Sugerida
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
```

## Tecnologías y Librerías
- **HTML5 Canvas:** Para renderizar gráficos y animaciones.
- **JavaScript puro:** Para la lógica del juego, animaciones y control de eventos.
- **Opcional:**
  - [Howler.js](https://howlerjs.com/) para sonidos.
  - [p5.js](https://p5js.org/) si se prefiere una API más sencilla para gráficos.

## Pasos de Desarrollo
1. Definir y preparar los recursos gráficos y de sonido.
2. Crear la estructura base en HTML y CSS.
3. Implementar la pantalla de ingreso del nombre del niño.
4. Implementar la pantalla de selección de personaje con variaciones gráficas.
5. Implementar el canvas y el bucle principal del juego (`requestAnimationFrame`).
6. Programar el movimiento y animaciones de Gummybear y sus variaciones.
7. Generar y mover obstáculos y golosinas.
8. Detectar colisiones y gestionar el puntaje (sumar por esquivar y por recoger golosinas, reiniciar al perder).
9. Implementar el cambio de fondo y el ciclo día/noche.
10. Implementar la lógica de reinicio tras perder.
11. Crear la pantalla de instrucciones clara y gráfica antes de iniciar el juego.
12. Añadir sonidos, música y pulir detalles visuales.
13. Documentar el proceso y los prompts utilizados en `prompts.md`.

## Inspiración
- Juego del dinosaurio de Google Chrome (sin conexión).
- Juegos endless runner clásicos.
- Juegos para niños pequeños: colores vivos, personajes amigables, dificultad baja y controles simples.
