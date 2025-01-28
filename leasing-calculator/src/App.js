import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import { StorageService } from './services/StorageService';
import { CalculatorForm } from './components/CalculatorForm';
import { CalculationsList } from './components/CalculationsList';
import { LeasingCalculation } from './services/LeasingCalculation';
import { LanguageSelector } from './components/LanguageSelector';

function App() {
  const { t } = useTranslation();
  const [calculations, setCalculations] = useState([]);
  const [notification, setNotification] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const savedCalcs = StorageService.loadCalculations();
    if (savedCalcs.length > 0) {
      setCalculations(savedCalcs);
    }
  }, []);

  useEffect(() => {
    StorageService.saveCalculations(calculations);
  }, [calculations]);

  const showNotification = (messageKey, type = 'success') => {
    setNotification({ message: t(messageKey), type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (formData) => {
    const calc = new LeasingCalculation(
      formData.get('name'),
      parseFloat(formData.get('netAmount')),
      parseFloat(formData.get('initialPayment')),
      parseInt(formData.get('tenors')),
      parseFloat(formData.get('endValue')),
      parseFloat(formData.get('instalmentValue')),
      parseFloat(formData.get('vatRate')),
      formData.get('isCompany') === 'true',
      parseFloat(formData.get('deductionPercentage')),
      parseFloat(formData.get('taxRate'))
    );
    setCalculations(prev => [...prev, calc]);
    showNotification('app.notifications.calculationSaved');
  };

  const handleDelete = (createdAt) => {
    setCalculations(prev => prev.filter(calc => calc.createdAt !== createdAt));
    showNotification('app.notifications.calculationDeleted');
  };

  const handleReuse = (calc) => {
    if (formRef.current) {
      const form = formRef.current;
      form.name.value = calc.name;
      form.netAmount.value = calc.netAmount;
      form.initialPayment.value = calc.initialPayment;
      form.tenors.value = calc.tenors;
      form.endValue.value = calc.endValue;
      form.instalmentValue.value = calc.instalmentValue;
      
      if (form.deductionPercentage) {
        form.deductionPercentage.value = calc.deductionPercentage;
      }

      form.querySelectorAll('input[type="number"]').forEach(input => {
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      });
      
      showNotification('app.notifications.valuesLoaded');
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <span className="material-icons header-icon">calculate</span>
        <h1>{t('app.title')}</h1>
      </header>

      <LanguageSelector />
      
      <div className="calculator-container">
        <CalculatorForm onSubmit={handleSubmit} formRef={formRef} />
        {calculations.length > 0 && (
          <CalculationsList
            calculations={calculations}
            onDelete={handleDelete}
            onReuse={handleReuse}
          />
        )}
      </div>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;
