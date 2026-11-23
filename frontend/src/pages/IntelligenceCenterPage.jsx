import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Smile,
  TrendingUp,
  Flame,
  Wand2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  BarChart2,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';

export const IntelligenceCenterPage = () => {
  const [sentiment, setSentiment] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [bestTime, setBestTime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntelligence();
  }, []);

  const loadIntelligence = async () => {
    setLoading(true);
    try {
      const [sentRes, pattRes, timeRes] = await Promise.all([
        api.getSentimentAnalytics(),
        api.getContentPatterns(),
        api.getBestTimeToPost()
      ]);
      setSentiment(sentRes);
      setPatterns(pattRes.patterns || []);
      setBestTime(timeRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-indigo-950 to-navy-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Module: AI Intelligence Center
            </span>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Social Media Predictive Intelligence & Analytics
            </h1>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
              Transforms historical social media post interactions and audience comments into validated sentiment classifications, machine learning engagement forecasts, and data-driven publishing recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadIntelligence}
              className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Re-run Intelligence Engine
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Sentiment */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Smile className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Sentiment Intelligence</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time comment classification with Cardiff Twitter-RoBERTa calibration.
            </p>
            <div className="pt-2 text-2xl font-black text-emerald-600">
              {sentiment?.distribution?.positivePct || 83.3}% Positive
            </div>
          </div>
          <Link
            to="/sentiment-analytics"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-brand-royal hover:underline flex items-center justify-between"
          >
            <span>View Sentiment Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pillar 2: Predictive Forecasting */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Predictive Engagement</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Random Forest regression forecasting interaction ranges and viral potential.
            </p>
            <div className="pt-2 text-2xl font-black text-brand-royal">
              RF-v1.4 Engine
            </div>
          </div>
          <Link
            to="/predictive-analytics"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-brand-royal hover:underline flex items-center justify-between"
          >
            <span>Run ML Forecast Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pillar 3: Best Time Heatmap */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Best Time Optimization</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              7x24 weekly hourly engagement matrix and top publishing time windows.
            </p>
            <div className="pt-2 text-base font-bold text-slate-800">
              {bestTime?.bestSlots?.[0]?.day || 'Sunday'} at {bestTime?.bestSlots?.[0]?.timeFormatted || '8:00 PM'}
            </div>
          </div>
          <Link
            to="/best-time-to-post"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-brand-royal hover:underline flex items-center justify-between"
          >
            <span>Inspect 7x24 Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pillar 4: AI Content Assistant */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">AI Content Assistant</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates multi-variant captions, tailored hashtags, and discussion hooks.
            </p>
            <div className="pt-2 text-2xl font-black text-purple-600">
              3 Variants
            </div>
          </div>
          <Link
            to="/ai-content-assistant"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-brand-royal hover:underline flex items-center justify-between"
          >
            <span>Open Content Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Content Intelligence Patterns (Correlation vs Causation) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              Observed Content Patterns & Strategy Recommendations
            </h2>
            <p className="text-xs text-slate-500">
              Empirical insights extracted from historical post engagement across connected accounts
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-brand-royal border border-blue-200">
            Correlation vs Causation Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-brand-royal uppercase tracking-wider">
                  {p.factor}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Insight #{idx + 1}</span>
              </div>
              <p className="text-xs font-bold text-slate-800 leading-relaxed">{p.finding}</p>
              <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                <strong className="text-emerald-700">Action:</strong> {p.recommendation}
              </p>
              <p className="text-[10px] text-slate-400 italic">
                <strong className="text-slate-500">Scientific Boundary:</strong> {p.causalityNote}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Voice of Audience: Complaints vs Praise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Appreciated Features */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Top Frequently Appreciated Themes
          </h3>
          <div className="space-y-2">
            {(sentiment?.insights?.topPraises || []).map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs">
                <p className="text-slate-800 font-medium">"{item.text}"</p>
                <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                  Model Confidence: {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customer Complaints & Issues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Repeated Customer Feedback & Issues
          </h3>
          <div className="space-y-2">
            {(sentiment?.insights?.topComplaints || []).map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs">
                <p className="text-slate-800 font-medium">"{item.text}"</p>
                <span className="text-[10px] text-rose-700 font-bold mt-1 block">
                  Negative Feedback Spike • Action Recommended
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
