const express = require("express");
const app = express();

const usuarios = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juanperez@gmail.com",
  },
  {
    id: 2,
    nombre: "Carlos",
    apellido: "Pérez",
    email: "carlosperez@gmail.com",
  },
];

// Ruta para la página principal
app.get("/", (req, res) => {
  console.log("Petición GET en la raíz /");
  res.status(200).send("Hola Mundo"); // Código 200 OK
});

// Ruta para obtener todos los usuarios
app.get("/usuarios", (req, res) => {
  console.log("Petición GET para /usuarios");
  res.status(200).json(usuarios); // Código 200 OK con JSON
});

// Ruta para obtener un usuario por ID
app.get("/usuarios/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    // Verificar si el ID es un número válido
    console.log("ID inválido recibido");
    return res.status(400).json({ error: "ID inválido, debe ser un número" }); // Código 400 Bad Request
  }

  console.log(`Buscando usuario con ID: ${userId}`);

  const usuario = usuarios.find((u) => u.id === userId);

  if (usuario) {
    console.log(`Usuario encontrado: ${JSON.stringify(usuario)}`);
    res.status(200).json(usuario); // Código 200 OK con JSON
  } else {
    console.log(`Usuario con ID ${userId} no encontrado`);
    res.status(404).json({ error: "Usuario no encontrado" }); // Código 404 Not Found
  }
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
