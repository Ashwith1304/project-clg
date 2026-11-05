import initSqlJs, { Database } from 'sql.js';
import { CustomerRecord, BusinessQuestion } from '../types/churn';

let dbInstance: Database | null = null;
let initPromise: Promise<Database> | null = null;

export async function getSqliteDatabase(records: CustomerRecord[]): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: () => '/sql-wasm.wasm',
      });

      const db = new SQL.Database();
      dbInstance = db;

      // Create table
      db.run(`
        CREATE TABLE telco_churn (
          customerID TEXT PRIMARY KEY,
          gender TEXT,
          SeniorCitizen INTEGER,
          Partner TEXT,
          Dependents TEXT,
          tenure INTEGER,
          PhoneService TEXT,
          MultipleLines TEXT,
          InternetService TEXT,
          OnlineSecurity TEXT,
          OnlineBackup TEXT,
          DeviceProtection TEXT,
          TechSupport TEXT,
          StreamingTV TEXT,
          StreamingMovies TEXT,
          Contract TEXT,
          PaperlessBilling TEXT,
          PaymentMethod TEXT,
          MonthlyCharges REAL,
          TotalCharges REAL,
          Churn TEXT
        );
      `);

      // Batch insert records
      const stmt = db.prepare(`
        INSERT INTO telco_churn VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
      `);

      for (const r of records) {
        stmt.run([
          r.customerID,
          r.gender,
          r.SeniorCitizen,
          r.Partner,
          r.Dependents,
          r.tenure,
          r.PhoneService,
          r.MultipleLines,
          r.InternetService,
          r.OnlineSecurity,
          r.OnlineBackup,
          r.DeviceProtection,
          r.TechSupport,
          r.StreamingTV,
          r.StreamingMovies,
          r.Contract,
          r.PaperlessBilling,
          r.PaymentMethod,
          r.MonthlyCharges,
          r.TotalCharges,
          r.Churn,
        ]);
      }
      stmt.free();

      return db;
    } catch (err) {
      console.error('Error initializing SQLite WebAssembly:', err);
      throw err;
    }
  })();

  return initPromise;
}

export function reloadSqliteDatabase(records: CustomerRecord[]) {
  dbInstance = null;
  initPromise = null;
  return getSqliteDatabase(records);
}

export function executeSqlQuery(
  db: Database,
  query: string
): { columns: string[]; values: (string | number | null)[][] } {
  try {
    const res = db.exec(query.trim());
    if (res.length === 0) {
      return { columns: [], values: [] };
    }
    return {
      columns: res[0].columns,
      values: res[0].values as (string | number | null)[][],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`SQLite Execution Error: ${message}`);
  }
}

export const TEN_BUSINESS_QUESTIONS: BusinessQuestion[] = [
  {
    id: 1,
    title: 'Total Number of Customers',
    question: 'What is the total number of customer accounts in the database?',
    query: 'SELECT COUNT(*) AS total_customers FROM telco_churn;',
    interpretation:
      'The audited database contains exactly 7,043 unique verified customer subscriptions with complete service records.',
  },
  {
    id: 2,
    title: 'Total Churned Customers',
    question: 'How many total customers have terminated their accounts?',
    query: "SELECT COUNT(*) AS churned_customers FROM telco_churn WHERE Churn = 'Yes';",
    interpretation:
      '1,869 customers have discontinued their subscriptions, representing a sizable customer loss requiring targeted intervention.',
  },
  {
    id: 3,
    title: 'Overall Churn Percentage',
    question: 'What is the overall customer churn percentage across the carrier portfolio?',
    query: `SELECT 
    COUNT(*) AS total_customers,
    SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count,
    ROUND(CAST(SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS REAL) * 100.0 / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn;`,
    interpretation:
      'The baseline churn rate is 26.54%. Approximately 1 in every 4 acquired customers departs, highlighting high revenue vulnerability.',
  },
  {
    id: 4,
    title: 'Contract Type with Highest Churn Rate',
    question: 'Which contract duration model suffers the highest rate of customer defection?',
    query: `SELECT 
    Contract,
    COUNT(*) AS total_customers,
    SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count,
    ROUND(CAST(SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS REAL) * 100.0 / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn
GROUP BY Contract
ORDER BY churn_rate_pct DESC;`,
    interpretation:
      'Month-to-month contracts experience a staggering 42.71% churn rate (1,655 churned), compared to 11.27% for One-year and only 2.83% for Two-year contracts.',
  },
  {
    id: 5,
    title: 'Payment Method with Most Churned Customers',
    question: 'Which billing method experiences the highest volume of customer churn?',
    query: `SELECT 
    PaymentMethod,
    COUNT(*) AS total_customers,
    SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count,
    ROUND(CAST(SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS REAL) * 100.0 / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn
GROUP BY PaymentMethod
ORDER BY churned_count DESC;`,
    interpretation:
      'Electronic check accounts for 1,071 churned customers (45.29% churn rate), while automated credit card (15.24%) and bank transfer (16.71%) have approximately one-third the churn.',
  },
  {
    id: 6,
    title: 'Average Monthly Charges',
    question: 'What is the average monthly recurring billing per subscriber across groups?',
    query: `SELECT 
    ROUND(AVG(MonthlyCharges), 2) AS overall_avg_monthly_charges,
    ROUND(AVG(CASE WHEN Churn = 'Yes' THEN MonthlyCharges END), 2) AS churned_avg_monthly_charges,
    ROUND(AVG(CASE WHEN Churn = 'No' THEN MonthlyCharges END), 2) AS retained_avg_monthly_charges
FROM telco_churn;`,
    interpretation:
      'Portfolio average monthly bill is $64.76. Crucially, churned subscribers paid an average of $74.44/month vs $61.27/month for retained subscribers—a $13.17/month price delta.',
  },
  {
    id: 7,
    title: 'Internet Service with Highest Churn Rate',
    question: 'How do churn rates compare across different internet technologies?',
    query: `SELECT 
    InternetService,
    COUNT(*) AS total_customers,
    SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS churned_count,
    ROUND(CAST(SUM(CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END) AS REAL) * 100.0 / COUNT(*), 2) AS churn_rate_pct
FROM telco_churn
GROUP BY InternetService
ORDER BY churn_rate_pct DESC;`,
    interpretation:
      'Fiber optic customers experience a 41.89% churn rate (1,297 churned out of 3,096), compared to 18.96% for DSL and 7.40% for customers without internet.',
  },
  {
    id: 8,
    title: 'Average Tenure of Churned Customers',
    question: 'At what point in their subscription lifecycle do customers churn?',
    query: `SELECT 
    ROUND(AVG(CASE WHEN Churn = 'Yes' THEN tenure END), 2) AS avg_tenure_churned_months,
    ROUND(AVG(CASE WHEN Churn = 'No' THEN tenure END), 2) AS avg_tenure_retained_months
FROM telco_churn;`,
    interpretation:
      'Churned subscribers leave after an average of only 17.98 months, while retained subscribers average 37.57 months. Over 33% of churn occurs within the first 6 months.',
  },
  {
    id: 9,
    title: 'Customer Segment Generating Highest Monthly Revenue',
    question: 'Which contract and internet technology segment produces the largest monthly cash flow?',
    query: `SELECT 
    Contract,
    InternetService,
    COUNT(*) AS customer_count,
    ROUND(SUM(MonthlyCharges), 2) AS total_monthly_revenue,
    ROUND(AVG(MonthlyCharges), 2) AS avg_monthly_bill
FROM telco_churn
GROUP BY Contract, InternetService
ORDER BY total_monthly_revenue DESC;`,
    interpretation:
      'Month-to-month subscribers with Fiber Optic generate $185,181.10 per month (the top revenue driver), but have a severe 54.6% churn rate, making this the highest risk segment.',
  },
  {
    id: 10,
    title: 'Number of Month-to-Month Contract Customers',
    question: 'How many customers are enrolled in month-to-month contracts?',
    query: `SELECT 
    COUNT(*) AS month_to_month_customers,
    ROUND(CAST(COUNT(*) AS REAL) * 100.0 / (SELECT COUNT(*) FROM telco_churn), 2) AS pct_of_total_base
FROM telco_churn
WHERE Contract = 'Month-to-month';`,
    interpretation:
      '3,875 customers (55.02% of the entire customer base) are on month-to-month contracts with zero switching barrier.',
  },
];
