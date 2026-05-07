/* ============================================================
   BENJAMÍN SÁNCHEZ — PORTFOLIO JS
   ============================================================ */

/* ── 1. SCROLL REVEAL ────────────────────────────────── */
const revealTargets = document.querySelectorAll(
    '.case, .about-right p, .skills-list li, .method-right p, .contact h2, .contact > p'
);

revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger dentro de listas
    if (el.closest('.skills-list') || el.closest('.cases')) {
        el.style.transitionDelay = `${(i % 6) * 0.07}s`;
    }
});

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObserver.unobserve(e.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealTargets.forEach(el => revealObserver.observe(el));


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

// Ocultar cursor nativo sobre el área interactiva
document.addEventListener('mouseenter', () => document.body.style.cursor = 'none');
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
    document.body.style.cursor = 'auto';
});


/* ── 3. NAVBAR DINÁMICA ──────────────────────────────── */
const nav = document.createElement('nav');
nav.id = 'floating-nav';
nav.innerHTML = `
  <span class="nav-name">Benjamín Sánchez</span>
  <div class="nav-links">
    <a href="#casos">Casos</a>
    <a href="#sobre">Sobre mí</a>
    <a href="#habilidades">Stack</a>
    <a href="#contacto">Contacto</a>
  </div>
`;

Object.assign(nav.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '1000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem clamp(2rem, 5vw, 5rem)',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '0.82rem',
    fontWeight: '400',
    letterSpacing: '0.03em',
    color: 'rgba(240,237,232,0)',
    background: 'transparent',
    borderBottom: '1px solid transparent',
    transition: 'color 0.4s ease, background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
    pointerEvents: 'none',
});

// Estilos internos
const navStyle = document.createElement('style');
navStyle.textContent = `
  #floating-nav a {
    color: inherit;
    text-decoration: none;
    opacity: 0.6;
    transition: opacity 0.2s;
    cursor: pointer;
  }
  #floating-nav a:hover { opacity: 1; }
  .nav-links { display: flex; gap: 2rem; }
  .nav-name  { font-weight: 500; }
  @media (max-width: 560px) { .nav-links { display: none; } }
`;
document.head.appendChild(navStyle);
document.body.prepend(nav);

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 80;
    nav.style.color = scrolled ? 'rgba(240,237,232,0.85)' : 'rgba(240,237,232,0)';
    nav.style.background = scrolled ? 'rgba(13,13,13,0.85)' : 'transparent';
    nav.style.backdropFilter = scrolled ? 'blur(12px)' : 'none';
    nav.style.borderColor = scrolled ? 'rgba(255,255,255,0.07)' : 'transparent';
    nav.style.pointerEvents = scrolled ? 'all' : 'none';
}, { passive: true });


/* ── 4. CONTADOR DE CASOS ────────────────────────────── */
// Inyecta número de caso elegantemente en cada article.case
document.querySelectorAll('.cases article.case').forEach((article, i) => {
    const num = document.createElement('span');
    num.textContent = String(i + 1).padStart(2, '0');
    Object.assign(num.style, {
        position: 'absolute',
        top: '2.2rem',
        right: '0',
        fontFamily: "'DM Serif Display', serif",
        fontStyle: 'italic',
        fontSize: '4rem',
        lineHeight: '1',
        color: 'rgba(255,255,255,0.03)',
        userSelect: 'none',
        transition: 'color 0.3s ease',
        pointerEvents: 'none',
    });
    article.style.position = 'relative';
    article.appendChild(num);

    article.addEventListener('mouseenter', () => {
        num.style.color = 'rgba(200,169,126,0.08)';
    });
    article.addEventListener('mouseleave', () => {
        num.style.color = 'rgba(255,255,255,0.03)';
    });
});


/* ── 5. MARQUEE DECORATIVO (entre statement y casos) ─── */
const marqueeSection = document.querySelector('.statement');
if (marqueeSection) {
    const ticker = document.createElement('div');
    ticker.id = 'ticker';
    const words = ['UX · Rediseño · Front-end · Estructura · Jerarquía · Usabilidad · WCAG · HTML/CSS · JavaScript · Figma · '];
    ticker.innerHTML = `<div class="ticker-inner">${words[0].repeat(6)}</div>`;

    const tickerStyle = document.createElement('style');
    tickerStyle.textContent = `
    #ticker {
      overflow: hidden;
      border-top: 1px solid rgba(255,255,255,0.07);
      padding: 0.9rem 0;
      background: #131313;
    }
    .ticker-inner {
      display: inline-block;
      white-space: nowrap;
      animation: ticker-scroll 30s linear infinite;
      font-family: 'DM Sans', system-ui, sans-serif;
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(200,169,126,0.4);
    }
    @keyframes ticker-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `;
    document.head.appendChild(tickerStyle);
    marqueeSection.insertAdjacentElement('afterend', ticker);
}


/* ── 6. ACTIVE NAV LINK POR SECCIÓN ──────────────────── */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('#floating-nav a[href^="#"]');

const sectionObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.style.opacity = link.getAttribute('href') === `#${entry.target.id}` ? '1' : '0.6';
                });
            }
        });
    },
    { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));


/* ── 7. EFECTO PARALLAX SUAVE EN HERO ────────────────── */
const heroVisual = document.querySelector('.hero-visual-grid');
if (heroVisual) {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        heroVisual.style.transform = `translateY(${y * 0.18}px)`;
    }, { passive: true });
}