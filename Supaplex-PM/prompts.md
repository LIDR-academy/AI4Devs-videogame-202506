# Prompts y seguimiento de desarrollo - Supaplex Lite

**Autor:** Pavel Mollinedo
**Fecha:** 21/Julio/2025

---

## Estructura y arranque del proyecto

- "Quiero crear una copia del juego llamado Supaplex, ¿cuál será la mejor librería o framework para el juego de plataforma de navegador de HTML5/CSS/Javascript para crearlo?"
- "Crea la estructura base en Phaser 3, pero ten en cuenta que necesito que te comportes como desarrollador de juegos senior con 20 años de experiencia, tu tarea es estructurar los archivos para crear una copia ligera del juego Supaplex. No quiero escribir ninguna sola línea de código, así que maneja toda la creación y configuración de archivos necesarios. Ejecuta todos los comandos necesarios con Python para crear los directorios y archivos. Una vez creada la estructura, completa el index.html y main.js y verifica que Phaser se haya añadido correctamente."
- "Puedes ayudarme creando la estructura y los archivos con los contenidos dentro por favor"
- "quiero que me ayudes con la lógica básica del juego, pero antes puedes verificar si todo quedó correcto?"

---

## Funcionalidad básica y visual

- "agreguemos y mejoremos más elementos visuales, comencemos con el caracter principal, puedes colocarle una forma más parecida al del juego original"
- "mejoremos los elementos visuales del entorno, agrega estos elementos para que sean muy similares al original"
- "ahora por favor agrega los elementos que faltan, como lo que come y algunas de las formas que debe recolectar para ganar el juego"
- "no funcionó que desaparecen cuando pasa encima puedes verificar?"
- "los chips verdes siguen sin desaparecer y las etiquetas debes colocarlas por fuera del recuadro del juego y no están funcionando bien."
- "corrijamos primero lo de los circuitos verdes, ahora sí funcionó pero no con todos, seguramente hay algún inconveniente en algún caso en particular, puedes revisar y corregir por favor"
- "quiero que me ayudes con la lógica básica del juego, pero antes puedes verificar si todo quedó correcto?"

---

## HUD y reinicio

- "Se siguen mostrando encima del juego"
- "persiste el problema, puedes correrlos para arriba y aprovechando puedes incluir un botón con la etiqueta 'Reiniciar' para que comience el juego nuevamente"
- "Ok no se muestra ningún botón y las etiquetas siguen encima del tablero de juego"
- "creo que cometí el error de aplicar el cambio de las etiquetas en el archivo GameScene.js. puedes ayudarme a arreglarlo ya que no debería estar ahí, y ya agregué el código correcto al archivo index.html"
- "ahora no se ve nada, podríamos regresar los últimos cambios"
- "esta incorrecto, puedes validar cada uno de los archivos y que código debe tener cada archivo porque sigue mostrando todo en negro"

---

## Gravedad y elementos flotantes

- "El botón reiniciar debe comenzar el nivel nuevamente pero no está pintando de nuevo todos los elementos y reiniciando los contadores de recolección de discos"
- "los chips verdes siguen sin desaparecer y las etiquetas debes colocarlas por fuera del recuadro del juego y no están funcionando bien."
- "Vamos ahora con un elemento importante, las bombas. ¿Podrías ayudarme a crear las bombas por favor?"
- "Esta muy bien pero ahora tenemos que implementar la funcionalidad de la gravedad. Si revisas en supaplex cuando Murphy se come un circuito verde, lo que está arriba cae como simulando gravedad hasta donde existe algún otro elemento y no deja que siga bajando. ¿Puedes ayudarme a crear esa funcionalidad?"

---

## Gravedad animada y rodamiento

- "solo recuerda que debes indicarme en que archivo colocar cada inciso, en este caso me diste el A, B y C. ¿Puedes indicarme en que archivo debo colocar cada uno?"
- "Vamos bien, pero debemos corregir algo. Al reiniciar un nuevo juego no pueden haber elementos que no tengan obstáculo, si no lo lógico debe ser que caigan. Al primer movimiento dichos elementos caen de forma correcta pero entonces no deben pintarse en esas posiciones, si no como que ya estuvieran aplicados los métodos de gravedad."
- "nuevamente todo negro, podemos revisar nuevamente los archivos por favor. Aunque creo que únicamente el GameScene.js es quien tiene algún inconveniente porque solo ese archivo actualicé antes del cambio"
- "Perfecto ya funciona nuevamente. Ahora como arreglamos el problema de objetos flotando?"

---

## Eliminación de discos naranjas y mejora visual de infotrons

- "Antes de regresar a la corrección de los objetos flotantes, puedes por favor eliminar los discos naranjas, en esta versión lite vamos a eliminarlos de momento"
- "¿Crees que podemos mejorar la imagen de los discos celestes para que sean más parecidos al del juego original?"

---

## Empuje de bombas y gravedad animada

- "Debemos corregir otro problema, las bombas no se las come Murphy, estos elementos los puede empujar siempre y cuando no exista otro obstáculo al lado opuesto hacia donde quiere moverlo. ¿Podemos implementar esa funcionalidad?"
- "¿Crees que habrá forma de hacer el efecto que cuando los objetos caen lo hagan de una forma más lenta que de la impresión que si están cayendo. En este momento solo aparecen y desaparecen lo cual no da el efecto deseado."

---

## Independencia de gravedad y movimiento de Murphy

- "Excelente se ve mucho mejor, sin embargo cuando está cayendo ya no puedo avanzar con Murphy, ¿crees que puedes solventar ese problema?"
- "no funcionó, por favor des hagamos este último cambio"
- "Se está quedando trabado Murphy, puedes verificar por favor"
- "aun se queda trabado"
- "no no a eso no me refería, solo necesito que deshagas el último cambio porque ahora Murphy no se mueve con agilidad."
- "no lo arreglaste, ahora sigue Murphy moviéndose lento ya no es independiente el movimiento a la caída, por favor regresa a la versión donde esa parte sí funcionaba y el aplastamiento funcionaba aunque mal"

---

## Rodamiento fiel a Supaplex

- "Hagamos otra corrección antes de arreglar el aplastamiento, recuerda que cuando dos o más elementos (bombas o discos) en forma vertical no pueden sostenerse mientras no haya soporte a los lados. Es decir si hay dos bombas una encima de la otra y a uno de los lados no existe soporte, la bomba debe caer hacia ese lado. ¿Puedes corroborar esa funcionalidad en Supaplex e implementarla?"
- "casi pero se está comportando incorrecto cuando no hay hacia donde caer y únicamente se mueve el elemento hacia un lado. El elemento debe caer hacia un lado y abajo, no únicamente moverse hacia un lado."
- "mejor pero no puede caer en la misma posición que Murphy y tampoco puede atravesarlo. Si Murphy está en ese lugar equivale a que hay soporte y el objeto no se puede mover hasta que Murphy se mueva a otra posición."
- "ya casi lo tenemos, únicamente ayúdame a arreglar el aplastado, sigue sin funcionar y ya lo habías logrado"
- "de nuevo no funciona el aplastado, cuando le cae un objeto a Murphy encima debe aplastarlo, por favor arregla esa funcionalidad"
- "aun no funciona el aplastado"
- "No está funcionando el aplastado, cuando el objeto o elemento roda o cae hacia Murphy debe aplastarlo, por favor arregla esa funcionalidad"
- "No está aplastando en ningún caso, por favor corrige esta funcionalidad."
- "Como esta es una tarea de ejercicio, necesito como parte de mi entregable dar un archivo prompts.md con todos los prompts y poder hacer un seguimiento de lo que hemos tenido en esta conversación, ¿puedes por favor darme la información para agregarlo al archivo que está bajo la carpeta Supaplex-PM con nombre prompts.md?"

---

## Lecciones aprendidas

- La física de Supaplex requiere validar cuidadosamente el orden de movimiento de Murphy y la gravedad.
- El aplastamiento de Murphy debe validarse justo después de mover los objetos, no antes.
- El rodamiento y la caída de objetos deben considerar la posición de Murphy para evitar atravesarlo o aplastarlo incorrectamente.
- Es fundamental validar cada cambio con ejemplos concretos y casos límite.
- La colaboración y la iteración son clave para lograr una simulación fiel a un clásico como Supaplex.

---

## Dificultades encontradas

- Implementar el aplastamiento fiel a Supaplex requiere coordinar el orden de actualización de Murphy y la gravedad.
- El rodamiento diagonal y la interacción con Murphy presentan casos límite complejos.
- La validación visual y lógica de cada cambio es esencial para evitar bugs sutiles.
- La independencia entre el input de Murphy y la animación de gravedad puede generar condiciones de carrera si no se maneja cuidadosamente.

---

## Referencias

- [Supaplex en Wikipedia](https://es.wikipedia.org/wiki/Supaplex)
- [Supaplex Mechanics (fan documentation)](https://www.elmerproductions.com/sp/)
- [Phaser 3 Documentation](https://phaser.io/docs/3.55.2)

---

**Fin del seguimiento de prompts y desarrollo.**
