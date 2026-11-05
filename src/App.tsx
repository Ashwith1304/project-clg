/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CustomerRecord, FilterState, PageId, DataQualityReportData } from './types/churn';
import { parseRawCSV, filterRecords, computeKPISummary, exportRecordsToCSV } from './utils/dataProcessing';
import { reloadSqliteDatabase } from './utils/sqliteRunner';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GlobalFilters } from './components/GlobalFilters';

import { ExecutiveOverview } from './pages/ExecutiveOverview';
import { CustomerExplorer } from './pages/CustomerExplorer';
import { DataQualityReport } from './pages/DataQualityReport';
import { ExploratoryAnalysis } from './pages/ExploratoryAnalysis';
import { StatisticalAnalysis } from './pages/StatisticalAnalysis';
import { SqlBusinessAnalytics } from './pages/SqlBusinessAnalytics';
import { CustomerSegmentation } from './pages/CustomerSegmentation';
import { BusinessRecommendations } from './pages/BusinessRecommendations';
import { AboutProject } from './pages/AboutProject';

import { Loader2, Upload, AlertCircle } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  gender: 'All',
  contract: 'All',
  internetService: 'All',
  paymentMethod: 'All',
  tenureRange: [0, 72],
  searchQuery: '',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [allRecords, setAllRecords] = useState<CustomerRecord[]>([]);
  const [qualityReport, setQualityReport] = useState<DataQualityReportData | null>(null);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load Initial IBM Telco Dataset
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    fetch('/data/Telco-Customer-Churn.csv')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load dataset: HTTP ${res.status}`);
        }
        return res.text();
      })
      .then((csvText) => {
        if (!isMounted) return;
        const { records, report } = parseRawCSV(csvText);
        setAllRecords(records);
        setQualityReport(report);
        reloadSqliteDatabase(records);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Initial data fetch error:', err);
        setLoadError(
          'Automatic dataset loading failed. Please upload the Telco-Customer-Churn.csv file using the button below.'
        );
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Custom CSV File Upload
  const handleFileUpload = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        try {
          const { records, report } = parseRawCSV(text);
          setAllRecords(records);
          setQualityReport(report);
          setFilters(INITIAL_FILTERS);
          reloadSqliteDatabase(records);
          setLoadError(null);
        } catch (err) {
          console.error('Error parsing uploaded CSV:', err);
          setLoadError('Failed to parse uploaded CSV. Ensure it has valid Telco headers.');
        }
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setLoadError('Error reading uploaded file.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  // Export Cleaned CSV
  const handleExportCSV = () => {
    exportRecordsToCSV(allRecords, 'Telco-Customer-Churn-Cleaned.csv');
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Filter Records & Compute KPIs
  const filteredRecords = filterRecords(allRecords, filters);
  const kpis = computeKPISummary(filteredRecords);

  return (
    <div className="flex min-h-screen bg-[#081426] text-[#F5F7FA]">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        totalRecords={allRecords.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentPage={currentPage}
          totalFiltered={filteredRecords.length}
          totalOriginal={allRecords.length}
          onFileUpload={handleFileUpload}
          onExportCSV={handleExportCSV}
          onResetData={() => {
            // Re-fetch default dataset
            setIsLoading(true);
            fetch('/data/Telco-Customer-Churn.csv')
              .then((r) => r.text())
              .then((txt) => {
                const { records, report } = parseRawCSV(txt);
                setAllRecords(records);
                setQualityReport(report);
                setFilters(INITIAL_FILTERS);
                reloadSqliteDatabase(records);
                setIsLoading(false);
              });
          }}
        />

        {/* Global Filters Bar */}
        <GlobalFilters
          filters={filters}
          onChange={(newFilters) => setFilters(newFilters)}
          onReset={handleResetFilters}
          totalFiltered={filteredRecords.length}
          totalOriginal={allRecords.length}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <Loader2 className="w-10 h-10 text-[#2684FF] animate-spin" />
              <div className="text-center">
                <h3 className="text-base font-semibold text-white">Ingesting Telco Churn Dataset</h3>
                <p className="text-xs text-[#9BAFC8] mt-1 font-mono">
                  Validating 7,043 customer accounts &amp; compiling SQLite indices...
                </p>
              </div>
            </div>
          ) : loadError ? (
            <div className="max-w-md mx-auto my-12 bg-[#12243F] border border-[#263B59] rounded-2xl p-8 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#FF5C5C]/20 flex items-center justify-center mx-auto text-[#FF5C5C]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Dataset Ingestion Notice</h3>
                <p className="text-xs text-[#9BAFC8] mt-2 leading-relaxed">{loadError}</p>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#2684FF] hover:bg-[#1f6ecc] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-md shadow-[#2684FF]/30">
                <Upload className="w-4 h-4" />
                <span>Upload Telco-Customer-Churn.csv</span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
              </label>
            </div>
          ) : (
            <>
              {currentPage === 'overview' && (
                <ExecutiveOverview records={filteredRecords} kpis={kpis} />
              )}
              {currentPage === 'explorer' && (
                <CustomerExplorer records={filteredRecords} />
              )}
              {currentPage === 'quality' && qualityReport && (
                <DataQualityReport report={qualityReport} />
              )}
              {currentPage === 'eda' && (
                <ExploratoryAnalysis records={filteredRecords} />
              )}
              {currentPage === 'statistics' && (
                <StatisticalAnalysis records={filteredRecords} />
              )}
              {currentPage === 'sql' && (
                <SqlBusinessAnalytics records={filteredRecords} />
              )}
              {currentPage === 'segmentation' && (
                <CustomerSegmentation records={filteredRecords} />
              )}
              {currentPage === 'recommendations' && <BusinessRecommendations />}
              {currentPage === 'about' && <AboutProject />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
