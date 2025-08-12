// Simple JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Login/Register buttons functionality
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');

    loginBtn.addEventListener('click', function () {
        // In a real implementation, this would open a login modal or redirect
        alert('Funcionalidad de inicio de sesión. Redirigiendo al formulario...');
    });

    registerBtn.addEventListener('click', function () {
        // In a real implementation, this would open a registration modal or redirect
        alert('Funcionalidad de registro. Redirigiendo al formulario...');
    });
});

// HERO SECTION: Carrusel, lazy loading, parallax, fallback, responsive, reduced motion
const heroImages = [
    {
        desktop: 'img1.jpg',
        mobile: 'img1.jpg',
        alt: 'Paisaje andino con río',
    },
    {
        desktop: 'img2.jpg',
        mobile: 'img2.jpg',
        alt: 'Comunidades trabajando en el agua',
    },
    {
        desktop: 'img3.jpg',
        mobile: 'img3.jpg',
        alt: 'Montañas y laguna al amanecer',
    },
    {
        desktop: 'img4.jpg',
        mobile: 'img4.jpg',
        alt: 'Escenario hídrico adicional',
    }
];

// Configuración
const SLIDE_DURATION = 8000; // ms
const FADE_DURATION = 1500;  // ms
const FALLBACK_TIMEOUT = 3000; // ms

const heroBg = document.getElementById('hero-bg');
const bgImgs = heroBg.querySelectorAll('.hero-bg-img');
const progressBar = document.getElementById('hero-progress-bar');
let current = 0, next = 1, timer = null, progressTimer = null;
let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Utilidad: elige imagen según ancho
function getImageSrc(img) {
    return window.innerWidth <= 700 ? img.mobile : img.desktop;
}

// Lazy load con fallback y degradado elegante
function loadImage(src, onLoad, onError) {
    const img = new window.Image();
    let loaded = false;
    const timeout = setTimeout(() => {
        if (!loaded) {
            onError && onError();
        }
    }, FALLBACK_TIMEOUT);
    img.onload = () => {
        loaded = true;
        clearTimeout(timeout);
        onLoad && onLoad(img.src);
    };
    img.onerror = () => {
        loaded = true;
        clearTimeout(timeout);
        onError && onError();
    };
    img.src = src;
}

// Precarga la siguiente imagen en segundo plano
function preloadImage(idx) {
    const img = heroImages[idx % heroImages.length];
    const src = getImageSrc(img);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
}

// Cambia el slide con fade y fallback
function showSlide(idx) {
    const imgData = heroImages[idx];
    const src = getImageSrc(imgData);
    const active = bgImgs[0];
    const nextImg = bgImgs[1];

    // Carga la imagen en el elemento oculto
    loadImage(
        src,
        (url) => {
            nextImg.style.backgroundImage = `url('${url}')`;
            nextImg.classList.add('active');
            // Espera el fade antes de quitar la imagen anterior
            setTimeout(() => {
                active.classList.remove('active');
                // Limpia el fondo anterior para evitar parpadeos
                active.style.backgroundImage = '';
                // Intercambia nodos para el próximo cambio
                heroBg.appendChild(bgImgs[0]);
                heroBg.appendChild(bgImgs[1]);
                [bgImgs[0], bgImgs[1]] = [bgImgs[1], bgImgs[0]];
            }, FADE_DURATION);
        },
        () => {
            nextImg.style.backgroundImage = 'linear-gradient(135deg, #002b5b 80%, #005a99 100%)';
            nextImg.classList.add('active');
            setTimeout(() => {
                active.classList.remove('active');
                active.style.backgroundImage = '';
                heroBg.appendChild(bgImgs[0]);
                heroBg.appendChild(bgImgs[1]);
                [bgImgs[0], bgImgs[1]] = [bgImgs[1], bgImgs[0]];
            }, FADE_DURATION);
        }
    );
}

// Barra de progreso animada
function animateProgressBar(duration) {
    progressBar.style.width = '0%';
    let start = null;
    function step(ts) {
        if (!start) start = ts;
        let progress = Math.min((ts - start) / duration, 1);
        progressBar.style.width = (progress * 100) + '%';
        if (progress < 1) {
            progressTimer = requestAnimationFrame(step);
        }
    }
    progressTimer = requestAnimationFrame(step);
}

// Carrusel principal
function startCarousel() {
    if (prefersReducedMotion) {
        // Solo muestra la primera imagen
        showSlide(0);
        progressBar.style.width = '100%';
        return;
    }
    showSlide(current);
    animateProgressBar(SLIDE_DURATION);
    timer = setTimeout(nextSlide, SLIDE_DURATION);
    // Precarga la siguiente
    preloadImage((current + 1) % heroImages.length);
}

function nextSlide() {
    current = (current + 1) % heroImages.length;
    showSlide(current);
    animateProgressBar(SLIDE_DURATION);
    timer = setTimeout(nextSlide, SLIDE_DURATION);
    preloadImage((current + 1) % heroImages.length);
}

// Parallax sutil en scroll
function handleParallax() {
    if (prefersReducedMotion) return;
    const scrollY = window.scrollY;
    const parallax = Math.min(scrollY * 0.18, 60);
    bgImgs.forEach(img => {
        img.classList.add('parallax');
        img.style.setProperty('--parallax', `${parallax}px`);
    });
}

// Responsive: recarga imágenes si cambia el tamaño
let lastWidth = window.innerWidth;
function handleResize() {
    if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        showSlide(current);
        preloadImage((current + 1) % heroImages.length);
    }
}

// Inicia el hero al cargar
window.addEventListener('DOMContentLoaded', () => {
    // Inicializa el primer fondo
    showSlide(0);
    startCarousel();
    window.addEventListener('scroll', handleParallax, { passive: true });
    window.addEventListener('resize', handleResize);
});

// Accesibilidad: si cambia prefers-reduced-motion
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
    prefersReducedMotion = e.matches;
    if (timer) clearTimeout(timer);
    if (progressTimer) cancelAnimationFrame(progressTimer);
    // Reinicia el carrusel
    if (prefersReducedMotion) {
        current = 0;
        showSlide(0);
        progressBar.style.width = '100%';
    } else {
        startCarousel();
    }
});

// Modal lógica
const authModal = document.getElementById('auth-modal');
const authModalSlider = document.getElementById('auth-modal-slider');
const registerPanel = document.querySelector('.register-panel');
const registerCover = document.getElementById('register-cover');
const registerForm = document.querySelector('.register-form');
const showLoginBtn = document.getElementById('show-login');
const showLoginBottomBtn = document.getElementById('show-login-bottom');
const showRegisterBtn = document.getElementById('show-register');
const closeModalBtn = document.getElementById('auth-modal-close');

// Abrir modal desde botones
document.querySelector('.btn-login').addEventListener('click', () => {
    authModal.setAttribute('aria-hidden', 'false');
    authModalSlider.style.transform = 'translateX(0)';
    registerPanel.classList.remove('active');
});
document.querySelector('.btn-register').addEventListener('click', () => {
    authModal.setAttribute('aria-hidden', 'false');
    authModalSlider.style.transform = 'translateX(-600px)';
    setTimeout(() => registerPanel.classList.add('active'), 400);
});

// Abrir modal desde botón "Únete" del carrusel
document.querySelector('.hero-cta .btn-outline').addEventListener('click', function () {
    authModal.setAttribute('aria-hidden', 'false');
    authModalSlider.style.transform = 'translateX(0)';
    registerPanel.classList.remove('active');
});

// Cambiar entre login y registro dentro del modal
showRegisterBtn.addEventListener('click', () => {
    authModalSlider.style.transform = 'translateX(-600px)';
    setTimeout(() => registerPanel.classList.add('active'), 400);
});
showLoginBtn.addEventListener('click', () => {
    authModalSlider.style.transform = 'translateX(0)';
    setTimeout(() => registerPanel.classList.remove('active'), 400);
});
showLoginBottomBtn.addEventListener('click', () => {
    authModalSlider.style.transform = 'translateX(0)';
    setTimeout(() => registerPanel.classList.remove('active'), 400);
});

// Cerrar modal
closeModalBtn.addEventListener('click', () => {
    authModal.setAttribute('aria-hidden', 'true');
    authModalSlider.style.transform = 'translateX(0)';
    registerPanel.classList.remove('active');
});
authModal.querySelector('.auth-modal-overlay').addEventListener('click', () => {
    authModal.setAttribute('aria-hidden', 'true');
    authModalSlider.style.transform = 'translateX(0)';
    registerPanel.classList.remove('active');
});

// Menú hamburguesa dinámico
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
});

// Opcional: cerrar menú al hacer clic en un enlace (solo en móvil)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
        }
    });
});



















































// Carrusel para publicaciones tipo Facebook
document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.fb-post-carousel');
    if (!carousel) return;

    const images = carousel.querySelectorAll('.fb-carousel-img');
    const prevBtn = carousel.querySelector('.fb-carousel-btn.prev');
    const nextBtn = carousel.querySelector('.fb-carousel-btn.next');
    let current = 0;

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === images.length - 1;
    }

    prevBtn.addEventListener('click', function () {
        if (current > 0) {
            current--;
            showImage(current);
        }
    });

    nextBtn.addEventListener('click', function () {
        if (current < images.length - 1) {
            current++;
            showImage(current);
        }
    });

    showImage(current);
});
