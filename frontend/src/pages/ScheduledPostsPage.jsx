import React, { useState, useEffect } from 'react';
import {
  Clock,
  Send,
  Calendar,
  Trash2,
  Edit3,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export const ScheduledPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    loadPosts();
  }, [statusFilter, platformFilter]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getPosts({
        status: statusFilter,
        platform: platformFilter
      });
      setPosts(res.posts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleModal || !newDate) return;
    try {
      await api.reschedulePost(rescheduleModal.id || rescheduleModal._id, newDate);
      setRescheduleModal(null);
      await loadPosts();
    } catch (e) {
      alert('Failed to reschedule: ' + e.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.cancelSchedule(id);
      await loadPosts();
    } catch (e) {
      alert('Failed to cancel: ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await api.deletePost(id);
      await loadPosts();
    } catch (e) {
      alert('Failed to delete: ' + e.message);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (search && !((p.title || '') + (p.content || '')).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Module: Scheduled Posts
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Autonomous Execution Queue</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Publishing Queue & Post Management
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Monitor and manage posts across drafts, scheduled queues, and published feeds. Background scheduler processes due posts automatically.
          </p>
        </div>

        <button
          onClick={loadPosts}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
          {['all', 'scheduled', 'published', 'draft', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                statusFilter === st
                  ? 'bg-brand-royal text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Posts List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id || post._id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="capitalize font-bold text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {post.platform}
                </span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                    post.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : post.status === 'scheduled'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {post.status}
                </span>
              </div>

              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                {post.isSimulated ? 'Demo Simulation' : 'Actual Live API'}
              </span>
            </div>

            <div className="flex gap-4">
              {post.media?.[0]?.url && (
                <img
                  src={post.media[0].url}
                  alt="Post preview"
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
              )}
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">{post.title || 'Untitled Post'}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{post.content}</p>
                {post.hashtags?.length > 0 && (
                  <p className="text-[11px] text-blue-600 font-medium truncate">
                    {post.hashtags.join(' ')}
                  </p>
                )}
              </div>
            </div>

            {/* Performance metrics or schedule date */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              {post.status === 'published' ? (
                <div className="flex items-center gap-4 text-slate-600 font-semibold">
                  <span>❤️ {post.metricsSnapshot?.likes || 0} Likes</span>
                  <span>💬 {post.metricsSnapshot?.comments || 0} Comments</span>
                  <span>🚀 {post.metricsSnapshot?.reach || 0} Reach</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Scheduled: {new Date(post.scheduledAt || post.createdAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              {post.status === 'scheduled' && (
                <>
                  <button
                    onClick={() => {
                      setRescheduleModal(post);
                      setNewDate(new Date(post.scheduledAt).toISOString().slice(0, 16));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-brand-royal font-semibold hover:bg-blue-100 transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(post.id || post._id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(post.id || post._id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Delete Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Reschedule Post</h3>
            <p className="text-xs text-slate-500">Pick a new date and time for automatic dispatch:</p>
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleModal(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-1.5 rounded-xl bg-brand-royal text-white text-xs font-semibold hover:bg-blue-700 shadow-md shadow-brand-royal/20"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
