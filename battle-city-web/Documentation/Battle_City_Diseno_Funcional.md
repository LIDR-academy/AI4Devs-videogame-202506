# Battle City – Documento de Diseño Funcional

**Product Owner:** Nintendo – División de Desarrollo de Videojuegos  
**Título del Proyecto:** Battle City  
**Plataforma:** Nintendo Entertainment System (NES)  
**Género:** Shooter de Tanques en Vista Cenital  
**Año de Lanzamiento:** 1985

---

## 1. Introducción

*Battle City* es un videojuego de acción en 2D con vista cenital donde el jugador controla un tanque con la misión de defender una base (representada por un águila) de oleadas de tanques enemigos. El juego enfatiza los reflejos rápidos, el juego cooperativo y la gestión estratégica del ataque y la defensa.

## 2. Visión General del Juego

- **Jugadores:** 1–2 (modo cooperativo simultáneo)  
- **Perspectiva:** Vista cenital (2D)  
- **Modo de juego:** Progresión arcade a través de 35 niveles  
- **Mecánicas principales:** Control de tanque, disparo, entornos destructibles, potenciadores, defensa de base

## 3. Objetivos del Juego

- **Objetivo principal:** Destruir todos los tanques enemigos en cada nivel  
- **Objetivo secundario:** Proteger la base (emblema del águila). Si la base es destruida o el jugador pierde todas sus vidas, el juego termina.

## 4. Mecánicas de Juego

### 4.1 Tanque del Jugador

- **Movimiento:** Arriba, abajo, izquierda, derecha (entrada direccional de 8 bits)  
- **Disparo:** Un disparo a la vez. El disparo desaparece al impactar o al llegar al borde de la pantalla  
- **Vidas:** 3 vidas por defecto por jugador  
- **Colisiones:** Colisiona con ladrillos, muros de acero, agua (infranqueable) y otros tanques

### 4.2 Tanques Enemigos

- **Tipos:**  
  - Tanque básico (lento, se destruye con un disparo)  
  - Tanque rápido (más velocidad)  
  - Tanque blindado (requiere 4 disparos)  
  - Tanque bonus (parpadea, otorga potenciador)  
- **Comportamiento de aparición:** Desde ubicaciones predefinidas en la parte superior de la pantalla  
- **Cantidad por nivel:** Hasta 20 tanques; máximo 4 simultáneos en pantalla

### 4.3 Base (Águila)

- Ubicada en el centro inferior del mapa  
- Rodeada por ladrillos destructibles  
- Se destruye si es alcanzada por un disparo enemigo (o del jugador)

### 4.4 Elementos del Mapa

- **Ladrillo:** Destructible  
- **Acero:** Indestructible (excepto con potenciador)  
- **Árboles:** Obstruyen la vista pero no el movimiento  
- **Agua:** Infranqueable  
- **Hielo:** Reduce la fricción (el tanque se desliza)

### 4.5 Potenciadores

Se activan al destruir un tanque enemigo parpadeante. Tipos:

- **Bomba:** Destruye a todos los enemigos en pantalla  
- **Casco:** Invulnerabilidad temporal  
- **Pala:** Fortifica la base con acero durante 20 segundos  
- **Estrella:** Mejora el tanque (disparo más rápido, doble disparo, destruye acero)  
- **Tanque:** Vida extra  
- **Reloj:** Congela a todos los enemigos temporalmente

### 4.6 Progresión de Niveles

- **Niveles totales:** 35  
- **Curva de dificultad:** Incremento gradual de enemigos, tanques blindados y complejidad del mapa  
- **Diseño de niveles:** Distribución única por nivel; mezcla de terrenos y obstáculos

## 5. Características Multijugador

- **Modo:** Cooperativo para 2 jugadores  
- **Pantalla compartida:** Ambos jugadores en la misma arena  
- **Fuego amigo:** Activo (pueden dañarse entre sí o destruir sin querer la base)  
- **Vidas:** Contabilizadas por separado

## 6. Interfaz de Usuario (HUD)

- **Barra superior:**  
  - Puntuaciones de jugadores  
  - Vidas restantes  
  - Iconos de tanques enemigos (cuentan total de enemigos restantes)  
- **Indicador de nivel:** Aparece antes de comenzar cada nivel  
- **Pausa:** No disponible

## 7. Controles (Mando NES)

- **D-Pad:** Mover el tanque (4 direcciones)  
- **Botón A:** Disparar  
- **Botón Start:** Comenzar (o pausar si se soporta)

## 8. Audio y Visuales

- **Gráficos:** Sprites de 8 bits y mapas basados en mosaicos (tiles)  
- **Música:** Intro + música de fondo en bucle + fanfarria al completar nivel  
- **Efectos de sonido:** Disparos, explosiones, recolección de bonus, activación de potenciadores, destrucción del águila

## 9. Condiciones de Derrota

- **Base destruida:** Fin del juego inmediato  
- **Pérdida de todas las vidas:** Fin del juego  
- **No hay sistema de continuación**

## 10. Rejugabilidad

- La dificultad creciente mantiene el interés  
- El modo cooperativo mejora la experiencia social  
- La variedad de potenciadores y terrenos destructibles ofrece dinámicas variadas

## 11. Potencial Futuro *(uso interno únicamente)*

- **Editor de mapas (en consolas domésticas)**  
- **Sistema de guardado o contraseñas**  
- **Personalización de tanques**  
- **Modo versus (jugador contra jugador)**

---

**Fin del Documento**

Confidencial – Para uso interno en desarrollo. Propiedad de Nintendo.
