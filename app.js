import { obtenerTareas, crearTarea, eliminarTarea } from './src/api/client.js';

// VARIABLES
const formularioTareas = document.getElementById("formulario-tareas");
const textareaPropuesta = document.getElementById("input-tarea");
const mensajeErrorTarea = document.getElementById("input-tarea-error");
const contadorTarea = document.getElementById("input-tarea-contador");
const listaPropuestas = document.querySelector(".lista-propuestas");
const buscadorPropuestas = document.getElementById("input-busqueda");
const botonTema = document.getElementById("btn-oscuro");
const botonMarcarCompletadas = document.getElementById("btn-marcar-completadas");
const botonBorrarCompletadas = document.getElementById("btn-eliminar-completadas");
const botonDeshacer = document.getElementById("btn-deshacer");
const botonExportarJSON = document.getElementById("btn-exportar-json");
const botonImportarJSON = document.getElementById("btn-importar-json");
const inputImportarJSON = document.getElementById("input-importar-json");
const botonFiltroTotal = document.getElementById("btn-filtro-total");
const botonFiltroCompletadas = document.getElementById("btn-filtro-completadas");
const botonFiltroPendientes = document.getElementById("btn-filtro-pendientes");
const CLASES_CONTENEDOR_BASE = "tarea-item flex justify-between items-center p-4 mb-3 rounded-lg shadow-sm w-full transition-all duration-300 cursor-pointer border border-transparent bg-white dark:bg-slate-800 hover:border-acento dark:hover:border-acento";
const CLASES_TEXTO_BASE = "flex-1 min-w-0 pr-4 break-all transition-all duration-300 text-gray-800 dark:text-gray-200";
const CLASES_CONTENEDOR_COMPLETADA = ["bg-gray-100", "dark:bg-slate-700", "opacity-60"];
const CLASES_CONTENEDOR_PENDIENTE = ["bg-white", "dark:bg-slate-800"];
const CLASES_TEXTO_COMPLETADA = ["line-through", "text-gray-400", "dark:text-gray-500"];
const CLASES_TEXTO_PENDIENTE = ["text-gray-800", "dark:text-gray-200"];
const MAX_CARACTERES_TAREA = 300;
const raizHTML = document.documentElement;

const MAX_UNDO_ACCIONES = 20;

const estadisticas = {
  total: document.getElementById("stat-total"),
  completadas: document.getElementById("stat-completadas"),
  pendientes: document.getElementById("stat-pendientes"),
};

// ESTADOS DE RED
const indicadorCarga = document.getElementById("indicador-carga");
const mensajeErrorRed = document.getElementById("mensaje-error-red");

const mostrarCargando = () => {
  if (indicadorCarga) indicadorCarga.style.display = "block";
};

const ocultarCargando = () => {
  if (indicadorCarga) indicadorCarga.style.display = "none";
};

const mostrarErrorRed = (mensaje) => {
  if (!mensajeErrorRed) return;
  mensajeErrorRed.textContent = mensaje;
  mensajeErrorRed.style.display = "block";
};

const ocultarErrorRed = () => {
  if (mensajeErrorRed) mensajeErrorRed.style.display = "none";
};

const SELECTOR_TAREA_ITEM = ".lista-propuestas .tarea-item";

/**
 * Devuelve todos los elementos DOM de tareas actuales.
 * @returns {HTMLElement[]} Lista de nodos de tarea.
 */
const obtenerTareasDom = () => Array.from(document.querySelectorAll(SELECTOR_TAREA_ITEM));

/**
 * Genera un id corto para tareas.
 * @returns {string}
 */
function generarIdTarea() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Obtiene información estructurada de una tarea a partir de su nodo.
 * @param {HTMLElement} tareaElemento - Contenedor de la tarea.
 * @returns {{ span: HTMLSpanElement, texto: string, estaCompletada: boolean, id: string }}
 */
function obtenerEstadoDeTarea(tareaElemento) {
  const span = tareaElemento.querySelector("span");
  const texto = span.textContent;
  const estaCompletada = span.classList.contains("line-through");
  const id = tareaElemento.dataset.id || "";

  return { span, texto, estaCompletada, id };
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
 * Valida el texto de la tarea según longitud.
 * @param {string} texto
 * @param {{ max?: number }} [opciones]
 * @returns {{ ok: boolean, error?: string, length: number, max: number }}
 */
function validarTextoTarea(texto, opciones = {}) {
  const max = typeof opciones.max === "number" && opciones.max > 0 ? opciones.max : MAX_CARACTERES_TAREA;
  const limpio = texto ?? "";
  const length = limpio.trim().length;

  if (!length) {
    return {
      ok: false,
      error: "Escribe una propuesta antes de añadirla.",
      length,
      max,
    };
  }

  if (length > max) {
    return {
      ok: false,
      error: `Has superado el límite de ${max} caracteres (${length}).`,
      length,
      max,
    };
  }

  return { ok: true, length, max };
}

/**
 * Refleja en la interfaz el resultado de la validación del textarea.
 * @param {{ ok: boolean, error?: string, length: number, max: number }} resultado
 */
function actualizarUIValidacionTarea(resultado) {
  if (contadorTarea) {
    contadorTarea.textContent = `${resultado.length} / ${resultado.max}`;
    const tieneError = !resultado.ok;
    contadorTarea.classList.toggle("text-white", !tieneError);
    contadorTarea.classList.toggle("dark:text-white", !tieneError);
  }

  if (mensajeErrorTarea) {
    if (!resultado.ok && resultado.error) {
      mensajeErrorTarea.textContent = resultado.error;
      mensajeErrorTarea.classList.remove("opacity-0");
    } else {
      mensajeErrorTarea.textContent = "";
      mensajeErrorTarea.classList.add("opacity-0");
    }
  }
}

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

function cargarUndoStack() {
  return [];
}

function guardarUndoStack(stack) {}

let undoStack = cargarUndoStack();

function actualizarUIUndo() {
  if (!botonDeshacer) return;
  botonDeshacer.disabled = undoStack.length === 0;
}

function pushUndo(accion) {
  undoStack.unshift(accion);
  undoStack = undoStack.slice(0, MAX_UNDO_ACCIONES);
  guardarUndoStack(undoStack);
  actualizarUIUndo();
}

function popUndo() {
  const accion = undoStack.shift();
  guardarUndoStack(undoStack);
  actualizarUIUndo();
  return accion;
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

// AUTO-RESIZE TEXTAREA + VALIDACIÓN EN TIEMPO REAL
textareaPropuesta.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = `${this.scrollHeight}px`;

  const resultado = validarTextoTarea(this.value, { max: MAX_CARACTERES_TAREA });
  actualizarUIValidacionTarea(resultado);
});

// === NUEVO EVENTO: ENVIAR CON ENTER (¡Va por separado!) ===
textareaPropuesta.addEventListener("keydown", function(event) {

    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        formularioTareas.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); 
    }
});

// Estado inicial de contador/validación
actualizarUIValidacionTarea(validarTextoTarea(textareaPropuesta.value || "", { max: MAX_CARACTERES_TAREA }));
actualizarUIUndo();

// RECUPERACIÓN DE ELEMENTOS (Al cargar la página)
document.addEventListener("DOMContentLoaded", () => {
  cargarTareasDeStorage();
});

// ESCUCHA DE EVENTOS (Añadir tarea)
formularioTareas.addEventListener("submit", async (event) => {
  event.preventDefault();

  const texto = textareaPropuesta.value || "";
  const resultado = validarTextoTarea(texto, { max: MAX_CARACTERES_TAREA });
  actualizarUIValidacionTarea(resultado);

  if (!resultado.ok) {
    textareaPropuesta.focus();
    return;
  }

  const textoLimpio = texto.trim();
  mostrarCargando();
  ocultarErrorRed();

  try {
    const nuevaTarea = await crearTarea(textoLimpio, 1);
    crearElemento({ ...nuevaTarea, texto: nuevaTarea.titulo});

    textareaPropuesta.value = "";
    textareaPropuesta.style.height = "auto";
    actualizarUIValidacionTarea(validarTextoTarea("", { max: MAX_CARACTERES_TAREA }));
    guardarTareas();
  } catch (error) {
    mostrarErrorRed(error.message || "No se pudo crear la tarea.");
  } finally {
    ocultarCargando();
  }
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
  const tareas = obtenerTareasDom();
  if (tareas.length === 0) return;

  const antes = tareas.map((tarea) => {
    const { id, estaCompletada } = obtenerEstadoDeTarea(tarea);
    return { id, completada: estaCompletada };
  });

  // Si ya están todas completadas, no hacemos nada (ni guardamos undo)
  const yaTodas = antes.every((t) => t.completada);
  if (yaTodas) return;

  pushUndo({ type: "mark_all_completed", before: antes, at: Date.now() });
  tareas.forEach((tarea) => marcarTarea(tarea, true));
  guardarTareas();
});

// ELIMINAR TODAS LAS PROPUESTAS MARCADAS COMO COMPLETADAS
botonBorrarCompletadas.addEventListener("click", () => {
  const tareas = obtenerTareasDom();
  const completadas = tareas
    .map((tarea, index) => ({ tarea, index, estado: obtenerEstadoDeTarea(tarea) }))
    .filter((x) => x.estado.estaCompletada);
  if (completadas.length === 0) return;

  const confirmado = confirmarEliminacion({ modo: "completadas", cantidad: completadas.length });
  if (!confirmado) return;

  // Guardamos undo con datos + posición original
  pushUndo({
    type: "delete_completed",
    items: completadas.map((x) => ({
      id: x.estado.id,
      texto: x.estado.texto,
      completada: x.estado.estaCompletada,
      index: x.index,
    })),
    at: Date.now(),
  });

  completadas.forEach((x) => x.tarea.remove());
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
async function cargarTareasDeStorage() {
  ocultarErrorRed();
  mostrarCargando();

  try {
    const tareas = await obtenerTareas();
    tareas.forEach((tarea) => crearElemento(tarea));
    actualizarEstadisticas(tareas.length, tareas.filter((t) => t.completada).length);
  } catch (error) {
    mostrarErrorRed("No se pudieron cargar las tareas. ¿Está el servidor encendido?");
  } finally {
    ocultarCargando();
  }
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
 * @param {{ id: string, texto: string, completada: boolean }} tareaObj - Datos de la tarea.
 * @param {{ insertIndex?: number }} [opciones]
 */
function crearElemento(tareaObj, opciones = {}) {
  const nuevaTarea = document.createElement("div");

  const estaCompletada = Boolean(tareaObj.completada);
  nuevaTarea.className = CLASES_CONTENEDOR_BASE;
  nuevaTarea.dataset.id = tareaObj.id;

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
  botonEliminar.addEventListener("click", async (event) => {
  event.stopPropagation();
  const { texto, id, estaCompletada } = obtenerEstadoDeTarea(nuevaTarea);
  const confirmado = confirmarEliminacion({ modo: "una", textoTarea: texto });
  if (!confirmado) return;

  const index = obtenerTareasDom().indexOf(nuevaTarea);
  pushUndo({
    type: "delete_one",
    item: { id, texto, completada: estaCompletada, index },
    at: Date.now(),
  });

  mostrarCargando();
  ocultarErrorRed();

  try {
    await eliminarTarea(id);
    nuevaTarea.remove();
    guardarTareas();
  } catch (error) {
    mostrarErrorRed("No se pudo eliminar la tarea.");
    popUndo();
  } finally {
    ocultarCargando();
  }
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

  const insertIndex = Number.isFinite(opciones.insertIndex) ? opciones.insertIndex : undefined;
  const children = Array.from(listaPropuestas.children);
  if (insertIndex === undefined || insertIndex < 0 || insertIndex >= children.length) {
    listaPropuestas.appendChild(nuevaTarea);
  } else {
    listaPropuestas.insertBefore(nuevaTarea, children[insertIndex]);
  }
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

function guardarTareas() {
  let completadas = 0;
  const total = obtenerTareasDom().length;

  obtenerTareasDom().forEach((tarea) => {
    const { estaCompletada } = obtenerEstadoDeTarea(tarea);
    if (estaCompletada) completadas++;
  });

  actualizarEstadisticas(total, completadas);
}

/**
 * Devuelve tareas normalizadas a partir de un array cualquiera.
 * Acepta formato antiguo (string) y nuevo (objeto).
 * @param {any[]} array
 * @returns {{ id: string, texto: string, completada: boolean }[]}
 */
function normalizarTareas(array) {
  if (!Array.isArray(array)) return [];

  const normalizadas = [];
  array.forEach((item) => {
    if (typeof item === "string") {
      const texto = item.trim();
      if (!texto) return;
      normalizadas.push({ id: generarIdTarea(), texto, completada: false });
      return;
    }

    if (item && typeof item === "object") {
      const texto = String(item.texto ?? "").trim();
      if (!texto) return;
      normalizadas.push({
        id: String(item.id || generarIdTarea()),
        texto,
        completada: Boolean(item.completada),
      });
    }
  });

  return normalizadas;
}

function exportarTareasComoJSON() {
  const tareas = obtenerTareasDom().map((tarea) => {
    const { id, texto, estaCompletada } = obtenerEstadoDeTarea(tarea);
    return { id, texto, completada: estaCompletada };
  });

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: "Ikeadocs",
    tareas,
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tareas-mkt23-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  return jsonString;
}

/**
 * Importa tareas desde un string JSON.
 * Reemplaza la lista actual tras confirmación.
 * @param {string} jsonString
 * @returns {{ ok: boolean, error?: string, imported?: number }}
 */
function importarTareasDesdeJSON(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { ok: false, error: "El archivo no es un JSON válido." };
  }

  const rawTareas = Array.isArray(parsed) ? parsed : parsed?.tareas;
  const tareas = normalizarTareas(rawTareas);
  
  if (tareas.length === 0) return { ok: false, error: "No se encontraron tareas válidas para importar." };

  const confirmado = window.confirm(
    `Se van a importar ${tareas.length} tarea${tareas.length === 1 ? "" : "s"} y se reemplazará la lista actual.\n\n¿Continuar?`
  );
  if (!confirmado) return { ok: false, error: "Importación cancelada." };

  obtenerTareasDom().forEach((t) => t.remove());

  undoStack = [];
  guardarUndoStack(undoStack);
  actualizarUIUndo();
  
  tareas.forEach((t) => crearElemento(t));
  guardarTareas();

  return { ok: true, imported: tareas.length };
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

/**
 * Deshace la última acción registrada (borrado o marcar todas).
 */
function deshacerUltimaAccion() {
  const accion = popUndo();
  if (!accion) return;

  if (accion.type === "delete_one" && accion.item) {
    const { id, texto, completada, index } = accion.item;
    crearElemento({ id: id || generarIdTarea(), texto, completada: Boolean(completada) }, { insertIndex: index });
    guardarTareas();
    return;
  }

  if (accion.type === "delete_completed" && Array.isArray(accion.items)) {
    // Insertamos en orden por índice para reconstruir posiciones
    const itemsOrdenados = [...accion.items].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    itemsOrdenados.forEach((item) => {
      crearElemento(
        { id: item.id || generarIdTarea(), texto: item.texto, completada: Boolean(item.completada) },
        { insertIndex: item.index }
      );
    });
    guardarTareas();
    return;
  }

  if (accion.type === "mark_all_completed" && Array.isArray(accion.before)) {
    const mapa = new Map(accion.before.map((x) => [x.id, Boolean(x.completada)]));
    obtenerTareasDom().forEach((tarea) => {
      const { id } = obtenerEstadoDeTarea(tarea);
      if (!id || !mapa.has(id)) return;
      marcarTarea(tarea, mapa.get(id));
    });
    guardarTareas();
    return;
  }
}

if (botonDeshacer) {
  botonDeshacer.addEventListener("click", () => {
    deshacerUltimaAccion();
  });
}

if (botonExportarJSON) {
  botonExportarJSON.addEventListener("click", () => {
    exportarTareasComoJSON();
  });
}

if (botonImportarJSON && inputImportarJSON) {
  botonImportarJSON.addEventListener("click", () => {
    inputImportarJSON.value = "";
    inputImportarJSON.click();
  });

  inputImportarJSON.addEventListener("change", async () => {
    const file = inputImportarJSON.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = importarTareasDesdeJSON(text);
      if (!res.ok) {
        // Cancelación también cae aquí; no es un error fatal.
        if (res.error && res.error !== "Importación cancelada.") window.alert(res.error);
        return;
      }
      window.alert(`Importación completada: ${res.imported} tarea${res.imported === 1 ? "" : "s"}.`);
    } catch {
      window.alert("No se pudo leer el archivo seleccionado.");
    }
  });
}