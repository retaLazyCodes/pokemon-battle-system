import { Pokedex } from './modules/pokedex.js';
import { Pokemon } from './modules/pokemon.js';
import { Player } from './modules/player.js';
import { Battle } from './modules/battle.js';
import { updateHealthBar, renderSwitchMenu, renderPokemon, createAttackButtons } from './utils.js';

async function startGame() {
    console.log('Iniciando juego...');

    // Generar 6 Pokémon aleatorios para cada jugador
    const playerTeam = await generateTeam();
    const enemyTeam = await generateTeam();

    console.log("Equipo del jugador:", playerTeam);
    console.log("Equipo del enemigo:", enemyTeam);

    const player1 = new Player("Jugador", playerTeam);
    const player2 = new Player("Enemigo", enemyTeam);
    
    console.log(player1.activePokemon)
    console.log(player2.activePokemon)

    const battle = Battle.getInstance(player1, player2, updateHealthBar);

    // Renderizar Pokémon y botones
    renderPokemon(player1.activePokemon, 'player-sprite', { frontImage: false });
    renderPokemon(player2.activePokemon, 'enemy-sprite', { frontImage: true });
    createAttackButtons(player1.activePokemon.moves);

    // Renderizar equipo para cambiar Pokémon
    renderSwitchMenu(player1);

    // Iniciar la batalla
    await battle.start();
}

// Generar un equipo de 6 Pokémon
async function generateTeam() {
    const team = [];
    for (let i = 0; i < 6; i++) {
        const data = await Pokedex.getRandomPokemon();
        const pokemon = new Pokemon(
            data.name, data.moves, data.types, data.images,
            data.stats.hp, data.stats.attack, data.stats.defense,
            data.stats.specialAttack, data.stats.specialDefense, data.stats.speed
        );
        team.push(pokemon);
    }
    return team;
}

// Ejecutar la función cuando la página cargue
document.addEventListener("DOMContentLoaded", startGame);