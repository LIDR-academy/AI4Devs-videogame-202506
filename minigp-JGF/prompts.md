Modelo usado: Claude-4-sonnet dentro de Cursor

---

# Prompts Importantes del Desarrollo del Juego de Carreras

## Prompt 1: Generación de tareas a realizar

Quiero montar un pequeño juego usando HTML+Javascript+CSS de carreras. El juego consiste en lo siguiente:
- El jugador maneja un coche con las flechas del teclado (arriba = acelerar, abajo = frenar, izquierda = girar a la izquierda, derecha = girar a la derecha )
- El objetivo del juego es hacer una vuelta en el menor tiempo posible.
- El juego empieza con el coche en la última curva del circuito. Cuando el jugador pasa por la línea de meta, empieza a contar un cronómetro que aparece justo arriba del coche, en letra blanca. Cuando completa la vuelta, el cronómetro se para y el juego termina. La función de aceleración se desactiva, dejando al jugador sólo con las opciones de frenar y girar.
- En todo momento, se debe ver en la esquina inferior izquierda de la pantalla un *OSD* con la velocidad actual y la marcha (puedes simularla como si fuera una caja de cambios automática).

Encontrarás todos los assets necesarios en @/assets . Primero, quiero que elabores una lista de tareas ordenadas y documéntalas en una carpeta docs dentro de minigp-JGF.

## Prompt 2: Actualización de la línea de meta

Actualiza la caja de detección de línea de meta. Empieza en x=3691, y=2125, y se extiende hasta y=2002. Dale una anchura de 20px para darle tolerancia.

## Prompt 3: Bug de doble detección de línea de meta

Hay un bug con la línea de meta. Al cruzarla por primera vez, el juego se detiene. Creo que es porque hay una doble detección. Mete un cooldown de 3s para que ante una segunda detección de la línea de meta, no cuente hasta que hayan pasado al menos 3 segundos.

## Prompt 4: Ajuste de velocidad en el HUD

Quiero que ajustes el HUD con la velocidad de abajo a la izquierda. Ahora mismo no es muy realista, llega a mas de 1000km/h. Ajustalo para que esté en un rango de 0-350km/h.

## Prompt 5: Mejora de la implementación de velocidad

No me gusta esta implementación, has puesto un límite pero lo ideal es que la velocidad escale linealmente, no que haya un tope pero el coche siga acelerando.

## Prompt 6: Bug de posición del coche

Hay un bug en el juego en el que la posición del coche no se mantiene en el centro de la pantalla siempre que es posible. Se va desplazando poco a poco en las rectas conforme el coche acelera. Puedes arreglarlo?

## Prompt 7: Actualización de físicas del coche

Quiero que actualices las físicas del coche. Su velocidad máxima es muy pequeña, debería poderse mover más rápido por el circuito.

## Prompt 8: Ajuste de velocidad de giro

Me gustaría que cambiases la mecánica de giro. El coche gira demasiado rápido. Prueba con una velocidad de giro constante.

## Prompt 9: Reducción adicional de velocidad de giro

Sigue siendo muy rápido, Baja más la velocidad de giro.

## Prompt 10: Bug de dirección del coche

Hay un bug en el juego: el coche no avanza en la dirección en la que el sprite está girado. Intenta arreglarlo.

## Prompt 11: Bug de física de giro

Hay un bug en el juego: el coche gira más cuanto más rápido va, en lugar de cuanto más lento va.

## Prompt 12: Ajuste de velocidad de giro

MMmm gira demasiado el coche, haz que gire más lento.

## Prompt 13: Eliminación de pérdida de velocidad al girar

Hay otro tema de la física que no me gusta del todo. Al girar el coche pierde demasiada velocidad, lo que hace innecesario frenar. El coche simplemente debería girar menos, pero no reducir su velocidad, de forma que te salgas de la curva si lo intentas.

## Prompt 14: Corrección de bugs finales

Hay algunos bugs que me gustaría que arreglaras.
1. El coche no se mueve en la dirección a la que apunta.
2. Quita todas las imágenes del OSD que tienes, no están funcionando y las que has programado tú para mostrar velocidad, marcha y tiempo son suficientes.

## Prompt 15: Documentación de prompts

Quiero que escribas en el archivo prompts.md los prompts más importantes.

---

## Notas sobre los Prompts

### Categorías de Prompts:
1. **Configuración inicial**: Prompt 1 (definición del juego)
2. **Corrección de bugs**: Prompts 3, 6, 10, 11, 14
3. **Ajustes de física**: Prompts 7, 8, 9, 12, 13
4. **Mejoras de UI/HUD**: Prompts 4, 5, 14
5. **Configuración de elementos**: Prompt 2

### Patrones comunes:
- **Bugs de física**: Múltiples iteraciones para ajustar velocidad de giro
- **Bugs de detección**: Problemas con línea de meta y posición del coche
- **Mejoras de UX**: Ajustes de velocidad mostrada vs velocidad real
- **Simplificación**: Eliminación de elementos complejos (imágenes OSD) por elementos simples

### Lecciones aprendidas:
- La física del coche requiere múltiples iteraciones para encontrar el balance correcto
- Los bugs de detección de colisiones son comunes y requieren cooldowns
