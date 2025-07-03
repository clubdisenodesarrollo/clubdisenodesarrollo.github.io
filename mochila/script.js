// Variables globales
let data = null;
let currentGrade = null;
let currentSubject = null;
let currentLecture = null;
let currentPage = 0;
let fontSize = 18;
let utterance = null;
let isSpeaking = false;
let isPaused = false;
let lastAudioText = "";

// Cargar datos JSON y mostrar HOME al inicio
async function loadData() {
  const res = await fetch('data.json');
  data = await res.json();
  showHome();
}
document.addEventListener('DOMContentLoaded', loadData);

// Función de audio genérica para TODAS las pantallas
function toggleAudioGeneric(getTextFn, refreshFn) {
  const text = getTextFn();
  if (!utterance || lastAudioText !== text) {
    stopSpeech();
    utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.onend = () => {
      isSpeaking = false;
      isPaused = false;
      utterance = null;
      lastAudioText = "";
      refreshFn();
    };
    utterance.onerror = () => {
      isSpeaking = false;
      isPaused = false;
      utterance = null;
      lastAudioText = "";
      refreshFn();
    };
    isSpeaking = true;
    isPaused = false;
    lastAudioText = text;
    window.speechSynthesis.speak(utterance);
    updateAudioIcon();
    return;
  }
  if (isSpeaking && !isPaused) {
    window.speechSynthesis.pause();
    isSpeaking = false;
    isPaused = true;
    updateAudioIcon();
    return;
  }
  if (!isSpeaking && isPaused) {
    window.speechSynthesis.resume();
    isSpeaking = true;
    isPaused = false;
    updateAudioIcon();
    return;
  }
}

// Actualiza solo el icono de audio sin renderizar toda la pantalla
function updateAudioIcon() {
  const iconSpan = document.getElementById('audioIcon');
  if (iconSpan) {
    let icon = isSpeaking ? '⏸️' : '▶️';
    if (isPaused) icon = '▶️';
    iconSpan.innerHTML = `${icon} AUDIO`;
  }
}

// Detener la voz completamente
function stopSpeech() {
  window.speechSynthesis.cancel();
  isSpeaking = false;
  isPaused = false;
  utterance = null;
  lastAudioText = "";
}

// Navegación de páginas de lectura
function nextPage() {
  stopSpeech();
  if (currentPage < currentLecture.paginas.length - 1) {
    currentPage++;
    renderLecture();
  }
}
function prevPage() {
  stopSpeech();
  if (currentPage > 0) {
    currentPage--;
    renderLecture();
  }
}

// Cambiar tamaño de fuente
function changeFontSize(delta, renderFn) {
  stopSpeech();
  fontSize = Math.max(14, Math.min(40, fontSize + delta));
  if (typeof renderFn === "function") renderFn();
}
function setFontSize(val, renderFn) {
  stopSpeech();
  fontSize = parseInt(val, 10);
  if (typeof renderFn === "function") renderFn();
}

// Funciones auxiliares para intro2
function nextIntro2Page() {
  stopSpeech();
  window.intro2Page = Math.min(window.intro2Page + 1, (data.intro2?.length || 1) - 1);
  showIntro2();
}
function prevIntro2Page() {
  stopSpeech();
  window.intro2Page = Math.max(window.intro2Page - 1, 0);
  showIntro2();
}

function goToGradesFromIntro2() {
  stopSpeech();
  window.intro2Page = 0;
  showGrades();
}

// Utilidad para renderizar la barra superior en todas las pantallas (menos HOME)
function renderTopBar({ backFn, audioFn }) {
  return `
    <div class="top-bar">
      <button class="back-btn" onclick="${backFn}">←</button>
      ${audioFn ? `
      <div class="lecture-audio" id="audioBtn" tabindex="0" style="display:inline-block;">
        <img id="audioIcon" src="sonido.png" alt="Audio" style="width:32px;height:32px;vertical-align:middle;cursor:pointer;">
      </div>
      ` : ""}
      <button class="menu-btn" onclick="toggleSidebar()">☰</button>
    </div>
    <div id="sidebar" class="sidebar" style="display:none;">
      <div class="sidebar-content">
        <button class="sidebar-close" onclick="toggleSidebar()">✕</button>
        <div class="sidebar-item" onclick="goToHomeFromSidebar()">INICIO</div>
        <div class="sidebar-item" onclick="goToIndicacionesFromSidebar()">INDICACIONES</div>
        <div class="sidebar-item" onclick="goToGradosFromSidebar()">GRADO</div>
      </div>
    </div>
  `;
}

// Sidebar funciones
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.style.display = (sidebar.style.display === 'none' || sidebar.style.display === '') ? 'block' : 'none';
  }
}
function goToHomeFromSidebar() {
  toggleSidebar();
  showHome();
}
function goToIndicacionesFromSidebar() {
  toggleSidebar();
  showIntro2();
}
function goToGradosFromSidebar() {
  toggleSidebar();
  showGrades();
}

// Pantalla de transición animada
function mostrarPantallaTransicion(fn) {
  document.getElementById('app').innerHTML = `
    <div class="pantalla-transicion">
      <img src="grado.png" alt="Cargando..." class="transicion-img">
    </div>
  `;
  setTimeout(fn, 1000); // 1 segundo
}

// Pantalla HOME
function showHome() {
  stopSpeech();
  currentGrade = null;
  currentSubject = null;
  currentLecture = null;
  currentPage = 0;
  document.getElementById('app').innerHTML = `
    <div class="container home-container">
      <h1></h1>
      <img src="logo.png" alt="Logo" class="logo">
      <button class="main-btn" onclick="mostrarPantallaTransicion(showIntro2)">EMPEZAR</button>
    </div>
  `;
}

// Pantalla INTRODUCCIÓN 2
function showIntro2() {
  stopSpeech();
  const introPages = data.intro2 || [];
  if (typeof window.intro2Page === "undefined") window.intro2Page = 0;
  let page = window.intro2Page;
  let totalPages = introPages.length;
  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  if (!introPages[page]) {
    document.getElementById('app').innerHTML = `<div class="lecture-text">No hay información de introducción.</div>`;
    return;
  }

  let { img, titulo, texto } = introPages[page];

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      ${renderTopBar({ backFn: "showHome()", audioFn: true })}
      <div class="lecture-text" id="lectureText"
        style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
        <img src="${img}" alt="" style="max-width:120px;display:block;margin:0 auto 18px auto;">
        <h2 style="text-align:center;">${titulo}</h2>
        <p style="text-align:center;">${texto}</p>
      </div>
      <div class="lecture-nav">
        <button class="nav-btn" onclick="prevIntro2Page()" ${page === 0 ? 'disabled' : ''}>⟵</button>
        <span>${page + 1} / ${totalPages}</span>
        <button class="nav-btn" onclick="nextIntro2Page()" ${page === totalPages - 1 ? 'disabled' : ''}>⟶</button>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showIntro2)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showIntro2)">
        <button onclick="changeFontSize(2, showIntro2)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="mostrarPantallaTransicion(goToGradesFromIntro2)">SIGUIENTE</button>
      </div>
    </div>
  `;
  const audioBtn = document.getElementById('audioBtn');
  if (audioBtn) {
    audioBtn.onclick = function () {
      toggleAudioGeneric(() => `${titulo}. ${texto}`, showIntro2);
    };
  }
}

// Pantalla GRADOS (primero)
function showGrades() {
  stopSpeech();
  let gradesHtml = data.grados.map(g => `
    <div class="grade-row" onclick="mostrarPantallaTransicion(() => showSubjects('${g.id}'))">
      <div class="grade-img"><img src="grado.png" alt="${g.nombre}"></div>
      <div class="grade-text">${g.nombre}</div>
    </div>
  `).join('');
  document.getElementById('app').innerHTML = `
    <div class="container grades-container">
      ${renderTopBar({ backFn: "showHome()", audioFn: null })}
      <div class="grades-list">${gradesHtml}</div>
    </div>
  `;
}

// Pantalla MATERIAS (después de elegir grado)
function showSubjects(gradeId) {
  stopSpeech();
  currentGrade = data.grados.find(g => g.id === gradeId);
  const materias = currentGrade.materias;
  let subjectsHtml = materias.map(m => `
    <div class="subject-row" onclick="mostrarPantallaTransicion(() => selectSubjectAndContinue('${m.id}'))">
      <div class="subject-img"><img src="materia.png" alt="${m.nombre}"></div>
      <div class="subject-text">${m.nombre}</div>
    </div>
  `).join('');
  document.getElementById('app').innerHTML = `
    <div class="container subjects-container">
      ${renderTopBar({ backFn: "showGrades()", audioFn: null })}
      <div class="subjects-list">${subjectsHtml}</div>
    </div>
  `;
}

function selectSubjectAndContinue(subjectId) {
  currentSubject = currentGrade.materias.find(m => m.id === subjectId);
  currentLecture = null; // Reinicia la lectura al cambiar de materia
  currentPage = 0;       // Reinicia la página al cambiar de materia
  showMenuMateria();
}

// Pantalla MENÚ DE MATERIA
function showMenuMateria() {
  stopSpeech();
  const nombreGrado = (currentGrade.nombre || "").toLowerCase();
  const isQuinto = nombreGrado.includes('quinto');
  const isSexto = nombreGrado.includes('sexto');
  const isSeptimo = nombreGrado.includes('séptimo') || nombreGrado.includes('septimo');
  document.getElementById('app').innerHTML = `
    <div class="container grades-container">
      ${renderTopBar({ backFn: `showSubjects('${currentGrade.id}')`, audioFn: null })}
      <div class="grado-identificador">
        <img src="grado.png" alt="Grado" class="grado-identificador-img">
        <span class="grado-identificador-text">${currentGrade.nombre}</span>
      </div>
      <div class="grades-list">
        <div class="grade-row" onclick="mostrarPantallaTransicion(showSignosPuntuacionIntro)">
          <div class="grade-img"><img src="signos.png" alt="Signos de puntuación"></div>
          <div class="grade-text">Signos de puntuación</div>
        </div>
        ${isQuinto ? `
        <div class="grade-row" onclick="mostrarPantallaTransicion(showGlosario5to)">
          <div class="grade-img"><img src="glosario.png" alt="Glosario"></div>
          <div class="grade-text">Glosario</div>
        </div>
        ` : ''}
        ${isSexto ? `
        <div class="grade-row" onclick="mostrarPantallaTransicion(showGlosario6to)">
          <div class="grade-img"><img src="glosario.png" alt="Glosario"></div>
          <div class="grade-text">Glosario</div>
        </div>
        ` : ''}
        ${isSeptimo ? `
        <div class="grade-row" onclick="mostrarPantallaTransicion(showGlosario7to)">
          <div class="grade-img"><img src="glosario.png" alt="Glosario"></div>
          <div class="grade-text">Glosario</div>
        </div>
        ` : ''}
        <div class="grade-row" onclick="mostrarPantallaTransicion(renderLecture)">
          <div class="grade-img"><img src="lectura.png" alt="Lectura"></div>
          <div class="grade-text">Lectura</div>
        </div>
        <div class="grade-row" onclick="mostrarPantallaTransicion(showAhoraVamosAJugar)">
          <div class="grade-img"><img src="juegos.png" alt="Juegos"></div>
          <div class="grade-text">Juegos</div>
        </div>
      </div>
    </div>
  `;
}

// Estado de la página actual de signos
window.signosPage = 0;

// Pantalla SIGNOS DE PUNTUACIÓN INTRO con paginación (ahora toma los datos del JSON)
function showSignosPuntuacionIntro() {
  stopSpeech();
  const signosPuntuacionPages = data.signosPuntuacionPages || [];
  let page = window.signosPage || 0;
  let totalPages = signosPuntuacionPages.length;
  let { img = "", titulo = "", texto = "" } = signosPuntuacionPages[page] || {};

  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      ${renderTopBar({ backFn: "showMenuMateria()", audioFn: true })}
      <div class="lecture-text" id="lectureText"
        style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
        <img src="${img}" alt="" style="max-width:80px;display:block;margin:0 auto 18px auto;">
        <h2 style="text-align:center;">${titulo}</h2>
        <p style="text-align:center;">${texto}</p>
      </div>
      <div class="lecture-nav">
        <button class="nav-btn" onclick="prevSignosPage()" ${page === 0 ? 'disabled' : ''}>⟵</button>
        <span>${page + 1} / ${totalPages}</span>
        <button class="nav-btn" onclick="nextSignosPage()" ${page === totalPages - 1 ? 'disabled' : ''}>⟶</button>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showSignosPuntuacionIntro)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showSignosPuntuacionIntro)">
        <button onclick="changeFontSize(2, showSignosPuntuacionIntro)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="showMenuMateria()">VOLVER</button>
      </div>
    </div>
  `;
  const audioBtn = document.getElementById('audioBtn');
  if (audioBtn) {
    audioBtn.onclick = function () {
      toggleAudioGeneric(() => `${titulo}. ${texto}`, showSignosPuntuacionIntro);
    };
  }
}

function showGlosario5to() {
  stopSpeech();
  const glosarioPages = data.glosario5Pages || [];
  let page = window.glosario5Page || 0;
  let totalPages = glosarioPages.length;
  let { img = "glosario.png", titulo = "", texto = "" } = glosarioPages[page] || {};

  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      ${renderTopBar({ backFn: "showMenuMateria()", audioFn: true })}
      <div class="lecture-text" id="lectureText"
        style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
        <img src="${img}" alt="" style="height:100px;display:block;margin:0 auto 18px auto;">
        <h2 style="text-align:center;">${titulo}</h2>
        <p style="text-align:center;">${texto}</p>
      </div>
      <div class="lecture-nav">
        <button class="nav-btn" onclick="prevGlosario5toPage()" ${page === 0 ? 'disabled' : ''}>⟵</button>
        <span>${page + 1} / ${totalPages}</span>
        <button class="nav-btn" onclick="nextGlosario5toPage()" ${page === totalPages - 1 ? 'disabled' : ''}>⟶</button>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showGlosario5to)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showGlosario5to)">
        <button onclick="changeFontSize(2, showGlosario5to)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="showMenuMateria()">VOLVER</button>
      </div>
    </div>
  `;
  const audioBtn = document.getElementById('audioBtn');
  if (audioBtn) {
    audioBtn.onclick = function () {
      toggleAudioGeneric(() => `${titulo}. ${texto}`, showGlosario5to);
    };
  }
}
function nextGlosario5toPage() {
  const glosarioPages = data.glosario5Pages || [];
  window.glosario5Page = Math.min((window.glosario5Page || 0) + 1, glosarioPages.length - 1);
  showGlosario5to();
}
function prevGlosario5toPage() {
  window.glosario5Page = Math.max((window.glosario5Page || 0) - 1, 0);
  showGlosario5to();
}
window.showGlosario5to = showGlosario5to;
window.nextGlosario5toPage = nextGlosario5toPage;
window.prevGlosario5toPage = prevGlosario5toPage;

function showGlosario6to() {
  stopSpeech();
  const glosarioPages = data.glosario6Pages || [];
  let page = window.glosario6Page || 0;
  let totalPages = glosarioPages.length;
  let { img = "glosario.png", titulo = "", texto = "" } = glosarioPages[page] || {};

  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      ${renderTopBar({ backFn: "showMenuMateria()", audioFn: true })}
      <div class="lecture-text" id="lectureText"
        style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
        <img src="${img}" alt="" style="max-width:80px;display:block;margin:0 auto 18px auto;">
        <h2 style="text-align:center;">${titulo}</h2>
        <p style="text-align:center;">${texto}</p>
      </div>
      <div class="lecture-nav">
        <button class="nav-btn" onclick="prevGlosario6toPage()" ${page === 0 ? 'disabled' : ''}>⟵</button>
        <span>${page + 1} / ${totalPages}</span>
        <button class="nav-btn" onclick="nextGlosario6toPage()" ${page === totalPages - 1 ? 'disabled' : ''}>⟶</button>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showGlosario6to)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showGlosario6to)">
        <button onclick="changeFontSize(2, showGlosario6to)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="showMenuMateria()">VOLVER</button>
      </div>
    </div>
  `;
  const audioBtn = document.getElementById('audioBtn');
  if (audioBtn) {
    audioBtn.onclick = function () {
      toggleAudioGeneric(() => `${titulo}. ${texto}`, showGlosario6to);
    };
  }
}
function nextGlosario6toPage() {
  const glosarioPages = data.glosario6Pages || [];
  window.glosario6Page = Math.min((window.glosario6Page || 0) + 1, glosarioPages.length - 1);
  showGlosario6to();
}
function prevGlosario6toPage() {
  window.glosario6Page = Math.max((window.glosario6Page || 0) - 1, 0);
  showGlosario6to();
}
window.showGlosario6to = showGlosario6to;
window.nextGlosario6toPage = nextGlosario6toPage;
window.prevGlosario6toPage = prevGlosario6toPage;

function showGlosario7to() {
  stopSpeech();
  const glosarioPages = data.glosario7Pages || [];
  let page = window.glosario7Page || 0;
  let totalPages = glosarioPages.length;
  let { img = "glosario.png", titulo = "", texto = "" } = glosarioPages[page] || {};

  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      ${renderTopBar({ backFn: "showMenuMateria()", audioFn: true })}
      <div class="lecture-text" id="lectureText"
        style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
        <img src="${img}" alt="" style="max-width:80px;display:block;margin:0 auto 18px auto;">
        <h2 style="text-align:center;">${titulo}</h2>
        <p style="text-align:center;">${texto}</p>
      </div>
      <div class="lecture-nav">
        <button class="nav-btn" onclick="prevGlosario7toPage()" ${page === 0 ? 'disabled' : ''}>⟵</button>
        <span>${page + 1} / ${totalPages}</span>
        <button class="nav-btn" onclick="nextGlosario7toPage()" ${page === totalPages - 1 ? 'disabled' : ''}>⟶</button>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showGlosario7to)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showGlosario7to)">
        <button onclick="changeFontSize(2, showGlosario7to)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="showMenuMateria()">VOLVER</button>
      </div>
    </div>
  `;
  const audioBtn = document.getElementById('audioBtn');
  if (audioBtn) {
    audioBtn.onclick = function () {
      toggleAudioGeneric(() => `${titulo}. ${texto}`, showGlosario7to);
    };
  }
}
function nextGlosario7toPage() {
  const glosarioPages = data.glosario7Pages || [];
  window.glosario7Page = Math.min((window.glosario7Page || 0) + 1, glosarioPages.length - 1);
  showGlosario7to();
}
function prevGlosario7toPage() {
  window.glosario7Page = Math.max((window.glosario7Page || 0) - 1, 0);
  showGlosario7to();
}
window.showGlosario7to = showGlosario7to;
window.nextGlosario7toPage = nextGlosario7toPage;
window.prevGlosario7toPage = prevGlosario7toPage;

// Navegación para signos de puntuación
function nextSignosPage() {
  const signosPuntuacionPages = data.signosPuntuacionPages || [];
  window.signosPage = Math.min((window.signosPage || 0) + 1, signosPuntuacionPages.length - 1);
  showSignosPuntuacionIntro();
}
function prevSignosPage() {
  window.signosPage = Math.max((window.signosPage || 0) - 1, 0);
  showSignosPuntuacionIntro();
}
window.showSignosPuntuacionIntro = showSignosPuntuacionIntro;
window.nextSignosPage = nextSignosPage;
window.prevSignosPage = prevSignosPage;

// Pantalla LECTURA
function renderLecture() {
  stopSpeech();
  if (!currentLecture) {
    currentLecture = currentSubject.lecturas[0];
    currentPage = 0;
  }
  let pagina = currentLecture.paginas[currentPage] || "";
  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      ${renderTopBar({ backFn: "showMenuMateria()", audioFn: true })}
      <div class="lecture-text" id="lectureText" style="font-size: ${fontSize}px;">
        <h2 style="text-align:center;">${currentLecture.titulo}</h2>
        <p>${pagina}</p>
      </div>
      <div class="lecture-nav">
        <button class="nav-btn" onclick="prevPage()" ${currentPage === 0 ? 'disabled' : ''}>⟵</button>
        <span>${currentPage + 1} / ${currentLecture.paginas.length}</span>
        <button class="nav-btn" onclick="nextPage()" ${currentPage === currentLecture.paginas.length - 1 ? 'disabled' : ''}>⟶</button>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, renderLecture)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, renderLecture)">
        <button onclick="changeFontSize(2, renderLecture)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="showMenuMateria()">VOLVER</button>
      </div>
    </div>
  `;
  const audioBtn = document.getElementById('audioBtn');
  if (audioBtn) {
    audioBtn.onclick = function () {
      toggleAudioGeneric(() => `${currentLecture.titulo}. ${pagina}`, renderLecture);
    };
  }
}

// Pantalla JUEGOS (placeholder)
function showAhoraVamosAJugar() {
  stopSpeech();
  window.juegoPage = 0; // Reinicia el índice del juego al entrar
  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      ${renderTopBar({ backFn: "showMenuMateria()", audioFn: null })}
      <div class="lecture-text" id="lectureText">
        <img src="lectura.png" alt="Juegos" class="juego-img">
        <h2 class="juego-titulo">¡Ahora vamos a jugar!</h2>
        <p class="juego-descripcion">Aquí irán los juegos para este grado. ¡Prepárate para divertirte y aprender!</p>
      </div>
      <div class="lecture-nav juego-nav">
        <button class="main-btn" onclick="showMenuMateria()">VOLVER</button>
        <button class="main-btn" onclick="mostrarPantallaTransicion(showGame)">JUGAR</button>
      </div>
    </div>
  `;
}

// Pantalla GAME (placeholder)
function showGame() {
  stopSpeech();
  const gradoId = currentGrade?.id || "1";
  const juegos = (data.juegos && data.juegos[gradoId]) || [];
  if (typeof window.juegoPage === "undefined") window.juegoPage = 0;
  let page = window.juegoPage;
  let totalPages = juegos.length;
  let { palabra = "", plantilla = "", pista = "" } = juegos[page] || {};

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      ${renderTopBar({ backFn: "showAhoraVamosAJugar()", audioFn: null })}
      <div class="lecture-text" id="lectureText">
        <h2 class="juego-titulo">Completa la palabra</h2>
        <div class="juego-palabra-row">
          ${plantilla.split('').map((c, i) =>
    c === '_'
      ? `<input type="text" maxlength="1" class="juego-input" id="juegoInput${i}" autocomplete="off">`
      : `<span class="juego-letra">${c}</span>`
  ).join('')}
        </div>
        <p class="juego-pista">Pista: ${pista}</p>
      </div>
      <div class="lecture-nav juego-nav">
        <button class="main-btn" onclick="showAhoraVamosAJugar()">VOLVER</button>
        <button class="main-btn" onclick="validarJuegoPalabra()">REVISAR</button>
      </div>
    </div>
  `;

  // Autofocus en el primer input vacío
  setTimeout(() => {
    const firstInput = document.querySelector('.juego-input');
    if (firstInput) firstInput.focus();
  }, 100);
}

function validarJuegoPalabra() {
  const gradoId = currentGrade?.id || "1";
  const juegos = (data.juegos && data.juegos[gradoId]) || [];
  let page = window.juegoPage || 0;
  let { palabra = "", plantilla = "" } = juegos[page] || {};
  let respuesta = "";
  let inputIndex = 0;
  for (let i = 0; i < plantilla.length; i++) {
    if (plantilla[i] === '_') {
      const val = (document.getElementById(`juegoInput${i}`)?.value || "").toUpperCase();
      respuesta += val;
      inputIndex++;
    } else {
      respuesta += plantilla[i].toUpperCase();
    }
  }
  if (respuesta === palabra.toUpperCase()) {
    // Correcto, pasa al siguiente ejercicio o felicita si es el último
    window.juegoPage = page + 1;
    if (window.juegoPage >= juegos.length) {
      showCongrats();
    } else {
      mostrarPantallaTransicion(showGame);
    }
  } else {
    // Incorrecto, borra los inputs
    for (let i = 0; i < plantilla.length; i++) {
      if (plantilla[i] === '_') {
        const input = document.getElementById(`juegoInput${i}`);
        if (input) input.value = "";
      }
    }
    // Opcional: feedback visual
    setTimeout(() => {
      const firstInput = document.querySelector('.juego-input');
      if (firstInput) firstInput.focus();
    }, 100);
  }
}
window.showGame = showGame;
window.validarJuegoPalabra = validarJuegoPalabra;

// Pantalla FELICITACIONES (placeholder)
function showCongrats() {
  stopSpeech();
  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      ${renderTopBar({ backFn: "mostrarPantallaTransicion(showMenuMateria)", audioFn: true })}
      <div class="felicitaciones-img-container">
        <img src="lectura.png" alt="Felicitaciones" class="felicitaciones-img">
      </div>
      <h2 class="felicitaciones-titulo" style="text-align:center;">¡Bien hecho!</h2>
      <p class="felicitaciones-texto" id="felicitacionesTexto" style="text-align:center; font-size: ${fontSize}px;">
        ¡Lo lograste! Has practicado y aprendido nuevas palabras sobre importancia de la lengua escrita.<br>
        Sigue leyendo, escuchando y jugando... ¡cada día sabes un poco más!
      </p>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showCongrats)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showCongrats)">
        <button onclick="changeFontSize(2, showCongrats)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="mostrarPantallaTransicion(showMenuMateria)">VOLVER AL MENÚ</button>
      </div>
    </div>
  `;
  const audioBtn = document.getElementById('audioBtn');
  if (audioBtn) {
    audioBtn.onclick = function () {
      toggleAudioGeneric(
        () => "¡Bien hecho! ¡Lo lograste! Has practicado y aprendido nuevas palabras sobre importancia de la lengua escrita. Sigue leyendo, escuchando y jugando... ¡cada día sabes un poco más!",
        showCongrats
      );
    };
  }


}

// Exponer funciones globalmente para los onclicks en HTML generado
window.showHome = showHome;
window.showGrades = showGrades;
window.showSubjects = showSubjects;
window.selectSubjectAndContinue = selectSubjectAndContinue;
window.showIntro2 = showIntro2;
window.nextIntro2Page = nextIntro2Page;
window.prevIntro2Page = prevIntro2Page;
window.goToGradesFromIntro2 = goToGradesFromIntro2;
window.showSignosPuntuacionIntro = showSignosPuntuacionIntro;
window.showGlosario5to = showGlosario5to;
window.showGlosario6to = showGlosario6to;
window.showGlosario7to = showGlosario7to;
window.showMenuMateria = showMenuMateria;
window.renderLecture = renderLecture;
window.nextPage = nextPage;
window.prevPage = prevPage;
window.changeFontSize = changeFontSize;
window.setFontSize = setFontSize;
window.showAhoraVamosAJugar = showAhoraVamosAJugar;
window.showGame = showGame;
window.showCongrats = showCongrats;
window.toggleSidebar = toggleSidebar;
window.goToHomeFromSidebar = goToHomeFromSidebar;
window.goToIndicacionesFromSidebar = goToIndicacionesFromSidebar;
window.goToGradosFromSidebar = goToGradesFromIntro2;
