import React, { useState, useEffect } from 'react';
import { CustomerRecord, BusinessQuestion } from '../types/churn';
import {
  getSqliteDatabase,
  executeSqlQuery,
  TEN_BUSINESS_QUESTIONS,
} from '../utils/sqliteRunner';
import { Terminal, Play, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import type { Database } from 'sql.js';

interface SqlBusinessAnalyticsProps {
  records: CustomerRecord[];
}

export const SqlBusinessAnalytics: React.FC<SqlBusinessAnalyticsProps> = ({ records }) => {
  const [db, setDb] = useState<Database | null>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Selected pre-defined question
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(4);

  // Custom SQL Editor State
  const [customQuery, setCustomQuery] = useState(
    'SELECT Contract, PaymentMethod, COUNT(*) AS Total, ROUND(AVG(MonthlyCharges), 2) AS AvgMonthly\nFROM telco_churn\nWHERE Churn = "Yes"\nGROUP BY Contract, PaymentMethod\nORDER BY Total DESC\nLIMIT 5;'
  );
  const [customResult, setCustomResult] = useState<{
    columns: string[];
    values: (string | number | null)[][];
  } | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Initialize SQLite WebAssembly
  useEffect(() => {
    let isMounted = true;
    setDbLoading(true);
    getSqliteDatabase(records)
      .then((database) => {
        if (isMounted) {
          setDb(database);
          setDbLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setDbError(String(err));
          setDbLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [records]);

  // Execute custom query
  const handleRunCustomQuery = () => {
    if (!db) return;
    try {
      setCustomError(null);
      const res = executeSqlQuery(db, customQuery);
      setCustomResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setCustomError(msg);
      setCustomResult(null);
    }
  };

  const copyQuery = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeQuestion = TEN_BUSINESS_QUESTIONS.find((q) => q.id === selectedQuestionId) || TEN_BUSINESS_QUESTIONS[0];

  // Execute active pre-defined question query
  let activeResult: { columns: string[]; values: (string | number | null)[][] } | null = null;
  let activeError: string | null = null;
  if (db) {
    try {
      activeResult = executeSqlQuery(db, activeQuestion.query);
    } catch (err: unknown) {
      activeError = err instanceof Error ? err.message : String(err);
    }
  }

  return (
    <div className="space-y-6">
      {/* SQLite Engine Status Banner */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2684FF]/20 flex items-center justify-center text-[#2684FF] shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F5F7FA]">Embedded SQLite Database Engine</h3>
            <p className="text-xs text-[#9BAFC8]">
              Relational table <code className="text-[#19C5E8]">telco_churn</code> populated with{' '}
              <strong className="text-white">{records.length.toLocaleString()} verified customer records</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
          {dbLoading ? (
            <span className="text-[#FFA940]">Initializing WebAssembly SQLite...</span>
          ) : dbError ? (
            <span className="text-[#FF5C5C] flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> SQLite Failed
            </span>
          ) : (
            <span className="text-[#19C5E8] flex items-center gap-1.5 bg-[#19C5E8]/10 px-2.5 py-1 rounded-md border border-[#19C5E8]/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> SQLite Engine Active
            </span>
          )}
        </div>
      </div>

      {/* 10 Standard Business Questions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Business Questions Selector */}
        <div className="bg-[#0B1830] border border-[#263B59] rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-[#9BAFC8] uppercase tracking-wider px-2 pb-1 border-b border-[#263B59]">
            Business Intelligence Questions (1–10)
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {TEN_BUSINESS_QUESTIONS.map((q) => {
              const isSelected = selectedQuestionId === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2684FF] text-white shadow-md font-semibold'
                      : 'text-[#9BAFC8] hover:text-[#F5F7FA] hover:bg-[#12243F]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] shrink-0 ${
                        isSelected ? 'bg-white/20 text-white font-bold' : 'bg-[#081426] text-[#19C5E8]'
                      }`}
                    >
                      {q.id}
                    </span>
                    <span className="truncate">{q.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Query, Table Result, and Interpretation */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5 space-y-4 shadow-xl">
            {/* Header & Question */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#263B59]">
              <div>
                <div className="text-xs font-mono text-[#19C5E8] font-bold mb-1">
                  BUSINESS QUESTION {activeQuestion.id} OF 10
                </div>
                <h4 className="text-base font-bold text-[#F5F7FA]">{activeQuestion.title}</h4>
                <p className="text-xs text-[#9BAFC8] mt-1">{activeQuestion.question}</p>
              </div>

              <button
                onClick={() => copyQuery(activeQuestion.id, activeQuestion.query)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#9BAFC8] hover:text-white bg-[#081426] border border-[#263B59] rounded-md transition-colors shrink-0"
              >
                {copiedId === activeQuestion.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#19C5E8]" />
                    <span className="text-[#19C5E8]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            {/* SQL Code Box */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#9BAFC8] uppercase">SQL Query:</span>
              <pre className="bg-[#081426] border border-[#263B59] rounded-lg p-3 text-xs font-mono text-[#19C5E8] overflow-x-auto leading-relaxed">
                {activeQuestion.query}
              </pre>
            </div>

            {/* Query Results Table */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#9BAFC8] uppercase">Execution Result:</span>
              {activeError ? (
                <div className="p-3 bg-[#FF5C5C]/10 border border-[#FF5C5C]/40 text-[#FF5C5C] text-xs rounded-lg font-mono">
                  {activeError}
                </div>
              ) : activeResult && activeResult.values.length > 0 ? (
                <div className="border border-[#263B59] rounded-lg overflow-x-auto bg-[#081426]">
                  <table className="w-full text-left text-xs font-mono tabular-nums">
                    <thead>
                      <tr className="bg-[#0B1830] border-b border-[#263B59] text-[#9BAFC8]">
                        {activeResult.columns.map((col) => (
                          <th key={col} className="py-2 px-3 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#263B59]/40">
                      {activeResult.values.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#162B4C] transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-2 px-3 text-[#F5F7FA] whitespace-nowrap">
                              {cell === null ? 'NULL' : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-3 text-xs text-[#9BAFC8] bg-[#081426] rounded-lg border border-[#263B59]">
                  No rows returned.
                </div>
              )}
            </div>

            {/* Business Interpretation Box */}
            <div className="p-4 bg-[#0B1830] border border-[#263B59] rounded-lg text-xs leading-relaxed">
              <strong className="text-[#19C5E8] font-sans block mb-1">Business Interpretation:</strong>
              <p className="text-[#9BAFC8]">{activeQuestion.interpretation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE CUSTOM SQL TERMINAL */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#263B59]">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#19C5E8]" />
            <div>
              <h4 className="text-sm font-bold text-[#F5F7FA]">Ad-Hoc SQL Query Console</h4>
              <p className="text-xs text-[#9BAFC8]">
                Execute custom SQL analytics queries directly against the live <code className="text-white">telco_churn</code> database.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunCustomQuery}
            disabled={!db}
            className="flex items-center gap-2 px-4 py-2 bg-[#2684FF] hover:bg-[#1f6ecc] text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer disabled:opacity-40"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run SQL Query</span>
          </button>
        </div>

        <div className="space-y-2">
          <textarea
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            rows={5}
            className="w-full bg-[#081426] border border-[#263B59] rounded-lg p-3 text-xs font-mono text-[#F5F7FA] outline-none focus:border-[#2684FF] transition-colors leading-relaxed"
            placeholder="Type your SELECT query here..."
          />
        </div>

        {customError && (
          <div className="p-3 bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 text-[#FF5C5C] text-xs rounded-lg font-mono">
            {customError}
          </div>
        )}

        {customResult && (
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#9BAFC8]">
              Returned <strong className="text-white">{customResult.values.length}</strong> rows
            </div>
            <div className="border border-[#263B59] rounded-lg overflow-x-auto bg-[#081426] max-h-72">
              <table className="w-full text-left text-xs font-mono tabular-nums">
                <thead className="sticky top-0 bg-[#0B1830] z-10 border-b border-[#263B59]">
                  <tr className="text-[#9BAFC8]">
                    {customResult.columns.map((col) => (
                      <th key={col} className="py-2 px-3 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263B59]/40">
                  {customResult.values.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#162B4C] transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-1.5 px-3 text-[#F5F7FA] whitespace-nowrap">
                          {cell === null ? 'NULL' : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
