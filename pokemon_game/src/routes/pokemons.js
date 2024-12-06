const { Router } = require("express");
const {
  getAllPokemons,
  getAllPokemonById,
  get3RandomPokemons,
  createPokemon,
  updatePokemon,
  deletePokemon,
} = require("../controllers/pokemons");

const routes = new Router();

routes.get("/", getAllPokemons); // Listar todos los pokemons
routes.post("/", createPokemon); // Crear un nuevo pokemon
routes.get("/:id", getAllPokemonById); // Obtener pokemon por ID
routes.put("/:id", updatePokemon); // Actualizar pokemon por ID
routes.delete("/:id", deletePokemon); // Eliminar pokemon por ID
routes.get("/play", get3RandomPokemons); // Obtener 3 pokemons aleatorios


module.exports = routes;
