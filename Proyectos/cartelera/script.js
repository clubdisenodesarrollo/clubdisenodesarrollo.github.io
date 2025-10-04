// ==========================================
// CINECLUB - CARTELERA DE PELÍCULAS  
// JavaScript optimizado y moderno - FIXED
// =========================    // Regist    // Registrar ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Efecto de aparición progresiva con scroll
    gsap.timeline({
      scrollTrigger: {
        trigger: ".featured-movie",
        start: "top 70%",
        end: "bottom 30%", 
        scrub: 1.5,
        toggleActions: "play none none reverse"
      }
    })
    .fromTo(scaryImage,
    gsap.registerPlugin(ScrollTrigger);
    
    // Efecto de aparición progresiva con scroll
    gsap.timeline({
      scrollTrigger: {
        trigger: ".featured-movie",
        start: "top 70%",
        end: "bottom 30%", 
        scrub: 1.5,
        toggleActions: "play none none reverse"
      }
    })
    .fromTo(scaryImage,

class CinemaCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.carousel-slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.totalSlides = this.slides.length;
    this.isAnimating = false;
    this.autoplayInterval = null;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.startAutoplay();
    this.setupIntersectionObserver();
    this.initGSAPAnimations();
    this.initScaryScrollEffect();
    this.initParallaxEffects();
  }
  
  setupEventListeners() {
    // Event listeners para navegación del carrusel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.changeSlide(-1);
      if (e.key === 'ArrowRight') this.changeSlide(1);
    });
    
    // Touch events para mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
    
    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.changeSlide(1); // Swipe left - next slide
        } else {
          this.changeSlide(-1); // Swipe right - prev slide
        }
      }
    };
    
    this.handleSwipe = handleSwipe;
    
    // Pause autoplay on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => this.pauseAutoplay());
      carouselContainer.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }
  
  changeSlide(direction) {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.pauseAutoplay();
    
    this.currentSlide += direction;
    
    if (this.currentSlide >= this.totalSlides) {
      this.currentSlide = 0;
    } else if (this.currentSlide < 0) {
      this.currentSlide = this.totalSlides - 1;
    }
    
    this.updateSlides();
    this.updateIndicators();
    
    setTimeout(() => {
      this.isAnimating = false;
      this.startAutoplay();
    }, 500);
  }
  
  goToSlide(slideIndex) {
    if (this.isAnimating || slideIndex === this.currentSlide) return;
    
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
    this.pauseAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.changeSlide(1);
    }, 5000); // 5 segundos
  }
  
  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
  
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Observar tarjetas de películas
    document.querySelectorAll('.movie-card').forEach(card => {
      observer.observe(card);
    });
  }
  
  initGSAPAnimations() {
    // Efecto de aparición de la silueta con scroll
    const scaryImage = document.getElementById("laMonjaSilueta2");
    
    if (!scaryImage) return;
    
    // GSAP directo sin ScrollTrigger para evitar conflictos
    gsap.registerPlugin(ScrollTrigger);
    
    // Timeline con ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".featured-movie",
        start: "top center",
        end: "bottom center", 
        scrub: 1,
        onUpdate: self => {
          console.log('� Animando... progress:', self.progress);
        }
      }
    });
    
    // Animación: opacity 0->1, scale 1->2
    tl.fromTo(img, 
      {
        opacity: 0,
        scale: 1,
        visibility: "hidden"
      },
      {
        opacity: 1,
        scale: 2,
        visibility: "visible",
        duration: 1,
        ease: "none"
      }
    );
    
    console.log('✅ Timeline creado');
    
    // Animaciones de entrada para las tarjetas
    gsap.set(".movie-card", {
      y: 60,
      opacity: 0
    });
    
    gsap.to(".movie-card", {
      scrollTrigger: {
        trigger: ".movies-grid",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
  }
  
  initScaryScrollEffect() {
    // Efecto de susto adicional con efectos especiales
    const scaryCharacter = document.getElementById("laMonjaSilueta2");
    const featuredSection = document.querySelector('.featured-movie');
    
    if (scaryCharacter && featuredSection) {
      let hasScared = false;
      let ticking = false;
      
      const updateScaryEffect = () => {
        const rect = featuredSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Solo activar efectos cuando la sección está visible
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible) {
          const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / windowHeight));
          
          // Efecto de susto cuando el personaje está casi completamente visible
          if (progress > 0.7 && !hasScared) {
            hasScared = true;
            
            // Vibración del dispositivo
            if ('vibrate' in navigator) {
              navigator.vibrate([150, 100, 150]);
            }
            
            // Efecto de parpadeo
            document.body.style.animation = 'scaryFlash 0.4s ease-out';
            setTimeout(() => {
              document.body.style.animation = '';
            }, 400);
            
            // Debug: elemento está visible
            console.log('¡Efecto de susto activado!');
          }
          
          // Reset cuando sale de vista hacia arriba (vuelve al inicio)
          if (progress < 0.3 && hasScared) {
            hasScared = false;
          }
        } else {
          // Reset cuando la sección no está visible
          if (rect.top > windowHeight) {
            hasScared = false;
          }
        }
        
        ticking = false;
      };
      
      const requestScaryUpdate = () => {
        if (!ticking) {
          requestAnimationFrame(updateScaryEffect);
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', requestScaryUpdate, { passive: true });
    }
  }
  
  initParallaxEffects() {
    const parallaxElements = [
      { element: document.getElementById("icon_pop"), speed: 0.3, direction: 'y' },
      { element: document.getElementById("icon_locura"), speed: 0.2, direction: 'x' }
    ];
    
    let ticking = false;
    
    const updateParallax = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      parallaxElements.forEach(({ element, speed, direction }) => {
        if (element) {
          const offset = scrollTop * speed;
          const transform = direction === 'y' 
            ? `translateY(${offset}px)` 
            : `translateX(${offset}px)`;
          element.style.transform = transform;
        }
      });
      
      ticking = false;
    };
    
    const requestParallaxUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    
    // Throttled scroll event
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  }
}

// Funciones globales para compatibilidad con HTML inline
function changeSlide(direction) {
  if (window.cinemaCarousel) {
    window.cinemaCarousel.changeSlide(direction);
  }
}

function goToSlide(index) {
  if (window.cinemaCarousel) {
    window.cinemaCarousel.goToSlide(index);
  }
}

// Utility functions
class ImageLoader {
  static init() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach(img => img.classList.add('loaded'));
    }
  }
}

// Performance optimization
class PerformanceOptimizer {
  static init() {
    // Preload critical images
    const criticalImages = ['fondo4.jpg', 'LaMonja.jpg'];
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
    
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
      // Disable autoplay for reduced motion users
      if (window.cinemaCarousel) {
        window.cinemaCarousel.pauseAutoplay();
      }
    }
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Test para verificar que el elemento existe
  setTimeout(() => {
    const testElement = document.getElementById('laMonjaSilueta2');
    console.log('Test element after DOM load:', testElement);
    if (testElement) {
      testElement.style.border = '3px solid lime';
      console.log('Element found and highlighted!');
    }
  }, 1000);
  
  window.cinemaCarousel = new CinemaCarousel();
  ImageLoader.init();
  PerformanceOptimizer.init();
  
  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  console.log('🎬 CineClub Cartelera inicializada correctamente');
});