## Iniciamos con verificacion de capacidad de Cursor para elaboarar el juego
## Prompts por su orde de respuestas en el archivo respuestas_prompts.md
1. Conoces el video juego packman?
2. Cual seria el mejor framework/liberira para desar un juego packman clonado?
3. que debo hacer para usar las liberia Phase o pj5?

# Prompts utilizados para el desarrollo de Packman - JFA
## Proceso de desarrollo

Prompt #4 
- "Creeme la estructura de archivos y recursos debajo de la carpeta packman-JFA para crear el juego de packman..."
Prompt #5
Vamos bien, ahora avancemos paso a paso para crear los prites y permitir el movimeinto de Pac-Man pro el laberito usando phaser.
1. Crear Sprites Necesarios
- Pac-Man (Personaje Principal)
- Laberito (dibujdo con bloques)
2. permitir el movimiento de Pac-Man por el laberito.

Promt#6 Correccion laberito
el laberito no eetsa bien construido. El juego debe incluir un laberinto en dos dimensiones por donde se moverá Pac-Man. El laberinto debe estar construido con una matriz bidimensional (array 2D), donde cada celda representa un bloque del mapa: pared, camino, punto comestible, etc.

Promt#6 crear movimeinto continuo
esta mejor el tamaño del laberinto pero el paso del cursor no permite alinear exactamente la ruta po donde debe pasar, sugiero que se ajuste el paso del cursor para que peuda girar a la derecha o izquierda arriba y abajo entrando por las areas permitidas.

Promt#7 - creear enemigos
Vamos muy bien con el resultado, ahora vamos a crear fantasmas con movimiento como enemigos de pac-man si hacen contacto con el el juego se dentendra. siempre debe haber una ruta de escape para pac-man nunca puede quedar cercado por fantasmas. Los fantas deben ser puntos de igual tamaño a pac-am pero color blanco. se deben mover autonomamente por todo el tablero, deben aparecer maximo 4 fantasmas en diferentes partes del tablero.

Prompt#8
cuando se detiene en juego por colisión de fantasma con pac-man se debe preguntar si se quiere reinicar o salir. Reinciar recarga la página y salir cierra la pagina. 

Promt#9. power pellets.
Quiero agregar otras funcionalidades, como los "power pellets" son puntos rojos que aparecen en el tablero cuando salen los fantasmas si pac-man los toca tiene la posibilidad de destruir el fantasma que toque, este poder durara solo 6 segundos despues de tocar el punto, los puntos rojos parenceran aleatoriamente en el tablero y al tocarlo pac-man se deben desaparacer, si son tocados por los fantasmas no pasa nada el punto rojo permanece. Tambien lleva la cuenta de puntos comidos por pac-man y un fantasma le dara 5 puntos adiconales cada que lo destrulla con el poder.

Promt#10. visualizar poder de destruccion de pac-man
es posible que cuando se active elpoder de destruccion de pac-man al comer un punto rojo , los fantasmas cambien de color de blanco a azul titilando blanco azul. Asi se indica hasta cuendo esa el efecto del punto.

Promt#11. ubicacion de mensaje de cierre
puedo mostrar el mensaje de game over en el centro de la pantalla?

Pormt#12 ganr y siguiente nivel.
cuando pac-man termine con todos los puntos blancos del tablero aunque aun existan fantasmas se gana el juego, en este momento debe aparecer un mensaje, desea cintinuar otro nivel o finalzizar. Al seleccionar continuar se desea crear un nuevo nivel, Crear nuevo, debe recrear un nuevo  laberito y aumentar la velocidad de pac-man y fantasmas.