const params = new URLSearchParams(window.location.search);

const slug = params.get('slug');

async function cargarProyecto() {

    const response = await fetch('./data/proyectos.json');

    const proyectos = await response.json();

    const proyecto = proyectos.find(
        p => p.slug === slug
    );

    const container = document.getElementById('projectContent');

    container.innerHTML = `
        ${renderHero(proyecto.hero)}
        ${renderProblema(proyecto.problema)}
    `;
}
cargarProyecto();


function renderHero(hero) {

    const metadataHTML = hero.metadata
        .map(item => `
            <div class="meta-item">
                <span class="meta-label">${item.label}</span>
                <span class="meta-value">${item.value}</span>
            </div>
        `)
        .join('');

    return `
    <section class="case-hero">

        <div class="case-hero-text">

            <p class="small">${hero.label}</p>

            <h1>${hero.titulo}</h1>

            <p class="hero-desc">${hero.descripcion}</p>

            <div class="case-meta">
                ${metadataHTML}
            </div>

        </div>

        <div class="case-hero-visual">
                <img src="${hero.imagen}" class="hero-mockup reveal-img" alt="Preview del rediseño">
            </div>

    </section>
    `;
}

function renderProblema(problema) {

    return `
    <section class="section-wide" id="problema">

        <div class="case-grid">

            <div class="case-text">

                <p class="small">Problema</p>

                <h2>${problema.titulo}</h2>

                <p class="case-note">
                    ${problema.descripcion}
                </p>

            </div>

        </div>

    </section>
    `;
}
