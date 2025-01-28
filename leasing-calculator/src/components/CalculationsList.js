import React from 'react';
import { useTranslation } from 'react-i18next';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFReport } from './PDFReport';

export const CalculationsList = ({ calculations, onDelete, onReuse }) => {
  const { t, i18n } = useTranslation();
  const hasCompanyCalculations = calculations.some(calc => calc.isCompany);

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const currentLocale = i18n.language;
    return {
      date: date.toLocaleDateString(currentLocale),
      time: date.toLocaleTimeString(currentLocale)
    };
  };

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
          document={<PDFReport calculations={calculations} isCompany={hasCompanyCalculations} />}
          fileName={t('calculations.pdf.filename')}
          className="pdf-button"
        >
          {({ loading }) => (
            <>
              <span className="material-icons">{loading ? 'hourglass_empty' : 'picture_as_pdf'}</span>
              <span>{t('calculations.pdf.download')}</span>
            </>
          )}
        </PDFDownloadLink>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <span className="material-icons table-icon">event</span>
                {t('calculations.table.date')}
              </th>
              <th>
                <span className="material-icons table-icon">directions_car</span>
                {t('calculations.table.name')}
              </th>
              <th>
                <span className="material-icons table-icon">price_change</span>
                {t('calculations.table.netAmount')}
              </th>
              <th>
                <span className="material-icons table-icon">euro</span>
                {t('calculations.table.grossAmount')}
              </th>
              <th>
                <span className="material-icons table-icon">payments</span>
                {t('calculations.table.netMonthly')}
              </th>
              <th>
                <span className="material-icons table-icon">euro</span>
                {t('calculations.table.grossMonthly')}
              </th>
              <th>
                <span className="material-icons table-icon">calendar_month</span>
                {t('calculations.table.tenors')}
              </th>
              <th>
                <span className="material-icons table-icon">percent</span>
                {t('calculations.table.rrso')}
              </th>
              <th>
                <span className="material-icons table-icon">payments</span>
                {t('calculations.table.netInterest')}
              </th>
              <th>
                <span className="material-icons table-icon">euro</span>
                {t('calculations.table.grossInterest')}
              </th>
              {hasCompanyCalculations && (
                <th>
                  <span className="material-icons table-icon">savings</span>
                  {t('calculations.table.deductedMonthly')}
                </th>
              )}
              <th>
                <span className="material-icons table-icon">more_horiz</span>
                {t('calculations.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {calculations.map((calc, index) => {
              const { date, time } = formatDateTime(calc.createdAt);
              return (
                <tr key={index}>
                  <td data-label={t('calculations.table.date')}>
                    <span>{date}</span>
                    <span>{time}</span>
                  </td>
                  <td data-label={t('calculations.table.name')}><span>{calc.name}</span></td>
                  <td data-label={t('calculations.table.netAmount')}><span>{calc.netAmount.toFixed(2)}</span></td>
                  <td data-label={t('calculations.table.grossAmount')}><span>{calc.getGrossAmount().toFixed(2)}</span></td>
                  <td data-label={t('calculations.table.netMonthly')}><span>{calc.instalmentValue.toFixed(2)}</span></td>
                  <td data-label={t('calculations.table.grossMonthly')}><span>{calc.getGrossInstalment().toFixed(2)}</span></td>
                  <td data-label={t('calculations.table.tenors')}><span>{calc.tenors}</span></td>
                  <td data-label={t('calculations.table.rrso')}><span>{calc.calculateRRSO().toFixed(2)}%</span></td>
                  <td data-label={t('calculations.table.netInterest')}><span>{calc.calculateNetCost().toFixed(2)}</span></td>
                  <td data-label={t('calculations.table.grossInterest')}><span>{calc.calculateGrossCost().toFixed(2)}</span></td>
                  {hasCompanyCalculations && (
                    <td data-label={t('calculations.table.deductedMonthly')}>
                      <span>{calc.isCompany ? calc.calculateDeductedInstalment()?.toFixed(2) : '-'}</span>
                    </td>
                  )}
                  <td className="actions">
                    <span>
                    <button onClick={() => onReuse(calc)}>
                      <span className="material-icons">replay</span>
                    </button>
                    <button onClick={() => onDelete(calc.createdAt)}>
                      <span className="material-icons">delete</span>
                    </button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 