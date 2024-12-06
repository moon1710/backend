const pokemonSeeder = async () => {
    const pokemons = await fetch('https://pokeapi.co/api/v2/pokemon?offset=0limit=151').then(res => res.json());
    console.log(pokemons);
}

module.exports = pokemonSeeder;