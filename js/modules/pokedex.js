class Pokedex {
    static async getRandomPokemon() {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=920");
        const data = await response.json();
        
        const randomPokemon = data.results[Math.floor(Math.random() * data.results.length)];
        
        console.log(`Pokémon seleccionado: ${randomPokemon.name} - ${randomPokemon.url}`);
        return {
            name: randomPokemon.name,
            url: randomPokemon.url
        }
    }

    static async getPokemonDetails(pokemonUrl) {
        const response = await fetch(pokemonUrl);
        const data = await response.json();
    
        // Obtener detalles de los movimientos
        const moves = await Promise.all(
            data.moves.map(async (move) => {
                const moveResponse = await fetch(move.move.url);
                const moveData = await moveResponse.json();
                return {
                    name: moveData.name,
                    category: moveData.damage_class.name, // "physical", "special", or "status"
                    power: moveData.power || 0, // Si no tiene potencia, poner 0
                    type: moveData.type.name
                };
            })
        );
    
        // Filtrar solo movimientos físicos o especiales
        const filteredMoves = moves.filter(move => move.category === "physical" || move.category === "special");
    
        // Seleccionar 4 movimientos al azar
        const selectedMoves = filteredMoves
            .sort(() => Math.random() - 0.5) // Mezclar los movimientos
            .slice(0, 4); // Tomar los primeros 4
    
        return {
            name: data.name,
            moves: selectedMoves,
            images: {
                front: data.sprites.other["showdown"].front_default,
                back: data.sprites.other["showdown"].back_default
            }
        };
    }
};

export { Pokedex };