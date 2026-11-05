# Executive Business Insights & Strategic Retention Report
## Customer Churn Analysis and Business Intelligence Platform

**Academic Institution:** Sreenidhi Institute of Science and Technology  
**Department:** Computer Science and Engineering – Data Science  
**Authors:** G Mythili (24311A67H8), K Ashiwith (24311A67H6), D Niyati (24311A67H7)  
**Dataset:** IBM Telco Customer Churn (7,043 Records, 21 Features)

---

## 1. Executive Summary

This study conducted an empirical data analytics, statistical hypothesis testing, and relational SQL investigation into subscriber attrition within the IBM Telco telecommunications portfolio.

Out of 7,043 audited customer records:
- **Baseline Churn Rate:** 26.54% (1,869 churned vs. 5,174 retained accounts).
- **Monthly Revenue at Risk:** Over $139,130 in monthly recurring charges lost from churned subscribers.
- **Critical Failure Horizon:** 33.6% of all customer churn occurs during the first 6 months of contract activation, with the mode of churn tenure occurring at Month 1.

---

## 2. Key Statistical Findings

### A. Contract Structure Dominance
- **Month-to-month contracts:** 42.71% churn rate (1,655 churned / 3,875 total).
- **One-year contracts:** 11.27% churn rate (166 churned / 1,473 total).
- **Two-year contracts:** 2.83% churn rate (48 churned / 1,695 total).
- **Statistical Significance:** $\chi^2 = 1,184.60$, degrees of freedom $= 2$, $p < 0.0001$.
- **Interpretation:** Customers on month-to-month contracts have zero switching barriers. Month-to-month subscribers represent 55.02% of the total customer base, creating an existential business risk.

### B. Payment Method Friction & Vulnerability
- **Electronic Check:** 45.29% churn rate (1,071 churned out of 2,365).
- **Mailed Check:** 19.11% churn rate (308 churned out of 1,612).
- **Bank Transfer (Automatic):** 16.71% churn rate (258 churned out of 1,544).
- **Credit Card (Automatic):** 15.24% churn rate (232 churned out of 1,522).
- **Statistical Significance:** $\chi^2 = 648.41$, degrees of freedom $= 3$, $p < 0.0001$.
- **Interpretation:** Electronic check payments necessitate active monthly manual payment, prompting customers to evaluate their bill each month. Automatic payment methods reduce churn by almost two-thirds.

### C. Internet Technology Discrepancy
- **Fiber Optic:** 41.89% churn rate (1,297 / 3,096).
- **DSL:** 18.96% churn rate (459 / 2,421).
- **No Internet:** 7.40% churn rate (113 / 1,526).
- **Price Disparity:** Fiber optic users pay an average of $91.50/month versus $58.10/month for DSL. High pricing coupled with service delivery expectations drives higher defection.

### D. Welch's Two-Sample t-Tests
1. **Monthly Charges ($):**
   - Churned Mean: $74.44 (Std: $24.67)
   - Retained Mean: $61.27 (Std: $31.09)
   - $t = 18.41$, $df = 4,135.8$, $p < 0.0001$.
   - **Conclusion:** Churned customers paid a statistically significant $13.17 higher monthly fee on average.

2. **Customer Tenure (Months):**
   - Churned Mean: 17.98 months (Std: 19.53)
   - Retained Mean: 37.57 months (Std: 24.11)
   - $t = -34.82$, $df = 4,048.3$, $p < 0.0001$.
   - **Conclusion:** Churned customers depart nearly 20 months earlier than retained cohorts.

---

## 3. Targeted Business Action Plan

1. **Strategic Contract Migration Campaign:**
   - Offer a $10/month billing incentive or free premium streaming bundle for customers converting from month-to-month to 12-month or 24-month terms.
2. **Automated Autopay Adoption Incentive:**
   - Provide an instant $5 recurring monthly bill credit for migrating from Electronic Check to ACH or Credit Card Autopay.
3. **90-Day Early Tenure "White-Glove" Onboarding:**
   - Implement scheduled proactive customer success check-ins at Day 7, Day 30, and Day 60 to resolve setup, equipment, or Wi-Fi coverage issues before early cancellation.
4. **Value-Added Service Bundles:**
   - Bundle Tech Support and Online Security into entry-level broadband tiers to anchor customer loyalty and reduce churn by up to 26 percentage points.
