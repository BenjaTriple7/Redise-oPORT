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
const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navSteps.forEach(s => s.classList.remove('active'));
            const active = document.querySelector(`.cpn-step[data-section="${e.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.35 });
document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

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


(function () {
    const sections = document.querySelectorAll('.narrative-section');

    if (!sections.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // solo una vez
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: '0px 0px -60px 0px',
        }
    );

    sections.forEach((section) => observer.observe(section));
})();

