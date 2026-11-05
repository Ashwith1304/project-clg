"""
Business Insights and Executive Recommendations Engine.
Maps empirical data patterns to strategic business interventions
for customer retention and revenue protection.
"""

from typing import List, Dict, Any

class BusinessInsightsEngine:
    @staticmethod
    def get_strategic_recommendations() -> List[Dict[str, Any]]:
        return [
            {
                "id": "REC-01",
                "title": "Incentivize Annual Contract Conversions",
                "category": "Contract Architecture",
                "priority": "Critical",
                "observed_pattern": "Month-to-month contracts experience a disastrous 42.71% churn rate, while One-year and Two-year contracts experience only 11.27% and 2.83% churn respectively.",
                "supporting_statistics": {
                    "Month-to-month Churn": "42.71% (1,655 / 3,875 customers)",
                    "One-year Churn": "11.27% (166 / 1,473 customers)",
                    "Two-year Churn": "2.83% (48 / 1,695 customers)",
                    "Chi-Square Statistic": "1,184.60 (p < 0.0001)"
                },
                "business_implication": "Month-to-month customers have zero switching friction. Because 55% of the customer base is on month-to-month terms, over half of recurring revenue is perpetually at risk each billing cycle.",
                "suggested_retention_action": "Introduce a 'Loyalty Lock' promotion: offer a 10-15% discount on monthly bills or free speed upgrades in exchange for signing a 12-month commitment. Even a 20% conversion rate of month-to-month users to annual plans would prevent ~330 customer terminations annually."
            },
            {
                "id": "REC-02",
                "title": "Migrate Customers from Electronic Checks to Automated Billing",
                "category": "Payment Operations",
                "priority": "High",
                "observed_pattern": "Customers paying via Electronic Check churn at 45.29% (1,071 churned), whereas automated payment methods (Bank Transfer at 16.71% and Credit Card at 15.24%) have approximately one-third the churn rate.",
                "supporting_statistics": {
                    "Electronic Check Churn": "45.29% (1,071 / 2,365 customers)",
                    "Mailed Check Churn": "19.11% (308 / 1,612 customers)",
                    "Bank Transfer (Auto) Churn": "16.71% (258 / 1,544 customers)",
                    "Credit Card (Auto) Churn": "15.24% (232 / 1,522 customers)"
                },
                "business_implication": "Electronic check payments require manual monthly authorization, reminding customers of their bill each month and introducing payment friction and involuntary churn due to NSF or banking errors.",
                "suggested_retention_action": "Implement an 'Auto-Pay & Save' $5 monthly bill credit for customers who enroll in ACH or automatic credit card billing. Redesign billing notifications to highlight autopay enrollment with 1-click authorization."
            },
            {
                "id": "REC-03",
                "title": "Audit Fiber Optic Pricing and Service Quality",
                "category": "Product & Infrastructure",
                "priority": "Critical",
                "observed_pattern": "Fiber optic internet subscribers have a 41.89% churn rate, compared to 18.96% for DSL and 7.40% for no-internet users, despite paying a premium average of $91.50/month.",
                "supporting_statistics": {
                    "Fiber Optic Churn": "41.89% (1,297 / 3,096 customers)",
                    "DSL Churn": "18.96% (459 / 2,421 customers)",
                    "No Internet Churn": "7.40% (113 / 1,526 customers)",
                    "Avg Monthly Charges (Fiber)": "$91.50 vs $58.10 (DSL)"
                },
                "business_implication": "Fiber optic is the premium revenue driver, yet customers are abandoning it at more than double the rate of DSL. High prices coupled with potential connection instability or lack of technical support creates buyer's remorse.",
                "suggested_retention_action": "Conduct immediate technical audits of fiber optic regional node latency and dispatch quality. Re-evaluate entry-tier fiber pricing by unbundling premium gigabit tiers into affordable 300Mbps starter packages with dedicated customer support."
            },
            {
                "id": "REC-04",
                "title": "First 90-Day Onboarding & Early Lifecycle Intervention",
                "category": "Customer Success",
                "priority": "High",
                "observed_pattern": "Average tenure of churned customers is only 17.98 months, with over 33% of churn occurring in the first 6 months. Customer tenure is the strongest negative predictor of churn (Welch t-test: -34.82, p < 0.0001).",
                "supporting_statistics": {
                    "Tenure 0-12 Months Churn": "47.44% (1,037 / 2,186 customers)",
                    "Tenure 49-72 Months Churn": "6.61% (143 / 2,163 customers)",
                    "Mean Churned Tenure": "17.98 months vs 37.57 months for retained",
                    "Modal Tenure of Churn": "1 month (peak attrition occurs immediately)"
                },
                "business_implication": "The highest drop-off window occurs right after sign-up, indicating post-installation dissonance, configuration confusion, or poor initial customer care.",
                "suggested_retention_action": "Deploy a white-glove 'Welcome Flight' onboarding program: scheduled check-in calls at Day 7, Day 30, and Day 60; complimentary Wi-Fi optimization; and proactive outreach if initial bandwidth telemetry detects speed degradation."
            },
            {
                "id": "REC-05",
                "title": "Bundle Tech Support and Online Security as Retention Anchors",
                "category": "Service Bundling",
                "priority": "Medium",
                "observed_pattern": "Customers without Tech Support churn at 41.64%, whereas customers with Tech Support churn at only 15.17%. Similarly, Online Security reduces churn from 41.77% down to 14.61%.",
                "supporting_statistics": {
                    "Without Tech Support Churn": "41.64% (1,446 / 3,473 customers)",
                    "With Tech Support Churn": "15.17% (310 / 2,044 customers)",
                    "Without Online Security Churn": "41.77% (1,461 / 3,498 customers)",
                    "With Online Security Churn": "14.61% (295 / 2,019 customers)"
                },
                "business_implication": "Value-added services increase product stickiness and perceived utility. Customers who utilize technical support build emotional and operational trust in the telecom provider.",
                "suggested_retention_action": "Bundle 'Care & Security' (Tech Support + Online Security) into standard broadband packages for free during the first 6 months rather than treating them as costly add-ons."
            }
        ]

if __name__ == "__main__":
    for rec in BusinessInsightsEngine.get_strategic_recommendations():
        print(f"[{rec['priority']}] {rec['title']} ({rec['category']})")
        print("Pattern:", rec["observed_pattern"])
        print("Action:", rec["suggested_retention_action"])
        print("-" * 60)
