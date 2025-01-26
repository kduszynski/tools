class LeasingCalculator {
    constructor(name, netAmount, initialPayment, tenors, endValue, instalmentValue) {
        this.name = name;
        this.netAmount = netAmount;
        this.initialPayment = initialPayment;
        this.tenors = tenors;
        this.endValue = endValue;
        this.instalmentValue = instalmentValue;
    }

    calculateTotalCost() {
        const totalInstalments = this.instalmentValue * this.tenors;
        const totalCost = this.initialPayment + totalInstalments + this.endValue;
        return totalCost;
    }

    calculateRRSO() {
        const totalCost = this.calculateTotalCost();
        const rrso = ((totalCost - this.netAmount) / this.netAmount) * 100;
        return rrso;
    }

    printConditions() {
        console.log(`${this.name.padEnd(15)} ${this.netAmount.toFixed(2).padEnd(10)} ${this.initialPayment.toFixed(2).padEnd(15)} ${this.tenors.toString().padEnd(7)} ${this.endValue.toFixed(2).padEnd(10)} ${this.instalmentValue.toFixed(2).padEnd(15)} ${this.calculateRRSO().toFixed(2).padEnd(10)}`);
    }

    toString() {
        return `${this.name.padEnd(15)} ${this.netAmount.toFixed(2).padEnd(10)} ${this.initialPayment.toFixed(2).padEnd(15)} ${this.tenors.toString().padEnd(7)} ${this.endValue.toFixed(2).padEnd(10)} ${this.instalmentValue.toFixed(2)}`;
    }
}

function printLeasingTable(calculators) {
    // Sort calculators by RRSO in ascending order
    calculators.sort((a, b) => a.calculateRRSO() - b.calculateRRSO());

    // Print table header
    console.log(`${'Car Name'.padEnd(15)} ${'Net Amount'.padEnd(10)} ${'Initial Payment'.padEnd(15)} ${'Tenors'.padEnd(7)} ${'End Value'.padEnd(10)} ${'Instalment Value'.padEnd(15)} ${'RRSO (%)'.padEnd(10)}`);
    console.log('-'.repeat(85));

    // Print each calculator's conditions
    calculators.forEach(calculator => calculator.printConditions());
}

// Add at the end, before example usage
let calculationHistory = [];

function addToHistory(calculator) {
    calculationHistory.push(calculator);
    return calculationHistory;
}

// Example usage
const toyotaNetValue = Math.round(94000 / 1.23 * 100) / 100;
const calculators = [
    new LeasingCalculator("Octavia", 76585, 18840, 36, 51389, 723 / 1.23),
    new LeasingCalculator("Toyota", toyotaNetValue, 0.3 * toyotaNetValue, 36, Math.round(toyotaNetValue * 0.2 * 100) / 100, 1485),
    new LeasingCalculator("Kamiq", 63577, 15640, 36, 42660, 600 / 1.23),
    new LeasingCalculator("Vehis Octavia", 97645, 97645 * 0.2, 36, 976, 2480)
];

printLeasingTable(calculators); 