const { request, response } = require("express");
const pool = require("../db/connection");
const pokemonsModel = require("../models/pokemons");
//   getAllPokemons,
//   getAllPokemonById,
//   get3RandomPokemons,
//   createPokemon,
//   updatePokemon,
//   deletePokemon,

const getAllPokemons = async (req = request, res = response) => {
  let conn;

  try {

    conn = await pool.getConnection();
    const pokemons = await conn.query(pokemonsModel.getAll);
    res.send(pokemons)
  } catch (err) {
    res.status(500).json(err);
    return;
  } finally {
    if (conn) conn.end();
  }
};

const getAllPokemonById = async (req = request, res = response) => {};

const get3RandomPokemons = async (req = request, res = response) => {};

const createPokemon = async (req = request, res = response) => {};

const updatePokemon = async (req = request, res = response) => {};

const deletePokemon = async (req = request, res = response) => {};
