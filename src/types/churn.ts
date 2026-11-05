export interface CustomerRecord {
  customerID: string;
  gender: 'Female' | 'Male' | string;
  SeniorCitizen: number;
  Partner: 'Yes' | 'No' | string;
  Dependents: 'Yes' | 'No' | string;
  tenure: number;
  PhoneService: 'Yes' | 'No' | string;
  MultipleLines: 'Yes' | 'No' | 'No phone service' | string;
  InternetService: 'DSL' | 'Fiber optic' | 'No' | string;
  OnlineSecurity: 'Yes' | 'No' | 'No internet service' | string;
  OnlineBackup: 'Yes' | 'No' | 'No internet service' | string;
  DeviceProtection: 'Yes' | 'No' | 'No internet service' | string;
  TechSupport: 'Yes' | 'No' | 'No internet service' | string;
  StreamingTV: 'Yes' | 'No' | 'No internet service' | string;
  StreamingMovies: 'Yes' | 'No' | 'No internet service' | string;
  Contract: 'Month-to-month' | 'One year' | 'Two year' | string;
  PaperlessBilling: 'Yes' | 'No' | string;
  PaymentMethod:
    | 'Electronic check'
    | 'Mailed check'
    | 'Bank transfer (automatic)'
    | 'Credit card (automatic)'
    | string;
  MonthlyCharges: number;
  TotalCharges: number;
  Churn: 'Yes' | 'No' | string;
}

export interface FilterState {
  gender: string;
  contract: string;
  internetService: string;
  paymentMethod: string;
  tenureRange: [number, number];
  searchQuery: string;
}

export interface KPISummary {
  totalCustomers: number;
  activeCustomers: number;
  churnedCustomers: number;
  churnRate: number;
  avgMonthlyCharges: number;
  totalMonthlyRevenue: number;
  avgTenure: number;
  avgTotalCharges: number;
}

export interface DataQualityReportData {
  totalRows: number;
  totalColumns: number;
  duplicateCount: number;
  missingValuesFixed: number;
  monthlyChargesIQR: {
    q1: number;
    q3: number;
    iqr: number;
    lowerBound: number;
    upperBound: number;
    outlierCount: number;
  };
  totalChargesIQR: {
    q1: number;
    q3: number;
    iqr: number;
    lowerBound: number;
    upperBound: number;
    outlierCount: number;
  };
  columnSchemas: {
    name: string;
    dataType: string;
    sampleValue: string;
    uniqueCount: number;
    hasNulls: boolean;
  }[];
}

export interface BusinessQuestion {
  id: number;
  title: string;
  question: string;
  query: string;
  interpretation: string;
  expectedHeaders?: string[];
}

export type PageId =
  | 'overview'
  | 'explorer'
  | 'quality'
  | 'eda'
  | 'statistics'
  | 'sql'
  | 'segmentation'
  | 'recommendations'
  | 'about';
