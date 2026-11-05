import React, { useState } from 'react';
import { CustomerRecord } from '../types/churn';
import {
  computeUnivariateStats,
  computeWelchTTest,
  computeChiSquareTest,
  computeCorrelationMatrix,
} from '../utils/statistics';
import { HeatmapChart } from '../components/charts/HeatmapChart';
import { Sigma, CheckCircle, HelpCircle, Layers } from 'lucide-react';

interface StatisticalAnalysisProps {
  records: CustomerRecord[];
}

export const StatisticalAnalysis: React.FC<StatisticalAnalysisProps> = ({ records }) => {
  const [selectedChiVar, setSelectedChiVar] = useState<'Contract' | 'PaymentMethod' | 'InternetService' | 'gender'>('Contract');
  const [selectedTVar, setSelectedTVar] = useState<'tenure' | 'MonthlyCharges' | 'TotalCharges'>('MonthlyCharges');

  // Compute Univariate Stats
  const tenureStats = computeUnivariateStats(records, 'tenure');
  const monthlyStats = computeUnivariateStats(records, 'MonthlyCharges');
  const totalStats = computeUnivariateStats(records, 'TotalCharges');

  // Compute Hypothesis Tests
  const tTestResult = computeWelchTTest(records, selectedTVar);
  const chiResult = computeChiSquareTest(records, selectedChiVar);

  // Correlation Matrix
  const corr = computeCorrelationMatrix(records);

  return (
    <div className="space-y-6">
      {/* SECTION 1: UNIVARIATE DESCRIPTIVE STATISTICS */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0B1830] border-b border-[#263B59] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sigma className="w-5 h-5 text-[#2684FF]" />
            <h3 className="text-sm font-bold text-[#F5F7FA]">
              Univariate Parametric & Non-Parametric Statistics Summary
            </h3>
          </div>
          <span className="text-xs text-[#9BAFC8] font-mono">Sample N = {records.length.toLocaleString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#081426] border-b border-[#263B59] text-[#9BAFC8] uppercase font-semibold">
                <th className="py-2.5 px-4">Feature Metric</th>
                <th className="py-2.5 px-4">Mean (μ)</th>
                <th className="py-2.5 px-4">Median (Q2)</th>
                <th className="py-2.5 px-4">Mode (Mo)</th>
                <th className="py-2.5 px-4">Std Dev (σ)</th>
                <th className="py-2.5 px-4">Variance (s²)</th>
                <th className="py-2.5 px-4">Min - Max</th>
                <th className="py-2.5 px-4">Q1 - Q3</th>
                <th className="py-2.5 px-4">IQR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B59]/60 font-mono tabular-nums">
              {[tenureStats, monthlyStats, totalStats].map((s) => (
                <tr key={s.feature} className="hover:bg-[#162B4C] transition-colors">
                  <td className="py-3 px-4 font-sans font-bold text-white">{s.feature}</td>
                  <td className="py-3 px-4 text-[#19C5E8] font-bold">{s.mean.toFixed(2)}</td>
                  <td className="py-3 px-4 text-white">{s.median.toFixed(2)}</td>
                  <td className="py-3 px-4 text-[#9BAFC8]">{String(s.mode)}</td>
                  <td className="py-3 px-4 text-white">{s.std.toFixed(2)}</td>
                  <td className="py-3 px-4 text-[#9BAFC8]">{s.variance.toFixed(2)}</td>
                  <td className="py-3 px-4 text-white">
                    {s.min} – {s.max}
                  </td>
                  <td className="py-3 px-4 text-[#9BAFC8]">
                    {s.q1} – {s.q3}
                  </td>
                  <td className="py-3 px-4 text-[#2684FF] font-bold">{s.iqr.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: HYPOTHESIS TESTING (WELCH T-TEST & CHI-SQUARE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Welch's t-test */}
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#263B59] mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Welch&apos;s Two-Sample t-Test</h4>
                <span className="text-[11px] text-[#9BAFC8]">Parametric Comparison: Churned vs Retained</span>
              </div>
              <select
                value={selectedTVar}
                onChange={(e) => setSelectedTVar(e.target.value as 'tenure' | 'MonthlyCharges' | 'TotalCharges')}
                className="bg-[#081426] text-xs text-[#F5F7FA] border border-[#263B59] rounded px-2.5 py-1 outline-none"
              >
                <option value="MonthlyCharges">Monthly Charges ($)</option>
                <option value="tenure">Tenure (Months)</option>
                <option value="TotalCharges">Total Charges ($)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 font-mono tabular-nums text-xs">
              <div className="bg-[#081426] p-3 rounded-lg border border-[#263B59]">
                <span className="text-[#FF5C5C] font-sans block font-semibold mb-1">Churned Group Mean</span>
                <span className="text-lg font-bold text-white">{tTestResult.churnedMean.toFixed(2)}</span>
                <span className="text-[10px] text-[#9BAFC8] block">Std: {tTestResult.churnedStd.toFixed(2)}</span>
              </div>
              <div className="bg-[#081426] p-3 rounded-lg border border-[#263B59]">
                <span className="text-[#2684FF] font-sans block font-semibold mb-1">Retained Group Mean</span>
                <span className="text-lg font-bold text-white">{tTestResult.retainedMean.toFixed(2)}</span>
                <span className="text-[10px] text-[#9BAFC8] block">Std: {tTestResult.retainedStd.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono tabular-nums bg-[#081426]/60 p-3 rounded-lg border border-[#263B59]/60">
              <div className="flex justify-between">
                <span className="text-[#9BAFC8]">t-Statistic:</span>
                <span className="text-white font-bold">{tTestResult.tStatistic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BAFC8]">Degrees of Freedom (df):</span>
                <span className="text-white font-bold">{tTestResult.degreesOfFreedom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BAFC8]">Significance Level:</span>
                <span className="text-[#19C5E8] font-bold">{tTestResult.pValueText}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#263B59] text-xs text-[#9BAFC8] leading-relaxed">
            <strong className="text-white font-sans block mb-1">Business Interpretation:</strong>
            {tTestResult.interpretation}
          </div>
        </div>

        {/* Chi-Square Test */}
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#263B59] mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#F5F7FA]">Pearson Chi-Square Test (χ²)</h4>
                <span className="text-[11px] text-[#9BAFC8]">Test of Independence with Churn</span>
              </div>
              <select
                value={selectedChiVar}
                onChange={(e) =>
                  setSelectedChiVar(e.target.value as 'Contract' | 'PaymentMethod' | 'InternetService' | 'gender')
                }
                className="bg-[#081426] text-xs text-[#F5F7FA] border border-[#263B59] rounded px-2.5 py-1 outline-none"
              >
                <option value="Contract">Contract</option>
                <option value="PaymentMethod">Payment Method</option>
                <option value="InternetService">Internet Service</option>
                <option value="gender">Gender</option>
              </select>
            </div>

            <div className="space-y-2 text-xs font-mono tabular-nums bg-[#081426]/60 p-3 rounded-lg border border-[#263B59]/60 mb-4">
              <div className="flex justify-between">
                <span className="text-[#9BAFC8]">Chi-Square Statistic (χ²):</span>
                <span className="text-white font-bold">{chiResult.chi2Statistic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BAFC8]">Degrees of Freedom (df):</span>
                <span className="text-white font-bold">{chiResult.degreesOfFreedom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BAFC8]">Hypothesis Verdict:</span>
                <span className="text-[#19C5E8] font-bold">
                  {chiResult.isSignificant ? 'Reject Null (Dependent)' : 'Accept Null (Independent)'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono tabular-nums">
                <thead>
                  <tr className="text-[#9BAFC8] border-b border-[#263B59]">
                    <th className="pb-1.5 font-sans">Category</th>
                    <th className="pb-1.5 text-right">Obs Churned</th>
                    <th className="pb-1.5 text-right">Exp Churned</th>
                    <th className="pb-1.5 text-right">Churn %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263B59]/40">
                  {chiResult.table.map((row) => (
                    <tr key={row.category}>
                      <td className="py-1 font-sans text-white truncate max-w-[120px]">{row.category}</td>
                      <td className="py-1 text-right text-[#FF5C5C] font-bold">{row.observedChurned}</td>
                      <td className="py-1 text-right text-[#9BAFC8]">{row.expectedChurned}</td>
                      <td className="py-1 text-right text-[#19C5E8] font-bold">{row.churnRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#263B59] text-xs text-[#9BAFC8] leading-relaxed">
            <strong className="text-white font-sans block mb-1">Business Interpretation:</strong>
            {chiResult.interpretation}
          </div>
        </div>
      </div>

      {/* SECTION 3: CORRELATION MATRIX HEATMAP */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
        <HeatmapChart
          columns={corr.columns}
          matrix={corr.matrix}
          title="Bivariate Pearson Correlation Coefficient Matrix"
        />
        <div className="mt-4 pt-3 border-t border-[#263B59]/60 text-xs text-[#9BAFC8] leading-relaxed">
          <strong className="text-white">Correlation Highlights:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>
              Strong positive correlation between <span className="text-white">tenure</span> and{' '}
              <span className="text-white">TotalCharges</span> (r = +0.83), confirming customer lifetime billing accumulation.
            </li>
            <li>
              Moderate positive correlation between <span className="text-white">MonthlyCharges</span> and{' '}
              <span className="text-white">TotalCharges</span> (r = +0.65).
            </li>
            <li>
              SeniorCitizen status exhibits slight positive correlation with MonthlyCharges (r = +0.22) due to higher adoption of phone and fiber services.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
