# Lista de Tareas - Juego de Carreras

## Descripción del Proyecto
Juego de carreras en HTML+JavaScript+CSS donde el jugador controla un coche con las flechas del teclado para completar una vuelta al circuito en el menor tiempo posible.

## Assets Disponibles
- **circuit.jpg**: Imagen del circuito de carreras
- **car.gif**: Animación del coche del jugador
- **OSD2011/**: Carpeta con elementos de interfaz HUD (Heads Up Display)
  - **OSDCrono.png**: Cronómetro para mostrar el tiempo
  - **OSDRPM01.png a OSDRPM13.png**: Indicadores de RPM/velocidad
  - **OSDFont01.png, OSDFont02.png, OSDFont03.png**: Fuentes para texto
  - **OSDFinCarrera.png**: Pantalla de fin de carrera
  - **Semaforo.png**: Semáforo para inicio de carrera
  - Otros elementos de interfaz (posiciones, sectores, etc.)

## Lista de Tareas Ordenadas

### Fase 1: Estructura Base y Configuración
1. **Crear estructura de archivos HTML/CSS/JS**
   - Crear `index.html` con estructura básica
   - Crear `styles.css` para estilos
   - Crear `game.js` para lógica del juego
   - Crear `assets.js` para gestión de recursos

2. **Configurar canvas y contexto de juego**
   - Crear canvas HTML5 para renderizado
   - Configurar dimensiones y contexto 2D
   - Implementar sistema de coordenadas

### Fase 2: Carga y Gestión de Assets
3. **Implementar sistema de carga de imágenes**
   - Cargar imagen del circuito (`circuit.jpg`)
   - Cargar animación del coche (`car.gif`)
   - Cargar elementos OSD necesarios
   - Implementar preloader para asegurar carga completa

4. **Crear sprites y animaciones**
   - Implementar clase Sprite para el coche
   - Configurar animación del coche (frames del GIF)
   - Crear sistema de renderizado de sprites

### Fase 3: Lógica del Vehículo
5. **Implementar física básica del coche**
   - Crear clase Car con propiedades (posición, velocidad, dirección)
   - Implementar aceleración y desaceleración
   - Implementar sistema de giro (izquierda/derecha)
   - Añadir fricción y límites de velocidad

6. **Implementar controles del teclado**
   - Detectar eventos de teclado (flechas)
   - Mapear controles:
     - ↑ = Acelerar
     - ↓ = Frenar
     - ← = Girar izquierda
     - → = Girar derecha
   - Implementar sistema de input responsive

### Fase 4: Sistema de Carrera
7. **Implementar detección de línea de meta**
   - Definir coordenadas de la línea de meta en el circuito
   - Implementar detección de colisión con línea de meta
   - Crear sistema de detección de vuelta completa

8. **Implementar cronómetro**
   - Crear sistema de tiempo de vuelta
   - Mostrar cronómetro en pantalla (usando OSDCrono.png)
   - Iniciar cronómetro al pasar línea de meta
   - Parar cronómetro al completar vuelta

### Fase 5: Interfaz de Usuario (HUD)
9. **Implementar OSD de velocidad y marcha**
   - Crear HUD en esquina inferior izquierda
   - Mostrar velocidad actual del coche
   - Simular caja de cambios automática (marchas 1-6)
   - Usar sprites OSDRPM01.png a OSDRPM13.png según velocidad

10. **Implementar cronómetro visual**
    - Mostrar tiempo de vuelta en letra blanca
    - Posicionar cronómetro arriba del coche
    - Usar fuente OSDFont01.png para texto

### Fase 6: Lógica de Juego
11. **Implementar estados del juego**
    - Estado inicial (coche en última curva)
    - Estado de carrera (cronómetro activo)
    - Estado final (carrera completada)
    - Desactivar aceleración al terminar

12. **Implementar sistema de colisiones**
    - Detectar límites del circuito
    - Implementar rebote o detención en bordes
    - Añadir realismo a la conducción

### Fase 7: Pulido y Optimización
13. **Optimizar rendimiento**
    - Implementar requestAnimationFrame para loop del juego
    - Optimizar renderizado de sprites
    - Reducir lag en animaciones

14. **Añadir efectos visuales**
    - Implementar transiciones suaves
    - Añadir efectos de partículas (opcional)
    - Mejorar feedback visual de controles

### Fase 8: Testing y Debugging
15. **Implementar sistema de debug**
    - Mostrar información de debug (posición, velocidad, etc.)
    - Crear controles de debug para testing
    - Implementar reset del juego

16. **Testing completo**
    - Probar todos los controles
    - Verificar detección de línea de meta
    - Comprobar precisión del cronómetro
    - Testear en diferentes navegadores

### Fase 9: Documentación y Entrega
17. **Crear documentación final**
    - Documentar API del juego
    - Crear README con instrucciones
    - Documentar estructura de archivos

18. **Preparar entrega**
    - Optimizar assets para web
    - Comprimir archivos si es necesario
    - Crear demo funcional

## Prioridades
- **Alta**: Fases 1-4 (funcionalidad básica)
- **Media**: Fases 5-6 (interfaz y lógica completa)
- **Baja**: Fases 7-9 (pulido y documentación)

## Estimación de Tiempo
- **Desarrollo básico**: 2-3 días
- **Pulido y testing**: 1-2 días
- **Total estimado**: 3-5 días

## Notas Técnicas
- Usar HTML5 Canvas para renderizado
- Implementar game loop con requestAnimationFrame
- Usar sprites pre-renderizados para mejor rendimiento
- Mantener código modular y reutilizable 