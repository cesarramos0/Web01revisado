# Experimentos y Pruebas de IA

## Introducción
Este archivo registra los experimentos realizados durante el desarrollo, incluyendo aquellos que no funcionaron a la primera, explicando cómo se iteró con la IA hasta encontrar la solución técnica definitiva.

Para este ejemplo decidí irme a mi terreno, Python. Evaluaremos una serie de problemas sacados nada más ni nada menos que de **CodeWars**, una web diseñada para rompernos la cabeza y mejorar nuestra lógica en programación.

Aclaro que la IA que utilizaré será **Claude** en su versión **Sonnet 4.6**.

---

## 1. 6 kyu — Multiples of 3 or 5

Si listamos todos los números naturales menores de 10 que son múltiplos de 3 o 5, obtenemos 3, 5, 6 y 9. La suma de estos múltiplos es 23.

Implementa una función que devuelva la suma de todos los múltiplos de 3 o 5 por debajo del número pasado. Si el número es negativo, devuelve 0.

**Mi solución:**
```python
def solution(number):
    return sum([number for number in range(1, number) if number%5 == 0 or number%3 == 0])
```

**Solución de la IA:**
```python
def solution(number):
    if number <= 0:
        return 0
    return sum(i for i in range(1, number) if i % 3 == 0 or i % 5 == 0)
```

**Conclusión:**
Tuve que pedírselo de diferentes maneras para que diese con el resultado correcto y pasara todos los tests. Aún así podría afirmar que lo hizo de manera más rápida de la que lo solucioné yo.

---

## 2. 5 kyu — The Hashtag Generator

El equipo de marketing dedica demasiado tiempo a escribir hashtags. Las reglas son:

- Debe comenzar con `#`.
- Todas las palabras deben tener su primera letra en mayúscula y las restantes en minúscula.
- Si el resultado final tiene más de 140 caracteres, devolver `False`.
- Si la entrada o el resultado es una cadena vacía, devolver `False`.

**Ejemplos:**
```
" Hello there thanks for trying my Kata"  =>  "#HelloThereThanksForTryingMyKata"
"    Hello     World   "                  =>  "#HelloWorld"
""                                        =>  False
```

**Mi solución:**
```python
def generate_hashtag(s):
    s = "".join([i.capitalize() for i in s.split(" ")])
    if len(s) > 140 or len(s) == 0:
        return False
    else:
        return "#"+s
```

**Solución de la IA:**
```python
def generate_hashtag(s):
    if not s.strip():
        return False
    
    result = "#" + "".join(word.capitalize() for word in s.split())
    
    return result if len(result) <= 140 else False
```

**Conclusión:**
La IA lo resolvió a la primera y pasó todos los tests. Lo hizo de una manera más rápida que yo y con un solo condicional.

---

## 3. 5 kyu — Count IP Addresses

Implementa una función que recibe dos direcciones IPv4 y devuelve el número de direcciones entre ellas (incluida la primera, excluyendo la última).

**Ejemplos:**
```
"10.0.0.0",  "10.0.0.50"  =>  50
"10.0.0.0",  "10.0.1.0"   =>  256
"20.0.0.10", "20.0.1.0"   =>  246
```

**Mi solución:**
```python
def ips_between(start, end):
    pr = [int(a) for a in start.split(".")]
    sc = [int(b) for b in end.split(".")]
    return ((1*sc[3])+(256*sc[2])+(pow(256,2)*sc[1])+(pow(256,3)*sc[0]))-((1*pr[3])+(256*pr[2])+(pow(256,2)*pr[1])+(pow(256,3)*pr[0]))
```

**Solución de la IA:**
```python
def ips_between(start, end):
    def ip_to_int(ip):
        parts = ip.split(".")
        return int(parts[0]) * 256**3 + int(parts[1]) * 256**2 + int(parts[2]) * 256 + int(parts[3])
    
    return ip_to_int(end) - ip_to_int(start)
```

**Conclusión:**
De nuevo la IA lo resolvió a la primera y pasó todos los tests. Lo hizo vertiginosamente más rápido.

---

## 4. 4 kyu — Hamming Numbers

Un número de Hamming es un entero positivo de la forma `2^i * 3^j * 5^k`, para algunos enteros no negativos `i`, `j` y `k`. Escribe una función que calcule el n-ésimo número de Hamming más pequeño.

**Ejemplos:**
```
n=1  =>  1  (2⁰ * 3⁰ * 5⁰)
n=2  =>  2  (2¹ * 3⁰ * 5⁰)
n=3  =>  3  (2⁰ * 3¹ * 5⁰)
n=4  =>  4  (2² * 3⁰ * 5⁰)
n=5  =>  5  (2⁰ * 3⁰ * 5¹)
```

**Mi solución:**
```python
def hamming(n):
    h = [1] * n
    i2, i3, i5 = 0, 0, 0
    next2, next3, next5 = 2, 3, 5
    
    for i in range(1, n):
        next_hamming = min(next2, next3, next5)
        h[i] = next_hamming
        
        if next_hamming == next2:
            i2 += 1
            next2 = h[i2] * 2
        if next_hamming == next3:
            i3 += 1
            next3 = h[i3] * 3
        if next_hamming == next5:
            i5 += 1
            next5 = h[i5] * 5

    return h[-1]
```

**Solución de la IA:**
```python
def hamming(n):
    h = [1] * n
    i2 = i3 = i5 = 0
    
    for i in range(1, n):
        next2 = h[i2] * 2
        next3 = h[i3] * 3
        next5 = h[i5] * 5
        
        h[i] = min(next2, next3, next5)
        
        if h[i] == next2: i2 += 1
        if h[i] == next3: i3 += 1
        if h[i] == next5: i5 += 1
    
    return h[n - 1]
```

**Conclusión:**
Sorprendentemente la IA lo resolvió a la primera y pasó todos los tests. Aquí sí que pasé tiempo pensando y la IA lo hizo en un abrir y cerrar de ojos.

---

## 5. 5 kyu — Extract the Domain Name from a URL

Implementa una función que dado un URL como cadena, extraiga únicamente el nombre de dominio.

**Ejemplos:**
```
"http://github.com/carbonfive/raygun"  =>  "github"
"http://www.zombie-bites.com"          =>  "zombie-bites"
"https://www.cnet.com"                 =>  "cnet"
```

**Mi solución:**
```python
def domain_name(url):
    url = url.replace("http://", "")
    url = url.replace("https://", "")
    url = url.replace("www.", "")
    return url.split('.')[0]
```

**Solución de la IA:**
```python
def domain_name(url):
    url = url.replace("https://", "").replace("http://", "").replace("www.", "")
    return url.split(".")[0]
```

**Conclusión:**
Este era de los más sencillos, pero de igual manera la IA lo resolvió a la primera y de una manera impecable en cuanto a eficiencia.