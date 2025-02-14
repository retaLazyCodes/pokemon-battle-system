import { capitalizeFirstLetter } from "../utils.js";
import { Category, Move } from "./move.js";
import { Stats } from "./stats.js";
import { TypeFactory } from "./type.js";

export class Pokemon {
	static MAX_MOVES = 4;
	
	constructor(name, moves, types, images, hp, attack, defense, spAttack, spDefense, speed) {
		this._name = name;
		this._level = 50;
		this._images = images;
		
		// Stats con valores reales calculados
		this.stats = new Stats(
			hp, attack, defense,
			spAttack, spDefense,
			speed, this._level
		);

		// HP actual al iniciar la batalla
		this._currentHealth = this.stats.hp;
		
		this._types = [];
		this._moves = [];

		// Init types
		for (let i=0; i < types.length; i++) {
			this._types.push(TypeFactory.getType(types[i]));
		}
		// Init moveset
		for (let i=0; i < Pokemon.MAX_MOVES; i++) {
			moves[i].type = TypeFactory.getType(moves[i].type)
			this._moves.push(new Move(moves[i]));
		}
	}

	calculateMaxHP(baseHP) {
		return Math.floor(((2 * baseHP * this._level) / 100) + this._level + 10);
	}

	decrementHealth(damage) {
		this._currentHealth = Math.max(0, this._currentHealth - damage);
	}

	attack(target, move) {
		// Calculamos si el golpe es crítico antes de calcular el daño
		const isCritical = this.calculateCriticalHit() // 4.17% de probabilidad

		const damage = this.calculateDamage(target, move, isCritical);
		target.decrementHealth(damage);

		const effectiveness = move.type.calculateEffectiveness(target._types);
		const stab = this.calculateSTAB(move, this);

		console.log(
			`${capitalizeFirstLetter(this._name)} ataca a ${capitalizeFirstLetter(target._name)} con un ataque de tipo ${move.type.name} y causa ${damage} de daño (x${effectiveness} efectividad, x${stab} STAB)${isCritical ? " ¡GOLPE CRÍTICO!" : ""}`
		);
	}

	calculateDamage(target, move, isCritical = false) {
		const attackType = move.type;
		let attackerAttack = 0;
		let defenderDefense = 0;

		if (move.category === Category.PHYSICAL) {
			attackerAttack = this.stats.attack;
			defenderDefense = target.stats.defense;
		} else if (move.category === Category.SPECIAL) {
			attackerAttack = this.stats.specialAttack;
			defenderDefense = target.stats.specialDefense;
		}

		const CRIT_MULTIPLIER = 1.5;
		const attackerMovePower = move.power;
		const attackerLevel = this._level;
		const effectiveness = attackType.calculateEffectiveness(target._types);
		const stab = this.calculateSTAB(move, this);
		const criticalMultiplier = isCritical ? CRIT_MULTIPLIER : 1; // Aplicar golpe crítico
		
		// Fórmula de calculo de daño
		return Math.floor(
			(((2 * attackerLevel / 5 + 2) * attackerMovePower * (attackerAttack / defenderDefense)) / 50 + 2)
			* effectiveness
			* stab
			* criticalMultiplier
		);
	}


	calculateSTAB(move, pokemon) {
		const STAB_MULTIPLIER = 1.5;
		return pokemon._types.some(type => type.name === move.type.name) ? STAB_MULTIPLIER : 1;
	}

	calculateCriticalHit() {
		// Genera un número entre 0 y 99.9999, y si es menor que 4.17, ocurre un golpe crítico.
		const critChance = 4.17; // 4.17% de probabilidad de crítico
		return Math.random() * 100 < critChance
	}
	
	getMove(index) {
		return this._moves[index];
	}

	get name() {
		return this._name;
	}

	get currentHealth() {
		return this._currentHealth;
	}

	get moves() {
		return this._moves;
	}

	get types() {
		return this._types;
	}
	
	get speed() {
		return this.stats.speed;
	}

	get images() {
		return this._images;
	}
};

