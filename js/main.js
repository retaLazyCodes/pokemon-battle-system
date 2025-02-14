import { Pokedex } from './modules/pokedex.js';
import { Pokemon } from './modules/pokemon.js';
import { Player } from './modules/player.js';
import { Battle } from './modules/battle.js';
import { updateUI } from './utils.js';

async function startGame() {
    console.log('Iniciando juego...');

    const playerPokemonData = await Pokedex.getRandomPokemon();
    const enemyPokemonData = await Pokedex.getRandomPokemon();

    const playerPokemon = new Pokemon(
        playerPokemonData.name,
        playerPokemonData.moves,
        playerPokemonData.types,
        playerPokemonData.images,
        playerPokemonData.stats.hp,
        playerPokemonData.stats.attack,
        playerPokemonData.stats.defense,
        playerPokemonData.stats.specialAttack,
        playerPokemonData.stats.specialDefense,
        playerPokemonData.stats.speed
    );

    const enemyPokemon = new Pokemon(
        enemyPokemonData.name,
        enemyPokemonData.moves,
        enemyPokemonData.types,
        enemyPokemonData.images,
        enemyPokemonData.stats.hp,
        enemyPokemonData.stats.attack,
        enemyPokemonData.stats.defense,
        enemyPokemonData.stats.specialAttack,
        enemyPokemonData.stats.specialDefense,
        enemyPokemonData.stats.speed
    );

    console.log(playerPokemon);
    console.log(enemyPokemon);

    const player1 = new Player("Jugador", playerPokemon);
    const player2 = new Player("Enemigo", enemyPokemon);

    const battle = new Battle(player1, player2, updateUI);

    // Renderizar Pokémon y botones
    renderPokemon(player1.activePokemon, 'player-sprite', { frontImage: false });
    renderPokemon(player2.activePokemon, 'enemy-sprite', { frontImage: true });
    createAttackButtons(player1.activePokemon.moves);

    // Iniciar la batalla
    await battle.start();
}

// Rederizar los Pokémon
function renderPokemon(pokemon, elementId, { frontImage = false }) {
    const imgElement = document.getElementById(elementId);
    imgElement.src = frontImage ? pokemon.images.front : pokemon.images.back;
    imgElement.alt = `Pokémon ${pokemon.name}`;
}

// Crear botones de ataques
function createAttackButtons(moves) {
    const attackSection = document.querySelector(".attack-buttons");
    attackSection.innerHTML = "";

    moves.forEach((move, index) => {
        const button = document.createElement("button");
        button.id = `attack${index + 1}`;
        button.className = `attack-btn ${move.type.name.toLowerCase()}`;
        button.textContent = move.name;
        attackSection.appendChild(button);
    });
}

// Ejecutar la función cuando la página cargue
document.addEventListener("DOMContentLoaded", startGame);
