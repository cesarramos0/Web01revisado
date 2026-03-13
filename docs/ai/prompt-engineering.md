# Ingeniería de Prompts

## Introducción
Aquí se documenta la estrategia seguida para interactuar con las IAs. Se incluyen ejemplos reales de prompts (instrucciones) utilizados para obtener funcionalidades complejas, como la persistencia de datos en LocalStorage, analizando cómo la claridad de las instrucciones influye en la calidad del código generado.

# Mis 10 Prompts de Cabecera para Programar

## 💻 Para Generar Código

**1. El Experto (Rol)**
> "Actúa como un desarrollador Senior. Escribe una función en JS para [TAREA]."
* *Por qué funciona:* Subes el nivel de la respuesta. La IA dejará de dar soluciones de principiante.

**2. Al Grano (Restricciones)**
> "Escribe el código para [TAREA]. Restricción: No me des explicaciones ni introducciones, devuélveme únicamente el código."
* *Por qué funciona:* Te ahorras leer información que en ese momento no necesitas. Ideal para actuar rápido.

**3. Consultas a la Base de Datos (Few-shot)**
> "Dame la consulta SQL para [TAREA]. Usa exactamente estos nombres de tablas y columnas: [LISTA_DE_TABLAS]."
* *Por qué funciona:* Evita que la IA se invente la estructura de la base de datos y dé el código que falla.

## 🛠️ Para Refactorizar y Mejorar

**4. Pensar antes de actuar (Paso a paso)**
> "Revisa este código: [CÓDIGO]. Antes de darme la solución, piensa paso a paso qué fallos tiene y cómo los vas a arreglar."
* *Por qué funciona:* Obligar a la IA a "pensar en voz alta" reduce muchísimo los errores lógicos.

**5. Clean Code (Rol)**
> "Actúa como un experto en Clean Code. Reescribe este código [CÓDIGO] para que sea más corto y fácil de leer."
* *Por qué funciona:* Aplica estándares de la industria para que tu código no parezca un espagueti.

**6. Cazar Bugs (Paso a paso)**
> "Tengo este error: [TEXTO_DEL_ERROR] en este código: [CÓDIGO]. Explica paso a paso por qué está fallando y dame el código corregido."
* *Por qué funciona:* Va a la raíz del problema en lugar de dar un parche que rompa otra cosa (importante).

## 📝 Para Documentar y Testear

**7. Clona mi estilo (Few-shot)**
> "Documenta esta función: [CÓDIGO]. Sigue exactamente este mismo formato de ejemplo: [TU_EJEMPLO_FAVORITO]."
* *Por qué funciona:* La IA imita tu forma de escribir, manteniendo todo el proyecto con el mismo estilo visual.

**8. Traductor para Jefes (Restricciones)**
> "Explica qué hace este código [CÓDIGO]. Restricción: Explícalo para que lo entienda alguien que no sabe programar. Prohibido usar hablar técnicamente."
* *Por qué funciona:* Da el resumen perfecto para poner en un ticket o enviar por correo a un cliente.

**9. Tests a Prueba de Balas (Restricciones)**
> "Escribe tests unitarios para este código [CÓDIGO]. Restricción: Debes incluir al menos un test donde la función falle y otro donde falten datos."
* *Por qué funciona:* Fuerza a la IA a probar los casos límite, no solo en lo bueno.

**10. El Resumen Exprés (Rol + Restricciones)**
> "Actúa como un profesor de programación. Resúmeme qué hace este código [CÓDIGO] en un máximo de 3 líneas."
* *Por qué funciona:* Perfecto cuando pasan un archivo inmenso y necesitas saber qué hace sin leerlo entero.