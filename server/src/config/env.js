require('dotenv').config();

const VARIABLES_REQUERIDAS = ['PORT'];

VARIABLES_REQUERIDAS.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Variable de entorno requerida no definida: ${variable}`);
  }
});

module.exports = {
  PORT: process.env.PORT,
};