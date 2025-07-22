# Descripción de herramientas

## Branstorming y base de conocimiento técnico

* Producto: Claude Desktop
* Modelo: Sonnet 4

## Codificación

* Cursor AI + Claude Code

# Fase #1: Brainstorming

## Conversación con el modelo para elegir el juego a crear

```markdown
Necesito construir un juego con ayuda de un copiloto de código como CursorAI o Claude Code. Para ello, mi idea es crear un clon de algún juego famoso, pero aún no me decido cual, no tengo ideas, estoy en blanco. Quisiera que cumpliera con lo siguiente:

* Debe ser un juego con partidas, donde haya un inicio y un fin

* Un juego muy divertido y adictivo, que invite a la repetición (los que mejor funcionan, son los que generan algo de frustración por su absurda complejidad). Por ejemplo: Flappy Bird

* Un juego que sea fácil de implementar desde cero, en 2D, algo plano y sin mecánicas o físicas muy complejas
  
* Tener en cuenta que nunca he hecho un juego en mi vida, pero que soy un desarrollador de software con más de 12 años de experiencia
  
Necesito que me entregues un listado de juegos que cumplan con estas características, para clonarlo con un desarrollo asistido por AI. Como plus, propón un factor diferenciador a cada opción para no hacer una réplica exacta del juego original
```

## Resolver las dudas del modelo antes de iniciar

```markdown
Quiero esta opción:

Breakout Evolutivo
* Por qué es perfecto: Física de rebote simple, progresión clara
* Factor diferenciador: Los bloques "aprenden" y se reorganizan entre niveles, algunos bloques se "vengan" disparándote de vuelta

Hazme todas las preguntas que necesites para poder comenzar con el desarrollo de este juego y así poder indicarle al copiloto de código con AI de mi preferencia, las instrucciones para cumplir mi objetivo
```

## Resultado luego de resolver las preguntas

Luego de resolver las preguntas, Claude Desktop me generó un brief técnico para la construcción del juego con un copiloto de AI. 

Ver documento completo: [game-design-document.md](../breakout-JPM/game-design-document.md)

# Fase #2: Codificación

## Prompt #1

```markdown
Necesito crear un juego Breakout Evolutivo en 3 días usando HTML5, CSS3, JavaScript y Phaser 3. El juego tiene bloques que 'aprenden' y se reorganizan según patrones de impacto, bloques 'venganza' que disparan proyectiles, y múltiples pelotas en niveles avanzados.

Sigue exactamente el brief técnico adjunto en @game-design-document.md. Empezamos por el setup básico: crear la estructura de archivos, configurar Phaser 3 via CDN, crear la paleta controlable por mouse, y una pelota que rebote con física arcade básica.

Implementa paso a paso según el cronograma de 3 días. Pregúntame si necesitas aclaraciones sobre las mecánicas de IA de bloques o el sistema de venganza
```

## Prompt #2 (Correcciones)

```markdown
Varias cosas:

1. Quiero que modifiques la física de la pelota porque cuando la golpeo de lado o de perfíl, rebota mucho con los costados. Quiero un movimiento más vertical cuando golpee la pelota de ese modo, ya que actualmente, cuando le pego de perfil, debo esperar mucho a que la pelota rebote contra un bloque o contra la base 

2. Cuando la pelota golpea el suelo, debería salir Game over o debería perder la partida, eso no está pasando actualmente

3. Quiero que crees un README básico con la explicación de la base de código del juego. Se concreto y no seas muy verboso, quiero entender esto debido a que nunca he desarrollado un juego en mi vida y quiero entender la lógica detrás de las unidades de código que componente este juego, así lograré ubicarme en las carpetas y archivos del mismo
```

## Prompt #3 (Correcciones)

```markdown
Ahora, cuando inicio el juego, la pelota no se mueve, se queda estática en el aire
```

## Prompt #4 (Correcciones)

```markdown
Lograste que la pelota se moviera, pero:
  
  1. Cuando golpea el primer bloque, no retorna, sigue rompiendo bloques\
  2. Luego de romper todos los bloques, la pelota literalmente salió de la pantalla y nunca más regresó
```

## Prompt #5 (Correcciones)

```markdown
Aún no se ha corregido, siguen estas fallas:

  1. La pelota al golpear contra un bloqueo, no rebota, sigue rompiendo más bloques\
  2. La pelota ya no se pierde, pero ahora quedó en un loop infinito, se mueve por toda la pantalla sin rebotar en los límites
   del reuadro del juego, simplemente sigue moviendose de abajo hacia arriba, una y otra vez\
  3. La pelota debería rebotar en las paredes del tablero, pero no lo hace, simplemente traspasa los límites de forma 
  indefinida
```

## Prompt #6 (Correcciones)

```markdown
La pelota no rebota hacia abajo al golpear el primer bloque. Te dejo una imagen con el log de la consola del navegador a ver si logras entender que pasa '/Users/jairopolo/Downloads/Captura de pantalla 2025-07-21 a la(s) 9.02.04 p.m..png' Además, la pelota se sigue perdiendo, no debes permitir que salga de los límites de la escena!
```
## Prompt #7 (Correcciones)

```markdown
No funcionó, te dejo los logs de la consola del navegador\
       Phaser v3.70.0 (WebGL | Web Audio)  https://phaser.io
  AudioManager.js:21 AudioManager initialized with placeholder sounds
  GameScene.js:64 Created 50 blocks
  Ball.js:64 Ball launched at angle: -22°, velocity: (-112.38197802477362, -278.15515637003625)
  GameScene.js:147 Level 1 initialized with 1 balls
  Ball.js:80 Ball velocity: -112.4 -278.2 Speed: 300.0
  GameScene.js:95 Ball hit block at: 280 200
  GameScene.js:96 Ball velocity before collision: -112.38197802477362 -139.07757818501813
  Ball.js:85 Boosting ball speed from 178.80794651964024 to 300
  GameScene.js:95 Ball hit block at: 280 170
  GameScene.js:96 Ball velocity before collision: -188.55198588016268 -116.67063535938141
  Ball.js:85 Boosting ball speed from 221.72931365634722 to 300
  GameScene.js:95 Ball hit block at: 200 170
  GameScene.js:96 Ball velocity before collision: -127.55551990685008 -157.85549520106258
  Ball.js:85 Boosting ball speed from 202.95016142856235 to 300
  GameScene.js:95 Ball hit block at: 200 140
  GameScene.js:96 Ball velocity before collision: -188.55198588016268 -116.67063535938138
  Ball.js:85 Boosting ball speed from 221.72931365634722 to 300
  GameScene.js:95 Ball hit block at: 200 110
  GameScene.js:96 Ball velocity before collision: -255.11103981370016 -78.92774760053128
  GameScene.js:95 Ball hit block at: 120 140
  GameScene.js:96 Ball velocity before collision: -127.55551990685008 -78.92774760053128
  Ball.js:85 Boosting ball speed from 150 to 300
  GameScene.js:95 Ball hit block at: 120 110
  GameScene.js:96 Ball velocity before collision: -255.11103981370016 -78.92774760053128
  Ball.js:80 Ball velocity: -255.1 -78.9 Speed: 267.0
  GameScene.js:95 Ball hit block at: 40 110
  GameScene.js:96 Ball velocity before collision: -127.55551990685008 -78.92774760053128
  Ball.js:85 Boosting ball speed from 150 to 300
  GameScene.js:95 Ball hit block at: 120 80
  GameScene.js:96 Ball velocity before collision: -255.11103981370016 -78.92774760053128
  GameScene.js:95 Ball hit block at: 40 80
  GameScene.js:96 Ball velocity before collision: -255.11103981370016 -39.46387380026564
  19Ball.js:80
```
## Prompt #8 (Correcciones)

```markdown
Funcionó! Ahora un par de ajustes finales\
  1. Cuando pierdo una vida, debería emitirse un sonido que comunique falla, error, o perdida\
  2. Ya la pelota se comporta como deseo pero detecto, que la velocidad a veces aumento o disminuye de la nada\
  3. Ahora, sale una línea amarilla delgada desde la pelota que indica en que dirección se va a mover o rebotar, no quiero que
   salga eso, se ve mal
```
## Prompt #9 (Correcciones)

```markdown
Veo aplicada la mayoría de las correcciones, pero ahora se volvió a romper un poco la física de la pelota: Cada vez que cae 
  en la base, se va a un lado lentamente, ya sea a la izquierda o derecha, para luego salir abrutamente y de modo antinatural,
   hacia arriba. Acá te dejo logs\
       Phaser v3.70.0 (WebGL | Web Audio)  https://phaser.io
  AudioManager.js:22 AudioManager initialized with placeholder sounds
  GameScene.js:64 Created 50 blocks
  Ball.js:68 Ball launched at angle: 29°, velocity: (145.44288607390112, -262.3859121418187)
  GameScene.js:170 Level 1 initialized with 1 balls
  Ball.js:144 Ball velocity: 145.4 -262.4 Speed: 300.0
  GameScene.js:95 Ball hit block at: 520 200
  GameScene.js:96 Ball velocity before collision: 145.44288607390112 -262.3859121418187
  GameScene.js:118 Hit from top/bottom - reversing Y velocity
  GameScene.js:126 Ball velocity after bounce: 145.44288607390112 262.3859121418187
  2Ball.js:144 Ball velocity: 145.4 262.4 Speed: 300.0
  Ball.js:108 Ball escaped right! Forcing back in bounds
  Ball.js:124 Breaking horizontal loop with strong vertical: -200
  Ball.js:130 New velocity after right bounce: -145.44288607390112 -200
  Ball.js:108 Ball escaped right! Forcing back in bounds
  Ball.js:130 New velocity after right bounce: -145.44288607390112 -200
  2Ball.js:144 Ball velocity: -145.4 -200.0 Speed: 247.3
  GameScene.js:95 Ball hit block at: 600 200
  GameScene.js:96 Ball velocity before collision: -145.44288607390112 -200
  GameScene.js:118 Hit from top/bottom - reversing Y velocity
  GameScene.js:126 Ball velocity after bounce: -145.44288607390112 200
  Ball.js:144 Ball velocity: -145.4 200.0 Speed: 247.3
  2Ball.js:144 Ball velocity: -145.4 0.0 Speed: 145.4
  Ball.js:82 Ball escaped left! Forcing back in bounds
  Ball.js:98 Breaking horizontal loop with strong vertical: -200
  Ball.js:104 New velocity after left bounce: 145.44288607390112 -200
  Ball.js:82 Ball escaped left! Forcing back in bounds
  Ball.js:104 New velocity after left bounce: 145.44288607390112 -200
  GameScene.js:95 Ball hit block at: 200 200
  GameScene.js:96 Ball velocity before collision: 145.44288607390112 -200
  GameScene.js:118 Hit from top/bottom - reversing Y velocity
  GameScene.js:126 Ball velocity after bounce: 145.44288607390112 200
  Ball.js:144 Ball velocity: 145.4 200.0 Speed: 247.3
  2Ball.js:144 Ball velocity: 145.4 0.0 Speed: 145.4
  Ball.js:108 Ball escaped right! Forcing back in bounds
  Ball.js:124 Breaking horizontal loop with strong vertical: -200
  Ball.js:130 New velocity after right bounce: -145.44288607390112 -200
  Ball.js:108 Ball escaped right! Forcing back in bounds
  Ball.js:130 New velocity after right bounce: -145.44288607390112 -200
  2Ball.js:144 Ball velocity: -145.4 -200.0 Speed: 247.3
  GameScene.js:95 Ball hit block at: 520 170
  GameScene.js:96 Ball velocity before collision: -145.44288607390112 -20
```

