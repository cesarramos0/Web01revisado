const { Router } = require('express');
const taskController = require('../controllers/task.controller');

const router = Router();

router.get('/', taskController.obtenerTareas);
router.post('/', taskController.crearTarea);
router.delete('/:id', taskController.eliminarTarea);

module.exports = router;