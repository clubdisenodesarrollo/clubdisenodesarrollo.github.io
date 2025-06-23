// --- Utilidades ---
function crearVolver(onClick) {
  const btn = document.createElement('img');
  btn.src = 'btn-volver.png';
  btn.alt = 'Volver';
  btn.className = 'volver-btn-img volver-bottom';
  btn.style.cursor = 'pointer';
  btn.onclick = onClick;
  return btn;
}

function mostrarModal(mensaje, onClose) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <p>${mensaje}</p>
      <button class="main-btn" id="cerrarModal">Continuar</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('cerrarModal').onclick = () => {
    modal.remove();
    if (onClose) onClose();
  };
}

// --- Pantallas ---
function showHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container home-bg home-container">
      <img src="f-home.png" alt="Fondo pantalla inicio" class="background-img">
    </div>
  `;
  const container = app.querySelector('.container');
  const btnImg = document.createElement('img');
  btnImg.src = 'btn-iniciar.png';
  btnImg.alt = 'Iniciar';
  btnImg.className = 'main-btn-img iniciar-bottom';
  btnImg.style.cursor = 'pointer';
  btnImg.onclick = showGames;
  container.appendChild(btnImg);
}

function showNiveles(juego) {
  const app = document.getElementById('app');
  let fondo = '';
  switch (juego) {
    case 'suma': fondo = 'f-niveles1.png'; break;
    case 'resta': fondo = 'f-niveles2.png'; break;
    case 'multiplicacion': fondo = 'f-niveles3.png'; break;
    case 'division': fondo = 'f-niveles4.png'; break;
    case 'fraccion': fondo = 'f-niveles5.png'; break;
    default: fondo = 'f-niveles1.png';
  }
  app.innerHTML = `
    <div class="container niveles-bg">
      <img src="${fondo}" alt="Fondo niveles" class="background-img">
      <div class="niveles-list">
        <img src="btn-nivel1.png" alt="Nivel 1" class="btn-nivel btn-nivel1">
        <img src="btn-nivel2.png" alt="Nivel 2" class="btn-nivel btn-nivel2">
      </div>
    </div>
  `;
  const nivelesList = app.querySelector('.niveles-list');
  nivelesList.querySelector('.btn-nivel1').onclick = () => {
    if (juego === 'suma') showEjercicioSuma1();
    else if (juego === 'resta') showEjercicioResta1();
    else alert('Ejercicio personalizado pendiente');
  };
  nivelesList.querySelector('.btn-nivel2').onclick = () => {
    if (juego === 'suma') showEjercicioSuma2();
    else if (juego === 'resta') showEjercicioResta2();
    else alert('Ejercicio personalizado pendiente');
  };
  app.querySelector('.container').appendChild(crearVolver(showGames));
}

function showGames() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container juegos-bg">
      <img src="fondo2.png" alt="Fondo juegos" class="background-img">
      <div class="juegos-list"></div>
    </div>
  `;
  const juegos = [
    { img: 'suma.png', labelImg: 'suma-label.png', key: 'suma' },
    { img: 'resta.png', labelImg: 'resta-label.png', key: 'resta' },
    { img: 'multi.png', labelImg: 'multi-label.png', key: 'multiplicacion' },
    { img: 'division.png', labelImg: 'division-label.png', key: 'division' },
    { img: 'fraccion.png', labelImg: 'fraccion-label.png', key: 'fraccion' }
  ];
  const juegosList = app.querySelector('.juegos-list');
  juegos.forEach(juego => {
    const btn = document.createElement('button');
    btn.className = 'juego-btn';
    btn.onclick = () => showNiveles(juego.key);
    btn.innerHTML = `
      <img src="${juego.img}" alt="">
      <img src="${juego.labelImg}" alt="" class="juego-label-img">
    `;
    juegosList.appendChild(btn);
  });
  app.querySelector('.container').appendChild(crearVolver(showHome));
}

// --- Ejercicios personalizados SUMA ---
function showEjercicioSuma1() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-1-1.png" alt="Fondo ejercicio suma 1" class="background-img">
      <div class="opciones-suma1">
        <img src="btn-s1.png" alt="Opción 1" class="btn-s btn-s1">
        <img src="btn-s2.png" alt="Opción 2" class="btn-s btn-s2">
        <img src="btn-s3.png" alt="Opción 3" class="btn-s btn-s3">
      </div>
      <div class="contenedor-ejercicio-suma1">
        <div class="cuadro-ejercicio">5</div>
        <div class="cuadro-ejercicio">+</div>
        <div class="cuadro-ejercicio">2</div>
        <div class="cuadro-ejercicio">=</div>
        <div class="cuadro-ejercicio" id="respuesta-suma1">?</div>
      </div>
    </div>
  `;
  const opciones = app.querySelectorAll('.btn-s');
  opciones[0].onclick = () => seleccionarOpcionSuma1('5', false, opciones[0]);
  opciones[1].onclick = () => seleccionarOpcionSuma1('7', true, opciones[1]);
  opciones[2].onclick = () => seleccionarOpcionSuma1('2', false, opciones[2]);
  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('suma')));
}

function seleccionarOpcionSuma1(valor, esCorrecta, btn) {
  document.getElementById('respuesta-suma1').textContent = valor;
  if (esCorrecta) {
    setTimeout(() => {
      mostrarModal('¡Correcto!', showEjercicioSuma2);
    }, 400);
  } else {
    btn.classList.add('opcion-incorrecta');
    setTimeout(() => {
      btn.classList.remove('opcion-incorrecta');
      document.getElementById('respuesta-suma1').textContent = '?';
    }, 700);
  }
}

function showEjercicioSuma2() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-1-2.png" alt="Fondo ejercicio suma 2" class="background-img">
      <div class="opciones-suma2">
        <img src="btn-s4.png" alt="Opción 1" class="btn-s btn-s4">
        <img src="btn-s5.png" alt="Opción 2" class="btn-s btn-s5">
        <img src="btn-s6.png" alt="Opción 3" class="btn-s btn-s6">
        <img src="btn-s7.png" alt="Opción 4" class="btn-s btn-s7">
      </div>
    </div>
  `;
  const opciones = app.querySelectorAll('.btn-s');
  opciones[0].onclick = () => {
    mostrarModal('¡Felicidades, haz pasado todos los ejercicios de las sumas!', showGames);
  };
  opciones[1].onclick = opciones[2].onclick = opciones[3].onclick = function () {
    this.classList.add('opcion-incorrecta');
    setTimeout(() => this.classList.remove('opcion-incorrecta'), 700);
  };
  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('suma')));
}

// --- Ejercicios personalizados RESTA ---
function showEjercicioResta1() {
  const app = document.getElementById('app');
  const ejercicios = [];
  for (let i = 0; i < 5; i++) {
    let a = Math.floor(Math.random() * 10) + 5;
    let b = Math.floor(Math.random() * 5) + 1;
    if (b > a) [a, b] = [b, a];
    ejercicios.push({ a, b, resultado: a - b });
  }

  app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-2-1.png" alt="Fondo ejercicio resta 1" class="background-img">
      <div class="ejercicios-resta1">
        ${ejercicios.map((ej, idx) => `
          <div class="fila-resta">
            <span class="num-resta">${ej.a}</span>
            <span class="op-resta">-</span>
            <span class="num-resta">${ej.b}</span>
            <span class="op-resta">=</span>
            <input type="number" inputmode="numeric" pattern="[0-9]*" class="input-resta" id="input-resta-${idx}" autocomplete="off">
            <span class="icono-correcto" id="icono-correcto-${idx}" style="display:none;">✔️</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  ejercicios.forEach((ej, idx) => {
    const input = document.getElementById(`input-resta-${idx}`);
    input.addEventListener('input', () => {
      const icono = document.getElementById(`icono-correcto-${idx}`);
      if (parseInt(input.value, 10) === ej.resultado) {
        input.disabled = true;
        icono.style.display = 'inline';
      } else {
        icono.style.display = 'none';
      }
      const todosCorrectos = ejercicios.every((ej, i) => {
        const inp = document.getElementById(`input-resta-${i}`);
        return parseInt(inp.value, 10) === ej.resultado;
      });
      if (todosCorrectos) {
        setTimeout(() => {
          mostrarModal('¡Correcto! Has completado todos los ejercicios de resta.', showEjercicioResta2);
        }, 400);
      }
    });
  });

  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('resta')));
}

function showEjercicioResta2() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-2-2.png" alt="Fondo ejercicio resta 2" class="background-img">
      <div class="opciones-resta2">
        <img src="btn-r1.png" alt="Opción 1" class="btn-s btn-r1">
        <img src="btn-r2.png" alt="Opción 2" class="btn-s btn-r2">
        <img src="btn-r3.png" alt="Opción 3" class="btn-s btn-r3">
        <img src="btn-r4.png" alt="Opción 4" class="btn-s btn-r4">
      </div>
    </div>
  `;
  const opciones = app.querySelectorAll('.btn-s');
  opciones[0].onclick = () => {
    mostrarModal('¡Felicidades, has pasado todos los ejercicios de resta!', showGames);
  };
  opciones[1].onclick = opciones[2].onclick = opciones[3].onclick = function () {
    this.classList.add('opcion-incorrecta');
    setTimeout(() => this.classList.remove('opcion-incorrecta'), 700);
  };
  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('resta')));
}

// --- Inicialización ---
window.onload = showHome;
