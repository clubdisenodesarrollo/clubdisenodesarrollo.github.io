document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling para anclas internas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Menú hamburguesa
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('open');
        navOverlay.classList.toggle('active');
    });

    // Modal de autenticación tipo slider
    const authModal = document.getElementById('auth-modal');
    const authModalContent = document.querySelector('.auth-modal-content');
    const authModalOverlay = document.querySelector('.auth-modal-overlay');
    const authModalClose = document.querySelector('.auth-modal-close');
    const loginBtns = document.querySelectorAll('.btn-login');
    const registerBtns = document.querySelectorAll('.btn-register');
    const modalSwitchBtns = document.querySelectorAll('.auth-modal-switch');

    // Abrir modal desde botones
    loginBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (authModal) {
                authModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                if (authModalContent) authModalContent.classList.remove('register-active');
            }
        });
    });
    registerBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (authModal) {
                authModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                if (authModalContent) authModalContent.classList.add('register-active');
            }
        });
    });

    // Cambiar entre login y registro dentro del modal
    modalSwitchBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (authModalContent) authModalContent.classList.toggle('register-active');
        });
    });

    // Cerrar modal
    if (authModalClose) {
        authModalClose.addEventListener('click', function () {
            if (authModal) authModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (authModalContent) authModalContent.classList.remove('register-active');
        });
    }
    if (authModalOverlay) {
        authModalOverlay.addEventListener('click', function () {
            if (authModal) authModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (authModalContent) authModalContent.classList.remove('register-active');
        });
    }

    // Carrusel para publicaciones tipo Facebook
    document.querySelectorAll('.fb-post-carousel').forEach(carousel => {
        const images = carousel.querySelectorAll('.fb-carousel-img');
        const prevBtn = carousel.querySelector('.fb-carousel-btn.prev');
        const nextBtn = carousel.querySelector('.fb-carousel-btn.next');
        let current = 0;

        function showImage(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.disabled = index === images.length - 1;
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                if (current > 0) {
                    current--;
                    showImage(current);
                }
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                if (current < images.length - 1) {
                    current++;
                    showImage(current);
                }
            });
        }
        showImage(current);
    });

    // Carrusel hero (solo si existe en la página)
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        const bgImgs = heroBg.querySelectorAll('.hero-bg-img');
        const progressBar = document.getElementById('hero-progress-bar');
        const heroImages = [
            { desktop: 'img1.jpg', mobile: 'img1.jpg', alt: 'Paisaje andino con río' },
            { desktop: 'img2.jpg', mobile: 'img2.jpg', alt: 'Comunidades trabajando en el agua' },
            { desktop: 'img3.jpg', mobile: 'img3.jpg', alt: 'Montañas y laguna al amanecer' },
            { desktop: 'img4.jpg', mobile: 'img4.jpg', alt: 'Escenario hídrico adicional' }
        ];
        const SLIDE_DURATION = 8000, FADE_DURATION = 1500, FALLBACK_TIMEOUT = 3000;
        let current = 0, timer = null, progressTimer = null;
        let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function getImageSrc(img) {
            return window.innerWidth <= 700 ? img.mobile : img.desktop;
        }
        function loadImage(src, onLoad, onError) {
            const img = new window.Image();
            let loaded = false;
            const timeout = setTimeout(() => { if (!loaded) onError && onError(); }, FALLBACK_TIMEOUT);
            img.onload = () => { loaded = true; clearTimeout(timeout); onLoad && onLoad(img.src); };
            img.onerror = () => { loaded = true; clearTimeout(timeout); onError && onError(); };
            img.src = src;
        }
        function preloadImage(idx) {
            const img = heroImages[idx % heroImages.length];
            const src = getImageSrc(img);
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        }
        function showSlide(idx) {
            const imgData = heroImages[idx];
            const src = getImageSrc(imgData);
            const active = bgImgs[0];
            const nextImg = bgImgs[1];
            loadImage(
                src,
                (url) => {
                    nextImg.style.backgroundImage = `url('${url}')`;
                    nextImg.classList.add('active');
                    setTimeout(() => {
                        active.classList.remove('active');
                        active.style.backgroundImage = '';
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
        function animateProgressBar(duration) {
            if (!progressBar) return;
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
        function startCarousel() {
            if (prefersReducedMotion) {
                showSlide(0);
                if (progressBar) progressBar.style.width = '100%';
                return;
            }
            showSlide(current);
            animateProgressBar(SLIDE_DURATION);
            timer = setTimeout(nextSlide, SLIDE_DURATION);
            preloadImage((current + 1) % heroImages.length);
        }
        function nextSlide() {
            current = (current + 1) % heroImages.length;
            showSlide(current);
            animateProgressBar(SLIDE_DURATION);
            timer = setTimeout(nextSlide, SLIDE_DURATION);
            preloadImage((current + 1) % heroImages.length);
        }
        function handleParallax() {
            if (prefersReducedMotion) return;
            const scrollY = window.scrollY;
            const parallax = Math.min(scrollY * 0.18, 60);
            bgImgs.forEach(img => {
                img.classList.add('parallax');
                img.style.setProperty('--parallax', `${parallax}px`);
            });
        }
        let lastWidth = window.innerWidth;
        function handleResize() {
            if (window.innerWidth !== lastWidth) {
                lastWidth = window.innerWidth;
                showSlide(current);
                preloadImage((current + 1) % heroImages.length);
            }
        }
        showSlide(0);
        startCarousel();
        window.addEventListener('scroll', handleParallax, { passive: true });
        window.addEventListener('resize', handleResize);
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
            prefersReducedMotion = e.matches;
            if (timer) clearTimeout(timer);
            if (progressTimer) cancelAnimationFrame(progressTimer);
            if (prefersReducedMotion) {
                current = 0;
                showSlide(0);
                if (progressBar) progressBar.style.width = '100%';
            } else {
                startCarousel();
            }
        });
    }
});