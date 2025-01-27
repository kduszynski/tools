import { CURRENT_VERSION, LeasingCalculation } from './LeasingCalculation';

export class StorageService {
  static STORAGE_KEY = 'leasingCalculations';

  static loadCalculations() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      const storage = Array.isArray(parsed) ? { version: 0, calculations: parsed } : parsed;
      
      if (storage.version !== CURRENT_VERSION) {
        const migratedCalculations = storage.calculations.map(calc => {
          const migrated = this.migrateCalculation(calc);
          return Object.assign(new LeasingCalculation(), migrated);
        });
        return migratedCalculations;
      }
      
      return storage.calculations.map(calc => Object.assign(new LeasingCalculation(), calc));
    } catch (error) {
      console.error('Failed to load calculations:', error);
      return [];
    }
  }

  static saveCalculations(calculations) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        version: CURRENT_VERSION,
        calculations
      }));
    } catch (error) {
      console.error('Failed to save calculations:', error);
    }
  }

  static migrateCalculation(calc) {
    if (!calc.version || calc.version < CURRENT_VERSION) {
      calc.version = CURRENT_VERSION;
    }
    return calc;
  }
} 