// Declaramos una variable usando "var", tiene alcance global o de función.
var variableVar = "variable definida con Var";

// Declaramos una variable usando "let", tiene alcance de bloque.
let variableLet = "variable definida con Let";

// Imprimimos los valores actuales de las variables.
console.log("1._", variableLet, "-", variableVar);
// Resultado: '1._ variable definida con Let - variable definida con Var'

// Reasignamos nuevos valores a las variables.
variableVar = "Var";
variableLet = "Let";

// Imprimimos nuevamente para ver los nuevos valores.
console.log("2.-", variableLet, "-", variableVar);
// Resultado: '2.- Let - Var'

// Iniciamos un bloque if, el cual siempre será verdadero.
if (true) {
  // Reasignamos la variableVar. Al usar "var", esta reasignación afecta el valor global.
  var variableVar = "Var2";

  // Declaramos una nueva variableLet usando "let", pero esta variable solo existe dentro del bloque if.
  let variableLet = "Let2";

  // Imprimimos los valores dentro del bloque if.
  console.log("3._", variableLet, "-", variableVar);
  // Resultado: '3._ Let2 - Var2'
}

// Fuera del bloque if, variableLet sigue teniendo su valor original,
// pero variableVar fue modificada a nivel global en el bloque if.
console.log("4.-", variableLet, "-", variableVar);
// Resultado: '4.- Let - Var2'
