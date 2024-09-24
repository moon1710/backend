//Spread
const mayoresEdad = [18, 23, 45, 32];
const menoresEdad = [15, 12, 17];
const mayoresEdad2 = [22, 50, ...mayoresEdad, 10, 20];
const edades = [...mayoresEdad2, ...menoresEdad];
//función sort
edadesSort = edades.sort();
console.log(edades, edadesSort);
