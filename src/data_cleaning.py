"""
Data Cleaning and Preprocessing Module for Telco Customer Churn Analysis.
Handles missing values, data type conversions, outlier analysis, and SQLite export.
"""

import os
import csv
import sqlite3
from typing import Dict, List, Tuple, Any

class DataCleaner:
    def __init__(self, raw_filepath: str, processed_filepath: str, db_filepath: str):
        self.raw_filepath = raw_filepath
        self.processed_filepath = processed_filepath
        self.db_filepath = db_filepath
        self.records: List[Dict[str, Any]] = []
        self.quality_report: Dict[str, Any] = {}

    def load_and_clean(self) -> List[Dict[str, Any]]:
        """Loads raw CSV, detects missing/whitespace values, formats types and deduplicates."""
        if not os.path.exists(self.raw_filepath):
            raise FileNotFoundError(f"Raw data file not found at {self.raw_filepath}")

        raw_count = 0
        missing_total_charges = 0
        duplicates = 0
        seen_ids = set()
        cleaned_records = []

        with open(self.raw_filepath, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            self.fieldnames = reader.fieldnames or []
            for row in reader:
                raw_count += 1
                cust_id = row.get("customerID", "").strip()
                
                # Check duplicates
                if cust_id in seen_ids:
                    duplicates += 1
                    continue
                seen_ids.add(cust_id)

                # TotalCharges clean
                raw_tc = row.get("TotalCharges", "").strip()
                if not raw_tc or raw_tc == "":
                    missing_total_charges += 1
                    # New customers with 0 tenure haven't accumulated charges
                    tc_val = 0.0
                else:
                    try:
                        tc_val = float(raw_tc)
                    except ValueError:
                        tc_val = 0.0

                row["TotalCharges"] = str(round(tc_val, 2))
                row["MonthlyCharges"] = str(round(float(row.get("MonthlyCharges", 0)), 2))
                row["tenure"] = str(int(row.get("tenure", 0)))
                row["SeniorCitizen"] = str(int(row.get("SeniorCitizen", 0)))
                cleaned_records.append(row)

        self.records = cleaned_records

        # Calculate Outliers using IQR for MonthlyCharges and TotalCharges
        mc_values = sorted([float(r["MonthlyCharges"]) for r in self.records])
        tc_values = sorted([float(r["TotalCharges"]) for r in self.records])
        
        def calculate_iqr_outliers(vals: List[float]) -> Dict[str, Any]:
            n = len(vals)
            if n == 0:
                return {"q1": 0, "q3": 0, "iqr": 0, "lower_bound": 0, "upper_bound": 0, "outliers_count": 0}
            q1 = vals[int(n * 0.25)]
            q3 = vals[int(n * 0.75)]
            iqr = q3 - q1
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            outliers = [v for v in vals if v < lower or v > upper]
            return {
                "q1": round(q1, 2),
                "q3": round(q3, 2),
                "iqr": round(iqr, 2),
                "lower_bound": round(lower, 2),
                "upper_bound": round(upper, 2),
                "outliers_count": len(outliers)
            }

        self.quality_report = {
            "raw_records": raw_count,
            "cleaned_records": len(self.records),
            "duplicates_removed": duplicates,
            "missing_total_charges_fixed": missing_total_charges,
            "monthly_charges_iqr": calculate_iqr_outliers(mc_values),
            "total_charges_iqr": calculate_iqr_outliers(tc_values),
            "columns_count": len(self.fieldnames),
            "columns": self.fieldnames
        }

        # Save processed CSV
        os.makedirs(os.path.dirname(self.processed_filepath), exist_ok=True)
        with open(self.processed_filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=self.fieldnames)
            writer.writeheader()
            writer.writerows(self.records)

        return self.records

    def export_to_sqlite(self) -> int:
        """Exports the cleaned dataset to SQLite database table telco_churn."""
        if not self.records:
            self.load_and_clean()

        os.makedirs(os.path.dirname(self.db_filepath), exist_ok=True)
        conn = sqlite3.connect(self.db_filepath)
        cur = conn.cursor()

        cur.execute("DROP TABLE IF EXISTS telco_churn")
        cur.execute("""
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
            )
        """)

        insert_sql = """
            INSERT INTO telco_churn VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """
        data = [
            (
                r["customerID"], r["gender"], int(r["SeniorCitizen"]), r["Partner"], r["Dependents"],
                int(r["tenure"]), r["PhoneService"], r["MultipleLines"], r["InternetService"],
                r["OnlineSecurity"], r["OnlineBackup"], r["DeviceProtection"], r["TechSupport"],
                r["StreamingTV"], r["StreamingMovies"], r["Contract"], r["PaperlessBilling"],
                r["PaymentMethod"], float(r["MonthlyCharges"]), float(r["TotalCharges"]), r["Churn"]
            )
            for r in self.records
        ]

        cur.executemany(insert_sql, data)
        conn.commit()
        cur.execute("SELECT COUNT(*) FROM telco_churn")
        count = cur.fetchone()[0]
        conn.close()
        return count

if __name__ == "__main__":
    cleaner = DataCleaner(
        raw_filepath="data/raw/Telco-Customer-Churn.csv",
        processed_filepath="data/processed/Telco-Customer-Churn-Cleaned.csv",
        db_filepath="database/churn.db"
    )
    records = cleaner.load_and_clean()
    db_count = cleaner.export_to_sqlite()
    print(f"Data Cleaning Completed. Processed: {len(records)} rows. SQLite records: {db_count}.")
    print("Quality Report:", cleaner.quality_report)
