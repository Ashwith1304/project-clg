import React, { useRef } from 'react';
import { PageId } from '../types/churn';
import { Upload, Download, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  totalFiltered: number;
  totalOriginal: number;
  onFileUpload: (file: File) => void;
  onExportCSV: () => void;
  onResetData: () => void;
}

const PAGE_NAMES: Record<PageId, string> = {
  overview: 'Executive Overview',
  explorer: 'Customer Data Explorer',
  quality: 'Data Quality Report',
  eda: 'Exploratory Data Analysis',
  statistics: 'Statistical Analysis',
  sql: 'SQL Business Analytics',
  segmentation: 'Customer Segmentation',
  recommendations: 'Business Recommendations',
  about: 'About Project & Team',
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  totalFiltered,
  totalOriginal,
  onFileUpload,
  onExportCSV,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <header className="h-16 bg-[#0B1830] border-b border-[#263B59] px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Zone 1: Contextual Breadcrumb and Title */}
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="text-xs font-medium text-[#9BAFC8] uppercase tracking-wider hidden sm:inline">
          Telco Analytics
        </span>
        <span className="text-[#9BAFC8]/50 hidden sm:inline">/</span>
        <h2 className="text-sm md:text-base font-bold text-[#F5F7FA] tracking-tight truncate">
          {PAGE_NAMES[currentPage]}
        </h2>
      </div>

      {/* Zone 2: Cohort Status Indicator */}
      <div className="hidden lg:flex items-center gap-2 text-xs font-mono tabular-nums text-[#9BAFC8]">
        <span className="w-2 h-2 rounded-full bg-[#19C5E8]" />
        <span>Cohort:</span>
        <span className="text-white font-semibold">{totalFiltered.toLocaleString()}</span>
        <span>/</span>
        <span>{totalOriginal.toLocaleString()} customers</span>
      </div>

      {/* Zone 3: Primary Actions (Upload CSV & Export CSV) */}
      <div className="flex items-center gap-2 shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#12243F] hover:bg-[#162B4C] text-[#F5F7FA] border border-[#263B59] transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          title="Upload IBM Telco or custom customer CSV"
        >
          <Upload className="w-3.5 h-3.5 text-[#19C5E8]" />
          <span>Upload CSV</span>
        </button>

        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#2684FF] hover:bg-[#1f6ecc] text-white transition-colors whitespace-nowrap cursor-pointer shadow-sm shadow-[#2684FF]/30"
          title="Export cleaned customer records as CSV"
        >
          <Download className="w-3.5 h-3.5 text-white" />
          <span>Export Cleaned CSV</span>
        </button>

        <button
          onClick={onResetData}
          className="p-1.5 rounded-lg text-[#9BAFC8] hover:text-white hover:bg-[#12243F] border border-transparent hover:border-[#263B59] transition-colors"
          title="Reload Original Dataset"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
