# Comparativa de Herramientas de IA

## Introducción

En este documento se analiza y compara el uso de diferentes modelos de inteligencia artificial (como ChatGPT, Gemini o Claude) utilizados durante el desarrollo del proyecto. El objetivo es evaluar cuál ha sido más eficaz para tareas específicas como la generación de lógica en JavaScript.

---

## Resolución y análisis de conceptos

### ¿Qué es un Closure?

**ChatGPT** es como ese libro de texto que compras porque te lo piden, pero que solo lees para pasar el examen. Te da la info técnica perfecta, pero no te hace "click" en el cerebro.

**Claude** se siente más como un video de YouTube de esos que te salvan la vida a las 3 de la mañana. Lo de la mochila literal me parece la mejor forma de entenderlo: la función se va de casa pero se lleva sus cosas guardadas.

**Lo que convenció de Claude:**
El ejemplo de la `cuentaBancaria` es el que realmente te sirve si estás armando algo real (como cuando usas Git y quieres que tus variables no se mezclen con las de otros). Te enseña a esconder datos, y eso en programación es oro.

---

### ¿Qué es el Event Loop?

**ChatGPT** es como el manual que te viene con la placa base: te dice las piezas, pero no te explica cómo fluye la corriente. Su ejemplo está bien para entender que el `2` sale después del `3`, pero hasta ahí llega.

**Claude** es el MVP aquí. ¿Por qué? Porque metió las **Microtareas**. Si usas Promises (que las vas a usar sí o sí con `fetch` o `async/await`), tienes que saber que tienen prioridad sobre el `setTimeout`. Si solo lees a GPT, vas a pensar que todo va a la misma cola, y ahí es donde explotará el código.

---

### ¿Qué es el DOM?

**ChatGPT** te da el mapa, pero **Claude te enseña a conducir**. GPT te explica cómo cambiar un color de fondo con `.style.backgroundColor`, lo cual está bien para empezar, pero en un proyecto de verdad eso es una mala práctica.

Claude menciona que el DOM es una **Web API**. Si intentas usar `document` en Node.js, te va a dar un error porque no existe. Que Claude te aclare eso te ahorra muchos dolores de cabeza en el futuro.

En el aspecto del `DocumentFragment`, si haces 1000 cambios al DOM uno por uno (como sugiere el ejemplo de GPT), la web se va a laggear. Hacerlo todo de una como dice Claude es la forma correcta de programar.

---

## Resolución y análisis de funciones

### Caso 1: `var` en bucles con `setTimeout`

```javascript
function contarHastaTres() {
  for (var i = 1; i <= 3; i++) {
    setTimeout(function() {
      console.log("Número: " + i);
    }, 1000);
  }
}

contarHastaTres();
// Lo que debería salir: 1, 2, 3
// Lo que sale: 4, 4, 4
```

**ChatGPT:** es como el manual de instrucciones. Es efectivo, pero si te preguntan por qué el `setTimeout` no se ejecutó en el momento, igual te quedas un poco en blanco.

**Claude:** te explica todo. Lo que más destaca es cómo desglosa el tiempo: mientras el bucle corre, el `setTimeout` está en la sala de espera, y para cuando sale, la variable ya se ha ido de fiesta y vale `4`. Entender ese "delay" es lo importante.

---

### Caso 2: `fetch` y asincronía mal gestionada

```javascript
function obtenerNombreUsuario() {
  let nombre;

  fetch('https://jsonplaceholder.typicode.com/users/1')
    .then(response => response.json())
    .then(data => {
      nombre = data.name;
    });

  return "El usuario es: " + nombre;
}

console.log(obtenerNombreUsuario());
// Error: El usuario sale como 'undefined'
```

**La línea de tiempo:** El esquema de los milisegundos (`1ms → 2ms → 200ms`) es la mejor forma de entender el Event Loop en la práctica. Te deja claro que JavaScript no se queda "congelado" esperando al servidor, sino que sigue a lo suyo.

**El "contagio" de la asincronía:** Esto es clave. Mucha gente arregla la función con `async`, pero luego la llama mal: `const nombre = obtenerNombreUsuario()`. Claude te avisa de que ahora toda la cadena tiene que ser asíncrona.

**Manejo de errores:** GPT asume que el servidor siempre va a responder bien. Claude sabe que en el mundo real el WiFi se cae o la API falla, y te enseña a usar el `try/catch`.

---

### Caso 3: `HTMLCollection` no es un array

```javascript
function pintarBotonesDeRojo() {
  // Supongamos que hay 3 botones en el HTML
  const botones = document.getElementsByTagName('button');

  botones.forEach(boton => {
    boton.style.color = 'red';
  });
}

pintarBotonesDeRojo();
// Error: "TypeError: botones.forEach is not a function"
```

**`querySelectorAll`:** Este es el punto clave. GPT te dice que conviertas el `HTMLCollection` a un array, pero Claude te dice: *"No te compliques, usa `querySelectorAll` que ya trae el `forEach` de serie"*. Eso es lo que escribiría alguien que sabe.

**Colecciones "Vivas" (Live Collections):** Claude avisa de un peligro real. Las `HTMLCollection` (las de `getElementsByTagName`) se actualizan solas si añades cosas al DOM. Eso te puede romper un bucle y volverte loco. GPT ni lo mencionó.

---

## Generando implementaciones a partir de lenguaje natural

### Ejercicio 1: Filtrar productos por categoría

> Crea una función que reciba un array de productos (cada uno con nombre, precio, categoría y stock). La función debe devolver un objeto que sume el valor total (precio × stock) de una categoría específica, pero solo de los productos que cuesten más de 50€ y que tengan stock disponible. Si la categoría no existe o no hay productos que cumplan, debe devolver 0.

**Claude:**

```javascript
function calcularValorCategoria(productos, categoria) {
  const total = productos
    .filter(p =>
      p.categoria === categoria &&
      p.precio > 50             &&
      p.stock > 0
    )
    .reduce((acumulado, p) => acumulado + (p.precio * p.stock), 0);

  return total;
}
```

**ChatGPT:**

```javascript
function obtenerValorCategoria(products, categoria) {
  // Filtrar los productos que pertenezcan a la categoría, tengan stock y cuesten más de 50€
  const productosFiltrados = products.filter(producto =>
    producto.categoria === categoria &&
    producto.precio > 50 &&
    producto.stock > 0
  );

  // Si no hay productos que cumplan, devolver 0
  if (productosFiltrados.length === 0) {
    return 0;
  }

  // Calcular el valor total de la categoría
  const valorTotal = productosFiltrados.reduce((total, producto) => {
    return total + (producto.precio * producto.stock);
  }, 0);

  return valorTotal;
}
```

**Veredicto: Gana Claude.** El código es más corto, hace exactamente lo mismo y no tiene lógica redundante. En una revisión de código (Code Review), a GPT le dirían: *"Quita ese `if`, no hace falta"* — cuando `reduce` sobre un array vacío ya devuelve `0` por defecto.

---

### Ejercicio 2: Formateador de tiempo humano

**Claude:** Más de 230 líneas de código — montó una app de React completa con estilos, casos de prueba y actualización en tiempo real.

**ChatGPT:**

```javascript
function formatearTiempoHumano(fecha) {
  const ahora = new Date();
  let diferencia = ahora - fecha;

  const segundos = Math.floor(diferencia / 1000);
  const minutos  = Math.floor(segundos / 60);
  const horas    = Math.floor(minutos / 60);
  const dias     = Math.floor(horas / 24);
  const semanas  = Math.floor(dias / 7);

  if (segundos < 60) return "Hace menos de un minuto";
  if (minutos  < 60) return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
  if (horas    < 24) return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  if (dias     <  7) return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;

  // ⚠️ BUG: Este bloque nunca se ejecuta
  if (semanas < 1) {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  return `Hace más de ${semanas} semanas`;
}
```

**Veredicto: Gana Claude.** GPT tiene un error de lógica al final: si los días son 7 o más, `semanas` siempre será ≥ 1, por lo que el bloque que formatea la fecha **nunca se ejecuta**. Es código muerto. Claude demostró atención al detalle (el caso de "Ayer"), siguió las instrucciones exactas sobre el formato de fecha y entregó un código mucho más robusto.

---

### Ejercicio 3: Fetch con superpoderes (Retry + Timeout)

**Claude:** Más de 230 líneas de código — montó una app de React completa con terminal interactivo, tres escenarios de prueba y actualización en vivo.

**ChatGPT:**

```javascript
async function fetchConSuperpoderes(url) {
  const MAX_RETRIES = 3;
  const TIMEOUT     = 5000;

  const hacerPeticion = async (reintentos) => {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) throw new Error('Error en la respuesta de la API');

      clearTimeout(timeoutId);
      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);

      if (reintentos <= 0) {
        throw new Error('La petición falló después de 3 intentos.');
      }

      console.log(`Reintentando... Intento ${MAX_RETRIES - reintentos + 1} de ${MAX_RETRIES}`);
      return hacerPeticion(reintentos - 1);
    }
  };

  return hacerPeticion(MAX_RETRIES);
}
```

**Veredicto: Gana Claude.** El código de GPT es funcional pero frágil: el timeout y los reintentos están hardcodeados, no hay exponential backoff, y el manejo del `clearTimeout` depende de que el `catch` lo limpie, lo que puede fallar si la respuesta no es `ok` pero tampoco lanza una excepción de red. Claude entregó una función configurable, con backoff exponencial y limpieza garantizada del temporizador.

---

## Conclusión

Ha sido un **"Perfect"** para Claude. En los tres retos demostró:

- **Mejor comprensión del contexto** — montó apps de React completas cuando el ejercicio lo merecía.
- **Patrones de diseño modernos** — Exponential Backoff, `AbortController` bien gestionado, `reduce` sin condicionales redundantes.
- **Atención al detalle** — plurales correctos en el tiempo, validación de tipos, el caso edge de "Ayer".

Nunca había usado Claude, pero está claro que le da unas vueltas a ChatGPT, al menos en lo que respecta a programación y lógica.

Viendo el resumen: **ChatGPT es como una "mini-Wikipedia"** que te explica, y **Claude se mete contigo a afrontar los problemas** y te da soluciones reales.
