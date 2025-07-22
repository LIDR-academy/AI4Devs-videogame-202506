# Primero se usó ChatGPT para crear los assets y que nos ayudara con la decisión del framework a utilizar

## Definir librería

**Prompt 1**

Necesito crear un videojuego que sea como un laberinto. Este debe correr en un navegador web. Con qué framework o librería de html/javascript/CSS/ debería hacerlo?

---

## Crear assets personaje principal

**Prompt 1**

Basándote en esas 3 imágenes, haz un sprite de un perro. El perro es blanco, similar a un Poodle. Debería ser un sprite con una vista lateral

---

**Prompt 2**

Crea otros sprites con el mismo diseño. Uno debe ser moviéndose a la izquierda, otro hacia la derecha, otro saltando, uno sentado con la lengua afuera, y otro mostrando la panza con las patas hacia arriba.

---

---

# Para generar el juego se utilizó Cursor

## ## Se diseñó un juego estilo laberinto.

**Prompt 1**

Eres un desarrollador expeto en videojuegos. Contruye una estructura para un juego estilo laberinto. Usa Phaser, el framework para html5.
No sé usar la librería, así que deberás escribir todo el código necesario para el juego corra por ti mismo.
Primero creemos la estructura de las carpetas. Debería verse así:

  │── index.html
  │── main.js
  │── assets/
  │    │── images/
  │    │── audio/

Executa los comandos necesario en python para crear estos directorios y archivos
Una vez que la estructura esté creada, completa index.html y main.js y verifica que phaser fue añadido correctamente

---

**Prompt 2**

Ahora añadiremos un persona principal al juego.

- El personaje principal es un perro.
- Asegurate de que el personaje se puede mover hacía la izquierda, derecha, saltar y tirar un objeto
- Todas los assets del personaje son de 50x50
- Los nombres de los archivos son las acciones del personaje, por ejemplo, stay es quieto, jump es saltando. La acción walk_right_1 y walk_right_2 son una secuencia, por lo que cuando el personaje camine, debe intercalar entre ambas imagenes. Lo mismo pasa con wlak_left_1 y walk_left_2
- Considera estas acciones para crear lógica básica de movimieno del juego e implementalas.
  @Phaser 

---

**Prompt 3**

pero si ejecuto index-html, no me muestra nada

---

**Prompt 4**

lo levanté como local, aún así no muestra nada más que el título (Snow Bros - Phaser)

---

**Prompt 5**

encontré el error, en el main.js, nunca cargaste let game = new Phaser.Game(config);

---

**Prompt 6**

añade algunas plataformas, las palataformas deberian ser verdes.

---

**Prompt 7**

las palataformas deberían ser un como un laberinto

---

**Prompt 8**

cuando me refería a un laberinto, me rewfería a esto. el persona debe comenzar en un extremo y llegar al otro 

---

**Prompt 9**

Si, un laberinto aleatorio cada vez
La esquina opuesta

---

**Prompt 10***

las paredes del laberinto deberían ser el asset wall.png pon un al lado de otro hasa crear una pared, rotandolo la imagen aleatoriamente para que parezcan diferentes bloques
@Phaser 

---

**Prompt 11**

cambia la meta, debería sel el asset prize.png

---

**Prompt 12**

Cambia el nombre dle juego a Shiro's journey

---

**Prompt 13**

Al llegar al premio, debería borrar todo en la pantalla y mostrar ene l centro lel asset winner.png, sobre la imagen el texto "Feliciades!" y bajo la imagen, el texto "Shiro ya no pasará hambre"

---

**Prompt 14**

cuando llegue al final, que la pantalla quede con lo indicado hasta que se presione la barra espaciadora, donde deberá iniciar todo desde 0

---

**Prompt 15**

al llegar a la meta da el error 
Uncaught TypeError: Cannot read properties of undefined (reading 'setVelocity')

Por otro lado, puedes aumentar la velicidad del personaje principal un 50%

---

---



## Definición y problemas:

Inicialmente se pensó en hacer un juego de laberinto con enemigos dentro, pero por temas de tiempo no se alcanzó a añadir (ni crear los sprites) de los enemigos.

No se presentaron mayores problemas, y los que se encontraron se pudieron solucionar facilmente.

El juego podría completarse y mejorarse con un poco más de tiempo.
