import React, { useState } from 'react';
import { CustomerRecord } from '../../types/churn';

interface HistogramChartProps {
  records: CustomerRecord[];
  feature: 'tenure' | 'MonthlyCharges';
  title: string;
  binCount?: number;
  unit?: string;
}

export const HistogramChart: React.FC<HistogramChartProps> = ({
  records,
  feature,
  title,
  binCount = 12,
  unit = '',
}) => {
  const [hoveredBin, setHoveredBin] = useState<number | null>(null);

  const values = records.map((r) => r[feature]);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 100);
  const binSize = (max - min) / binCount;

  const bins = Array.from({ length: binCount }, (_, i) => {
    const start = min + i * binSize;
    const end = start + binSize;
    const inBin = records.filter(
      (r) => r[feature] >= start && (i === binCount - 1 ? r[feature] <= end : r[feature] < end)
    );
    const churned = inBin.filter((r) => r.Churn === 'Yes').length;
    const retained = inBin.length - churned;
    const churnRate = inBin.length > 0 ? Math.round((churned / inBin.length) * 1000) / 10 : 0;

    return {
      index: i,
      label: `${Math.round(start)}-${Math.round(end)}${unit}`,
      total: inBin.length,
      churned,
      retained,
      churnRate,
    };
  });

  const maxBinTotal = Math.max(...bins.map((b) => b.total), 1);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[#F5F7FA]">{title}</h4>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2684FF]" />
            <span className="text-[#9BAFC8]">Retained</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FF5C5C]" />
            <span className="text-[#9BAFC8]">Churned</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-1.5 h-48 pt-6 pb-2 px-1 border-b border-[#263B59]">
        {bins.map((bin) => {
          const totalHeight = Math.max((bin.total / maxBinTotal) * 100, 2);
          const churnHeight = bin.total > 0 ? (bin.churned / bin.total) * 100 : 0;
          const isHovered = hoveredBin === bin.index;

          return (
            <div
              key={bin.index}
              className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
              onMouseEnter={() => setHoveredBin(bin.index)}
              onMouseLeave={() => setHoveredBin(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-14 z-20 bg-[#0B1830] border border-[#263B59] rounded px-2.5 py-1 text-[11px] shadow-2xl text-center pointer-events-none whitespace-nowrap font-mono tabular-nums">
                  <div className="font-sans font-semibold text-[#F5F7FA]">{bin.label}</div>
                  <div className="text-[#9BAFC8]">
                    Total: <span className="text-white">{bin.total}</span> | Churned: <span className="text-[#FF5C5C]">{bin.churned}</span>
                  </div>
                  <div className="text-[#FFB300] font-bold">{bin.churnRate}% Churn Rate</div>
                </div>
              )}

              {/* Stacked bar */}
              <div
                className="w-full rounded-t overflow-hidden flex flex-col justify-end transition-all duration-200"
                style={{
                  height: `${totalHeight}%`,
                  opacity: isHovered ? 1 : 0.85,
                }}
              >
                {/* Churned segment on top */}
                <div
                  className="w-full bg-[#FF5C5C] transition-all duration-200"
                  style={{ height: `${churnHeight}%` }}
                />
                {/* Retained segment on bottom */}
                <div
                  className="w-full bg-[#2684FF] transition-all duration-200"
                  style={{ height: `${100 - churnHeight}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis ticks */}
      <div className="flex justify-between gap-1 pt-2 text-[10px] text-[#9BAFC8] font-mono tabular-nums overflow-hidden">
        {bins.map((b, i) => (
          <span
            key={i}
            className={`flex-1 text-center truncate ${hoveredBin === i ? 'text-[#19C5E8] font-bold' : ''}`}
          >
            {i % 2 === 0 ? b.label.split('-')[0] : ''}
          </span>
        ))}
      </div>
    </div>
  );
};
