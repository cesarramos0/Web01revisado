# taskflow-project
# 🪑 Ikeadocs - Lanzamiento MKT23

¡Bienvenido a **Ikeadocs**! Este proyecto es una landing page interactiva y moderna diseñada para el lanzamiento de la nueva mesa inteligente **MKT23**. El sitio combina un diseño limpio inspirado en la estética funcional con características dinámicas y gestión de estado local.

---

## ✨ Características Principales

* **🌓 Modo Oscuro Persistente:** Alternancia entre temas claro y oscuro con guardado automático en `localStorage`.
* **📋 Gestión de Propuestas (CRUD):** Los usuarios pueden añadir, visualizar y eliminar propuestas de mejora.
* **🔍 Buscador en Tiempo Real:** Filtro inteligente de propuestas mediante expresiones regulares para una búsqueda exacta.
* **📱 Diseño Totalmente Responsivo:** Optimizado para móviles, tablets y escritorio utilizando **Tailwind CSS 4.0**.
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

## 🧪 Pruebas de Software (Testing)

Se han realizado pruebas manuales para garantizar la estabilidad y el correcto funcionamiento de la aplicación en diversos escenarios críticos:

| Caso de Prueba | Acción Realizada | Resultado Esperado | Estado |
| :--- | :--- | :--- | :---: |
| **Lista Vacía** | Carga inicial de la aplicación sin datos previos. | La interfaz se muestra limpia y los contadores de estadísticas marcan 0. | ✅ |
| **Validación de Texto** | Intentar añadir una tarea sin escribir contenido. | El sistema bloquea la creación (mediante `trim()`) evitando tareas vacías. | ✅ |
| **Desbordamiento (Overflow)** | Añadir una tarea con una palabra de más de 200 caracteres. | El diseño se mantiene intacto gracias a `break-all` y `min-w-0`. | ✅ |
| **Gestión de Estados** | Marcar y desmarcar múltiples tareas como completadas. | El estilo visual cambia (tachado/opacidad) y las estadísticas se actualizan. | ✅ |
| **Persistencia** | Recargar la página (`F5`) tras modificar la lista. | Los datos se recuperan correctamente desde `localStorage`. | ✅ |
| **Limpieza Masiva** | Eliminar todas las tareas completadas mediante el botón global. | Solo se eliminan las tareas marcadas, recalculando el total. | ✅ |

### Resultados Finales
Tras las pruebas, se confirma que la gestión de memoria en el navegador es eficiente y el diseño es totalmente responsivo, adaptándose a contenidos inusuales sin romper la arquitectura visual.