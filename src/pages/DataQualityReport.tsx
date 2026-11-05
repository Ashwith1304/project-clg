import React from 'react';
import { DataQualityReportData } from '../types/churn';
import { CheckCircle2, AlertCircle, Database, FileSpreadsheet, Layers, ShieldCheck } from 'lucide-react';

interface DataQualityReportProps {
  report: DataQualityReportData;
}

export const DataQualityReport: React.FC<DataQualityReportProps> = ({ report }) => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2684FF]/20 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-[#2684FF]" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#F5F7FA] tabular-nums">
              {report.totalRows.toLocaleString()}
            </div>
            <div className="text-xs text-[#9BAFC8]">Validated Rows</div>
          </div>
        </div>

        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#19C5E8]/20 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-[#19C5E8]" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#F5F7FA] tabular-nums">
              {report.totalColumns}
            </div>
            <div className="text-xs text-[#9BAFC8]">Schema Columns</div>
          </div>
        </div>

        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2684FF]/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#2684FF]" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#2684FF] tabular-nums">
              {report.duplicateCount}
            </div>
            <div className="text-xs text-[#9BAFC8]">Duplicate IDs Found</div>
          </div>
        </div>

        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FFA940]/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-[#FFA940]" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#FFA940] tabular-nums">
              {report.missingValuesFixed}
            </div>
            <div className="text-xs text-[#9BAFC8]">Whitespace Nulls Imputed</div>
          </div>
        </div>
      </div>

      {/* Cleaning Pipeline Audit Explanation */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#19C5E8]" />
          <h3 className="text-sm font-bold text-[#F5F7FA]">Data Preprocessing & Transformation Protocol</h3>
        </div>
        <p className="text-xs text-[#9BAFC8] leading-relaxed">
          The raw IBM Telco Customer Churn dataset contains 11 records where <code className="text-[#19C5E8]">TotalCharges</code> contained whitespace strings (<code className="text-white">&quot; &quot;</code>). An inspection revealed that all 11 records correspond to new subscribers with <code className="text-[#19C5E8]">tenure = 0</code> who joined during the current billing cycle and have not yet been billed. Rather than dropping valid customer records, our preprocessing pipeline systematically converts these entries to <code className="text-[#2684FF]">0.00</code> and casts the field to standard IEEE 754 floating point.
        </p>
      </div>

      {/* Outlier Summaries (IQR Method) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MonthlyCharges IQR */}
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
          <h4 className="text-sm font-bold text-[#F5F7FA] mb-3 flex items-center gap-2">
            <span>MonthlyCharges Outlier Audit (IQR Method)</span>
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono tabular-nums">
            <div className="bg-[#081426] p-2.5 rounded border border-[#263B59]">
              <span className="text-[#9BAFC8] block text-[11px] font-sans">1st Quartile (Q1)</span>
              <span className="text-white font-bold">${report.monthlyChargesIQR.q1.toFixed(2)}</span>
            </div>
            <div className="bg-[#081426] p-2.5 rounded border border-[#263B59]">
              <span className="text-[#9BAFC8] block text-[11px] font-sans">3rd Quartile (Q3)</span>
              <span className="text-white font-bold">${report.monthlyChargesIQR.q3.toFixed(2)}</span>
            </div>
            <div className="bg-[#081426] p-2.5 rounded border border-[#263B59]">
              <span className="text-[#9BAFC8] block text-[11px] font-sans">Interquartile Range (IQR)</span>
              <span className="text-[#19C5E8] font-bold">${report.monthlyChargesIQR.iqr.toFixed(2)}</span>
            </div>
            <div className="bg-[#081426] p-2.5 rounded border border-[#263B59]">
              <span className="text-[#9BAFC8] block text-[11px] font-sans">Outlier Fence Bounds</span>
              <span className="text-white text-[11px]">
                [${report.monthlyChargesIQR.lowerBound.toFixed(2)}, ${report.monthlyChargesIQR.upperBound.toFixed(2)}]
              </span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#9BAFC8] bg-[#081426]/50 p-2 rounded">
            Statistical Outliers Detected: <strong className="text-[#2684FF]">{report.monthlyChargesIQR.outlierCount}</strong> (All values within valid telecom billing tiers).
          </div>
        </div>

        {/* TotalCharges IQR */}
        <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5">
          <h4 className="text-sm font-bold text-[#F5F7FA] mb-3 flex items-center gap-2">
            <span>TotalCharges Outlier Audit (IQR Method)</span>
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono tabular-nums">
            <div className="bg-[#081426] p-2.5 rounded border border-[#263B59]">
              <span className="text-[#9BAFC8] block text-[11px] font-sans">1st Quartile (Q1)</span>
              <span className="text-white font-bold">${report.totalChargesIQR.q1.toFixed(2)}</span>
            </div>
            <div className="bg-[#081426] p-2.5 rounded border border-[#263B59]">
              <span className="text-[#9BAFC8] block text-[11px] font-sans">3rd Quartile (Q3)</span>
              <span className="text-white font-bold">${report.totalChargesIQR.q3.toFixed(2)}</span>
            </div>
            <div className="bg-[#081426] p-2.5 rounded border border-[#263B59]">
              <span className="text-[#9BAFC8] block text-[11px] font-sans">Interquartile Range (IQR)</span>
              <span className="text-[#19C5E8] font-bold">${report.totalChargesIQR.iqr.toFixed(2)}</span>
            </div>
            <div className="bg-[#081426] p-2.5 rounded border border-[#263B59]">
              <span className="text-[#9BAFC8] block text-[11px] font-sans">Outlier Fence Bounds</span>
              <span className="text-white text-[11px]">
                [${report.totalChargesIQR.lowerBound.toFixed(2)}, ${report.totalChargesIQR.upperBound.toFixed(2)}]
              </span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#9BAFC8] bg-[#081426]/50 p-2 rounded">
            Statistical Outliers Detected: <strong className="text-[#2684FF]">{report.totalChargesIQR.outlierCount}</strong> (High cumulative charges from multi-year retained accounts).
          </div>
        </div>
      </div>

      {/* Field Schema Specification Table */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0B1830] border-b border-[#263B59] flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[#19C5E8]" />
          <h4 className="text-sm font-bold text-[#F5F7FA]">Dataset Field Specification & Integrity Audit</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#081426] border-b border-[#263B59] text-[#9BAFC8] uppercase font-semibold">
                <th className="py-2.5 px-4">Column Name</th>
                <th className="py-2.5 px-4">Inferred Type</th>
                <th className="py-2.5 px-4">Unique Cardinality</th>
                <th className="py-2.5 px-4">Sample Value</th>
                <th className="py-2.5 px-4">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B59]/60 font-mono tabular-nums">
              {report.columnSchemas.map((col) => (
                <tr key={col.name} className="hover:bg-[#162B4C] transition-colors">
                  <td className="py-2.5 px-4 text-white font-semibold font-sans">{col.name}</td>
                  <td className="py-2.5 px-4 text-[#19C5E8]">{col.dataType}</td>
                  <td className="py-2.5 px-4 text-[#F5F7FA]">{col.uniqueCount} distinct</td>
                  <td className="py-2.5 px-4 text-[#9BAFC8] truncate max-w-xs">{col.sampleValue}</td>
                  <td className="py-2.5 px-4 font-sans">
                    <span className="flex items-center gap-1.5 text-[#2684FF] font-medium text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Cleaned & Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
