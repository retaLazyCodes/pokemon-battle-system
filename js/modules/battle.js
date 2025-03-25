import { 
    updateHealthBar,
    renderPokemon,
    displayTeams,
    doAttackAnimation
} from '../utils.js';

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

    resume(isPokemonFainted) {
        const shouldContinueBattle = !isPokemonFainted;

        if (shouldContinueBattle) {
            this.start({ fromSwitch: true }); // Solo el rival se mueve
        } else {
            this.start(); // Reinicia la batalla
        }
    }

    async start({ fromSwitch = false } = {}) {
        while (this.player1.activePokemon.currentHealth > 0 && this.player2.activePokemon.currentHealth > 0) {
            const enemyMove = this.getRandomEnemyMove(this.player2);
            let firstAttacker, firstMove, secondAttacker, secondMove;

            if (!fromSwitch) {
                console.log(`Es el turno de ${this.player1.name}`);

                const moveIndex = await this.waitForPlayerMove();
                const playerMove = this.player1.activePokemon.getMove(moveIndex);

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

                console.log(`${firstAttacker.activePokemon.name} ataca con ${firstMove.name}`);
                firstAttacker.activePokemon.attack(secondAttacker.activePokemon, firstMove);
                console.log(`Vida restante de ${secondAttacker.activePokemon.name}: ${secondAttacker.activePokemon.currentHealth} (${secondAttacker.activePokemon.getHPPercentage()}%)`);

                // Calcular el porcentaje de vida restante
                const playerHPPercentage = this.player1.activePokemon.getHPPercentage();
                const enemyHPPercentage = this.player2.activePokemon.getHPPercentage();
                
                // Actualizar la UI con los porcentajes
                await this.executeAttacks(firstAttacker, this.player1, playerHPPercentage, enemyHPPercentage);
                
                if (secondAttacker.activePokemon.currentHealth <= 0) {
                    if (secondAttacker == this.player2) {
                        this.changePokemon(this.player2);
                        continue;
                    } 
                    else if (secondAttacker == this.player1) {
                        console.log(`${this.player1.activePokemon.name} ha sido derrotado!`);

                        // Si el Pokémon derrotado es del jugador, NO hacemos cambio automático
                        if (this.player1.hasAvailablePokemon()) {
                            console.log(`${this.player1.name}, elige un nuevo Pokémon.`);
                            return; // Detenemos la ejecución hasta que el jugador elija manualmente
                        } else {
                            console.log(`${secondAttacker.name} ha ganado el combate`);
                            return;
                        }
                    } 
                }
            }

            if (fromSwitch) {
                secondAttacker = this.player2;
                firstAttacker = this.player1;
                secondMove = enemyMove;
                fromSwitch = false;
            }

            console.log(`${secondAttacker.activePokemon.name} ataca con ${secondMove.name}`);
            secondAttacker.activePokemon.attack(firstAttacker.activePokemon, secondMove);
            console.log(`Vida restante de ${firstAttacker.activePokemon.name}: ${firstAttacker.activePokemon.currentHealth} (${firstAttacker.activePokemon.getHPPercentage()}%)`);

            // Calcular el porcentaje de vida restante
            const playerHPPercentage2 = this.player1.activePokemon.getHPPercentage();
            const enemyHPPercentage2 = this.player2.activePokemon.getHPPercentage();

            // Actualizar la UI con los nuevos porcentajes
            await this.executeAttacks(secondAttacker, this.player1, playerHPPercentage2, enemyHPPercentage2);

            if (this.player1.activePokemon.currentHealth <= 0) {
                console.log(`${this.player1.activePokemon.name} ha sido derrotado!`);

                // Si el Pokémon derrotado es del jugador, NO hacemos cambio automático
                if (this.player1.hasAvailablePokemon()) {
                    console.log(`${this.player1.name}, elige un nuevo Pokémon.`);
                    return; // Detenemos la ejecución hasta que el jugador elija manualmente
                } else {
                    console.log(`${secondAttacker.name} ha ganado el combate`);
                    return;
                }
            } else if (this.player2.activePokemon.currentHealth <= 0) {
                console.log(`${this.player2.activePokemon.name} ha sido derrotado!`);
                // Si el Pokémon derrotado es del rival (player2), elige uno automáticamente
                this.changePokemon(this.player2)
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async executeAttacks(currentAttacker, player1, playerHPPercentage, enemyHPPercentage) {
        if (currentAttacker === player1) {
            doAttackAnimation({ isPlayer: true });
            await this.delay(1000);
            await this.updateUI(null, enemyHPPercentage);
            await this.delay(500);
        } else {
            await this.delay(1000);
            doAttackAnimation({ isPlayer: false });
            await this.delay(1000);
            await this.updateUI(playerHPPercentage, null);
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

    changePokemon(player) {
        if (player.hasAvailablePokemon()) {
            console.log(`${player.name} cambia de Pokémon.`);
            player.switchPokemon(null);
            renderPokemon(player.activePokemon, 'enemy-sprite', 'enemy-name', { frontImage: true });
            displayTeams(null, player.team)
            updateHealthBar(null, player.activePokemon.getHPPercentage())
        } else {
            console.log(`${this.player1.name} ha ganado el combate`);
            return;
        }
    }

    getRandomEnemyMove(player) {
        const moves = player.activePokemon.moves;
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }
}
