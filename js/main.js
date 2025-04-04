import { Pokedex } from './modules/pokedex.js';
import { Pokemon } from './modules/pokemon.js';
import { Player } from './modules/player.js';
import { Battle } from './modules/battle.js';
import { 
    updateHealthBar,
    renderSwitchMenu,
    renderPokemon,
    createAttackButtons,
    displayTeams,
    capitalizeFirstLetter
} from './utils.js';

async function startGame() {
    console.log('Iniciando juego...');

    // Generar 6 Pokémon aleatorios para cada jugador
    const playerTeam = await generateTeam({revealTeam: true});
    const enemyTeam = await generateTeam({revealTeam: false});

    console.log("Equipo del jugador:", playerTeam);
    console.log("Equipo del enemigo:", enemyTeam);

    const player1 = new Player("Jugador", playerTeam);
    const player2 = new Player("Enemigo", enemyTeam);
    
    console.log(player1.activePokemon)
    console.log(player2.activePokemon)

    const battle = Battle.getInstance(player1, player2, updateHealthBar);

    // Renderizar Pokémon y botones
    renderPokemon(player1.activePokemon, 'player-sprite', 'player-name', { frontImage: false });
    renderPokemon(player2.activePokemon, 'enemy-sprite', 'enemy-name', { frontImage: true });
    createAttackButtons(player1.activePokemon.moves);
    displayTeams(playerTeam, enemyTeam, player1.activePokemon);

    // Renderizar equipo para cambiar Pokémon
    renderSwitchMenu(player1);

    // Iniciar la batalla
    await battle.start();
}

// Generar un equipo de 6 Pokémon en paralelo
async function generateTeam({ revealTeam = false } = {}) {
    const promises = Array.from({ length: 6 }, () => Pokedex.getRandomPokemon());
    const teamData = await Promise.all(promises);

    const team = teamData.map(data => {
        const name = capitalizeFirstLetter(data.name);
        return new Pokemon(
            name, data.moves, data.types, data.images, revealTeam,
            data.stats.hp, data.stats.attack, data.stats.defense,
            data.stats.specialAttack, data.stats.specialDefense, data.stats.speed
        );
    });

    return team;
}

document.addEventListener("DOMContentLoaded", startGame);