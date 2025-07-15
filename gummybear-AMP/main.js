// Estados globales
let estadoActual = 'principal'; // 'principal', 'nombre', 'seleccion', 'instrucciones', 'jugando', 'fin'
let nombreJugador = '';
let personajeSeleccionado = null;
let puntaje = 0;

// Referencias a elementos
const pantallaPrincipal = document.getElementById('pantalla-principal');
const pantallaNombre = document.getElementById('pantalla-nombre');
const pantallaSeleccion = document.getElementById('pantalla-seleccion');
const pantallaInstrucciones = document.getElementById('pantalla-instrucciones');
const pantallaFin = document.getElementById('pantalla-fin');
const canvas = document.getElementById('game-canvas');

// --- Variables globales de canvas y animación ---
let ctx = canvas.getContext('2d');
let fondoImg = new Image();
let fondoX = 0;
let fondoVel = 4;
let personajeImg = new Image();
let personajeY = 480; // Suelo
let personajeVy = 0;
let gravedad = 1.2;
let saltando = false;
let sueloY = 480;

// --- Tamaños estándar ---
const TAM_PERSONAJE_W = 140;
const TAM_PERSONAJE_H = 140;
const TAM_OBSTACULO_W = 80;
const TAM_OBSTACULO_H_BAJO = 70;
const TAM_OBSTACULO_H_ALTO = 54;
const TAM_GOLOSINA = 44;

// --- Pantalla Principal ---
function mostrarPantallaPrincipal() {
  ocultarTodasLasPantallas();
  pantallaPrincipal.style.display = 'flex';
  pantallaPrincipal.innerHTML = `
    <div class="titulo-juego">
      <img src="assets/gummybear.png" alt="Gummybear" />
      Gummybear Endless Runner
    </div>
    <button class="boton-grande" id="btn-empezar">¡Empezar!</button>
  `;
  document.getElementById('btn-empezar').onclick = mostrarPantallaNombre;
  estadoActual = 'principal';
}

function agregarBotonSalir(contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  const btnSalir = document.createElement('button');
  btnSalir.textContent = 'Salir';
  btnSalir.className = 'boton-salir';
  btnSalir.style.position = 'absolute';
  btnSalir.style.top = '2rem';
  btnSalir.style.right = '2rem';
  btnSalir.style.fontSize = '1.3rem';
  btnSalir.style.background = 'linear-gradient(90deg, #ffb300 0%, #ffecb3 100%)';
  btnSalir.style.color = '#fff';
  btnSalir.style.border = 'none';
  btnSalir.style.borderRadius = '1.5rem';
  btnSalir.style.padding = '0.7rem 2rem';
  btnSalir.style.cursor = 'pointer';
  btnSalir.style.boxShadow = '0 2px 8px #ffecb355';
  btnSalir.onclick = mostrarPantallaPrincipal;
  contenedor.appendChild(btnSalir);
}

// --- Pantalla Nombre ---
function mostrarPantallaNombre() {
  ocultarTodasLasPantallas();
  pantallaNombre.style.display = 'flex';
  pantallaNombre.innerHTML = `
    <div class="titulo-juego">
      <img src="assets/gummybear.png" alt="Gummybear" />
      Escribe tu nombre
    </div>
    <input type="text" id="input-nombre" maxlength="12" autocomplete="off" placeholder="Tu nombre" />
    <div id="error-nombre" style="color:#e53935;font-weight:bold;display:none;font-size:1.4rem;background:#fff3cd;border:2px solid #ffb300;padding:1rem 2rem;border-radius:1.5rem;margin-bottom:1rem;text-align:center;box-shadow:0 2px 8px #ffecb355;">
      <span style='font-size:2rem;'>⚠️</span> ¡Debes escribir tu nombre para continuar!
    </div>
    <button class="boton-grande" id="btn-listo">¡Listo!</button>
  `;
  agregarBotonSalir('pantalla-nombre');
  const input = document.getElementById('input-nombre');
  const btnListo = document.getElementById('btn-listo');
  const error = document.getElementById('error-nombre');
  input.addEventListener('input', () => {
    error.style.display = 'none';
  });
  btnListo.onclick = () => {
    const nombre = input.value.trim();
    if (/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]{1,12}$/.test(nombre)) {
      nombreJugador = nombre;
      mostrarPantallaSeleccion();
    } else {
      error.style.display = 'block';
      error.innerHTML = "<span style='font-size:2rem;'>⚠️</span> ¡Debes escribir tu nombre para continuar!";
      error.animate([
        { transform: 'scale(1)', background: '#fff3cd' },
        { transform: 'scale(1.08)', background: '#ffe082' },
        { transform: 'scale(1)', background: '#fff3cd' }
      ], { duration: 600, easing: 'ease', iterations: 1 });
    }
  };
  estadoActual = 'nombre';
}

// --- Pantalla Selección de Personaje ---
function mostrarPantallaSeleccion() {
  ocultarTodasLasPantallas();
  pantallaSeleccion.style.display = 'flex';
  pantallaSeleccion.innerHTML = `
    <div class="titulo-juego">
      <img src="assets/gummybear.png" alt="Gummybear" />
      Elige tu personaje
    </div>
    <div id="opciones-personaje" style="display:flex;gap:2rem;justify-content:center;margin:2rem 0;"></div>
    <div id="error-seleccion" style="color:#e53935;font-weight:bold;display:none;font-size:1.4rem;background:#fff3cd;border:2px solid #ffb300;padding:1rem 2rem;border-radius:1.5rem;margin-bottom:1rem;text-align:center;box-shadow:0 2px 8px #ffecb355;">
      <span style='font-size:2rem;'>⚠️</span> ¡Debes elegir un personaje para continuar!
    </div>
    <button class="boton-grande" id="btn-seleccion-continuar">Continuar</button>
  `;
  agregarBotonSalir('pantalla-seleccion');
  const personajes = [
    {nombre: 'Clásico', img: 'gummybear.png'},
    {nombre: 'Pirata', img: 'gummybear_pirata.png'},
    {nombre: 'Astronauta', img: 'gummybear_astronauta.png'},
    {nombre: 'Policía', img: 'gummybear_policia.png'}
  ];
  const opciones = document.getElementById('opciones-personaje');
  let seleccionado = null;
  personajeSeleccionado = null;
  personajes.forEach((p, idx) => {
    const div = document.createElement('div');
    div.style.textAlign = 'center';
    div.innerHTML = `<img src="assets/${p.img}" alt="${p.nombre}" style="width:110px;height:110px;border-radius:50%;border:6px solid #81d4fa;cursor:pointer;box-shadow:0 2px 8px #81d4fa55;transition:border-color 0.2s,box-shadow 0.2s;" id="personaje-${idx}"><br><span>${p.nombre}</span>`;
    div.onclick = () => {
      document.querySelectorAll('#opciones-personaje img').forEach(img => {
        img.style.borderColor = '#81d4fa';
        img.style.boxShadow = '0 2px 8px #81d4fa55';
      });
      div.querySelector('img').style.borderColor = '#aed581';
      div.querySelector('img').style.boxShadow = '0 0 0 6px #aed58155';
      personajeSeleccionado = p;
      seleccionado = idx;
      document.getElementById('error-seleccion').style.display = 'none';
    };
    opciones.appendChild(div);
  });
  document.getElementById('btn-seleccion-continuar').onclick = () => {
    if (personajeSeleccionado) {
      mostrarPantallaInstrucciones();
    } else {
      const error = document.getElementById('error-seleccion');
      error.style.display = 'block';
      error.innerHTML = "<span style='font-size:2rem;'>⚠️</span> ¡Debes elegir un personaje para continuar!";
      error.animate([
        { transform: 'scale(1)', background: '#fff3cd' },
        { transform: 'scale(1.08)', background: '#ffe082' },
        { transform: 'scale(1)', background: '#fff3cd' }
      ], { duration: 600, easing: 'ease', iterations: 1 });
    }
  };
  estadoActual = 'seleccion';
}

// --- Pantalla Instrucciones ---
function mostrarPantallaInstrucciones() {
  ocultarTodasLasPantallas();
  pantallaInstrucciones.style.display = 'flex';
  pantallaInstrucciones.innerHTML = `
    <div class="titulo-juego">
      <img src="assets/${personajeSeleccionado ? personajeSeleccionado.img : 'gummybear.png'}" alt="Gummybear" />
      ¿Cómo jugar?
    </div>
    <div style="font-size:1.3rem;margin-bottom:1rem;">
      <b>Salta</b> con ⬆️ <br>
      <span style='color:#aed581;font-weight:bold;'>¡Evita los obstáculos y recoge golosinas!</span>
    </div>
    <div style="margin-bottom:1rem;">Esquiva obstáculos y recoge golosinas para sumar puntos.<br>¡El juego termina si chocas con un obstáculo!</div>
    <button class="boton-grande" id="btn-jugar">¡Jugar!</button>
  `;
  agregarBotonSalir('pantalla-instrucciones');
  document.getElementById('btn-jugar').onclick = iniciarJuego;
  estadoActual = 'instrucciones';
}

// --- Variables para animación de fondo ---
// Usar solo un fondo único
let fondoActual = 'background.png';

function cargarRecursosJuego() {
  fondoImg.src = `assets/${fondoActual}`;
  personajeImg.src = `assets/${personajeSeleccionado ? personajeSeleccionado.img : 'gummybear.png'}`;
}

// --- Variables para golosinas y puntaje ---
let golosinas = [];
let frameGolosina = 0;
const FRAMES_PARA_GOLOSINA = 120; // cada 2 segundos aprox
const GOLOSINAS_TIPOS = [
  {img: 'gomita.png', puntos: 10, nombre: 'Gomita'},
  {img: 'caramelo.png', puntos: 20, nombre: 'Caramelo'},
  {img: 'chupetin.png', puntos: 30, nombre: 'Chupetín'}
];
let golosinaImgs = {};
GOLOSINAS_TIPOS.forEach(g => {
  let i = new Image();
  i.src = 'assets/' + g.img;
  golosinaImgs[g.img] = i;
});

// --- Variables para obstáculos ---
let obstaculos = [];
let frameObstaculo = 0;
const FRAMES_PARA_OBSTACULO = 90; // cada 1.5s aprox
const PUNTOS_OBSTACULO = 5;
let obstaculoImgs = [
  (() => { let i = new Image(); i.src = 'assets/obstacle1.png'; return i; })(),
  (() => { let i = new Image(); i.src = 'assets/obstacle2.png'; return i; })()
];
let ultimoObstaculoX = -1000;
let ultimaGolosinaX = -1000;
const SEPARACION_MINIMA = 120; // píxeles mínimos entre obstáculo y golosina

function iniciarJuego() {
  ocultarTodasLasPantallas();
  canvas.style.display = 'block';
  cargarRecursosJuego();
  fondoX = 0;
  personajeY = sueloY;
  personajeVy = 0;
  saltando = false;
  golosinas = [];
  frameGolosina = 0;
  puntaje = 0;
  obstaculos = [];
  frameObstaculo = 0;
  window.requestAnimationFrame(bucleJuego);
  estadoActual = 'jugando';
}

function bucleJuego() {
  if (estadoActual !== 'jugando') return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let fondoAncho = canvas.width;
  ctx.drawImage(fondoImg, fondoX, 0, fondoAncho, canvas.height);
  ctx.drawImage(fondoImg, fondoX + fondoAncho, 0, fondoAncho, canvas.height);
  fondoX -= fondoVel;
  if (fondoX <= -fondoAncho) fondoX = 0;
  // Personaje
  ctx.drawImage(personajeImg, 120, personajeY, TAM_PERSONAJE_W, TAM_PERSONAJE_H);
  // Obstáculos
  frameObstaculo++;
  if (frameObstaculo % FRAMES_PARA_OBSTACULO === 0) {
    // Elegir tipo de obstáculo aleatorio
    let tipo = Math.floor(Math.random() * obstaculoImgs.length);
    let y = sueloY + (TAM_PERSONAJE_H - TAM_OBSTACULO_H_BAJO);
    let h = TAM_OBSTACULO_H_BAJO;
    let x = canvas.width + 40;
    // Evitar solapamiento con la última golosina
    if (Math.abs(x - ultimaGolosinaX) < SEPARACION_MINIMA) {
      x = ultimaGolosinaX + SEPARACION_MINIMA;
    }
    obstaculos.push({x: x, y: y, w: TAM_OBSTACULO_W, h: h, tipo, sumado: false});
    ultimoObstaculoX = x;
  }
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    let o = obstaculos[i];
    o.x -= fondoVel;
    ctx.drawImage(obstaculoImgs[o.tipo], o.x, o.y, o.w, o.h);
    if (
      o.x < 120 + TAM_PERSONAJE_W - 32 && o.x + o.w > 120 + 32 &&
      personajeY + TAM_PERSONAJE_H - 32 > o.y && personajeY + 32 < o.y + o.h
    ) {
      mostrarPantallaFin();
      return;
    }
    if (!o.sumado && o.x + o.w < 120) {
      puntaje += PUNTOS_OBSTACULO;
      o.sumado = true;
    }
    if (o.x < -o.w) {
      obstaculos.splice(i, 1);
    }
  }
  // Golosinas
  frameGolosina++;
  if (frameGolosina % FRAMES_PARA_GOLOSINA === 0) {
    // Elegir tipo de golosina aleatorio
    let tipoIdx = Math.floor(Math.random() * GOLOSINAS_TIPOS.length);
    let tipo = GOLOSINAS_TIPOS[tipoIdx];
    let enSuelo = Math.random() < 0.5;
    let y;
    if (enSuelo) {
      y = sueloY + (TAM_PERSONAJE_H - TAM_GOLOSINA);
    } else {
      y = sueloY + (TAM_PERSONAJE_H - TAM_GOLOSINA) - 120; // En el aire
    }
    let x = canvas.width + 40;
    // Evitar solapamiento con el último obstáculo
    if (Math.abs(x - ultimoObstaculoX) < SEPARACION_MINIMA) {
      x = ultimoObstaculoX + SEPARACION_MINIMA;
    }
    golosinas.push({x: x, y: y, recogida: false, tipo: tipo});
    ultimaGolosinaX = x;
  }
  for (let i = golosinas.length - 1; i >= 0; i--) {
    let g = golosinas[i];
    g.x -= fondoVel;
    ctx.drawImage(golosinaImgs[g.tipo.img], g.x, g.y, TAM_GOLOSINA, TAM_GOLOSINA);
    if (!g.recogida && g.x < 120 + TAM_PERSONAJE_W - 24 && g.x + TAM_GOLOSINA > 120 + 24 && g.y < personajeY + TAM_PERSONAJE_H - 24 && g.y + TAM_GOLOSINA > personajeY + 24) {
      g.recogida = true;
      puntaje += g.tipo.puntos;
    }
    if (g.x < -TAM_GOLOSINA || g.recogida) {
      golosinas.splice(i, 1);
    }
  }
  // Física de salto
  if (saltando) {
    personajeVy += 1.0; // Menor gravedad para salto más largo
    personajeY += personajeVy;
    if (personajeY >= sueloY) {
      personajeY = sueloY;
      saltando = false;
      personajeVy = 0;
    }
  }
  // Puntaje en pantalla
  ctx.font = 'bold 2.2rem Comic Sans MS, Comic Sans, cursive';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#4fc3f7';
  ctx.lineWidth = 4;
  ctx.strokeText(`Puntaje: ${puntaje}`, 32, 60);
  ctx.fillText(`Puntaje: ${puntaje}`, 32, 60);
  ctx.font = '1.2rem Comic Sans MS, Comic Sans, cursive';
  ctx.strokeText(nombreJugador, 32, 90);
  ctx.fillText(nombreJugador, 32, 90);
  window.requestAnimationFrame(bucleJuego);
}

// --- Controles de salto ---
document.addEventListener('keydown', (e) => {
  if (estadoActual === 'jugando' && !saltando && e.code === 'ArrowUp') {
    saltando = true;
    personajeVy = -26; // Salto más largo
  }
});

// --- Pantalla de Fin de Juego (placeholder) ---
function mostrarPantallaFin() {
  ocultarTodasLasPantallas();
  pantallaFin.style.display = 'flex';
  pantallaFin.innerHTML = `
    <div class="titulo-juego">
      <img src="assets/${personajeSeleccionado ? personajeSeleccionado.img : 'gummybear.png'}" alt="Gummybear" />
      ¡Buen intento, ${nombreJugador}!
    </div>
    <div style="font-size:2rem;margin:1rem 0;">Puntaje: <b>${puntaje}</b></div>
    <button class="boton-grande" id="btn-reintentar">Intentar de nuevo</button>
    <button class="boton-grande" id="btn-cambiar">Cambiar personaje</button>
  `;
  agregarBotonSalir('pantalla-fin');
  document.getElementById('btn-reintentar').onclick = iniciarJuego;
  document.getElementById('btn-cambiar').onclick = mostrarPantallaSeleccion;
  estadoActual = 'fin';
}

// --- Utilidades ---
function ocultarTodasLasPantallas() {
  pantallaPrincipal.style.display = 'none';
  pantallaNombre.style.display = 'none';
  pantallaSeleccion.style.display = 'none';
  pantallaInstrucciones.style.display = 'none';
  pantallaFin.style.display = 'none';
  canvas.style.display = 'none';
}

// Inicialización
window.onload = mostrarPantallaPrincipal; 