import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20 },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: { width: '10%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: 2, fontSize: 8 },
  tableHeader: { margin: 2, fontSize: 8, fontWeight: 'bold' },
  section: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
});

export const PDFReport = ({ calculations, isCompany }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Leasing Calculations Report</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Date</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Name</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Net Vehicle Amount</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Gross Vehicle Amount</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Net Initial Payment</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Gross Initial Payment</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Net End Value</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Gross End Value</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Net Monthly Instalment</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Gross Monthly Instalment</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>Tenors</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableHeader}>RRSO</Text></View>
            {isCompany && <View style={styles.tableCol}><Text style={styles.tableHeader}>Deducted Monthly</Text></View>}
          </View>
          {calculations.map((calc, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.getFormattedDate()}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.name}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.netAmount.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.getGrossAmount().toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.initialPayment.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.getGrossInitialPayment().toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.endValue.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.getGrossEndValue().toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.instalmentValue.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.getGrossInstalment().toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.tenors}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{calc.calculateRRSO().toFixed(2)}%</Text></View>
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