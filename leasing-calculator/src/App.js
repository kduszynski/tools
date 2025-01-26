import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import './App.css';

const CURRENT_VERSION = 1;

class LeasingCalculator {
  static VERSION = CURRENT_VERSION;

  constructor(name, netAmount, initialPayment, tenors, endValue, instalmentValue, useGross = false, vatRate = 0, isCompany = false, deductionPercentage = 50) {
    this.version = CURRENT_VERSION;
    this.name = name;
    this.netAmount = netAmount;
    this.initialPayment = initialPayment;
    this.tenors = tenors;
    this.endValue = endValue;
    this.instalmentValue = instalmentValue;
    this.useGross = useGross;
    this.vatRate = vatRate;
    this.isCompany = isCompany;
    this.deductionPercentage = deductionPercentage;
    this.createdAt = new Date().toISOString();
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

  calculateDeductedInstalment() {
    if (!this.isCompany) return null;
    
    const grossInstalment = this.getGrossInstalment();
    const vatPart = this.useGross ? grossInstalment - this.instalmentValue : 0;
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

function migrateCalculation(calc) {
  if (!calc.version || calc.version < CURRENT_VERSION) {
    // Migration logic for future versions
    // Example:
    // if (calc.version < 2) {
    //   calc.newField = defaultValue;
    // }
    // if (calc.version < 3) {
    //   calc.anotherNewField = anotherDefaultValue;
    // }
    calc.version = CURRENT_VERSION;
  }
  return calc;
}

const styles = StyleSheet.create({
  page: { padding: 20 },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: { width: '10%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: 2, fontSize: 8 },
  tableHeader: { margin: 2, fontSize: 8, fontWeight: 'bold' }
});

const CalculationsPDF = ({ calculations, useGross, isCompany }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Date</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Name</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>{useGross ? 'Gross Amount' : 'Net Amount'}</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>{useGross ? 'Gross Initial' : 'Initial Payment'}</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Tenors</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>{useGross ? 'Gross End Value' : 'End Value'}</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>{useGross ? 'Gross Instalment' : 'Instalment'}</Text></View>
          {isCompany && <View style={styles.tableCol}><Text style={styles.tableHeader}>Instalment After Deductions</Text></View>}
          <View style={styles.tableCol}><Text style={styles.tableHeader}>Total Cost</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableHeader}>RRSO (%)</Text></View>
        </View>
        {calculations.map((calc, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.getFormattedDate()}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.name}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.useGross ? calc.getGrossAmount().toFixed(2) : calc.netAmount.toFixed(2)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.useGross ? calc.getGrossInitialPayment().toFixed(2) : calc.initialPayment.toFixed(2)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.tenors}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.useGross ? calc.getGrossEndValue().toFixed(2) : calc.endValue.toFixed(2)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.useGross ? calc.getGrossInstalment().toFixed(2) : calc.instalmentValue.toFixed(2)}</Text></View>
            {isCompany && <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.calculateDeductedInstalment()?.toFixed(2)}</Text></View>}
            <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.calculateTotalCost().toFixed(2)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.calculateRRSO().toFixed(2)}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

function App() {
  const [calculations, setCalculations] = useState(() => {
    const saved = localStorage.getItem('leasingCalculations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const storage = Array.isArray(parsed) ? { version: 0, calculations: parsed } : parsed;
        
        if (storage.version !== CURRENT_VERSION) {
          const migratedCalculations = storage.calculations.map(calc => {
            const migrated = migrateCalculation(calc);
            return Object.assign(new LeasingCalculator(), migrated);
          });
          return migratedCalculations;
        }
        
        return storage.calculations.map(calc => Object.assign(new LeasingCalculator(), calc));
      } catch (error) {
        console.error('Failed to load calculations:', error);
        return [];
      }
    }
    return [];
  });
  const [useGross, setUseGross] = useState(false);
  const [isCompany, setIsCompany] = useState(true);
  const [notification, setNotification] = useState(null);
  const formRef = React.useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('leasingCalculations', JSON.stringify({
        version: CURRENT_VERSION,
        calculations
      }));
    } catch (error) {
      console.error('Failed to save calculations:', error);
    }
  }, [calculations]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const calculator = new LeasingCalculator(
      formData.get('name'),
      parseFloat(formData.get('netAmount')),
      parseFloat(formData.get('initialPayment')),
      parseInt(formData.get('tenors')),
      parseFloat(formData.get('endValue')),
      parseFloat(formData.get('instalmentValue')),
      useGross,
      useGross ? parseFloat(formData.get('vatRate')) : 0,
      isCompany,
      isCompany ? parseFloat(formData.get('deductionPercentage')) : 50
    );

    setCalculations(prev => [...prev, calculator]);
    showNotification('Calculation completed and saved successfully!');
  };

  const handleDelete = (index) => {
    setCalculations(prev => prev.filter((_, i) => i !== index));
    showNotification('Calculation deleted');
  };

  const handleReuse = (calc) => {
    if (formRef.current) {
      formRef.current.name.value = calc.name;
      formRef.current.netAmount.value = calc.netAmount;
      formRef.current.initialPayment.value = calc.initialPayment;
      formRef.current.tenors.value = calc.tenors;
      formRef.current.endValue.value = calc.endValue;
      formRef.current.instalmentValue.value = calc.instalmentValue;
      setUseGross(calc.useGross);
      if (calc.useGross && formRef.current.vatRate) {
        formRef.current.vatRate.value = calc.vatRate;
      }
      showNotification('Calculation loaded to form');
    }
  };

  return (
    <div className="App">
      <h1>Leasing Calculator</h1>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input name="name" type="text" defaultValue="Tesla" required />
        </div>
        <div className="tax-controls">
          <div className="control-row">
            <div className="toggle-container">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={isCompany} 
                  onChange={(e) => setIsCompany(e.target.checked)} 
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Company Leasing</span>
            </div>
            {isCompany && (
              <div className="form-group">
                <label>Deduction Percentage (%)</label>
                <input name="deductionPercentage" type="number" defaultValue="50" min="0" max="100" required={isCompany} />
              </div>
            )}
          </div>
          <div className="control-row">
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
        </div>
        <div className="form-group">
          <label>Net Amount</label>
          <input name="netAmount" type="number" defaultValue="200000" required />
        </div>
        <div className="form-group">
          <label>Initial Payment</label>
          <input name="initialPayment" type="number" defaultValue="20000" step="1000" required />
        </div>
        <div className="form-group">
          <label>Tenors (months)</label>
          <input name="tenors" type="number" defaultValue="36" step="1" required />
        </div>
        <div className="form-group">
          <label>End Value</label>
          <input name="endValue" type="number" defaultValue="80000" step="1000" required />
        </div>
        <div className="form-group">
          <label>Instalment Value</label>
          <input name="instalmentValue" type="number" defaultValue="3500" required />
        </div>
        <button type="submit">Calculate</button>
      </form>

      {calculations.length > 0 && (
        <div className="history">
          <h2>All Calculations</h2>
          <div style={{ marginBottom: '20px' }}>
            <PDFDownloadLink
              document={<CalculationsPDF calculations={calculations} useGross={useGross} isCompany={isCompany} />}
              fileName="leasing-calculations.pdf"
              style={{
                textDecoration: 'none',
                padding: '10px',
                color: '#4a4a4a',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Generating PDF...' : 'Export to PDF'
              }
            </PDFDownloadLink>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>{useGross ? 'Gross Amount' : 'Net Amount'}</th>
                <th>{useGross ? 'Gross Initial' : 'Initial Payment'}</th>
                <th>Tenors</th>
                <th>{useGross ? 'Gross End Value' : 'End Value'}</th>
                <th>{useGross ? 'Gross Instalment' : 'Instalment'}</th>
                {isCompany && <th>Instalment After Deductions</th>}
                <th>Total Cost</th>
                <th>RRSO (%)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...calculations]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((calc, index) => (
                  <tr key={index}>
                    <td data-label="Date">{calc.getFormattedDate()}</td>
                    <td data-label="Name">{calc.name}</td>
                    <td data-label={useGross ? 'Gross Amount' : 'Net Amount'}>{calc.useGross ? calc.getGrossAmount().toFixed(2) : calc.netAmount.toFixed(2)}</td>
                    <td data-label={useGross ? 'Gross Initial' : 'Initial Payment'}>{calc.useGross ? calc.getGrossInitialPayment().toFixed(2) : calc.initialPayment.toFixed(2)}</td>
                    <td data-label="Tenors">{calc.tenors}</td>
                    <td data-label={useGross ? 'Gross End Value' : 'End Value'}>{calc.useGross ? calc.getGrossEndValue().toFixed(2) : calc.endValue.toFixed(2)}</td>
                    <td data-label={useGross ? 'Gross Instalment' : 'Instalment'}>{calc.useGross ? calc.getGrossInstalment().toFixed(2) : calc.instalmentValue.toFixed(2)}</td>
                    {isCompany && <td data-label="Instalment After Deductions">{calc.calculateDeductedInstalment()?.toFixed(2)}</td>}
                    <td data-label="Total Cost">{calc.calculateTotalCost().toFixed(2)}</td>
                    <td data-label="RRSO (%)">{calc.calculateRRSO().toFixed(2)}</td>
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
