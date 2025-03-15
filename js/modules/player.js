export class Player {
    constructor(name, team) {
        this.name = name;
        this.team = team; // array de Pokémon
        this.activeIndex = 0; // Índice del Pokémon activo

        this.team[0].revealed = true;
    }

    get activePokemon() {
        return this.team[this.activeIndex];
    }

    // Cambiar al siguiente Pokémon disponible
    switchPokemon(index) {
        if (index == null) {
            this.activeIndex = this.activeIndex + 1;
            this.team[this.activeIndex].revealed = true;
            console.log(`${this.name} cambió a ${this.activePokemon.name}`);
        } else {
            if (index >= 0 && index < this.team.length && this.team[index].currentHealth > 0) {
                this.activeIndex = index;
                console.log(`${this.name} cambió a ${this.activePokemon.name}`);
            } else {
                console.log("No puedes cambiar a este Pokémon.");
            }
        }
    }

    // Verifica si aún tiene algún Pokémon con vida
    hasAvailablePokemon() {
        return this.team.some(pokemon => pokemon.currentHealth > 0);
    }
}
