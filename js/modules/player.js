export class Player {
    constructor(name, pokemon) {
        this.name = name;
        this.pokemon = pokemon;
    }

    get activePokemon() {
        return this.pokemon; // Actualmente solo usa un Pokémon
    }
}
