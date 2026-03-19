const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/tasks', taskRoutes);

app.listen(config.PORT, () => {
  console.log(`Servidor TaskFlow escuchando en http://localhost:${config.PORT}`);
});