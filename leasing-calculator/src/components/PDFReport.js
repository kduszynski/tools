import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  page: { 
    padding: 10,
    fontSize: 8
  },
  table: { 
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000'
  },
  tableRow: { 
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#E0E0E0'
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    color: '#ffffff',
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: '#000'
  },
  tableColHeader: {
    width: '8%',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#E0E0E0',
    padding: 6
  },
  tableCol: {
    width: '8%',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#E0E0E0',
    padding: 4
  },
  tableColWide: {
    width: '12%',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#E0E0E0',
    padding: 4
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 8,
    color: '#ffffff'
  },
  tableCell: {
    fontSize: 8
  },
  section: { 
    marginBottom: 10 
  },
  title: { 
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  }
});

export const PDFReport = ({ calculations, isCompany }) => {
  const { t } = useTranslation();

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Leasing Calculations Report</Text>
          <View style={styles.table}>
            <View style={styles.headerRow}>
              <View style={styles.tableColHeader}><Text style={styles.tableHeader}>{t('calculations.table.date')}</Text></View>
              <View style={styles.tableColWide}><Text style={styles.tableHeader}>{t('calculations.table.name')}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableHeader}>{t('calculations.table.netAmount')}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableHeader}>{t('calculations.table.grossAmount')}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableHeader}>{t('calculations.table.netMonthly')}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableHeader}>{t('calculations.table.grossMonthly')}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableHeader}>{t('calculations.table.tenors')}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableHeader}>{t('calculations.table.rrso')}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableHeader}>{t('calculations.table.netInterest')}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableHeader}>{t('calculations.table.grossInterest')}</Text></View>
              {isCompany && <View style={styles.tableCol}><Text style={styles.tableHeader}>{t('calculations.table.deductedMonthly')}</Text></View>}
            </View>
            {calculations.map((calc, index) => (
              <View style={[styles.tableRow, index % 2 === 0 ? { backgroundColor: '#f8f8f8' } : {}]} key={index}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.getFormattedDate()}</Text></View>
                <View style={styles.tableColWide}><Text style={styles.tableCell}>{calc.name}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.netAmount.toFixed(2)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.getGrossAmount().toFixed(2)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.instalmentValue.toFixed(2)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.getGrossInstalment().toFixed(2)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.tenors}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.calculateRRSO().toFixed(2)}%</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.calculateNetCost().toFixed(2)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.calculateGrossCost().toFixed(2)}</Text></View>
                {isCompany && (
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{calc.calculateDeductedInstalment()?.toFixed(2) || '-'}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}; 