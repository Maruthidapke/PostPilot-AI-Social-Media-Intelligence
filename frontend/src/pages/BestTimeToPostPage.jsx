import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Info,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export const BestTimeToPostPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBestTimes();
  }, []);

  const loadBestTimes = async () => {
    setLoading(true);
    try {
      const res = await api.getBestTimeToPost();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getHeatmapColor = (score) => {
    if (score >= 320) return 'bg-indigo-700 text-white';
    if (score >= 260) return 'bg-blue-600 text-white';
    if (score >= 200) return 'bg-blue-500 text-white';
    if (score >= 150) return 'bg-blue-300 text-slate-900';
    if (score >= 100) return 'bg-blue-100 text-slate-800';
    return 'bg-slate-50 text-slate-400';
  };

  const handleApplyToScheduler = (slot) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + ((slot.dayIndex + 7 - targetDate.getDay()) % 7));
    targetDate.setHours(slot.hour, 0, 0, 0);
    const dateStr = targetDate.toISOString().slice(0, 16);
    navigate(`/create-post?date=${dateStr}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
              Module: Best Time to Post
            </span>
            <span className="text-xs text-slate-400 font-semibold">• 7x24 Empirical Heatmap Matrix</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Optimal Publishing Times & Audience Activity
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Calculated from stored account historical interactions across 168 weekly hour slots. Click any slot to dispatch directly to the Post Scheduler.
          </p>
        </div>

        <button
          onClick={loadBestTimes}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Recalculate Heatmap
        </button>
      </div>

      {/* Top 3 Recommended Slots Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(data?.bestSlots || []).map((slot) => (
          <div
            key={slot.rank}
            className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
              slot.rank === 1
                ? 'bg-gradient-to-br from-indigo-900 to-navy-900 text-white border-indigo-800'
                : 'bg-white text-slate-900 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  slot.rank === 1
                    ? 'bg-amber-400 text-navy-900'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Rank #{slot.rank} Recommended
              </span>
              <span className={`text-xs font-semibold ${slot.rank === 1 ? 'text-indigo-200' : 'text-emerald-600'}`}>
                Confidence: {slot.confidence}
              </span>
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight">
                {slot.day}, {slot.timeFormatted}
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${slot.rank === 1 ? 'text-indigo-200' : 'text-slate-500'}`}>
                {slot.recommendationText}
              </p>
            </div>

            <button
              onClick={() => handleApplyToScheduler(slot)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                slot.rank === 1
                  ? 'bg-brand-royal hover:bg-blue-600 text-white shadow-brand-royal/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>Schedule at this Time</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* 7x24 Weekly Interactive Heatmap Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              168-Hour Audience Engagement Heatmap (7 Days × 24 Hours)
            </h2>
            <p className="text-xs text-slate-500">
              Darker cells represent historically stronger audience engagement windows
            </p>
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <span>Low</span>
            <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200"></div>
            <div className="w-3.5 h-3.5 rounded bg-blue-100"></div>
            <div className="w-3.5 h-3.5 rounded bg-blue-300"></div>
            <div className="w-3.5 h-3.5 rounded bg-blue-500"></div>
            <div className="w-3.5 h-3.5 rounded bg-indigo-700"></div>
            <span>High</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[760px] space-y-1.5">
            {/* Hour Header labels */}
            <div className="grid grid-cols-25 text-center text-[10px] font-bold text-slate-400">
              <div></div>
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="truncate">
                  {h % 4 === 0 ? `${h}h` : ''}
                </div>
              ))}
            </div>

            {/* 7 Day Rows */}
            {(data?.heatmapGrid || []).map((dayRow, dayIdx) => (
              <div key={dayIdx} className="grid grid-cols-25 items-center gap-1">
                <div className="text-xs font-bold text-slate-600 text-right pr-2">
                  {days[dayIdx]}
                </div>
                {dayRow.map((slot, hourIdx) => (
                  <div
                    key={hourIdx}
                    onMouseEnter={() => setHoveredCell(slot)}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => handleApplyToScheduler(slot)}
                    className={`h-7 rounded-md cursor-pointer transition-transform hover:scale-110 flex items-center justify-center text-[10px] font-mono font-bold ${getHeatmapColor(
                      slot.score
                    )}`}
                    title={`${slot.day} ${slot.hour}:00 - Score: ${slot.score}`}
                  >
                    {slot.score >= 320 ? '★' : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hovered Cell Tooltip Banner */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
          {hoveredCell ? (
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-900">
                {hoveredCell.day} at {hoveredCell.hour % 12 || 12}:00 {hoveredCell.hour >= 12 ? 'PM' : 'AM'}:
              </span>
              <span className="text-brand-royal font-black">
                {hoveredCell.score} Estimated Interactions
              </span>
              <span className="text-slate-500">
                ({hoveredCell.postCount} historical posts in sample)
              </span>
            </div>
          ) : (
            <span className="text-slate-400 italic">
              Hover over any square on the matrix to view specific hourly performance. Click to schedule.
            </span>
          )}

          {hoveredCell && (
            <button
              onClick={() => handleApplyToScheduler(hoveredCell)}
              className="text-xs font-bold text-brand-royal hover:underline"
            >
              Use this Slot &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
