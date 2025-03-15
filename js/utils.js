import { Battle } from "./modules/battle.js";

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function titleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

// Rederizar los Pokémon
function renderPokemon(pokemon, elementIdSprite, elementIdName, { frontImage = false }) {
    const imgElement = document.getElementById(elementIdSprite);
    const divElement = document.getElementById(elementIdName);
    imgElement.src = frontImage ? pokemon.images.front : pokemon.images.back;
    imgElement.alt = `Pokémon ${pokemon.name}`;
    divElement.textContent = pokemon.name;
}

// Mostrar Pokémon revelados por los jugadores
function displayTeams(playerTeam, enemyTeam, activePokemon) {
    const playerTeamContainer = document.querySelector(".player-team");
    const enemyTeamContainer = document.querySelector(".enemy-team");

    if (playerTeam) {
        console.log(activePokemon)
        playerTeamContainer.innerHTML = playerTeam.map(poke => 
            `<img src="${poke.images.icon}" class="${poke === activePokemon ? 'active' : ''}">`
        ).join("");
    }
    if (enemyTeam) {
        enemyTeamContainer.innerHTML = enemyTeam.map(poke =>
            poke.revealed
            ? `<img src="${poke.images.icon}" class="revealed">` 
            : `<span class="picon" title="Not revealed" aria-label="Not revealed"></span>`
        ).join("");
    }
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


// Función para renderizar el menú de cambio de Pokémon
function renderSwitchMenu(player) {
    const switchContainer = document.querySelector(".switch-buttons");
    switchContainer.innerHTML = ""; // Limpiar botones previos

    player.team.forEach((pokemon, index) => {
        const button = document.createElement("div");
        button.classList.add("switch-pokemon");
        button.id = `pokemon#${index}`;

        // Imagen del Pokémon
        const img = document.createElement("img");
        img.src = pokemon.images.icon;
        img.alt = pokemon.name;

        // Nombre del Pokémon
        const name = document.createElement("div");
        name.classList.add("pokemon-name");
        name.textContent = pokemon.name;

        // Contenedor de la barra de salud
        const hpBarContainer = document.createElement("div");
        hpBarContainer.classList.add("hp-bar");

        // Barra de salud interna
        const hpBar = document.createElement("div");
        hpBar.classList.add("hp");
        const hpPercentage = (pokemon.currentHealth / pokemon.maxHealth) * 100;
        hpBar.style.width = `${hpPercentage}%`; // Ajusta la barra según la vida

        // Agregar elementos al contenedor
        hpBarContainer.appendChild(hpBar);
        button.appendChild(img);
        button.appendChild(name);
        button.appendChild(hpBarContainer);

        const pokemonIndex = parseInt(button.id[button.id.length-1])

        // Deshabilitar si el Pokémon está debilitado o ya es el activo
        if (pokemon.currentHealth <= 0 || index === player.activeIndex) {
            button.classList.add("disabled");
        } else {
            // Agregar evento de cambio de Pokémon
            button.addEventListener("click", (event) => {
                onPokemonSwitch(player, pokemonIndex);
            });
        }

        switchContainer.appendChild(button);
    });
}


// Función de cambio de Pokémon
function onPokemonSwitch(player, index) {
    const isPokemonFainted = player.activePokemon.currentHealth === 0;

    player.switchPokemon(index);
    renderPokemon(player.activePokemon, 'player-sprite', 'player-name', { frontImage: false });
    displayTeams(player.team, null, player.activePokemon)
    createAttackButtons(player.activePokemon.moves);
    renderSwitchMenu(player); // Volver a renderizar el menú
    updateHealthBar(player.activePokemon.getHPPercentage(), null);

    // Reanudar la batalla después del cambio
    const battle = Battle.getInstance();
    battle.resume(isPokemonFainted);
}


// Función para actualizar la barra de salud
function updateHealthBar(playerHP, enemyHP) {
    console.log(playerHP)
    console.log(enemyHP)
    if (playerHP != null) {
        const playerHPBar = document.getElementById("player-hp");
        const playerHPText = document.getElementById("player-hp-text");

        // Actualizar el porcentaje de salud y las barras
        playerHPBar.style.width = `${playerHP}%`;
        playerHPText.textContent = `${playerHP}%`;

        // Cambiar clase según el porcentaje de salud
        playerHPBar.className = 'hp'; // Reiniciar clase

        if (playerHP > 75) {
            playerHPBar.classList.add('hp-full'); // Salud alta (verde)
        } else if (playerHP > 50) {
            playerHPBar.classList.add('hp-high'); // Salud media-alta (verde claro)
        } else if (playerHP > 25) {
            playerHPBar.classList.add('hp-medium'); // Salud media (amarillo)
        } else if (playerHP > 10) {
            playerHPBar.classList.add('hp-low'); // Salud baja (naranja)
        } else {
            playerHPBar.classList.add('hp-very-low'); // Salud crítica (rojo)
        }
    }

    if (enemyHP != null) {
        const enemyHPBar = document.getElementById("enemy-hp");
        const enemyHPText = document.getElementById("enemy-hp-text");
        
        enemyHPBar.style.width = `${enemyHP}%`;
        enemyHPText.textContent = `${enemyHP}%`;

        enemyHPBar.className = 'hp'; // Reiniciar clase

        if (enemyHP > 75) {
            enemyHPBar.classList.add('hp-full');
        } else if (enemyHP > 50) {
            enemyHPBar.classList.add('hp-high');
        } else if (enemyHP > 25) {
            enemyHPBar.classList.add('hp-medium');
        } else if (enemyHP > 10) {
            enemyHPBar.classList.add('hp-low');
        } else {
            enemyHPBar.classList.add('hp-very-low');
        }
    }
}

// Llamar a la función con el porcentaje de vida
let playerHP = 100;
let enemyHP = 100;
updateHealthBar(playerHP, enemyHP);



export { 
    capitalizeFirstLetter,
    titleCase,
    updateHealthBar,
    renderSwitchMenu,
    renderPokemon,
    createAttackButtons,
    displayTeams
}