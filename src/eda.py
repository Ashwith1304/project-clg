"""
Exploratory Data Analysis (EDA) Module for Telco Churn Analysis.
Aggregates univariate, bivariate, and service subscription cross-tabulations
for visualization generation and reporting.
"""

import csv
from typing import Dict, List, Any

class TelcoEDA:
    def __init__(self, data_path: str = "data/processed/Telco-Customer-Churn-Cleaned.csv"):
        self.data_path = data_path
        with open(self.data_path, "r", encoding="utf-8") as f:
            self.records = list(csv.DictReader(f))

    def distribution_summary(self, column: str) -> Dict[str, Any]:
        counts: Dict[str, int] = {}
        churn_counts: Dict[str, int] = {}
        for r in self.records:
            val = r[column]
            counts[val] = counts.get(val, 0) + 1
            if r["Churn"] == "Yes":
                churn_counts[val] = churn_counts.get(val, 0) + 1

        total = len(self.records)
        categories = sorted(list(counts.keys()))
        data = []
        for cat in categories:
            tot = counts[cat]
            ch = churn_counts.get(cat, 0)
            data.append({
                "category": cat,
                "total_customers": tot,
                "pct_of_total": round((tot / total) * 100, 2),
                "churned_customers": ch,
                "retained_customers": tot - ch,
                "churn_rate_pct": round((ch / tot) * 100, 2)
            })
        return {
            "feature": column,
            "data": data
        }

    def tenure_cohort_analysis(self) -> List[Dict[str, Any]]:
        cohorts = [
            ("0-12 Months (New)", 0, 12),
            ("13-24 Months (Established)", 13, 24),
            ("25-48 Months (Loyal)", 25, 48),
            ("49-72 Months (Champion)", 49, 72),
        ]
        results = []
        for label, low, high in cohorts:
            subset = [r for r in self.records if low <= int(r["tenure"]) <= high]
            tot = len(subset)
            churned = sum(1 for r in subset if r["Churn"] == "Yes")
            results.append({
                "cohort": label,
                "range": f"{low}-{high} mos",
                "customer_count": tot,
                "churned_count": churned,
                "churn_rate_pct": round((churned / tot) * 100, 2) if tot > 0 else 0,
                "avg_monthly_charges": round(sum(float(r["MonthlyCharges"]) for r in subset) / tot, 2) if tot > 0 else 0
            })
        return results

    def service_churn_impact(self) -> List[Dict[str, Any]]:
        services = [
            ("OnlineSecurity", "Online Security"),
            ("OnlineBackup", "Online Backup"),
            ("DeviceProtection", "Device Protection"),
            ("TechSupport", "Tech Support"),
            ("StreamingTV", "Streaming TV"),
            ("StreamingMovies", "Streaming Movies")
        ]
        results = []
        for key, name in services:
            with_svc = [r for r in self.records if r[key] == "Yes"]
            without_svc = [r for r in self.records if r[key] == "No"]
            
            w_tot = len(with_svc)
            w_ch = sum(1 for r in with_svc if r["Churn"] == "Yes")
            w_rate = round((w_ch / w_tot) * 100, 2) if w_tot else 0

            wo_tot = len(without_svc)
            wo_ch = sum(1 for r in without_svc if r["Churn"] == "Yes")
            wo_rate = round((wo_ch / wo_tot) * 100, 2) if wo_tot else 0

            results.append({
                "service_name": name,
                "with_service_count": w_tot,
                "with_service_churn_rate": w_rate,
                "without_service_count": wo_tot,
                "without_service_churn_rate": wo_rate,
                "churn_reduction_delta": round(wo_rate - w_rate, 2)
            })
        return results

if __name__ == "__main__":
    eda = TelcoEDA()
    print("Contract Distribution & Churn:")
    print(eda.distribution_summary("Contract"))
    print("\nTenure Cohort Analysis:")
    print(eda.tenure_cohort_analysis())
    print("\nValue Added Services Churn Impact:")
    print(eda.service_churn_impact())
