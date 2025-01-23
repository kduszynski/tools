import React, { useState } from 'react';
import './App.css';

class LeasingCalculator {
  constructor(carName, netAmount, initialPayment, tenors, endValue, instalmentValue, useGross = false, vatRate = 0) {
    this.carName = carName;
    this.netAmount = netAmount;
    this.initialPayment = initialPayment;
    this.tenors = tenors;
    this.endValue = endValue;
    this.instalmentValue = instalmentValue;
    this.useGross = useGross;
    this.vatRate = vatRate;
  }

  toGross(netValue) {
    return this.useGross ? netValue * (1 + this.vatRate / 100) : netValue;
  }

  calculateTotalCost() {
    const totalNet = this.initialPayment + (this.instalmentValue * this.tenors) + this.endValue;
    return this.toGross(totalNet);
  }

  calculateRRSO() {
    const totalInterest = this.calculateTotalCost() - this.toGross(this.netAmount);
    return (totalInterest / this.toGross(this.netAmount)) * 100;
  }

  getGrossAmount() {
    return this.toGross(this.netAmount);
  }

  getGrossInstalment() {
    return this.toGross(this.instalmentValue);
  }

  getGrossInitialPayment() {
    return this.toGross(this.initialPayment);
  }

  getGrossEndValue() {
    return this.toGross(this.endValue);
  }
}

function App() {
  const [calculations, setCalculations] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [useGross, setUseGross] = useState(false);
  const formRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const calculator = new LeasingCalculator(
      formData.get('carName'),
      parseFloat(formData.get('netAmount')),
      parseFloat(formData.get('initialPayment')),
      parseInt(formData.get('tenors')),
      parseFloat(formData.get('endValue')),
      parseFloat(formData.get('instalmentValue')),
      useGross,
      useGross ? parseFloat(formData.get('vatRate')) : 0
    );

    setLatestResult({
      totalCost: calculator.calculateTotalCost(),
      rrso: calculator.calculateRRSO(),
      grossAmount: calculator.getGrossAmount(),
      grossInstalment: calculator.getGrossInstalment(),
      grossInitialPayment: calculator.getGrossInitialPayment(),
      grossEndValue: calculator.getGrossEndValue(),
      useGross
    });

    setCalculations(prev => [...prev, calculator]);
  };

  const handleDelete = (index) => {
    setCalculations(prev => prev.filter((_, i) => i !== index));
  };

  const handleReuse = (calc) => {
    if (formRef.current) {
      formRef.current.carName.value = calc.carName;
      formRef.current.netAmount.value = calc.netAmount;
      formRef.current.initialPayment.value = calc.initialPayment;
      formRef.current.tenors.value = calc.tenors;
      formRef.current.endValue.value = calc.endValue;
      formRef.current.instalmentValue.value = calc.instalmentValue;
      setUseGross(calc.useGross);
      if (calc.useGross && formRef.current.vatRate) {
        formRef.current.vatRate.value = calc.vatRate;
      }
    }
  };

  return (
    <div className="App">
      <h1>Leasing Calculator</h1>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Car Name</label>
          <input name="carName" type="text" defaultValue="Tesla" required />
        </div>
        <div className="tax-controls">
          <div className="toggle-container">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={useGross} 
                onChange={(e) => setUseGross(e.target.checked)} 
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Use Gross (VAT)</span>
          </div>
          {useGross && (
            <div className="form-group">
              <label>VAT Rate (%)</label>
              <input name="vatRate" type="number" defaultValue="23" required={useGross} />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Net Amount</label>
          <input name="netAmount" type="number" defaultValue="200000" required />
        </div>
        <div className="form-group">
          <label>Initial Payment</label>
          <input name="initialPayment" type="number" defaultValue="20000" required />
        </div>
        <div className="form-group">
          <label>Tenors (months)</label>
          <input name="tenors" type="number" defaultValue="36" required />
        </div>
        <div className="form-group">
          <label>End Value</label>
          <input name="endValue" type="number" defaultValue="80000" required />
        </div>
        <div className="form-group">
          <label>Instalment Value</label>
          <input name="instalmentValue" type="number" defaultValue="3500" required />
        </div>
        <button type="submit">Calculate</button>
      </form>

      {latestResult && (
        <div className="result">
          <h2>Latest Result</h2>
          <p>Total Cost {latestResult.useGross ? '(Gross)' : '(Net)'}: {latestResult.totalCost.toFixed(2)}</p>
          <p>RRSO: {latestResult.rrso.toFixed(2)}%</p>
          {latestResult.useGross && (
            <>
              <p>Gross Amount: {latestResult.grossAmount.toFixed(2)}</p>
              <p>Gross Initial Payment: {latestResult.grossInitialPayment.toFixed(2)}</p>
              <p>Gross Instalment: {latestResult.grossInstalment.toFixed(2)}</p>
              <p>Gross End Value: {latestResult.grossEndValue.toFixed(2)}</p>
            </>
          )}
        </div>
      )}

      {calculations.length > 0 && (
        <div className="history">
          <h2>All Calculations</h2>
          <table>
            <thead>
              <tr>
                <th>Car Name</th>
                <th>{useGross ? 'Gross Amount' : 'Net Amount'}</th>
                <th>{useGross ? 'Gross Initial' : 'Initial Payment'}</th>
                <th>Tenors</th>
                <th>{useGross ? 'Gross End Value' : 'End Value'}</th>
                <th>{useGross ? 'Gross Instalment' : 'Instalment'}</th>
                <th>Total Cost</th>
                <th>RRSO (%)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...calculations]
                .sort((a, b) => a.calculateRRSO() - b.calculateRRSO())
                .map((calc, index) => (
                  <tr key={index}>
                    <td>{calc.carName}</td>
                    <td>{calc.useGross ? calc.getGrossAmount().toFixed(2) : calc.netAmount.toFixed(2)}</td>
                    <td>{calc.useGross ? calc.getGrossInitialPayment().toFixed(2) : calc.initialPayment.toFixed(2)}</td>
                    <td>{calc.tenors}</td>
                    <td>{calc.useGross ? calc.getGrossEndValue().toFixed(2) : calc.endValue.toFixed(2)}</td>
                    <td>{calc.useGross ? calc.getGrossInstalment().toFixed(2) : calc.instalmentValue.toFixed(2)}</td>
                    <td>{calc.calculateTotalCost().toFixed(2)}</td>
                    <td>{calc.calculateRRSO().toFixed(2)}</td>
                    <td className="actions">
                      <div className="action-buttons">
                        <button 
                          className="reuse-btn" 
                          onClick={() => handleReuse(calc)}
                          title="Reuse calculation"
                          type="button"
                        >
                          ↺
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDelete(index)}
                          title="Delete calculation"
                          type="button"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
