import { Pokedex } from './modules/pokedex.js';
import { Pokemon } from './modules/pokemon.js';

console.log('working');

let turn = 0;


function attack(event, attacker, defender) {
	const selectedMove = event.target.id.split("attack")[1]
	const moveIndex = parseInt(selectedMove) -1;
	const move = attacker.getMove(moveIndex)
	console.log(`attacked with attack ${selectedMove}`);
	attacker.attack(defender, move)
}

const randomPokemon1 = await Pokedex.getRandomPokemon()
const randomPokemon2 = await Pokedex.getRandomPokemon()

const playerPokemon = await Pokedex.getPokemonDetails(randomPokemon1.url);
const enemyPokemon = await Pokedex.getPokemonDetails(randomPokemon2.url);

const poke1 = new Pokemon(
	playerPokemon.name,
	playerPokemon.moves,
	playerPokemon.types,
	playerPokemon.images,
	playerPokemon.stats.hp,
	playerPokemon.stats.attack,
	playerPokemon.stats.defense,
	playerPokemon.stats.specialAttack,
	playerPokemon.stats.specialDefense,
	playerPokemon.stats.speed
)
const poke2 = new Pokemon(
	enemyPokemon.name,
	enemyPokemon.moves,
	enemyPokemon.types,
	enemyPokemon.images,
	enemyPokemon.stats.hp,
	enemyPokemon.stats.attack,
	enemyPokemon.stats.defense,
	enemyPokemon.stats.specialAttack,
	enemyPokemon.stats.specialDefense,
	enemyPokemon.stats.speed
)
console.log(poke1)
console.log(poke2)

function renderPokemon(pokemon, elementId, { frontImage = false } ) {
	const imgElement = document.getElementById(elementId);
	if (frontImage) {
		imgElement.src = pokemon.images.front;
	} else {
		imgElement.src = pokemon.images.back;
	}
	imgElement.alt = `Pokémon ${pokemon.name}`;
}

function createAttackButtons(moves) {
    const attackSection = document.querySelector(".attack-buttons");
    attackSection.innerHTML = ""; // Limpiar contenido previo

    moves.forEach((move, index) => {
        const button = document.createElement("button");
        button.id = `attack${index + 1}`;
        button.className = `attack-btn ${move.type.name.toLowerCase()}`;
        button.textContent = move.name;
        attackSection.appendChild(button);
    });
}

// Renderizar ambos Pokémon
renderPokemon(playerPokemon, 'player-sprite', { frontImage: false });
renderPokemon(enemyPokemon, 'enemy-sprite', { frontImage: true });

// Rederizar botones de movimientos
createAttackButtons(playerPokemon.moves);

for (let i=1; i <= Pokemon.MAX_MOVES; i++) {
	document.getElementById(`attack${i}`).addEventListener('click', (event) => {
		attack(event, poke1, poke2);
	});
}