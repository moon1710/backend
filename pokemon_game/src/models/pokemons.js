const pokemonsModel = {
  getAll: "SELECT * FROM pokemons",
  getById: "SELECT * FROM pokemons WHERE id = ?",
  create: "INSERT INTO pokemons (name, image) VALUES (?, ?)",
  update: "UPDATE pokemons SET name = ?, image = ? WHERE id = ?",
  delete: "DELETE FROM pokemons WHERE id = ?",
};

module.exports = pokemonsModel;
