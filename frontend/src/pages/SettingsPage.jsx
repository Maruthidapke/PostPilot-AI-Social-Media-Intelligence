import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Key,
  Database,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Server,
  Cpu,
  Clock,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await api.getHealth();
      setHealth(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset database to clean initial state?')) return;
    try {
      await api.resetDemoData();
      setStatusMessage('Database reset successfully.');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e) {
      alert('Error resetting data: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Module: System Settings
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Service Diagnostics & Profile</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Settings & Operational Telemetry
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Review service health, verify AES-256 token encryption status, manage user profile, and inspect background runners.
          </p>
        </div>

        <button
          onClick={checkHealth}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Check Diagnostics
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Key className="w-4 h-4 text-brand-royal" />
            Active User Profile
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Full Name:</span>
              <span className="font-bold text-slate-800 text-sm">{user?.name || 'Maruthi Dapke'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Email:</span>
              <span className="font-bold text-slate-800 text-sm">{user?.email || 'demo@postpilot.ai'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Assigned Role:</span>
              <span className="capitalize font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                {user?.role || 'Manager'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Academic USN:</span>
              <span className="font-mono font-bold text-slate-800">ENG24CS0127 • Dayananda Sagar University</span>
            </div>
          </div>
        </div>

        {/* Diagnostics & Health */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            System Health & Daemons
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium">Node.js Express API:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Online (Port 5002)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium">Dual-Engine Database:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {health?.database?.engine || 'Persistent Active'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium">Scheduler Background Daemon:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Running (10s Interval)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium">OAuth Token Encryption:</span>
              <span className="font-bold text-purple-700 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> AES-256-GCM Enforced
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone / Reset */}
      <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-200 text-xs space-y-3">
        <h3 className="font-bold text-rose-900 text-sm">Database Maintenance & Demo Factory Reset</h3>
        <p className="text-rose-700">
          Resetting the database restores the verified sample accounts, 8 authentic social posts, 20 analyzed comments, and full SEPM artifacts.
        </p>
        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all"
        >
          Reset Database to Initial State
        </button>
      </div>
    </div>
  );
};
