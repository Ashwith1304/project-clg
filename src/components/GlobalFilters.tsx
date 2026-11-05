import React from 'react';
import { FilterState } from '../types/churn';
import { FilterX } from 'lucide-react';

interface GlobalFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalFiltered: number;
  totalOriginal: number;
}

export const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalFiltered,
  totalOriginal,
}) => {
  const isFiltered =
    filters.gender !== 'All' ||
    filters.contract !== 'All' ||
    filters.internetService !== 'All' ||
    filters.paymentMethod !== 'All' ||
    filters.tenureRange[0] !== 0 ||
    filters.tenureRange[1] !== 72;

  return (
    <div className="bg-[#0B1830] border-b border-[#263B59] px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Gender */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#9BAFC8] font-medium">Gender:</label>
            <select
              value={filters.gender}
              onChange={(e) => onChange({ ...filters, gender: e.target.value })}
              className="bg-[#12243F] text-[#F5F7FA] border border-[#263B59] rounded px-2.5 py-1 text-xs outline-none focus:border-[#2684FF] transition-colors"
            >
              <option value="All">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          {/* Contract */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#9BAFC8] font-medium">Contract:</label>
            <select
              value={filters.contract}
              onChange={(e) => onChange({ ...filters, contract: e.target.value })}
              className="bg-[#12243F] text-[#F5F7FA] border border-[#263B59] rounded px-2.5 py-1 text-xs outline-none focus:border-[#2684FF] transition-colors"
            >
              <option value="All">All Contracts</option>
              <option value="Month-to-month">Month-to-month</option>
              <option value="One year">One year</option>
              <option value="Two year">Two year</option>
            </select>
          </div>

          {/* Internet Service */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#9BAFC8] font-medium">Internet:</label>
            <select
              value={filters.internetService}
              onChange={(e) => onChange({ ...filters, internetService: e.target.value })}
              className="bg-[#12243F] text-[#F5F7FA] border border-[#263B59] rounded px-2.5 py-1 text-xs outline-none focus:border-[#2684FF] transition-colors"
            >
              <option value="All">All Internet Services</option>
              <option value="DSL">DSL</option>
              <option value="Fiber optic">Fiber optic</option>
              <option value="No">No Internet</option>
            </select>
          </div>

          {/* Payment Method */}
          <div className="flex items-center gap-1.5">
            <label className="text-[#9BAFC8] font-medium">Payment:</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => onChange({ ...filters, paymentMethod: e.target.value })}
              className="bg-[#12243F] text-[#F5F7FA] border border-[#263B59] rounded px-2.5 py-1 text-xs outline-none focus:border-[#2684FF] transition-colors max-w-[170px] truncate"
            >
              <option value="All">All Payment Methods</option>
              <option value="Electronic check">Electronic check</option>
              <option value="Mailed check">Mailed check</option>
              <option value="Bank transfer (automatic)">Bank transfer (auto)</option>
              <option value="Credit card (automatic)">Credit card (auto)</option>
            </select>
          </div>

          {/* Tenure Slider */}
          <div className="flex items-center gap-2 bg-[#12243F] border border-[#263B59] rounded px-2.5 py-1">
            <label className="text-[#9BAFC8] font-medium">Tenure:</label>
            <span className="font-mono text-[#19C5E8] tabular-nums font-semibold">
              {filters.tenureRange[0]}m - {filters.tenureRange[1]}m
            </span>
            <input
              type="range"
              min="0"
              max="72"
              value={filters.tenureRange[1]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  tenureRange: [filters.tenureRange[0], parseInt(e.target.value, 10)],
                })
              }
              className="w-20 accent-[#2684FF] cursor-pointer"
            />
          </div>
        </div>

        {/* Clear & Matched Count */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono tabular-nums text-[#9BAFC8]">
            Filtered: <span className="text-[#F5F7FA] font-bold">{totalFiltered.toLocaleString()}</span>
            <span className="text-[#9BAFC8]/60"> ({Math.round((totalFiltered / (totalOriginal || 1)) * 100)}%)</span>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-[#FF5C5C] hover:text-white hover:bg-[#FF5C5C]/20 px-2 py-1 rounded transition-colors"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
