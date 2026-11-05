import React, { useState } from 'react';

interface HeatmapChartProps {
  columns: readonly string[];
  matrix: { [key: string]: { [key: string]: number } };
  title?: string;
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({
  columns,
  matrix,
  title = 'Pearson Correlation Matrix',
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ r: string; c: string } | null>(null);

  const getCellColor = (val: number) => {
    // val ranges between -1 and 1
    if (val === 1) return '#2684FF';
    if (val > 0.6) return 'rgba(38, 132, 255, 0.85)';
    if (val > 0.3) return 'rgba(38, 132, 255, 0.55)';
    if (val > 0) return 'rgba(25, 197, 232, 0.35)';
    if (val > -0.3) return 'rgba(255, 92, 92, 0.35)';
    return 'rgba(255, 92, 92, 0.7)';
  };

  return (
    <div className="flex flex-col h-full">
      {title && <h4 className="text-sm font-semibold text-[#F5F7FA] mb-4">{title}</h4>}

      <div className="overflow-x-auto my-auto">
        <div className="inline-block min-w-full">
          {/* Header Row */}
          <div className="flex items-center">
            <div className="w-32 shrink-0" />
            {columns.map((col) => (
              <div
                key={col}
                className="w-24 text-center text-[11px] font-medium text-[#9BAFC8] truncate px-1 py-2"
                title={col}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          {columns.map((rowKey) => (
            <div key={rowKey} className="flex items-center my-1">
              <div
                className="w-32 shrink-0 text-xs font-medium text-[#F5F7FA] truncate pr-2 text-right"
                title={rowKey}
              >
                {rowKey}
              </div>
              {columns.map((colKey) => {
                const val = matrix[rowKey]?.[colKey] ?? 0;
                const isHovered =
                  hoveredCell?.r === rowKey && hoveredCell?.c === colKey;

                return (
                  <div
                    key={colKey}
                    className={`w-24 h-12 m-0.5 rounded flex flex-col items-center justify-center font-mono text-xs tabular-nums cursor-pointer transition-all ${
                      isHovered ? 'ring-2 ring-white scale-105 z-10' : ''
                    }`}
                    style={{
                      backgroundColor: getCellColor(val),
                      color: Math.abs(val) > 0.4 ? '#FFFFFF' : '#F5F7FA',
                    }}
                    onMouseEnter={() => setHoveredCell({ r: rowKey, c: colKey })}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`${rowKey} ↔ ${colKey}: r = ${val}`}
                  >
                    <span className="font-bold">{val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] text-[#9BAFC8] border-t border-[#263B59]/60 pt-2">
        <div className="flex items-center gap-2">
          <span>Negative:</span>
          <span className="w-3 h-3 rounded bg-[#FF5C5C]/60" />
          <span>Neutral:</span>
          <span className="w-3 h-3 rounded bg-[#19C5E8]/30" />
          <span>Positive:</span>
          <span className="w-3 h-3 rounded bg-[#2684FF]" />
        </div>
        <span className="font-mono">Range: -1.00 to +1.00</span>
      </div>
    </div>
  );
};
