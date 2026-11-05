import React, { useState } from 'react';

export interface BarDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  rate?: number;
  color?: string;
  secondaryColor?: string;
}

interface BarChartProps {
  data: BarDataPoint[];
  title?: string;
  horizontal?: boolean;
  valueSuffix?: string;
  secondaryLabel?: string;
  primaryLabel?: string;
  showRateBadge?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  horizontal = false,
  valueSuffix = '',
  secondaryLabel,
  primaryLabel,
  showRateBadge = false,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.value, d.secondaryValue || 0)),
    1
  );

  if (horizontal) {
    return (
      <div className="flex flex-col h-full">
        {title && <h4 className="text-sm font-semibold text-[#F5F7FA] mb-3">{title}</h4>}
        <div className="flex flex-col gap-3 my-auto">
          {data.map((d, i) => {
            const pct = (d.value / maxValue) * 100;
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={i}
                className="flex flex-col gap-1 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium truncate max-w-[180px] ${isHovered ? 'text-[#19C5E8]' : 'text-[#F5F7FA]'}`}>
                    {d.label}
                  </span>
                  <div className="flex items-center gap-2 font-mono tabular-nums text-right">
                    <span className="text-[#F5F7FA] font-semibold">
                      {d.value.toLocaleString()} {valueSuffix}
                    </span>
                    {d.rate !== undefined && (
                      <span className="text-[11px] text-[#FF5C5C] font-medium bg-[#FF5C5C]/10 px-1.5 py-0.5 rounded">
                        {d.rate}% churn
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-[#081426] h-3 rounded-full overflow-hidden border border-[#263B59]/60">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      backgroundColor: d.color || '#2684FF',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical Bar Chart
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        {title && <h4 className="text-sm font-semibold text-[#F5F7FA]">{title}</h4>}
        {(primaryLabel || secondaryLabel) && (
          <div className="flex items-center gap-3 text-xs">
            {primaryLabel && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2684FF]" />
                <span className="text-[#9BAFC8]">{primaryLabel}</span>
              </div>
            )}
            {secondaryLabel && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#FF5C5C]" />
                <span className="text-[#9BAFC8]">{secondaryLabel}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-3 h-48 pt-6 pb-2 px-1 border-b border-[#263B59]">
        {data.map((d, i) => {
          const h1 = Math.max((d.value / maxValue) * 100, 4);
          const h2 = d.secondaryValue !== undefined ? Math.max((d.secondaryValue / maxValue) * 100, 4) : 0;
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end h-full gap-1 group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-[#0B1830] border border-[#263B59] rounded px-2 py-1 text-[11px] shadow-xl text-center pointer-events-none whitespace-nowrap font-mono tabular-nums">
                  <div className="font-sans font-semibold text-[#F5F7FA]">{d.label}</div>
                  <div className="text-[#2684FF]">
                    {d.value.toLocaleString()} {valueSuffix}
                  </div>
                  {d.secondaryValue !== undefined && (
                    <div className="text-[#FF5C5C]">{d.secondaryValue.toLocaleString()}</div>
                  )}
                  {d.rate !== undefined && (
                    <div className="text-[#FFB300]">{d.rate}% churn rate</div>
                  )}
                </div>
              )}

              {/* Bars */}
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div
                  className="w-full max-w-[28px] rounded-t transition-all duration-300"
                  style={{
                    height: `${h1}%`,
                    backgroundColor: d.color || '#2684FF',
                    opacity: isHovered ? 1 : 0.85,
                  }}
                />
                {d.secondaryValue !== undefined && (
                  <div
                    className="w-full max-w-[28px] rounded-t transition-all duration-300"
                    style={{
                      height: `${h2}%`,
                      backgroundColor: d.secondaryColor || '#FF5C5C',
                      opacity: isHovered ? 1 : 0.85,
                    }}
                  />
                )}
              </div>

              {/* Rate badge on top if requested */}
              {showRateBadge && d.rate !== undefined && (
                <span className="text-[10px] font-mono text-[#19C5E8] font-bold">
                  {d.rate}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* X-Axis labels */}
      <div className="flex justify-between gap-3 pt-2 text-[11px] text-[#9BAFC8]">
        {data.map((d, i) => (
          <span
            key={i}
            className={`flex-1 text-center truncate ${hoveredIdx === i ? 'text-[#19C5E8] font-medium' : ''}`}
            title={d.label}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};
