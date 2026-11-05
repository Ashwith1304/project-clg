import React, { useState } from 'react';
import { CustomerRecord } from '../types/churn';
import { BarChart, BarDataPoint } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import { HistogramChart } from '../components/charts/HistogramChart';
import { BoxPlotChart } from '../components/charts/BoxPlotChart';

interface ExploratoryAnalysisProps {
  records: CustomerRecord[];
}

export const ExploratoryAnalysis: React.FC<ExploratoryAnalysisProps> = ({ records }) => {
  const [activeTab, setActiveTab] = useState<'demographics' | 'billing' | 'services'>('demographics');

  // 1. Gender Churn
  const genders = ['Female', 'Male'];
  const genderData: BarDataPoint[] = genders.map((g) => {
    const subset = records.filter((r) => r.gender === g);
    const tot = subset.length;
    const churned = subset.filter((r) => r.Churn === 'Yes').length;
    return {
      label: g,
      value: tot - churned,
      secondaryValue: churned,
      rate: tot > 0 ? Math.round((churned / tot) * 1000) / 10 : 0,
      color: '#2684FF',
      secondaryColor: '#FF5C5C',
    };
  });

  // 2. Senior Citizen Churn
  const seniorData: BarDataPoint[] = [
    { label: 'Non-Senior', subset: records.filter((r) => r.SeniorCitizen === 0) },
    { label: 'Senior Citizen', subset: records.filter((r) => r.SeniorCitizen === 1) },
  ].map(({ label, subset }) => {
    const tot = subset.length;
    const churned = subset.filter((r) => r.Churn === 'Yes').length;
    return {
      label,
      value: tot - churned,
      secondaryValue: churned,
      rate: tot > 0 ? Math.round((churned / tot) * 1000) / 10 : 0,
      color: '#2684FF',
      secondaryColor: '#FF5C5C',
    };
  });

  // 3. Internet Service Churn
  const internetServices = ['DSL', 'Fiber optic', 'No'];
  const internetData: BarDataPoint[] = internetServices.map((inet) => {
    const subset = records.filter((r) => r.InternetService === inet);
    const tot = subset.length;
    const churned = subset.filter((r) => r.Churn === 'Yes').length;
    return {
      label: inet,
      value: tot - churned,
      secondaryValue: churned,
      rate: tot > 0 ? Math.round((churned / tot) * 1000) / 10 : 0,
      color: '#2684FF',
      secondaryColor: '#FF5C5C',
    };
  });

  // 4. Contract Churn
  const contracts = ['Month-to-month', 'One year', 'Two year'];
  const contractData: BarDataPoint[] = contracts.map((c) => {
    const subset = records.filter((r) => r.Contract === c);
    const tot = subset.length;
    const churned = subset.filter((r) => r.Churn === 'Yes').length;
    return {
      label: c,
      value: tot - churned,
      secondaryValue: churned,
      rate: tot > 0 ? Math.round((churned / tot) * 1000) / 10 : 0,
      color: '#2684FF',
      secondaryColor: '#FF5C5C',
    };
  });

  // 5. Value Added Services impact
  const digitalServices = [
    { key: 'TechSupport' as const, name: 'Tech Support' },
    { key: 'OnlineSecurity' as const, name: 'Online Security' },
    { key: 'OnlineBackup' as const, name: 'Online Backup' },
    { key: 'DeviceProtection' as const, name: 'Device Protection' },
    { key: 'StreamingTV' as const, name: 'Streaming TV' },
    { key: 'StreamingMovies' as const, name: 'Streaming Movies' },
  ];

  const serviceImpactData: BarDataPoint[] = digitalServices.map((s) => {
    const withSvc = records.filter((r) => r[s.key] === 'Yes');
    const tot = withSvc.length;
    const ch = withSvc.filter((r) => r.Churn === 'Yes').length;
    const rate = tot > 0 ? Math.round((ch / tot) * 1000) / 10 : 0;
    return {
      label: s.name,
      value: tot,
      rate,
      color: rate > 30 ? '#FF5C5C' : '#19C5E8',
    };
  });

  return (
    <div className="space-y-6">
      {/* Segmented Control Navigation */}
      <div className="flex items-center gap-1 p-1 bg-[#12243F] border border-[#263B59] rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('demographics')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'demographics'
              ? 'bg-[#2684FF] text-white shadow-sm'
              : 'text-[#9BAFC8] hover:text-white'
          }`}
        >
          Demographic Profiles
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'billing'
              ? 'bg-[#2684FF] text-white shadow-sm'
              : 'text-[#9BAFC8] hover:text-white'
          }`}
        >
          Billing & Tenure Dynamics
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'services'
              ? 'bg-[#2684FF] text-white shadow-sm'
              : 'text-[#9BAFC8] hover:text-white'
          }`}
        >
          Internet & Add-on Services
        </button>
      </div>

      {/* TAB 1: DEMOGRAPHICS */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
              <BarChart
                data={genderData}
                title="Customer Gender Distribution & Churn"
                primaryLabel="Retained"
                secondaryLabel="Churned"
                showRateBadge={true}
              />
              <p className="text-xs text-[#9BAFC8] mt-3 pt-3 border-t border-[#263B59]/60">
                Finding: Gender distribution is nearly 50/50, and churn rates between Female (26.9%) and Male (26.2%) show no statistically significant divergence.
              </p>
            </div>

            <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
              <BarChart
                data={seniorData}
                title="Senior Citizen Status & Churn Rate"
                primaryLabel="Retained"
                secondaryLabel="Churned"
                showRateBadge={true}
              />
              <p className="text-xs text-[#9BAFC8] mt-3 pt-3 border-t border-[#263B59]/60">
                Finding: Senior Citizens experience a 41.7% churn rate compared to 23.6% for non-seniors, reflecting vulnerability to digital onboarding barriers and fixed-income price sensitivity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BILLING & TENURE */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
              <BoxPlotChart
                records={records}
                feature="MonthlyCharges"
                title="Monthly Charges ($) Distribution: Retained vs Churned"
                unit="$"
              />
              <p className="text-xs text-[#9BAFC8] mt-3 pt-3 border-t border-[#263B59]/60">
                Finding: The median monthly bill for churned subscribers ($79.65) is significantly higher than for retained subscribers ($64.43), indicating intense price elasticity.
              </p>
            </div>

            <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
              <HistogramChart
                records={records}
                feature="MonthlyCharges"
                title="Monthly Charges Frequency Histogram"
                unit="$"
                binCount={12}
              />
              <p className="text-xs text-[#9BAFC8] mt-3 pt-3 border-t border-[#263B59]/60">
                Finding: A major churn concentration appears in the $70-$100/mo range, representing subscribers on high-tier bundles without contract lock-in.
              </p>
            </div>
          </div>

          <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
            <BarChart
              data={contractData}
              title="Contract Structure Churn Rate Comparison"
              primaryLabel="Retained Base"
              secondaryLabel="Churned Lost"
              showRateBadge={true}
            />
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
              <BarChart
                data={internetData}
                title="Internet Technology Churn Rate Comparison"
                primaryLabel="Retained Base"
                secondaryLabel="Churned Lost"
                showRateBadge={true}
              />
              <p className="text-xs text-[#9BAFC8] mt-3 pt-3 border-t border-[#263B59]/60">
                Finding: Fiber optic subscribers suffer a 41.89% churn rate despite paying top dollar, suggesting potential service interruptions or aggressive competitor fiber promotions.
              </p>
            </div>

            <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
              <BarChart
                data={serviceImpactData}
                title="Churn Rate Across Value-Added Add-on Subscriptions"
                horizontal={true}
                valueSuffix="subscribers"
              />
              <p className="text-xs text-[#9BAFC8] mt-3 pt-3 border-t border-[#263B59]/60">
                Finding: Subscribers who maintain Tech Support and Online Security churn at only ~15%, demonstrating that security and support services act as effective retention anchors.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
