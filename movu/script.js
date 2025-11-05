/* =====================
   MOVU PROJECT SCRIPTS - SPA NAVIGATION
====================== */

// Estado global de la aplicación
const AppState = {
    currentSection: 'inicio',
    isLoading: false,
    cache: new Map()
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

// Inicializar aplicación
function inicializarApp() {
    inicializarNavegacion();
    inicializarBottomNavigation();
    inicializarSPANavigation();
    inicializarAnimaciones();
    
    // Cargar sección inicial
    const initialSection = obtenerSeccionDeURL() || 'inicio';
    cargarSeccion(initialSection);
}

// Funcionalidad de navegación móvil
function inicializarNavegacion() {
    const btnHamburguesa = document.getElementById('btn-hamburguesa');
    const sidebar = document.getElementById('sidebar-nav');
    const closeSidebar = document.getElementById('close-sidebar');

    if (btnHamburguesa && sidebar && closeSidebar) {
        // Abrir sidebar
        btnHamburguesa.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebar.classList.add('open');
            btnHamburguesa.classList.add('hide');
        });

        // Cerrar sidebar
        closeSidebar.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebar.classList.remove('open');
            btnHamburguesa.classList.remove('hide');
        });

        // Cerrar sidebar al hacer clic fuera
        document.addEventListener('click', function (e) {
            if (sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) &&
                e.target !== btnHamburguesa) {
                sidebar.classList.remove('open');
                btnHamburguesa.classList.remove('hide');
            }
        });

        // Evitar que el clic dentro del sidebar lo cierre
        sidebar.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }
}

// Funcionalidad SPA (Single Page Application)
function inicializarSPANavigation() {
    // Interceptar todos los enlaces de navegación
    document.addEventListener('click', function(e) {
        const link = e.target.closest('[data-section]');
        if (link) {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            navegarASeccion(section);
        }
    });
    
    // Manejar navegación del navegador (back/forward)
    window.addEventListener('popstate', function(e) {
        const section = e.state ? e.state.section : obtenerSeccionDeURL();
        if (section && section !== AppState.currentSection) {
            cargarSeccion(section, false); // false = no agregar al historial
        }
    });
}

// Navegar a una sección específica
function navegarASeccion(section) {
    if (section === AppState.currentSection || AppState.isLoading) {
        return;
    }
    
    // Actualizar URL y historial
    const url = `#${section}`;
    window.history.pushState({ section }, '', url);
    
    // Cargar sección
    cargarSeccion(section, false);
}

// Obtener sección actual de la URL
function obtenerSeccionDeURL() {
    const hash = window.location.hash.substring(1);
    return hash || 'inicio';
}

// Cargar una sección específica
async function cargarSeccion(section, addToHistory = true) {
    if (AppState.isLoading) return;
    
    AppState.isLoading = true;
    mostrarEstadoCarga();
    
    try {
        // Actualizar navegación activa
        actualizarNavegacionActiva(section);
        
        // Cargar datos de la sección
        const data = await cargarDatosSeccion(section);
        
        // Renderizar contenido
        renderizarSeccion(section, data);
        
        // Actualizar estado
        AppState.currentSection = section;
        
        if (addToHistory) {
            const url = `#${section}`;
            window.history.pushState({ section }, '', url);
        }
        
    } catch (error) {
        console.error(`Error cargando sección ${section}:`, error);
        mostrarError(`No se pudo cargar la sección ${section}`);
    } finally {
        AppState.isLoading = false;
        ocultarEstadoCarga();
    }
}

// Cargar datos de una sección desde JSON
async function cargarDatosSeccion(section) {
    console.log(`Intentando cargar ${section}.json`);
    
    // Verificar cache
    if (AppState.cache.has(section)) {
        console.log(`${section} encontrado en cache`);
        return AppState.cache.get(section);
    }
    
    try {
        const response = await fetch(`${section}.json`);
        console.log(`Response para ${section}.json:`, response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Datos cargados para ${section}:`, data);
        
        // Guardar en cache
        AppState.cache.set(section, data);
        
        return data;
    } catch (error) {
        console.error(`Error cargando ${section}.json:`, error);
        throw error;
    }
}

// Renderizar una sección específica
function renderizarSeccion(section, data) {
    console.log(`Renderizando sección ${section} con data:`, data);
    
    // Actualizar Hero Section y ocultar section header para evitar duplicación
    const sectionHeader = document.getElementById('section-header');
    
    if (section === 'inicio' && data.seccion_principal) {
        console.log('Actualizando con sección principal:', data.seccion_principal);
        // Hero Section
        document.getElementById('hero-title').textContent = data.seccion_principal.titulo;
        document.getElementById('hero-description').textContent = data.seccion_principal.descripcion;
    } else {
        console.log('Actualizando con datos generales');
        // Hero Section
        document.getElementById('hero-title').textContent = data.titulo;
        document.getElementById('hero-description').textContent = data.descripcion;
    }
    
    // Ocultar section header en todas las secciones para evitar duplicación
    sectionHeader.style.display = 'none';

    
    // Limpiar contenido anterior
    const contenedor = document.getElementById('contenido-dinamico');
    contenedor.innerHTML = '';
    
    // Si no es inicio, ocultar equipo primero
    if (section !== 'inicio') {
        ocultarEquipoTrabajo();
    }
    
    // Renderizar según la sección
    switch (section) {
        case 'inicio':
            renderizarInicio(data);
            break;
        case 'alianzas':
            renderizarAlianzas(data);
            break;
        case 'emprende':
            renderizarEmprende(data);
            break;
        case 'bepoli':
            renderizarBepoli(data);
            break;
        default:
            mostrarError('Sección no encontrada');
    }
    
    // Aplicar animaciones
    setTimeout(() => {
        aplicarAnimacionesEscalonadas();
    }, 100);
}

// Renderizar sección de inicio
function renderizarInicio(data) {
    console.log('Renderizando inicio con data:', data);
    const contenedor = document.getElementById('contenido-dinamico');
    
    // SECCIÓN 2: Plan de Trabajo
    if (data.plan_trabajo) {
        console.log('Renderizando plan de trabajo:', data.plan_trabajo);
        const planSection = document.createElement('div');
        planSection.className = 'plan-trabajo-section';
        planSection.innerHTML = `
            <h3 class="plan-trabajo-titulo">${data.plan_trabajo.titulo}</h3>
        `;
        
        // Crear grid de propuestas
        const grid = document.createElement('div');
        grid.className = 'movu-grid';
        
        data.plan_trabajo.propuestas.forEach((propuesta, index) => {
            const card = crearTarjetaPropuesta(propuesta, index);
            grid.appendChild(card);
        });
        
        planSection.appendChild(grid);
        contenedor.appendChild(planSection);
    }
    
    // SECCIÓN 3: Equipo de trabajo
    if (data.equipo) {
        mostrarEquipoTrabajo(data.equipo);
    }
}

// Renderizar sección de alianzas
function renderizarAlianzas(data) {
    const contenedor = document.getElementById('contenido-dinamico');
    
    const grid = document.createElement('div');
    grid.className = 'movu-grid';
    
    data.listas_aliadas.forEach((lista, index) => {
        const card = crearTarjetaListaAliada(lista, index);
        grid.appendChild(card);
    });
    
    contenedor.appendChild(grid);
}

// Renderizar sección de emprendimiento
function renderizarEmprende(data) {
    const contenedor = document.getElementById('contenido-dinamico');
    
    const grid = document.createElement('div');
    grid.className = 'movu-grid';
    
    data.negocios.forEach((negocio, index) => {
        const card = crearTarjetaNegocio(negocio, index);
        grid.appendChild(card);
    });
    
    contenedor.appendChild(grid);
}

// Renderizar sección de Bepoli
function renderizarBepoli(data) {
    const contenedor = document.getElementById('contenido-dinamico');
    
    // Crear grid de servicios
    const grid = document.createElement('div');
    grid.className = 'movu-grid';
    
    data.servicios.forEach((servicio, index) => {
        const card = crearTarjetaServicio(servicio, index);
        grid.appendChild(card);
    });
    
    contenedor.appendChild(grid);
}

// Funcionalidad del bottom navigation
function inicializarBottomNavigation() {
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    // Agregar event listeners a cada item del bottom nav
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remover clase active de todos los items
            bottomNavItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Si es un enlace interno (#), prevenir el comportamiento por defecto
            // y hacer scroll suave a la sección
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Función para detectar la sección actual y activar el nav correspondiente
    function actualizarNavegacionActiva() {
        const sections = ['#alianzas', '#emprende', '#bepoli'];
        let currentSection = 'inicio';
        
        // Verificar si estamos en la página de inicio
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/movu/' || window.location.pathname === '/movu') {
            sections.forEach(sectionId => {
                const element = document.querySelector(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        currentSection = sectionId.substring(1); // Remover el #
                    }
                }
            });
        }
        
        // Activar el nav item correspondiente
        bottomNavItems.forEach(item => {
            const href = item.getAttribute('href');
            item.classList.remove('active');
            
            if ((currentSection === 'inicio' && href === 'index.html') ||
                (href === `#${currentSection}`)) {
                item.classList.add('active');
            }
        });
    }
    
    // Escuchar scroll para actualizar navegación activa
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                actualizarNavegacionActiva();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Actualizar navegación inicial
    actualizarNavegacionActiva();
}

// =====================
// FUNCIONES DE CREACIÓN DE TARJETAS
// =====================

// Crear tarjeta de propuesta (inicio)
function crearTarjetaPropuesta(propuesta, index) {
    const card = document.createElement('div');
    card.className = 'movu-card';
    card.style.animationDelay = `${index * 0.2}s`;
    
    card.innerHTML = `
        <div class="card-icon">${propuesta.icono}</div>
        <h3>${propuesta.titulo}</h3>
        <p>${propuesta.descripcion}</p>
    `;
    
    return card;
}

// Crear tarjeta de alianza
function crearTarjetaAlianza(alianza, index) {
    const card = document.createElement('div');
    card.className = 'movu-card alianza-card';
    card.style.animationDelay = `${index * 0.2}s`;
    
    const beneficiosList = alianza.beneficios.map(beneficio => 
        `<li>${beneficio}</li>`
    ).join('');
    
    const estadoClass = alianza.estado.toLowerCase().replace(' ', '-');
    
    card.innerHTML = `
        <div class="card-icon">${alianza.icono}</div>
        <h3>${alianza.titulo}</h3>
        <p>${alianza.descripcion}</p>
        <div class="beneficios">
            <h4>Beneficios:</h4>
            <ul>${beneficiosList}</ul>
        </div>
        <div class="estado-badge ${estadoClass}">${alianza.estado}</div>
    `;
    
    return card;
}

// Crear tarjeta de programa (emprendimiento)
function crearTarjetaPrograma(programa, index) {
    const card = document.createElement('div');
    card.className = 'movu-card programa-card';
    card.style.animationDelay = `${index * 0.2}s`;
    
    const recursosList = programa.recursos.map(recurso => 
        `<li>${recurso}</li>`
    ).join('');
    
    card.innerHTML = `
        <div class="card-icon">${programa.icono}</div>
        <h3>${programa.titulo}</h3>
        <p>${programa.descripcion}</p>
        <div class="recursos">
            <h4>Incluye:</h4>
            <ul>${recursosList}</ul>
        </div>
        <div class="duracion">
            <span class="duracion-label">Duración:</span>
            <span class="duracion-valor">${programa.duracion}</span>
        </div>
    `;
    
    return card;
}

// Crear tarjeta de servicio (Bepoli)
function crearTarjetaServicio(servicio, index) {
    const card = document.createElement('div');
    card.className = 'movu-card servicio-card';
    card.style.animationDelay = `${index * 0.2}s`;
    
    const detallesList = servicio.detalles.map(detalle => 
        `<li>${detalle}</li>`
    ).join('');
    
    card.innerHTML = `
        <div class="card-icon">${servicio.icono}</div>
        <h3>${servicio.titulo}</h3>
        <p>${servicio.descripcion}</p>
        <div class="detalles">
            <h4>Detalles:</h4>
            <ul>${detallesList}</ul>
        </div>
        <div class="horario">
            <span class="horario-label">📅 Horario:</span>
            <span class="horario-valor">${servicio.horario}</span>
        </div>
    `;
    
    return card;
}

// Crear componente de estadísticas
function crearEstadisticas(estadisticas) {
    const container = document.createElement('div');
    container.className = 'estadisticas-container';
    
    const stats = Object.entries(estadisticas).map(([key, value]) => {
        const label = formatearLabelEstadistica(key);
        return `
            <div class="estadistica-item">
                <div class="estadistica-valor">${value}</div>
                <div class="estadistica-label">${label}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="estadisticas-grid">
            ${stats}
        </div>
    `;
    
    return container;
}

// Formatear labels de estadísticas
function formatearLabelEstadistica(key) {
    const labels = {
        'emprendimientos_activos': 'Emprendimientos Activos',
        'estudiantes_participantes': 'Estudiantes Participantes',
        'empresas_graduadas': 'Empresas Graduadas',
        'inversion_total': 'Inversión Total ($)',
        'estudiantes_beneficiados': 'Estudiantes Beneficiados',
        'becas_alimentacion': 'Becas de Alimentación',
        'consultas_psicologicas': 'Consultas Psicológicas',
        'satisfaccion': 'Satisfacción'
    };
    
    return labels[key] || key.replace('_', ' ').toUpperCase();
}

// Mostrar equipo de trabajo
function mostrarEquipoTrabajo(equipoData) {
    const container = document.getElementById('equipo-container');
    const grid = document.getElementById('equipo-grid');
    
    // Actualizar título del equipo
    const tituloEquipo = document.querySelector('.equipo-title');
    if (tituloEquipo && equipoData.titulo) {
        tituloEquipo.textContent = equipoData.titulo;
    }
    
    // Limpiar contenido anterior
    grid.innerHTML = '';
    
    // Crear tarjetas del equipo
    if (equipoData.integrantes) {
        equipoData.integrantes.forEach((miembro, index) => {
            const card = crearTarjetaEquipo(miembro, index);
            grid.appendChild(card);
        });
    }
    
    // Mostrar contenedor
    container.style.display = 'block';
}

// Ocultar equipo de trabajo
function ocultarEquipoTrabajo() {
    const container = document.getElementById('equipo-container');
    container.style.display = 'none';
}

// Crear tarjeta de miembro del equipo
function crearTarjetaEquipo(miembro, index) {
    const card = document.createElement('div');
    card.className = 'equipo-card';
    card.style.animationDelay = `${(index + 2) * 0.2}s`; // Delay after other cards
    
    // Determinar si mostrar imagen o iniciales
    const imagenContent = miembro.imagen && miembro.imagen !== 'img/equipo/presidente.jpg' && miembro.imagen !== 'img/equipo/vicepresidente.jpg'
        ? `<img src="${miembro.imagen}" alt="${miembro.nombre}" onerror="this.style.display='none'; this.parentElement.innerHTML='${obtenerIniciales(miembro.nombre)}'">`
        : obtenerIniciales(miembro.nombre);
    
    card.innerHTML = `
        <div class="equipo-imagen">
            ${imagenContent}
        </div>
        <div class="equipo-nombre">${miembro.nombre}</div>
        <div class="equipo-cargo">${miembro.rol}</div>
        <div class="equipo-carrera">${miembro.carrera}</div>
    `;
    
    return card;
}

// Crear tarjeta de lista aliada
function crearTarjetaListaAliada(lista, index) {
    const card = document.createElement('div');
    card.className = 'equipo-card'; // Reutilizamos los estilos del equipo
    card.style.animationDelay = `${index * 0.2}s`;
    
    // Determinar si mostrar imagen o iniciales
    const imagenContent = lista.imagen && lista.imagen !== 'img/listas/voz-estudiantil.jpg' && lista.imagen !== 'img/listas/impulso-academico.jpg'
        ? `<img src="${lista.imagen}" alt="${lista.nombre_lista}" onerror="this.style.display='none'; this.parentElement.innerHTML='${obtenerIniciales(lista.nombre_lista)}'">`
        : obtenerIniciales(lista.nombre_lista);
    
    // Crear las redes sociales
    let redesSocialesHTML = '';
    if (lista.redes_sociales && lista.redes_sociales.length > 0) {
        redesSocialesHTML = '<div class="lista-redes-sociales">';
        lista.redes_sociales.forEach(red => {
            redesSocialesHTML += `
                <a href="${red.url}" target="_blank" class="red-social-btn" aria-label="${red.tipo}">
                    <img src="${red.icono}" alt="${red.tipo}" class="red-social-icono">
                </a>
            `;
        });
        redesSocialesHTML += '</div>';
    }
    
    card.innerHTML = `
        <div class="equipo-imagen">
            ${imagenContent}
        </div>
        <div class="equipo-nombre">${lista.nombre_lista}</div>
        <div class="equipo-carrera">${lista.carrera}</div>
        ${redesSocialesHTML}
    `;
    
    return card;
}

// Crear tarjeta de negocio estudiantil
function crearTarjetaNegocio(negocio, index) {
    const card = document.createElement('div');
    card.className = 'negocio-card';
    card.style.animationDelay = `${index * 0.2}s`;
    
    // Determinar si mostrar logo o iniciales
    const logoContent = negocio.logo 
        ? `<img src="${negocio.logo}" alt="${negocio.nombre}" onerror="this.style.display='none'; this.parentElement.innerHTML='${obtenerIniciales(negocio.nombre)}'">`
        : obtenerIniciales(negocio.nombre);
    
    // Crear carrusel de imágenes
    let carruselHTML = '';
    if (negocio.imagenes && negocio.imagenes.length > 0) {
        carruselHTML = `
            <div class="carrusel-container">
                <div class="carrusel-imagenes" data-negocio="${negocio.id}">
                    ${negocio.imagenes.map((imagen, imgIndex) => 
                        `<img src="${imagen}" alt="${negocio.nombre} imagen ${imgIndex + 1}" class="carrusel-imagen ${imgIndex === 0 ? 'active' : ''}">`
                    ).join('')}
                </div>
                <div class="carrusel-indicadores">
                    ${negocio.imagenes.map((_, imgIndex) => 
                        `<span class="indicador ${imgIndex === 0 ? 'active' : ''}" data-slide="${imgIndex}"></span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    // Crear red social
    let redSocialHTML = '';
    if (negocio.red_social) {
        redSocialHTML = `
            <div class="negocio-red-social">
                <a href="${negocio.red_social.url}" target="_blank" class="red-social-btn" aria-label="${negocio.red_social.tipo}">
                    <img src="${negocio.red_social.icono}" alt="${negocio.red_social.tipo}" class="red-social-icono">
                </a>
            </div>
        `;
    }
    
    card.innerHTML = `
        <div class="negocio-logo">
            ${logoContent}
        </div>
        <div class="negocio-nombre">${negocio.nombre}</div>
        <div class="negocio-descripcion">${negocio.descripcion}</div>
        ${carruselHTML}
        ${redSocialHTML}
    `;
    
    return card;
}

// Obtener iniciales de un nombre
function obtenerIniciales(nombre) {
    return nombre.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');
}

// =====================
// FUNCIONES DE ESTADO Y UTILIDADES
// =====================

// Actualizar navegación activa
function actualizarNavegacionActiva(section) {
    // Actualizar menú principal
    document.querySelectorAll('.menu-principal a, .sidebar-nav a, .bottom-nav-item, .footer-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === section) {
            link.classList.add('active');
        }
    });
}



// Mostrar estado de carga
function mostrarEstadoCarga() {
    const contenedor = document.getElementById('contenido-dinamico');
    contenedor.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Cargando contenido...</p>
        </div>
    `;
}

// Ocultar estado de carga
function ocultarEstadoCarga() {
    // El contenido se reemplaza automáticamente al renderizar
}

// Mostrar error
function mostrarError(mensaje) {
    const contenedor = document.getElementById('contenido-dinamico');
    contenedor.innerHTML = `
        <div class="error-message movu-card">
            <h3>⚠️ Error</h3>
            <p>${mensaje}</p>
            <button onclick="location.reload()" class="btn-retry">
                Recargar página
            </button>
        </div>
    `;
}



// Función para inicializar animaciones
function inicializarAnimaciones() {
    // Observer para animaciones al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar elementos que necesitan animación
    document.querySelectorAll('.movu-card').forEach(card => {
        observer.observe(card);
    });
}

// Función para aplicar animaciones escalonadas
function aplicarAnimacionesEscalonadas() {
    const cards = document.querySelectorAll('.movu-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 200);
    });
    
    // Inicializar carruseles después de las animaciones
    setTimeout(() => {
        inicializarCarruseles();
    }, 500);
}

// Inicializar todos los carruseles
function inicializarCarruseles() {
    const carruseles = document.querySelectorAll('.carrusel-imagenes');
    
    carruseles.forEach(carrusel => {
        const negocioId = carrusel.getAttribute('data-negocio');
        const imagenes = carrusel.querySelectorAll('.carrusel-imagen');
        
        if (imagenes.length > 1) {
            let indiceActual = 0;
            
            // Cambiar imagen cada 3 segundos
            const intervalo = setInterval(() => {
                // Ocultar imagen actual
                imagenes[indiceActual].classList.remove('active');
                const indicadores = carrusel.parentElement.querySelectorAll('.indicador');
                indicadores[indiceActual].classList.remove('active');
                
                // Mostrar siguiente imagen
                indiceActual = (indiceActual + 1) % imagenes.length;
                imagenes[indiceActual].classList.add('active');
                indicadores[indiceActual].classList.add('active');
            }, 3000);
            
            // Guardar referencia para poder pausar después
            carrusel.dataset.interval = intervalo;
        }
    });
}

// Función utilitaria para crear elementos
function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
}

// Función para manejar errores de carga
function manejarError(mensaje) {
    console.error('Error en Movu:', mensaje);
    
    const container = document.getElementById('contenido-dinamico');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p>⚠️ ${mensaje}</p>
                <p>Verifica que el archivo data.json esté configurado correctamente.</p>
            </div>
        `;
    }
}

// Funciones de utilidad para interacciones
function mostrarDetalles(id) {
    console.log('Mostrar detalles para:', id);
    // Implementar lógica específica según necesidades del proyecto
}

function navegarA(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

// Export para uso en otros scripts si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cargarContenidoDinamico,
        renderizarContenido,
        inicializarAnimaciones
    };
}