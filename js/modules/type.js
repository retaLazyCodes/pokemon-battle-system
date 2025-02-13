class Type {
    constructor(name, strengths = [], weaknesses = [], immunities = []) {
        this.name = name;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.immunities = immunities;
    }

    calculateEffectiveness(defendingTypes) {
        let effectiveness = 1; // Daño neutro

        for (const defType of defendingTypes) {
            if (this.immunities.includes(defType.name)) {
                return 0; // Inmune
            }
            if (this.strengths.includes(defType.name)) {
                effectiveness *= 2; // Super efectivo
            }
            if (this.weaknesses.includes(defType.name)) {
                effectiveness *= 0.5; // No muy efectivo
            }
        }
        return effectiveness;
    }
}


class TypeFactory {
    static types = {};

    static createTypes() {
        const typeData = [
            ["Normal", [], ["Rock", "Steel"], ["Ghost"]],
            ["Fire", ["Grass", "Ice", "Bug", "Steel"], ["Water", "Rock", "Fire", "Dragon"]],
            ["Water", ["Fire", "Rock", "Ground"], ["Water", "Grass", "Dragon"]],
            ["Grass", ["Water", "Rock", "Ground"], ["Fire", "Poison", "Flying", "Bug", "Grass", "Dragon"]],
            ["Electric", ["Water", "Flying"], ["Electric", "Grass", "Dragon"], ["Ground"]],
            ["Ice", ["Grass", "Ground", "Flying", "Dragon"], ["Fire", "Fighting", "Rock", "Steel"]],
            ["Fighting", ["Normal", "Ice", "Rock", "Dark", "Steel"], ["Flying", "Poison", "Bug", "Psychic", "Fairy"], ["Ghost"]],
            ["Poison", ["Grass", "Fairy"], ["Poison", "Ground", "Rock", "Ghost"], ["Steel"]],
            ["Ground", ["Fire", "Electric", "Poison", "Rock", "Steel"], ["Grass", "Bug"], ["Flying"]],
            ["Flying", ["Grass", "Fighting", "Bug"], ["Electric", "Rock", "Steel"]],
            ["Psychic", ["Fighting", "Poison"], ["Psychic", "Steel"], ["Dark"]],
            ["Bug", ["Grass", "Psychic", "Dark"], ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"]],
            ["Rock", ["Fire", "Ice", "Flying", "Bug"], ["Fighting", "Ground", "Steel"]],
            ["Ghost", ["Psychic", "Ghost"], ["Dark"], ["Normal"]],
            ["Dragon", ["Dragon"], ["Steel"], ["Fairy"]],
            ["Dark", ["Psychic", "Ghost"], ["Fighting", "Dark", "Fairy"]],
            ["Steel", ["Ice", "Rock", "Fairy"], ["Fire", "Fighting", "Ground"]],
            ["Fairy", ["Fighting", "Dragon", "Dark"], ["Fire", "Poison", "Steel"]],
        ];

        for (const [name, strong, weak, noEffect] of typeData) {
            TypeFactory.types[name.toLowerCase()] = new Type(name, strong, weak, noEffect);
        }
    }

    static getType(name) {
        return TypeFactory.types[name.toLowerCase()];
    }
}

// Crear los tipos solo una vez
TypeFactory.createTypes();

export { Type, TypeFactory }