import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Brain,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { api } from '../services/api';

export const PredictiveAnalyticsPage = () => {
  const [platform, setPlatform] = useState('instagram');
  const [contentType, setContentType] = useState('carousel');
  const [dayOfWeek, setDayOfWeek] = useState(3); // Wednesday
  const [hour, setHour] = useState(18); // 6 PM
  const [caption, setCaption] = useState('Check out our artisan cold brew notes and weekend roasting schedule! ☕🌿');
  const [hashtags, setHashtags] = useState('#specialtycoffee, #coldbrew, #roastery');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insufficientTest, setInsufficientTest] = useState(false);

  useEffect(() => {
    runPrediction();
  }, [platform, contentType, dayOfWeek, hour]);

  const runPrediction = async (forceInsufficient = false) => {
    setLoading(true);
    try {
      const tagArray = hashtags.split(',').map(t => t.trim()).filter(Boolean);
      // Calculate date matching dayOfWeek and hour
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + ((dayOfWeek + 7 - targetDate.getDay()) % 7));
      targetDate.setHours(hour, 0, 0, 0);

      const res = await api.generatePrediction({
        platform,
        contentType,
        caption,
        hashtags: tagArray,
        scheduledDate: targetDate.toISOString()
      });

      if (forceInsufficient) {
        setPrediction({
          status: 'insufficient_data',
          message: 'Insufficient historical data to generate a reliable prediction. At least 3 historical posts required.',
          confidence: 0.25,
          predictedValue: null
        });
      } else {
        setPrediction(res.prediction);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Module: Predictive Engagement Analytics
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Random Forest Ensemble (RF-v1.4)</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Machine Learning Engagement Forecasting Simulator
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Predicts expected engagement ranges, viral tier categorization, and historical baseline outperformance using chronological train/test split.
          </p>
        </div>

        <button
          onClick={() => {
            setInsufficientTest(!insufficientTest);
            runPrediction(!insufficientTest);
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            insufficientTest
              ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
        >
          {insufficientTest ? 'Reset Normal Data' : 'Test Insufficient Data Guard'}
        </button>
      </div>

      {/* Simulator Workspace (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-royal" />
              Post Feature Attributes
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Interactive ML Inputs</span>
          </div>

          {/* Platform */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Platform</label>
            <div className="grid grid-cols-4 gap-2">
              {['instagram', 'facebook', 'linkedin', 'twitter'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`py-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                    platform === p ? 'bg-brand-royal text-white border-brand-royal shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Content Format */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Content Format</label>
            <div className="grid grid-cols-4 gap-2">
              {['carousel', 'video', 'image', 'text'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setContentType(f)}
                  className={`py-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                    contentType === f ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Day of Week */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Publishing Day of Week</label>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d, idx) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDayOfWeek(idx)}
                  className={`py-2 rounded-lg border text-[11px] font-bold transition-all text-center ${
                    dayOfWeek === idx ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Hour of Day Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Publishing Hour</span>
              <span className="text-brand-royal font-mono">
                {hour % 12 || 12}:00 {hour >= 12 ? 'PM' : 'AM'} ({hour}:00 24h)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>12 AM (Midnight)</span>
              <span>12 PM (Noon)</span>
              <span>11 PM</span>
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Draft Caption (Length Factor)</label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <button
            onClick={() => runPrediction(false)}
            className="w-full py-2.5 rounded-xl bg-brand-royal hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-brand-royal/20 transition-all"
          >
            Re-calculate Forecast
          </button>
        </div>

        {/* Forecast Output Column (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {prediction && prediction.status === 'insufficient_data' ? (
            /* Insufficient Data Guard Display */
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm">Insufficient Historical Data</h3>
              </div>
              <p className="text-xs leading-relaxed">
                {prediction.message}
              </p>
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-slate-800">Why does PostPilot show this?</span>
                <p className="text-slate-600 text-[11px]">
                  Per Part 5.3 of the P59 Academic Charter, PostPilot refuses to invent arbitrary predictive numbers when insufficient post records exist, avoiding false confidence.
                </p>
              </div>
            </div>
          ) : prediction ? (
            /* Active Prediction Card */
            <div className="bg-gradient-to-br from-navy-900 via-indigo-950 to-navy-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900 space-y-5">
              <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-sm tracking-tight">Predicted Post Performance</span>
                </div>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                    prediction.performanceCategory === 'Viral'
                      ? 'bg-purple-500 text-white shadow-lg animate-pulse'
                      : prediction.performanceCategory === 'High'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-indigo-700 text-indigo-100'
                  }`}
                >
                  {prediction.performanceCategory} Tier
                </span>
              </div>

              {/* Main Estimated Value */}
              <div className="space-y-1 text-center py-2">
                <div className="text-5xl font-black text-white tracking-tight">
                  {prediction.predictedValue}
                </div>
                <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                  Estimated Total Interactions (Likes + Comments)
                </p>
              </div>

              {/* Confidence Interval / Bounds */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-indigo-900/50 border border-indigo-800/60">
                  <span className="text-[10px] text-indigo-400 uppercase font-bold block">
                    Expected Lower Bound
                  </span>
                  <span className="text-xl font-extrabold text-slate-200">
                    {prediction.expectedRange?.lowerBound}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-900/50 border border-indigo-800/60">
                  <span className="text-[10px] text-indigo-400 uppercase font-bold block">
                    Expected Upper Bound
                  </span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    {prediction.expectedRange?.upperBound}
                  </span>
                </div>
              </div>

              {/* Outperform Average Metric */}
              <div className="p-4 rounded-xl bg-indigo-900/30 border border-indigo-800/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-200 font-semibold">Likelihood of Outperforming Account Average:</span>
                  <span className="text-emerald-400 font-bold">{prediction.outperformAverageProb}%</span>
                </div>
                <div className="w-full bg-indigo-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${prediction.outperformAverageProb}%` }}
                  ></div>
                </div>
              </div>

              {/* Feature Attribution List */}
              <div className="space-y-1.5 pt-2 border-t border-indigo-800/60 text-xs">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Extracted Features Used by Model:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(prediction.featuresUsed || []).map((f, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 text-[11px] font-mono"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Scientific Disclaimer Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Model Methodology & Transparency
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Predictions are generated using a multi-feature Random Forest regressor with chronological train/test splitting to prevent future data leakage. No guaranteed viral outcomes are promised; estimates reflect probabilistic expected value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
