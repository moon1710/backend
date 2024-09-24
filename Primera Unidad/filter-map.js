// Creamos un array llamado 'frutas' que contiene una lista de diferentes frutas.
const frutas = ["Manzanas", "Fresas", "Platano", "Kiwi", "naranja"];

// Creamos otro array llamado 'multiplosDiez' que contiene números múltiplos de diez.
const multiplosDiez = [10, 20, 30];

// Aquí utilizamos el método 'filter' para crear un nuevo array llamado 'mayoresDiez'.
// El método 'filter' recorre cada elemento del array 'multiplosDiez' y aplica una condición.
// En este caso, la condición es que el número sea mayor que 10.
const mayoresDiez = multiplosDiez.filter((numero) => numero > 10);

// Mostramos en la consola el array 'mayoresDiez'.
// Solo los números que cumplen la condición (> 10) serán incluidos en este nuevo array.
console.log(mayoresDiez); // Resultado: [20, 30]

// En este bloque hacemos algo similar, pero ahora filtramos para obtener los números que son iguales a 24.
// La función de filtro recorre cada elemento, pero ninguno cumple la condición de ser igual a 24.
const mayoresDiezII = multiplosDiez.filter((numero) => numero == 24);

// Esta línea no imprime nada porque no hay un 'console.log', pero si lo agregáramos...
// console.log(mayoresDiezII); // Resultado: []

// Ahora usamos el método 'map' para crear un nuevo array llamado 'mitades'.
// 'map' recorre cada elemento del array 'multiplosDiez' y aplica una operación.
// En este caso, estamos dividiendo cada número por 2.
const mitades = multiplosDiez.map((multiplo) => multiplo / 2);

// Mostramos en la consola el array original 'multiplosDiez' y el array resultante 'mitades'.
// Verás que 'multiplosDiez' permanece igual, pero 'mitades' contiene los números divididos por 2.
console.log(multiplosDiez, mitades); // Resultado: [10, 20, 30], [5, 10, 15]

// Este bloque está comentado, pero si se ejecutara, recorrería el array 'frutas'.
// Usando 'map', imprimiría cada fruta en la consola y luego retornaría un nuevo array.
// El nuevo array contendría el resultado de la función 'console.log(frutas)', que en este caso sería 'undefined'.
// Para que se impriman las frutas en la consola, puedes descomentar esta línea.
// const frutas2 = frutas.map((frutas) => {console.log(frutas)});

// Ahora, veamos un ejemplo de comparación con '==' y '===':
// La comparación con '==' verifica si los valores son iguales, sin importar el tipo de datos.
// Aquí, 5 y "5" se consideran iguales porque '==' convierte el string "5" en el número 5 antes de compararlos.
console.log(5 == "5"); // Resultado: true

// La comparación con '===' es más estricta: verifica tanto el valor como el tipo de dato.
// Aquí, 5 (número) y "5" (cadena de texto) son diferentes, así que la comparación es falsa.
console.log(5 === "5"); // Resultado: false
