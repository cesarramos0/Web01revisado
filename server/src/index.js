const express = require('express');
const cors = require('cors');
const config = require('./config/env');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(config.PORT, () => {
  console.log(`Servidor TaskFlow escuchando en http://localhost:${config.PORT}`);
});