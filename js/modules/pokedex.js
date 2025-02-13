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
    
        // Obtener tipos del Pokémon
        const types = data.types.map(typeInfo => typeInfo.type.name);
        
        const selectedMoves = await Pokedex.#getPokemonMoves(data, types);
    
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

    static async #getPokemonMoves(data, pokemonTypes) {
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

        // Filtrar solo movimientos físicos o especiales con potencia > 0
        const filteredMoves = moves.filter(move => 
            (move.category === "physical" || move.category === "special") && move.power > 0
        );

        // Separar movimientos STAB y no STAB
        const stabMoves = filteredMoves.filter(move => pokemonTypes.includes(move.type));
        const nonStabMoves = filteredMoves.filter(move => !pokemonTypes.includes(move.type));

        let selectedMoves = [];

        // Intentar seleccionar al menos un ataque de cada tipo del Pokémon
        pokemonTypes.forEach(type => {
            const movesOfType = stabMoves.filter(move => move.type === type);
            if (movesOfType.length > 0) {
                selectedMoves.push(movesOfType[Math.floor(Math.random() * movesOfType.length)]);
            }
        });

        // Completar hasta 4 movimientos con los restantes (mezclados)
        const remainingMoves = [...stabMoves, ...nonStabMoves]
            .filter(move => !selectedMoves.includes(move)) // Evitar duplicados
            .sort(() => Math.random() - 0.5); // Mezclar

        selectedMoves = [...selectedMoves, ...remainingMoves].slice(0, 4); // Tomar 4 movimientos

        return selectedMoves;
    }
    
};