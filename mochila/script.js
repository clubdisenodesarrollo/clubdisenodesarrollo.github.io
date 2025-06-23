// This file contains JavaScript code that will dynamically generate and manipulate HTML content within the index.html file.

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

// Cargar datos JSON
async function loadData() {
  const res = await fetch('data.json');
  data = await res.json();
  showHome();
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
      <button class="main-btn" onclick="showIntro2()">EMPEZAR</button>
    </div>
  `;
}

// Pantalla GRADOS
function showGrades() {
  stopSpeech();
  let gradesHtml = data.grados.map(g => `
    <div class="grade-row" onclick="showSubjects('${g.id}')">
      <div class="grade-img"><img src="grado.png" alt="${g.nombre}"></div>
      <div class="grade-text">${g.nombre}</div>
    </div>
  `).join('');
  document.getElementById('app').innerHTML = `
    <div class="container grades-container">
      <button class="back-btn" onclick="showHome()">←</button>
      <div class="grades-list">${gradesHtml}</div>
    </div>
  `;
}

// Pantalla MATERIAS
function showSubjects(gradeId) {
  stopSpeech();
  currentGrade = data.grados.find(g => g.id === gradeId);
  let subjects = currentGrade.materias;
  let subjectsHtml = subjects.map(m => `
    <div class="subject-row" onclick="showSignosPuntuacionIntro()">
      <div class="subject-img"><img src="materia.png" alt="${m.nombre}"></div>
      <div class="subject-text">${m.nombre}</div>
    </div>
  `).join('');
  document.getElementById('app').innerHTML = `
    <div class="container subjects-container">
      <button class="back-btn" onclick="showGrades()">←</button>
      <div class="subjects-list">${subjectsHtml}</div>
    </div>
  `;
}

// Pantalla LECTURAS
function showLectures(subjectId) {
  stopSpeech();
  currentSubject = currentGrade.materias.find(m => m.id === subjectId);
  let lectures = currentSubject.lecturas;
  let lecture = lectures[0]; // Solo una por ahora
  currentLecture = lecture;
  currentPage = 0;
  renderLecture();
}

// Renderizar pantalla de LECTURA
function renderLecture() {
  let lecture = currentLecture;
  let totalPages = lecture.paginas.length;
  let pageText = lecture.paginas[currentPage];
  let audioIcon = isSpeaking ? '⏸️' : '▶️';
  if (isPaused) audioIcon = '▶️';

  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      <button class="back-btn" onclick="showSubjects('${currentGrade.id}')">←</button>
      <div class="lecture-audio" id="audioBtn" tabindex="0">
        <span id="audioIcon">${audioIcon} AUDIO</span>
      </div>
      <div class="lecture-content">
        <div class="lecture-title">${lecture.titulo}</div>
        <div class="lecture-text" id="lectureText"
          style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
          ${pageText}
        </div>
        <div class="lecture-nav">
          <button class="nav-btn" onclick="prevPage()" ${currentPage === 0 ? 'disabled' : ''}>⟵</button>
          <span>${currentPage + 1} / ${totalPages}</span>
          <button class="nav-btn" onclick="nextPage()" ${currentPage === totalPages - 1 ? 'disabled' : ''}>⟶</button>
        </div>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value)">
        <button onclick="changeFontSize(2)">+</button>
      </div>
    </div>
  `;
  document.getElementById('audioBtn').onclick = function() {
    toggleAudioGeneric(() => document.getElementById('lectureText')?.innerText, renderLecture);
  };
}

// Función de audio genérica para TODAS las pantallas
function toggleAudioGeneric(getTextFn, refreshFn) {
  const text = getTextFn();
  // Si el texto cambió, para y crea utterance nuevo
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
  // Si está hablando, pausa
  if (isSpeaking && !isPaused) {
    window.speechSynthesis.pause();
    isSpeaking = false;
    isPaused = true;
    updateAudioIcon();
    return;
  }
  // Si está pausado, reanuda
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

// Navegación de páginas
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

// Pantalla INTRODUCCIÓN 2
function showIntro2() {
  stopSpeech();
  const introPages = data.intro2 || [
    "No hay texto disponible. Agrega los textos en data.json."
  ];
  if (typeof window.intro2Page === "undefined") window.intro2Page = 0;
  let page = window.intro2Page;
  let totalPages = introPages.length;
  let audioIcon = isSpeaking ? '⏸️' : '▶️';
  if (isPaused) audioIcon = '▶️';

  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      <button class="back-btn" onclick="showHome()">←</button>
      <div class="lecture-audio" id="audioBtn" tabindex="0">
        <span id="audioIcon">${audioIcon} AUDIO</span>
      </div>
      <div class="lecture-content">
        <div class="lecture-title">¿Cómo funciona?</div>
        <div class="lecture-text" id="lectureText"
          style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
          ${introPages[page]}
        </div>
        <div class="lecture-nav">
          <button class="nav-btn" onclick="prevIntro2Page()" ${page === 0 ? 'disabled' : ''}>⟵</button>
          <span>${page + 1} / ${totalPages}</span>
          <button class="nav-btn" onclick="nextIntro2Page()" ${page === totalPages - 1 ? 'disabled' : ''}>⟶</button>
        </div>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showIntro2)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showIntro2)">
        <button onclick="changeFontSize(2, showIntro2)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="goToGradesFromIntro2()">SIGUIENTE</button>
      </div>
    </div>
  `;
  document.getElementById('audioBtn').onclick = function() {
    toggleAudioGeneric(() => document.getElementById('lectureText')?.innerText, showIntro2);
  };
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
function changeFontSizeIntro2(delta) {
  stopSpeech();
  fontSize = Math.max(14, Math.min(40, fontSize + delta));
  showIntro2();
}
function setFontSizeIntro2(val) {
  stopSpeech();
  fontSize = parseInt(val, 10);
  showIntro2();
}

// Pantalla después de las materias: CONOCE LOS SIGNOS DE PUNTUACIÓN
function showSignosPuntuacionIntro() {
  stopSpeech();
  let audioIcon = isSpeaking ? '⏸️' : '▶️';
  if (isPaused) audioIcon = '▶️';
  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      <button class="back-btn" onclick="showSubjects('${currentGrade.id}')">←</button>
      <div class="lecture-audio" id="audioBtn" tabindex="0">
        <span id="audioIcon">${audioIcon} AUDIO</span>
      </div>
      <div class="lecture-content">
        <div class="lecture-title">CONOCE LOS SIGNOS DE PUNTUACIÓN</div>
        <div class="lecture-text" id="lectureText"
          style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
          Aquí puedes poner una breve descripción sobre los signos de puntuación.
        </div>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSizeSignos(-2, showSignosPuntuacionIntro)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSizeSignos(this.value, showSignosPuntuacionIntro)">
        <button onclick="changeFontSizeSignos(2, showSignosPuntuacionIntro)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="showPantalla6()">SIGUIENTE</button>
      </div>
    </div>
  `;
  document.getElementById('audioBtn').onclick = function() {
    toggleAudioGeneric(() => document.getElementById('lectureText')?.innerText, showSignosPuntuacionIntro);
  };
}
function changeFontSizeSignos(delta) {
  stopSpeech();
  fontSize = Math.max(14, Math.min(40, fontSize + delta));
  showSignosPuntuacionIntro();
}
function setFontSizeSignos(val) {
  stopSpeech();
  fontSize = parseInt(val, 10);
  showSignosPuntuacionIntro();
}

// Pantalla GLOSARIO
function showPantalla6() {
  stopSpeech();
  const glosarioPages = data.pantalla6 || ["Texto de la pantalla 6 aquí."];
  if (typeof window.pantalla6Page === "undefined") window.pantalla6Page = 0;
  let page = window.pantalla6Page;
  let totalPages = glosarioPages.length;
  let audioIcon = isSpeaking ? '⏸️' : '▶️';
  if (isPaused) audioIcon = '▶️';
  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      <button class="back-btn" onclick="showSignosPuntuacionIntro()">←</button>
      <div class="lecture-audio" id="audioBtn" tabindex="0">
        <span id="audioIcon">${audioIcon} AUDIO</span>
      </div>
      <div class="lecture-content">
        <div class="lecture-title">GLOSARIO</div>
        <div class="lecture-text" id="lectureText"
          style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
          ${glosarioPages[page]}
        </div>
        <div class="lecture-nav">
          <button class="nav-btn" onclick="prevPantalla6Page()" ${page === 0 ? 'disabled' : ''}>⟵</button>
          <span>${page + 1} / ${totalPages}</span>
          <button class="nav-btn" onclick="nextPantalla6Page()" ${page === totalPages - 1 ? 'disabled' : ''}>⟶</button>
        </div>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showPantalla6)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showPantalla6)">
        <button onclick="changeFontSize(2, showPantalla6)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="showPantalla7()">SIGUIENTE</button>
      </div>
    </div>
  `;
  document.getElementById('audioBtn').onclick = function() {
    toggleAudioGeneric(() => document.getElementById('lectureText')?.innerText, showPantalla6);
  };
}
function nextPantalla6Page() {
  stopSpeech();
  window.pantalla6Page = Math.min(window.pantalla6Page + 1, (data.pantalla6?.length || 1) - 1);
  showPantalla6();
}
function prevPantalla6Page() {
  stopSpeech();
  window.pantalla6Page = Math.max(window.pantalla6Page - 1, 0);
  showPantalla6();
}

// Pantalla LA COMUNICACIÓN
function showPantalla7() {
  stopSpeech();
  // Selecciona el grado, materia y lectura correctos por ID
  currentGrade = data.grados.find(g => g.id === "1");
  currentSubject = currentGrade.materias.find(m => m.id === "mat1");
  currentLecture = currentSubject.lecturas.find(l => l.id === "lec1");
  // Mantén currentPage para navegación entre páginas
  let lecture = currentLecture;
  let totalPages = lecture.paginas.length;
  let pageText = lecture.paginas[currentPage];
  let audioIcon = isSpeaking ? '⏸️' : '▶️';
  if (isPaused) audioIcon = '▶️';

  // Calcula estilos dinámicos
  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      <button class="back-btn" onclick="showPantalla6()">←</button>
      <div class="lecture-audio" id="audioBtn" tabindex="0">
        <span id="audioIcon">${audioIcon} AUDIO</span>
      </div>
      <div class="lecture-content">
        <div class="lecture-title">${lecture.titulo}</div>
        <div class="lecture-text" id="lectureText"
          style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
          ${pageText}
        </div>
        <div class="lecture-nav">
          <button class="nav-btn" onclick="prevPagePantalla7()" ${currentPage === 0 ? 'disabled' : ''}>⟵</button>
          <span>${currentPage + 1} / ${totalPages}</span>
          <button class="nav-btn" onclick="nextPagePantalla7()" ${currentPage === totalPages - 1 ? 'disabled' : ''}>⟶</button>
        </div>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showPantalla7)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showPantalla7)">
        <button onclick="changeFontSize(2, showPantalla7)">+</button>
      </div>
      <div class="lecture-nav">
        <button class="main-btn" onclick="showAhoraVamosAJugar()">SIGUIENTE</button>
      </div>
    </div>
  `;
  document.getElementById('audioBtn').onclick = function() {
    toggleAudioGeneric(() => document.getElementById('lectureText')?.innerText, showPantalla7);
  };
}

// Navegación de páginas para pantalla 7
function nextPagePantalla7() {
  stopSpeech();
  if (currentPage < currentLecture.paginas.length - 1) {
    currentPage++;
    showPantalla7();
  }
}
function prevPagePantalla7() {
  stopSpeech();
  if (currentPage > 0) {
    currentPage--;
    showPantalla7();
  }
}

// Elimina las funciones duplicadas de cambio de fuente para pantalla 7
delete window.changeFontSizePantalla7;
delete window.setFontSizePantalla7;

// Haz globales las nuevas funciones de navegación
window.nextPagePantalla7 = nextPagePantalla7;
window.prevPagePantalla7 = prevPagePantalla7;

// Pantalla AHORA VAMOS A JUGAR
function showAhoraVamosAJugar() {
  stopSpeech();
  let audioIcon = isSpeaking ? '⏸️' : '▶️';
  if (isPaused) audioIcon = '▶️';
  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      <button class="back-btn" onclick="showPantalla7()">←</button>
      <div class="lecture-audio" id="audioBtn" tabindex="0">
        <span id="audioIcon">${audioIcon} AUDIO</span>
      </div>
      <div class="lecture-content">
        <div class="lecture-title">AHORA VAMOS A JUGAR</div>
        <div class="lecture-text" id="lectureText"
          style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em; margin-bottom: 32px;">
          Prepárate para poner a prueba lo aprendido con un juego interactivo.
        </div>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSizeAhoraJugar(-2)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSizeAhoraJugar(this.value)">
        <button onclick="changeFontSizeAhoraJugar(2)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="showGame()">SIGUIENTE</button>
      </div>
    </div>
  `;
  document.getElementById('audioBtn').onclick = function() {
    toggleAudioGeneric(() => document.getElementById('lectureText')?.innerText, showAhoraVamosAJugar);
  };
}
function changeFontSizeAhoraJugar(delta) {
  stopSpeech();
  fontSize = Math.max(14, Math.min(40, fontSize + delta));
  showAhoraVamosAJugar();
}
function setFontSizeAhoraJugar(val) {
  stopSpeech();
  fontSize = parseInt(val, 10);
  showAhoraVamosAJugar();
}

// Pantalla de JUEGO
function showGame() {
  stopSpeech();
  const gradoId = currentGrade?.id || "1";
  const juegos = data.juegos?.[gradoId] || [];
  if (!juegos.length) {
    showCongrats();
    return;
  }

  // Inicializa los inputs globales para cada juego
  if (!window.juegoInputs || window.juegoInputs.length !== juegos.length) {
    window.juegoInputs = juegos.map(j => Array((j.plantilla.match(/_/g) || []).length).fill(""));
  }

  let juegosHtml = juegos.map((juego, idx) => {
    let plantilla = juego.plantilla;
    let palabra = juego.palabra;
    let inputIndex = 0;
    let html = "";
    for (let i = 0; i < plantilla.length; i++) {
      if (plantilla[i] === "_") {
        const val = window.juegoInputs[idx][inputIndex] || "";
        html += `<input type="text" maxlength="1" class="juego-input" data-juego="${idx}" data-index="${inputIndex}" value="${val}" style="width:32px;text-align:center;" oninput="onJuegoInputMulti(this, ${idx}, ${inputIndex})">`;
        inputIndex++;
      } else {
        html += `<span>${plantilla[i]}</span>`;
      }
    }
    return `
      <div class="juego-row">
        <div class="juego-palabra">${html}</div>
        <div class="juego-pista">Pista: ${juego.pista}</div>
      </div>
    `;
  }).join('');

  // Validar si todo es correcto antes de mostrar el botón
  const allCorrect = validarJuegosMulti(juegos, false);

  document.getElementById('app').innerHTML = `
    <div class="container game-container">
      <button class="back-btn" onclick="showAhoraVamosAJugar()">←</button>
      <div class="lecture-content">
        <div class="lecture-title">Juegos de 5° grado</div>
        <div class="lecture-text" style="margin-bottom:16px;">
          ${juegosHtml}
        </div>
        <div class="lecture-nav" id="juegoNav"></div>
      </div>
    </div>
  `;

  // Solo agrega el botón si todo es correcto
  if (allCorrect) {
    document.getElementById('juegoNav').innerHTML = `<button class="main-btn" onclick="showCongrats()">SIGUIENTE</button>`;
  }
}

function onJuegoInputMulti(input, juegoIdx, idx) {
  window.juegoInputs[juegoIdx][idx] = input.value.toUpperCase();
  const gradoId = currentGrade?.id || "1";
  const juegos = data.juegos?.[gradoId] || [];
  showGame(); // Solo vuelve a renderizar, NO llama a showCongrats aquí
}

// Cambia la función para que pueda validar sin modificar el DOM
function validarJuegosMulti(juegos, updateBtn = true) {
  let allCorrect = true;
  for (let j = 0; j < juegos.length; j++) {
    const palabra = juegos[j].palabra.toUpperCase();
    const plantilla = juegos[j].plantilla;
    let inputPos = 0;
    let esCorrecto = true;
    for (let i = 0; i < plantilla.length; i++) {
      if (plantilla[i] === "_") {
        // Busca la posición real de la letra en la palabra
        // El mapeo es secuencial: cada "_" corresponde a la siguiente letra faltante
        if ((window.juegoInputs[j][inputPos] || "") !== palabra[plantilla.slice(0, i).replace(/[^_]/g, "").length + inputPos]) {
          esCorrecto = false;
          break;
        }
        inputPos++;
      }
    }
    // Además, todos los inputs deben estar llenos
    if (!esCorrecto || window.juegoInputs[j].some(v => !v || v.length !== 1)) {
      allCorrect = false;
      break;
    }
  }
  // Si se llama desde showGame, no actualiza el botón aquí
  if (updateBtn && document.getElementById('juegoNav')) {
    document.getElementById('juegoNav').innerHTML = allCorrect
      ? `<button class="main-btn" onclick="showCongrats()">SIGUIENTE</button>`
      : '';
  }
  return allCorrect;
}

window.onJuegoInputMulti = onJuegoInputMulti;
window.showGame = showGame;

// Inicializar
window.onload = loadData;

// Hacer funciones globales para los onclicks en HTML
window.showHome = showHome;
window.showGrades = showGrades;
window.showSubjects = showSubjects;
window.showLectures = showLectures;
window.nextPage = nextPage;
window.prevPage = prevPage;
window.changeFontSize = changeFontSize;
window.setFontSize = setFontSize;
window.showIntro2 = showIntro2;
window.nextIntro2Page = nextIntro2Page;
window.prevIntro2Page = prevIntro2Page;
window.goToGradesFromIntro2 = goToGradesFromIntro2;
window.changeFontSizeIntro2 = changeFontSizeIntro2;
window.setFontSizeIntro2 = setFontSizeIntro2;
window.showSignosPuntuacionIntro = showSignosPuntuacionIntro;
window.changeFontSizeSignos = changeFontSizeSignos;
window.setFontSizeSignos = setFontSizeSignos;
window.showPantalla6 = showPantalla6;
window.changeFontSizePantalla6 = changeFontSizePantalla6;
window.setFontSizePantalla6 = setFontSizePantalla6;
window.showPantalla7 = showPantalla7;
window.showAhoraVamosAJugar = showAhoraVamosAJugar;
window.changeFontSizeAhoraJugar = changeFontSizeAhoraJugar;
window.setFontSizeAhoraJugar = setFontSizeAhoraJugar;
window.showGame = showGame;
window.showCongrats = showCongrats;
window.nextPantalla6Page = nextPantalla6Page;
window.prevPantalla6Page = prevPantalla6Page;
