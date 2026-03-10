//VARIABLES
const formulario = document.getElementById("formulario-tareas");
const input = document.getElementById("input-tarea");
const contenedorLista = document.querySelector(".lista-propuestas");
const inputBusqueda = document.getElementById("input-busqueda");
const btnOscuro = document.getElementById('btn-oscuro');
const htmlElement = document.documentElement;

if (localStorage.getItem('theme') === 'dark') {
    htmlElement.classList.add('dark');
    btnOscuro.textContent = '☀️';
}

input.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
});

//RECUPERACIÓN DE ELEMENTOS
document.addEventListener("DOMContentLoaded", () => {
    const almacenadas = JSON.parse(localStorage.getItem("tareas-mkt23"));
    if (almacenadas) {
        almacenadas.forEach(texto => {
            crearElemento(texto);
        });
    }
});

//ESCUCHA DE EVENTOS (Añadir tarea)
formulario.addEventListener("submit", function(event) {
    event.preventDefault(); 
    
    if (input.value.trim() == "") return;

    crearElemento(input.value);

    input.value = "";
    input.style.height = "auto";
    guardarTareas();
});

//BUSQUEDA DE PROPUESTAS
inputBusqueda.addEventListener("input", function() {
    const filtro = inputBusqueda.value.toLowerCase().trim();
    const propuestas = document.querySelectorAll(".lista-propuestas .tarea-item");

    if (filtro === "") {
        propuestas.forEach(p => p.style.display = "flex");
        return;
    }

    const reglaExacta = new RegExp(`\\b${filtro}\\b`, 'i');

    propuestas.forEach(propuesta => {
        const textoPropuesta = propuesta.querySelector("span").textContent;

        if (reglaExacta.test(textoPropuesta)) {
            propuesta.style.display = "flex";
        } else {
            propuesta.style.display = "none";
        }
    });
});

btnOscuro.addEventListener('click', () => {

    htmlElement.classList.toggle('dark');
    
    if (htmlElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        btnOscuro.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        btnOscuro.textContent = '🌙';
    }
});

//FUNCIONES AUXILIARES

function crearElemento(texto) {
    const nuevaTarea = document.createElement("div");
    
    nuevaTarea.className = "flex justify-between items-center bg-white dark:bg-slate-800 p-4 mb-3 rounded-lg shadow-sm w-full transition-colors";

    nuevaTarea.innerHTML = `
        <span class="text-gray-800 dark:text-gray-200 flex-1 pr-4 break-words">${texto}</span>
        <button class="btn-borrar p-2 hover:scale-110 transition-transform cursor-pointer">
            <img src="cerrar.png" alt="eliminar-propuesta" class="w-4 h-4 dark:invert">
        </button>
    `;

    const botonEliminar = nuevaTarea.querySelector(".btn-borrar");
    botonEliminar.addEventListener("click", function() {
        nuevaTarea.remove();
        guardarTareas();
    });

    contenedorLista.appendChild(nuevaTarea);
}

function guardarTareas(){
    const todasTareas = [];
    const elementosTarea = document.querySelectorAll(".lista-propuestas span");

    elementosTarea.forEach(tarea => {
        todasTareas.push(tarea.textContent);
    });

    localStorage.setItem("tareas-mkt23", JSON.stringify(todasTareas));
    console.log("Guardado con éxito", todasTareas);
}