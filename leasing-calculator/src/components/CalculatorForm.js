import React, { useEffect, useCallback } from 'react';
import './CalculatorForm.css';
import { LeasingCalculation } from '../services/LeasingCalculation';

export const CalculatorForm = ({ onSubmit, isCompany, formRef }) => {
  const defaultCalc = LeasingCalculation.getDefaultCalculation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(new FormData(e.target));
  };

  const updateGrossValues = useCallback(() => {
    if (!formRef.current) return;
    const form = formRef.current;
    const vatRate = parseFloat(form.vatRate.value) || 0;
    
    const netAmount = parseFloat(form.netAmount.value) || 0;
    const initialPayment = parseFloat(form.initialPayment.value) || 0;
    const endValue = parseFloat(form.endValue.value) || 0;
    const instalmentValue = parseFloat(form.instalmentValue.value) || 0;

    form.grossAmount.value = (netAmount * (1 + vatRate / 100)).toFixed(2);
    form.grossInitialPayment.value = (initialPayment * (1 + vatRate / 100)).toFixed(2);
    form.grossEndValue.value = (endValue * (1 + vatRate / 100)).toFixed(2);
    form.grossInstalment.value = (instalmentValue * (1 + vatRate / 100)).toFixed(2);
  }, [formRef]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleInput = () => updateGrossValues();
    form.addEventListener('input', handleInput);
    return () => form.removeEventListener('input', handleInput);
  }, [formRef, updateGrossValues]);

  // Calculate gross values on mount
  useEffect(() => {
    updateGrossValues();
  }, [updateGrossValues]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="calculator-form">
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="name">
            <span className="material-icons input-icon">directions_car</span>
            Vehicle Name
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            placeholder="e.g. Tesla Model 3"
            defaultValue={defaultCalc.name}
          />
        </div>

        <div className="value-group">
          <div className="form-group">
            <label htmlFor="netAmount">
              <span className="material-icons input-icon">price_change</span>
              Net Amount
            </label>
            <input 
              type="number" 
              id="netAmount" 
              name="netAmount" 
              step="0.01" 
              required 
              placeholder="0.00"
              min="0"
              defaultValue={defaultCalc.netAmount}
            />
          </div>
          <div className="form-group gross-value">
            <label>
              <span className="material-icons input-icon">euro</span>
              Gross Amount
            </label>
            <input 
              type="number" 
              id="grossAmount"
              name="grossAmount"
              step="0.01"
              readOnly
              placeholder="Calculated"
              className="calculated-value"
            />
          </div>
          <div className="form-group">
            <label htmlFor="vatRate">
              <span className="material-icons input-icon">percent</span>
              VAT Rate (%)
            </label>
            <input 
              type="number" 
              id="vatRate" 
              name="vatRate" 
              step="0.01" 
              defaultValue={defaultCalc.vatRate}
              required 
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="value-group">
          <div className="form-group">
            <label htmlFor="initialPayment">
              <span className="material-icons input-icon">payments</span>
              Net Initial Payment
            </label>
            <input 
              type="number" 
              id="initialPayment" 
              name="initialPayment" 
              step="0.01" 
              required 
              placeholder="0.00"
              min="0"
              defaultValue={defaultCalc.initialPayment}
            />
          </div>
          <div className="form-group gross-value">
            <label>
              <span className="material-icons input-icon">euro</span>
              Gross Initial Payment
            </label>
            <input 
              type="number"
              id="grossInitialPayment"
              name="grossInitialPayment"
              step="0.01"
              readOnly
              placeholder="Calculated"
              className="calculated-value"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="tenors">
            <span className="material-icons input-icon">calendar_month</span>
            Lease Duration (months)
          </label>
          <input 
            type="number" 
            id="tenors" 
            name="tenors" 
            required 
            placeholder="36"
            min="1"
            max="120"
            defaultValue={defaultCalc.tenors}
          />
        </div>

        <div className="value-group">
          <div className="form-group">
            <label htmlFor="endValue">
              <span className="material-icons input-icon">price_check</span>
              Net End Value
            </label>
            <input 
              type="number" 
              id="endValue" 
              name="endValue" 
              step="0.01" 
              required 
              placeholder="0.00"
              min="0"
              defaultValue={defaultCalc.endValue}
            />
          </div>
          <div className="form-group gross-value">
            <label>
              <span className="material-icons input-icon">euro</span>
              Gross End Value
            </label>
            <input 
              type="number"
              id="grossEndValue"
              name="grossEndValue"
              step="0.01"
              readOnly
              placeholder="Calculated"
              className="calculated-value"
            />
          </div>
        </div>

        <div className="value-group">
          <div className="form-group">
            <label htmlFor="instalmentValue">
              <span className="material-icons input-icon">account_balance_wallet</span>
              Net Monthly Instalment
            </label>
            <input 
              type="number" 
              id="instalmentValue" 
              name="instalmentValue" 
              step="0.01" 
              required 
              placeholder="0.00"
              min="0"
              defaultValue={defaultCalc.instalmentValue}
            />
          </div>
          <div className="form-group gross-value">
            <label>
              <span className="material-icons input-icon">euro</span>
              Gross Monthly Instalment
            </label>
            <input 
              type="number"
              id="grossInstalment"
              name="grossInstalment"
              step="0.01"
              readOnly
              placeholder="Calculated"
              className="calculated-value"
            />
          </div>
        </div>

        {isCompany && (
          <div className="form-group">
            <label htmlFor="deductionPercentage">
              <span className="material-icons input-icon">savings</span>
              Deduction Percentage
            </label>
            <input 
              type="number" 
              id="deductionPercentage" 
              name="deductionPercentage" 
              step="1" 
              defaultValue="50" 
              required 
              min="0"
              max="100"
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-button">
            <span className="material-icons button-icon">calculate</span>
            Calculate
          </button>
        </div>
      </div>
    </form>
  );
}; 