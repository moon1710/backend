const pokemonsModel = {
  getAll: "SELECT * FROM pokemons",
  getById: "SELECT * FROM pokemons WHERE id = ?",
  getByPokemonName: "SELECT * FROM pokemons WHERE name = ?",
  createPokemon: "INSERT INTO pokemons (name) VALUES(?)",
  updatePokemon: "UPDATE pokemons SET name = ? WHERE id = ?",
  deletePokemon: "DELETE FROM pokemons WHERE id = ?",
  get3Random: "SELECT * FROM pokemons ORDER BY RAND() LIMIT 3",
};

module.exports = pokemonsModel;
