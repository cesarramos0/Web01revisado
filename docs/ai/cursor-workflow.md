## Flujo de Trabajo con Cursor

### Introducción
Este documento describe la integración del editor Cursor en el proceso de desarrollo. Se detalla cómo las funciones nativas de IA del editor (autocompletado, chat de contexto y predicción de código) han optimizado la escritura del código y la navegación por la estructura del proyecto de la lista de tareas.

### Atajos de Teclado

Los atajos más utilizados son:


| `Ctrl + K` | Escribir código desde cero o editar una sección |
| `Ctrl + L` | Abrir la barra lateral para hacer preguntas sobre el archivo o conjunto de ellos |
| `Ctrl + I` | Abrir el Composer para editar varios archivos a la vez |
| `Tab`      | Aceptar los autocompletados o sugerencias |

Otro comando menos utilizado pero igualmente útil:

| `Ctrl + B` | Ocultar o mostrar la barra lateral derecha |

### Optimización de Código JavaScript

Nada más instalar Cursor, lo primero fue pedirle ayuda para verificar y optimizar un problema en el código JavaScript. Ante la duda de si el código estaría bien optimizado dado que contiene muchas funciones interdependientes, se le solicitó que optimizase el archivo completo desde el chat integrado. Su respuesta fue:

> "Tu código ya está bastante bien estructurado; no hay errores gordos. Te dejo una versión optimizada y un poco más limpia, manteniendo exactamente el mismo comportamiento."

Al revisar los cambios, lo más significativo fue la introducción de **helpers**: pequeñas funciones de ayuda que realizan una tarea concreta y se reutilizan en varios puntos del código, mejorando notablemente la reutilización y legibilidad.

---

### Mejoras Estéticas de la Web

Cursor también ayudó a mejorar la estética de la web, proporcionando varios *tips* para darle un aspecto más profesional y cuidado. Tras revisarlos, se aplicó únicamente el que visualmente encajaba mejor.

#### Corrección del Hover en el Footer

Se detectó un pequeño error de diseño: al activar el hover sobre los elementos del footer (Total, Completadas, Pendientes), el texto se volvía blanco, haciéndolo prácticamente invisible al coincidir con el color de fondo.

**Solución:** cambiar el color del hover en los tres elementos.

De:
```css
hover:text-white
```

A:
```css
hover:text-gray-400 dark:hover:text-white
```

Con este cambio, en modo claro el texto sigue siendo visible y el efecto hover se mantiene correctamente.