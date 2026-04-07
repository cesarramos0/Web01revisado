# 🪑 Ikeadocs - Lanzamiento MKT23

Aplicación web full-stack para el lanzamiento de la mesa inteligente **MKT23**.
Combina una landing page interactiva con un sistema de gestión de propuestas
respaldado por una API REST construida con Node.js y Express.

---
https://bootcamp-project-pi.vercel.app/
---

## ✨ Características Principales

* **🌓 Modo Oscuro Persistente:** Alternancia entre temas claro y oscuro guardado en `localStorage`.
* **📋 Gestión de Propuestas (CRUD):** Crear, visualizar y eliminar propuestas mediante API REST.
* **🔄 Estados de red:** Indicadores visuales de carga y error en cada operación de red.
* **🗑️ Confirmación al Eliminar:** Diálogo de confirmación antes de eliminar una propuesta.
* **🔢 Contador de Caracteres:** Límite de caracteres con indicador visual en tiempo real.
* **📤 Export / Import de Tareas:** Copia de seguridad y restauración mediante JSON.
* **🔍 Buscador en Tiempo Real:** Filtro de propuestas mediante expresiones regulares.
* **📱 Diseño Totalmente Responsivo:** Optimizado para móviles, tablets y escritorio con Tailwind CSS 4.0.
* **↩️ Deshacer acciones:** Reversión de la última acción realizada sobre la lista.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
| :--- | :--- |
| **HTML5** | Estructura semántica del sitio. |
| **Tailwind CSS 4.0** | Estilizado mediante variables de tema y utilidades. |
| **JavaScript (ES6+)** | Lógica del frontend, manipulación del DOM y comunicación con la API. |
| **Node.js** | Entorno de ejecución del servidor backend. |
| **Express.js** | Framework para la construcción de la API REST. |
| **dotenv** | Gestión de variables de entorno. |
| **cors** | Gestión de cabeceras de seguridad de origen cruzado. |

---

## 📂 Estructura del Proyecto
```
ikeadocs/
├── server/                         # Backend: API REST
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js              # Validación de variables de entorno al arranque
│   │   ├── controllers/
│   │   │   └── task.controller.js  # Validación de entrada y traducción HTTP
│   │   ├── routes/
│   │   │   └── task.routes.js      # Mapeo de verbos HTTP a controladores
│   │   ├── services/
│   │   │   └── task.service.js     # Lógica de negocio pura, sin dependencia de HTTP
│   │   └── index.js                # Punto de entrada y registro de middlewares
│   ├── .env                        # Variables de entorno (no incluido en Git)
│   ├── .env.example                # Plantilla de variables requeridas
│   └── package.json
├── src/
│   └── api/
│       └── client.js               # Capa de red del frontend
├── dist/
│   └── output.css                  # CSS generado por Tailwind
├── img/                            # Imágenes y recursos visuales
├── app.js                          # Lógica del frontend
└── index.html                      # Estructura principal
```

---

## ⚙️ Middlewares

La API utiliza tres middlewares globales registrados en `index.js`:

**`cors()`** añade la cabecera `Access-Control-Allow-Origin` a cada respuesta,
permitiendo que el navegador acepte respuestas de un origen distinto al del
frontend. Sin este middleware, el navegador bloquearía todas las peticiones
del frontend al backend por la política de mismo origen.

**`express.json()`** intercepta el flujo de datos crudo de cada petición entrante,
parsea el cuerpo JSON y lo expone como objeto JavaScript en `req.body`. Sin él,
`req.body` sería `undefined` en todos los controladores.

**Middleware de errores `(err, req, res, next)`** captura cualquier error propagado
con `next(error)` desde los controladores. Traduce errores de dominio a códigos
HTTP semánticos (`NOT_FOUND` → 404) y evita filtrar trazas técnicas al cliente
devolviendo un mensaje genérico en los errores 500.

---

## 📦 Instalación y Configuración

### Requisitos previos
* Node.js 18 o superior
* npm

### Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

El servidor arrancará en `http://localhost:3000`.

### Frontend

Instala Tailwind y compila el CSS:
```bash
npm install tailwindcss
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

Abre `index.html` con Live Server.

---

## 🌐 Referencia de la API REST

Base URL: `http://localhost:3000/api/v1`

### Obtener todas las tareas
```
GET /tasks

Respuesta: 200 OK
[
  {
    "id": 1,
    "titulo": "Mi propuesta",
    "prioridad": 1,
    "completado": false
  }
]
```

### Crear una tarea
```
POST /tasks
Content-Type: application/json

{
  "titulo": "Mi propuesta",
  "prioridad": 1
}

Respuesta exitosa: 201 Created
{
  "id": 1,
  "titulo": "Mi propuesta",
  "prioridad": 1,
  "completado": false
}

Errores posibles:
400 Bad Request → { "error": "El título es obligatorio y debe tener al menos 3 caracteres." }
400 Bad Request → { "error": "La prioridad debe ser un número positivo." }
```

### Eliminar una tarea
```
DELETE /tasks/:id

Respuesta exitosa:  204 No Content
Tarea no encontrada: 404 Not Found → { "error": "Recurso no encontrado." }
ID no numérico:      400 Bad Request → { "error": "El ID debe ser un número." }
```

---

## 🧪 Pruebas de Integración

Colección de casos probados con Postman:

| Caso | Método | Body | Código esperado |
| :--- | :--- | :--- | :---: |
| Crear tarea correctamente | POST | `{ "titulo": "Comprar pan", "prioridad": 1 }` | 201 |
| Crear tarea sin título | POST | `{ "prioridad": 1 }` | 400 |
| Crear tarea con título corto | POST | `{ "titulo": "ab", "prioridad": 1 }` | 400 |
| Crear tarea con prioridad como texto | POST | `{ "titulo": "Comprar pan", "prioridad": "alta" }` | 400 |
| Obtener todas las tareas | GET | — | 200 |
| Eliminar tarea existente | DELETE | — | 204 |
| Eliminar tarea inexistente | DELETE | — | 404 |
| Eliminar con ID no numérico | DELETE | — | 400 |