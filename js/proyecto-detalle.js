const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

async function cargarProyecto() {
    try {

        console.log('A');

        const response = await fetch('./data/proyectos.json');

        console.log('B');

        const proyectos = await response.json();

        console.log('C');

        const proyecto = proyectos.find(p => p.slug === slug);

        console.log('D', proyecto);

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

        console.log('E');

    } catch (error) {
        console.error('ERROR DETECTADO:', error);
    }
}

cargarProyecto();