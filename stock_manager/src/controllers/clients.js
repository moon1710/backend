const { request, response } = require("express");
const pool = require("../db/conection");
const { clientsQueries } = require("../models/clients");

// Función pa validar formato del RFC
const validateRfc = (rfc) =>
  /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc.trim().toUpperCase());

// Función pa validar correo electrónico
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Función pa num de teléfono
const validatePhoneNumber = (phone_number) => /^\d{10}$/.test(phone_number);

// Función pa genero
const validateGender = (gender) => ["M", "F"].includes(gender);

// Mostrar todos los clientes
const getAllClients = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const clients = await conn.query(clientsQueries.getAll);
    res.send(clients);
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Mostrar cliente por RFC
const getClientsByRfc = async (req = request, res = response) => {
  const { rfc } = req.params;

  if (!rfc || !validateRfc(rfc)) {
    res.status(400).send("RFC inválido o con formato incorrecto");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const clients_rfc = await conn.query(clientsQueries.getByRfc, [rfc]);

    if (clients_rfc.length === 0) {
      res.status(404).send("Cliente no encontrado con ese RFC");
      return;
    }
    res.send(clients_rfc);
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Crear cliente
const createClients = async (req = request, res = response) => {
  const {
    rfc,
    first_name,
    last_name,
    birth_date,
    gender,
    phone_number,
    email,
    address,
  } = req.body;

  if (
    !rfc ||
    !first_name ||
    !last_name ||
    !birth_date ||
    !gender ||
    !phone_number ||
    !email ||
    !address
  ) {
    res.status(400).send("Faltan campos obligatorios");
    return;
  }

  if (!validateRfc(rfc)) {
    res.status(400).send("RFC con formato inválido");
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

  let conn;
  try {
    conn = await pool.getConnection();

    const clients_rfc = await conn.query(clientsQueries.getByRfc, [rfc]);
    if (clients_rfc.length > 0) {
      res.status(409).send("El RFC ya está registrado");
      return;
    }

    const clients_email = await conn.query(clientsQueries.getByEmail, [email]);
    if (clients_email.length > 0) {
      res.status(409).send("El correo electrónico ya está registrado");
      return;
    }

    const newClients = await conn.query(clientsQueries.create, [
      rfc,
      first_name,
      last_name,
      birth_date,
      gender,
      phone_number,
      email,
      address,
    ]);

    if (newClients.affectedRows === 0) {
      res.status(500).send("El cliente no se pudo crear");
      return;
    }
    res.status(201).send("Cliente creado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Actualizar cliente
const updateClients = async (req = request, res = response) => {
  const { rfc } = req.params;
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    phone_number,
    email,
    address,
  } = req.body;

  if (!rfc || !validateRfc(rfc)) {
    res.status(400).send("RFC inválido o con formato incorrecto");
    return;
  }

  if (
    !first_name ||
    !last_name ||
    !birth_date ||
    !gender ||
    !phone_number ||
    !email ||
    !address
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

  let conn;
  try {
    conn = await pool.getConnection();

    const clients_rfc = await conn.query(clientsQueries.getByRfc, [rfc]);
    if (clients_rfc.length === 0) {
      res.status(404).send("Cliente no encontrado con ese RFC");
      return;
    }

    const clients_email = await conn.query(clientsQueries.getByEmail, [email]);
    if (clients_email.length > 0 && clients_email[0].rfc !== rfc) {
      res.status(409).send("El correo electrónico pertenece a otro cliente");
      return;
    }

    const updatedClients = await conn.query(clientsQueries.update, [
      first_name,
      last_name,
      birth_date,
      gender,
      phone_number,
      email,
      address,
      rfc,
    ]);

    if (updatedClients.affectedRows === 0) {
      res.status(500).send("El cliente no se pudo actualizar");
      return;
    }

    res.status(200).send("Cliente actualizado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

// Eliminar cliente (lógico)
const deleteClients = async (req = request, res = response) => {
  const { rfc } = req.params;

  if (!rfc || !validateRfc(rfc)) {
    res.status(400).send("RFC inválido o con formato incorrecto");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const clients_rfc = await conn.query(clientsQueries.getByRfc, [rfc]);
    if (clients_rfc.length === 0) {
      res.status(404).send("Cliente no encontrado con ese RFC");
      return;
    }

    const deleteClients_one = await conn.query(clientsQueries.delete, [rfc]);
    if (deleteClients_one.affectedRows === 0) {
      res.status(500).send("El cliente no se pudo eliminar");
      return;
    }

    res.send("Cliente eliminado exitosamente");
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  getAllClients,
  getClientsByRfc,
  createClients,
  updateClients,
  deleteClients,
};
