import React from 'react';
import { Lightbulb, AlertTriangle, ArrowRight, ShieldCheck, DollarSign, Target } from 'lucide-react';

export const BusinessRecommendations: React.FC = () => {
  const recommendations = [
    {
      id: 'REC-01',
      title: 'Incentivize Annual Contract Conversions ("Loyalty Lock")',
      category: 'Contract Architecture',
      priority: 'Critical',
      observed_pattern:
        'Month-to-month contracts suffer an alarming 42.71% churn rate, while One-year and Two-year contracts experience only 11.27% and 2.83% churn respectively.',
      supporting_statistics: [
        'Month-to-month Churn: 42.71% (1,655 out of 3,875 customers)',
        'One-year Churn: 11.27% (166 out of 1,473 customers)',
        'Two-year Churn: 2.83% (48 out of 1,695 customers)',
        'Statistical Test: Chi-Square = 1,184.60, df = 2, p < 0.0001',
      ],
      business_implication:
        'Month-to-month subscribers experience zero switching barriers. Because 55% of the total customer base is on flexible month-to-month terms, over half of the company’s recurring revenue is permanently at risk on a 30-day cycle.',
      suggested_retention_action:
        'Deploy a structured "Loyalty Lock" conversion campaign offering a 12% discount on monthly billing or a complimentary speed upgrade for converting to a 12-month agreement. A 20% conversion of the month-to-month cohort would preserve ~$380,000 in annual recurring revenue.',
    },
    {
      id: 'REC-02',
      title: 'Automate Electronic Check Invoicing via "AutoPay & Save"',
      category: 'Payment Operations',
      priority: 'High',
      observed_pattern:
        'Customers paying via Electronic Check churn at 45.29% (1,071 churned), whereas automated billing methods (Bank Transfer at 16.71% and Credit Card at 15.24%) have approximately one-third the churn rate.',
      supporting_statistics: [
        'Electronic Check: 45.29% Churn Rate (1,071 / 2,365 customers)',
        'Mailed Check: 19.11% Churn Rate (308 / 1,612 customers)',
        'Bank Transfer (Auto): 16.71% Churn Rate (258 / 1,544 customers)',
        'Credit Card (Auto): 15.24% Churn Rate (232 / 1,522 customers)',
        'Statistical Test: Chi-Square = 648.41, df = 3, p < 0.0001',
      ],
      business_implication:
        'Electronic check payments require active monthly manual initiation, creating a monthly point of financial friction where subscribers re-evaluate carrier value and encounter payment failure/NSF churn.',
      suggested_retention_action:
        'Implement an "AutoPay & Save" $5 monthly statement credit for subscribers migrating from Electronic Check to automated ACH or Credit Card payment. Streamline 1-click autopay enrollment directly within monthly SMS and email invoicing notifications.',
    },
    {
      id: 'REC-03',
      title: 'Fiber Optic Service Quality & Latency Optimization Audit',
      category: 'Infrastructure & Pricing',
      priority: 'Critical',
      observed_pattern:
        'Fiber optic subscribers experience a 41.89% churn rate, compared to 18.96% for DSL and 7.40% for no-internet users, despite paying a premium average of $91.50/month.',
      supporting_statistics: [
        'Fiber Optic Churn: 41.89% (1,297 / 3,096 customers)',
        'DSL Churn: 18.96% (459 / 2,421 customers)',
        'No Internet Churn: 7.40% (113 / 1,526 customers)',
        'Price Gap: Fiber customers pay +$33.40/month higher than DSL',
      ],
      business_implication:
        'Fiber optic is the primary premium growth engine, yet subscribers are defecting at twice the rate of copper broadband. High monthly invoices amplify dissatisfaction with even minor connection hiccups, driving rapid defection to competing fiber networks.',
      suggested_retention_action:
        'Conduct immediate network telemetry audits across regional fiber hubs. Introduce an entry-tier 300Mbps fiber tier at $65/month to bridge the price cliff, and provide a 99.9% uptime SLA credit guarantee for premium gigabit subscribers.',
    },
    {
      id: 'REC-04',
      title: 'Proactive 90-Day "Welcome Flight" Onboarding Program',
      category: 'Customer Success',
      priority: 'High',
      observed_pattern:
        'Average tenure for churned subscribers is only 17.98 months (versus 37.57 months for retained). Over 33% of all churn occurs during the first 6 months, with Month 1 being the peak modal attrition point.',
      supporting_statistics: [
        '0–12 Month Tenure Churn Rate: 47.44% (1,037 / 2,186 customers)',
        '49–72 Month Tenure Churn Rate: 6.61% (143 / 2,163 customers)',
        'Welch t-Test: t = -34.82, df = 4048.3, p < 0.0001 (Tenure Significance)',
      ],
      business_implication:
        'Peak defection happens before the customer ever settles into a routine. New subscribers face equipment setup friction, Wi-Fi coverage deadzones, or initial billing confusion that turns into immediate cancellation.',
      suggested_retention_action:
        'Institute a mandatory "Welcome Flight" customer onboarding workflow: automated setup verification check-in at Day 3, complimentary Wi-Fi coverage optimization call at Day 21, and first-bill review consultation at Day 30.',
    },
    {
      id: 'REC-05',
      title: 'Default Inclusion of Tech Support and Online Security Bundles',
      category: 'Product Bundling',
      priority: 'Medium',
      observed_pattern:
        'Customers without Tech Support churn at 41.64%, compared to only 15.17% with Tech Support. Online Security similarly drops churn from 41.77% down to 14.61%.',
      supporting_statistics: [
        'Without Tech Support Churn: 41.64% (1,446 / 3,473 customers)',
        'With Tech Support Churn: 15.17% (310 / 2,044 customers)',
        'Without Online Security Churn: 41.77% (1,461 / 3,498 customers)',
        'With Online Security Churn: 14.61% (295 / 2,019 customers)',
      ],
      business_implication:
        'Digital security and customer support tools build deep operational stickiness and human trust with the carrier. When sold as expensive individual add-ons, adoption remains below 30%.',
      suggested_retention_action:
        'Repackage broadband tiers to bundle "Care & Security" (Tech Support + Cloud Backup + Online Protection) into base subscriptions at zero marginal charge for the first 6 months, increasing switching friction and customer lifetime value.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#F5F7FA] flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#FFA940]" />
            Data-Driven Retention Strategy Blueprint
          </h3>
          <p className="text-xs text-[#9BAFC8] mt-1">
            Empirically verified business interventions formulated directly from statistical tests, SQLite cohort analysis, and pricing elasticity data.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#081426] px-3 py-1.5 rounded-lg border border-[#263B59] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#19C5E8]" />
          <span>5 Priority Initiatives</span>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isCritical = rec.priority === 'Critical';
          const isHigh = rec.priority === 'High';

          return (
            <div
              key={rec.id}
              className="bg-[#12243F] border border-[#263B59] rounded-xl p-5 space-y-4 shadow-xl hover:border-[#2684FF]/60 transition-colors"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#263B59]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#19C5E8] bg-[#081426] px-2.5 py-1 rounded border border-[#263B59]">
                    {rec.id}
                  </span>
                  <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#9BAFC8]">{rec.category}</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded font-mono text-[11px] ${
                      isCritical
                        ? 'bg-[#FF5C5C]/20 text-[#FF5C5C]'
                        : isHigh
                        ? 'bg-[#FFA940]/20 text-[#FFA940]'
                        : 'bg-[#2684FF]/20 text-[#2684FF]'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                </div>
              </div>

              {/* 2-Column Split: Observed Pattern & Statistics vs Business Implication & Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs leading-relaxed">
                {/* Left: Observations & Supporting Statistics */}
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-[#19C5E8] block mb-1">
                      Observed Empirical Pattern:
                    </span>
                    <p className="text-[#F5F7FA]">{rec.observed_pattern}</p>
                  </div>

                  <div className="bg-[#081426] p-3 rounded-lg border border-[#263B59]/60">
                    <span className="text-[11px] font-semibold text-[#9BAFC8] block mb-1.5 font-mono uppercase">
                      Supporting Statistical Evidence:
                    </span>
                    <ul className="space-y-1 font-mono text-[11px] text-[#9BAFC8] tabular-nums">
                      {rec.supporting_statistics.map((stat, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <span className="text-[#2684FF]">•</span>
                          <span>{stat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: Implication & Action */}
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-[#FFA940] block mb-1">
                      Business & Revenue Implication:
                    </span>
                    <p className="text-[#9BAFC8]">{rec.business_implication}</p>
                  </div>

                  <div className="bg-[#0B1830] p-3 rounded-lg border border-[#2684FF]/40 text-[#F5F7FA]">
                    <span className="text-[11px] font-bold text-[#2684FF] block mb-1 uppercase tracking-wider">
                      Suggested Retention Action:
                    </span>
                    <p className="text-white leading-relaxed">{rec.suggested_retention_action}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
