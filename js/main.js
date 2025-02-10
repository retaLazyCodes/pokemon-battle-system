import { Pokedex } from './modules/pokedex.js';

console.log('working');

let turn = 0;



function attack1() {

	console.log('attacked with first attack');
}

function attack2() {
	console.log('attacked with second attack');
}

function attack3() {
	console.log('attacked with third attack');
}
function attack4() {
	console.log('attacked with fourth attack');
}


const randomPokemon1 = await Pokedex.getRandomPokemon()
const randomPokemon2 = await Pokedex.getRandomPokemon()

const playerPokemon = await Pokedex.getPokemonDetails(randomPokemon1.url);
const enemyPokemon = await Pokedex.getPokemonDetails(randomPokemon2.url);
console.log(playerPokemon)
console.log(enemyPokemon)

function renderPokemon(pokemon, elementId, frontImage=false) {
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
        button.className = `attack-btn ${move.type}`;
        button.textContent = move.name;
        attackSection.appendChild(button);
    });
}

// Renderizar ambos Pokémon
renderPokemon(playerPokemon, 'player-sprite');
renderPokemon(enemyPokemon, 'enemy-sprite', true);

// Rederizar botones de movimientos
createAttackButtons(playerPokemon.moves);

document.getElementById('attack1').addEventListener('click', attack1);
document.getElementById('attack2').addEventListener('click', attack2);
document.getElementById('attack3').addEventListener('click', attack3);
document.getElementById('attack4').addEventListener('click', attack4);