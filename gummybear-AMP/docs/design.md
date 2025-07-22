# Diseño de Juego: Gummybear Endless Runner

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

## 1. Público Objetivo
- Niños y niñas de 5 a 6 años.
- Requiere máxima claridad visual, controles simples y retroalimentación positiva.

## 2. Estructura General de Pantallas
1. **Pantalla Principal (Encabezado y bienvenida)**
2. **Pantalla de Ingreso de Nombre**
3. **Pantalla de Selección de Personaje**
4. **Pantalla de Instrucciones**
5. **Pantalla de Juego**
6. **Pantalla de Fin de Juego / Reinicio**

---

## 3. Pantalla Principal (Encabezado y bienvenida)
- **Encabezado:**
  - Mostrar el título del juego: "Gummybear Endless Runner".
  - El título debe tener un diseño infantil y llamativo, con colores suaves y amigables.
  - Incluir la cara de Gummybear junto al texto o integrada en el diseño del título.
  - El encabezado debe ser grande, estar centrado y ser lo primero que vea el usuario.
- **Botón para comenzar:** Grande, colorido, con texto como "¡Empezar!" que lleve a la pantalla de ingreso de nombre.

---

## 4. Pantalla de Ingreso de Nombre
- **Elemento principal:** Campo de texto grande y centrado para ingresar el nombre.
- **Botón de continuar:** Grande, colorido, con texto "¡Listo!" o similar.
- **Teclado virtual (opcional):** Si se implementa en dispositivos táctiles.
- **Validación:** Solo permite letras, máximo 12 caracteres. Si el campo está vacío, el botón de continuar está deshabilitado.
- **Feedback:** Mensaje animado de bienvenida con el nombre ingresado al continuar.

---

## 5. Pantalla de Selección de Personaje
- **Visualización:** Muestra la imagen base de Gummybear y al menos 3 variaciones (ropa, accesorios, disfraces: pirata, astronauta, policía, etc.).
- **Selección:** Cada personaje es un botón grande e ilustrado. Al hacer clic/tocar, se resalta la selección.
- **Nombre del personaje:** Opcional, debajo de cada imagen.
- **Botón de continuar:** Solo habilitado tras seleccionar un personaje.
- **Accesibilidad:** Los personajes deben ser fácilmente distinguibles por color y forma.

---

## 6. Pantalla de Instrucciones
- **Explicación visual:**
  - Íconos grandes de teclas: Flecha Arriba (saltar).
  - Animaciones o imágenes del personaje saltando.
  - Flechas y símbolos para indicar acciones.
- **Cómo se acumulan puntos:**
  - Imagen de obstáculo con flecha y texto: "¡Salta o agáchate para sumar puntos!"
  - Imagen de golosina con flecha y texto: "¡Recoge golosinas para puntos extra!"
- **Objetivo:**
  - Texto breve y claro: "¡Evita los obstáculos y recoge todas las golosinas que puedas!"
- **Botón de comenzar:** Grande, colorido, con texto "¡Jugar!".
- **Poco texto:** Priorizar imágenes y animaciones.

---

## 7. Pantalla de Juego
- **Canvas central:** Todo el juego ocurre en un área central, sin elementos que distraigan.
- **Personaje:**
  - Animación fluida de correr y saltar.
  - Siempre visible y centrado verticalmente.
- **Controles:**
  - Teclado: Solo Flecha Arriba para saltar.
  - Botón táctil grande (en dispositivos móviles): "Saltar".
- **Obstáculos:**
  - Siempre aparecen a ras de suelo y solo pueden ser saltados.
  - Formas y colores amigables, nunca amenazantes.
  - Aparecen a intervalos regulares, con dificultad progresiva muy suave.
- **Golosinas:**
  - Claramente distinguibles, animadas, con efecto visual al recogerlas.
  - Pueden aparecer en el suelo o en el aire (aleatorio).
- **Fondo:**
  - Fondo único, infinito y seamless, con suelo bien definido.
- **Puntaje:**
  - Siempre visible en la esquina superior izquierda, junto al nombre del niño.
  - Animación al sumar puntos.
- **Feedback:**
  - Sonidos suaves y positivos al saltar, recoger golosinas y sumar puntos.
  - Mensajes de ánimo breves y visuales ("¡Genial, [nombre]!", "¡Sigue así!").
- **Dificultad:**
  - Progresión muy gradual. El objetivo es la diversión, no el reto.

---

## 8. Pantalla de Fin de Juego / Reinicio
- **Mensaje:** "¡Buen intento, [nombre]!"
- **Puntaje final:** Grande y destacado.
- **Botón de volver a jugar:** Grande, colorido, con texto "¡Intentar de nuevo!"
- **Botón de cambiar personaje o nombre:** Opcional, para volver a las pantallas iniciales.
- **Animación:** El personaje puede mostrar una reacción simpática (no triste).

---

## 9. Experiencia de Usuario y Accesibilidad
- **Colores vivos y contrastantes.**
- **Botones grandes y bien espaciados.**
- **Animaciones suaves y amigables.**
- **Texto en tipografía grande y legible.**
- **Evitar sobrecarga de información.**
- **Feedback inmediato y positivo en cada acción.**
- **Todos los elementos interactivos deben ser accesibles por teclado y táctil.**
- **No usar temporizadores estrictos ni penalizaciones severas.**

---

## 10. Recursos Gráficos y Sonoros
- **Sprites:**
  - Personaje base y variaciones (ropa, accesorios, disfraces).
  - Animaciones de correr, saltar, agacharse.
  - Obstáculos y golosinas.
  - Fondos para paisajes y ciclos día/noche.
  - Íconos de teclas y botones.
- **Sonidos:**
  - Efectos suaves para saltar, recoger, sumar puntos y perder.
  - Música de fondo alegre y no repetitiva.

---

## 11. Detalles Técnicos y de Implementación
- **Canvas HTML5** para el área de juego.
- **JavaScript puro** para la lógica y animaciones.
- **Carga de recursos optimizada** para tiempos de espera mínimos.
- **Responsive:** Adaptar a pantallas de tablets y móviles.
- **Separar lógica de juego, renderizado y control de usuario en módulos claros.**
- **Variables y funciones con nombres descriptivos y en español.**
- **Documentar el código para facilitar el mantenimiento.**

---

## 12. Flujo de Usuario (Resumen)
1. Ingresar nombre → 2. Elegir personaje → 3. Ver instrucciones → 4. Jugar → 5. Ver puntaje y reiniciar o cambiar personaje/nombre.

---

## 13. Buenas Prácticas de UX para Niños
- **Evitar frustración:** El juego nunca debe ser demasiado difícil ni castigar al jugador.
- **Celebrar logros:** Mensajes y animaciones positivas al sumar puntos o mejorar el puntaje.
- **Permitir exploración:** El niño puede cambiar de personaje o nombre fácilmente.
- **Claridad:** Todo debe ser comprensible sin necesidad de leer mucho texto.
- **Seguridad:** No recolectar datos personales ni mostrar publicidad.

---

Este documento debe ser seguido al pie de la letra para asegurar una experiencia de juego óptima, segura y divertida para niños pequeños. 