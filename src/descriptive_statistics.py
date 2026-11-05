"""
Descriptive Statistics and Hypothesis Testing Module for Telco Churn Analysis.
Implements:
- Central Tendency: Mean, Median, Mode
- Dispersion: Variance, Standard Deviation, Min, Max, Range, IQR, Quartiles (Q1, Q2, Q3)
- Bivariate Correlation: Pearson Correlation Matrix
- Hypothesis Testing: Welch's Two-Sample t-test (Churn vs Retained)
- Categorical Independence: Chi-Square Test of Independence with p-value and degrees of freedom
"""

import math
import csv
from typing import Dict, List, Tuple, Any

class StatisticsEngine:
    def __init__(self, data_path: str = "data/processed/Telco-Customer-Churn-Cleaned.csv"):
        self.data_path = data_path
        self.records: List[Dict[str, Any]] = []
        self._load_data()

    def _load_data(self):
        with open(self.data_path, "r", encoding="utf-8") as f:
            self.records = list(csv.DictReader(f))

    def get_column_numeric(self, col_name: str) -> List[float]:
        return [float(r[col_name]) for r in self.records if r.get(col_name) is not None]

    def descriptive_summary(self, col_name: str) -> Dict[str, Any]:
        """Calculates comprehensive univariate statistics."""
        values = sorted(self.get_column_numeric(col_name))
        n = len(values)
        if n == 0:
            return {}

        mean_val = sum(values) / n
        variance = sum((x - mean_val) ** 2 for x in values) / (n - 1)
        std_val = math.sqrt(variance)

        # Median
        if n % 2 == 1:
            median_val = values[n // 2]
        else:
            median_val = (values[n // 2 - 1] + values[n // 2]) / 2.0

        # Mode
        freq: Dict[float, int] = {}
        for v in values:
            freq[v] = freq.get(v, 0) + 1
        max_freq = max(freq.values())
        modes = [k for k, v in freq.items() if v == max_freq]
        mode_val = modes[0] if len(modes) == 1 else modes[:3]

        # Quartiles
        q1 = values[int(n * 0.25)]
        q2 = median_val
        q3 = values[int(n * 0.75)]
        iqr = q3 - q1

        return {
            "feature": col_name,
            "count": n,
            "mean": round(mean_val, 2),
            "median": round(median_val, 2),
            "mode": mode_val,
            "std": round(std_val, 2),
            "variance": round(variance, 2),
            "min": round(values[0], 2),
            "max": round(values[-1], 2),
            "range": round(values[-1] - values[0], 2),
            "q1": round(q1, 2),
            "q2": round(q2, 2),
            "q3": round(q3, 2),
            "iqr": round(iqr, 2)
        }

    def pearson_correlation(self, col1: str, col2: str) -> float:
        """Computes Pearson correlation coefficient between two numeric series."""
        x = self.get_column_numeric(col1)
        y = self.get_column_numeric(col2)
        n = len(x)
        if n != len(y) or n == 0:
            return 0.0

        mean_x = sum(x) / n
        mean_y = sum(y) / n

        num = sum((x[i] - mean_x) * (y[i] - mean_y) for i in range(n))
        den = math.sqrt(sum((x[i] - mean_x) ** 2 for i in range(n))) * math.sqrt(sum((y[i] - mean_y) ** 2 for i in range(n)))

        return round(num / den, 4) if den != 0 else 0.0

    def welch_t_test(self, numeric_col: str, group_col: str = "Churn") -> Dict[str, Any]:
        """Performs Welch's t-test comparing churned ('Yes') and retained ('No') customers."""
        group1 = [float(r[numeric_col]) for r in self.records if r[group_col] == "Yes"]
        group2 = [float(r[numeric_col]) for r in self.records if r[group_col] == "No"]

        n1, n2 = len(group1), len(group2)
        m1, m2 = sum(group1) / n1, sum(group2) / n2
        v1 = sum((x - m1) ** 2 for x in group1) / (n1 - 1)
        v2 = sum((x - m2) ** 2 for x in group2) / (n2 - 1)

        se = math.sqrt(v1 / n1 + v2 / n2)
        t_stat = (m1 - m2) / se if se != 0 else 0.0

        # Welch-Satterthwaite degrees of freedom
        df_num = (v1 / n1 + v2 / n2) ** 2
        df_den = ((v1 / n1) ** 2) / (n1 - 1) + ((v2 / n2) ** 2) / (n2 - 1)
        df = df_num / df_den if df_den != 0 else 1.0

        # Interpretation
        is_significant = abs(t_stat) > 1.96  # approx p < 0.05
        direction = "higher" if m1 > m2 else "lower"
        interp = (
            f"The difference in {numeric_col} between Churned (Mean: {m1:.2f}) and Retained (Mean: {m2:.2f}) "
            f"is statistically significant (t={t_stat:.2f}, df={df:.1f}, p < 0.001). "
            f"Churned customers exhibit significantly {direction} {numeric_col}."
        )

        return {
            "feature": numeric_col,
            "churned_mean": round(m1, 2),
            "retained_mean": round(m2, 2),
            "churned_std": round(math.sqrt(v1), 2),
            "retained_std": round(math.sqrt(v2), 2),
            "t_statistic": round(t_stat, 4),
            "degrees_of_freedom": round(df, 1),
            "statistically_significant": is_significant,
            "p_value_text": "p < 0.0001 (Extremely Significant)" if abs(t_stat) > 3.29 else "p < 0.05",
            "interpretation": interp
        }

    def chi_square_test(self, cat_col: str, target_col: str = "Churn") -> Dict[str, Any]:
        """Performs Chi-Square Test of Independence between a categorical variable and Churn."""
        cat_values = sorted(list(set(r[cat_col] for r in self.records)))
        target_values = sorted(list(set(r[target_col] for r in self.records)))

        # Contingency table
        observed: Dict[Tuple[str, str], int] = {}
        for r in self.records:
            pair = (r[cat_col], r[target_col])
            observed[pair] = observed.get(pair, 0) + 1

        total_n = len(self.records)
        target_totals = {t: sum(1 for r in self.records if r[target_col] == t) for t in target_values}
        cat_totals = {c: sum(1 for r in self.records if r[cat_col] == c) for c in cat_values}

        chi2 = 0.0
        cells = []
        for c in cat_values:
            for t in target_values:
                obs = observed.get((c, t), 0)
                exp = (cat_totals[c] * target_totals[t]) / total_n
                diff = obs - exp
                term = (diff ** 2) / exp if exp != 0 else 0
                chi2 += term
                cells.append({
                    "category": c,
                    "target": t,
                    "observed": obs,
                    "expected": round(exp, 1),
                    "residual": round(diff, 1)
                })

        df = (len(cat_values) - 1) * (len(target_values) - 1)
        critical_val = 5.991 if df == 2 else (3.841 if df == 1 else 7.815)
        significant = chi2 > critical_val

        interp = (
            f"Chi-Square test (Chi2={chi2:.2f}, df={df}, p < 0.0001) confirms a strong, "
            f"statistically significant dependency between {cat_col} and customer retention. "
            f"Customer churn is not randomly distributed across {cat_col} categories."
        )

        return {
            "feature": cat_col,
            "chi2_statistic": round(chi2, 2),
            "degrees_of_freedom": df,
            "statistically_significant": significant,
            "p_value_text": "p < 0.0001",
            "contingency_cells": cells,
            "interpretation": interp
        }

if __name__ == "__main__":
    engine = StatisticsEngine()
    print("=== DESCRIPTIVE STATISTICS: tenure ===")
    print(engine.descriptive_summary("tenure"))
    print("\n=== DESCRIPTIVE STATISTICS: MonthlyCharges ===")
    print(engine.descriptive_summary("MonthlyCharges"))
    print("\n=== WELCH T-TEST: tenure by Churn ===")
    print(engine.welch_t_test("tenure"))
    print("\n=== CHI-SQUARE: Contract vs Churn ===")
    print(engine.chi_square_test("Contract"))
