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
        <button onclick="changeFontSize(-2, renderLecture)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, renderLecture)">
        <button onclick="changeFontSize(2, renderLecture)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="showAhoraVamosAJugar()">SIGUIENTE</button>
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
  if (typeof renderFn === "function" ) renderFn();
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
        <div class="lecture-title">¡Hola! Antes de comenzar, te explicamos cómo usar esta aplicación:</div>
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

  // Datos de los signos
  const signos = [
    { img: "signo1.png", texto: "¡Hola! Soy la coma (,) y sirvo para ayudarte a respirar cuando lees. Me usan para hacer pausas pequeñas entre palabras o ideas." },
    { img: "signo2.png", texto: "¡Hola! Yo soy el punto (.) y me gusta terminar las oraciones. Cuando ves un punto, significa que la idea ha terminado." },
    { img: "signo3.png", texto: "¡Hola! Yo soy el signo de exclamación (!) y traigo emoción. Me usan cuando alguien grita, se alegra o se sorprende." },
    { img: "signo4.png", texto: "¡Hola! Soy el signo de interrogación (?), y hago preguntas. Cuando alguien quiere saber algo, ahí estoy yo." }
  ];

  // Para el audio, concatenamos todos los textos
  const textoLectura = signos.map(s => s.texto).join(' ');

  let filasHtml = signos.map(s => `
    <div class="signo-row">
      <div class="signo-img"><img src="${s.img}" alt="" /></div>
      <div class="signo-text">${s.texto}</div>
    </div>
  `).join('');

  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      <button class="back-btn" onclick="showSubjects('${currentGrade.id}')">←</button>
      <div class="lecture-audio" id="audioBtn" tabindex="0">
        <span id="audioIcon">${audioIcon} AUDIO</span>
      </div>
      <div class="lecture-content">
        <div class="lecture-title">¡Conozcamos los signos de puntuación!</div>
        <div class="lecture-text" id="lectureText"
          style="font-size: ${fontSize}px; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}em;">
          ${filasHtml}
        </div>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showSignosPuntuacionIntro)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showSignosPuntuacionIntro)">
        <button onclick="changeFontSize(2, showSignosPuntuacionIntro)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="showPantalla6()">SIGUIENTE</button>
      </div>
    </div>
  `;
  document.getElementById('audioBtn').onclick = function() {
    toggleAudioGeneric(() => textoLectura, showSignosPuntuacionIntro);
  };
}

// Pantalla GLOSARIO
function showPantalla6() {
  stopSpeech();
  const gradoId = currentGrade?.id || "1";
  const glosario = (data.glosario && data.glosario[gradoId]) ? data.glosario[gradoId] : [];
  let audioIcon = isSpeaking ? '⏸️' : '▶️';
  if (isPaused) audioIcon = '▶️';
  let baseLineHeight = 1.3;
  let baseLetterSpacing = 0.02;
  let steps = Math.floor((fontSize - 14) / 3);
  let lineHeight = baseLineHeight + steps * 0.1;
  let letterSpacing = baseLetterSpacing + steps * 0.01;

  let filasHtml = glosario.map(item => `
    <div class="glosario-row">
      <span class="glosario-palabra"><b>${item.palabra}:</b></span>
      <span class="glosario-definicion">${item.definicion}</span>
    </div>
  `).join('');

  // Para el audio, concatena todas las definiciones
  const textoLectura = glosario.map(item => `${item.palabra}: ${item.definicion}`).join('. ');

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
          ${filasHtml}
        </div>
      </div>
      <div class="font-size-bar">
        <button onclick="changeFontSize(-2, showPantalla6)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showPantalla6)">
        <button onclick="changeFontSize(2, showPantalla6)">+</button>
      </div>
      <div class="lecture-nav" style="margin-top:12px;">
        <button class="main-btn" onclick="goToLectureFromGlosario()">SIGUIENTE</button>
      </div>
    </div>
  `;
  document.getElementById('audioBtn').onclick = function() {
    toggleAudioGeneric(() => textoLectura, showPantalla6);
  };
}

// Ir a la lectura correcta desde el glosario
function goToLectureFromGlosario() {
  // Si ya hay una lectura seleccionada, solo muéstrala
  if (currentGrade && currentGrade.materias && currentGrade.materias.length > 0) {
    currentSubject = currentGrade.materias[0];
    if (currentSubject.lecturas && currentSubject.lecturas.length > 0) {
      currentLecture = currentSubject.lecturas[0];
      currentPage = 0;
      renderLecture();
      return;
    }
  }
  // Si no hay nada, muestra un mensaje de error o vuelve al home
  showHome();
}

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
      <button class="back-btn" onclick="renderLecture()">←</button>
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
        <button onclick="changeFontSize(-2, showAhoraVamosAJugar)">-</button>
        <input type="range" min="14" max="40" value="${fontSize}" oninput="setFontSize(this.value, showAhoraVamosAJugar)">
        <button onclick="changeFontSize(2, showAhoraVamosAJugar)">+</button>
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
        <div class="lecture-title">Juegos de ${currentGrade?.nombre || ''}</div>
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

// Pantalla de FELICITACIONES
function showCongrats() {
  stopSpeech();
  document.getElementById('app').innerHTML = `
    <div class="container lecture-container">
      <div class="lecture-content" style="align-items:center;justify-content:center;">
        <div class="lecture-title">¡Felicidades!</div>
        <div class="lecture-text" style="margin-bottom:32px;">
          Has completado el juego y la lectura.<br><br>
          ¡Sigue aprendiendo!
        </div>
        <button class="main-btn" onclick="showHome()">VOLVER AL INICIO</button>
      </div>
    </div>
  `;
}

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
window.showSignosPuntuacionIntro = showSignosPuntuacionIntro;
window.showPantalla6 = showPantalla6;
window.showPantalla7 = renderLecture;
window.showAhoraVamosAJugar = showAhoraVamosAJugar;
window.showGame = showGame;
window.showCongrats = showCongrats;
window.goToLectureFromGlosario = goToLectureFromGlosario;
