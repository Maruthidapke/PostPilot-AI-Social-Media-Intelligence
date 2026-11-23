import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, ShieldCheck, Activity, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard': return 'Command Center & Analytics Dashboard';
      case '/connect-accounts': return 'Connect Social Accounts (Meta / LinkedIn / X)';
      case '/intelligence-center': return 'AI Intelligence Center';
      case '/content-planner': return 'Content Planner & Publishing Calendar';
      case '/create-post': return 'Create & Compose Multi-Platform Post';
      case '/scheduled-posts': return 'Scheduled & Queued Posts';
      case '/sentiment-analytics': return 'Audience Sentiment Analytics & Benchmark';
      case '/predictive-analytics': return 'Machine Learning Predictive Analytics';
      case '/best-time-to-post': return 'Best Time to Post (7x24 Matrix)';
      case '/engagement-analytics': return 'Engagement & Reach Analytics';
      case '/ai-content-assistant': return 'AI Content Assistant (Multi-Variant)';
      case '/sepm-workspace': return 'SEPM Agile Academic Workspace';
      case '/reports-and-docs': return 'Project Documentation & Technical Reports';
      case '/settings': return 'System Settings & API Diagnostic';
      default: return 'PostPilot AI';
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          {getPageTitle(location.pathname)}
        </h2>
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Dual-Engine Connected
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Data Attribution Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] font-medium text-amber-800">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Demo Sandbox • Standard Permitted Fields</span>
        </div>

        {/* Quick Action: New Post */}
        <Link
          to="/create-post"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-royal hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-brand-royal/20 transition-all hover:shadow-lg"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Post</span>
        </Link>
      </div>
    </header>
  );
};
