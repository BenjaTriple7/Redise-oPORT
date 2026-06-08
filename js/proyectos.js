let proyectosGlobal = [];

async function cargarProyectos() {

    const response = await fetch('./data/proyectos.json');

    const proyectos = await response.json();

    proyectos.sort((a, b) => a.orden - b.orden);

    proyectosGlobal = proyectos;

    generarFiltros(proyectos);

    renderizarProyectos(proyectos);
}

cargarProyectos();

function generarFiltros(proyectos) {

    const filtersContainer = document.getElementById('filters');

    const categorias = new Set();

    proyectos.forEach(proyecto => {

        proyecto.categorias.forEach(categoria => {
            categorias.add(categoria);
        });

    });

    filtersContainer.innerHTML = `
    <button
        class="btn btn-ghost filter-btn active"
        data-filter="Todos"
    >
        Todos
    </button>
    `;

    [...categorias].sort().forEach(categoria => {

        filtersContainer.innerHTML += `
            <button
                class="btn btn-ghost filter-btn"
                data-filter="${categoria}"
            >
                ${categoria}
            </button>
        `;

    });

    inicializarFiltros();
}

function inicializarFiltros() {

    const botones = document.querySelectorAll('.filter-btn');

    botones.forEach(boton => {

        boton.addEventListener('click', () => {

            botones.forEach(btn =>
                btn.classList.remove('active')
            );

            boton.classList.add('active');

            const filtro = boton.dataset.filter;

            if (filtro === 'Todos') {

                renderizarProyectos(proyectosGlobal);

                return;
            }

            const filtrados = proyectosGlobal.filter(proyecto =>
                proyecto.categorias.includes(filtro)
            );

            renderizarProyectos(filtrados);

        });

    });

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