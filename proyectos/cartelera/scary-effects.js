/**
 * CINECLUB - EFECTO SCARY SCROLL
 * Maneja la aparición gradual de personaje terrorífico al hacer scroll
 * 
 * @author CineClub Team
 * @version 1.0.0
 */

console.log('🔥 Cargando efectos especiales...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM listo para efectos');
    
    // Estado del efecto scary
    let scaryImage = null;
    let effectCreated = false;
    
    /**
     * Maneja el evento de scroll para crear y animar la imagen scary
     */
    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        console.log('📊 Scroll actual:', scrollY + 'px');
        
        // Crear imagen en el primer scroll
        if (scrollY > 5 && !effectCreated) {
            console.log('🎬 Creando efecto scary...');
            effectCreated = true;
            
            // Buscar contenedor de efectos
            const container = document.querySelector('.scary-character-overlay');
            console.log('📦 Contenedor encontrado:', !!container);
            
            if (container) {
                // Crear imagen scary
                scaryImage = document.createElement('img');
                scaryImage.src = 'laMonjaSilueta2.png';
                scaryImage.setAttribute('data-dynamic', 'true');
                scaryImage.alt = 'Personaje terrorífico - La Monja';
                
                // Eventos de carga
                scaryImage.onload = () => console.log('🖼️ Imagen cargada exitosamente');
                scaryImage.onerror = () => console.log('❌ Error al cargar imagen');
                
                // Añadir al DOM
                container.appendChild(scaryImage);
                console.log('✅ Efecto scary añadido al DOM');
            } else {
                console.error('❌ No se encontró el contenedor scary-character-overlay');
            }
        }
        
        // Animar imagen si existe
        if (effectCreated && scaryImage) {
            // Calcular progreso de animación (0 a 1)
            const maxScrollForEffect = 200;
            const progress = Math.min(1, scrollY / maxScrollForEffect);
            const scale = 1 + progress;
            
            // Aplicar estilos de animación responsiva
            Object.assign(scaryImage.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: progress.toString(),
                zIndex: '10',
                maxWidth: '80%',
                maxHeight: '80%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, ${0.6 * progress}))` // Solo sombra negra sutil
            });
            
            // Log de debug (solo cuando hay cambios significativos)
            if (scrollY % 20 < 5) {
                console.log(`👻 Animación: opacity=${progress.toFixed(2)}, scale=${scale.toFixed(2)}`);
            }
        }
    }
    
    // Configurar listener de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    console.log('👂 Event listener configurado');
    
    // Ejecutar una vez para estado inicial
    handleScroll();
    
    console.log('🎭 Sistema de efectos scary inicializado');
});

/**
 * FUNCIONALIDAD DEL CARRUSEL
 * Maneja la navegación automática y manual del carrusel principal
 */
class CinemaCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.autoplayInterval = null;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🎠 Inicializando carrusel...');
        this.startAutoplay();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Pausar autoplay al pasar el mouse
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.pauseAutoplay());
            carouselContainer.addEventListener('mouseleave', () => this.startAutoplay());
        }
    }
    
    goToSlide(slideIndex) {
        if (this.isAnimating || slideIndex === this.currentSlide) return;
        
        console.log(`🎯 Cambiando al slide ${slideIndex}`);
        this.isAnimating = true;
        this.pauseAutoplay();
        this.currentSlide = slideIndex;
        this.updateSlides();
        this.updateIndicators();
        
        setTimeout(() => {
            this.isAnimating = false;
            this.startAutoplay();
        }, 500);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoplay() {
        this.pauseAutoplay(); // Limpiar interval anterior
        this.autoplayInterval = setInterval(() => {
            if (!this.isAnimating) {
                this.nextSlide();
            }
        }, 4000); // Cambiar cada 4 segundos
        
        console.log('▶️ Autoplay del carrusel iniciado');
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Función global para compatibilidad con los botones HTML
function goToSlide(index) {
    if (window.cinemaCarousel) {
        window.cinemaCarousel.goToSlide(index);
    }
}

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.cinemaCarousel = new CinemaCarousel();
    console.log('🎬 Carrusel inicializado y disponible globalmente');
});