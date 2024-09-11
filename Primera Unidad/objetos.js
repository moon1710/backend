const persona = {
  nombre: "Monserrat",
  apPaterno: "Lopez",
  apMaterno: "Caballero",
  edad: 20,
  activo: true,
  direccion: {
    calle: "Av. 5 de mayo",
    colonia: "centro",
    cp: "68300",
  },
  pasatiempos: ["videojuegos", "lectura", "musica"],

  // Método para nombre completo
  nombreCompleto: () =>
    persona.nombre + " " + persona.apPaterno + " " + persona.apMaterno,

  // Método para dirección completa con backticks para interpolación correcta
  direccionCompleta: () =>
    `Calle ${persona.direccion.calle}, Colonia ${persona.direccion.colonia}, CP: ${persona.direccion.cp}`,
};

// Llamada correcta a los métodos desde el objeto `persona`
console.log(persona.nombreCompleto())
console.log(persona.direccionCompleta())
