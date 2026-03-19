const taskService = require('../services/task.service');

const obtenerTareas = (req, res) => {
  const tareas = taskService.obtenerTodas();
  res.status(200).json(tareas);
};

const crearTarea = (req, res) => {
  const { titulo, prioridad } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
    return res.status(400).json({
      error: 'El título es obligatorio y debe tener al menos 3 caracteres.',
    });
  }

  if (typeof prioridad !== 'number' || prioridad < 1) {
    return res.status(400).json({
      error: 'La prioridad debe ser un número positivo.',
    });
  }

  const nuevaTarea = taskService.crearTarea({ titulo: titulo.trim(), prioridad });
  res.status(201).json(nuevaTarea);
};

const eliminarTarea = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número.' });
  }

  try {
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { obtenerTareas, crearTarea, eliminarTarea };