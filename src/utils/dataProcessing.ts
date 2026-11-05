import Papa from 'papaparse';
import { CustomerRecord, FilterState, KPISummary, DataQualityReportData } from '../types/churn';

export function parseRawCSV(csvContent: string): {
  records: CustomerRecord[];
  report: DataQualityReportData;
} {
  const result = Papa.parse(csvContent.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  const rawRows = result.data as Record<string, string>[];
  const seenIds = new Set<string>();
  let duplicateCount = 0;
  let missingValuesFixed = 0;
  const records: CustomerRecord[] = [];

  for (const row of rawRows) {
    const rawId = (row.customerID || '').trim();
    if (!rawId) continue;

    if (seenIds.has(rawId)) {
      duplicateCount++;
      continue;
    }
    seenIds.add(rawId);

    // Handle TotalCharges missing/whitespace
    let totalCharges = 0;
    const tcStr = (row.TotalCharges || '').trim();
    if (!tcStr) {
      missingValuesFixed++;
      totalCharges = 0;
    } else {
      const parsedTc = parseFloat(tcStr);
      if (isNaN(parsedTc)) {
        missingValuesFixed++;
        totalCharges = 0;
      } else {
        totalCharges = Math.round(parsedTc * 100) / 100;
      }
    }

    const monthlyCharges = Math.round(parseFloat(row.MonthlyCharges || '0') * 100) / 100 || 0;
    const tenure = parseInt(row.tenure || '0', 10) || 0;
    const senior = parseInt(row.SeniorCitizen || '0', 10) || 0;

    const churnVal = (row.Churn || '').trim().toLowerCase();
    const churnFormatted: 'Yes' | 'No' = churnVal === 'yes' ? 'Yes' : 'No';

    records.push({
      customerID: rawId,
      gender: row.gender || 'Male',
      SeniorCitizen: senior,
      Partner: row.Partner || 'No',
      Dependents: row.Dependents || 'No',
      tenure,
      PhoneService: row.PhoneService || 'Yes',
      MultipleLines: row.MultipleLines || 'No',
      InternetService: row.InternetService || 'No',
      OnlineSecurity: row.OnlineSecurity || 'No',
      OnlineBackup: row.OnlineBackup || 'No',
      DeviceProtection: row.DeviceProtection || 'No',
      TechSupport: row.TechSupport || 'No',
      StreamingTV: row.StreamingTV || 'No',
      StreamingMovies: row.StreamingMovies || 'No',
      Contract: row.Contract || 'Month-to-month',
      PaperlessBilling: row.PaperlessBilling || 'No',
      PaymentMethod: row.PaymentMethod || 'Electronic check',
      MonthlyCharges: monthlyCharges,
      TotalCharges: totalCharges,
      Churn: churnFormatted,
    });
  }

  // Calculate IQR for MonthlyCharges and TotalCharges
  const mcSorted = records.map((r) => r.MonthlyCharges).sort((a, b) => a - b);
  const tcSorted = records.map((r) => r.TotalCharges).sort((a, b) => a - b);

  function getIQR(arr: number[]) {
    const n = arr.length;
    if (n === 0) return { q1: 0, q3: 0, iqr: 0, lowerBound: 0, upperBound: 0, outlierCount: 0 };
    const q1 = arr[Math.floor(n * 0.25)];
    const q3 = arr[Math.floor(n * 0.75)];
    const iqr = Math.round((q3 - q1) * 100) / 100;
    const lowerBound = Math.round((q1 - 1.5 * iqr) * 100) / 100;
    const upperBound = Math.round((q3 + 1.5 * iqr) * 100) / 100;
    const outlierCount = arr.filter((x) => x < lowerBound || x > upperBound).length;
    return { q1, q3, iqr, lowerBound, upperBound, outlierCount };
  }

  const columns = result.meta.fields || [
    'customerID',
    'gender',
    'SeniorCitizen',
    'Partner',
    'Dependents',
    'tenure',
    'PhoneService',
    'MultipleLines',
    'InternetService',
    'OnlineSecurity',
    'OnlineBackup',
    'DeviceProtection',
    'TechSupport',
    'StreamingTV',
    'StreamingMovies',
    'Contract',
    'PaperlessBilling',
    'PaymentMethod',
    'MonthlyCharges',
    'TotalCharges',
    'Churn',
  ];

  const columnSchemas = columns.map((col) => {
    const sampleRecord = records[0] as unknown as Record<string, unknown>;
    const sampleVal = sampleRecord ? String(sampleRecord[col] ?? '') : '';
    const isNum = ['tenure', 'SeniorCitizen', 'MonthlyCharges', 'TotalCharges'].includes(col);
    const uniqueVals = new Set(records.map((r) => (r as unknown as Record<string, unknown>)[col]));
    return {
      name: col,
      dataType: isNum ? 'Numeric (FLOAT / INT)' : 'Categorical (TEXT)',
      sampleValue: sampleVal,
      uniqueCount: uniqueVals.size,
      hasNulls: col === 'TotalCharges' && missingValuesFixed > 0,
    };
  });

  const report: DataQualityReportData = {
    totalRows: records.length,
    totalColumns: columns.length,
    duplicateCount,
    missingValuesFixed,
    monthlyChargesIQR: getIQR(mcSorted),
    totalChargesIQR: getIQR(tcSorted),
    columnSchemas,
  };

  return { records, report };
}

export function filterRecords(records: CustomerRecord[], filters: FilterState): CustomerRecord[] {
  return records.filter((r) => {
    if (filters.gender !== 'All' && r.gender !== filters.gender) return false;
    if (filters.contract !== 'All' && r.Contract !== filters.contract) return false;
    if (filters.internetService !== 'All' && r.InternetService !== filters.internetService) return false;
    if (filters.paymentMethod !== 'All' && r.PaymentMethod !== filters.paymentMethod) return false;
    if (r.tenure < filters.tenureRange[0] || r.tenure > filters.tenureRange[1]) return false;
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      const matchId = r.customerID.toLowerCase().includes(q);
      const matchContract = r.Contract.toLowerCase().includes(q);
      const matchPayment = r.PaymentMethod.toLowerCase().includes(q);
      if (!matchId && !matchContract && !matchPayment) return false;
    }
    return true;
  });
}

export function computeKPISummary(records: CustomerRecord[]): KPISummary {
  const total = records.length;
  if (total === 0) {
    return {
      totalCustomers: 0,
      activeCustomers: 0,
      churnedCustomers: 0,
      churnRate: 0,
      avgMonthlyCharges: 0,
      totalMonthlyRevenue: 0,
      avgTenure: 0,
      avgTotalCharges: 0,
    };
  }

  let churned = 0;
  let totalMonthlyRev = 0;
  let totalTenure = 0;
  let totalOverallCharges = 0;

  for (const r of records) {
    if (r.Churn === 'Yes') churned++;
    totalMonthlyRev += r.MonthlyCharges;
    totalTenure += r.tenure;
    totalOverallCharges += r.TotalCharges;
  }

  return {
    totalCustomers: total,
    activeCustomers: total - churned,
    churnedCustomers: churned,
    churnRate: Math.round((churned / total) * 10000) / 100,
    avgMonthlyCharges: Math.round((totalMonthlyRev / total) * 100) / 100,
    totalMonthlyRevenue: Math.round(totalMonthlyRev * 100) / 100,
    avgTenure: Math.round((totalTenure / total) * 10) / 10,
    avgTotalCharges: Math.round((totalOverallCharges / total) * 100) / 100,
  };
}

export function exportRecordsToCSV(records: CustomerRecord[], filename: string = 'Telco-Customer-Churn-Cleaned.csv') {
  const csv = Papa.unparse(records);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
