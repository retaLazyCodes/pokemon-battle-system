
const playerTeam = [
    { name: "Hawlucha", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/25.png", hp: 80 },
    { name: "Gastrodon", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/25.png", hp: 50 },
    { name: "Clefable", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/25.png", hp: 100 },
    { name: "Alomomola", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/25.png", hp: 75 },
    { name: "Crabominable", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/25.png", hp: 30 },
    { name: "Bisharp", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/25.png", hp: 90 }
];

export function renderSwitchButtons() {
    const switchContainer = document.querySelector(".switch-buttons");
    switchContainer.innerHTML = ""; // Limpiar botones previos

    playerTeam.forEach(pokemon => {
        const button = document.createElement("div");
        button.classList.add("switch-pokemon");

        // Imagen del Pokémon
        const img = document.createElement("img");
        img.src = `${pokemon.sprite}`;
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
        hpBar.style.width = `${pokemon.hp}%`; // Ajusta la barra según la vida

        // Agregar elementos al contenedor
        hpBarContainer.appendChild(hpBar);
        button.appendChild(img);
        button.appendChild(name);
        button.appendChild(hpBarContainer);
        switchContainer.appendChild(button);
    });
}


