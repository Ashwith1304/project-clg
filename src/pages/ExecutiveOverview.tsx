import React from 'react';
import { CustomerRecord, KPISummary } from '../types/churn';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChart, BarDataPoint } from '../components/charts/BarChart';
import { HistogramChart } from '../components/charts/HistogramChart';
import { Users, UserCheck, UserX, TrendingDown, DollarSign, Wallet, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExecutiveOverviewProps {
  records: CustomerRecord[];
  kpis: KPISummary;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  records,
  kpis,
}) => {
  // 1. Churn Donut Data
  const churnDonutData = [
    { label: 'Retained', value: kpis.activeCustomers, color: '#2684FF' },
    { label: 'Churned', value: kpis.churnedCustomers, color: '#FF5C5C' },
  ];

  // 2. Contract Churn Bar Data
  const contracts = ['Month-to-month', 'One year', 'Two year'];
  const contractBarData: BarDataPoint[] = contracts.map((c) => {
    const subset = records.filter((r) => r.Contract === c);
    const tot = subset.length;
    const churned = subset.filter((r) => r.Churn === 'Yes').length;
    const rate = tot > 0 ? Math.round((churned / tot) * 1000) / 10 : 0;
    return {
      label: c,
      value: tot - churned,
      secondaryValue: churned,
      rate,
      color: '#2684FF',
      secondaryColor: '#FF5C5C',
    };
  });

  // 3. Monthly Revenue Distribution by Contract
  const revenueByContract: BarDataPoint[] = contracts.map((c) => {
    const rev = records
      .filter((r) => r.Contract === c)
      .reduce((acc, r) => acc + r.MonthlyCharges, 0);
    return {
      label: c,
      value: Math.round(rev),
      color: c === 'Month-to-month' ? '#FF5C5C' : '#19C5E8',
    };
  });

  // 4. Payment Method Analysis
  const paymentMethods = [
    'Electronic check',
    'Mailed check',
    'Bank transfer (automatic)',
    'Credit card (automatic)',
  ];
  const paymentMethodData: BarDataPoint[] = paymentMethods.map((pm) => {
    const subset = records.filter((r) => r.PaymentMethod === pm);
    const tot = subset.length;
    const churned = subset.filter((r) => r.Churn === 'Yes').length;
    const rate = tot > 0 ? Math.round((churned / tot) * 1000) / 10 : 0;
    const shortLabel = pm.replace(' (automatic)', '');
    return {
      label: shortLabel,
      value: tot,
      rate,
      color: pm === 'Electronic check' ? '#FF5C5C' : '#2684FF',
    };
  });

  return (
    <div className="space-y-6">
      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* KPI 1: Total Customers */}
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9BAFC8] mb-2">
            <span className="text-xs font-medium">Total Customers</span>
            <Users className="w-4 h-4 text-[#19C5E8]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#F5F7FA] tabular-nums">
              {kpis.totalCustomers.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#9BAFC8]">Audited accounts</span>
          </div>
        </div>

        {/* KPI 2: Active Customers */}
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9BAFC8] mb-2">
            <span className="text-xs font-medium">Active Base</span>
            <UserCheck className="w-4 h-4 text-[#2684FF]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#2684FF] tabular-nums">
              {kpis.activeCustomers.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#9BAFC8]">
              {Math.round((kpis.activeCustomers / (kpis.totalCustomers || 1)) * 100)}% retention
            </span>
          </div>
        </div>

        {/* KPI 3: Churned Customers */}
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9BAFC8] mb-2">
            <span className="text-xs font-medium">Churned Lost</span>
            <UserX className="w-4 h-4 text-[#FF5C5C]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#FF5C5C] tabular-nums">
              {kpis.churnedCustomers.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#FF5C5C]">Terminated subscriptions</span>
          </div>
        </div>

        {/* KPI 4: Churn Rate */}
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9BAFC8] mb-2">
            <span className="text-xs font-medium">Churn Rate</span>
            <TrendingDown className="w-4 h-4 text-[#FFA940]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#FFA940] tabular-nums">
              {kpis.churnRate.toFixed(2)}%
            </div>
            <span className="text-[11px] text-[#9BAFC8]">Benchmark: &lt;15.0%</span>
          </div>
        </div>

        {/* KPI 5: Avg Monthly Charges */}
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9BAFC8] mb-2">
            <span className="text-xs font-medium">Avg Monthly Bill</span>
            <DollarSign className="w-4 h-4 text-[#19C5E8]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#F5F7FA] tabular-nums">
              ${kpis.avgMonthlyCharges.toFixed(2)}
            </div>
            <span className="text-[11px] text-[#9BAFC8]">Per active subscriber</span>
          </div>
        </div>

        {/* KPI 6: Total Monthly Revenue */}
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#9BAFC8] mb-2">
            <span className="text-xs font-medium">Gross MRR</span>
            <Wallet className="w-4 h-4 text-[#2684FF]" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#F5F7FA] tabular-nums">
              ${(kpis.totalMonthlyRevenue / 1000).toFixed(1)}k
            </div>
            <span className="text-[11px] text-[#9BAFC8]">Monthly recurring bill</span>
          </div>
        </div>
      </div>

      {/* Row 1: Retention Donut & Contract-wise Churn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
          <DonutChart
            data={churnDonutData}
            title="Customer Retention vs Attrition Distribution"
            unit="customers"
          />
        </div>

        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
          <BarChart
            data={contractBarData}
            title="Contract-Wise Customer Breakdown & Churn"
            primaryLabel="Retained"
            secondaryLabel="Churned"
            showRateBadge={true}
          />
        </div>
      </div>

      {/* Row 2: Customer Tenure Distribution & Payment Method Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
          <HistogramChart
            records={records}
            feature="tenure"
            title="Customer Tenure Distribution (Months to Churn)"
            unit="m"
            binCount={12}
          />
        </div>

        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
          <BarChart
            data={paymentMethodData}
            title="Payment Method Breakdown & Churn Rate"
            horizontal={true}
            valueSuffix="customers"
          />
        </div>
      </div>

      {/* Row 3: Monthly Revenue Distribution by Contract */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
        <BarChart
          data={revenueByContract}
          title="Monthly Recurring Revenue (MRR) Distribution by Contract Type"
          horizontal={true}
          valueSuffix="$"
        />
      </div>

      {/* Key Business Insights Box */}
      <div className="bg-[#0B1830] border border-[#263B59] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-[#FFA940]" />
          <h3 className="text-base font-bold text-[#F5F7FA]">Key Business Insights & Critical Takeaways</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="bg-[#12243F] border border-[#263B59] rounded-lg p-4">
            <div className="flex items-center gap-2 font-semibold text-[#FF5C5C] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5C5C]" />
              Month-to-Month Contract Vulnerability
            </div>
            <p className="text-[#9BAFC8]">
              Month-to-month contracts experience a <strong className="text-white">42.71% churn rate</strong>. Over 88% of all churned subscribers were on month-to-month terms, creating severe revenue volatility.
            </p>
          </div>

          <div className="bg-[#12243F] border border-[#263B59] rounded-lg p-4">
            <div className="flex items-center gap-2 font-semibold text-[#FFA940] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FFA940]" />
              Electronic Check Payment Friction
            </div>
            <p className="text-[#9BAFC8]">
              Subscribers paying via Electronic Check churn at <strong className="text-white">45.29%</strong>. In contrast, automated credit card and bank transfer subscribers exhibit under 16% churn.
            </p>
          </div>

          <div className="bg-[#12243F] border border-[#263B59] rounded-lg p-4">
            <div className="flex items-center gap-2 font-semibold text-[#19C5E8] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#19C5E8]" />
              First 6-Month Onboarding Window
            </div>
            <p className="text-[#9BAFC8]">
              Over <strong className="text-white">33% of all customer defection</strong> occurs within the first 6 months of account opening. Retention interventions are most impactful during days 1 to 90.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
