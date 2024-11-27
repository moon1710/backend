const { request, response } = require("express");
const pool = require("../db/conection");
const { staffQueries } = require("../models/staff");

// Validaciones de campos específicos
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhoneNumber = (phone_number) => /^\d{10}$/.test(phone_number);
const validateGender = (gender) => ["M", "F"].includes(gender);

// Mostrar todos los miembros del staff
const getAllStaff = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const staff = await conn.query(staffQueries.getAll);
    res.send(staff);
  } catch (error) {
    res.status(500).send(error.message || "Error interno del servidor");
  } finally {
    if (conn) conn.end();
  }
};

// Mostrar un miembro del staff por ID
const getStaffById = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id) || +id <= 0) {
    res.status(400).send("ID inválido (debe ser un número positivo)");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const staffMember = await conn.query(staffQueries.getById, [+id]);

    if (staffMember.length === 0) {
      res.status(404).send("Miembro del staff no encontrado");
      return;
    }

    res.send(staffMember);
  } catch (error) {
    res.status(500).send(error.message || "Error interno del servidor");
  } finally {
    if (conn) conn.end();
  }
};

// Crear un nuevo miembro del staff
const createStaff = async (req = request, res = response) => {
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    phone_number,
    email,
    address,
    user_id,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !birth_date ||
    !gender ||
    !phone_number ||
    !email ||
    !address ||
    !user_id
  ) {
    res.status(400).send("Faltan campos obligatorios");
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).send("Correo electrónico inválido");
    return;
  }

  if (!validatePhoneNumber(phone_number)) {
    res.status(400).send("Número de teléfono inválido (debe tener 10 dígitos)");
    return;
  }

  if (!validateGender(gender)) {
    res.status(400).send("Género inválido (debe ser 'M' o 'F')");
    return;
  }

  if (isNaN(user_id) || +user_id <= 0) {
    res
      .status(400)
      .send("ID de usuario inválido (debe ser un número positivo)");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const existingEmail = await conn.query(staffQueries.getByEmail, [email]);
    if (existingEmail.length > 0) {
      res.status(409).send("El correo electrónico ya está registrado");
      return;
    }

    const newStaffMember = await conn.query(staffQueries.create, [
      first_name,
      last_name,
      birth_date,
      gender,
      phone_number,
      email,
      address,
      user_id,
    ]);

    if (newStaffMember.affectedRows === 0) {
      res.status(500).send("No se pudo crear el miembro del staff");
      return;
    }

    res.status(201).send("Miembro del staff creado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Error interno del servidor");
  } finally {
    if (conn) conn.end();
  }
};

// Actualizar un miembro del staff
const updateStaff = async (req = request, res = response) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    phone_number,
    email,
    address,
    user_id,
  } = req.body;

  if (isNaN(id) || +id <= 0) {
    res.status(400).send("ID inválido (debe ser un número positivo)");
    return;
  }

  if (
    !first_name ||
    !last_name ||
    !birth_date ||
    !gender ||
    !phone_number ||
    !email ||
    !address ||
    !user_id
  ) {
    res.status(400).send("Faltan campos obligatorios");
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).send("Correo electrónico inválido");
    return;
  }

  if (!validatePhoneNumber(phone_number)) {
    res.status(400).send("Número de teléfono inválido");
    return;
  }

  if (!validateGender(gender)) {
    res.status(400).send("Género inválido (debe ser 'M' o 'F')");
    return;
  }

  if (isNaN(user_id) || +user_id <= 0) {
    res
      .status(400)
      .send("ID de usuario inválido (debe ser un número positivo)");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const existingStaff = await conn.query(staffQueries.getById, [+id]);
    if (existingStaff.length === 0) {
      res.status(404).send("Miembro del staff no encontrado");
      return;
    }

    const updatedStaffMember = await conn.query(staffQueries.update, [
      first_name,
      last_name,
      birth_date,
      gender,
      phone_number,
      email,
      address,
      user_id,
      +id,
    ]);

    if (updatedStaffMember.affectedRows === 0) {
      res.status(500).send("No se pudo actualizar el miembro del staff");
      return;
    }

    res.status(200).send("Miembro del staff actualizado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Error interno del servidor");
  } finally {
    if (conn) conn.end();
  }
};

// Eliminar un miembro del staff
const deleteStaff = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id) || +id <= 0) {
    res.status(400).send("ID inválido (debe ser un número positivo)");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const existingStaff = await conn.query(staffQueries.getById, [+id]);
    if (existingStaff.length === 0) {
      res.status(404).send("Miembro del staff no encontrado");
      return;
    }

    const deletedStaff = await conn.query(staffQueries.delete, [+id]);
    if (deletedStaff.affectedRows === 0) {
      res.status(500).send("No se pudo eliminar el miembro del staff");
      return;
    }

    res.send("Miembro del staff eliminado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Error interno del servidor");
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
