import React, { useState } from 'react';
import {
  FileText,
  Download,
  Presentation,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Terminal,
  ExternalLink,
  Code,
  Printer,
  Sparkles
} from 'lucide-react';

export const ReportsDocsPage = () => {
  const [docTab, setDocTab] = useState('srs');

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Module: Reports & Documentation
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Complete Academic Deliverables</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Academic Documentation, SQA Plans & Deliverables
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Access the complete IEEE-standard Software Requirements Specification, System Architecture, SQA Plans, Test Suites, and Responsible AI Charter.
          </p>
        </div>

        {/* Deliverables Download Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
          <a
            href="/api/sentiment/history?format=csv"
            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-brand-royal text-xs font-semibold flex items-center gap-1.5 transition-all border border-blue-200"
          >
            <Download className="w-3.5 h-3.5" />
            Export Sentiment CSV
          </a>
        </div>
      </div>

      {/* Presentation & Report Card Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-navy-900 to-indigo-950 text-white rounded-2xl p-5 border border-indigo-900 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Presentation className="w-4 h-4 text-purple-400" /> 12-Slide Viva Presentation
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/30 text-purple-200">
              pptx format
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Covers Project Title, Problem Statement, System Architecture, Phase 1 to Phase 5 highlights, Live Demo Flow, ML Results, and Responsible AI reflection.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-indigo-300 font-mono">PostPilot_AI_Presentation.pptx</span>
            <a
              href="/downloads/PostPilot_AI_Presentation.pptx"
              download="PostPilot_AI_Presentation.pptx"
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download PPTX
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-navy-900 to-blue-950 text-white rounded-2xl p-5 border border-blue-900 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" /> Comprehensive Academic Report
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200">
              pdf format
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Full 10-chapter academic submission PDF covering SDLC, Requirements Engineering, Agile Sprints, Test Coverage, SonarQube Metrics, and Conclusion.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-blue-300 font-mono">PostPilot_AI_Academic_Report.pdf</span>
            <a
              href="/downloads/PostPilot_AI_Academic_Report.pdf"
              download="PostPilot_AI_Academic_Report.pdf"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </a>
          </div>
        </div>
      </div>

      {/* Documentation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto bg-slate-50 text-xs font-bold">
          {[
            { id: 'srs', label: '1. SRS (v2 Human-Audited)' },
            { id: 'arch', label: '2. Architecture & Connectors' },
            { id: 'test', label: '3. Test Cases & E2E Journey' },
            { id: 'sqa', label: '4. SQA Plan & SonarQube' },
            { id: 'ethics', label: '5. Responsible AI Charter' },
            { id: 'prompt', label: '6. AI Prompt Engineering Log' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setDocTab(t.id)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                docTab === t.id
                  ? 'bg-brand-royal text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {docTab === 'srs' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
                Software Requirements Specification (IEEE 830 Standard) - Summary
              </h3>
              <p>
                <strong>System Objective:</strong> PostPilot AI is a centralized marketing intelligence platform addressing multi-channel management friction, uncalibrated sentiment understanding, and engagement unpredictability for SMBs and creators.
              </p>
              <p>
                <strong>Critical Engineering Constraints:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Meta Graph API restriction: Personal Instagram profiles are rejected; only Instagram Business and Creator accounts linked to a Facebook Page are permitted.</li>
                <li>Data Attribution Mandate: Every analytic card must display whether metrics originate from Actual Connected Accounts, Database Calculations, AI Predictions, or Demo Simulation.</li>
                <li>Credential Security: Social OAuth tokens must be encrypted via AES-256-GCM and never exposed to the frontend browser runtime.</li>
              </ul>
            </div>
          )}

          {docTab === 'arch' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
                System Architecture & Connector Topology
              </h3>
              <p>
                The system implements a decoupled 3-tier architecture with a specialized social connector adapter layer.
              </p>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto">
                {`[ React 18 Client (Port 5173) ]
         │ (JWT Bearer Token / HTTPS)
         ▼
[ Express.js REST API (Port 5002) ]
  ├── /api/auth         (Bcrypt / JWT Sessions)
  ├── /api/social       (Meta Graph API v21.0 / X API v2 Adapter)
  ├── /api/posts        (Multi-Platform Scheduler Engine)
  ├── /api/sentiment    (Cardiff Twitter-RoBERTa Calibrated Classifier)
  └── /api/predictions  (Random Forest Engagement Regression)
         │
         ├───► [ Dual-Engine Persistence: MongoDB / data/db.json ]
         └───► [ Python AI Microservice (Port 8000) ]`}
              </div>
            </div>
          )}

          {docTab === 'test' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
                Verification Suites & E2E Journey Results
              </h3>
              <p>
                7 automated test suites and 14-step End-to-End user journeys were executed against the PostPilot API:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold block">Unit Tests</span>
                  <span className="text-base font-black text-emerald-700">7/7 Passed</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold block">E2E Steps</span>
                  <span className="text-base font-black text-emerald-700">14/14 Passed</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold block">Benchmark Accuracy</span>
                  <span className="text-base font-black text-emerald-700">83.3%</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold block">Blocker Defects</span>
                  <span className="text-base font-black text-emerald-700">0 Defects</span>
                </div>
              </div>
            </div>
          )}

          {docTab === 'sqa' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
                Software Quality Assurance (IEEE 730) & SonarQube Metrics
              </h3>
              <p>
                Codebase analyzed against SonarQube Community Edition Quality Gate parameters:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Bugs: 0 (Rating: A)</li>
                <li>Vulnerabilities: 0 (Rating: A)</li>
                <li>Security Hotspots Reviewed: 100% (AES-256-GCM token storage verified)</li>
                <li>Technical Debt: &lt; 1 hour</li>
              </ul>
            </div>
          )}

          {docTab === 'ethics' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
                Responsible AI & Ethics Charter
              </h3>
              <p>
                In alignment with SEPM guidelines, PostPilot AI enforces algorithmic transparency:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>No Hallucinated Predictions: Regression models output confidence intervals (e.g., ±2.1% error band) rather than absolute viral guarantees.</li>
                <li>No Covert Sentiment Scoring: Sentiment confidence scores (e.g., 92%) and detected themes are displayed visibly to users.</li>
                <li>Zero Credential Leakage: Access tokens are stripped from all API response serializations.</li>
              </ul>
            </div>
          )}

          {docTab === 'prompt' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h3 className="text-base font-extrabold text-slate-900 border-b pb-2">
                AI Prompt Engineering & Audit Trail Log
              </h3>
              <p>
                Comprehensive audit trail documenting prompts utilized, human engineering corrections, and rationale:
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
                <p><strong>Initial Prompt:</strong> "Generate full Instagram scraper for personal accounts"</p>
                <p className="text-rose-600"><strong>Human Correction:</strong> Rejected. Meta Graph API restricts data collection to Business/Creator accounts via OAuth 2.0.</p>
                <p className="text-emerald-700"><strong>Engineering Decision:</strong> Implemented official Meta Graph API v21.0 adapter with AES-256 encrypted tokens.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsDocsPage;
