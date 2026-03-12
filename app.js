// VARIABLES
const formularioTareas = document.getElementById("formulario-tareas");
const textareaPropuesta = document.getElementById("input-tarea");
const listaPropuestas = document.querySelector(".lista-propuestas");
const buscadorPropuestas = document.getElementById("input-busqueda");
const botonTema = document.getElementById("btn-oscuro");
const botonMarcarCompletadas = document.getElementById("btn-marcar-completadas");
const botonBorrarCompletadas = document.getElementById("btn-eliminar-completadas");
const botonFiltroTotal = document.getElementById("btn-filtro-total");
const botonFiltroCompletadas = document.getElementById("btn-filtro-completadas");
const botonFiltroPendientes = document.getElementById("btn-filtro-pendientes");
const raizHTML = document.documentElement;

// Referencias a estadísticas (si existen en el HTML)
const estadisticas = {
  total: document.getElementById("stat-total"),
  completadas: document.getElementById("stat-completadas"),
  pendientes: document.getElementById("stat-pendientes"),
};

const SELECTOR_TAREA_ITEM = ".lista-propuestas .tarea-item";

const obtenerTareasDom = () => Array.from(document.querySelectorAll(SELECTOR_TAREA_ITEM));

function obtenerEstadoDeTarea(tareaElemento) {
  const span = tareaElemento.querySelector("span");
  const texto = span.textContent;
  const estaCompletada = span.classList.contains("line-through");

  return { span, texto, estaCompletada };
}

// Helpers
const esTemaOscuro = () => raizHTML.classList.contains("dark");
const aplicarTema = (theme) => {
  if (theme === "dark") {
    raizHTML.classList.add("dark");
    botonTema.textContent = "☀️";
  } else {
    raizHTML.classList.remove("dark");
    botonTema.textContent = "🌙";
  }
  localStorage.setItem("theme", theme);
};

// MODO OSCURO
if (localStorage.getItem("theme") === "dark") {
  aplicarTema("dark");
} else {
  aplicarTema("light");
}

botonTema.addEventListener("click", () => {
  aplicarTema(esTemaOscuro() ? "light" : "dark");
});

// AUTO-RESIZE TEXTAREA
textareaPropuesta.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = `${this.scrollHeight}px`;
});

// RECUPERACIÓN DE ELEMENTOS (Al cargar la página)
document.addEventListener("DOMContentLoaded", () => {
  cargarTareasDeStorage();
});

// ESCUCHA DE EVENTOS (Añadir tarea)
formularioTareas.addEventListener("submit", (event) => {
  event.preventDefault();

  const texto = textareaPropuesta.value.trim();
  if (!texto) return;

  crearElemento({ texto, completada: false });

  textareaPropuesta.value = "";
  textareaPropuesta.style.height = "auto";
  guardarTareas();
});

// BUSQUEDA DE PROPUESTAS
buscadorPropuestas.addEventListener("input", () => {
  const filtro = buscadorPropuestas.value.toLowerCase().trim();
  const propuestas = obtenerTareasDom();

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
botonMarcarCompletadas.addEventListener("click", () => {
  obtenerTareasDom().forEach((tarea) => marcarTarea(tarea, true));
  guardarTareas();
});

// ELIMINAR TODAS LAS PROPUESTAS MARCADAS COMO COMPLETADAS
botonBorrarCompletadas.addEventListener("click", () => {
  obtenerTareasDom().forEach((tarea) => {
    const { estaCompletada } = obtenerEstadoDeTarea(tarea);
    if (estaCompletada) {
      tarea.remove();
    }
  });
  guardarTareas();
});

// Filtros
botonFiltroCompletadas.addEventListener("click", () => filtrarTareas("completadas"));
botonFiltroPendientes.addEventListener("click", () => filtrarTareas("pendientes"));
botonFiltroTotal.addEventListener("click", () => filtrarTareas("todas"));

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

  // Limpiamos primero cualquier estado previo
  span.classList.remove(...CLASES_TEXTO_COMPLETADA, ...CLASES_TEXTO_PENDIENTE);
  tareaElemento.classList.remove(...CLASES_CONTENEDOR_COMPLETADA, ...CLASES_CONTENEDOR_PENDIENTE);

  if (completada) {
    span.classList.add(...CLASES_TEXTO_COMPLETADA);
    tareaElemento.classList.add(...CLASES_CONTENEDOR_COMPLETADA);
  } else {
    span.classList.add(...CLASES_TEXTO_PENDIENTE);
    tareaElemento.classList.add(...CLASES_CONTENEDOR_PENDIENTE);
  }
}

function crearElemento(tareaObj) {
  const nuevaTarea = document.createElement("div");

  const estaCompletada = Boolean(tareaObj.completada);
  nuevaTarea.className = CLASES_CONTENEDOR_BASE;

  nuevaTarea.innerHTML = `
    <button class="btn-editar p-2 hover:scale-110 transition-transform cursor-pointer z-10">
      <img src="img/editar.png" alt="editar-propuesta" class="w-4 h-4 dark:invert">
    </button>
    <span class="${CLASES_TEXTO_BASE}">${tareaObj.texto}</span>
    <button class="btn-borrar p-2 hover:scale-110 transition-transform cursor-pointer z-10">
      <img src="img/cerrar.png" alt="eliminar-propuesta" class="w-4 h-4 dark:invert">
    </button>
  `;

  // Aplicamos el estado visual inicial (completada/pendiente) en un solo sitio
  marcarTarea(nuevaTarea, estaCompletada);

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
  obtenerTareasDom().forEach((tarea) => {
    const { estaCompletada } = obtenerEstadoDeTarea(tarea);

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

  obtenerTareasDom().forEach((tarea) => {
    const { texto, estaCompletada } = obtenerEstadoDeTarea(tarea);

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