import React from 'react';
import { PageId } from '../types/churn';
import {
  BarChart3,
  Database,
  FileCheck2,
  PieChart,
  Sigma,
  Terminal,
  Users2,
  Lightbulb,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  totalRecords: number;
}

const NAV_ITEMS: { id: PageId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
  { id: 'explorer', label: 'Customer Data Explorer', icon: Database },
  { id: 'quality', label: 'Data Quality Report', icon: FileCheck2 },
  { id: 'eda', label: 'Exploratory Data Analysis', icon: PieChart },
  { id: 'statistics', label: 'Statistical Analysis', icon: Sigma },
  { id: 'sql', label: 'SQL Business Analytics', icon: Terminal },
  { id: 'segmentation', label: 'Customer Segmentation', icon: Users2 },
  { id: 'recommendations', label: 'Business Recommendations', icon: Lightbulb },
  { id: 'about', label: 'About Project & Team', icon: GraduationCap },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  totalRecords,
}) => {
  return (
    <aside className="w-64 bg-[#0B1830] border-r border-[#263B59] flex flex-col shrink-0 h-screen sticky top-0 select-none z-30">
      {/* Platform Brand Header */}
      <div className="p-4 border-b border-[#263B59] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2684FF] to-[#19C5E8] flex items-center justify-center shadow-lg shadow-[#2684FF]/20 shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-sm font-bold text-[#F5F7FA] tracking-tight leading-tight truncate">
            TELCO CHURN BI
          </h1>
          <p className="text-[11px] text-[#9BAFC8] truncate">
            Enterprise Retention Suite
          </p>
        </div>
      </div>

      {/* Dataset Badge */}
      <div className="px-4 py-3 border-b border-[#263B59]/60 bg-[#081426]/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#9BAFC8]">Live Ingested Base</span>
          <span className="font-mono text-[#19C5E8] font-bold tabular-nums">
            {totalRecords.toLocaleString()} recs
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-[#9BAFC8]/70 uppercase">
          Analytical Views
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left group ${
                isActive
                  ? 'bg-[#2684FF] text-white shadow-md shadow-[#2684FF]/25 font-semibold'
                  : 'text-[#9BAFC8] hover:text-[#F5F7FA] hover:bg-[#12243F]'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-[#9BAFC8] group-hover:text-[#19C5E8]'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Academic Institutional Tag */}
      <div className="p-3 border-t border-[#263B59] bg-[#081426]/70 text-[11px] text-[#9BAFC8] leading-relaxed">
        <div className="font-medium text-[#F5F7FA] truncate">SNIST · CSE (Data Science)</div>
        <div className="text-[10px] text-[#9BAFC8]/80 truncate">
          Mythili · Ashiwith · Niyati
        </div>
      </div>
    </aside>
  );
};
