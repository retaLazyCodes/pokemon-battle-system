export class Battle {
    // Almacena la instancia única de Battle
    static instance = null;

    constructor(player1, player2, updateUI) {
        if (Battle.instance) {
            throw new Error("Solo puede haber una instancia de Battle");
        }

        this.player1 = player1;
        this.player2 = player2;
        this.updateUI = updateUI;

        Battle.instance = this;
    }

    static getInstance(player1, player2, updateUI) {
        // Si no existe una instancia, la crea
        if (!Battle.instance) {
            Battle.instance = new Battle(player1, player2, updateUI);
        }
        return Battle.instance;
    }

    resume() {
        this.start({ fromSwitch: true });
    }

    async start({ fromSwitch = false } = {}) {
        while (this.player1.activePokemon.currentHealth > 0 && this.player2.activePokemon.currentHealth > 0) {

            const enemyMove = this.getRandomEnemyMove(this.player2);
            let firstAttacker, firstMove, secondAttacker, secondMove;

            if (!fromSwitch) {
                console.log(`Es el turno de ${this.player1.name}`);

                // 1. Esperar la elección del jugador
                const moveIndex = await this.waitForPlayerMove();
                const playerMove = this.player1.activePokemon.getMove(moveIndex);

                // 2. Determinar orden de ataque correctamente
                if (this.player1.activePokemon.speed > this.player2.activePokemon.speed) {
                    firstAttacker = this.player1;
                    firstMove = playerMove;
                    secondAttacker = this.player2;
                    secondMove = enemyMove;
                } else if (this.player1.activePokemon.speed < this.player2.activePokemon.speed) {
                    firstAttacker = this.player2;
                    firstMove = enemyMove;
                    secondAttacker = this.player1;
                    secondMove = playerMove;
                } else {
                    // Empate, se decide al azar
                    if (Math.random() < 0.5) {
                        firstAttacker = this.player1;
                        firstMove = playerMove;
                        secondAttacker = this.player2;
                        secondMove = enemyMove;
                    } else {
                        firstAttacker = this.player2;
                        firstMove = enemyMove;
                        secondAttacker = this.player1;
                        secondMove = playerMove;
                    }
                }

                // 3. Ejecutar ataque del Pokémon más rápido
                console.log(`${firstAttacker.activePokemon.name} ataca con ${firstMove.name}`);
                firstAttacker.activePokemon.attack(secondAttacker.activePokemon, firstMove);
                console.log(`Vida restante de ${secondAttacker.activePokemon.name}: ${secondAttacker.activePokemon.currentHealth} (${secondAttacker.activePokemon.getHPPercentage()}%)`);

                // Calcular el porcentaje de vida restante
                const playerHPPercentage = this.player1.activePokemon.getHPPercentage();
                const enemyHPPercentage = this.player2.activePokemon.getHPPercentage();
                
                // Actualizar la UI con los porcentajes
                await this.executeAttacks(firstAttacker, this.player1, playerHPPercentage, enemyHPPercentage);
                
                if (secondAttacker.activePokemon.currentHealth <= 0) {
                    console.log(`${firstAttacker.name} ha ganado el combate`);
                    return;
                }
            }

            if (fromSwitch) {
                secondAttacker = this.player2;
                firstAttacker = this.player1;
                secondMove = enemyMove;
                fromSwitch = false;
            }

            // 4. Ejecutar el segundo ataque si el Pokémon sigue con vida
            console.log(`${secondAttacker.activePokemon.name} ataca con ${secondMove.name}`);
            secondAttacker.activePokemon.attack(firstAttacker.activePokemon, secondMove);
            console.log(`Vida restante de ${firstAttacker.activePokemon.name}: ${firstAttacker.activePokemon.currentHealth} (${firstAttacker.activePokemon.getHPPercentage()}%)`);

            // Calcular el porcentaje de vida restante
            const playerHPPercentage2 = this.player1.activePokemon.getHPPercentage();
            const enemyHPPercentage2 = this.player2.activePokemon.getHPPercentage();

            // Actualizar la UI con los nuevos porcentajes
            await this.executeAttacks(null, this.player1, playerHPPercentage2, enemyHPPercentage2);

            if (firstAttacker.activePokemon.currentHealth <= 0) {
                console.log(`${secondAttacker.name} ha ganado el combate`);
                return;
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async executeAttacks(firstAttacker, player1, playerHPPercentage, enemyHPPercentage) {
        if (firstAttacker === player1) {
            await this.delay(500);
            await this.updateUI(null, enemyHPPercentage);
            await this.delay(500);
            await this.updateUI(playerHPPercentage, null);
        } else {
            await this.delay(500);
            await this.updateUI(playerHPPercentage, null);
            await this.delay(500);
            await this.updateUI(null, enemyHPPercentage);
        }
    }

    waitForPlayerMove() {
        return new Promise((resolve) => {
            const buttons = document.querySelectorAll(".attack-buttons button");

            function handleMoveSelection(event) {
                const moveIndex = parseInt(event.target.id.replace("attack", "")) - 1;
                buttons.forEach(btn => btn.removeEventListener("click", handleMoveSelection));
                resolve(moveIndex);
            }

            buttons.forEach(btn => btn.addEventListener("click", handleMoveSelection));
        });
    }

    getRandomEnemyMove(player) {
        const moves = player.activePokemon.moves;
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }
}
