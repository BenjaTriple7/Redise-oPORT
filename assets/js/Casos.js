/* ── Header al scroll ── */
const header = document.getElementById('caseHeader');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Scroll reveal ── */
const reveals = document.querySelectorAll('.reveal, .reveal-img');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
}, { threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

/* ── Progress nav: aparece al salir del hero ── */
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

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop - window.innerHeight * 0.4
        ) {
            current = section.getAttribute('id');
        }

    });

    navSteps.forEach(step =>
        step.classList.remove('active')
    );

    const activeStep = document.querySelector(
        `.cpn-step[data-section="${current}"]`
    );

    if (activeStep) {
        activeStep.classList.add('active');
    }

});

/* ── Compare slider ── */
const container = document.getElementById('compareContainer');
const beforeEl = document.getElementById('compareBefore');
const handleEl = document.getElementById('compareHandle');

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


// ════════════════════════════════════════════════════════
// Timeline del caso de estudio: rellena el rail vertical
// según el scroll y activa el nodo de la etapa visible.
// Agregar este bloque a assets/js/Casos.js (o cargarlo aparte).
// ════════════════════════════════════════════════════════

(function () {
    const timeline = document.getElementById('caseTimeline');
    const fill = document.getElementById('timelineFill');
    if (!timeline || !fill) return;

    const stages = Array.from(timeline.querySelectorAll('.timeline-stage'));

    function updateRail() {
        const rect = timeline.getBoundingClientRect();
        const total = timeline.offsetHeight;
        const viewportCenter = window.innerHeight * 0.5;

        // Progreso del rail: cuánto del timeline ya pasó el centro del viewport.
        const scrolled = Math.min(Math.max(viewportCenter - rect.top, 0), total);
        const percent = total > 0 ? (scrolled / total) * 100 : 0;
        fill.style.height = percent + '%';

        // Etapa activa: la última cuyo marcador ya cruzó el centro del viewport.
        let activeStage = null;
        for (const stage of stages) {
            const sRect = stage.getBoundingClientRect();
            if (sRect.top <= viewportCenter) {
                activeStage = stage;
            }
        }

        stages.forEach((s) => s.classList.toggle('is-active', s === activeStage));
    }

    window.addEventListener('scroll', updateRail, { passive: true });
    window.addEventListener('resize', updateRail);
    updateRail();
})();
