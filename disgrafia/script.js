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
            <h1 class="bien-text">¡Bien hecho!</h1>
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
            <h1 class="bien-text">¡Bien hecho!</h1>
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
        document.getElementById('btn-atras').onclick = () => showGameScreen(1, 2);
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
            <h1 class="bien-text">¡Bien hecho!</h1>
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
        document.getElementById('btn-modal-siguiente').onclick = () => showGameScreen(1, 4);

        // Navegación
        document.getElementById('btn-casita').onclick = showGames;
        document.getElementById('btn-atras').onclick = () => showGameScreen(1, 2);
        return;
    }
    if (juego === 1 && nivel === 4) {
        app.innerHTML = `
      <div class="container juego-container">
        <img src="f-1.png" alt="Fondo juego" class="background-img">
        <div class="juego-header">
          <button class="casita-btn" id="btn-casita">
            <img src="casita.png" alt="Inicio">
          </button>
        </div>
        <div class="juego-content">
          <div class="ejercicio-diagonal-wrapper-120">
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

        // Lógica de deslizar igual que en el ejercicio 3
        // ...dentro del if (juego === 1 && nivel === 4)...
        let completados = [false, false, false, false];
        const scale = 0.9;
        document.querySelectorAll('.barra-slider').forEach((barra, idx) => {
            const estrella = barra.querySelector('.estrella-slider');
            let dragging = false, barraRect = null;

            function onMove(e) {
                if (!dragging) return;
                let clientX = e.touches ? e.touches[0].clientX : e.clientX;
                let barraLeft = barraRect.left;
                let x = (clientX - barraLeft) / scale;
                let max = ((barraRect.width - estrella.offsetWidth) / scale) * 2.1; // o prueba 1.4, 1.5...
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
        document.getElementById('btn-atras').onclick = () => showGameScreen(1, 3);
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
