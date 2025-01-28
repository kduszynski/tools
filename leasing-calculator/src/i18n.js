import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          app: {
            title: 'Leasing Calculator',
            companyCalculation: 'Company Calculation',
            notifications: {
              calculationSaved: 'Calculation completed and saved successfully!',
              calculationDeleted: 'Calculation deleted',
              valuesLoaded: 'Values loaded to form'
            }
          },
          vehicle: {
            name: 'Vehicle Name',
            netAmount: 'Net Amount',
            grossAmount: 'Gross Amount'
          },
          payment: {
            initialPayment: 'Initial Payment',
            grossInitialPayment: 'Gross Initial Payment',
            endValue: 'End Value',
            grossEndValue: 'Gross End Value',
            instalment: 'Instalment Value',
            grossInstalment: 'Gross Instalment'
          },
          form: {
            vatRate: 'VAT Rate',
            months: 'Months',
            calculate: 'Calculate',
            save: 'Save Calculation',
            discard: 'Discard',
            deductionPercentage: 'VAT Deduction Percentage',
            taxRate: 'Income Tax Rate'
          },
          calculations: {
            title: 'Calculations',
            summary: 'Current calculation',
            table: {
              date: 'Date',
              name: 'Name',
              netAmount: 'Net Amount',
              grossAmount: 'Gross Amount',
              netMonthly: 'Net Instalment Monthly',
              grossMonthly: 'Gross Instalment Monthly',
              tenors: 'Tenors',
              rrso: 'RRSO',
              netInterest: 'Total Net Cost',
              grossInterest: 'Total Gross Cost',
              deductedMonthly: 'Deducted Monthly',
              actions: 'Actions',
              reuse: 'Reuse calculation',
              delete: 'Delete calculation'
            },
            pdf: {
              filename: 'leasing-calculations.pdf',
              download: 'Download PDF'
            }
          }
        }
      },
      pl: {
        translation: {
          app: {
            title: 'Kalkulator Leasingowy',
            companyCalculation: 'Kalkulacja dla firmy',
            notifications: {
              calculationSaved: 'Kalkulacja zakończona i zapisana pomyślnie!',
              calculationDeleted: 'Kalkulacja usunięta',
              valuesLoaded: 'Wartości wczytane do formularza'
            }
          },
          vehicle: {
            name: 'Nazwa pojazdu',
            netAmount: 'Kwota netto',
            grossAmount: 'Kwota brutto'
          },
          payment: {
            initialPayment: 'Wpłata początkowa',
            grossInitialPayment: 'Wpłata początkowa brutto',
            endValue: 'Wartość końcowa',
            grossEndValue: 'Wartość końcowa brutto',
            instalment: 'Rata miesięczna',
            grossInstalment: 'Rata miesięczna brutto'
          },
          form: {
            vatRate: 'Stawka VAT',
            months: 'Liczba miesięcy',
            calculate: 'Oblicz',
            save: 'Zapisz kalkulację',
            discard: 'Odrzuć',
            deductionPercentage: 'Procent odliczenia VAT',
            taxRate: 'Stawka podatku'
          },
          calculations: {
            title: 'Kalkulacje',
            summary: 'Bieżąca kalkulacja',
            table: {
              date: 'Data',
              name: 'Nazwa',
              netAmount: 'Kwota netto',
              grossAmount: 'Kwota brutto',
              netMonthly: 'Rata netto',
              grossMonthly: 'Rata brutto',
              tenors: 'Okres',
              rrso: 'RRSO',
              netInterest: 'Koszt netto',
              grossInterest: 'Koszt brutto',
              deductedMonthly: 'Rata po odliczeniu',
              actions: 'Akcje',
              reuse: 'Użyj ponownie',
              delete: 'Usuń kalkulację'
            },
            pdf: {
              filename: 'kalkulacje-leasingowe.pdf',
              download: 'Pobierz PDF'
            }
          }
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 