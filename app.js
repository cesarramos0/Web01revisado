// VARIABLES
const formulario = document.getElementById("formulario-tareas");
const input = document.getElementById("input-tarea");
const contenedorLista = document.querySelector(".lista-propuestas");
const inputBusqueda = document.getElementById("input-busqueda");
const btnOscuro = document.getElementById("btn-oscuro");
const botonCompletadas = document.getElementById("btn-marcar-completadas");
const botonEliminarCompletadas = document.getElementById("btn-eliminar-completadas");
const filtroTotal = document.getElementById("btn-filtro-total");
const filtroCompletadas = document.getElementById("btn-filtro-completadas");
const filtroPendientes = document.getElementById("btn-filtro-pendientes");
const htmlElement = document.documentElement;

// Referencias a estadísticas (si existen en el HTML)
const statRefs = {
  total: document.getElementById("stat-total"),
  completadas: document.getElementById("stat-completadas"),
  pendientes: document.getElementById("stat-pendientes"),
};

const SELECTOR_TAREA = ".lista-propuestas .tarea-item";

const obtenerTareasDOM = () => Array.from(document.querySelectorAll(SELECTOR_TAREA));

function obtenerEstadoTarea(tareaElemento) {
  const span = tareaElemento.querySelector("span");
  const texto = span.textContent;
  const estaCompletada = span.classList.contains("line-through");

  return { span, texto, estaCompletada };
}

// Helpers
const isDark = () => htmlElement.classList.contains("dark");
const setTheme = (theme) => {
  if (theme === "dark") {
    htmlElement.classList.add("dark");
    btnOscuro.textContent = "☀️";
  } else {
    htmlElement.classList.remove("dark");
    btnOscuro.textContent = "🌙";
  }
  localStorage.setItem("theme", theme);
};

// MODO OSCURO
if (localStorage.getItem("theme") === "dark") {
  setTheme("dark");
} else {
  setTheme("light");
}

btnOscuro.addEventListener("click", () => {
  setTheme(isDark() ? "light" : "dark");
});

// AUTO-RESIZE TEXTAREA
input.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = `${this.scrollHeight}px`;
});

// RECUPERACIÓN DE ELEMENTOS (Al cargar la página)
document.addEventListener("DOMContentLoaded", () => {
  cargarTareasDeStorage();
});

// ESCUCHA DE EVENTOS (Añadir tarea)
formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  const texto = input.value.trim();
  if (!texto) return;

  crearElemento({ texto, completada: false });

  input.value = "";
  input.style.height = "auto";
  guardarTareas();
});

// BUSQUEDA DE PROPUESTAS
inputBusqueda.addEventListener("input", () => {
  const filtro = inputBusqueda.value.toLowerCase().trim();
  const propuestas = obtenerTareasDOM();

  if (!filtro) {
    propuestas.forEach((p) => (p.style.display = "flex"));
    return;
  }

  const reglaExacta = new RegExp(`\\b${filtro}\\b`, "i");

  propuestas.forEach((propuesta) => {
    const textoPropuesta = propuesta.querySelector("span").textContent;
    propuesta.style.display = reglaExacta.test(textoPropuesta) ? "flex" : "none";
  });
});

// MARCAR TODAS COMO COMPLETADAS
botonCompletadas.addEventListener("click", () => {
  obtenerTareasDOM().forEach((tarea) => marcarTarea(tarea, true));
  guardarTareas();
});

// ELIMINAR TODAS LAS PROPUESTAS MARCADAS COMO COMPLETADAS
botonEliminarCompletadas.addEventListener("click", () => {
  obtenerTareasDOM().forEach((tarea) => {
    const { estaCompletada } = obtenerEstadoTarea(tarea);
    if (estaCompletada) {
      tarea.remove();
    }
  });
  guardarTareas();
});

// Filtros
filtroCompletadas.addEventListener("click", () => filtrarTareas("completadas"));
filtroPendientes.addEventListener("click", () => filtrarTareas("pendientes"));
filtroTotal.addEventListener("click", () => filtrarTareas("todas"));

// FUNCIONES AUXILIARES
function cargarTareasDeStorage() {
  const almacenadas = JSON.parse(localStorage.getItem("tareas-mkt23")) || [];

  almacenadas.forEach((item) => {
    const tarea = typeof item === "string" ? { texto: item, completada: false } : item;
    crearElemento(tarea);
  });

  guardarTareas();
}

function marcarTarea(tareaElemento, completada) {
  const span = tareaElemento.querySelector("span");

  const clasesTextoCompletada = ["line-through", "text-gray-400", "dark:text-gray-500"];
  const clasesTextoPendiente = ["text-gray-800", "dark:text-gray-200"];
  const clasesContCompletada = ["bg-gray-100", "dark:bg-slate-700", "opacity-60"];
  const clasesContPendiente = [
    "bg-white",
    "dark:bg-slate-800",
    "hover:border-acento",
    "dark:hover:border-acento",
  ];

  if (completada) {
    span.classList.add(...clasesTextoCompletada);
    span.classList.remove(...clasesTextoPendiente);
    tareaElemento.classList.add(...clasesContCompletada);
    tareaElemento.classList.remove(...clasesContPendiente);
  } else {
    span.classList.remove(...clasesTextoCompletada);
    span.classList.add(...clasesTextoPendiente);
    tareaElemento.classList.remove(...clasesContCompletada);
    tareaElemento.classList.add(...clasesContPendiente);
  }
}

function crearElemento(tareaObj) {
  const nuevaTarea = document.createElement("div");

  const baseContenedor =
    "tarea-item flex justify-between items-center p-4 mb-3 rounded-lg shadow-sm w-full transition-all duration-300 cursor-pointer border border-transparent ";
  const baseTexto = "flex-1 min-w-0 pr-4 break-all transition-all duration-300 ";

  const estaCompletada = Boolean(tareaObj.completada);

  const clasesContenedor = estaCompletada
    ? baseContenedor + "bg-gray-100 dark:bg-slate-700 opacity-60"
    : baseContenedor + "bg-white dark:bg-slate-800 hover:border-acento dark:hover:border-acento";

  const clasesTexto = estaCompletada
    ? baseTexto + "line-through text-gray-400 dark:text-gray-500"
    : baseTexto + "text-gray-800 dark:text-gray-200";

  nuevaTarea.className = clasesContenedor;

  nuevaTarea.innerHTML = `
    <button class="btn-editar p-2 hover:scale-110 transition-transform cursor-pointer z-10">
      <img src="img/editar.png" alt="editar-propuesta" class="w-4 h-4 dark:invert">
    </button>
    <span class="${clasesTexto}">${tareaObj.texto}</span>
    <button class="btn-borrar p-2 hover:scale-110 transition-transform cursor-pointer z-10">
      <img src="img/cerrar.png" alt="eliminar-propuesta" class="w-4 h-4 dark:invert">
    </button>
  `;

  // Marcar/Desmarcar como completada
  nuevaTarea.addEventListener("click", (event) => {
    if (event.target.closest(".btn-borrar") || event.target.closest(".btn-editar")) return;

    const span = nuevaTarea.querySelector("span");
    const estaTachada = span.classList.contains("line-through");
    marcarTarea(nuevaTarea, !estaTachada);
    guardarTareas();
  });

  // Botón de eliminar
  const botonEliminar = nuevaTarea.querySelector(".btn-borrar");
  botonEliminar.addEventListener("click", (event) => {
    event.stopPropagation();
    nuevaTarea.remove();
    guardarTareas();
  });

  // Botón de editar
  const botonEditar = nuevaTarea.querySelector(".btn-editar");
  botonEditar.addEventListener("click", (event) => {
    event.stopPropagation();

    const span = nuevaTarea.querySelector("span");
    const textoActual = span.textContent;

    const nuevoTexto = prompt("Edita tu propuesta:", textoActual);

    if (nuevoTexto && nuevoTexto.trim() !== "") {
      span.textContent = nuevoTexto.trim();
      guardarTareas();
    }
  });

  contenedorLista.appendChild(nuevaTarea);
}

// FILTRO: TOTAL, COMPLETADAS Y PENDIENTES
function filtrarTareas(tipoFiltro) {
  obtenerTareasDOM().forEach((tarea) => {
    const { estaCompletada } = obtenerEstadoTarea(tarea);

    if (tipoFiltro === "completadas") {
      tarea.style.display = estaCompletada ? "flex" : "none";
    } else if (tipoFiltro === "pendientes") {
      tarea.style.display = !estaCompletada ? "flex" : "none";
    } else {
      tarea.style.display = "flex";
    }
  });
}

// GUARDAR LOCALMENTE
function guardarTareas() {
  const todasTareas = [];
  let completadas = 0;

  obtenerTareasDOM().forEach((tarea) => {
    const { texto, estaCompletada } = obtenerEstadoTarea(tarea);

    if (estaCompletada) completadas++;
    todasTareas.push({ texto, completada: estaCompletada });
  });

  localStorage.setItem("tareas-mkt23", JSON.stringify(todasTareas));
  actualizarEstadisticas(todasTareas.length, completadas);
}

// ACTUALIZAR ESTADÍSTICAS
function actualizarEstadisticas(total, completadas) {
  if (!statRefs.total || !statRefs.completadas || !statRefs.pendientes) return;

  if (statRefs.total.textContent !== String(total)) statRefs.total.textContent = total;
  if (statRefs.completadas.textContent !== String(completadas))
    statRefs.completadas.textContent = completadas;

  const pendientes = total - completadas;
  if (statRefs.pendientes.textContent !== String(pendientes))
    statRefs.pendientes.textContent = pendientes;
}