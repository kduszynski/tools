import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CalculatorForm.css';
import { LeasingCalculation } from '../services/LeasingCalculation';

export const CalculatorForm = ({ onSubmit, formRef }) => {
  const { t } = useTranslation();
  const defaultCalc = LeasingCalculation.getDefaultCalculation();
  const [isCompany, setIsCompany] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('isCompany', isCompany);
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
    setCalculationResult(calc);
  };

  const handleSave = () => {
    if (calculationResult) {
      onSubmit(calculationResult);
      setCalculationResult(null);
    }
  };

  const handleDiscard = () => {
    setCalculationResult(null);
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

  // Monitor form changes to discard calculation
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleChange = () => {
      if (calculationResult) {
        handleDiscard();
      }
    };

    form.addEventListener('input', handleChange);
    return () => form.removeEventListener('input', handleChange);
  }, [formRef, calculationResult]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="calculator-form">
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="name">
            <span className="material-icons input-icon">directions_car</span>
            {t('vehicle.name')}
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
              {t('vehicle.netAmount')}
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
              {t('vehicle.grossAmount')}
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
              {t('form.vatRate')}
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
              {t('payment.initialPayment')}
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
              {t('payment.grossInitialPayment')}
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
            {t('form.months')}
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
              {t('payment.endValue')}
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
              {t('payment.grossEndValue')}
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
              {t('payment.instalment')}
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
              {t('payment.grossInstalment')}
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

        <div className="form-group">
          <label htmlFor="isCompany">
            <span className="material-icons input-icon">business</span>
            {t('app.companyCalculation')}
          </label>
          <div className="toggle-input">
            <input
              type="checkbox"
              id="isCompany"
              checked={isCompany}
              onChange={(e) => setIsCompany(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </div>
        </div>

        {isCompany && (
          <>
            <div className="form-group">
              <label htmlFor="deductionPercentage">
                <span className="material-icons input-icon">savings</span>
                {t('form.deductionPercentage')}
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
            <div className="form-group">
              <label htmlFor="taxRate">
                <span className="material-icons input-icon">percent</span>
                {t('form.taxRate')}
              </label>
              <input 
                type="number" 
                id="taxRate" 
                name="taxRate" 
                step="0.1" 
                defaultValue="19" 
                required 
                min="0"
              />
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-button">
            <span className="material-icons button-icon">calculate</span>
            {t('form.calculate')}
          </button>
        </div>
      </div>

      {calculationResult && (
        <div className="calculation-summary">
          <h3>
            <span className="material-icons">summarize</span>
            {t('calculations.summary')}
          </h3>
          <div className="summary-grid">
            <div className="summary-item">
              <label>{t('calculations.table.netInterest')}</label>
              <span>{calculationResult.calculateNetCost().toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <label>{t('calculations.table.grossInterest')}</label>
              <span>{calculationResult.calculateGrossCost().toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <label>{t('calculations.table.rrso')}</label>
              <span>{calculationResult.calculateRRSO().toFixed(2)}%</span>
            </div>
            {calculationResult.isCompany && (
              <div className="summary-item">
                <label>{t('calculations.table.deductedMonthly')}</label>
                <span>{calculationResult.calculateDeductedInstalment().toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="summary-actions">
            <button onClick={handleDiscard} className="discard-button">
              <span className="material-icons">close</span>
              {t('form.discard')}
            </button>
            <button onClick={handleSave} className="save-button">
              <span className="material-icons">save</span>
              {t('form.save')}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}; 