// Array => Arreglo
// Declaramos un arreglo con 3 elementos iniciales: "Manzanas", "Kiwi" y "Fresa".
const frutas = ["Manzanas", "Kiwi", "Fresa"];

// Añadimos un nuevo elemento en el índice 5 del arreglo.
// Los índices 3 y 4 no están definidos, así que el arreglo tendrá espacios vacíos.
frutas[5] = "Mandarina";

// Añadimos otro nuevo elemento en el índice 7, dejando más espacios vacíos.
frutas[7] = "Limon";

// Intentamos acceder al índice 6, que no ha sido asignado.
// Por lo tanto, su valor es "undefined" (indefinido).
console.log(frutas[6]);
// Resultado: undefined

// El arreglo "frutas" ahora es:
// ["Manzanas", "Kiwi", "Fresa", <empty>, <empty>, "Mandarina", <empty>, "Limon"]
