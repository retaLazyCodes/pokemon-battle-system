function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function updateUI(playerPokemon, enemyPokemon) {
    const playerHpBar = document.getElementById("player-hp");
    const enemyHpBar = document.getElementById("enemy-hp");

    // Calcular el porcentaje de vida restante
    const playerHpPercentage = (playerPokemon.currentHealth / playerPokemon.hp) * 100;
    const enemyHpPercentage = (enemyPokemon.currentHealth / enemyPokemon.hp) * 100;

    // Actualizar las barras de HP
    if (playerHpBar && enemyHpBar) {
        playerHpBar.style.width = playerHpPercentage + "%";
        enemyHpBar.style.width = enemyHpPercentage + "%";
    }
}


export { capitalizeFirstLetter, updateUI }