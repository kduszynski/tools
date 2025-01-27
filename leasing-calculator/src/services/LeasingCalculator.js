export const CURRENT_VERSION = 1;

export class LeasingCalculator {
  static VERSION = CURRENT_VERSION;

  constructor(name, netAmount, initialPayment, tenors, endValue, instalmentValue, vatRate = 0, isCompany = false, deductionPercentage = 50) {
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
    this.createdAt = Date.now();
  }

  getGrossValue(netValue) {
    return netValue * (1 + this.vatRate / 100);
  }

  calculateNetTotalCost() {
    return this.initialPayment + (this.instalmentValue * this.tenors) + this.endValue;
  }

  calculateTotalCost() {
    const totalNet = this.calculateNetTotalCost();
    return this.getGrossValue(totalNet);
  }

  calculateRRSO() {
    const totalInterest = this.calculateTotalCost() - this.getGrossValue(this.netAmount);
    return (totalInterest / this.getGrossValue(this.netAmount)) * 100;
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

  calculateDeductedInstalment() {
    if (!this.isCompany) return null;
    
    const grossInstalment = this.getGrossInstalment();
    const vatPart = grossInstalment - this.instalmentValue;
    const deductionRate = this.deductionPercentage / 100;
    
    const incomeTaxDeduction = this.instalmentValue * deductionRate * 0.19;
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