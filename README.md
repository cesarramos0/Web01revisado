# taskflow-project
# 🪑 Ikeadocs - Lanzamiento MKT23

¡Bienvenido a **Ikeadocs**! Este proyecto es una landing page interactiva y moderna diseñada para el lanzamiento de la nueva mesa inteligente **MKT23**. El sitio combina un diseño limpio inspirado en la estética funcional con características dinámicas y gestión de estado local.

---

## ✨ Características Principales

* **🌓 Modo Oscuro Persistente:** Alternancia entre temas claro y oscuro con guardado automático en `localStorage`.
* **📋 Gestión de Propuestas (CRUD):** Los usuarios pueden añadir, visualizar y eliminar propuestas de mejora.
* **🔍 Buscador en Tiempo Real:** Filtro inteligente de propuestas mediante expresiones regulares para una búsqueda exacta.
* **📱 Diseño Totalmente Responsivo:** Optimizado para móviles, tablets y escritorio utilizando **Tailwind CSS 4.0**.
* **🏗️ Seguimiento de Fabricación:** Visualización del estado actual de producción de las primeras unidades.
* **💾 Persistencia de Datos:** Todas las propuestas se guardan en el navegador para que no se pierdan al recargar.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto ha sido desarrollado utilizando tecnologías web modernas:

| Tecnología | Uso |
| :--- | :--- |
| **HTML5** | Estructura semántica del sitio. |
| **Tailwind CSS 4.0** | Estilizado mediante variables de tema personalizadas y utilidades. |
| **JavaScript (ES6+)** | Lógica de la aplicación, manipulación del DOM y persistencia. |
| **LocalStorage** | Almacenamiento local de datos y preferencias de usuario. |

---

## 📦 Instalación y Configuración

Para visualizar el proyecto localmente, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/ikeadocs.git](https://github.com/tu-usuario/ikeadocs.git)
    ```
2.  **Instala Tailwind CSS:**
    Este proyecto utiliza la nueva versión de Tailwind. Asegúrate de tenerlo configurado o usa el CDN para pruebas rápidas. Para el flujo de trabajo estándar:
    ```bash
    npm install tailwindcss
    ```
3.  **Compila el CSS:**
    ```bash
    npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
    ```
4.  **Abre el archivo `index.html`** en tu navegador preferido.

---

## 📂 Estructura del Proyecto

* `index.html`: Estructura principal y componentes.
* `app.js`: Lógica de interactividad (Modo oscuro, gestión de tareas, buscadores).
* `dist/output.css`: Archivo CSS generado por Tailwind.
* `img/`: Directorio para imágenes y recursos visuales (logos, fotos de producto).

---

## 🚀 Funcionalidades destacadas en el código

### Buscador con RegEx
El sistema de búsqueda utiliza una expresión regular para asegurar que las coincidencias sean precisas palabra por palabra:
```javascript
const reglaExacta = new RegExp(`\\b${filtro}\\b`, 'i');
