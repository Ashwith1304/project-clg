import React from 'react';
import { CustomerRecord } from '../../types/churn';

interface BoxPlotProps {
  records: CustomerRecord[];
  feature: 'MonthlyCharges' | 'tenure' | 'TotalCharges';
  title: string;
  unit?: string;
}

interface BoxStats {
  group: string;
  count: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  color: string;
}

export const BoxPlotChart: React.FC<BoxPlotProps> = ({
  records,
  feature,
  title,
  unit = '$',
}) => {
  function getStats(vals: number[], group: string, color: string): BoxStats {
    const sorted = [...vals].sort((a, b) => a - b);
    const n = sorted.length;
    if (n === 0) return { group, count: 0, min: 0, q1: 0, median: 0, q3: 0, max: 0, color };
    return {
      group,
      count: n,
      min: sorted[0],
      q1: sorted[Math.floor(n * 0.25)],
      median: sorted[Math.floor(n * 0.5)],
      q3: sorted[Math.floor(n * 0.75)],
      max: sorted[n - 1],
      color,
    };
  }

  const churnedVals = records.filter((r) => r.Churn === 'Yes').map((r) => r[feature]);
  const retainedVals = records.filter((r) => r.Churn === 'No').map((r) => r[feature]);

  const stats: BoxStats[] = [
    getStats(retainedVals, 'Retained (No)', '#2684FF'),
    getStats(churnedVals, 'Churned (Yes)', '#FF5C5C'),
  ];

  const globalMax = Math.max(...stats.map((s) => s.max), 100);
  const globalMin = Math.min(...stats.map((s) => s.min), 0);
  const range = globalMax - globalMin || 1;

  const getYPct = (val: number) => 100 - ((val - globalMin) / range) * 100;

  return (
    <div className="flex flex-col h-full">
      <h4 className="text-sm font-semibold text-[#F5F7FA] mb-4">{title}</h4>

      <div className="relative flex justify-around items-stretch h-56 pt-2 pb-6 px-4 border-b border-[#263B59]">
        {/* Horizontal reference gridlines */}
        {[0, 25, 50, 75, 100].map((pct) => (
          <div
            key={pct}
            className="absolute left-0 right-0 border-t border-[#263B59]/40 pointer-events-none"
            style={{ top: `${pct}%` }}
          />
        ))}

        {stats.map((s, idx) => {
          const topMin = getYPct(s.min);
          const topQ1 = getYPct(s.q1);
          const topMed = getYPct(s.median);
          const topQ3 = getYPct(s.q3);
          const topMax = getYPct(s.max);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center relative max-w-[120px]">
              {/* Vertical Whisker Line from Min to Max */}
              <div
                className="absolute w-0.5 pointer-events-none"
                style={{
                  top: `${topMax}%`,
                  bottom: `${100 - topMin}%`,
                  backgroundColor: s.color,
                }}
              />

              {/* Max horizontal whisker bar */}
              <div
                className="absolute w-6 h-0.5 rounded-full"
                style={{ top: `${topMax}%`, backgroundColor: s.color }}
              />

              {/* IQR Box (Q3 to Q1) */}
              <div
                className="absolute w-14 rounded border transition-transform hover:scale-105 shadow-lg group cursor-pointer"
                style={{
                  top: `${topQ3}%`,
                  height: `${Math.max(topQ1 - topQ3, 4)}%`,
                  backgroundColor: `${s.color}25`,
                  borderColor: s.color,
                }}
              >
                {/* Tooltip on Box Hover */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 bg-[#0B1830] border border-[#263B59] rounded p-2 text-[11px] font-mono tabular-nums shadow-2xl whitespace-nowrap">
                  <div className="font-sans font-bold text-white mb-1">{s.group}</div>
                  <div>Max: {unit}{s.max.toFixed(2)}</div>
                  <div>Q3: {unit}{s.q3.toFixed(2)}</div>
                  <div className="text-[#19C5E8] font-bold">Median: {unit}{s.median.toFixed(2)}</div>
                  <div>Q1: {unit}{s.q1.toFixed(2)}</div>
                  <div>Min: {unit}{s.min.toFixed(2)}</div>
                  <div className="text-[#9BAFC8] text-[10px] mt-1">Count: {s.count.toLocaleString()}</div>
                </div>

                {/* Median Line */}
                <div
                  className="absolute w-full h-1 bg-white shadow-sm"
                  style={{ top: `${((topMed - topQ3) / (topQ1 - topQ3 || 1)) * 100}%` }}
                />
              </div>

              {/* Min horizontal whisker bar */}
              <div
                className="absolute w-6 h-0.5 rounded-full"
                style={{ top: `${topMin}%`, backgroundColor: s.color }}
              />
            </div>
          );
        })}
      </div>

      {/* Group Labels & Median summary */}
      <div className="flex justify-around pt-3 text-xs">
        {stats.map((s, idx) => (
          <div key={idx} className="text-center font-mono tabular-nums">
            <span className="font-sans font-medium text-[#F5F7FA] block">{s.group}</span>
            <span className="text-[11px] text-[#9BAFC8]">
              Median: <strong className="text-[#19C5E8]">{unit}{s.median.toFixed(2)}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
