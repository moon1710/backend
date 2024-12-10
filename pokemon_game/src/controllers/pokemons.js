const { request, response } = require("express");
const pool = require("../db/connection");
const pokemonsModel = require("../models/pokemons");

const getAllPokemons = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const pokemons = await conn.query(pokemonsModel.getAll);
    res.json(pokemons);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener pokemons", details: err });
  } finally {
    if (conn) conn.end();
  }
};

const getPokemonById = async (req = request, res = response) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const [pokemon] = await conn.query(pokemonsModel.getById, [id]);
    if (!pokemon) {
      res.status(404).json({ message: "Pokemon no encontrado" });
      return;
    }
    res.json(pokemon);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al obtener el pokemon", details: err });
  } finally {
    if (conn) conn.end();
  }
};

const createPokemon = async (req = request, res = response) => {
  const { name, image } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(pokemonsModel.create, [name, image]);
    res.status(201).json({ message: "Pokemon creado", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Error al crear el pokemon", details: err });
  } finally {
    if (conn) conn.end();
  }
};

const updatePokemon = async (req = request, res = response) => {
  const { id } = req.params;
  const { name, image } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(pokemonsModel.update, [name, image, id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Pokemon no encontrado" });
      return;
    }
    res.json({ message: "Pokemon actualizado" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al actualizar el pokemon", details: err });
  } finally {
    if (conn) conn.end();
  }
};

const deletePokemon = async (req = request, res = response) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(pokemonsModel.delete, [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Pokemon no encontrado" });
      return;
    }
    res.json({ message: "Pokemon eliminado" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al eliminar el pokemon", details: err });
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  getAllPokemons,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon,
};
