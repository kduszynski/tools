import React, { useState } from 'react';
import './App.css';

class LeasingCalculator {
  constructor(carName, netAmount, initialPayment, tenors, endValue, instalmentValue) {
    this.carName = carName;
    this.netAmount = netAmount;
    this.initialPayment = initialPayment;
    this.tenors = tenors;
    this.endValue = endValue;
    this.instalmentValue = instalmentValue;
  }

  calculateTotalCost() {
    return this.initialPayment + (this.instalmentValue * this.tenors) + this.endValue;
  }

  calculateRRSO() {
    const totalInterest = this.calculateTotalCost() - this.netAmount;
    return (totalInterest / this.netAmount) * 100;
  }
}

function App() {
  const [calculations, setCalculations] = useState([]);
  const [latestResult, setLatestResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const calculator = new LeasingCalculator(
      formData.get('carName'),
      parseFloat(formData.get('netAmount')),
      parseFloat(formData.get('initialPayment')),
      parseInt(formData.get('tenors')),
      parseFloat(formData.get('endValue')),
      parseFloat(formData.get('instalmentValue'))
    );

    setLatestResult({
      totalCost: calculator.calculateTotalCost(),
      rrso: calculator.calculateRRSO()
    });

    setCalculations(prev => [...prev, calculator]);
  };

  return (
    <div className="App">
      <h1>Leasing Calculator</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Car Name</label>
          <input name="carName" type="text" defaultValue="Tesla Model 3" required />
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
          <p>Total Cost: {latestResult.totalCost.toFixed(2)}</p>
          <p>RRSO: {latestResult.rrso.toFixed(2)}%</p>
        </div>
      )}

      {calculations.length > 0 && (
        <div className="history">
          <h2>All Calculations</h2>
          <table>
            <thead>
              <tr>
                <th>Car Name</th>
                <th>Net Amount</th>
                <th>Initial Payment</th>
                <th>Tenors</th>
                <th>End Value</th>
                <th>Instalment</th>
                <th>Total Cost</th>
                <th>RRSO (%)</th>
              </tr>
            </thead>
            <tbody>
              {[...calculations]
                .sort((a, b) => a.calculateRRSO() - b.calculateRRSO())
                .map((calc, index) => (
                  <tr key={index}>
                    <td>{calc.carName}</td>
                    <td>{calc.netAmount.toFixed(2)}</td>
                    <td>{calc.initialPayment.toFixed(2)}</td>
                    <td>{calc.tenors}</td>
                    <td>{calc.endValue.toFixed(2)}</td>
                    <td>{calc.instalmentValue.toFixed(2)}</td>
                    <td>{calc.calculateTotalCost().toFixed(2)}</td>
                    <td>{calc.calculateRRSO().toFixed(2)}</td>
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
