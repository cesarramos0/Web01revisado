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
const CLASES_CONTENEDOR_BASE = "tarea-item flex justify-between items-center p-4 mb-3 rounded-lg shadow-sm w-full transition-all duration-300 cursor-pointer border border-transparent bg-white dark:bg-slate-800 hover:border-acento dark:hover:border-acento";
const CLASES_TEXTO_BASE = "flex-1 min-w-0 pr-4 break-all transition-all duration-300 text-gray-800 dark:text-gray-200";
const CLASES_CONTENEDOR_COMPLETADA = ["bg-gray-100", "dark:bg-slate-700", "opacity-60"];
const CLASES_CONTENEDOR_PENDIENTE = ["bg-white", "dark:bg-slate-800"];
const CLASES_TEXTO_COMPLETADA = ["line-through", "text-gray-400", "dark:text-gray-500"];
const CLASES_TEXTO_PENDIENTE = ["text-gray-800", "dark:text-gray-200"];
const raizHTML = document.documentElement;

// Referencias a estadísticas (si existen en el HTML)
const estadisticas = {
  total: document.getElementById("stat-total"),
  completadas: document.getElementById("stat-completadas"),
  pendientes: document.getElementById("stat-pendientes"),
};

const SELECTOR_TAREA_ITEM = ".lista-propuestas .tarea-item";

/**
 * Devuelve todos los elementos DOM de tareas actuales.
 * @returns {HTMLElement[]} Lista de nodos de tarea.
 */
const obtenerTareasDom = () => Array.from(document.querySelectorAll(SELECTOR_TAREA_ITEM));

/**
 * Obtiene información estructurada de una tarea a partir de su nodo.
 * @param {HTMLElement} tareaElemento - Contenedor de la tarea.
 * @returns {{ span: HTMLSpanElement, texto: string, estaCompletada: boolean }}
 */
function obtenerEstadoDeTarea(tareaElemento) {
  const span = tareaElemento.querySelector("span");
  const texto = span.textContent;
  const estaCompletada = span.classList.contains("line-through");

  return { span, texto, estaCompletada };
}

// Helpers
/**
 * Indica si el tema actual aplicado al documento es oscuro.
 * @returns {boolean}
 */
const esTemaOscuro = () => raizHTML.classList.contains("dark");

/**
 * Aplica el tema indicado al documento y lo persiste en localStorage.
 * @param {"light" | "dark"} theme - Tema a aplicar.
 */
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

/**
 * Pide confirmación antes de eliminar tareas.
 * @param {{ modo: "una" | "completadas", textoTarea?: string, cantidad?: number }} params
 * @returns {boolean}
 */
function confirmarEliminacion(params) {
  const modo = params?.modo;

  if (modo === "una") {
    const texto = (params?.textoTarea ?? "").trim();
    const resumen = texto ? `\n\n"${texto.length > 80 ? `${texto.slice(0, 77)}...` : texto}"` : "";
    return window.confirm(`¿Seguro que quieres eliminar esta propuesta?${resumen}`);
  }

  if (modo === "completadas") {
    const cantidad = Number(params?.cantidad ?? 0);
    if (!Number.isFinite(cantidad) || cantidad <= 0) return false;
    return window.confirm(
      `¿Seguro que quieres eliminar ${cantidad} propuesta${cantidad === 1 ? "" : "s"} realizada${
        cantidad === 1 ? "" : "s"
      }?`
    );
  }

  return window.confirm("¿Seguro que quieres eliminar?");
}

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
  const tareas = obtenerTareasDom();
  const completadas = tareas.filter((tarea) => obtenerEstadoDeTarea(tarea).estaCompletada);
  if (completadas.length === 0) return;

  const confirmado = confirmarEliminacion({ modo: "completadas", cantidad: completadas.length });
  if (!confirmado) return;

  completadas.forEach((tarea) => tarea.remove());
  guardarTareas();
});

// Filtros
botonFiltroCompletadas.addEventListener("click", () => filtrarTareas("completadas"));
botonFiltroPendientes.addEventListener("click", () => filtrarTareas("pendientes"));
botonFiltroTotal.addEventListener("click", () => filtrarTareas("todas"));

// FUNCIONES AUXILIARES
/**
 * Lee las tareas guardadas en localStorage y las pinta en la interfaz.
 * Normaliza tanto el formato antiguo (string) como el nuevo (objeto).
 */
function cargarTareasDeStorage() {
  const almacenadas = JSON.parse(localStorage.getItem("tareas-mkt23")) || [];

  almacenadas.forEach((item) => {
    const tarea = typeof item === "string" ? { texto: item, completada: false } : item;
    crearElemento(tarea);
  });

  guardarTareas();
}

/**
 * Actualiza el aspecto visual de una tarea según su estado de completada.
 * @param {HTMLElement} tareaElemento - Contenedor DOM de la tarea.
 * @param {boolean} completada - Si la tarea debe mostrarse como completada.
 */
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

/**
 * Crea un nuevo elemento de tarea en el DOM y registra sus eventos.
 * @param {{ texto: string, completada: boolean }} tareaObj - Datos de la tarea.
 */
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
    const { texto } = obtenerEstadoDeTarea(nuevaTarea);
    const confirmado = confirmarEliminacion({ modo: "una", textoTarea: texto });
    if (!confirmado) return;
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

  listaPropuestas.appendChild(nuevaTarea);
}

// FILTRO: TOTAL, COMPLETADAS Y PENDIENTES
/**
 * Muestra/oculta tareas según el tipo de filtro indicado.
 * @param {"completadas" | "pendientes" | "todas"} tipoFiltro - Tipo de filtro a aplicar.
 */
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
/**
 * Recorre las tareas actuales del DOM y las guarda en localStorage,
 * además de recalcular y actualizar las estadísticas.
 */
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
/**
 * Refleja en el panel lateral las estadísticas de tareas.
 * Solo actualiza cuando el valor cambia para evitar repintados innecesarios.
 * @param {number} total - Número total de tareas.
 * @param {number} completadas - Número de tareas completadas.
 */
function actualizarEstadisticas(total, completadas) {
  if (!estadisticas.total || !estadisticas.completadas || !estadisticas.pendientes) return;

  if (estadisticas.total.textContent !== String(total)) estadisticas.total.textContent = total;
  if (estadisticas.completadas.textContent !== String(completadas))
    estadisticas.completadas.textContent = completadas;

  const pendientes = total - completadas;
  if (estadisticas.pendientes.textContent !== String(pendientes))
    estadisticas.pendientes.textContent = pendientes;
}