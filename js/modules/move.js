import { titleCase } from "../utils.js";

// Implementación de "enum"
const Category = Object.freeze({
    PHYSICAL: "physical",
    SPECIAL: "special",
    STATUS: "status"
});


class Move {
    constructor({name, category, power, type}) {
        if (!Object.values(Category).includes(category)) {
            throw new Error(`Categoría inválida: ${category}`);
        }
        this._name = name;
        this._category = category;
        this._power = power;
        this._type = type; // Tipo Type
    }

    get name() {
		return titleCase(this._name);
	}
    get power() {
		return this._power;
	}
    get category() {
		return this._category;
	}
    get type() {
		return this._type;
	}
}

export { Category, Move }