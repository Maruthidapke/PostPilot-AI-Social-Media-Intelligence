import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  Filter,
  Layers,
  X
} from 'lucide-react';
import { api } from '../services/api';

const PLATFORM_BADGES = {
  instagram: { bg: 'bg-pink-100 text-pink-800 border-pink-200', dot: 'bg-pink-500' },
  facebook: { bg: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-600' },
  linkedin: { bg: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-600' },
  twitter: { bg: 'bg-slate-100 text-slate-800 border-slate-300', dot: 'bg-slate-800' }
};

export const ContentPlannerPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026
  const [events, setEvents] = useState([]);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getScheduleEvents();
      setEvents(res.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const filteredEvents = events.filter(e => {
    if (platformFilter !== 'all' && e.platform !== platformFilter) return false;
    return true;
  });

  const getEventsForDay = (day) => {
    if (!day) return [];
    return filteredEvents.filter(e => {
      const d = new Date(e.start);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Module: Content Planner
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Autonomous Multi-Platform Queue</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Publishing Calendar & Content Schedule
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Visual month-by-month publishing queue. Click on any date to schedule a post, or click an existing event to review metrics and reschedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Platform Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['all', 'instagram', 'facebook', 'linkedin', 'twitter'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  platformFilter === p
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/create-post')}
            className="px-3.5 py-2 rounded-xl bg-brand-royal hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-brand-royal/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Schedule Post
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Month Navigator Bar */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-slate-800">
              {monthNames[month]} {year}
            </h2>
            <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
              {filteredEvents.length} Scheduled & Published Events
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl hover:bg-slate-200/80 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl hover:bg-slate-200/80 text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 text-center bg-slate-100/60 text-xs font-bold text-slate-500 py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* 7x5 or 7x6 Date cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[500px]">
          {calendarDays.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isToday =
              day &&
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={idx}
                onClick={() => {
                  if (day) {
                    navigate(`/create-post?date=${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T18:00`);
                  }
                }}
                className={`min-h-[110px] p-2 transition-colors relative flex flex-col justify-between cursor-pointer ${
                  day ? 'hover:bg-blue-50/40 bg-white' : 'bg-slate-50/50'
                }`}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isToday ? 'bg-brand-royal text-white shadow-sm' : 'text-slate-700'
                        }`}
                      >
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-24">
                      {dayEvents.map((evt) => {
                        const badge = PLATFORM_BADGES[evt.platform] || PLATFORM_BADGES.instagram;
                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(evt);
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-medium border truncate flex items-center gap-1 shadow-xs transition-transform hover:scale-[1.02] ${badge.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${badge.dot}`}></span>
                            <span className="truncate flex-1">{evt.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="capitalize font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedEvent.platform}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    selectedEvent.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedEvent.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedEvent.media?.[0]?.url && (
              <img
                src={selectedEvent.media[0].url}
                alt="Post Media"
                className="w-full h-44 object-cover rounded-xl border border-slate-200"
              />
            )}

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{selectedEvent.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedEvent.content}
              </p>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>
                <strong>Datetime:</strong> {new Date(selectedEvent.start).toLocaleString()}
              </p>
              <p>
                <strong>Attribution:</strong> {selectedEvent.isSimulated ? 'Simulated Demo' : 'Live Platform Dispatched'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = selectedEvent.id;
                  setSelectedEvent(null);
                  navigate(`/create-post?reschedule=${id}`);
                }}
                className="px-4 py-2 rounded-xl bg-brand-royal text-white text-xs font-semibold hover:bg-blue-700 shadow-md shadow-brand-royal/20"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
