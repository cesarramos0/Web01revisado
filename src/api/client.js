const API_URL = '/api/v1/tasks';

export const obtenerTareas = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('No se pudieron cargar las tareas.');
  }

  return response.json();
};

export const crearTarea = async (titulo, prioridad) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, prioridad }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'No se pudo crear la tarea.');
  }

  return response.json();
};

export const eliminarTarea = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar la tarea.');
  }
};