const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

async function cargarProyecto() {
    const response = await fetch('./data/proyectos.json');
    const proyectos = await response.json();
    const proyecto = proyectos.find(p => p.slug === slug);

    console.log(proyecto);

    const container = document.getElementById('projectContent');

    container.innerHTML = `
        ${renderHero(proyecto.hero)}
        ${renderProblema(proyecto.problema)}
        ${renderAnalisis(proyecto.analisis)}
        ${renderProceso(proyecto.proceso)}
        ${renderSolucion(proyecto.solucion)}
        ${renderValidacion(proyecto.validacion)}
        ${renderResultado(proyecto.resultado)}
    `;
}
cargarProyecto();


function renderHero(hero) {
    const metaItems = (hero.metadata || [])
        .map(m => `
      <div class="meta-item">
        <span class="meta-label">${m.label}</span>
        <span class="meta-value">${m.value}</span>
      </div>`)
        .join('');

    return `
    <section class="case-hero">
      <div class="case-hero-text">
        <p class="small">${hero.label}</p>
        <h1>${hero.titulo}</h1>
        <p class="hero-desc">${hero.descripcion}</p>
        <div class="case-meta">${metaItems}</div>
      </div>
      <div class="case-hero-visual">
        <img src="${hero.imagen}" class="hero-mockup -img" alt="Preview del rediseño" />
      </div>
    </section>`;
}

function renderProblema(problema) {
    const parrafos = (problema.parrafos || [])
        .map(p => `<p>${p}</p>`)
        .join('');

    const hallazgos = (problema.hallazgos || [])
        .map(h => `
      <div class="finding">
        <span class="finding-dot"></span>
        ${h}
      </div>`)
        .join('');

    return `
    <section class="section-wide" id="problema">
      <div class="case-grid">
        <div class="case-text " data-index="01">
          <p class="small">${problema.label}</p>
          <h2>${problema.titulo}</h2>
          ${problema.nota ? `<p class="case-note">${problema.nota}</p>` : ''}
          ${parrafos}
          ${hallazgos ? `<div class="findings-list">${hallazgos}</div>` : ''}
        </div>
      </div>
    </section>`;
}

function renderAnalisis(analisis) {
    const parrafos = (analisis.parrafos || [])
        .map(p => `<p>${p}</p>`)
        .join('');

    const bgStyle = analisis.backgroundImage
        ? `style="--analysis-bg: url('${analisis.backgroundImage}')"` : '';

    return `
    <section id="analisis" ${bgStyle}>
      <div class="analysis-overlay">
        <p class="small">${analisis.label}</p>
        <h2>${analisis.titulo}</h2>
        ${analisis.nota ? `<p class="case-note">${analisis.nota}</p>` : ''}
        ${parrafos}
      </div>
    </section>`;
}

function renderProceso(proceso) {
    const fases = (proceso.fases || []).map((f, i) => {
        const num = String(i + 1).padStart(2, '0');
        const isLast = i === proceso.fases.length - 1;
        return `
      <div class="phase${f.activa ? ' active' : ''}">
        <span class="phase-num">${num}</span>
        <span class="phase-name">${f.nombre}</span>
      </div>
      ${!isLast ? '<div class="phase-arrow">→</div>' : ''}`;
    }).join('');

    const parrafos = (proceso.parrafos || [])
        .map(p => `<p>${p}</p>`)
        .join('');

    return `
    <section class="section-wide" id="proceso">
      ${fases ? `<div class="process-phases">${fases}</div>` : ''}
      <div class="case-grid">
        <div class="case-text " data-index="03">
          <p class="small">${proceso.label}</p>
          <h2>${proceso.titulo}</h2>
          ${proceso.nota ? `<p class="case-note">${proceso.nota}</p>` : ''}
          ${parrafos}
        </div>
      </div>
    </section>`;
}

function renderSolucion(solucion) {
    const parrafos = (solucion.parrafos || [])
        .map(p => `<p>${p}</p>`)
        .join('');

    let comparacion = '';
    if (solucion.comparacion) {
        const { antes, despues, labelAntes, labelDespues } = solucion.comparacion;
        comparacion = `
      <div class="compare-wrapper">
        <div class="compare-container" id="compareContainer">
          <img src="${antes}" class="compare-after" alt="${labelDespues}" />
          <div class="compare-before" id="compareBefore">
            <img src="${despues}" alt="${labelAntes}" />
          </div>
          <div class="compare-handle" id="compareHandle">
            <div class="handle-line"></div>
            <div class="handle-circle"><span>↔</span></div>
            <div class="handle-line"></div>
          </div>
        </div>
        <div class="compare-labels">
          <span>${labelAntes}</span>
          <span>${labelDespues}</span>
        </div>
      </div>`;
    }

    return `
    <section id="solucion" class="section-wide">
      <div class="case-grid reverse">
        <div class="case-text " data-index="04">
          <p class="small">${solucion.label}</p>
          <h2>${solucion.titulo}</h2>
          ${solucion.nota ? `<p class="case-note">${solucion.nota}</p>` : ''}
          ${parrafos}
        </div>
        ${comparacion}
      </div>
    </section>`;
}

/**
 * Sección opcional — solo se renderiza si el proyecto tiene "validacion" en el JSON.
 */
function renderValidacion(validacion) {
    if (!validacion) return '';

    return `
    <section class="approval">
      <div class="approval-inner">
        <div class="approval-label">
          <span class="small">${validacion.label}</span>
        </div>
        <div class="approval-content">
          <div class="approval-screenshot">
            <div class="screenshot-bar">
              <span></span><span></span><span></span>
            </div>
            ${validacion.imagen
            ? `<img src="${validacion.imagen}" alt="${validacion.imagenAlt || ''}" loading="lazy" />`
            : ''}
          </div>
          <div class="approval-text">
            ${validacion.eyebrow ? `<p class="approval-eyebrow small">${validacion.eyebrow}</p>` : ''}
            <h2>${validacion.titulo}</h2>
            <p>${validacion.descripcion}</p>
          </div>
        </div>
      </div>
    </section>`;
}

function renderResultado(resultado) {
    const metricas = (resultado.metricas || [])
        .map(m => `
      <div class="outcome-card">
        <span class="outcome-num">${m.valor}</span>
        <span class="outcome-label">${m.descripcion}</span>
      </div>`)
        .join('');

    return `
    <section class="section-narrow" id="resultado">
      <p class="small " data-delay="1">${resultado.label}</p>
      ${metricas ? `<div class="outcome-grid">${metricas}</div>` : ''}
      <h2 class="" data-delay="2">${resultado.titulo}</h2>
      <p class="" data-delay="3">${resultado.descripcion}</p>
      <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
        <a href="index.html#casos" class="btn btn-ghost " data-delay="3">← Volver</a>
        ${resultado.sitio
            ? `<a href="${resultado.sitio}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost " data-delay="3">Ver sitio en vivo ↗</a>`
            : ''}
      </div>
    </section>`;
}

// ─── Carga y render ───────────────────────────────────────────────────────────

async function cargarProyecto() {
    const response = await fetch('./data/proyectos.json');
    const proyectos = await response.json();
    const proyecto = proyectos.find(p => p.slug === slug);

    if (!proyecto) {
        document.getElementById('projectContent').innerHTML = '<p>Proyecto no encontrado.</p>';
        return;
    }

    document.title = `${proyecto.titulo} — Portafolio`;

    document.getElementById('projectContent').innerHTML = `
    ${renderHero(proyecto.hero)}
    ${renderProblema(proyecto.problema)}
    ${renderAnalisis(proyecto.analisis)}
    ${renderProceso(proyecto.proceso)}
    ${renderSolucion(proyecto.solucion)}
    ${renderValidacion(proyecto.validacion)}
    ${renderResultado(proyecto.resultado)}
  `;
}

cargarProyecto();
