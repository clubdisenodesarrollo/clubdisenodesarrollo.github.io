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
    else if (juego === 'multiplicacion') showEjercicioMulti1();
    else if (juego === 'division') showEjercicioDivision1();
    else if (juego === 'fraccion') showEjercicioFraccion1(); // <-- Agregado
    else alert('Ejercicio personalizado pendiente');
  };

  nivelesList.querySelector('.btn-nivel2').onclick = () => {
    if (juego === 'suma') showEjercicioSuma2();
    else if (juego === 'resta') showEjercicioResta2();
    else if (juego === 'multiplicacion') showEjercicioMulti2();
    else if (juego === 'division') showEjercicioDivision2();
    else if (juego === 'fraccion') showEjercicioFraccion2(); // <-- Agregado
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
  // Número objetivo aleatorio entre 2 y 15
  const numeroObjetivo = Math.floor(Math.random() * 14) + 2;

  // Genera 9 pares aleatorios (a, b) donde a - b = numeroObjetivo para 3 de ellos, el resto son distractores
  const opciones = [];
  // 3 correctas
  for (let i = 0; i < 3; i++) {
    let a = Math.floor(Math.random() * 8) + numeroObjetivo + 1; // a > numeroObjetivo
    let b = a - numeroObjetivo;
    opciones.push({ a, b, correcto: true });
  }
  // 6 incorrectas
  while (opciones.length < 9) {
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * a);
    if (a - b !== numeroObjetivo) {
      opciones.push({ a, b, correcto: false });
    }
  }
  // Mezcla las opciones
  opciones.sort(() => Math.random() - 0.5);

  app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-2-2.png" alt="Fondo ejercicio resta 2" class="background-img">
      <div class="resta2-layout">
        <div class="resta2-titulo">
          <span class="resta2-numero">${numeroObjetivo}</span>
        </div>
        <div class="resta2-opciones">
          ${opciones.map((op, idx) => `
            <button class="resta2-opcion" data-correcto="${op.correcto}">
              <span>${op.a} - ${op.b}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Lógica de selección
  let aciertos = 0;
  const botones = app.querySelectorAll('.resta2-opcion');
  botones.forEach(btn => {
    btn.onclick = function () {
      if (btn.disabled) return; // <-- Evita doble conteo
      if (btn.dataset.correcto === "true") {
        btn.classList.add('opcion-correcta');
        btn.disabled = true;
        aciertos++;
        if (aciertos === 3) {
          setTimeout(() => {
            mostrarModal('¡Felicidades! Has completado el ejercicio de resta.', showGames);
          }, 400);
        }
      } else {
        btn.classList.add('opcion-incorrecta');
        setTimeout(() => btn.classList.remove('opcion-incorrecta'), 700);
      }
    };
  });

  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('resta')));
}

// --- Ejercicios personalizados MULTIPLICACION ---
function showEjercicioMulti1() {
  const app = document.getElementById('app');
  // Genera dos números aleatorios del 1 al 10
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const resultado = a * b;

  app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-3-1.png" alt="Fondo ejercicio multiplicación 1" class="background-img">
      <div class="multi1-layout">
        <div class="cuadro-ejercicio">${a}</div>
        <div class="cuadro-ejercicio">x</div>
        <div class="cuadro-ejercicio">${b}</div>
        <div class="cuadro-ejercicio">=</div>
        <input 
          type="number" 
          inputmode="numeric" 
          pattern="[0-9]*" 
          class="input-multi" 
          id="input-multi-1"
          autocomplete="off"
          placeholder="?"
        >
      </div>
    </div>
  `;

  const input = document.getElementById('input-multi-1');
  input.addEventListener('focus', () => {
    input.style.opacity = "1";
    input.placeholder = "";
  });
  input.addEventListener('blur', () => {
    if (!input.value) {
      input.style.opacity = "0.5";
      input.placeholder = "?";
    }
  });

  input.addEventListener('input', () => {
    if (parseInt(input.value, 10) === resultado) {
      input.disabled = true;
      setTimeout(() => {
        mostrarModal('¡Correcto! Has completado el ejercicio de multiplicación.', showEjercicioMulti2);
      }, 400);
    }
  });

  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('multiplicacion')));
}

function showEjercicioMulti2() {
  const app = document.getElementById('app');

  // Genera 6 multiplicaciones aleatorias (a x b)
  const multiplicaciones = [];
  while (multiplicaciones.length < 6) {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    // Evita duplicados exactos
    if (!multiplicaciones.some(m => m.a === a && m.b === b)) {
      multiplicaciones.push({ a, b, resultado: a * b, id: `multi-${multiplicaciones.length}` });
    }
  }

  // Mezcla los resultados para las opciones de abajo
  const resultados = multiplicaciones.map(m => m.resultado);
  const opciones = resultados
    .map((res, idx) => ({ resultado: res, id: `opcion-${idx}` }))
    .sort(() => Math.random() - 0.5);

  app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-3-2.png" alt="Fondo ejercicio multiplicación 2" class="background-img">
      <div class="multi2-layout">
        <div class="multi2-multiplicaciones">
          ${multiplicaciones.map(m => `
            <div class="multi2-multi" draggable="true" id="${m.id}" data-resultado="${m.resultado}">
              <span>${m.a} x ${m.b}</span>
            </div>
          `).join('')}
        </div>
        <div class="multi2-opciones">
          ${opciones.map((op, idx) => `
            <div class="multi2-opcion-row">
              <div class="multi2-dropzone" data-resultado="${op.resultado}" id="drop-${op.id}"></div>
              <div class="multi2-resultado">${op.resultado}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Drag & Drop logic
  let aciertos = 0;
  const draggables = app.querySelectorAll('.multi2-multi');
  const dropzones = app.querySelectorAll('.multi2-dropzone');

  draggables.forEach(drag => {
    drag.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', drag.id);
      setTimeout(() => drag.classList.add('dragging'), 0);
    });
    drag.addEventListener('dragend', () => {
      drag.classList.remove('dragging');
    });

    // Soporte táctil
    drag.addEventListener('touchstart', function(e) {
      drag.classList.add('dragging');
      drag.dataset.touching = 'true';
    });

    drag.addEventListener('touchmove', function(e) {
      if (!drag.dataset.touching) return;
      const touch = e.touches[0];
      drag.style.position = 'fixed';
      drag.style.left = (touch.clientX - drag.offsetWidth / 2) + 'px';
      drag.style.top = (touch.clientY - drag.offsetHeight / 2) + 'px';

      // Detecta dropzones bajo el dedo
      dropzones.forEach(drop => {
        const rect = drop.getBoundingClientRect();
        if (
          touch.clientX > rect.left && touch.clientX < rect.right &&
          touch.clientY > rect.top && touch.clientY < rect.bottom
        ) {
          drop.classList.add('drop-hover');
        } else {
          drop.classList.remove('drop-hover');
        }
      });
    });

    drag.addEventListener('touchend', function(e) {
      drag.style.position = '';
      drag.style.left = '';
      drag.style.top = '';
      drag.classList.remove('dragging');
      drag.dataset.touching = '';

      const touch = e.changedTouches[0];
      let dropped = false;
      dropzones.forEach(drop => {
        const rect = drop.getBoundingClientRect();
        drop.classList.remove('drop-hover');
        if (
          touch.clientX > rect.left && touch.clientX < rect.right &&
          touch.clientY > rect.top && touch.clientY < rect.bottom
        ) {
          drop.appendChild(drag);
          dropped = true;
        }
      });
      // Opcional: regresa la imagen a su lugar original si no se soltó en un dropzone
    });
  });

  dropzones.forEach(drop => {
    drop.addEventListener('dragover', e => {
      e.preventDefault();
      drop.classList.add('drop-hover');
    });
    drop.addEventListener('dragleave', () => {
      drop.classList.remove('drop-hover');
    });
    drop.addEventListener('drop', e => {
      e.preventDefault();
      drop.classList.remove('drop-hover');
      const dragId = e.dataTransfer.getData('text/plain');
      const dragElem = document.getElementById(dragId);
      if (!dragElem) return;
      // Solo permite un drop por zona
      if (drop.childNodes.length > 0) return;

      // Verifica si el resultado es correcto
      if (dragElem.dataset.resultado === drop.dataset.resultado) {
        drop.appendChild(dragElem);
        dragElem.setAttribute('draggable', 'false');
        dragElem.classList.add('multi2-correcto');
        aciertos++;
        if (aciertos === 6) {
          setTimeout(() => {
            mostrarModal('¡Felicidades! Has completado todos los ejercicios de multiplicación.', showGames);
          }, 400);
        }
      } else {
        // Feedback visual de error
        drop.classList.add('multi2-incorrecto');
        setTimeout(() => drop.classList.remove('multi2-incorrecto'), 700);
      }
    });
  });

  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('multiplicacion')));
}

function showEjercicioDivision1() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-4-1.png" alt="Fondo ejercicio división 1" class="background-img">
      <div class="division1-layout">
        <div class="division1-img-grid">
          <img src="div-img1.png" class="division1-img" id="drag-1" draggable="true">
          <img src="div-img2.png" class="division1-img" id="drag-2" draggable="true">
          <img src="div-img3.png" class="division1-img" id="drag-3" draggable="true">
          <img src="div-img4.png" class="division1-img" id="drag-4" draggable="true">
          <img src="div-img5.png" class="division1-img" id="drag-5" draggable="true">
          <img src="div-img6.png" class="division1-img" id="drag-6" draggable="true">
        </div>
        <div class="division1-drop-row">
          <div class="division1-dropzone" id="drop-izq"></div>
          <div class="division1-dropzone" id="drop-der"></div>
        </div>
      </div>
    </div>
  `;

  const draggables = app.querySelectorAll('.division1-img');
  const dropzones = [document.getElementById('drop-izq'), document.getElementById('drop-der')];

  function checkCompletado() {
    const izq = document.getElementById('drop-izq').children.length;
    const der = document.getElementById('drop-der').children.length;
    if (izq === 3 && der === 3) {
      setTimeout(() => {
        mostrarModal('¡Correcto! Has completado el ejercicio de división.', showEjercicioDivision2);
      }, 400);
    }
  }

  draggables.forEach(drag => {
    drag.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', drag.id);
      setTimeout(() => drag.classList.add('dragging'), 0);
    });
    drag.addEventListener('dragend', () => {
      drag.classList.remove('dragging');
    });

    // Soporte táctil
    drag.addEventListener('touchstart', function (e) {
      drag.classList.add('dragging');
      drag.dataset.touching = 'true';
    });

    drag.addEventListener('touchmove', function (e) {
      if (!drag.dataset.touching) return;
      const touch = e.touches[0];
      drag.style.position = 'fixed';
      drag.style.left = (touch.clientX - drag.offsetWidth / 2) + 'px';
      drag.style.top = (touch.clientY - drag.offsetHeight / 2) + 'px';

      // Detecta dropzones bajo el dedo
      dropzones.forEach(drop => {
        const rect = drop.getBoundingClientRect();
        if (
          touch.clientX > rect.left && touch.clientX < rect.right &&
          touch.clientY > rect.top && touch.clientY < rect.bottom
        ) {
          drop.classList.add('drop-hover');
        } else {
          drop.classList.remove('drop-hover');
        }
      });
    });

    drag.addEventListener('touchend', function (e) {
      drag.style.position = '';
      drag.style.left = '';
      drag.style.top = '';
      drag.classList.remove('dragging');
      drag.dataset.touching = '';

      const touch = e.changedTouches[0];
      let dropped = false;
      dropzones.forEach(drop => {
        const rect = drop.getBoundingClientRect();
        drop.classList.remove('drop-hover');
        if (
          touch.clientX > rect.left && touch.clientX < rect.right &&
          touch.clientY > rect.top && touch.clientY < rect.bottom
        ) {
          if (drop.children.length < 3) {
            drop.appendChild(drag);
            dropped = true;
          }
        }
      });
      if (dropped) {
        checkCompletado();
      }
    });
  });

  dropzones.forEach(drop => {
    drop.addEventListener('dragover', e => {
      e.preventDefault();
      drop.classList.add('drop-hover');
    });
    drop.addEventListener('dragleave', () => {
      drop.classList.remove('drop-hover');
    });
    drop.addEventListener('drop', e => {
      e.preventDefault();
      drop.classList.remove('drop-hover');
      const dragId = e.dataTransfer.getData('text/plain');
      const dragElem = document.getElementById(dragId);
      if (!dragElem) return;
      if (drop.childNodes.length >= 3) return;
      drop.appendChild(dragElem);
      checkCompletado();
    });
  });

  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('division')));
}

function showEjercicioDivision2() {
  const app = document.getElementById('app');
  const resultado = Math.floor(Math.random() * 10) + 1; // 1 a 10
  const dividendo = resultado * 2; // Siempre par, 2 a 20

 app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-4-2.png" alt="Fondo ejercicio división 2" class="background-img">
      <div class="division2-ej2-layout division2-ej2-row-unique">
        <div class="division2-ej2-row">
          <div class="division2-ej2-num">${dividendo}</div>
          <div class="division2-ej2-simbolo">÷</div>
          <div class="division2-ej2-num">2</div>
          <div class="division2-ej2-simbolo">=</div>
          <input 
            type="number" 
            class="division2-ej2-input" 
            id="division2-input" 
            placeholder="?" 
            autocomplete="off"
            min="0"
          >
        </div>
      </div>
    </div>
  `;

  const input = document.getElementById('division2-input');
  input.addEventListener('input', () => {
    if (parseInt(input.value, 10) === resultado) {
      input.disabled = true;
      input.classList.add('division2-ej2-correcto');
      setTimeout(() => {
        mostrarModal('¡Felicidades! Has completado el ejercicio de división.', showGames);
      }, 400);
    } else {
      input.classList.remove('division2-ej2-correcto');
    }
  });
  input.addEventListener('focus', () => {
    input.placeholder = "";
    input.style.opacity = "1";
  });
  input.addEventListener('blur', () => {
    if (!input.value) {
      input.placeholder = "?";
      input.style.opacity = "0.5";
    }
  });

  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('division')));
}

// --- Ejercicios personalizados FRACCION ---
function showEjercicioFraccion1() {
  const app = document.getElementById('app');

  // Fracciones de la fila 2
  const fracciones = [
    { id: 'frac1', denominador: 8, respuesta: 5 },
    { id: 'frac2', denominador: 5, respuesta: 2 },
    { id: 'frac3', denominador: 8, respuesta: 3 }
  ];

  app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-5-1.png" alt="Fondo ejercicio fracción 1" class="background-img">
      <div class="fraccion1-layout">
        <!-- Fila 1: Fracción editable 1/4 -->
        <div class="fraccion1-fila1">
          <div class="fraccion1-frac-col">
            <input 
              type="number" 
              class="fraccion1-input" 
              id="fraccion1-numerador" 
              placeholder="?" 
              min="0"
              autocomplete="off"
            >
            <div class="fraccion1-denominador">4</div>
          </div>
        </div>
        <!-- Fila 2: Fracciones con imágenes de fondo -->
        <div class="fraccion1-fila2">
          <div class="fraccion1-frac-imgs">
            ${fracciones.map(f => `
              <div class="fraccion1-frac-col">
                <input 
                  type="number" 
                  class="fraccion1-input" 
                  id="${f.id}-numerador" 
                  placeholder="?" 
                  min="0"
                  autocomplete="off"
                >
                <div class="fraccion1-denominador">${f.denominador}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Validación lógica
  let aciertos = 0;

  // Primer input (1/4)
  const inputUno = document.getElementById('fraccion1-numerador');
  inputUno.addEventListener('input', () => {
    if (parseInt(inputUno.value, 10) === 1) {
      inputUno.disabled = true;
      inputUno.classList.add('fraccion1-correcto');
      aciertos++;
      checkFraccion1Completado();
    } else {
      inputUno.classList.remove('fraccion1-correcto');
    }
  });

  // Inputs de la fila 2
  fracciones.forEach(f => {
    const input = document.getElementById(`${f.id}-numerador`);
    input.addEventListener('input', () => {
      if (parseInt(input.value, 10) === f.respuesta) {
        input.disabled = true;
        input.classList.add('fraccion1-correcto');
        aciertos++;
        checkFraccion1Completado();
      } else {
        input.classList.remove('fraccion1-correcto');
      }
    });
  });

  function checkFraccion1Completado() {
    if (aciertos === 4) {
      setTimeout(() => {
        mostrarModal('¡Correcto! Has completado el ejercicio de fracciones.', showEjercicioFraccion2);
      }, 400);
    }
  }

  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('fraccion')));
}
function seleccionarOpcionFraccion1(valor, esCorrecta, btn) {
  document.getElementById('respuesta-fraccion1-numerador').value = valor;
  if (esCorrecta) {
    setTimeout(() => {
      mostrarModal('¡Correcto!', showEjercicioFraccion2);
    }, 400);
  } else {
    btn.classList.add('opcion-incorrecta');
    setTimeout(() => {
      btn.classList.remove('opcion-incorrecta');
      document.getElementById('respuesta-fraccion1-numerador').value = '';
    }, 700);
  }
}

function showEjercicioFraccion2() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container ejercicio-bg">
      <img src="f-5-2.png" alt="Fondo ejercicio fracción 2" class="background-img">
      <div class="fraccion2-ej2-layout">
        <div class="fraccion2-ej2-fila2">
          <div class="fraccion2-ej2-dropzone" id="drop-1"></div>
          <div class="fraccion2-ej2-dropzone" id="drop-2"></div>
          <div class="fraccion2-ej2-dropzone" id="drop-3"></div>
        </div>
        <div class="fraccion2-ej2-fila3">
          <img src="com_1.png" class="fraccion2-ej2-drag" id="drag-1" draggable="true">
          <img src="com_2.png" class="fraccion2-ej2-drag" id="drag-2" draggable="true">
          <img src="com_3.png" class="fraccion2-ej2-drag" id="drag-3" draggable="true">
        </div>
      </div>
    </div>
  `;

  // Relación correcta: drop-1 -> drag-1, drop-2 -> drag-2, drop-3 -> drag-3
  const dropzones = [
    { id: 'drop-1', correcto: 'drag-1' },
    { id: 'drop-2', correcto: 'drag-2' },
    { id: 'drop-3', correcto: 'drag-3' }
  ];

  function checkFraccion2Completado() {
    let completos = 0;
    dropzones.forEach(dz => {
      const dropElem = document.getElementById(dz.id);
      if (
        dropElem.children.length === 1 &&
        dropElem.firstElementChild.id === dz.correcto
      ) {
        completos++;
      }
    });
    if (completos === dropzones.length) {
      setTimeout(() => {
        mostrarModal('¡Felicidades! Has completado el ejercicio de fracciones.', showGames);
      }, 400);
    }
  }

  const draggables = app.querySelectorAll('.fraccion2-ej2-drag');
  const dropzonesEls = app.querySelectorAll('.fraccion2-ej2-dropzone');

  draggables.forEach(drag => {
    drag.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', drag.id);
      setTimeout(() => drag.classList.add('dragging'), 0);
    });
    drag.addEventListener('dragend', () => {
      drag.classList.remove('dragging');
    });

    // Soporte táctil
    drag.addEventListener('touchstart', function (e) {
      drag.classList.add('dragging');
      drag.dataset.touching = 'true';
    });

    drag.addEventListener('touchmove', function (e) {
      if (!drag.dataset.touching) return;
      const touch = e.touches[0];
      drag.style.position = 'fixed';
      drag.style.left = (touch.clientX - drag.offsetWidth / 2) + 'px';
      drag.style.top = (touch.clientY - drag.offsetHeight / 2) + 'px';

      // Detecta dropzones bajo el dedo
      dropzonesEls.forEach(drop => {
        const rect = drop.getBoundingClientRect();
        if (
          touch.clientX > rect.left && touch.clientX < rect.right &&
          touch.clientY > rect.top && touch.clientY < rect.bottom
        ) {
          drop.classList.add('drop-hover');
        } else {
          drop.classList.remove('drop-hover');
        }
      });
    });

    drag.addEventListener('touchend', function (e) {
      drag.style.position = '';
      drag.style.left = '';
      drag.style.top = '';
      drag.classList.remove('dragging');
      drag.dataset.touching = '';

      const touch = e.changedTouches[0];
      let dropped = false;
      dropzonesEls.forEach(drop => {
        const rect = drop.getBoundingClientRect();
        drop.classList.remove('drop-hover');
        if (
          touch.clientX > rect.left && touch.clientX < rect.right &&
          touch.clientY > rect.top && touch.clientY < rect.bottom
        ) {
          drop.appendChild(drag);
          dropped = true;
        }
      });
      if (dropped) {
        checkFraccion2Completado();
      }
    });
  });

  dropzonesEls.forEach((drop, idx) => {
    drop.addEventListener('dragover', e => {
      e.preventDefault();
      drop.classList.add('drop-hover');
    });
    drop.addEventListener('dragleave', () => {
      drop.classList.remove('drop-hover');
    });
    drop.addEventListener('drop', e => {
      e.preventDefault();
      drop.classList.remove('drop-hover');
      const dragId = e.dataTransfer.getData('text/plain');
      const dragElem = document.getElementById(dragId);
      if (!dragElem) return;
      if (drop.childNodes.length > 0) return;
      drop.appendChild(dragElem);
      dragElem.setAttribute('draggable', 'false');
      dragElem.classList.add('fraccion2-ej2-drag-correcto');
      checkFraccion2Completado();
    });
  });

  app.querySelector('.container').appendChild(crearVolver(() => showNiveles('fraccion')));
}

// Mostrar la pantalla de inicio al cargar la página
window.onload = showHome;
