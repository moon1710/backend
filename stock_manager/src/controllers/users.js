const { request, response } = require("express");
const pool = require("../db/conection");
const { userQueries } = require("../models/users");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// Validaciones específicas
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateUsername = (username) => /^[a-zA-Z0-9_-]{3,16}$/.test(username);
const validatePassword = (password) => password.length >= 6;

// Mostrar todos los usuarios
const getAllUsers = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const users = await conn.query(userQueries.getAll);
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Mostrar usuario por ID
const getUserById = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id) || +id <= 0) {
    res.status(400).send("ID inválido (debe ser un número positivo)");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const user = await conn.query(userQueries.getById, [+id]);

    if (user.length === 0) {
      res.status(404).send("Usuario no encontrado");
      return;
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Crear usuario
const createUser = async (req = request, res = response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).send("Faltan campos obligatorios");
    return;
  }

  if (!validateUsername(username)) {
    res
      .status(400)
      .send(
        "Nombre de usuario inválido (debe tener entre 3 y 16 caracteres alfanuméricos)"
      );
    return;
  }

  if (!validatePassword(password)) {
    res
      .status(400)
      .send("Contraseña inválida (debe tener al menos 6 caracteres)");
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).send("Correo electrónico inválido");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const existingUser = await conn.query(userQueries.getByUsername, [
      username,
    ]);

    if (existingUser.length > 0) {
      res.status(409).send("El nombre de usuario ya está en uso");
      return;
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await conn.query(userQueries.create, [
      username,
      hashPassword,
      email,
    ]);

    if (newUser.affectedRows === 0) {
      res.status(500).send("No se pudo crear el usuario");
      return;
    }

    res.status(201).send("Usuario creado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Iniciar sesión
const loginUser = async (req = request, res = response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .send("El nombre de usuario y la contraseña son obligatorios");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const user = await conn.query(userQueries.getByUsername, [username]);

    if (user.length === 0) {
      res.status(404).send("Nombre de usuario o contraseña incorrectos");
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (!passwordMatch) {
      res.status(403).send("Nombre de usuario o contraseña incorrectos");
      return;
    }

    res.send("Inicio de sesión exitoso");
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Actualizar usuario
const updateUser = async (req = request, res = response) => {
  const { id } = req.params;
  const { username, password, email } = req.body;

  if (isNaN(id) || +id <= 0) {
    res.status(400).send("ID inválido (debe ser un número positivo)");
    return;
  }

  if (!username || !password || !email) {
    res.status(400).send("Faltan campos obligatorios");
    return;
  }

  if (!validateUsername(username)) {
    res.status(400).send("Nombre de usuario inválido");
    return;
  }

  if (!validatePassword(password)) {
    res.status(400).send("Contraseña inválida");
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).send("Correo electrónico inválido");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const user = await conn.query(userQueries.getById, [id]);
    if (user.length === 0) {
      res.status(404).send("Usuario no encontrado");
      return;
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await conn.query(userQueries.updateUser, [
      username,
      hashPassword,
      email,
      +id,
    ]);

    if (updatedUser.affectedRows === 0) {
      res.status(500).send("No se pudo actualizar el usuario");
      return;
    }

    res.status(200).send("Usuario actualizado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Eliminar usuario
const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id) || +id <= 0) {
    res.status(400).send("ID inválido (debe ser un número positivo)");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const user = await conn.query(userQueries.getById, [+id]);

    if (user.length === 0) {
      res.status(404).send("Usuario no encontrado");
      return;
    }

    const deletedUser = await conn.query(userQueries.delete, [+id]);
    if (deletedUser.affectedRows === 0) {
      res.status(500).send("No se pudo eliminar el usuario");
      return;
    }

    res.send("Usuario eliminado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
};
