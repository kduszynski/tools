import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFReport } from './PDFReport';

export const CalculationsList = ({ calculations, isCompany, onDelete, onReuse }) => {
  if (calculations.length === 0) {
    return null;
  }

  return (
    <div className="calculations-list">
      <div className="list-header">
        <h2>
          <span className="material-icons section-icon">history</span>
          Previous Calculations
        </h2>
        <PDFDownloadLink
          document={<PDFReport calculations={calculations} isCompany={isCompany} />}
          fileName="leasing-calculations.pdf"
          className="pdf-button"
        >
          {({ loading }) => (
            loading ? (
              <span className="material-icons">hourglass_empty</span>
            ) : (
              <span className="material-icons">picture_as_pdf</span>
            )
          )}
        </PDFDownloadLink>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th><span className="material-icons table-icon">event</span>Date</th>
              <th><span className="material-icons table-icon">directions_car</span>Name</th>
              <th><span className="material-icons table-icon">price_change</span>Net Amount</th>
              <th><span className="material-icons table-icon">euro</span>Gross Amount</th>
              <th><span className="material-icons table-icon">payments</span>Net Monthly</th>
              <th><span className="material-icons table-icon">euro</span>Gross Monthly</th>
              <th><span className="material-icons table-icon">calendar_month</span>Tenors</th>
              <th><span className="material-icons table-icon">percent</span>RRSO</th>
              {isCompany && <th><span className="material-icons table-icon">savings</span>Deducted Monthly</th>}
              <th><span className="material-icons table-icon">more_horiz</span>Actions</th>
            </tr>
          </thead>
          <tbody>
            {calculations.map((calc, index) => (
              <tr key={index}>
                <td>{calc.getFormattedDate()}</td>
                <td>{calc.name}</td>
                <td>{calc.netAmount.toFixed(2)}</td>
                <td>{calc.getGrossAmount().toFixed(2)}</td>
                <td>{calc.instalmentValue.toFixed(2)}</td>
                <td>{calc.getGrossInstalment().toFixed(2)}</td>
                <td>{calc.tenors}</td>
                <td>{calc.calculateRRSO().toFixed(2)}%</td>
                {isCompany && (
                  <td>{calc.calculateDeductedInstalment()?.toFixed(2) || '-'}</td>
                )}
                <td className="actions">
                  <button onClick={() => onReuse(calc)} className="reuse-button" title="Reuse">
                    <span className="material-icons">refresh</span>
                  </button>
                  <button onClick={() => onDelete(index)} className="delete-button" title="Delete">
                    <span className="material-icons">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 