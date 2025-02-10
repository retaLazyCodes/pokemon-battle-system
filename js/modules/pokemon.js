class Pokemon {
	constructor(name, level, health, moves, img) {
		this.name = name;
		this.level = level;
		this.health = health;
		this.moves = moves;
		this.img = img;
	}
	decrementHealth(damage) {
		this.health -= damage;
	}
	attack(target, move) {
		target.decrementHealth(move.damage);
	}
};

export { Pokemon };

