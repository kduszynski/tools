import React from 'react';
import { useTranslation } from 'react-i18next';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFReport } from './PDFReport';

export const CalculationsList = ({ calculations, isCompany, onDelete, onReuse }) => {
  const { t } = useTranslation();

  if (calculations.length === 0) {
    return null;
  }

  return (
    <div className="calculations-list">
      <div className="list-header">
        <h2>
          <span className="material-icons section-icon">history</span>
          {t('calculations.title')}
        </h2>
        <PDFDownloadLink
          document={<PDFReport calculations={calculations} isCompany={isCompany} />}
          fileName={t('calculations.pdf.filename')}
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
              <th><span className="material-icons table-icon">event</span>{t('calculations.table.date')}</th>
              <th><span className="material-icons table-icon">directions_car</span>{t('calculations.table.name')}</th>
              <th><span className="material-icons table-icon">price_change</span>{t('calculations.table.netAmount')}</th>
              <th><span className="material-icons table-icon">euro</span>{t('calculations.table.grossAmount')}</th>
              <th><span className="material-icons table-icon">payments</span>{t('calculations.table.netMonthly')}</th>
              <th><span className="material-icons table-icon">euro</span>{t('calculations.table.grossMonthly')}</th>
              <th><span className="material-icons table-icon">calendar_month</span>{t('calculations.table.tenors')}</th>
              <th><span className="material-icons table-icon">percent</span>{t('calculations.table.rrso')}</th>
              <th><span className="material-icons table-icon">payments</span>{t('calculations.table.netInterest')}</th>
              <th><span className="material-icons table-icon">euro</span>{t('calculations.table.grossInterest')}</th>
              {isCompany && <th><span className="material-icons table-icon">savings</span>{t('calculations.table.deductedMonthly')}</th>}
              <th><span className="material-icons table-icon">more_horiz</span>{t('calculations.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {calculations.map((calc, index) => (
              <tr key={index}>
                <td>{new Date(calc.createdAt).toLocaleDateString()}</td>
                <td>{calc.name}</td>
                <td>{calc.netAmount.toFixed(2)}</td>
                <td>{calc.getGrossValue(calc.netAmount).toFixed(2)}</td>
                <td>{calc.instalmentValue.toFixed(2)}</td>
                <td>{calc.getGrossValue(calc.instalmentValue).toFixed(2)}</td>
                <td>{calc.tenors}</td>
                <td>{calc.calculateRRSO().toFixed(2)}%</td>
                <td>{calc.calculateNetCost().toFixed(2)}</td>
                <td>{calc.calculateGrossCost().toFixed(2)}</td>
                {isCompany && <td>{calc.calculateDeductedInstalment().toFixed(2)}</td>}
                <td className="actions">
                  <button onClick={() => onReuse(calc)} title={t('calculations.table.reuse')}>
                    <span className="material-icons">replay</span>
                  </button>
                  <button onClick={() => onDelete(calc.createdAt)} title={t('calculations.table.delete')}>
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