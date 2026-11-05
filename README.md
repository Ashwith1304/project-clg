# CUSTOMER CHURN ANALYSIS AND BUSINESS INTELLIGENCE DASHBOARD
### An Interactive Data Analytics Platform for Understanding Customer Retention

**Academic Institution:** Sreenidhi Institute of Science and Technology (SNIST)  
**Department:** Computer Science and Engineering – Data Science  
**Academic Year:** 2024–2028  

### Project Team Members
- **G Mythili** – Roll No: `24311A67H8`
- **K Ashiwith** – Roll No: `24311A67H6`
- **D Niyati** – Roll No: `24311A67H7`

---

## 1. Project Overview & Problem Statement

Customer churn represents one of the most critical challenges facing the modern telecommunications industry. Acquiring a new subscriber is estimated to cost between five and seven times more than retaining an existing customer.

This college-level Data Science and Data Analytics project constructs an enterprise-grade Business Intelligence platform to investigate the behavioral, transactional, and service-oriented patterns that drive customer defection. 

> **Important Scope Note:** This project strictly uses empirical Data Analytics, Descriptive Statistics, Parametric & Non-Parametric Hypothesis Testing, Relational SQL Analytics, and Business Intelligence. No predictive machine learning models or classification algorithms are used, ensuring 100% transparency, interpretability, and verifiable factual ground truth.

---

## 2. Project Objectives

- **Investigate Drivers of Attrition:** Identify why subscribers defect and which contract or payment mechanisms exhibit extreme attrition.
- **Data Quality & Validation:** Establish an automated cleaning pipeline that handles whitespace values, type casts numeric charges, and computes Interquartile Range (IQR) outlier boundaries.
- **Relational SQL Analytics:** Ingest records into an indexed SQLite database to answer 10 fundamental executive business questions.
- **Statistical Rigor:** Perform Welch's two-sample $t$-tests on continuous variables and Pearson Chi-Square ($\chi^2$) tests of independence on categorical predictors.
- **Executive Decision Support:** Deliver targeted, financially quantified retention strategies with clear ROI justification.

---

## 3. Dataset Description

The project is grounded on the canonical **IBM Telco Customer Churn** dataset.
- **Total Records:** 7,043 customer accounts
- **Total Features:** 21 attributes (19 categorical/demographic/service variables, 2 numerical billing metrics, 1 binary target `Churn`)
- **Key Fields:**
  - `customerID`: Unique alphanumeric subscriber identification.
  - `gender`, `SeniorCitizen`, `Partner`, `Dependents`: Demographic profiles.
  - `tenure`: Number of months the customer has subscribed to the carrier.
  - `PhoneService`, `MultipleLines`, `InternetService`: Primary communication infrastructure.
  - `OnlineSecurity`, `OnlineBackup`, `DeviceProtection`, `TechSupport`, `StreamingTV`, `StreamingMovies`: Value-added digital services.
  - `Contract`: Commitment model (`Month-to-month`, `One year`, `Two year`).
  - `PaperlessBilling`, `PaymentMethod`: Invoicing and settlement channels.
  - `MonthlyCharges`, `TotalCharges`: Continuous revenue metrics.
  - `Churn`: Target indicator (`Yes` = Defected, `No` = Retained).

---

## 4. Technology Stack & Architecture

### Backend & Analytics
- **Python 3.10+**: Core analytical scripts and processing logic.
- **Pandas & NumPy**: Tabular data manipulation, cohort aggregation, and linear algebra.
- **SciPy / Math**: Welch's $t$-test and Pearson Chi-Square test statistics.
- **SQLite 3**: Embedded relational database for SQL queries.

### Visualizations & Interactive UI
- **React 19 & Tailwind CSS**: Modern dark navy executive platform (#081426, #0B1830, #12243F).
- **Plotly.py & Plotly.js / Chart.js**: Interactive choropleths, histograms, scatter plots, box plots, and donuts.
- **Streamlit**: Python-native rapid analytical dashboard deployment option.
- **sql.js (WebAssembly SQLite)**: In-browser relational SQL execution with live query execution.

### Architectural Pipeline

```
IBM TELCO DATASET (CSV)
        │
        ▼
DATA INPUT & VALIDATION (Type parsing, null checking)
        │
        ▼
DATA CLEANING & TRANSFORMATION (TotalCharges imputation, IQR)
        │
        ▼
SQLITE DATABASE (Relational Schema & Indexing)
        │
        ▼
ANALYTICS ENGINE (EDA + Statistics + SQL Queries)
        │
        ▼
VISUALIZATION ENGINE (Plotly Interactive Charts)
        │
        ▼
BUSINESS INTELLIGENCE DASHBOARD (9 Integrated Views)
        │
        ▼
DATA-DRIVEN BUSINESS RECOMMENDATIONS
```

---

## 5. Repository File Structure

```
customer-churn-analysis/
├── data/
│   ├── raw/
│   │   └── Telco-Customer-Churn.csv
│   └── processed/
│       └── Telco-Customer-Churn-Cleaned.csv
├── database/
│   └── churn.db
├── src/
│   ├── data_cleaning.py
│   ├── descriptive_statistics.py
│   ├── eda.py
│   ├── sql_analysis.py
│   └── business_insights.py
├── app/
│   └── streamlit_app.py
├── reports/
│   └── business_insights.md
├── notebooks/
│   └── exploratory_analysis.ipynb
├── requirements.txt
├── package.json
└── README.md
```

---

## 6. Summary of Key Analytical Findings

1. **Baseline Churn Rate:** Exactly **26.54%** (1,869 churned out of 7,043 subscribers).
2. **Contract Disparity:** Month-to-month contracts account for **88.5%** of all churned customers with a **42.71%** failure rate, compared to **2.83%** for two-year contracts ($\chi^2 = 1,184.60$, $p < 0.0001$).
3. **Payment Friction:** Electronic Check users churn at **45.29%**, compared to **15.24%** for automated credit cards ($\chi^2 = 648.41$, $p < 0.0001$).
4. **Early Lifecycle Vulnerability:** Over **33%** of all cancellations occur within the first 6 months. Average tenure for churned subscribers is **17.98 months** versus **37.57 months** for retained subscribers ($t = -34.82$, $p < 0.0001$).
5. **Price Sensitivity:** Churned users paid a mean monthly charge of **$74.44** versus **$61.27** for retained users ($t = 18.41$, $p < 0.0001$).

---

## 7. Installation & Execution Guide

### Windows PowerShell Quickstart

```powershell
# 1. Clone repository and navigate to folder
git clone https://github.com/your-username/customer-churn-analysis.git
cd customer-churn-analysis

# 2. Create and activate a Python virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Install required Python packages
pip install -r requirements.txt

# 4. Run the data cleaning pipeline and generate the SQLite database
python src/data_cleaning.py

# 5. Execute the statistical analysis and SQL analytical queries
python src/descriptive_statistics.py
python src/sql_analysis.py

# 6. Launch the Python Streamlit Web Dashboard
streamlit run app/streamlit_app.py

# 7. (Alternative) Launch the Full-Stack Web Application
npm install
npm run dev
```

The application will open in your default browser at `http://localhost:3000` or `http://localhost:8501`.

---

## 8. Academic Integrity & Acknowledgements

This project was developed by third-year Computer Science and Engineering (Data Science) students at **Sreenidhi Institute of Science and Technology** under the academic mentorship of the Department faculty. All statistical numbers, SQL query results, and data figures are generated directly from the IBM Telco dataset.
