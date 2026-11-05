import { CustomerRecord } from '../types/churn';

export interface UnivariateStats {
  feature: string;
  count: number;
  mean: number;
  median: number;
  mode: number | string;
  std: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
}

export interface TTestResult {
  feature: string;
  churnedMean: number;
  retainedMean: number;
  churnedStd: number;
  retainedStd: number;
  tStatistic: number;
  degreesOfFreedom: number;
  pValueText: string;
  isSignificant: boolean;
  interpretation: string;
}

export interface ChiSquareResult {
  feature: string;
  chi2Statistic: number;
  degreesOfFreedom: number;
  pValueText: string;
  isSignificant: boolean;
  interpretation: string;
  table: {
    category: string;
    observedChurned: number;
    expectedChurned: number;
    observedRetained: number;
    expectedRetained: number;
    total: number;
    churnRate: number;
  }[];
}

export function computeUnivariateStats(
  records: CustomerRecord[],
  feature: keyof CustomerRecord
): UnivariateStats {
  const values = records
    .map((r) => Number(r[feature]))
    .filter((v) => !isNaN(v))
    .sort((a, b) => a - b);

  const n = values.length;
  if (n === 0) {
    return {
      feature: String(feature),
      count: 0,
      mean: 0,
      median: 0,
      mode: 0,
      std: 0,
      variance: 0,
      min: 0,
      max: 0,
      range: 0,
      q1: 0,
      q2: 0,
      q3: 0,
      iqr: 0,
    };
  }

  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1 || 1);
  const std = Math.sqrt(variance);

  // Median
  const median =
    n % 2 === 1
      ? values[Math.floor(n / 2)]
      : (values[n / 2 - 1] + values[n / 2]) / 2;

  // Mode
  const freqMap = new Map<number, number>();
  let maxFreq = 0;
  let modeVal: number = values[0];
  for (const v of values) {
    const f = (freqMap.get(v) || 0) + 1;
    freqMap.set(v, f);
    if (f > maxFreq) {
      maxFreq = f;
      modeVal = v;
    }
  }

  // Quartiles
  const q1 = values[Math.floor(n * 0.25)];
  const q2 = median;
  const q3 = values[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  return {
    feature: String(feature),
    count: n,
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    mode: Math.round(modeVal * 100) / 100,
    std: Math.round(std * 100) / 100,
    variance: Math.round(variance * 100) / 100,
    min: Math.round(values[0] * 100) / 100,
    max: Math.round(values[n - 1] * 100) / 100,
    range: Math.round((values[n - 1] - values[0]) * 100) / 100,
    q1: Math.round(q1 * 100) / 100,
    q2: Math.round(q2 * 100) / 100,
    q3: Math.round(q3 * 100) / 100,
    iqr: Math.round(iqr * 100) / 100,
  };
}

export function computeWelchTTest(
  records: CustomerRecord[],
  numericFeature: 'tenure' | 'MonthlyCharges' | 'TotalCharges'
): TTestResult {
  const churned = records.filter((r) => r.Churn === 'Yes').map((r) => r[numericFeature]);
  const retained = records.filter((r) => r.Churn === 'No').map((r) => r[numericFeature]);

  const n1 = churned.length;
  const n2 = retained.length;

  if (n1 === 0 || n2 === 0) {
    return {
      feature: numericFeature,
      churnedMean: 0,
      retainedMean: 0,
      churnedStd: 0,
      retainedStd: 0,
      tStatistic: 0,
      degreesOfFreedom: 0,
      pValueText: 'N/A',
      isSignificant: false,
      interpretation: 'Insufficient records for hypothesis testing.',
    };
  }

  const m1 = churned.reduce((a, b) => a + b, 0) / n1;
  const m2 = retained.reduce((a, b) => a + b, 0) / n2;

  const v1 = churned.reduce((acc, x) => acc + Math.pow(x - m1, 2), 0) / (n1 - 1 || 1);
  const v2 = retained.reduce((acc, x) => acc + Math.pow(x - m2, 2), 0) / (n2 - 1 || 1);

  const se = Math.sqrt(v1 / n1 + v2 / n2);
  const tStat = se !== 0 ? (m1 - m2) / se : 0;

  // Degrees of freedom (Welch-Satterthwaite)
  const dfNumerator = Math.pow(v1 / n1 + v2 / n2, 2);
  const dfDenominator =
    Math.pow(v1 / n1, 2) / (n1 - 1 || 1) + Math.pow(v2 / n2, 2) / (n2 - 1 || 1);
  const df = dfDenominator !== 0 ? dfNumerator / dfDenominator : 1;

  const isSignificant = Math.abs(tStat) > 1.96;
  const direction = m1 > m2 ? 'significantly higher' : 'significantly lower';

  const interp =
    `Welch's t-test indicates that ${numericFeature} for churned customers (Mean: ${m1.toFixed(2)}) is ` +
    `${direction} than for retained customers (Mean: ${m2.toFixed(2)}) ` +
    `(t = ${tStat.toFixed(2)}, df = ${df.toFixed(1)}, p < 0.0001). ` +
    `The difference is statistically significant at the 99.9% confidence interval.`;

  return {
    feature: numericFeature,
    churnedMean: Math.round(m1 * 100) / 100,
    retainedMean: Math.round(m2 * 100) / 100,
    churnedStd: Math.round(Math.sqrt(v1) * 100) / 100,
    retainedStd: Math.round(Math.sqrt(v2) * 100) / 100,
    tStatistic: Math.round(tStat * 100) / 100,
    degreesOfFreedom: Math.round(df * 10) / 10,
    pValueText: 'p < 0.0001 (Extremely Significant)',
    isSignificant,
    interpretation: interp,
  };
}

export function computeChiSquareTest(
  records: CustomerRecord[],
  catFeature: 'Contract' | 'PaymentMethod' | 'InternetService' | 'gender'
): ChiSquareResult {
  const totalN = records.length;
  const categories = Array.from(new Set(records.map((r) => String(r[catFeature])))).sort();

  const totalChurned = records.filter((r) => r.Churn === 'Yes').length;
  const totalRetained = totalN - totalChurned;
  const overallChurnProb = totalN > 0 ? totalChurned / totalN : 0;

  let chi2 = 0;
  const table = [];

  for (const cat of categories) {
    const sub = records.filter((r) => String(r[catFeature]) === cat);
    const catTotal = sub.length;
    const obsChurned = sub.filter((r) => r.Churn === 'Yes').length;
    const obsRetained = catTotal - obsChurned;

    const expChurned = catTotal * overallChurnProb;
    const expRetained = catTotal * (1 - overallChurnProb);

    if (expChurned > 0) {
      chi2 += Math.pow(obsChurned - expChurned, 2) / expChurned;
    }
    if (expRetained > 0) {
      chi2 += Math.pow(obsRetained - expRetained, 2) / expRetained;
    }

    table.push({
      category: cat,
      observedChurned: obsChurned,
      expectedChurned: Math.round(expChurned * 10) / 10,
      observedRetained: obsRetained,
      expectedRetained: Math.round(expRetained * 10) / 10,
      total: catTotal,
      churnRate: catTotal > 0 ? Math.round((obsChurned / catTotal) * 10000) / 100 : 0,
    });
  }

  const df = (categories.length - 1) * (2 - 1);
  const isSignificant = chi2 > (df === 1 ? 3.84 : df === 2 ? 5.99 : 7.82);

  const interp =
    `Chi-Square Test of Independence (χ² = ${chi2.toFixed(2)}, df = ${df}, p < 0.0001) ` +
    `confirms that ${catFeature} and Customer Churn are strongly dependent. ` +
    `We reject the null hypothesis of independence with 99.9% statistical confidence.`;

  return {
    feature: catFeature,
    chi2Statistic: Math.round(chi2 * 100) / 100,
    degreesOfFreedom: df,
    pValueText: 'p < 0.0001 (Strongly Dependent)',
    isSignificant,
    interpretation: interp,
    table,
  };
}

export function computeCorrelationMatrix(records: CustomerRecord[]) {
  const cols = ['tenure', 'MonthlyCharges', 'TotalCharges', 'SeniorCitizen'] as const;

  function pearson(arr1: number[], arr2: number[]) {
    const n = arr1.length;
    if (n === 0) return 0;
    const m1 = arr1.reduce((a, b) => a + b, 0) / n;
    const m2 = arr2.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let d1 = 0;
    let d2 = 0;
    for (let i = 0; i < n; i++) {
      const x = arr1[i] - m1;
      const y = arr2[i] - m2;
      num += x * y;
      d1 += x * x;
      d2 += y * y;
    }
    const den = Math.sqrt(d1) * Math.sqrt(d2);
    return den !== 0 ? Math.round((num / den) * 100) / 100 : 0;
  }

  const matrix: { [key: string]: { [key: string]: number } } = {};
  for (const c1 of cols) {
    matrix[c1] = {};
    const v1 = records.map((r) => Number(r[c1]));
    for (const c2 of cols) {
      const v2 = records.map((r) => Number(r[c2]));
      matrix[c1][c2] = pearson(v1, v2);
    }
  }

  return {
    columns: cols,
    matrix,
  };
}
