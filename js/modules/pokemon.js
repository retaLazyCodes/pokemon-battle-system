import { capitalizeFirstLetter } from "../utils.js";
import { Category, Move } from "./move.js";
import { Stats } from "./stats.js";
import { TypeFactory } from "./type.js";

export class Pokemon {
	static MAX_MOVES = 4;
	
	constructor(name, moves, types, images, hp, attack, defense, spAttack, spDefense, speed) {
		this._name = name;
		this._level = 50;
		this._health = 100;
		this._images = images;
		this.stats = new Stats(
			hp, attack, defense,
			spAttack, spDefense, speed
		)
		
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

	decrementHealth(damage) {
		this._health -= damage;
	}

	attack(target, move) {
		const attackType = move.type;
		let attackerAttack = 0;
		let defenderDefense = 0;

		if (move.category == Category.PHYSICAL) {
			attackerAttack = target.stats.attack;
			defenderDefense = target.stats.defense;
		} 
		else if (move.category == Category.SPECIAL) {
			attackerAttack = target.stats.specialAttack;
			defenderDefense = target.stats.specialDefense;
		}
		const attackerMovePower = move.power;
		const attackerLevel = this._level;
		const effectiveness = attackType.calculateEffectiveness(target.types);

		// Fórmula de Daño
		const damage = Math.floor(
			((2 * attackerLevel / 5 + 2) * attackerMovePower * (attackerAttack / defenderDefense)) / 50 + 2
		);

		// Calcular daño por la efectividad
		const totalDamage = damage * effectiveness;

		console.log(
			`${capitalizeFirstLetter(this._name)} ataca a ${capitalizeFirstLetter(target.name)} con un ataque de tipo ${attackType.name} y causa ${totalDamage} de daño (x${effectiveness} efectividad)`
		);
		
		target.decrementHealth(totalDamage);
    }
	
	getMove(index) {
		return this._moves[index];
	}

	get name() {
		return this._name;
	}

	get health() {
		return this._health;
	}

	get moves() {
		return this._moves;
	}

	get types() {
		return this._types;
	}
};

