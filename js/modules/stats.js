export class Stats {
    constructor(baseHp, baseAttack, baseDefense, baseSpAttack, baseSpDefense, baseSpeed, level) {
        this.baseHp = baseHp;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;
        this.baseSpAttack = baseSpAttack;
        this.baseSpDefense = baseSpDefense;
        this.baseSpeed = baseSpeed;

        // Calculamos los stats reales
        this.hp = this.calculateHP(baseHp, level);
        this.attack = this.calculateStat(baseAttack, level);
        this.defense = this.calculateStat(baseDefense, level);
        this.specialAttack = this.calculateStat(baseSpAttack, level);
        this.specialDefense = this.calculateStat(baseSpDefense, level);
        this.speed = this.calculateStat(baseSpeed, level);
    }

    calculateHP(baseHP, level) {
        return Math.floor(((2 * baseHP * level) / 100) + level + 10);
    }

    calculateStat(baseStat, level) {
        return Math.floor(((2 * baseStat * level) / 100) + 5);
    }
}