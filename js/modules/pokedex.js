export class Pokedex {
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
    
        // Obtener tipos del Pokémon
        const types = data.types.map(typeInfo => typeInfo.type.name);
    
        // Obtener estadísticas base (HP, Ataque, Defensa, Ataque Especial, Defensa Especial, Velocidad)
        const stats = {
            hp: data.stats.find(stat => stat.stat.name === "hp").base_stat,
            attack: data.stats.find(stat => stat.stat.name === "attack").base_stat,
            defense: data.stats.find(stat => stat.stat.name === "defense").base_stat,
            specialAttack: data.stats.find(stat => stat.stat.name === "special-attack").base_stat,
            specialDefense: data.stats.find(stat => stat.stat.name === "special-defense").base_stat,
            speed: data.stats.find(stat => stat.stat.name === "speed").base_stat
        };
    
        return {
            name: data.name,
            types: types,
            stats: stats,
            moves: selectedMoves,
            images: {
                front: data.sprites.other["showdown"].front_default,
                back: data.sprites.other["showdown"].back_default
            }
        };
    }
    
};