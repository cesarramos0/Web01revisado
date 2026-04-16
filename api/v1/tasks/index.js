const { getTasks, createTask } = require("./_store");

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

module.exports = (req, res) => {
  if (req.method === "GET") {
    return res.status(200).json(getTasks());
  }

  if (req.method === "POST") {
    const body = parseBody(req);
    const { titulo, prioridad } = body;

    if (!titulo || typeof titulo !== "string" || titulo.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "El título es obligatorio y debe tener al menos 3 caracteres." });
    }

    if (typeof prioridad !== "number" || prioridad < 1) {
      return res.status(400).json({ error: "La prioridad debe ser un número positivo." });
    }

    const nuevaTarea = createTask({
      titulo: titulo.trim(),
      prioridad,
    });

    return res.status(201).json(nuevaTarea);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Método no permitido." });
};
