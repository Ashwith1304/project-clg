import React, { useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  unit?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  height = 240,
  unit = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((acc, d) => acc + d.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#9BAFC8] text-sm">
        No data available
      </div>
    );
  }

  const size = 180;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const slices = data.map((d, i) => {
    const fraction = d.value / total;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += fraction * circumference;
    return {
      ...d,
      fraction,
      pct: Math.round(fraction * 1000) / 10,
      strokeDasharray,
      strokeDashoffset,
      index: i,
    };
  });

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="flex flex-col h-full">
      {title && <h4 className="text-sm font-semibold text-[#F5F7FA] mb-3">{title}</h4>}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
            {slices.map((slice) => (
              <circle
                key={slice.index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={hoveredIdx === slice.index ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(slice.index)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
            <span className="text-xs text-[#9BAFC8] truncate max-w-[90px]">
              {activeSlice ? activeSlice.label : 'Total'}
            </span>
            <span className="text-lg font-bold font-mono text-[#F5F7FA] tabular-nums">
              {activeSlice ? `${activeSlice.pct}%` : total.toLocaleString()}
            </span>
            {activeSlice && (
              <span className="text-[11px] font-mono text-[#9BAFC8] tabular-nums">
                {activeSlice.value.toLocaleString()} {unit}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-[200px]">
          {slices.map((slice) => (
            <div
              key={slice.index}
              className={`flex items-center justify-between text-xs p-1.5 rounded transition-colors cursor-pointer ${
                hoveredIdx === slice.index ? 'bg-[#162B4C]' : 'hover:bg-[#162B4C]/50'
              }`}
              onMouseEnter={() => setHoveredIdx(slice.index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-[#F5F7FA] truncate">{slice.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums text-right">
                <span className="text-[#9BAFC8]">{slice.value.toLocaleString()}</span>
                <span className="text-xs font-semibold text-[#19C5E8]">{slice.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
