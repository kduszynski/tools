export const CURRENT_VERSION = 1;

export class LeasingCalculation {
  static VERSION = CURRENT_VERSION;

  static getDefaultCalculation() {
    return new LeasingCalculation(
      "New Vehicle",
      70000,
      0,
      40,
      700,
      2000,
      23,
      false,
      50
    );
  }

  constructor(name, netAmount, initialPayment, tenors, endValue, instalmentValue, vatRate = 0, isCompany = false, deductionPercentage = 50, taxRate = 19) {
    this.version = CURRENT_VERSION;
    this.name = name;
    this.netAmount = netAmount;
    this.initialPayment = initialPayment;
    this.tenors = tenors;
    this.endValue = endValue;
    this.instalmentValue = instalmentValue;
    this.vatRate = vatRate;
    this.isCompany = isCompany;
    this.deductionPercentage = deductionPercentage;
    this.taxRate = taxRate;
    this.createdAt = Date.now();
  }

  getGrossValue(netValue) {
    return netValue * (1 + this.vatRate / 100);
  }

  calculateRRSO() {
    return (this.calculateNetCost() / this.netAmount) * 100
  }

  getGrossAmount() {
    return this.getGrossValue(this.netAmount);
  }

  getGrossInstalment() {
    return this.getGrossValue(this.instalmentValue);
  }

  getGrossInitialPayment() {
    return this.getGrossValue(this.initialPayment);
  }

  getGrossEndValue() {
    return this.getGrossValue(this.endValue);
  }

  calculateNetCost() {
    return this.initialPayment + (this.instalmentValue * this.tenors) + this.endValue - this.netAmount;
  }

  calculateGrossCost() {
    return this.getGrossInitialPayment() + (this.getGrossInstalment() * this.tenors) + this.getGrossEndValue() - this.getGrossValue(this.netAmount);
  }

  calculateDeductedInstalment() {
    if (!this.isCompany) return null;
    
    const grossInstalment = this.getGrossInstalment();
    const vatPart = grossInstalment - this.instalmentValue;
    const deductionRate = this.deductionPercentage / 100;
    
    const incomeTaxDeduction = this.instalmentValue * (this.taxRate / 100);
    const vatDeduction = vatPart * deductionRate;
    
    return grossInstalment - (incomeTaxDeduction + vatDeduction);
  }

  getFormattedDate() {
    const date = new Date(this.createdAt);
    const pad = (num) => num.toString().padStart(2, '0');
    
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
} 