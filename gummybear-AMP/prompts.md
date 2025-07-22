# Historial de Prompts

- **Modelo utilizado:** GPT-4-turbo (OpenAI, junio 2024)
- **Nota:** Los prompts de [@prompts-imagenes.md](./prompts-imagenes.md) fueron ejecutados externamente en SORA para la generación de imágenes.


## Estadísticas de prompts

- 🔍 Análisis: 7
- 🎨 Diseño: 31
- 🛠️ Desarrollo: 14
- 🧪 Pruebas: 1
- 📊 Estadísticas: 5

**Total de prompts:** 58

---

## Prompts del usuario

**Prompt 1: 🔍 Análisis**
analiza @README.md y dame una pauta de los pasos a seguir para la creacion de un videojuego, necesito definir como será el juego y como lo implementaré, librerías, etc.

**Prompt 2: 🔍 Análisis**
la ide que tengo es un juego 2D donde se trate del personaje gummybear (osito gominola) debe ser similar al juego del dinosaurio en google chrome cuando no hay conexcion a internet, deben haber obstaculos para saltar y agacharse y comer gomitas o golosinas, el juego nunca se debe detener, sólo cuando pierda chocando con algún obstaculo y comienza de nuevo ¿que recomiendas para implementarlo?

**Prompt 3: 🔍 Análisis**
primero documentalo todo en @requirements.md

**Prompt 4: 🔍 Análisis**
sigamos refinando los requerimientos para eliminar ambiguedades... debe existir un sistema de puntuación, puntos por esquivar obstaculos y por comer golosinas, al perder se reinicia el marcador. la imagen o animacion de fondo debe ir cambiando de modo que parezca que pasa por varios paisajes, tambien debe cambiar del dia a la noche.

el enfoque de este juego debe ser para niños de 5 o 6 años.

actualiza @requirements.md con esta información

**Prompt 5: 🔍 Análisis**
antes del juego se debe indicar las instrucciones del juego, como se acumlan puntos y con que teclas se puede jugar, debe ser muy grafico para que no haya ambiguedades y sea facil para los niños

actualiza @requirements.md 

**Prompt 6: 🎨 Diseño**
la imagen base para el personaje del juego es @GummyBear.jpg al principio del juego debe dar la opcion de elegir personaje, estos serán variaciones del personaje base, como por ejemplo con distinta ropa o accesorios o tambien disfraces como pirata astronauta, policia, etc

actualiza @requirements.md 

**Prompt 7: 🎨 Diseño**
Para que el juego sea mas personalizado debe permitir ingresar el nombre del niño antes de comenzar a jugar

actualiza @requirements.md 

**Prompt 8: 🎨 Diseño**
eres un diseñador de videojuegos con experiencia en juegos infantiles. analiza @requirements.md y crea el archivo design.md con todas las caracteristicas del diseño lo mas detallado posible, debes considerar que este documento lo tomará un desarrollador y lo implementará, no pueden haber ambiguedades. Utiliza las mejora practicas de experiencia de usuario para que sea de facil uso para los niños

**Prompt 9: 🎨 Diseño**
En la pantalla principal debe aparecer como encabezado el titulo del juego "Gummybear Endless Runner" con un diseño infantil y llamativo, con colores suaves y la cara de gummybear

actualiza @requirements.md y @design.md 

**Prompt 10: 🔍 Análisis**
eres un experimentado lider tecnico en proyectos de videojuegos utilza los recursos @design.md @requirements.md @README.md para crear el documento tecnico de implementacion, considera que este documento será utilizado por un desarrollador, no debe tener ambiguedad, debe ser ultra tecnico con el mayor detalle posible, librerias, versiones, lenguajes, etc.

genera un nuevo documento development.md para documentar todo

**Prompt 11: 🔍 Análisis**
eres un desarrollador senior experto en el desarrollo de videojuegos infantiles.

analiza la documentacion @development.md para desarrollar el proyecto

**Prompt 12: 🛠️ Desarrollo**
genera la estructura base

**Prompt 13: 🛠️ Desarrollo**
ejecuta el plan de desarrollo antes mencionado

**Prompt 14: 🎨 Diseño**
crea imagenes temporales y luego avanza con la logica y animaciones

**Prompt 15: 🛠️ Desarrollo**
instala ImageMagick

**Prompt 16: 🛠️ Desarrollo**
comienza por la animación básica del personaje y el fondo

**Prompt 17: 🧪 Pruebas**
necesito probar lo que llevas hecho

**Prompt 18: 🎨 Diseño**
agrega la animación de cambio de fondo (día/noche y paisajes)

**Prompt 19: 🎨 Diseño**
agrega la animación de golosinas y el sistema de puntaje

**Prompt 20: 🛠️ Desarrollo**
continua con la lógica de obstáculos y colisiones 

**Prompt 21: 🛠️ Desarrollo**
revisa el siguiente error en @main.js 

ReferenceError: Can't find variable: fondoImg

**Prompt 22: 🎨 Diseño**
Necesito mejorar la proximidad entre personaje candy y obstaculos, siempre choca

el tamaño mas grande debe ser el del personaje. el mediano de los obstaculos y el mas pequeño las golosinas.

adaptalo para que queden los tamaños acorde

**Prompt 23: 🎨 Diseño**
los distintos caramelos deben tener distintos puntajes

**Prompt 24: 🛠️ Desarrollo**
elimina la accion de agacharse, solo debe saltar obstaculos y comer caramelos

al perder, cuando en la pantalla pregunte si quieres cambiar de personaje no debes volver al principio, sino a la pantalla de seleccion de personaje

si seleccionas continuar y no hay personaje seleccionado debe indicar un mensaje con el error 

la seleccion del personaje debe ser llamativa para saber q personaje de seleccionó

actualiza @requirements.md @design.md @development.md segun corresponda

implementa estos cambios en el código del juego ahora

**Prompt 25: 🎨 Diseño**
antes de ajustar los tamaños necesito tener imagenes reales del juego. genera los prompts necesarios para generar las imagenes externamente. se muy detallista para que queden todas uniformente y homogeneas

**Prompt 26: 🎨 Diseño**
genera un documento con todos los prompts en formato .md para adjuntarlo en gemini y me genere todas las imgenes

**Prompt 27: 🎨 Diseño**
genera un prompt describiendo esta imagen para poder generar otras modificando su aspecto @GummyBear.jpg 

**Prompt 28: 🎨 Diseño**
se mas especifico en el prompt indicando formato tamaño y todo lo necesario para q sea facil adaptarlo al juego

**Prompt 29: 🎨 Diseño**
mejora el prompt indicando en que posicion debe estar para adaptarse mejor al juego, caminando, corriendo o parado. lo q sea mejor

**Prompt 30: 🎨 Diseño**
@prompts-imagenes.md mejora los prompts de las imagenes de fondo sobre paisajes todas tienen q tener inicios y finales suaves y similares para que no hayan cortes y sea loop infinito

**Prompt 31: 🎨 Diseño**
@prompts-imagenes.md mejora el prompt forzando que todas las imagenes deben ser sin sombre, fondo transparente y formato png

**Prompt 32: 🎨 Diseño**
mejora el prompt de los paisajes de fondo y deja solo uno debe ser estilo endless runner inicio y temino similares y suaves para generar efecto loop, como será solo una imagen tiene que ser algo muy llamativo como una tierra magica e imaginaria

**Prompt 33: 🎨 Diseño**
mejora el prompt para que siempre tenga un suelo y sea mas realista que el personaje esta corriendo, la idea es que cuando despues agregues el personaje no pareciera que esta en el aire

**Prompt 34: 🎨 Diseño**
mejora el prompt forzando a que el fondo sea un fondo infinito que será utilizado en un video juego endless runner

**Prompt 35: 🛠️ Desarrollo**
@main.js adapta el codigo para que los obstaculos siempre esten a ras de suelo para saltarlos, las golosinas pueden estar aleatoriamente en el suelo o en el aire para saltar. elimina que se puede saltar con la barra espaciadora. el personaje debe dar saltos mal largo ya que siempre choca con los obstaculos

**Prompt 36: 🛠️ Desarrollo**
@main.js los obstaculos y las golosinas deben cambiar aleatoriamente, estan saliendo simepre las mismas. el obstaculo y la golosina nunca deben coincidir en posición ni en lo mas minimo

**Prompt 37: 🎨 Diseño**
@main.js la misma alerta debe existir al ingresar el nombre si se intenta avanzar y el nombre esta en blanco debe saltar una alerta

**Prompt 38: 🎨 Diseño**
@main.js en la pantalla de como jugar, al lado del titulo ¿como jugar? debe ir la misma imagen del personaje seleccionado en la pantalla de "seleccion de personaje"

**Prompt 39: 🛠️ Desarrollo**
@main.js en cada pantalla debe existir el boton salir que te lleve a la pantalla inicial

**Prompt 40: 🎨 Diseño**
@main.js la pagina que muestra el puntaje, el personaje al lado del titulo tambien debe ser acorde con el personaje seleccionado

**Prompt 41: 🛠️ Desarrollo**
@main.js asegurate que las golosinas con los obstaculos nunca se solapen

**Prompt 42: 🛠️ Desarrollo**
@main.js en la pantalla principal agrega el efecto para que la imagen del personaje pase corriendo por encima del titulo una y otra vez

**Prompt 43: 🎨 Diseño**
mejora el prompt, es mandatorio que sea un fondo infinito para ser utilizado en loop y no se noten los cortes entre cada imagen, el inicio y fin deben calzar perfectamente. busca ejemplos en internet o toma como ejemplos mario run o el juego de google chrome del dinosaurio que aparece cuando no hay conexion a internet. la imagen @background.png es un ejemplo de como NO debe ser la imagen ya que salen arboles cortados. Adapta el prompt para SORA, agrega todo el detalle posible, referencia, palabras claves, etc

**Prompt 44: 🎨 Diseño**
no funciona, modifica el prompt guiandote por esta imagen , fijate especificamente en el inicio y fin que calzan perfectamente

**Prompt 45: 🎨 Diseño**
@main.js para evitar confusiones, en la pantalla de ¿como jugar? se debe agregar una leyenda para indicar que imagenes corresponden a obstaculos y golosinas, es facil confundirse con las imagenes propias del fondo

**Prompt 46: 🎨 Diseño**
@main.js mejora el diseño de las pantallas previas al juego, son muy basicas y con fondo blanco, usa paleta de colores suaves y un diseño atractivo para niños de 5-6 años mejora el fondo botones letras

**Prompt 47: 🎨 Diseño**
@main.js en las pantallas de como jugar y de resultados la imagen del personaje al lado de los titulos, aparece gigante. arreglalo

**Prompt 48: 🎨 Diseño**
@main.js cambia el estilo del boton salir para que quede acorde al diseño general

en la pantalla propia del juego ajusta los efectos de burbujas y estrellas para q no entorpezcan el juego, en lo posible sobre el personaje, por ejemplo a la altura de montañas y el cielo

en la pantalla inicial sube un poco el personaje corriendo y que quede por sobre del contenedor blanco

**Prompt 49: 🎨 Diseño**
sube aun mas la imagen del personaje corriendo en la  pagina principal. asegurate que quede fuera el contenedor blanco @main.js 

**Prompt 50: 🛠️ Desarrollo**
@main.js indicame donde debo ajustar la altura y avance de cada salto, prefiero hacerlo manualmente

**Prompt 51: 📊 Estadísticas**
actualiza el nombre del modelo y version en @prompts.md 
debajo indica que los prompts de @prompts-imagenes.md fueron ejecutados externamente en SORA

enlaza el archivo @prompts-imagenes.md 

**Prompt 52: 📊 Estadísticas**
@prompts.md categoriza cada prompt y agregale un emoji representativo. luego lista todas las categorias e indica la cantidad de prompts de cada una, titula la seccion como "estadisticas de prompts"

**Prompt 53: 📊 Estadísticas**
@prompts.md analiza nuevamente el documento y recategoriza los prompts, necesito que sean menos categorias: analisis, diseño, desarrollo, pruebas, estadisticas, no olvides usar emojis para categorizar los prompts

**Prompt 54: 🛠️ Desarrollo**
crea un archivo readme propio del juego, lo mas detallado posible, e incluyelo en la carpeta correspondiente @/gummybear-AMP 

**Prompt 55: 🎨 Diseño**
agrega una seccion para capturas de pantalla

**Prompt 56: 📊 Estadísticas**
analiza todas las conversaciones del chat, describe el proceso de desarrollo del juego, incluyendo cualquier desafío enfrentado y cómo se solucionó.

agrega un apartado titulado "conclusiones del proceso" y agregalo al final de @prompts.md 

**Prompt 57: 🎨 Diseño**
@main.js aegurate que la pantalla de juego este bien alineada, está solapada con el fondo

**Prompt 58: 📊 Estadísticas**
@prompts.md categoriza los prompts que no tengan asignadas una categoria, y agregale una categoria, luego actualiza la lista.

---

## Proceso de desarrollo

El desarrollo de **Gummybear Endless Runner** fue un proceso iterativo y colaborativo, guiado por una serie de prompts detallados y enfocados en la experiencia de usuario para niños pequeños. A continuación se describe el proceso y los principales desafíos enfrentados:

1. **Análisis y definición:**
   - Se partió de una idea base inspirada en el juego del dinosaurio de Google Chrome, adaptada para un público infantil.
   - Se definieron los requerimientos, mecánicas, personalización y el enfoque visual del juego.
   - Se documentaron los requisitos y el diseño en archivos dedicados para facilitar la implementación.

2. **Diseño y recursos:**
   - Se diseñaron pantallas amigables, coloridas y accesibles, con instrucciones visuales y leyendas para evitar confusiones.
   - Se generaron prompts detallados para crear imágenes homogéneas y mágicas usando IA (SORA), asegurando fondos tileables y elementos visuales atractivos.
   - Se implementó la selección de personajes, personalización con nombre y variaciones visuales.

3. **Desarrollo técnico:**
   - Se estructuró el código en archivos claros (`main.js`, `styles.css`, etc.) y se implementó la lógica de juego, animaciones y controles.
   - Se resolvieron problemas de colisiones, superposición de elementos y ajuste de tamaños para que el juego fuera justo y divertido.
   - Se mejoró la experiencia visual con fondos animados, decoraciones y botones amigables.
   - Se agregaron mensajes de error y validaciones para una experiencia robusta.

4. **Pruebas y ajustes:**
   - Se realizaron pruebas continuas, ajustando la jugabilidad, la claridad de las instrucciones y la visibilidad de los elementos.
   - Se incorporaron sugerencias para evitar confusiones entre elementos del fondo y los interactivos.
   - Se mejoró la accesibilidad y la estética general del juego.

5. **Documentación y estadísticas:**
   - Se mantuvo un historial detallado de prompts y decisiones.
   - Se generó un README completo y se documentaron los prompts de imágenes y el proceso de desarrollo.

### Principales desafíos y soluciones

- **Fondos tileables y mágicos:**
  - Desafío: Lograr un fondo que sea perfectamente tileable y a la vez atractivo y mágico para niños.
  - Solución: Iterar sobre los prompts de generación de imágenes, tomando referencias de juegos clásicos y forzando la continuidad en los bordes.

- **Evitar solapamiento de obstáculos y golosinas:**
  - Desafío: Que nunca se superpongan en pantalla.
  - Solución: Implementar lógica de detección de colisiones antes de agregar nuevos elementos.

- **Claridad visual y usabilidad:**
  - Desafío: Que los niños no confundan elementos del fondo con los interactivos.
  - Solución: Agregar leyendas visuales, mejorar el contraste y el diseño de los elementos clave.

- **Personalización y feedback:**
  - Desafío: Hacer el juego personalizable y con feedback inmediato.
  - Solución: Permitir ingresar nombre, elegir personaje y mostrar mensajes claros en cada pantalla.

- **Estética y experiencia de usuario:**
  - Desafío: Crear una experiencia visualmente atractiva y amigable para niños pequeños.
  - Solución: Usar paletas de colores pastel, botones grandes, tipografía amigable y decoraciones lúdicas.

### Conclusiones del proceso

El desarrollo de Gummybear Endless Runner demostró la importancia de la iteración, la atención al detalle y la empatía con el usuario final (niños pequeños). La colaboración entre diseño, desarrollo y generación de recursos visuales con IA permitió crear un producto homogéneo, accesible y divertido. Los desafíos técnicos y de experiencia se resolvieron con creatividad y pruebas constantes, resultando en un juego robusto, visualmente atractivo y fácil de usar para su público objetivo.

