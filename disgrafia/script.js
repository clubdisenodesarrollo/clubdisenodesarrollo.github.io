// --- Pantallas ---
function showHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container home-bg home-container">
      <img src="f-home.png" alt="Fondo pantalla inicio" class="background-img">
      <div class="home-content">
        <img src="logo.png" alt="Logo" class="logo-img">
        <img src="btn-iniciar.png" alt="Iniciar" class="main-btn-img iniciar-bottom" id="btn-iniciar">
      </div>
    </div>
  `;

  // Evento para iniciar
  document.getElementById('btn-iniciar').onclick = showGames;
}

function showGameScreen(juego, nivel) {
  const app = document.getElementById('app');

  if (juego === 1 && nivel === 1) {
    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-1.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="ejercicio-barras">
            ${[1, 2, 3, 4].map(i => `
              <div class="barra-row">
                <div class="barra-slider" data-index="${i - 1}">
                  <div class="barra-fondo"></div>
                  <img src="estrella.png" alt="Estrella" class="estrella-slider" id="estrella-${i}" style="left:0%;">
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
          <button class="nav-btn" id="btn-siguiente" style="visibility:hidden;">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>
      </div>
    `;

    // Lógica de deslizar
    let completados = [false, false, false, false];
    document.querySelectorAll('.barra-slider').forEach((barra, idx) => {
      const estrella = barra.querySelector('.estrella-slider');
      let dragging = false, startX = 0, barraRect = null;

      function onMove(e) {
        if (!dragging) return;
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let barraLeft = barraRect.left;
        let x = clientX - barraLeft;
        let max = barraRect.width - estrella.offsetWidth;
        let pos = Math.max(0, Math.min(x, max));
        estrella.style.left = `${pos}px`;
        if (pos >= max * 0.95) {
          completados[idx] = true;
          estrella.style.left = `${max}px`;
          barra.classList.add('barra-completa');
          barra.removeEventListener('mousedown', onDown);
          barra.removeEventListener('touchstart', onDown);
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('touchmove', onMove);
          document.removeEventListener('mouseup', onUp);
          document.removeEventListener('touchend', onUp);
          if (completados.every(Boolean)) {
            setTimeout(() => {
              document.getElementById('modal-bien').style.display = 'flex';
            }, 500);
          }
        }
      }
      function onUp() {
        dragging = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchend', onUp);
      }
      function onDown(e) {
        if (completados[idx]) return;
        dragging = true;
        barraRect = barra.getBoundingClientRect();
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchend', onUp);
      }
      estrella.addEventListener('mousedown', onDown);
      estrella.addEventListener('touchstart', onDown);
      estrella.addEventListener('dragstart', e => e.preventDefault());
    });

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(1, 2);

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = showGames;
    return;
  }

  if (juego === 1 && nivel === 2) {
    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-1.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="ejercicio-barras-vertical">
            <div class="barras-verticales">
              ${[1, 2, 3, 4].map(i => `
                <div class="barra-vertical-contenedor">
                  <img src="estrella.png" alt="Estrella" class="estrella-vertical" id="estrella-v${i}" style="position:absolute; left:0; top:0;">
                  <div class="barra-vertical">
                    <div class="barra-fondo-vertical"></div>
                    <div class="dropzone-vertical" data-index="${i - 1}"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
          <button class="nav-btn" id="btn-siguiente" style="visibility:hidden;">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>
      </div>
    `;

    // Lógica de arrastrar estrellas verticalmente
    let completados = [false, false, false, false];
    document.querySelectorAll('.barra-vertical-contenedor').forEach((contenedor, idx) => {
      const estrella = contenedor.querySelector('.estrella-vertical');
      const barra = contenedor.querySelector('.barra-vertical');
      let dragging = false, barraRect = null;

      function onMove(e) {
        if (!dragging) return;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let barraTop = barraRect.top;
        let y = clientY - barraTop;
        let max = barraRect.height - estrella.offsetHeight;
        let pos = Math.max(0, Math.min(y, max));
        estrella.style.top = `${pos}px`;
        if (pos >= max * 0.95) {
          completados[idx] = true;
          estrella.style.top = `${max}px`;
          barra.classList.add('barra-completa-vertical');
          estrella.removeEventListener('mousedown', onDown);
          estrella.removeEventListener('touchstart', onDown);
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('touchmove', onMove);
          document.removeEventListener('mouseup', onUp);
          document.removeEventListener('touchend', onUp);
          if (completados.every(Boolean)) {
            setTimeout(() => {
              document.getElementById('modal-bien').style.display = 'flex';
            }, 500);
          }
        }
      }
      function onUp() {
        dragging = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchend', onUp);
      }
      function onDown(e) {
        if (completados[idx]) return;
        dragging = true;
        barraRect = barra.getBoundingClientRect();
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchend', onUp);
      }
      estrella.addEventListener('mousedown', onDown);
      estrella.addEventListener('touchstart', onDown);
      estrella.addEventListener('dragstart', e => e.preventDefault());
      // Posiciona la estrella al inicio
      estrella.style.position = 'absolute';
      estrella.style.top = '0px';
      estrella.style.left = '0px';
    });

    // Modal siguiente ejercicio (puedes cambiar el destino si hay más ejercicios)
    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(1, 3);
    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(1, 1);
    return;
  }

  if (juego === 1 && nivel === 3) {
    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-1.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="ejercicio-diagonal-wrapper">
            <div class="ejercicio-barras">
              ${[1, 2, 3, 4].map(i => `
                <div class="barra-row">
                  <div class="barra-slider" data-index="${i - 1}">
                    <div class="barra-fondo"></div>
                    <img src="estrella.png" alt="Estrella" class="estrella-slider" id="estrella-${i}" style="left:0%;">
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
          <button class="nav-btn" id="btn-siguiente" style="visibility:hidden;">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
          <div class="modal-bien-content">
            <img src="felicidades.png" alt="felicidades" class="bien-img">
            <button class="main-btn-img" id="btn-modal-siguiente">
              <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
            </button>
          </div>
        </div>
      </div>
    `;

    // Lógica de deslizar compensando el scale
    let completados = [false, false, false, false];
    const scale = 0.9; // Debe coincidir con tu CSS
    document.querySelectorAll('.barra-slider').forEach((barra, idx) => {
      const estrella = barra.querySelector('.estrella-slider');
      let dragging = false, barraRect = null;

      function onMove(e) {
        if (!dragging) return;
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let barraLeft = barraRect.left;
        // Compensa el scale para el cálculo visual
        let x = (clientX - barraLeft) / scale;
        // Limita el recorrido al 80% del ancho real de la barra
        let max = ((barraRect.width - estrella.offsetWidth) / scale) * 1.5;
        let pos = Math.max(0, Math.min(x, max));
        estrella.style.left = `${pos * scale}px`;
        if (pos >= max * 0.99) {
          completados[idx] = true;
          estrella.style.left = `${max * scale}px`;
          barra.classList.add('barra-completa');
          barra.removeEventListener('mousedown', onDown);
          barra.removeEventListener('touchstart', onDown);
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('touchmove', onMove);
          document.removeEventListener('mouseup', onUp);
          document.removeEventListener('touchend', onUp);
          if (completados.every(Boolean)) {
            setTimeout(() => {
              document.getElementById('modal-bien').style.display = 'flex';
            }, 500);
          }
        }
      }
      function onUp() {
        dragging = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchend', onUp);
      }
      function onDown(e) {
        if (completados[idx]) return;
        dragging = true;
        barraRect = barra.getBoundingClientRect();
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchend', onUp);
      }
      estrella.addEventListener('mousedown', onDown);
      estrella.addEventListener('touchstart', onDown);
      estrella.addEventListener('dragstart', e => e.preventDefault());
    });

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGames();

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(1, 2);
    return;
  }







  if (juego === 2 && nivel === 1) {
    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-2.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="canvas-letra-container" style="display:flex;justify-content:center;align-items:center;height:100%;">
            <canvas id="canvas-letra" width="320" height="400" style="background:transparent;touch-action:none;"></canvas>
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>
      </div>
    `;

    // Pintar sobre la letra
    const canvas = document.getElementById('canvas-letra');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let painting = false;

    // Cargar la imagen de la letra
    const img = new Image();
    img.src = 'letra1.png';
    let letraImageData = null;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Guarda los datos de la imagen de la letra
      letraImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    // Funciones para pintar
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // Ajusta la posición a la escala real del canvas
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }
    // ...existing code...
    function startPaint(e) {
      painting = true;
      ctx.beginPath();
      const { x, y } = getPos(e);
      ctx.moveTo(x, y);
      e.preventDefault();
    }
    function paint(e) {
      if (!painting) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = 85;
      ctx.lineCap = "round";
      ctx.stroke();
      e.preventDefault();
    }
    function endPaint() {
      painting = false;
      checkLetraPintada();
    }
    // ...existing code...

    // Eventos mouse/touch
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', endPaint);
    canvas.addEventListener('mouseleave', endPaint);
    canvas.addEventListener('touchstart', startPaint);
    canvas.addEventListener('touchmove', paint);
    canvas.addEventListener('touchend', endPaint);

    // Validar si la letra está pintada (prueba simple)
    function checkLetraPintada() {
      // Datos originales de la letra
      const letraData = letraImageData.data;
      // Datos actuales del canvas (usuario)
      const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let pintados = 0, total = 0;
      for (let i = 0; i < letraData.length; i += 4) {
        // Solo cuenta los píxeles de la letra (opacos en la imagen original)
        if (letraData[i + 3] > 50) {
          total++;
          // Si el usuario pintó (el color ya no es blanco)
          if (!(userData[i] > 240 && userData[i + 1] > 240 && userData[i + 2] > 240)) {
            pintados++;
          }
        }
      }
      // Ajusta el umbral, por ejemplo 0.5 = 50% de la letra debe estar pintada
      if (pintados / total > 0.5) {
        setTimeout(() => {
          document.getElementById('modal-bien').style.display = 'flex';
        }, 400);
      }
    }

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(2, 2);

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = showGames;
    return;
  }
  if (juego === 2 && nivel === 2) {
    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-2.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="canvas-letra-container" style="display:flex;justify-content:center;align-items:center;height:100%;">
            <canvas id="canvas-letra" width="320" height="400" style="background:transparent;touch-action:none;"></canvas>
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>
      </div>
    `;

    // Pintar sobre la letra
    const canvas = document.getElementById('canvas-letra');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let painting = false;

    // Cargar la imagen de la letra
    const img = new Image();
    img.src = 'letra2.png';
    let letraImageData = null;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Guarda los datos de la imagen de la letra
      letraImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    // Funciones para pintar
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // Ajusta la posición a la escala real del canvas
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }
    function startPaint(e) {
      painting = true;
      ctx.beginPath();
      const { x, y } = getPos(e);
      ctx.moveTo(x, y);
      e.preventDefault();
    }
    function paint(e) {
      if (!painting) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = 85;
      ctx.lineCap = "round";
      ctx.stroke();
      e.preventDefault();
    }
    function endPaint() {
      painting = false;
      checkLetraPintada();
    }

    // Eventos mouse/touch
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', endPaint);
    canvas.addEventListener('mouseleave', endPaint);
    canvas.addEventListener('touchstart', startPaint);
    canvas.addEventListener('touchmove', paint);
    canvas.addEventListener('touchend', endPaint);

    // Validar si la letra está pintada (prueba simple)
    function checkLetraPintada() {
      // Datos originales de la letra
      const letraData = letraImageData.data;
      // Datos actuales del canvas (usuario)
      const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let pintados = 0, total = 0;
      for (let i = 0; i < letraData.length; i += 4) {
        // Solo cuenta los píxeles de la letra (opacos en la imagen original)
        if (letraData[i + 3] > 50) {
          total++;
          // Si el usuario pintó (el color ya no es blanco)
          if (!(userData[i] > 240 && userData[i + 1] > 240 && userData[i + 2] > 240)) {
            pintados++;
          }
        }
      }
      // Ajusta el umbral, por ejemplo 0.5 = 50% de la letra debe estar pintada
      if (pintados / total > 0.5) {
        setTimeout(() => {
          document.getElementById('modal-bien').style.display = 'flex';
        }, 400);
      }
    }

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(2, 3);

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = showGames;
    return;
  }
  if (juego === 2 && nivel === 3) {
    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-2.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="canvas-letra-container" style="display:flex;justify-content:center;align-items:center;height:100%;">
            <canvas id="canvas-letra" width="320" height="400" style="background:transparent;touch-action:none;"></canvas>
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>
      </div>
    `;

    // Pintar sobre la letra
    const canvas = document.getElementById('canvas-letra');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let painting = false;

    // Cargar la imagen de la letra
    const img = new Image();
    img.src = 'letra3.png';
    let letraImageData = null;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Guarda los datos de la imagen de la letra
      letraImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    // Funciones para pintar
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // Ajusta la posición a la escala real del canvas
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }
    function startPaint(e) {
      painting = true;
      ctx.beginPath();
      const { x, y } = getPos(e);
      ctx.moveTo(x, y);
      e.preventDefault();
    }
    function paint(e) {
      if (!painting) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = 85;
      ctx.lineCap = "round";
      ctx.stroke();
      e.preventDefault();
    }
    function endPaint() {
      painting = false;
      checkLetraPintada();
    }
    // Eventos mouse/touch
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', endPaint);
    canvas.addEventListener('mouseleave', endPaint);
    canvas.addEventListener('touchstart', startPaint);
    canvas.addEventListener('touchmove', paint);
    canvas.addEventListener('touchend', endPaint);

    // Validar si la letra está pintada (prueba simple)
    function checkLetraPintada() {
      // Datos originales de la letra
      const letraData = letraImageData.data;
      // Datos actuales del canvas (usuario)
      const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let pintados = 0, total = 0;
      for (let i = 0; i < letraData.length; i += 4) {
        // Solo cuenta los píxeles de la letra (opacos en la imagen original)
        if (letraData[i + 3] > 50) {
          total++;
          // Si el usuario pintó (el color ya no es blanco)
          if (!(userData[i] > 240 && userData[i + 1] > 240 && userData[i + 2] > 240)) {
            pintados++;
          }
        }
      }
      // Ajusta el umbral, por ejemplo 0.5 = 50% de la letra debe estar pintada
      if (pintados / total > 0.5) {
        setTimeout(() => {
          document.getElementById('modal-bien').style.display = 'flex';
        }, 400);
      }
    }

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(2, 4);

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(2, 2);
    return;
  }
  if (juego === 2 && nivel === 4) {
    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-2.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="canvas-letra-container" style="display:flex;justify-content:center;align-items:center;height:100%;">
            <canvas id="canvas-letra" width="320" height="400" style="background:transparent;touch-action:none;"></canvas>
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>
      </div>
    `;

    // Pintar sobre la letra
    const canvas = document.getElementById('canvas-letra');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let painting = false;

    // Cargar la imagen de la letra
    const img = new Image();
    img.src = 'letra4.png';
    let letraImageData = null;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Guarda los datos de la imagen de la letra
      letraImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    // Funciones para pintar
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // Ajusta la posición a la escala real del canvas
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }
    function startPaint(e) {
      painting = true;
      ctx.beginPath();
      const { x, y } = getPos(e);
      ctx.moveTo(x, y);
      e.preventDefault();
    }
    function paint(e) {
      if (!painting) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = 85;
      ctx.lineCap = "round";
      ctx.stroke();
      e.preventDefault();
    }
    function endPaint() {
      painting = false;
      checkLetraPintada();
    }

    // Eventos mouse/touch
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', endPaint);
    canvas.addEventListener('mouseleave', endPaint);
    canvas.addEventListener('touchstart', startPaint);
    canvas.addEventListener('touchmove', paint);
    canvas.addEventListener('touchend', endPaint);

    // Validar si la letra está pintada (prueba simple)
    function checkLetraPintada() {
      // Datos originales de la letra
      const letraData = letraImageData.data;
      // Datos actuales del canvas (usuario)
      const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let pintados = 0, total = 0;
      for (let i = 0; i < letraData.length; i += 4) {
        // Solo cuenta los píxeles de la letra (opacos en la imagen original)
        if (letraData[i + 3] > 50) {
          total++;
          // Si el usuario pintó (el color ya no es blanco)
          if (!(userData[i] > 240 && userData[i + 1] > 240 && userData[i + 2] > 240)) {
            pintados++;
          }
        }
      }
      // Ajusta el umbral, por ejemplo 0.5 = 50% de la letra debe estar pintada
      if (pintados / total > 0.5) {
        setTimeout(() => {
          document.getElementById('modal-bien').style.display = 'flex';
        }, 400);
      }
    }

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(2, 5);

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(2, 3);
    return;
  }
  if (juego === 2 && nivel === 5) {
    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-2.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="canvas-letra-container" style="display:flex;justify-content:center;align-items:center;height:100%;">
            <canvas id="canvas-letra" width="320" height="400" style="background:transparent;touch-action:none;"></canvas>
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>
      </div>
    `;

    // Pintar sobre la letra
    const canvas = document.getElementById('canvas-letra');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let painting = false;

    // Cargar la imagen de la letra
    const img = new Image();
    img.src = 'letra5.png';
    let letraImageData = null;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Guarda los datos de la imagen de la letra
      letraImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    // Funciones para pintar
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // Ajusta la posición a la escala real del canvas
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }
    function startPaint(e) {
      painting = true;
      ctx.beginPath();
      const { x, y } = getPos(e);
      ctx.moveTo(x, y);
      e.preventDefault();
    }
    function paint(e) {
      if (!painting) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = 85;
      ctx.lineCap = "round";
      ctx.stroke();
      e.preventDefault();
    }
    function endPaint() {
      painting = false;
      checkLetraPintada();
    }

    // Eventos mouse/touch
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', endPaint);
    canvas.addEventListener('mouseleave', endPaint);
    canvas.addEventListener('touchstart', startPaint);
    canvas.addEventListener('touchmove', paint);
    canvas.addEventListener('touchend', endPaint);

    // Validar si la letra está pintada (prueba simple)
    function checkLetraPintada() {
      // Datos originales de la letra
      const letraData = letraImageData.data;
      // Datos actuales del canvas (usuario)
      const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let pintados = 0, total = 0;
      for (let i = 0; i < letraData.length; i += 4) {
        // Solo cuenta los píxeles de la letra (opacos en la imagen original)
        if (letraData[i + 3] > 50) {
          total++;
          // Si el usuario pintó (el color ya no es blanco)
          if (!(userData[i] > 240 && userData[i + 1] > 240 && userData[i + 2] > 240)) {
            pintados++;
          }
        }
      }
      // Ajusta el umbral, por ejemplo 0.5 = 50% de la letra debe estar pintada
      if (pintados / total > 0.5) {
        setTimeout(() => {
          document.getElementById('modal-bien').style.display = 'flex';
        }, 400);
      }
    }

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(2, 6);

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(2, 4);
    return;
  }
  if (juego === 2 && nivel === 6) {
    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-2.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="canvas-letra-container" style="display:flex;justify-content:center;align-items:center;height:100%;">
            <canvas id="canvas-letra" width="320" height="400" style="background:transparent;touch-action:none;"></canvas>
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
          <div class="modal-bien-content">
            <img src="felicidades.png" alt="felicidades" class="bien-img">
            <button class="main-btn-img" id="btn-modal-siguiente">
              <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
            </button>
          </div>
        </div>
      </div>
    `;

    // Pintar sobre la letra
    const canvas = document.getElementById('canvas-letra');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let painting = false;

    // Cargar la imagen de la letra
    const img = new Image();
    img.src = 'letra6.png';
    let letraImageData = null;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Guarda los datos de la imagen de la letra
      letraImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    // Funciones para pintar
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      // Ajusta la posición a la escala real del canvas
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function startPaint(e) {
      painting = true;
      ctx.beginPath();
      const { x, y } = getPos(e);
      ctx.moveTo(x, y);
      e.preventDefault();
    }
    function paint(e) {
      if (!painting) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#f39c12";
      ctx.lineWidth = 85;
      ctx.lineCap = "round";
      ctx.stroke();
      e.preventDefault();
    }
    function endPaint() {
      painting = false;
      checkLetraPintada();
    }

    // Eventos mouse/touch
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', endPaint);
    canvas.addEventListener('mouseleave', endPaint);
    canvas.addEventListener('touchstart', startPaint);
    canvas.addEventListener('touchmove', paint);
    canvas.addEventListener('touchend', endPaint);

    // Validar si la letra está pintada (prueba simple)
    function checkLetraPintada() {
      // Datos originales de la letra
      const letraData = letraImageData.data;
      // Datos actuales del canvas (usuario)
      const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let pintados = 0, total = 0;
      for (let i = 0; i < letraData.length; i += 4) {
        // Solo cuenta los píxeles de la letra (opacos en la imagen original)
        if (letraData[i + 3] > 50) {
          total++;
          // Si el usuario pintó (el color ya no es blanco)
          if (!(userData[i] > 240 && userData[i + 1] > 240 && userData[i + 2] > 240)) {
            pintados++;
          }
        }
      }
      // Ajusta el umbral, por ejemplo 0.5 = 50% de la letra debe estar pintada
      if (pintados / total > 0.5) {
        setTimeout(() => {
          document.getElementById('modal-bien').style.display = 'flex';
        }, 400);
      }
    }

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGames();

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(2, 5);
    return;
  }





  if (juego === 3 && nivel === 1) {
    // Opciones base
    const opciones = [
      { src: "op1_1.png", correcta: true },
      { src: "op1_2.png", correcta: false },
      { src: "op1_3.png", correcta: false },
      { src: "op1_4.png", correcta: false },
      { src: "op1_5.png", correcta: false },
      { src: "op1_6.png", correcta: false }
    ];

    // Función para mezclar el array (Fisher-Yates)
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Mezcla las opciones
    const opcionesMezcladas = shuffle([...opciones]);

    app.innerHTML = `
    <div class="container juego-container">
      <img src="f-3.png" alt="Fondo juego" class="background-img">
      <div class="juego-header">
        <button class="casita-btn" id="btn-casita">
          <img src="casita.png" alt="Inicio">
        </button>
      </div>
      <div class="juego-content">
        <div class="opciones-contenedor" id="opciones-contenedor" style="opacity:1; transition: opacity 0.5s;">
          ${opcionesMezcladas.map((op, idx) => `
            <button class="opcion-btn" data-correcta="${op.correcta ? "1" : ""}">
              <img src="${op.src}" alt="Opción ${idx + 1}">
            </button>
          `).join('')}
        </div>
      </div>
      <div class="juego-footer">
        <button class="nav-btn" id="btn-atras">
          <img src="volver.png" alt="Atrás">
        </button>
      </div>

      <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>

      <div class="modal-error" id="modal-error" style="display:none;">
        <div class="modal-error-content">
          <img src="error.png" alt="Intenta de nuevo" class="error-img">
        </div>
      </div>
    </div>
  `;

    // Lógica de selección de opción correcta/incorrecta
    document.querySelectorAll('.opcion-btn').forEach(btn => {
      btn.onclick = function () {
        if (btn.dataset.correcta === "1") {
          // Opción correcta: oculta el contenedor de botones y muestra el modal de bien hecho
          const cont = document.getElementById('opciones-contenedor');
          cont.style.opacity = 0;
          setTimeout(() => {
            cont.style.display = 'none';
            document.getElementById('modal-bien').style.display = 'flex';
          }, 1000);
        } else {
          // Opción incorrecta: muestra el modal de error temporalmente
          const modalError = document.getElementById('modal-error');
          modalError.style.display = 'flex';
          setTimeout(() => {
            modalError.style.display = 'none';
          }, 1000);
        }
      };
    });

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(3, 2);

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = showGames;
    return;
  }
  if (juego === 3 && nivel === 2) {
    // Opciones base
    const opciones = [
      { src: "op2_1.png", correcta: true },
      { src: "op2_2.png", correcta: false },
      { src: "op2_3.png", correcta: false },
      { src: "op2_4.png", correcta: false },
      { src: "op2_5.png", correcta: false },
      { src: "op2_6.png", correcta: false }
    ];

    // Función para mezclar el array (Fisher-Yates)
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Mezcla las opciones
    const opcionesMezcladas = shuffle([...opciones]);

    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-3-2.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
       <div class="juego-content">
      <div class="opciones-contenedor" id="opciones-contenedor" style="opacity:1; transition: opacity 0.5s;">
        ${opcionesMezcladas.map((op, idx) => `
          <button class="opcion-btn" data-correcta="${op.correcta ? "1" : ""}">
            <img src="${op.src}" alt="Opción ${idx + 1}">
          </button>
        `).join('')}
      </div>
    </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>


        <div class="modal-bien" id="modal-bien" style="display:none;">
          <div class="modal-bien-content">
            <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
            <button class="main-btn-img" id="btn-modal-siguiente">
              <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
            </button>
          </div>
        </div>

        <div class="modal-error" id="modal-error" style="display:none;">
          <div class="modal-error-content">
            <img src="error.png" alt="Intenta de nuevo" class="error-img">
          </div>
        </div>



      </div>
    `;

    // Lógica de selección de opción correcta
    document.querySelectorAll('.opcion-btn').forEach(btn => {
      btn.onclick = function () {
        if (btn.dataset.correcta === "1") {
          // Opción correcta: oculta el contenedor de botones y muestra el modal de bien hecho
          const cont = document.getElementById('opciones-contenedor');
          cont.style.opacity = 0;
          setTimeout(() => {
            cont.style.display = 'none';
            document.getElementById('modal-bien').style.display = 'flex';
          }, 1000);
        } else {
          // Opción incorrecta: muestra el modal de error temporalmente
          const modalError = document.getElementById('modal-error');
          modalError.style.display = 'flex';
          setTimeout(() => {
            modalError.style.display = 'none';
          }, 1000);
        }
      };
    });

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(3, 3);

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(3, 1);
    return;
  }
  if (juego === 3 && nivel === 3) {
    // Opciones base
    const opciones = [
      { src: "op3_1.png", correcta: true },
      { src: "op3_2.png", correcta: false },
      { src: "op3_3.png", correcta: false },
      { src: "op3_4.png", correcta: false },
      { src: "op3_5.png", correcta: false },
      { src: "op3_6.png", correcta: false }
    ];

    // Función para mezclar el array (Fisher-Yates)
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Mezcla las opciones
    const opcionesMezcladas = shuffle([...opciones]);

    // Renderiza los botones
    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-3-3.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="opciones-contenedor" id="opciones-contenedor" style="opacity:1; transition: opacity 0.5s;">
            ${opcionesMezcladas.map((op, idx) => `
              <button class="opcion-btn" data-correcta="${op.correcta ? "1" : ""}">
                <img src="${op.src}" alt="Opción ${idx + 1}">
              </button>
            `).join('')}
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>



        <div class="modal-bien" id="modal-bien" style="display:none;">
          <div class="modal-bien-content">
            <img src="felicidades.png" alt="Bien hecho" class="bien-img">
            <button class="main-btn-img" id="btn-modal-siguiente">
              <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
            </button>
          </div>
        </div>

        <div class="modal-error" id="modal-error" style="display:none;">
          <div class="modal-error-content">
            <img src="error.png" alt="Intenta de nuevo" class="error-img">
          </div>
        </div>
      </div>
    `;

    // Lógica de selección de opción correcta
    document.querySelectorAll('.opcion-btn').forEach(btn => {
      btn.onclick = function () {
        if (btn.dataset.correcta === "1") {
          // Opción correcta: oculta el contenedor de botones y muestra el modal de bien hecho
          const cont = document.getElementById('opciones-contenedor');
          cont.style.opacity = 0;
          setTimeout(() => {
            cont.style.display = 'none';
            document.getElementById('modal-bien').style.display = 'flex';
          }, 1000);
        } else {
          // Opción incorrecta: muestra el modal de error temporalmente
          const modalError = document.getElementById('modal-error');
          modalError.style.display = 'flex';
          setTimeout(() => {
            modalError.style.display = 'none';
          }, 1000);
        }
      };
    });

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGames();

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(3, 2);
    return;
  }









  if (juego === 4 && nivel === 1) {
    // Palabra y letras faltantes
    const palabra = ['A', 'N', 'I', 'L', 'L', 'O'];
    const faltantes = [1, 3, 4]; // Índices de letras faltantes: N, L, L

    const letrasCorrectas = faltantes.map(i => palabra[i]);
    const distractores = ['S', 'E']; // Puedes cambiar los distractores

    // Opciones mezcladas
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    const opciones = shuffle([...letrasCorrectas, ...distractores]);

    // Baraja el orden de los espacios faltantes
    const faltantesAleatorio = shuffle([...faltantes]);
    // Estado de los espacios vacíos
    let espacios = Array(faltantesAleatorio.length).fill('');

    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-4-1.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content" style="display:flex;flex-direction:column;justify-content:flex-end;height:100%;">
          <div class="palabra-fila" id="palabra-fila" style="display:flex;justify-content:center;gap:12px;margin-bottom:32px;">
            ${palabra.map((letra, idx) =>
      faltantesAleatorio.includes(idx)
        ? `<div class="letra-faltante" data-pos="${faltantesAleatorio.indexOf(idx)}" id="espacio-${faltantesAleatorio.indexOf(idx)}">_</div>`
        : `<div class="letra-presente">${letra}</div>`
    ).join('')}
          </div>
          <div class="opciones-letras-fila" id="opciones-letras-fila" style="display:flex;justify-content:center;gap:18px;">
            ${opciones.map((letra, idx) => `
              <button class="letra-opcion-btn" data-letra="${letra}" id="opcion-letra-${idx}">${letra}</button>
            `).join('')}
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
          <div class="modal-bien-content">
            <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
            <button class="main-btn-img" id="btn-modal-siguiente">
              <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
            </button>
          </div>
        </div>
      </div>
    `;

    // Lógica de selección de letras (puede llenar cualquier espacio en cualquier orden)
    document.querySelectorAll('.letra-opcion-btn').forEach(btn => {
      btn.onclick = function () {
        const letra = btn.dataset.letra;
        let colocado = false;
        for (let i = 0; i < faltantesAleatorio.length; i++) {
          const idxReal = faltantesAleatorio[i];
          if (!espacios[i] && palabra[idxReal] === letra) {
            document.getElementById(`espacio-${i}`).textContent = letra;
            btn.style.visibility = 'hidden';
            espacios[i] = letra;
            colocado = true;
            break;
          }
        }
        if (!colocado) {
          btn.classList.add('letra-opcion-error');
          setTimeout(() => btn.classList.remove('letra-opcion-error'), 400);
        } else if (espacios.every(l => l)) {
          setTimeout(() => {
            document.getElementById('modal-bien').style.display = 'flex';
          }, 400);
        }
      };
    });

    // Modal siguiente ejercicio
    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(4, 2);

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = showGames;
    return;
  }
  if (juego === 4 && nivel === 2) {
    // Palabra y letras faltantes
    const palabra = ['C', 'A', 'M', 'I', 'Ó', 'N'];
    const faltantes = [1, 3, 4]; // Índices de letras faltantes: A, I, Ó
    const letrasCorrectas = faltantes.map(i => palabra[i]);
    const distractores = ['S', 'E']; // Puedes cambiar los distractores

    // Opciones mezcladas
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    const opciones = shuffle([...letrasCorrectas, ...distractores]);

    // Estado de los espacios vacíos
    let espacios = Array(faltantes.length).fill('');

    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-4-2.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content" style="display:flex;flex-direction:column;justify-content:flex-end;height:100%;">
          <div class="palabra-fila" id="palabra-fila" style="display:flex;justify-content:center;gap:12px;margin-bottom:32px;">
            ${palabra.map((letra, idx) =>
      faltantes.includes(idx)
        ? `<div class="letra-faltante" data-pos="${faltantes.indexOf(idx)}" id="espacio-${faltantes.indexOf(idx)}">_</div>`
        : `<div class="letra-presente">${letra}</div>`
    ).join('')}
          </div>
          <div class="opciones-letras-fila" id="opciones-letras-fila" style="display:flex;justify-content:center;gap:18px;">
            ${opciones.map((letra, idx) => `
              <button class="letra-opcion-btn" data-letra="${letra}" id="opcion-letra-${idx}">${letra}</button>
            `).join('')}
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
          <div class="modal-bien-content">
            <img src="felicidades.png" alt="Bien hecho" class="bien-img">
            <button class="main-btn-img" id="btn-modal-siguiente">
              <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
            </button>
          </div>
        </div>
      </div>
    `;

    // Lógica de selección de letras
    let siguienteEspacio = 0;
    document.querySelectorAll('.letra-opcion-btn').forEach(btn => {
      btn.onclick = function () {
        const letra = btn.dataset.letra;
        // ¿Es la letra correcta para el siguiente espacio?
        if (letra === letrasCorrectas[siguienteEspacio]) {
          // Coloca la letra en el espacio correspondiente
          document.getElementById(`espacio-${siguienteEspacio}`).textContent = letra;
          btn.style.visibility = 'hidden';
          espacios[siguienteEspacio] = letra;
          siguienteEspacio++;
          // ¿Completó todos los espacios?
          if (espacios.every(l => l)) {
            setTimeout(() => {
              document.getElementById('modal-bien').style.display = 'flex';
            }, 400);
          }
        } else {
          // Animación de error (temblor)
          btn.classList.add('letra-opcion-error');
          setTimeout(() => btn.classList.remove('letra-opcion-error'), 400);
        }
      };
    });

    // Modal siguiente ejercicio: vuelve a la pantalla de juegos
    document.getElementById('btn-modal-siguiente').onclick = showGames;

    // Navegación
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(4, 1);
    return;
  }




  if (juego === 5 && nivel === 1) {
    const opciones = [
      { src: "letra51_2.png", correcta: true },
      { src: "letra51_3.png", correcta: false }
    ];
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    const opcionesMezcladas = shuffle([...opciones]);

    app.innerHTML = `
    <div class="container juego-container">
      <img src="f-5-1.png" alt="Fondo juego" class="background-img">
      <div class="juego-header">
        <button class="casita-btn" id="btn-casita">
          <img src="casita.png" alt="Inicio">
        </button>
      </div>
      <div class="juego-content" style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">
        <div class="rompe-fila1" style="display:flex;flex-direction:column;justify-content:center;align-items:center;gap:0;">
          <img src="letra51_1.png" alt="Parte 1" id="pieza-1" style="width:120px;height:auto;">
          <img src="" alt="Parte 2" id="pieza-2" style="width:120px;height:auto;visibility:hidden;">
        </div>
        <div class="rompe-fila2" style="display:flex;justify-content:center;gap:32px;margin-top:32px;">
          ${opcionesMezcladas.map((op, idx) => `
            <button class="rompe-opcion-btn" data-correcta="${op.correcta ? "1" : ""}" id="rompe-opcion-${idx}" style="background:none;border:none;padding:0;">
              <img src="${op.src}" alt="Opción ${idx + 1}" style="width:120px;height:auto;">
            </button>
          `).join('')}
        </div>
      </div>
      <div class="juego-footer">
        <button class="nav-btn" id="btn-atras">
          <img src="volver.png" alt="Atrás">
        </button>
      </div>
      <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>
      <div class="modal-error" id="modal-error" style="display:none;">
        <div class="modal-error-content">
          <img src="error.png" alt="Intenta de nuevo" class="error-img">
        </div>
      </div>
    </div>
  `;

    document.querySelectorAll('.rompe-opcion-btn').forEach(btn => {
      btn.onclick = function () {
        if (btn.dataset.correcta === "1") {
          // Desactiva todos los botones para evitar dobles clics SOLO si es correcta
          document.querySelectorAll('.rompe-opcion-btn').forEach(b => b.disabled = true);

          // Oculta inmediatamente las opciones incorrectas
          document.querySelectorAll('.rompe-opcion-btn').forEach(b => {
            if (b !== btn) b.style.visibility = 'hidden';
          });

          // Solo la correcta sube
          btn.classList.add('animar-subida');

          setTimeout(() => {
            const pieza2 = document.getElementById('pieza-2');
            pieza2.src = btn.querySelector('img').src;
            pieza2.style.visibility = 'visible';
            pieza2.style.marginTop = '-24px'; // Ajusta según tu diseño
            btn.style.visibility = 'hidden';
            setTimeout(() => {
              document.getElementById('modal-bien').style.display = 'flex';
            }, 1000);
          }, 500);
        } else {
          // Opción incorrecta: muestra el modal de error temporalmente
          const modalError = document.getElementById('modal-error');
          modalError.style.display = 'flex';
          setTimeout(() => {
            modalError.style.display = 'none';
          }, 1000);
        }
      };
    });

    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(5, 2);
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = showGames;
    return;



  }











  if (juego === 5 && nivel === 2) {
    const opciones = [
      { src: "letra52_2.png", correcta: true },
      { src: "letra52_3.png", correcta: false }
    ];
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    const opcionesMezcladas = shuffle([...opciones]);

    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-5-1.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content" style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">
          <div class="rompe-fila1" style="display:flex;flex-direction:column;justify-content:center;align-items:center;gap:0;">
            <img src="letra52_1.png" alt="Parte 1" id="pieza-1" style="width:120px;height:auto;">
            <img src="" alt="Parte 2" id="pieza-2" style="width:120px;height:auto;visibility:hidden;">
          </div>
          <div class="rompe-fila2" style="display:flex;justify-content:center;gap:32px;margin-top:32px;">
            ${opcionesMezcladas.map((op, idx) => `
              <button class="rompe-opcion-btn" data-correcta="${op.correcta ? "1" : ""}" id="rompe-opcion-${idx}" style="background:none;border:none;padding:0;">
                <img src="${op.src}" alt="Opción ${idx + 1}" style="width:120px;height:auto;">
              </button>
            `).join('')}
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="bien-hecho.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>
      <div class="modal-error" id="modal-error" style="display:none;">
        <div class="modal-error-content">
          <img src="error.png" alt="Intenta de nuevo" class="error-img">
        </div>
      </div>
      </div>
    `;

    document.querySelectorAll('.rompe-opcion-btn').forEach(btn => {
      btn.onclick = function () {
        if (btn.dataset.correcta === "1") {
          // Desactiva todos los botones para evitar dobles clics SOLO si es correcta
          document.querySelectorAll('.rompe-opcion-btn').forEach(b => b.disabled = true);

          // Oculta inmediatamente las opciones incorrectas
          document.querySelectorAll('.rompe-opcion-btn').forEach(b => {
            if (b !== btn) b.style.visibility = 'hidden';
          });

          // Solo la correcta sube
          btn.classList.add('animar-subida');

          setTimeout(() => {
            const pieza2 = document.getElementById('pieza-2');
            pieza2.src = btn.querySelector('img').src;
            pieza2.style.visibility = 'visible';
            pieza2.style.marginTop = '-24px'; // Ajusta según tu diseño
            btn.style.visibility = 'hidden';
            setTimeout(() => {
              document.getElementById('modal-bien').style.display = 'flex';
            }, 1000);
          }, 500);
        } else {
          // Opción incorrecta: muestra el modal de error temporalmente
          const modalError = document.getElementById('modal-error');
          modalError.style.display = 'flex';
          setTimeout(() => {
            modalError.style.display = 'none';
          }, 1000);
        }
      };
    });

    document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(5, 3);
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(5, 1);
    return;
  }
  if (juego === 5 && nivel === 3) {
    const opciones = [
      { src: "letra53_2.png", correcta: true },
      { src: "letra53_3.png", correcta: false }
    ];
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    const opcionesMezcladas = shuffle([...opciones]);

    app.innerHTML = `
      <div class="container juego-container">
        <img src="f-5-1.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content" style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">
          <div class="rompe-fila1" style="display:flex;flex-direction:column;justify-content:center;align-items:center;gap:0;">
            <img src="letra53_1.png" alt="Parte 1" id="pieza-1" style="width:120px;height:auto;">
            <img src="" alt="Parte 2" id="pieza-2" style="width:120px;height:auto;visibility:hidden;">
          </div>
          <div class="rompe-fila2" style="display:flex;justify-content:center;gap:32px;margin-top:32px;">
            ${opcionesMezcladas.map((op, idx) => `
              <button class="rompe-opcion-btn" data-correcta="${op.correcta ? "1" : ""}" id="rompe-opcion-${idx}" style="background:none;border:none;padding:0;">
                <img src="${op.src}" alt="Opción ${idx + 1}" style="width:120px;height:auto;">
              </button>
            `).join('')}
          </div>
        </div>
        <div class="juego-footer">
          <button class="nav-btn" id="btn-atras">
            <img src="volver.png" alt="Atrás">
          </button>
        </div>
        <div class="modal-bien" id="modal-bien" style="display:none;">
        <div class="modal-bien-content">
          <img src="felicidades.png" alt="Bien hecho" class="bien-img">
          <button class="main-btn-img" id="btn-modal-siguiente">
            <img src="siguiente.png" alt="Siguiente" class="siguiente-img">
          </button>
        </div>
      </div>
      <div class="modal-error" id="modal-error" style="display:none;">
        <div class="modal-error-content">
          <img src="error.png" alt="Intenta de nuevo" class="error-img">
        </div>
      </div>
      </div>
    `;

    document.querySelectorAll('.rompe-opcion-btn').forEach(btn => {
      btn.onclick = function () {
        if (btn.dataset.correcta === "1") {
          // Desactiva todos los botones para evitar dobles clics SOLO si es correcta
          document.querySelectorAll('.rompe-opcion-btn').forEach(b => b.disabled = true);

          // Oculta inmediatamente las opciones incorrectas
          document.querySelectorAll('.rompe-opcion-btn').forEach(b => {
            if (b !== btn) b.style.visibility = 'hidden';
          });

          // Solo la correcta sube
          btn.classList.add('animar-subida');

          setTimeout(() => {
            const pieza2 = document.getElementById('pieza-2');
            pieza2.src = btn.querySelector('img').src;
            pieza2.style.visibility = 'visible';
            pieza2.style.marginTop = '-24px'; // Ajusta según tu diseño
            btn.style.visibility = 'hidden';
            setTimeout(() => {
              document.getElementById('modal-bien').style.display = 'flex';
            }, 1000);
          }, 500);
        } else {
          // Opción incorrecta: muestra el modal de error temporalmente
          const modalError = document.getElementById('modal-error');
          modalError.style.display = 'flex';
          setTimeout(() => {
            modalError.style.display = 'none';
          }, 1000);
        }
      };
    });

    document.getElementById('btn-modal-siguiente').onclick = () => showGames();
    document.getElementById('btn-casita').onclick = showGames;
    document.getElementById('btn-atras').onclick = () => showGameScreen(5, 2);
    return;
  }




  // ...otros juegos y niveles...
}

// Ejemplo de asignación de eventos a los botones de juegos:
function showGames() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container juegos-container">
      <img src="f-juegos.png" alt="Fondo pantalla juegos" class="background-img">
      <div class="juegos-logo">
        <img src="logo.png" alt="Logo" class="logo-img">
      </div>
      <div class="juegos-botones">
        <button class="juego-btn juego-btn-1" id="juego1-btn">
          <img src="juego1.png" alt="Juego 1">
        </button>
        <div class="juegos-grid">
          <button class="juego-btn" id="juego2-btn">
            <img src="juego2.png" alt="Juego 2">
          </button>
          <button class="juego-btn" id="juego3-btn">
            <img src="juego3.png" alt="Juego 3">
          </button>
          <button class="juego-btn" id="juego4-btn">
            <img src="juego4.png" alt="Juego 4">
          </button>
          <button class="juego-btn" id="juego5-btn">
            <img src="juego5.png" alt="Juego 5">
          </button>
        </div>
      </div>
      <div class="juegos-salir">
        <button class="salir-btn" id="btn-salir">
          <img src="salir.png" alt="Salir">
        </button>
      </div>
    </div>
  `;

  // Eventos para cada botón de juego
  document.getElementById('juego1-btn').onclick = () => showGameScreen(1, 1);
  document.getElementById('juego2-btn').onclick = () => showGameScreen(2, 1);
  document.getElementById('juego3-btn').onclick = () => showGameScreen(3, 1);
  document.getElementById('juego4-btn').onclick = () => showGameScreen(4, 1);
  document.getElementById('juego5-btn').onclick = () => showGameScreen(5, 1);
  document.getElementById('btn-salir').onclick = showHome;
}

// Inicializar pantalla HOME al cargar
window.onload = showHome;
