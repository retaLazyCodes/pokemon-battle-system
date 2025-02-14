function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Función para actualizar la barra de salud
function updateHealthBar(playerHP, enemyHP) {
    const playerHPBar = document.getElementById("player-hp");
    const enemyHPBar = document.getElementById("enemy-hp");
    const playerHPText = document.getElementById("player-hp-text");
    const enemyHPText = document.getElementById("enemy-hp-text");

    // Actualizar el porcentaje de salud y las barras
    playerHPBar.style.width = `${playerHP}%`;
    enemyHPBar.style.width = `${enemyHP}%`;

    playerHPText.textContent = `${playerHP}%`;
    enemyHPText.textContent = `${enemyHP}%`;

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

    // Lo mismo para el enemigo
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

// Llamar a la función con el porcentaje de vida
let playerHP = 100;
let enemyHP = 100;
updateHealthBar(playerHP, enemyHP);



export { capitalizeFirstLetter, updateHealthBar }