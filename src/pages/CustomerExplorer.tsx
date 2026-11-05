import React, { useState } from 'react';
import { CustomerRecord } from '../types/churn';
import { exportRecordsToCSV } from '../utils/dataProcessing';
import { Search, Download, ChevronLeft, ChevronRight, SlidersHorizontal, Eye } from 'lucide-react';

interface CustomerExplorerProps {
  records: CustomerRecord[];
}

export const CustomerExplorer: React.FC<CustomerExplorerProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [churnFilter, setChurnFilter] = useState<'All' | 'Yes' | 'No'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const pageSize = 25;

  const allColumns: (keyof CustomerRecord)[] = [
    'customerID',
    'gender',
    'SeniorCitizen',
    'Partner',
    'Dependents',
    'tenure',
    'PhoneService',
    'InternetService',
    'Contract',
    'PaperlessBilling',
    'PaymentMethod',
    'MonthlyCharges',
    'TotalCharges',
    'Churn',
  ];

  const [visibleColumns, setVisibleColumns] = useState<(keyof CustomerRecord)[]>([
    'customerID',
    'gender',
    'tenure',
    'Contract',
    'InternetService',
    'PaymentMethod',
    'MonthlyCharges',
    'TotalCharges',
    'Churn',
  ]);

  const [showColPicker, setShowColPicker] = useState(false);

  // Search & Filter
  const filtered = records.filter((r) => {
    if (churnFilter !== 'All' && r.Churn !== churnFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = r.customerID.toLowerCase().includes(q);
      const matchContract = r.Contract.toLowerCase().includes(q);
      const matchPayment = r.PaymentMethod.toLowerCase().includes(q);
      const matchInternet = r.InternetService.toLowerCase().includes(q);
      if (!matchId && !matchContract && !matchPayment && !matchInternet) return false;
    }
    return true;
  });

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const pageStart = (currentPage - 1) * pageSize;
  const currentRecords = filtered.slice(pageStart, pageStart + pageSize);

  const toggleColumn = (col: keyof CustomerRecord) => {
    if (visibleColumns.includes(col)) {
      if (visibleColumns.length > 3) {
        setVisibleColumns(visibleColumns.filter((c) => c !== col));
      }
    } else {
      setVisibleColumns([...visibleColumns, col]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md bg-[#081426] border border-[#263B59] rounded-lg px-3 py-1.5">
          <Search className="w-4 h-4 text-[#9BAFC8]" />
          <input
            type="text"
            placeholder="Search by Customer ID, contract, payment, or service..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent text-xs text-[#F5F7FA] outline-none placeholder-[#9BAFC8]/60"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#9BAFC8] hover:text-white text-xs px-1"
            >
              ×
            </button>
          )}
        </div>

        {/* Churn Filter tabs */}
        <div className="flex items-center gap-1 bg-[#081426] p-1 rounded-lg border border-[#263B59]">
          {(['All', 'No', 'Yes'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setChurnFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                churnFilter === status
                  ? status === 'Yes'
                    ? 'bg-[#FF5C5C] text-white shadow-sm'
                    : 'bg-[#2684FF] text-white shadow-sm'
                  : 'text-[#9BAFC8] hover:text-white'
              }`}
            >
              {status === 'All' ? 'All Records' : status === 'Yes' ? 'Churned Only' : 'Retained Only'}
            </button>
          ))}
        </div>

        {/* Column Picker & CSV Export */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowColPicker(!showColPicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#081426] border border-[#263B59] hover:border-[#2684FF] text-[#9BAFC8] hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Columns ({visibleColumns.length})</span>
          </button>

          {showColPicker && (
            <div className="absolute right-0 top-10 z-30 bg-[#0B1830] border border-[#263B59] rounded-xl p-3 shadow-2xl w-56 grid grid-cols-1 gap-1 text-xs max-h-72 overflow-y-auto">
              <div className="text-[11px] font-semibold text-[#9BAFC8] pb-1 border-b border-[#263B59] mb-1">
                Toggle Columns
              </div>
              {allColumns.map((col) => (
                <label
                  key={col}
                  className="flex items-center gap-2 text-[#F5F7FA] hover:bg-[#12243F] px-1.5 py-1 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col)}
                    onChange={() => toggleColumn(col)}
                    className="accent-[#2684FF]"
                  />
                  <span className="truncate">{col}</span>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={() => exportRecordsToCSV(filtered, 'Telco-Filtered-Customers.csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2684FF] hover:bg-[#1f6ecc] text-white rounded-lg text-xs font-medium transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Table</span>
          </button>
        </div>
      </div>

      {/* Dataset Summary Counter */}
      <div className="flex items-center justify-between text-xs text-[#9BAFC8] px-1 font-mono tabular-nums">
        <div>
          Showing records <span className="text-[#F5F7FA] font-bold">{pageStart + 1}</span> to{' '}
          <span className="text-[#F5F7FA] font-bold">
            {Math.min(pageStart + pageSize, filtered.length)}
          </span>{' '}
          of <span className="text-[#19C5E8] font-bold">{filtered.length.toLocaleString()}</span> matched
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1830] border-b border-[#263B59] text-[#9BAFC8] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Action</th>
                {visibleColumns.map((col) => (
                  <th key={col} className="py-3 px-4 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263B59]/60 font-mono tabular-nums">
              {currentRecords.map((r) => (
                <tr
                  key={r.customerID}
                  className="hover:bg-[#162B4C] transition-colors group cursor-pointer"
                  onClick={() => setSelectedCustomer(r)}
                >
                  <td className="py-2.5 px-4 font-sans whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(r);
                      }}
                      className="p-1 rounded text-[#9BAFC8] hover:text-[#19C5E8] hover:bg-[#081426] transition-colors"
                      title="Inspect Customer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                  {visibleColumns.map((col) => {
                    const val = r[col];
                    if (col === 'Churn') {
                      return (
                        <td key={col} className="py-2.5 px-4 whitespace-nowrap font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              val === 'Yes'
                                ? 'bg-[#FF5C5C]/20 text-[#FF5C5C]'
                                : 'bg-[#2684FF]/20 text-[#2684FF]'
                            }`}
                          >
                            {val === 'Yes' ? 'Churned' : 'Retained'}
                          </span>
                        </td>
                      );
                    }
                    if (col === 'MonthlyCharges' || col === 'TotalCharges') {
                      return (
                        <td key={col} className="py-2.5 px-4 whitespace-nowrap text-[#F5F7FA]">
                          ${Number(val).toFixed(2)}
                        </td>
                      );
                    }
                    if (col === 'tenure') {
                      return (
                        <td key={col} className="py-2.5 px-4 whitespace-nowrap text-[#19C5E8]">
                          {val} mos
                        </td>
                      );
                    }
                    return (
                      <td key={col} className="py-2.5 px-4 whitespace-nowrap text-[#9BAFC8] font-sans">
                        {String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-[#0B1830] border-t border-[#263B59] px-4 py-3 flex items-center justify-between">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#263B59] text-xs font-medium text-[#9BAFC8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-[#9BAFC8] font-mono tabular-nums">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#263B59] text-xs font-medium text-[#9BAFC8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Customer Record Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B1830] border border-[#263B59] rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#263B59] mb-4">
              <div>
                <h3 className="text-base font-bold text-[#F5F7FA] font-mono">
                  Customer {selectedCustomer.customerID}
                </h3>
                <span className="text-xs text-[#9BAFC8]">Individual Subscriber Dossier</span>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[#9BAFC8] hover:text-white text-lg font-mono p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#12243F] p-3 rounded-lg border border-[#263B59]">
                <span className="text-[#9BAFC8] block">Churn Status</span>
                <span
                  className={`font-bold font-sans ${
                    selectedCustomer.Churn === 'Yes' ? 'text-[#FF5C5C]' : 'text-[#2684FF]'
                  }`}
                >
                  {selectedCustomer.Churn === 'Yes' ? 'Terminated (Lost)' : 'Retained (Active)'}
                </span>
              </div>

              <div className="bg-[#12243F] p-3 rounded-lg border border-[#263B59]">
                <span className="text-[#9BAFC8] block">Tenure</span>
                <span className="font-bold text-[#19C5E8] font-mono">{selectedCustomer.tenure} months</span>
              </div>

              <div className="bg-[#12243F] p-3 rounded-lg border border-[#263B59]">
                <span className="text-[#9BAFC8] block">Contract Type</span>
                <span className="font-semibold text-white">{selectedCustomer.Contract}</span>
              </div>

              <div className="bg-[#12243F] p-3 rounded-lg border border-[#263B59]">
                <span className="text-[#9BAFC8] block">Internet Service</span>
                <span className="font-semibold text-white">{selectedCustomer.InternetService}</span>
              </div>

              <div className="bg-[#12243F] p-3 rounded-lg border border-[#263B59]">
                <span className="text-[#9BAFC8] block">Monthly Recurring Charge</span>
                <span className="font-bold text-white font-mono">${selectedCustomer.MonthlyCharges.toFixed(2)}</span>
              </div>

              <div className="bg-[#12243F] p-3 rounded-lg border border-[#263B59]">
                <span className="text-[#9BAFC8] block">Cumulative Total Charges</span>
                <span className="font-bold text-white font-mono">${selectedCustomer.TotalCharges.toFixed(2)}</span>
              </div>

              <div className="bg-[#12243F] p-3 rounded-lg border border-[#263B59] col-span-2">
                <span className="text-[#9BAFC8] block">Payment Method</span>
                <span className="font-semibold text-white">{selectedCustomer.PaymentMethod}</span>
              </div>

              <div className="bg-[#12243F] p-3 rounded-lg border border-[#263B59] col-span-2">
                <span className="text-[#9BAFC8] block mb-1">Add-on Services Subscribed</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ['TechSupport', selectedCustomer.TechSupport],
                    ['OnlineSecurity', selectedCustomer.OnlineSecurity],
                    ['OnlineBackup', selectedCustomer.OnlineBackup],
                    ['DeviceProtection', selectedCustomer.DeviceProtection],
                    ['StreamingTV', selectedCustomer.StreamingTV],
                    ['StreamingMovies', selectedCustomer.StreamingMovies],
                  ].map(([svc, val]) => (
                    <span
                      key={svc}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        val === 'Yes'
                          ? 'bg-[#19C5E8]/20 text-[#19C5E8] font-bold'
                          : 'bg-[#081426] text-[#9BAFC8]/60'
                      }`}
                    >
                      {svc}: {val}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 rounded-lg bg-[#2684FF] text-white text-xs font-medium cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
