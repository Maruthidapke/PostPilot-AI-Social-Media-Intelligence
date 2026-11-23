import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Send,
  Calendar,
  Sparkles,
  Image as ImageIcon,
  Hash,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Flame,
  Layers,
  Heart,
  MessageCircle,
  Bookmark,
  Share2
} from 'lucide-react';
import { api } from '../services/api';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
  'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=800',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'
];

export const CreatePostPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [contentType, setContentType] = useState('image');
  const [mediaUrl, setMediaUrl] = useState(SAMPLE_IMAGES[0]);
  const [hashtags, setHashtags] = useState('#specialtycoffee, #coldbrew, #roastery');
  const [scheduledAt, setScheduledAt] = useState(
    searchParams.get('date') || new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );

  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load connected accounts and prefilled content
  useEffect(() => {
    const prefill = sessionStorage.getItem('postpilot_prefill_caption');
    if (prefill) {
      setContent(prefill);
      sessionStorage.removeItem('postpilot_prefill_caption');
    }

    api.getAccounts().then(res => {
      if (res.success && res.accounts?.length > 0) {
        setAccounts(res.accounts);
        const match = res.accounts.find(a => a.platform === platform);
        if (match) setSelectedAccountId(match.id || match._id);
        else setSelectedAccountId(res.accounts[0].id || res.accounts[0]._id);
      }
    }).catch(console.error);
  }, []);

  // Auto-run ML prediction whenever content, platform, or time changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrediction();
    }, 400);
    return () => clearTimeout(timer);
  }, [platform, contentType, content, scheduledAt, hashtags]);

  const fetchPrediction = async () => {
    try {
      const tagArray = hashtags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await api.generatePrediction({
        platform,
        contentType,
        caption: content,
        hashtags: tagArray,
        scheduledDate: scheduledAt
      });
      if (res.success) {
        setPrediction(res.prediction);
      }
    } catch (e) {
      // Quiet fail on prediction
    }
  };

  const handleAiGenerate = async () => {
    setAiGenerating(true);
    try {
      const res = await api.generateCaptions({
        platform,
        topic: title || 'Artisan Specialty Coffee & Roasting',
        tone: 'conversational'
      });
      if (res.success && res.captions?.length > 0) {
        setContent(res.captions[0].text);
        if (res.hashtags?.length > 0) {
          setHashtags(res.hashtags.join(', '));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (status = 'scheduled') => {
    if (!content.trim()) {
      setNotification({ type: 'error', message: 'Please write a caption or content for the post.' });
      return;
    }

    setSubmitting(true);
    try {
      const tagArray = hashtags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = {
        title: title || 'Social Post',
        content,
        platform,
        socialAccountId: selectedAccountId || (accounts.length > 0 ? (accounts[0].id || accounts[0]._id) : 'acc_ig_001'),
        contentType,
        media: [{ url: mediaUrl, type: contentType }],
        hashtags: tagArray,
        scheduledAt: status === 'scheduled' ? new Date(scheduledAt).toISOString() : undefined,
        status: status === 'publish_now' ? 'published' : status
      };

      await api.createPost(payload);
      setNotification({
        type: 'success',
        message: status === 'publish_now'
          ? 'Post published successfully!'
          : status === 'scheduled'
          ? 'Post scheduled successfully in publishing calendar.'
          : 'Post saved as draft.'
      });

      setTimeout(() => {
        navigate('/scheduled-posts');
      }, 1200);
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Module: Create Post & Scheduler
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Live Multi-Platform Mockup</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Compose & Schedule Social Media Content
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Compose with real-time AI engagement forecasting. Posts are validated and scheduled into the autonomous execution queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={submitting}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('scheduled')}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-brand-royal hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-brand-royal/20 transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            Schedule Post
          </button>
          <button
            onClick={() => handleSubmit('publish_now')}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Publish Now
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Composition Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-royal" />
              Content Composition Details
            </h2>

            <button
              onClick={handleAiGenerate}
              disabled={aiGenerating}
              className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Sparkles className={`w-3.5 h-3.5 ${aiGenerating ? 'animate-spin' : ''}`} />
              {aiGenerating ? 'Generating...' : 'Auto-Generate with AI'}
            </button>
          </div>

          {/* Platform Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Target Social Platform</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'instagram', name: 'Instagram', color: 'border-pink-500 bg-pink-50 text-pink-700' },
                { id: 'facebook', name: 'Facebook', color: 'border-blue-500 bg-blue-50 text-blue-700' },
                { id: 'linkedin', name: 'LinkedIn', color: 'border-sky-500 bg-sky-50 text-sky-700' },
                { id: 'twitter', name: 'X / Twitter', color: 'border-slate-800 bg-slate-100 text-slate-900' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all text-center ${
                    platform === p.id ? `${p.color} ring-2 ring-blue-400 shadow-xs` : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Connected Account Selector */}
          {accounts.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Publishing Profile</label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {accounts.map(acc => (
                  <option key={acc.id || acc._id} value={acc.id || acc._id}>
                    @{acc.username} ({acc.displayName}) • {acc.platform} ({acc.accountType})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Internal Campaign Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Single Origin Ethiopian Release"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Caption / Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">Post Caption & Body Text</label>
              <span className={`text-[11px] font-mono ${content.length > (platform === 'twitter' ? 280 : 2200) ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {content.length} / {platform === 'twitter' ? 280 : 2200} characters
              </span>
            </div>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your engaging caption here, or click 'Auto-Generate with AI' above..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              Hashtags (Comma-separated)
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#coffee, #specialty, #roastery"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Media URL Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              Image URL / Media Asset
            </label>
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
              {SAMPLE_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMediaUrl(img)}
                  className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                    mediaUrl === img ? 'border-brand-royal scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Publishing Datetime & Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Scheduled Publishing Time
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Timezone</label>
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold flex items-center justify-between">
                <span>Asia/Kolkata (IST • UTC+05:30)</span>
                <span className="text-[10px] text-emerald-600 font-bold">Standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview & ML Predictor (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real-time ML Prediction Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-navy-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                ML Engagement Forecast
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-200 border border-indigo-700">
                RF-v1.4 Ensemble
              </span>
            </div>

            {prediction && prediction.status === 'success' ? (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black text-white">{prediction.predictedValue}</span>
                    <span className="text-xs text-indigo-200 ml-1.5">interactions</span>
                  </div>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      prediction.performanceCategory === 'Viral'
                        ? 'bg-purple-500 text-white animate-pulse'
                        : prediction.performanceCategory === 'High'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-indigo-700 text-indigo-100'
                    }`}
                  >
                    {prediction.performanceCategory} Tier
                  </span>
                </div>

                <div className="text-xs text-indigo-200 grid grid-cols-2 gap-2 pt-2 border-t border-indigo-800/80">
                  <div>
                    <span className="text-[10px] text-indigo-400 block">Expected Range</span>
                    <span className="font-bold text-white">
                      {prediction.expectedRange?.lowerBound} - {prediction.expectedRange?.upperBound}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-400 block">Beats Average</span>
                    <span className="font-bold text-emerald-400">
                      {prediction.outperformAverageProb}% Probability
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-indigo-300 italic">
                Calculating expected audience interaction range...
              </div>
            )}
          </div>

          {/* Platform Live Mockup */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Live {platform} Mockup
              </span>
              <span className="text-[10px] text-slate-400">WYSIWYG Preview</span>
            </div>

            {/* Mockup Frame */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white text-slate-800">
              {/* Mockup Header */}
              <div className="p-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100" alt="avatar" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">urbanblend_coffee</p>
                    <p className="text-[10px] text-slate-400">Sponsored • Flagship Roastery</p>
                  </div>
                </div>
                <span className="text-slate-400 text-sm">•••</span>
              </div>

              {/* Mockup Image */}
              {mediaUrl && (
                <div className="w-full h-56 bg-slate-100 overflow-hidden">
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Mockup Action Icons */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-slate-700 hover:text-red-500 cursor-pointer" />
                    <MessageCircle className="w-4 h-4 text-slate-700" />
                    <Share2 className="w-4 h-4 text-slate-700" />
                  </div>
                  <Bookmark className="w-4 h-4 text-slate-700" />
                </div>

                {/* Mockup Caption */}
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-slate-900">
                    <span className="font-bold mr-1.5">urbanblend_coffee</span>
                    <span className="font-normal text-slate-700 whitespace-pre-line leading-relaxed">
                      {content || 'Your engaging post caption will appear here in real-time...'}
                    </span>
                  </p>
                  {hashtags && (
                    <p className="text-blue-600 font-medium text-[11px]">{hashtags}</p>
                  )}
                  <p className="text-[10px] text-slate-400 uppercase pt-1">
                    Scheduled for {new Date(scheduledAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
