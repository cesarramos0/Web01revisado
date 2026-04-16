const globalStore = globalThis.__TASKS_STORE__ || {
  tasks: [],
  nextId: 1,
};

globalThis.__TASKS_STORE__ = globalStore;

function getTasks() {
  return globalStore.tasks;
}

function createTask({ titulo, prioridad }) {
  const nuevaTarea = {
    id: globalStore.nextId++,
    titulo,
    prioridad,
    completado: false,
  };

  globalStore.tasks.push(nuevaTarea);
  return nuevaTarea;
}

function deleteTask(id) {
  const idx = globalStore.tasks.findIndex((task) => task.id === id);
  if (idx === -1) return false;
  globalStore.tasks.splice(idx, 1);
  return true;
}

module.exports = {
  getTasks,
  createTask,
  deleteTask,
};
