const { deleteTask } = require("./_store");

module.exports = (req, res) => {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Método no permitido." });
  }

  const parsed = Number.parseInt(req.query.id, 10);
  if (Number.isNaN(parsed)) {
    return res.status(400).json({ error: "El ID debe ser un número." });
  }

  const removed = deleteTask(parsed);
  if (!removed) {
    return res.status(404).json({ error: "Recurso no encontrado." });
  }

  return res.status(204).send();
};
