export class Player {
    constructor(name, team) {
        this.name = name;
        this.team = team; // array de Pokémon
        this.activeIndex = 0; // Índice del Pokémon activo
    }

    get activePokemon() {
        return this.team[this.activeIndex];
    }

    set activePokemon(pokemon) {
        const index = this.team.findIndex(poke => poke === pokemon);
        if (index !== -1) {
            this.activeIndex = index;
        } else {
            console.log("Pokémon no encontrado en el equipo.");
        }
    }

    // Cambiar al siguiente Pokémon disponible
    switchPokemon(index) {
        if (index >= 0 && index < this.team.length && this.team[index].currentHealth > 0) {
            this.activeIndex = index;
            console.log(`${this.name} cambió a ${this.activePokemon.name}`);
        } else {
            console.log("No puedes cambiar a este Pokémon.");
        }
    }

    // Verifica si aún tiene algún Pokémon con vida
    hasAvailablePokemon() {
        return this.team.some(pokemon => pokemon.currentHealth > 0);
    }
}
