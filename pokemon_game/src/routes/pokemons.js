const { Router } = require("express");
const {
  getAllPokemons,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon,
  get3RandomPokemons,
} = require("../controllers/pokemons");

const routes = new Router();

routes.get("/", getAllPokemons);

routes.get("/play", get3RandomPokemons);
routes.get("/:id", getPokemonById);

routes.post("/", createPokemon);

routes.put("/:id", updatePokemon);

routes.delete("/:id", deletePokemon);

module.exports = routes;
