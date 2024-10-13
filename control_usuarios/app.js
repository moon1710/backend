const express = require("express");
const app = express();

// Middleware para parsear JSON
app.use(express.json());

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
  {
    id: 3,
    nombre: "Ana",
    apellido: "García",
    email: "anagarcia@gmail.com",
  },
];

// Ruta principal
app.get("/", (req, res) => {
  console.log("Petición GET en la raíz /");
  res.status(200).send("Hola Mundo");
});

// POST para agregar un nuevo usuario
app.post("/usuarios", (req, res) => {
  const { nombre, apellido, email } = req.body;

  // Validación de campos vacíos
  if (!nombre || !apellido || !email) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Verificar si el correo ya existe
  const emailExiste = usuarios.some((usuario) => usuario.email === email);
  if (emailExiste) {
    return res.status(400).json({ error: "El correo ya está registrado" });
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    apellido,
    email,
  };

  usuarios.push(nuevoUsuario);
  console.log("Usuario agregado:", nuevoUsuario);

  res.status(201).json(nuevoUsuario); // Código 201 Created
});

// Ruta para obtener todos los usuarios
app.get("/usuarios", (req, res) => {
  console.log("Petición GET para /usuarios");
  res.status(200).json(usuarios);
});

// Ruta para obtener un usuario por ID
app.get("/usuarios/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    console.log("ID inválido recibido");
    return res.status(400).json({ error: "ID inválido, debe ser un número" });
  }

  const usuario = usuarios.find((u) => u.id === userId);
  if (usuario) {
    console.log(`Usuario encontrado: ${JSON.stringify(usuario)}`);
    res.status(200).json(usuario);
  } else {
    console.log(`Usuario con ID ${userId} no encontrado`);
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

// Ruta para actualizar un usuario (PUT)
app.put("/usuarios/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { nombre, apellido, email } = req.body;

  const usuario = usuarios.find((u) => u.id === userId);
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  if (!nombre || !apellido || !email) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  usuario.nombre = nombre;
  usuario.apellido = apellido;
  usuario.email = email;

  console.log("Usuario actualizado:", usuario);
  res.status(200).json(usuario);
});

// Ruta para eliminar un usuario
app.delete("/usuarios/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const usuarioIndex = usuarios.findIndex((u) => u.id === userId);

  if (usuarioIndex === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const usuarioEliminado = usuarios.splice(usuarioIndex, 1);
  console.log("Usuario eliminado:", usuarioEliminado);
  res.status(200).json({ message: "Usuario eliminado correctamente" });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
