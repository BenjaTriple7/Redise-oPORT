async function cargarProyectos() {

    const response = await fetch('./data/proyectos.json');
    const proyectos = await response.json();

    proyectos.sort((a, b) => a.orden - b.orden);

    renderizarProyectos(proyectos);
}

function renderizarProyectos(proyectos) {

    const grid = document.getElementById('projectsGrid');

    grid.innerHTML = proyectos.map(proyecto => `
    
        <article class="case-card">

            <div class="case-cover">
                <a href="proyecto.html?slug=${proyecto.slug}">
                    <img
                        src="${proyecto.thumbnail}"
                        alt="${proyecto.titulo}"
                        loading="lazy"
                    >
                </a>
            </div>

            <div class="case-info">

                <span class="case-tag">
                    ${proyecto.categorias.join(' · ')}
                </span>

                <h3>${proyecto.titulo}</h3>

                <p>${proyecto.descripcionCorta}</p>

            </div>

            <a
                href="proyecto.html?slug=${proyecto.slug}"
                class="case-link"
            >
                Ver caso →
            </a>

        </article>

    `).join('');
}

cargarProyectos();