const { Router } = require("express");
const {
  getAllPokemons,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon,
} = require("../controllers/pokemons");

const routes = new Router();

routes.get("/", getAllPokemons); // Obtener todos los pokemons
routes.get("/:id", getPokemonById); // Obtener un pokemon por ID
routes.post("/", createPokemon); // Crear un nuevo pokemon
routes.put("/:id", updatePokemon); // Actualizar un pokemon por ID
routes.delete("/:id", deletePokemon); // Eliminar un pokemon por ID

module.exports = routes;
