async function obtenerProyectos() {

    const response = await fetch('./data/proyectos.json');

    return await response.json();

}