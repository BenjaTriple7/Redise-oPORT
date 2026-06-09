function initPage() {
    /* ── Header al scroll ── */
    const header = document.getElementById('caseHeader');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ── Scroll reveal ── */

    console.log('Antes del reveal');

    setTimeout(() => {

        console.log('Dentro del reveal');

        const reveals = document.querySelectorAll('.reveal, .reveal-img');

        console.log('Reveals encontrados:', reveals.length);

        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
            });
        }, { threshold: 0.1 });

        reveals.forEach(el => revealObs.observe(el));
    }, 100);

    /* ── Progress nav ── */
    const caseNav = document.getElementById('caseNav');
    const heroObs = new IntersectionObserver(([e]) => {
        caseNav.classList.toggle('visible', !e.isIntersecting);
    }, { threshold: 0 });
    heroObs.observe(document.querySelector('.case-hero'));

    /* ── Step activo ── */
    const navSteps = document.querySelectorAll('.cpn-step');
    const sections = [
        document.getElementById('problema'),
        document.getElementById('analisis'),
        document.getElementById('proceso'),
        document.getElementById('solucion'),
        document.getElementById('resultado')
    ];
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - window.innerHeight * 0.4) {
                current = section.getAttribute('id');
            }
        });
        navSteps.forEach(step => step.classList.remove('active'));
        const activeStep = document.querySelector(`.cpn-step[data-section="${current}"]`);
        if (activeStep) activeStep.classList.add('active');
    });

    /* ── Compare slider ── */
    const container = document.getElementById('compareContainer');
    const beforeEl = document.getElementById('compareBefore');
    const handleEl = document.getElementById('compareHandle');

    console.log('Container:', container);

    if (container) {

        console.log('Slider iniciado');

        let dragging = false;

        const setPos = (x) => {

            console.log('Moviendo slider');

            const r = container.getBoundingClientRect();
            let pct = ((x - r.left) / r.width) * 100;
            pct = Math.max(5, Math.min(95, pct));

            beforeEl.style.width = pct + '%';
            handleEl.style.left = pct + '%';
        };

        container.addEventListener('mousedown', (e) => {
            console.log('mousedown');
            dragging = true;
            setPos(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            console.log('mouseup');
            dragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (dragging) {
                console.log('mousemove');
                setPos(e.clientX);
            }
        });
    }
    if (container) {
        let dragging = false;
        const setPos = (x) => {
            const r = container.getBoundingClientRect();
            let pct = ((x - r.left) / r.width) * 100;
            pct = Math.max(5, Math.min(95, pct));
            beforeEl.style.width = pct + '%';
            handleEl.style.left = pct + '%';
        };
        container.addEventListener('mousedown', (e) => { dragging = true; setPos(e.clientX); });
        window.addEventListener('mouseup', () => dragging = false);
        window.addEventListener('mousemove', (e) => { if (dragging) setPos(e.clientX); });
        container.addEventListener('touchstart', (e) => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
        window.addEventListener('touchend', () => dragging = false);
        window.addEventListener('touchmove', (e) => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    }
}

/* ── 2. CURSOR PERSONALIZADO ─────────────────────────── */
const cursor = document.createElement('div');
const cursorDot = document.createElement('div');

cursor.id = 'cursor-ring';
cursorDot.id = 'cursor-dot';

document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

// Estilos inline para no depender del CSS
Object.assign(cursor.style, {
    position: 'fixed',
    width: '36px',
    height: '36px',
    border: '1px solid rgba(200,169,126,0.5)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '10000',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.3s ease',
    opacity: '0',
});

Object.assign(cursorDot.style, {
    position: 'fixed',
    width: '5px',
    height: '5px',
    background: '#c8a97e',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '10001',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s ease',
    opacity: '0',
});

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let raf;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
});

// Ring sigue con lag suave
function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursor.style.left = ringX + 'px';
    cursor.style.top = ringY + 'px';
    raf = requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover sobre links y botones → ring crece
const hoverEls = document.querySelectorAll('a, button, .case, .skills-list li');
hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
        Object.assign(cursor.style, {
            width: '56px',
            height: '56px',
            borderColor: 'rgba(200,169,126,0.9)',
            background: 'rgba(200,169,126,0.06)',
        });
    });
    el.addEventListener('mouseleave', () => {
        Object.assign(cursor.style, {
            width: '36px',
            height: '36px',
            borderColor: 'rgba(200,169,126,0.5)',
            background: 'transparent',
        });
    });
});
