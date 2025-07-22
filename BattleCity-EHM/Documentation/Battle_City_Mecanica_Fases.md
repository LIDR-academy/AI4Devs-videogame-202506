# Battle City – Mecánica Detallada de las Fases

Este documento describe en detalle el funcionamiento interno y la lógica de diseño de las fases del videojuego *Battle City* (NES).

---

## 🧩 1. Estructura General de una Fase

Cada fase es una arena cerrada con las siguientes características:

- **Objetivo:** Destruir 20 tanques enemigos.
- **Defensa:** Proteger la base (águila) situada en la parte inferior central.
- **Mapa:** Distribución específica de obstáculos y terreno.
- **Enemigos:** Aparecen por oleadas desde la parte superior.
- **Final de fase:** Cuando se destruyen los 20 tanques enemigos.

---

## ⚙️ 2. Lógica de Aparición de Enemigos

- Total de **20 enemigos por fase**.
- Máximo **4 enemigos en pantalla** al mismo tiempo.
- Nuevos enemigos aparecen al destruir uno anterior.
- Tipos de tanques:
  - Básico (1 disparo)
  - Rápido (más velocidad)
  - Blindado (hasta 4 disparos)
  - Bonus (parpadea, deja power-up)

---

## 🧱 3. Obstáculos del Terreno

| Elemento   | Comportamiento                            |
|------------|-------------------------------------------|
| Ladrillos  | Destructibles                             |
| Acero      | Indestructibles (excepto con power-up)    |
| Agua       | Infranqueable                             |
| Árboles    | Ocultan visión, no bloquean movimiento    |
| Hielo      | Reduce fricción, el tanque se desliza     |

---

## 🏰 4. Defensa de la Base

- La **base (águila)** está protegida inicialmente por ladrillos.
- Si un disparo enemigo (o propio) la destruye: **game over inmediato**.
- Power-up **Pala:** reemplaza los ladrillos por acero temporalmente.

---

## 📈 5. Progresión de Dificultad

| Elemento                 | Cambios por nivel               |
|--------------------------|---------------------------------|
| Tanques blindados        | Aumentan en frecuencia          |
| Obstáculos               | Mayor densidad y variedad       |
| Terreno                  | Más uso de agua, hielo, árboles |
| Estrategia enemiga       | Patrullaje más agresivo         |

---

## ⭐ 6. Power-Ups en Fase

Los power-ups se activan al destruir tanques parpadeantes. Tipos:

- **Bomba:** Elimina todos los enemigos en pantalla
- **Casco:** Invulnerabilidad temporal
- **Pala:** Fortifica la base con acero por 20 segundos
- **Estrella:** Mejora el tanque del jugador
- **Tanque:** Vida extra
- **Reloj:** Congela enemigos temporalmente

---

## 🎯 7. Finalización de Fase

- El nivel finaliza tras destruir los 20 enemigos.
- Se muestra una **pantalla de estadísticas**:
  - Puntos
  - Tanques destruidos por tipo
- El jugador conserva sus mejoras y vidas para el siguiente nivel.

---

## 🛑 8. Condiciones de Derrota

- **Base destruida:** Game over inmediato.
- **Pérdida de todas las vidas:** Game over.
- No hay opción de continuar ni guardar partida.

---

Fin del documento.
