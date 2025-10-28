// EFECTO SCARY FUNCIONAL
console.log('� Cargando efecto scary...');

let scaryActive = false;

function activateScaryEffect() {
    if (scaryActive) return;
    
    console.log('� ¡ACTIVANDO EFECTO SCARY!');
    scaryActive = true;
    
    // Activar clase CSS
    document.body.classList.add('scary-active');
    
    // Crear imagen si no existe
    let img = document.getElementById('laMonjaSilueta2');
    if (!img) {
        img = document.createElement('img');
        img.id = 'laMonjaSilueta2';
        img.src = 'laMonjaSilueta2.png';
        img.alt = 'La Monja';
        
        const overlay = document.querySelector('.scary-character-overlay');
        if (overlay) {
            overlay.appendChild(img);
            console.log('✅ Imagen creada y añadida');
        }
    }
}

function updateAnimation(progress) {
    if (!scaryActive) return;
    
    const img = document.getElementById('laMonjaSilueta2');
    if (img) {
        img.style.opacity = progress;
        img.style.transform = `translate(-50%, -50%) scale(${1 + progress})`;
    }
}

function handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Activar con CUALQUIER scroll (cuando scrollTop > 100px)
    if (scrollTop > 100) {
        if (!scaryActive) {
            console.log('🎯 ¡PRIMER SCROLL DETECTADO! Activando efecto...');
            activateScaryEffect();
        }
        
        // Animar basado en scroll desde 100px hasta 500px
        const maxScroll = 500;
        const progress = Math.min(1, (scrollTop - 100) / (maxScroll - 100));
        updateAnimation(progress);
        
        console.log('👻 Scroll:', scrollTop + 'px', '| Progress:', progress.toFixed(2));
    }
}

window.addEventListener('load', function() {
    console.log('✅ Efecto scary listo');
    window.addEventListener('scroll', handleScroll, { passive: true });
});