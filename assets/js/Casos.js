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
/* ══════════════════════════════════════════════════════
   HILO CONDUCTOR — thread-line.js
   Crea una línea vertical fija que conecta todas las
   secciones del caso de estudio, con nodos que se activan
   a medida que el usuario hace scroll.
   ══════════════════════════════════════════════════════ */

(function () {

    // Secciones a conectar, en orden. Deben coincidir con los <section id="...">
    const SECTIONS = [
        { id: 'problema', label: 'Problema' },
        { id: 'analisis', label: 'Análisis' },
        { id: 'proceso', label: 'Proceso' },
        { id: 'solucion', label: 'Solución' },
        { id: 'resultado', label: 'Resultado' }
    ];

    let lineEl, fillEl, trackHeight = 0;
    const nodes = [];

    function buildThreadLine() {
        // Contenedor principal
        lineEl = document.createElement('div');
        lineEl.className = 'thread-line';
        lineEl.id = 'threadLine';

        const track = document.createElement('div');
        track.className = 'thread-line-track';

        fillEl = document.createElement('div');
        fillEl.className = 'thread-line-fill';

        lineEl.appendChild(track);
        lineEl.appendChild(fillEl);

        // Nodos por sección existente en el DOM
        SECTIONS.forEach(section => {
            const target = document.getElementById(section.id);
            if (!target) return;

            const node = document.createElement('div');
            node.className = 'thread-node';

            const label = document.createElement('span');
            label.className = 'thread-node-label';
            label.textContent = section.label;

            lineEl.appendChild(node);
            lineEl.appendChild(label);

            nodes.push({ id: section.id, target, node, label });
        });

        document.body.appendChild(lineEl);
    }

    function positionNodes() {
        const lineRect = lineEl.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;

        trackHeight = lineEl.offsetHeight;

        nodes.forEach(item => {
            const rect = item.target.getBoundingClientRect();
            // Posición del centro vertical de la sección, relativa al documento
            const sectionCenter = rect.top + scrollY + rect.height / 2;
            // Posición relativa al inicio de la línea (que es fixed, ocupa 100svh desde top:0)
            const ratio = sectionCenter / document.documentElement.scrollHeight;
            const top = ratio * trackHeight;

            item.node.style.top = top + 'px';
            item.label.style.top = top + 'px';
        });
    }

    function updateProgress() {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollY = window.scrollY || window.pageYOffset;
        const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

        fillEl.style.height = (progress * 100) + '%';

        // Mostrar la línea solo una vez que el usuario empieza a recorrer el caso
        if (scrollY > 80) {
            lineEl.classList.add('visible');
        } else {
            lineEl.classList.remove('visible');
        }

        // Estado de cada nodo según scroll
        const viewportCenter = scrollY + window.innerHeight * 0.5;

        nodes.forEach(item => {
            const rect = item.target.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionBottom = sectionTop + rect.height;

            item.node.classList.remove('active', 'passed');

            if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
                item.node.classList.add('active');
            } else if (viewportCenter > sectionBottom) {
                item.node.classList.add('passed');
            }
        });
    }

    function onScrollOrResize() {
        window.requestAnimationFrame(() => {
            positionNodes();
            updateProgress();
        });
    }

    function init() {
        buildThreadLine();
        if (nodes.length === 0) return; // nada que conectar

        positionNodes();
        updateProgress();

        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);

        // Recalcular posiciones cuando cargan imágenes (cambia el alto del documento)
        window.addEventListener('load', onScrollOrResize);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();