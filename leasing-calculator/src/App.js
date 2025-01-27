import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { StorageService } from './services/StorageService';
import { CalculatorForm } from './components/CalculatorForm';
import { CalculationsList } from './components/CalculationsList';
import { LeasingCalculator } from './services/LeasingCalculator';

function App() {
  const [calculations, setCalculations] = useState([]);
  const [isCompany, setIsCompany] = useState(false);
  const [notification, setNotification] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const savedCalcs = StorageService.loadCalculations();
    if (savedCalcs.length > 0) {
      const calc = savedCalcs[0];
      setCalculations(savedCalcs);
      setIsCompany(Boolean(calc.isCompany));
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (formData) => {
    const calc = new LeasingCalculator(
      formData.get('name'),
      parseFloat(formData.get('netAmount')),
      parseFloat(formData.get('initialPayment')),
      parseInt(formData.get('tenors')),
      parseFloat(formData.get('endValue')),
      parseFloat(formData.get('instalmentValue')),
      parseFloat(formData.get('vatRate')),
      isCompany,
      parseFloat(formData.get('deductionPercentage'))
    );
    setCalculations(prev => [...prev, calc]);
    showNotification('Calculation completed and saved successfully!');
  };

  const handleDelete = (createdAt) => {
    setCalculations(prev => prev.filter(calc => calc.createdAt !== createdAt));
    showNotification('Calculation deleted');
  };

  const handleReuse = (calc) => {
    if (formRef.current) {
      // First update the settings to ensure proper state
      setIsCompany(Boolean(calc.isCompany));

      // Then update form values
      const form = formRef.current;
      form.name.value = calc.name;
      form.netAmount.value = calc.netAmount;
      form.initialPayment.value = calc.initialPayment;
      form.tenors.value = calc.tenors;
      form.endValue.value = calc.endValue;
      form.instalmentValue.value = calc.instalmentValue;
      
      if (calc.isCompany && form.deductionPercentage) {
        form.deductionPercentage.value = calc.deductionPercentage;
      }

      // Trigger input events on all number inputs to force recalculation
      form.querySelectorAll('input[type="number"]').forEach(input => {
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      });
      
      showNotification('Values loaded to form');
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <span className="material-icons header-icon">calculate</span>
        <h1>Leasing Calculator</h1>
      </header>
      
      <div className="settings">
        <label>
          <span className="material-icons settings-icon">business</span>
          <input
            type="checkbox"
            checked={isCompany}
            onChange={(e) => setIsCompany(e.target.checked)}
          />
          Company Calculation
        </label>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <CalculatorForm
        onSubmit={handleSubmit}
        isCompany={isCompany}
        formRef={formRef}
      />

      <CalculationsList
        calculations={calculations}
        isCompany={isCompany}
        onDelete={handleDelete}
        onReuse={handleReuse}
      />
    </div>
  );
}

export default App;
