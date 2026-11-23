import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Share2,
  Sparkles,
  Calendar,
  PlusCircle,
  Clock,
  Smile,
  TrendingUp,
  Flame,
  BarChart3,
  Wand2,
  Briefcase,
  FileText,
  Settings,
  Database,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/connect-accounts', label: 'Connect Accounts', icon: Share2, badge: 'OAuth 2.0' },
  { path: '/intelligence-center', label: 'AI Intelligence Center', icon: Sparkles, highlight: true },
  { path: '/content-planner', label: 'Content Planner', icon: Calendar },
  { path: '/create-post', label: 'Create Post', icon: PlusCircle },
  { path: '/scheduled-posts', label: 'Scheduled Posts', icon: Clock },
  { path: '/sentiment-analytics', label: 'Sentiment Analytics', icon: Smile },
  { path: '/predictive-analytics', label: 'Predictive Analytics', icon: TrendingUp },
  { path: '/best-time-to-post', label: 'Best Time to Post', icon: Flame },
  { path: '/engagement-analytics', label: 'Engagement Analytics', icon: BarChart3 },
  { path: '/ai-content-assistant', label: 'AI Content Assistant', icon: Wand2 },
  { path: '/sepm-workspace', label: 'SEPM Workspace', icon: Briefcase, badge: 'Academic' },
  { path: '/reports-and-docs', label: 'Reports & Docs', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings }
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLoadDemo = async () => {
    setDemoLoading(true);
    try {
      await api.loadDemoData();
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleResetDemo = async () => {
    setDemoLoading(true);
    try {
      await api.resetDemoData();
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-navy-900 border-r border-navy-700 text-slate-300 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-navy-700/80 bg-navy-900/50">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-royal to-brand-purple flex items-center justify-center text-white shadow-lg shadow-brand-royal/20 flex-shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
                PostPilot <span className="text-blue-400 font-bold">AI</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                P59 • Social Intelligence
              </p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-royal to-brand-purple flex items-center justify-center text-white shadow-md">
            <Send className="w-5 h-5" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors hidden md:block"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-royal text-white shadow-md shadow-brand-royal/25 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
                } ${item.highlight && !collapsed ? 'ring-1 ring-brand-purple/40 bg-navy-800/40' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-navy-700/80 text-blue-300 border border-navy-600">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Demo Controls & Academic Tag */}
      {!collapsed ? (
        <div className="p-3 border-t border-navy-700/80 bg-navy-950/40 space-y-2">
          <div className="p-2.5 rounded-xl bg-navy-800/80 border border-navy-700 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" /> Demo Sandbox
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/50">
                ACTIVE
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              <button
                onClick={handleLoadDemo}
                disabled={demoLoading}
                className="px-2 py-1.5 rounded-lg bg-brand-royal/20 hover:bg-brand-royal/30 text-blue-300 border border-blue-500/30 text-[11px] font-medium text-center transition-all flex items-center justify-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${demoLoading ? 'animate-spin' : ''}`} />
                Load Demo
              </button>
              <button
                onClick={handleResetDemo}
                disabled={demoLoading}
                className="px-2 py-1.5 rounded-lg bg-navy-700 hover:bg-navy-600 text-slate-300 border border-navy-600 text-[11px] font-medium text-center transition-all"
              >
                Reset Demo
              </button>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-navy-800/40 border border-navy-700/50">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300 font-bold text-xs flex-shrink-0">
                MD
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Maruthi Dapke'}</p>
                <p className="text-[10px] text-slate-400 truncate">ENG24CS0127 • DSU</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-navy-700 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-navy-700 flex flex-col items-center gap-2">
          <button
            onClick={handleLoadDemo}
            className="p-2 rounded-lg bg-navy-800 hover:bg-brand-royal text-blue-300 hover:text-white transition-colors"
            title="Load Demo Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
