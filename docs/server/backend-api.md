# Herramientas del ecosistema backend

## Axios

Librería HTTP para el navegador y Node.js que simplifica las peticiones de red
respecto a `fetch`. Sus ventajas principales son que lanza errores automáticamente
ante respuestas 4xx y 5xx (sin necesidad de comprobar `response.ok` manualmente),
transforma el JSON de forma automática tanto en el envío como en la recepción, y
permite configurar instancias con base URL y cabeceras por defecto, evitando
repetición en cada llamada.

Caso de uso típico: reemplazar `fetch` en el cliente cuando la API tiene muchos
endpoints y se necesita un manejo de errores centralizado y consistente.

---

## Postman

Herramienta gráfica para diseñar, probar y documentar APIs REST. Permite organizar
peticiones en colecciones, definir entornos con variables (desarrollo, producción),
escribir tests automatizados sobre las respuestas y generar documentación
exportable. Es el estándar de facto para la fase de pruebas de integración manual
antes de escribir tests automatizados.

Caso de uso típico: verificar el comportamiento de cada endpoint durante el
desarrollo y compartir la colección con el equipo como documentación viva de la API.

---

## Sentry

Plataforma de monitorización de errores en tiempo real para aplicaciones en
producción. Se integra en el servidor mediante un SDK que captura automáticamente
las excepciones no controladas, registra el stack trace completo, el contexto de
la petición y el historial de eventos que llevaron al error. Envía alertas al
equipo y agrupa errores similares para priorizar su resolución.

Caso de uso típico: sustituir los `console.error` del middleware global de errores
por llamadas a Sentry, garantizando que ningún fallo en producción pase
desapercibido y que el equipo pueda reproducirlo con contexto completo.

---

## Swagger (OpenAPI)

Estándar de especificación para describir APIs REST de forma legible tanto por
humanos como por máquinas. Mediante anotaciones en el código o un archivo YAML/JSON
independiente, genera automáticamente una interfaz web interactiva donde cualquier
desarrollador puede explorar los endpoints, ver los esquemas de datos esperados y
ejecutar peticiones de prueba sin necesidad de Postman.

Caso de uso típico: documentar una API pública o interna de forma que el equipo
de frontend pueda consumirla sin necesidad de preguntar al backend qué campos
acepta cada endpoint o qué códigos de error puede devolver.