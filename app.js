// VARIABLES
const formulario = document.getElementById("formulario-tareas");
const input = document.getElementById("input-tarea");
const contenedorLista = document.querySelector(".lista-propuestas");
const inputBusqueda = document.getElementById("input-busqueda");
const btnOscuro = document.getElementById('btn-oscuro');
const htmlElement = document.documentElement;

// MODO OSCURO
if (localStorage.getItem('theme') === 'dark') {
    htmlElement.classList.add('dark');
    btnOscuro.textContent = '☀️';
}

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

// AUTO-RESIZE TEXTAREA
input.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
});

// RECUPERACIÓN DE ELEMENTOS (Al cargar la página)
document.addEventListener("DOMContentLoaded", () => {
    const almacenadas = JSON.parse(localStorage.getItem("tareas-mkt23"));
    if (almacenadas) {
        almacenadas.forEach(item => {
            if (typeof item === 'string') {
                crearElemento({ texto: item, completada: false });
            } else {
                crearElemento(item);
            }
        });
    }
    guardarTareas();
});

// ESCUCHA DE EVENTOS (Añadir tarea)
formulario.addEventListener("submit", function(event) {
    event.preventDefault(); 
    
    if (input.value.trim() == "") return;

    crearElemento({ texto: input.value, completada: false });

    input.value = "";
    input.style.height = "auto";
    guardarTareas();
});

// BUSQUEDA DE PROPUESTAS
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

// FUNCIONES AUXILIARES

function crearElemento(tareaObj) {
    const nuevaTarea = document.createElement("div");
    
    let clasesContenedor = "tarea-item flex justify-between items-center p-4 mb-3 rounded-lg shadow-sm w-full transition-all duration-300 cursor-pointer border border-transparent ";
    let clasesTexto = "flex-1 pr-4 break-words transition-all duration-300 ";

    if (tareaObj.completada) {
        clasesContenedor += "bg-gray-100 dark:bg-slate-700 opacity-60";
        clasesTexto += "line-through text-gray-400 dark:text-gray-500";
    } else {
        clasesContenedor += "bg-white dark:bg-slate-800 hover:border-acento dark:hover:border-acento";
        clasesTexto += "text-gray-800 dark:text-gray-200";
    }

    nuevaTarea.className = clasesContenedor;

    nuevaTarea.innerHTML = `
        <span class="${clasesTexto}">${tareaObj.texto}</span>
        <button class="btn-borrar p-2 hover:scale-110 transition-transform cursor-pointer z-10">
            <img src="img/cerrar.png" alt="eliminar-propuesta" class="w-4 h-4 dark:invert">
        </button>
    `;

    // EVENTO 1: Marcar/Desmarcar como completada al hacer clic
    nuevaTarea.addEventListener("click", function(event) {
        if (event.target.closest('.btn-borrar')) return;

        const span = nuevaTarea.querySelector("span");
        const estaTachada = span.classList.contains("line-through");

        if (estaTachada) {

            span.classList.remove("line-through", "text-gray-400", "dark:text-gray-500");
            span.classList.add("text-gray-800", "dark:text-gray-200");
            nuevaTarea.classList.remove("bg-gray-100", "dark:bg-slate-700", "opacity-60");
            nuevaTarea.classList.add("bg-white", "dark:bg-slate-800", "hover:border-acento", "dark:hover:border-acento");
        } else {

            span.classList.add("line-through", "text-gray-400", "dark:text-gray-500");
            span.classList.remove("text-gray-800", "dark:text-gray-200");
            nuevaTarea.classList.add("bg-gray-100", "dark:bg-slate-700", "opacity-60");
            nuevaTarea.classList.remove("bg-white", "dark:bg-slate-800", "hover:border-acento", "dark:hover:border-acento");
        }

        guardarTareas();
    });

    // EVENTO 2: Botón de eliminar
    const botonEliminar = nuevaTarea.querySelector(".btn-borrar");
    botonEliminar.addEventListener("click", function(event) {
        event.stopPropagation();
        nuevaTarea.remove();
        guardarTareas();
    });

    contenedorLista.appendChild(nuevaTarea);
}

function guardarTareas() {
    const todasTareas = [];
    const elementosTarea = document.querySelectorAll(".lista-propuestas .tarea-item");
    let completadas = 0;

    elementosTarea.forEach(tarea => {
        const span = tarea.querySelector("span");
        const texto = span.textContent;
        const estaCompletada = span.classList.contains("line-through");
        
        if (estaCompletada) completadas++;

        todasTareas.push({ texto: texto, completada: estaCompletada });
    });

    localStorage.setItem("tareas-mkt23", JSON.stringify(todasTareas));
    
    actualizarEstadisticas(todasTareas.length, completadas);
}

function actualizarEstadisticas(total, completadas) {
    const statTotal = document.getElementById("stat-total");
    const statCompletadas = document.getElementById("stat-completadas");
    const statPendientes = document.getElementById("stat-pendientes");

    if (statTotal && statCompletadas && statPendientes) {
        statTotal.textContent = total;
        statCompletadas.textContent = completadas;
        statPendientes.textContent = total - completadas;
    }
}