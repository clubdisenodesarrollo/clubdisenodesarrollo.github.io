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
  app.innerHTML = `
    <div class="container juego-container">
      <img src="f-${juego}.png" alt="Fondo juego" class="background-img">
      <!-- Botón casita arriba -->
      <div class="juego-header">
        <button class="casita-btn" id="btn-casita">
          <img src="casita.png" alt="Inicio">
        </button>
      </div>
      <!-- Contenido del juego -->
      <div class="juego-content">
        <div class="juego-dinamico">
          <p class="juego-titulo">Juego ${juego} - Nivel ${nivel}</p>
        </div>
      </div>
      <!-- Botones de navegación abajo -->
      <div class="juego-footer">
        <button class="nav-btn" id="btn-atras">
          <img src="volver.png" alt="Atrás">
        </button>
        <button class="nav-btn" id="btn-siguiente">
          <img src="siguiente.png" alt="Siguiente">
        </button>
      </div>
    </div>
  `;

  // Navegación
  document.getElementById('btn-casita').onclick = showGames;
  document.getElementById('btn-atras').onclick = () => {
    if (nivel > 1) showGameScreen(juego, nivel - 1);
    else showGames();
  };
  document.getElementById('btn-siguiente').onclick = () => {
    const nivelesPorJuego = [5, 6, 6, 8, 6];
    if (nivel < nivelesPorJuego[juego - 1]) showGameScreen(juego, nivel + 1);
    else showGames();
  };
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