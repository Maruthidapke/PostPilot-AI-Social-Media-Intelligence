import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  ShieldCheck,
  RefreshCw,
  Download
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../services/api';

export const EngagementAnalyticsPage = () => {
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getEngagementTrends({ period });
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Module: Engagement Analytics
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Cross-Network Comparative Performance</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Account Performance & Reach Telemetry
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Granular analysis of audience reach, impressions, interactions, and cross-platform growth curves across Instagram, Facebook, LinkedIn, and X.
          </p>
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                period === p
                  ? 'bg-brand-royal text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Reach</span>
          <div className="text-2xl font-black text-slate-900 mt-1">58,610</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+12.4% vs last period</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Impressions</span>
          <div className="text-2xl font-black text-slate-900 mt-1">84,200</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">1.44 views/user</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Engagement Rate</span>
          <div className="text-2xl font-black text-brand-royal mt-1">4.8%</div>
          <p className="text-[11px] text-slate-500 mt-1">Industry benchmark: 3.6%</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Follower Growth</span>
          <div className="text-2xl font-black text-purple-600 mt-1">+2,410</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+8.4% monthly gain</p>
        </div>
      </div>

      {/* Main Interaction Area Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Reach & Interaction Volume Timeline</h3>
            <p className="text-xs text-slate-500">Likes, comments, shares, and reach tracked across time</p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Continuous Telemetry</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.timeline || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B132B', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="likes" stroke="#2563EB" fill="#DBEAFE" name="Likes" />
              <Area type="monotone" dataKey="comments" stroke="#7C3AED" fill="#EDE9FE" name="Comments" />
              <Area type="monotone" dataKey="shares" stroke="#0EA5E9" fill="#E0F2FE" name="Shares" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Network Breakdown</h3>
            <p className="text-xs text-slate-500">Performance and conversion metrics by connected platform</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">4 Supported Platforms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Followers</th>
                <th className="py-3 px-4">Total Likes</th>
                <th className="py-3 px-4">Comments</th>
                <th className="py-3 px-4">Shares / Reposts</th>
                <th className="py-3 px-4">Engagement Rate</th>
                <th className="py-3 px-4">Permission Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(data?.platformComparison || []).map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-royal"></span>
                    {p.platform}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{p.reach?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-700">{p.likes?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-700">{p.comments}</td>
                  <td className="py-3 px-4 text-slate-700">{p.shares}</td>
                  <td className="py-3 px-4 font-bold text-brand-royal">{p.engagementRate}%</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Authorized & Synced
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
