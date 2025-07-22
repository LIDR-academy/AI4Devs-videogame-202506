# Dodge Game Clone

Un juego de plataformas estilo dodge game desarrollado con Phaser 3, donde el jugador debe esquivar enemigos que caen desde arriba mientras recolecta monedas para obtener puntos.

## 🎮 Características del Juego

### Mecánicas Principales
- **Personaje animado** con sprites completos (Idle, Run, Jump, Fall, Hit)
- **Sistema de enemigos** que caen continuamente desde arriba
- **Monedas coleccionables** para obtener puntos
- **Sistema de vidas** con 3 vidas iniciales
- **Efectos visuales** incluyendo shake de cámara y tintes
- **Física realista** con gravedad y colisiones

### Controles
- **Flecha Izquierda/Derecha**: Movimiento horizontal
- **Flecha Arriba**: Salto
- **ENTER**: Reiniciar juego (cuando aparece Game Over)

### Sistema de Puntuación
- **+10 puntos** por cada moneda recolectada
- **Puntuación en tiempo real** visible en pantalla
- **Puntuación final** mostrada en Game Over

### Sistema de Vidas
- **3 vidas iniciales**
- **-1 vida** por tocar un enemigo
- **Inmunidad temporal** tras recibir daño (1 segundo)
- **Game Over** cuando las vidas llegan a 0

## 🚀 Instalación y Ejecución

### Requisitos
- Navegador web moderno con soporte para JavaScript ES6
- Servidor web local (opcional, pero recomendado)

### Pasos de Instalación

1. **Clonar o descargar** el proyecto
2. **Navegar** a la carpeta del proyecto:
   ```bash
   cd dodgeGame-SP
   ```

3. **Iniciar servidor local** (recomendado):
   ```bash
   # Con Python 3
   python3 -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```

4. **Abrir navegador** y visitar:
   ```
   http://localhost:8000
   ```

### Ejecución Directa
También puedes abrir el archivo `index.html` directamente en tu navegador, aunque algunos navegadores pueden bloquear la carga de assets por políticas de seguridad.

## 📁 Estructura del Proyecto

```
dodgeGame-SP/
├── index.html              # Archivo HTML principal
├── main.js                 # Código JavaScript del juego
├── README.md              # Documentación del proyecto
└── assets/
    └── images/
        ├── sky.png         # Fondo del cielo
        ├── ground.png      # Plataforma del suelo
        ├── enemy.png       # Sprite del enemigo
        ├── coin.png        # Sprite de la moneda
        └── Mask Dude/      # Sprites del personaje
            ├── Idle.png    # Animación de reposo
            ├── Run.png     # Animación de carrera
            ├── Jump.png    # Animación de salto
            ├── Fall.png    # Animación de caída
            ├── Hit.png     # Animación de daño
            ├── Wall-Jump.png
            └── Double-Jump.png
```

## 🎯 Objetivo del Juego

El objetivo es sobrevivir el mayor tiempo posible mientras recolectas monedas para obtener la puntuación más alta. Debes esquivar los enemigos que caen desde arriba y evitar que te toquen, ya que cada contacto te quita una vida.

## ⚙️ Configuración Técnica

### Tecnologías Utilizadas
- **Phaser 3.80.0**: Framework de juegos HTML5
- **JavaScript ES6**: Lenguaje de programación
- **HTML5 Canvas**: Renderizado gráfico
- **CSS3**: Estilos y presentación

### Configuración del Juego
- **Resolución**: 800x600 píxeles
- **Física**: Arcade con gravedad 500
- **FPS**: 60 FPS (automático)
- **Escala del jugador**: 1.5x
- **Velocidad de enemigos**: 60 píxeles/segundo
- **Velocidad de monedas**: 40 píxeles/segundo

### Optimizaciones Implementadas
- **Cache busting** para assets
- **Limpieza automática** de elementos fuera de pantalla
- **Gestión eficiente de memoria**
- **Colisiones optimizadas**

## 🎨 Características Visuales

### Animaciones del Personaje
- **Idle**: Animación de reposo (10 FPS, repetir infinito)
- **Run**: Animación de carrera (15 FPS, repetir infinito)
- **Jump**: Animación de salto (10 FPS)
- **Fall**: Animación de caída (10 FPS)
- **Hit**: Animación de daño (10 FPS, sin repetir)

### Efectos Visuales
- **Shake de cámara** al recolectar monedas (50ms, 0.01 intensidad)
- **Shake de cámara** al recibir daño (200ms, 0.02 intensidad)
- **Tinte rojo** temporal al recibir daño
- **Transparencia** durante inmunidad temporal
- **Fondo degradado** azul cielo

## 🔧 Personalización

### Modificar Dificultad
Puedes ajustar la dificultad modificando estos valores en `main.js`:

```javascript
// Frecuencia de generación de enemigos (en milisegundos)
if (enemySpawnTimer >= 3000) // Cambiar 3000 por otro valor

// Frecuencia de generación de monedas (en milisegundos)
if (coinSpawnTimer >= 3500) // Cambiar 3500 por otro valor

// Velocidad de caída de enemigos
enemy.setVelocityY(60); // Cambiar 60 por otro valor

// Velocidad de caída de monedas
coin.setVelocityY(40); // Cambiar 40 por otro valor
```

### Modificar Puntuación
```javascript
// Puntos por moneda
score += 10; // Cambiar 10 por otro valor
```

### Modificar Vidas
```javascript
// Vidas iniciales
let lives = 3; // Cambiar 3 por otro valor
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Los assets no cargan**
   - Asegúrate de usar un servidor web local
   - Verifica que las rutas de los archivos sean correctas

2. **El juego no responde**
   - Verifica que Phaser 3.80.0 se cargue correctamente
   - Revisa la consola del navegador para errores

3. **Rendimiento lento**
   - Cierra otras pestañas del navegador
   - Verifica que no haya demasiados elementos en pantalla

### Debugging
Para activar el modo debug de Phaser, cambia en `main.js`:
```javascript
debug: false // Cambiar a true
```

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerir mejoras o reportar bugs.

## 📞 Contacto

Para preguntas o soporte, por favor abre un issue en el repositorio del proyecto.

---

¡Disfruta jugando Dodge Game Clone! 🎮 