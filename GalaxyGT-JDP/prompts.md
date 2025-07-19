# GalaxyGT - Documentación de Prompts
*Realizado en Cursor, con modelo Auto*

---

## 📝 Prompts y Respuestas del Desarrollo

### **Prompt 1: Hola**

**Respuesta Agente:**
Hola! Veo que tienes un proyecto de desarrollo de videojuegos con HTML, CSS y JavaScript. Según el README, este es un ejercicio final donde puedes crear cualquier tipo de videojuego que te interese.

Veo que ya tienes:
- Un archivo `index-videogames.py`
- Un archivo `index.html` principal
- Una carpeta `snake-EHS` con un ejemplo de juego de Snake
- Archivos de estilos y documentación

¿En qué puedo ayudarte hoy? ¿Te gustaría:
- Crear un nuevo videojuego desde cero?
- Modificar o mejorar el juego existente de Snake?
- Revisar el código actual?
- O hay algo específico en lo que necesites asistencia?

¡Estoy aquí para ayudarte con tu proyecto de videojuegos!

---

### **Prompt 2: Creación de estructura de carpetas**

Si, necesito crear un nuevo videojuego desde 0, con la misma estructura de carpetas de snake-EHS pero yo te iré indicando las nuevas funcionalidades, me ayudas a crear la estructura de carpetas

**Respuesta Agente:**
¡Perfecto! Te ayudo a crear la estructura de carpetas para tu nuevo videojuego. Primero voy a revisar la estructura de la carpeta snake-EHS para replicarla exactamente.

¿Me puedes decir el nombre del juego y tus iniciales para crear la carpeta?

---

### **Prompt 3: Nombre del juego**

GalaxyGT y JDP

**Respuesta Agente:**
¡Perfecto! Voy a crear la estructura de carpetas para tu videojuego "GalaxyGT-JDP" siguiendo exactamente el mismo patrón que snake-EHS.

---

### **Prompt 4: Nave del jugador y controles**

Si, vamos a añadir la nave del jugador y los controles de movimiento, los controles deben ser las flechas del teclado y la nave debe ser capaz de disparar con la barra espaciadora por lo que también necesito que diseñes la bala que dispara la nave

---

### **Prompt 5: Implementación de enemigos**

Si, ahora vamos a implementar los enemigos, estos deben ser con un diseño de abeja y deben tener la capacidad de moverse de derecha a izquierda y viceversa para que el juego tenga un grado de complejidad básico, por cada enemigo derrotado lleva un conteo de puntos de 10 en 10

---

### **Prompt 6: Verificación de funcionalidad de enemigos**

Antes de añadir una nueva funcionalidad, verifica la funcionalidad de los enemigos, al iniciar el juego los enemigos desaparecen de la pantalla y no se puede continuar con el juego

---

### **Prompt 7: Corrección de movimiento de enemigos**

Después de las correcciones, el error persiste, el comportamiento es luego de iniciar los enemigos se mueven hacia la derecha y posterior se mueven hacia abajo y desaparecen de la pantalla, puedes revisar por favor

---

### **Prompt 8: Corrección de rebote de enemigos**

Ya está un poco mejor, pero aún no funciona como lo esperado, ahora al topar en el borde de la derecha los enemigos se van hacia abajo, lo correcto sería que topen en el borde ya sea izquierdo o derecho y regresen, como por ejemplo, si fuera un efecto de rebote, adicional los enemigos no se deben de ir hacia abajo.

---

### **Prompt 9: Sistema de niveles**

Excelente ahora sí funciona correctamente, vamos agregar una nueva característica al finalizar con todos los enemigos debe salir un mensaje que haz avanzado al siguiente nivel y los enemigos deben de volver aparecer y comportarse de la misma manera que lo realizan ahora

---

### **Prompt 10: Corrección del contador de niveles**

Antes de continuar con la siguiente funcionalidad puedes revisar el mensaje de has avanzado al siguiente nivel, el contador realiza un comportamiento de llegar hasta el 122 y debería de subir 1 a 1

---

### **Prompt 11: Límite de niveles y enemigos que disparan**

Excelente ahora funciona correctamente, ahora por favor limítalo a 5 niveles y a partir del nivel 3 los enemigos deben tener la capacidad de dispararle a la nave para eliminarlo, el modo de disparo de los enemigos debe ser random y únicamente pueden disparar 5 enemigos al mismo tiempo

---

### **Prompt 12: Efectos de sonido**

Excelente todo funciona bien, si ahora añadamos efectos de sonidos, los efectos que necesito son, al momento de disparar la nave del jugador, al momento de destruir un enemigo, al momento que le quiten una vida al jugador y al completar el nivel 5 un sonido de victoria

---

### **Prompt 13: Movimiento circular en nivel 5**

Si, en el nivel 5 ahora ayúdame a que los enemigos también se puedan mover en forma de círculo para agregar un grado de dificultad para eliminarlos

---

### **Prompt 14: Corrección de movimiento circular**

En el nivel 5 los enemigos ya no se mueven de derecha a izquierda, la idea era mantener ese comportamiento y adicional que se movieran en forma circular, adicional puedes ampliar un poco más el movimiento circular, por ejemplo que el movimiento del enemigo sea en un círculo más abierto

---

### **Prompt 15: Límite de movimiento en nivel 5**

Si, vamos a realizar un ajuste, por favor limita el movimiento de los enemigos en el nivel 5 a la mitad del cuadro del juego, es decir los enemigos no pueden sobrepasar ese límite

---

### **Prompt 16: Corrección del límite horizontal**

Solo que el límite está implementado de forma vertical, la idea era realizarlo de forma horizontal, lo puedes cambiar por favor

---

## 📊 Resumen del Desarrollo

### **Funcionalidades Implementadas:**
- ✅ Estructura básica del juego
- ✅ Nave del jugador con controles
- ✅ Sistema de disparos
- ✅ Enemigos tipo abeja con movimiento
- ✅ Sistema de colisiones y puntuación
- ✅ Sistema de niveles (5 niveles)
- ✅ Enemigos que disparan (nivel 3+)
- ✅ Sistema de vidas
- ✅ Efectos de sonido
- ✅ Movimiento circular en nivel 5
- ✅ Límite de movimiento horizontal

### **Tecnologías Utilizadas:**
- HTML5 Canvas
- CSS3
- JavaScript ES6+
- Web Audio API

### **Estado del Proyecto:**
**✅ COMPLETADO** - Juego funcional con todas las características implementadas

---

*Documentación generada durante el desarrollo del videojuego GalaxyGT*