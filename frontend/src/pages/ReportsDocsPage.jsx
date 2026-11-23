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
  Code
} from 'lucide-react';

export const ReportsDocsPage = () => {
  const [docTab, setDocTab] = useState('srs');

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
        <div className="flex items-center gap-2.5">
          <a
            href="/docs/SRS.md"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download Markdown Docs
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
              generate_presentation.py
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Covers Project Title, Problem Statement, System Architecture, Phase 1 to Phase 5 highlights, Live Demo Flow, ML Results, and Responsible AI reflection.
          </p>
          <div className="text-xs text-indigo-200 font-mono bg-navy-900/60 p-2.5 rounded-xl border border-indigo-800">
            $ python3 generate_presentation.py &rarr; PostPilot_AI_Presentation.pptx
          </div>
        </div>

        <div className="bg-gradient-to-br from-navy-900 to-blue-950 text-white rounded-2xl p-5 border border-blue-900 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" /> Comprehensive Academic Report
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200">
              generate_report.py
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Full 10-chapter academic submission PDF covering SDLC, Requirements Engineering, Agile Sprints, Test Coverage, SonarQube Metrics, and Conclusion.
          </p>
          <div className="text-xs text-blue-200 font-mono bg-navy-900/60 p-2.5 rounded-xl border border-blue-800">
            $ python3 generate_report.py &rarr; PostPilot_AI_Academic_Report.pdf
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
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                docTab === t.id
                  ? 'bg-brand-royal text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 text-xs text-slate-700 leading-relaxed space-y-4">
          {docTab === 'srs' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">Software Requirements Specification (SRS v2.0)</h3>
              <p><strong>1. Purpose:</strong> Provide centralized social media management, audience sentiment analytics, and probabilistic machine learning engagement forecasting across Instagram, Facebook, LinkedIn, and X.</p>
              <p><strong>2. Scope & Target Users:</strong> Small business owners, marketing teams, content managers, and student evaluators.</p>
              <p><strong>3. Security Constraints:</strong> All third-party OAuth access and refresh tokens are encrypted using AES-256-GCM. Passwords hashed using bcrypt. Sensitive credentials isolated from all frontend responses.</p>
              <p><strong>4. Platform Policy:</strong> Complies strictly with Meta Graph API professional account mandates (Instagram Business linked to Facebook Page).</p>
            </div>
          )}

          {docTab === 'arch' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">System Architecture & Modular Connectors</h3>
              <p>PostPilot AI implements a layered micro-modular full-stack architecture:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Presentation Layer:</strong> React 18, Vite, Tailwind CSS, Recharts, FullCalendar UI.</li>
                <li><strong>Application & API Layer:</strong> Node.js Express REST API server with JWT middleware and AES-256 encryption.</li>
                <li><strong>Social Connector Adapters:</strong> Modular drivers for Meta Graph API (Instagram Business & Facebook Pages), LinkedIn v2, and Twitter v2 (PKCE).</li>
                <li><strong>Dual-Engine Database Layer:</strong> MongoDB Mongoose with automatic fallback to JSON file store (`data/db.json`) for zero-config demo resilience.</li>
                <li><strong>Inference & Scheduling Daemon:</strong> Python FastAPI / in-process Cardiff RoBERTa sentiment classifier and Random Forest engagement regressor.</li>
              </ul>
            </div>
          )}

          {docTab === 'test' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">Testing Strategy & Test Automation</h3>
              <p>Target: 80% test coverage with zero blocker defects. The test suite includes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Unit tests for token encryption/decryption (AES-256-GCM).</li>
                <li>Social connector authorization URL generation and token exchange.</li>
                <li>Sentiment classifier evaluation against 60 ground-truth comments (83.3% achieved vs 80% target).</li>
                <li>Random forest regression bounds and category verification.</li>
                <li>Insufficient data guard test (`status: insufficient_data`).</li>
                <li>Automated 14-step E2E system user journey (`tests/e2e_journey.js`).</li>
              </ul>
            </div>
          )}

          {docTab === 'sqa' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">Software Quality Assurance (SQA) & SonarQube</h3>
              <p>PostPilot AI follows IEEE 730 standard quality assurance practices:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Bugs:</strong> 0 blocker bugs.</li>
                <li><strong>Vulnerabilities:</strong> 0 security vulnerabilities. AES-256 token encryption prevents token leaks.</li>
                <li><strong>Code Smells:</strong> Modular separation of social drivers, database controllers, and ML services.</li>
                <li><strong>Quality Gate:</strong> Configured in `sonar-project.properties` with coverage threshold &gt;= 80%.</li>
              </ul>
            </div>
          )}

          {docTab === 'ethics' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">Responsible AI & Ethics Charter</h3>
              <p>Adheres strictly to ACM / IEEE ethical computing guidelines:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Prediction Uncertainty:</strong> System displays probabilistic confidence bounds and explicitly disclaims viral guarantees.</li>
                <li><strong>Sentiment Boundaries:</strong> Comments are evaluated for linguistic valence only; no personal profiling or author identity inference is attempted.</li>
                <li><strong>Data Attribution:</strong> Every metric displays its origin: Actual Platform, Calculated, AI Predicted, or Demo.</li>
                <li><strong>Data Privacy:</strong> Full account disconnection purges stored credentials from the database.</li>
              </ul>
            </div>
          )}

          {docTab === 'prompt' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">AI Prompt Engineering & Audit Trail</h3>
              <p>Record of AI-assisted engineering prompts and human modifications:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Prompt 1:</strong> Synthesizing User Stories & INVEST Acceptance Criteria &rarr; Audited to remove vague acceptance terms.</li>
                <li><strong>Prompt 2:</strong> Synthesizing AES-256-GCM token encryption &rarr; Verified IV randomness and authentication tag checks.</li>
                <li><strong>Prompt 3:</strong> Generating 60-comment benchmark dataset &rarr; Human reviewers labeled comments independently before model validation.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
