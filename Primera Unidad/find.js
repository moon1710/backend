const edades = [12, 15, 20, 15, 18, 20, 35];
const hayMayores = edades.find((edad) => edad > 17);
if (hayMayores) {
  //busca el obtiene el primer elemento que cumpla con  la condicion
  console.log("Hay personas mayores de edad " + hayMayores);
} else {
  console.log("No hay personas mayores de edad" + hayMayores);
}
