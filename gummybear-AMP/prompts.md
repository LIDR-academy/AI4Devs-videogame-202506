# Historial de Prompts

**Modelo utilizado:** GPT-4.1 (Cursor)

## Prompts del usuario

**Prompt 1:**
analiza @README.md y dame una pauta de los pasos a seguir para la creacion de un videojuego, necesito definir como será el juego y como lo implementaré, librerías, etc.

**Prompt 2:**
la ide que tengo es un juego 2D donde se trate del personaje gummybear (osito gominola) debe ser similar al juego del dinosaurio en google chrome cuando no hay conexcion a internet, deben haber obstaculos para saltar y agacharse y comer gomitas o golosinas, el juego nunca se debe detener, sólo cuando pierda chocando con algún obstaculo y comienza de nuevo ¿que recomiendas para implementarlo?

**Prompt 3:**
primero documentalo todo en @requirements.md

**Prompt 4:**
sigamos refinando los requerimientos para eliminar ambiguedades... debe existir un sistema de puntuación, puntos por esquivar obstaculos y por comer golosinas, al perder se reinicia el marcador. la imagen o animacion de fondo debe ir cambiando de modo que parezca que pasa por varios paisajes, tambien debe cambiar del dia a la noche.

el enfoque de este juego debe ser para niños de 5 o 6 años.

actualiza @requirements.md con esta información

**Prompt 5:**
antes del juego se debe indicar las instrucciones del juego, como se acumlan puntos y con que teclas se puede jugar, debe ser muy grafico para que no haya ambiguedades y sea facil para los niños

actualiza @requirements.md 

**Prompt 6:**
la imagen base para el personaje del juego es @GummyBear.jpg al principio del juego debe dar la opcion de elegir personaje, estos serán variaciones del personaje base, como por ejemplo con distinta ropa o accesorios o tambien disfraces como pirata astronauta, policia, etc

actualiza @requirements.md 

**Prompt 7:**
Para que el juego sea mas personalizado debe permitir ingresar el nombre del niño antes de comenzar a jugar

actualiza @requirements.md 

**Prompt 8:**
eres un diseñador de videojuegos con experiencia en juegos infantiles. analiza @requirements.md y crea el archivo design.md con todas las caracteristicas del diseño lo mas detallado posible, debes considerar que este documento lo tomará un desarrollador y lo implementará, no pueden haber ambiguedades. Utiliza las mejora practicas de experiencia de usuario para que sea de facil uso para los niños

**Prompt 9:**
En la pantalla principal debe aparecer como encabezado el titulo del juego "Gummybear Endless Runner" con un diseño infantil y llamativo, con colores suaves y la cara de gummybear

actualiza @requirements.md y @design.md 

**Prompt 10:**
eres un experimentado lider tecnico en proyectos de videojuegos utilza los recursos @design.md @requirements.md @README.md para crear el documento tecnico de implementacion, considera que este documento será utilizado por un desarrollador, no debe tener ambiguedad, debe ser ultra tecnico con el mayor detalle posible, librerias, versiones, lenguajes, etc.

genera un nuevo documento development.md para documentar todo

**prompt 11:**
eres un desarrollador senior experto en el desarrollo de videojuegos infantiles.

analiza la documentacion @development.md para desarrollar el proyecto

**Prompt 12:**
genera la estructura base

**Prompt 13:**
ejecuta el plan de desarrollo antes mencionado

**Prompt 14:**
crea imagenes temporales y luego avanza con la logica y animaciones

**Prompt 15:**
instala ImageMagick

**Prompt 16:**
comienza por la animación básica del personaje y el fondo

**Prompt 17:**
necesito probar lo que llevas hecho

**Prompt 18:**
continua con la animación de cambio de fondo (día/noche y paisajes)

**Prompt 19:**
agrega la animación de golosinas y el sistema de puntaje

**Prompt 20:**
continua con la lógica de obstáculos y colisiones 

**Prompt 21:**
revisa el siguiente error en @main.js 

ReferenceError: Can't find variable: fondoImg

**Prompt 22:**
Necesito mejorar la proximidad entre personaje candy y obstaculos, siempre choca

el tamaño mas grande debe ser el del personaje. el mediano de los obstaculos y el mas pequeño las golosinas.

adaptalo para que queden los tamaños acorde

**Prompt 23:**
los distintos caramelos deben tener distintos puntajes

**Prompt 24:**
elimina la accion de agacharse, solo debe saltar obstaculos y comer caramelos

al perder, cuando en la pantalla pregunte si quieres cambiar de personaje no debes volver al principio, sino a la pantalla de seleccion de personaje

si seleccionas continuar y no hay personaje seleccionado debe indicar un mensaje con el error 

la seleccion del personaje debe ser llamativa para saber q personaje de seleccionó

actualiza @requirements.md @design.md @development.md segun corresponda

implementa estos cambios en el código del juego ahora

**Prompt 25:**
antes de ajustar los tamaños necesito tener imagenes reales del juego. genera los prompts necesarios para generar las imagenes externamente. se muy detallista para que queden todas uniformente y homogeneas

**Prompt 26:**
genera un documento con todos los prompts en formato .md para adjuntarlo en gemini y me genere todas las imgenes

**Prompt 27:**
genera un prompt describiendo esta imagen para poder generar otras modificando su aspecto @GummyBear.jpg 

**Prompt 28:**
se mas especifico en el prompt indicando formato tamaño y todo lo necesario para q sea facil adaptarlo al juego

**Prompt 29:**
mejora el prompt indicando en que posicion debe estar para adaptarse mejor al juego, caminando, corriendo o parado. lo q sea mejor

**Prompt 30:**
@prompts-imagenes.md mejora los prompts de las imagenes de fondo sobre paisajes todas tienen q tener inicios y finales suaves y similares para que no hayan cortes y sea loop infinito

**Prompt 31:**
@prompts-imagenes.md mejora el prompt forzando que todas las imagenes deben ser sin sombre, fondo transparente y formato png

**Prompt 32:**
mejora el prompt de los paisajes de fondo y deja solo uno debe ser estilo endless runner inicio y temino similares y suaves para generar efecto loop, como será solo una imagen tiene que ser algo muy llamativo como una tierra magica e imaginaria

**Prompt 33:**
mejora el prompt para que siempre tenga un suelo y sea mas realista que el personaje esta corriendo, la idea es que cuando despues agregues el personaje no pareciera que esta en el aire

**Prompt 34:**
mejora el prompt forzando a que el fondo sea un fondo infinito que será utilizado en un video juego endless runner

**Prompt 35:**
@main.js adapta el codigo para que los obstaculos siempre esten a ras de suelo para saltarlos, las golosinas pueden estar aleatoriamente en el suelo o en el aire para saltar. elimina que se puede saltar con la barra espaciadora. el personaje debe dar saltos mal largo ya que siempre choca con los obstaculos

**Prompt 36:**
@main.js los obstaculos y las golosinas deben cambiar aleatoriamente, estan saliendo simepre las mismas. el obstaculo y la golosina nunca deben coincidir en posición ni en lo mas minimo

**Prompt 37:**
@main.js la misma alerta debe existir al ingresar el nombre si se intenta avanzar y el nombre esta en blanco debe saltar una alerta

**Prompt 38:**
@main.js en la pantalla de como jugar, al lado del titulo ¿como jugar? debe ir la misma imagen del personaje seleccionado en la pantalla de "seleccion de personaje"

**Prompt 39:**
@main.js en cada pantalla debe existir el boton salir que te lleve a la pantalla inicial

**Prompt 40:**
@main.js la pagina que muestra el puntaje, el personaje al lado del titulo tambien debe ser acorde con el personaje seleccionado