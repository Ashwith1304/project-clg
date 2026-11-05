import React from 'react';
import { GraduationCap, Users, Cpu, GitBranch, Terminal, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AboutProject: React.FC = () => {
  const teamMembers = [
    {
      name: 'G Mythili',
      rollNo: '24311A67H8',
      role: 'Data Science & Statistical Modeling',
      responsibilities: 'Hypothesis testing (Welch t-test, Chi-square), IQR outlier audits, and univariate distribution analysis.',
    },
    {
      name: 'K Ashiwith',
      rollNo: '24311A67H6',
      role: 'Full-Stack Engineering & SQL Architecture',
      responsibilities: 'SQLite WebAssembly schema integration, interactive UI design, global filtering, and component pipeline.',
    },
    {
      name: 'D Niyati',
      rollNo: '24311A67H7',
      role: 'Business Intelligence & Exploratory Analysis',
      responsibilities: 'Cross-tabulation analytics, customer lifecycle segmentation, and empirical recommendation derivation.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Hero Banner */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2684FF]/20 border border-[#2684FF]/40 text-xs font-mono text-[#19C5E8]">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Capstone &amp; Demonstration Project</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F5F7FA] tracking-tight">
            CUSTOMER CHURN ANALYSIS AND BUSINESS INTELLIGENCE DASHBOARD
          </h1>

          <p className="text-sm text-[#19C5E8] font-medium">
            An Interactive Data Analytics Platform for Understanding Customer Retention
          </p>

          <p className="text-xs text-[#9BAFC8] leading-relaxed">
            Developed as an empirical, data-driven Business Intelligence system investigating subscriber churn within telecommunications portfolios. Strictly adheres to factual exploratory data analysis, descriptive statistics, hypothesis testing, and relational SQL querying with zero black-box predictive models.
          </p>
        </div>
      </div>

      {/* Academic Team Details Section */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#263B59]">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2684FF]" />
            <h3 className="text-base font-bold text-white">Project Authors &amp; Academic Details</h3>
          </div>
          <div className="text-xs font-mono text-[#19C5E8]">
            Sreenidhi Institute of Science and Technology (SNIST)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.rollNo}
              className="bg-[#081426] border border-[#263B59] rounded-xl p-4 flex flex-col justify-between hover:border-[#2684FF] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white text-sm">{member.name}</span>
                  <span className="font-mono text-[11px] text-[#19C5E8] bg-[#12243F] px-2 py-0.5 rounded border border-[#263B59]">
                    {member.rollNo}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#2684FF] block mb-2">{member.role}</span>
                <p className="text-[11px] text-[#9BAFC8] leading-relaxed">{member.responsibilities}</p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#263B59]/60 text-[10px] text-[#9BAFC8] font-mono">
                Department: CSE – Data Science
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#0B1830] border border-[#263B59] rounded-lg flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-[#9BAFC8]">College / Institution:</span>{' '}
            <strong className="text-white">Sreenidhi Institute of Science and Technology (SNIST)</strong>
          </div>
          <div>
            <span className="text-[#9BAFC8]">Branch / Specialization:</span>{' '}
            <strong className="text-[#19C5E8]">Computer Science and Engineering (Data Science)</strong>
          </div>
        </div>
      </div>

      {/* Architecture Flowchart Section */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-[#263B59]">
          <GitBranch className="w-5 h-5 text-[#19C5E8]" />
          <h3 className="text-base font-bold text-white">System Architecture &amp; Data Pipeline</h3>
        </div>

        <div className="bg-[#081426] border border-[#263B59] rounded-xl p-5 overflow-x-auto">
          <pre className="font-mono text-xs text-[#19C5E8] leading-relaxed whitespace-pre">
{`┌────────────────────────────────────────────────────────┐
│              IBM TELCO DATASET (CSV)                   │
│      7,043 Records · 21 Attributes · Raw Input         │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             DATA INPUT &amp; VALIDATION ENGINE              │
│  Schema validation · Null detection · Deduplication    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│           DATA CLEANING &amp; TRANSFORMATION               │
│   TotalCharges float parse · IQR Outlier Fencing       │
│   Processed CSV export to data/processed/              │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             EMBEDDED SQLITE DATABASE                   │
│   WebAssembly SQL.js · Indexed table 'telco_churn'     │
│   Persistent schema &amp; fast in-memory execution         │
└─────────────┬──────────────────────────┬───────────────┘
              │                          │
              ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│     ANALYTICS ENGINE     │  │   SQL BUSINESS ENGINE    │
│  Descriptive Stats (μ,σ) │  │  10 Executive Queries    │
│  Welch's t-test (t=-34.8)│  │  Month-to-month analysis │
│  Chi-Square (χ²=1184.6)  │  │  Ad-hoc query console    │
└─────────────┬────────────┘  └──────────┬───────────────┘
              │                          │
              └──────────────┬───────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────┐
│              VISUALIZATION ENGINE                      │
│   Plotly Interactive Charts · Dynamic SVGs · KPIs       │
│   Dark Navy Theme (#081426 / #0B1830 / #12243F)        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│        BUSINESS INSIGHTS &amp; RECOMMENDATIONS             │
│   Financial risk quantification · Retention blueprint │
└────────────────────────────────────────────────────────┘`}
          </pre>
        </div>
      </div>

      {/* Technology Stack Specifications */}
      <div className="bg-[#12243F] border border-[#263B59] rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-[#263B59]">
          <Cpu className="w-5 h-5 text-[#2684FF]" />
          <h3 className="text-base font-bold text-white">Full-Stack Technology Suite</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#081426] p-4 rounded-xl border border-[#263B59]">
            <span className="font-bold text-[#19C5E8] block mb-1">Backend &amp; Analytics</span>
            <ul className="space-y-1 text-[#9BAFC8]">
              <li>• Python 3.10+</li>
              <li>• Pandas &amp; NumPy</li>
              <li>• SciPy Stats</li>
              <li>• SQLite 3 Relational DB</li>
            </ul>
          </div>

          <div className="bg-[#081426] p-4 rounded-xl border border-[#263B59]">
            <span className="font-bold text-[#2684FF] block mb-1">Data Visualizations</span>
            <ul className="space-y-1 text-[#9BAFC8]">
              <li>• Plotly (Interactive)</li>
              <li>• Matplotlib &amp; Seaborn</li>
              <li>• Custom Responsive SVGs</li>
              <li>• Motion Animations</li>
            </ul>
          </div>

          <div className="bg-[#081426] p-4 rounded-xl border border-[#263B59]">
            <span className="font-bold text-[#19C5E8] block mb-1">Frontend Applications</span>
            <ul className="space-y-1 text-[#9BAFC8]">
              <li>• React 19 SPA</li>
              <li>• Tailwind CSS v4</li>
              <li>• Streamlit Dashboard</li>
              <li>• Lucide Data Icons</li>
            </ul>
          </div>

          <div className="bg-[#081426] p-4 rounded-xl border border-[#263B59]">
            <span className="font-bold text-[#2684FF] block mb-1">Engine &amp; Performance</span>
            <ul className="space-y-1 text-[#9BAFC8]">
              <li>• sql.js (WebAssembly)</li>
              <li>• PapaParse CSV Engine</li>
              <li>• Vite 8 Build System</li>
              <li>• Full Tabular Figures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
