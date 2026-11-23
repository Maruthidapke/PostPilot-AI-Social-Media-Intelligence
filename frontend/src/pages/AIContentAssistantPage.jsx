import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Send,
  HelpCircle,
  Lightbulb,
  Hash,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export const AIContentAssistantPage = () => {
  const [businessType, setBusinessType] = useState('Specialty Cafe & Artisan Roastery');
  const [productOrService, setProductOrService] = useState('Artisan Cold Brew & Single-Origin Beans');
  const [targetAudience, setTargetAudience] = useState('Coffee Enthusiasts, Digital Nomads & Professionals');
  const [topic, setTopic] = useState('Weekend Slow-Brew Tasting & New Ethiopian Roast Reveal');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('conversational');
  const [includeHashtags, setIncludeHashtags] = useState(true);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.generateCaptions({
        businessType,
        productOrService,
        targetAudience,
        topic,
        platform,
        tone,
        includeHashtags
      });
      if (res.success) {
        setResults(res);
      }
    } catch (err) {
      alert('Failed to generate content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleUseInScheduler = (captionText) => {
    sessionStorage.setItem('postpilot_prefill_caption', captionText);
    navigate('/create-post');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
              Module: AI Content Assistant
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Multi-Variant Copy Studio</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            AI Content Assistant & Creative Copilot
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Generate high-performing, tone-calibrated social media copy, curated hashtags, and discussion-starting questions.
          </p>
        </div>
      </div>

      {/* Workspace (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 Cols) */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-brand-purple" />
            Prompt & Brand Identity Parameters
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Business / Organization Type</label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Product / Feature / Service</label>
            <input
              type="text"
              value={productOrService}
              onChange={(e) => setProductOrService(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Post Topic / Core Message</label>
            <textarea
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          {/* Platform & Tone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs capitalize focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">X (Twitter)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Desired Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs capitalize focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              >
                <option value="conversational">Conversational</option>
                <option value="professional">Professional</option>
                <option value="witty">Witty & Humorous</option>
                <option value="inspirational">Inspirational</option>
                <option value="urgent">Urgent & Promotional</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Synthesizing Content...' : 'Generate 3 Caption Variants'}
          </button>
        </form>

        {/* Results Output Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* AI Disclosure Banner */}
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700 flex-shrink-0" />
              <span>AI-Assisted Generation • Human Supervision Recommended before Scheduling</span>
            </div>
          </div>

          {/* 3 Caption Variants */}
          {results ? (
            <div className="space-y-4">
              {results.captions.map((cap, idx) => (
                <div
                  key={cap.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-xs text-purple-700">{cap.variantName}</span>
                    <span className="text-[11px] font-mono text-slate-400">{cap.wordCount} words</span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 font-medium">
                    {cap.text}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleCopy(cap.text, idx)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedIndex === idx ? 'Copied!' : 'Copy Caption'}
                    </button>

                    <button
                      onClick={() => handleUseInScheduler(cap.text)}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-royal hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>Use in Post Scheduler</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Hashtags & Ideas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-blue-600" />
                    Recommended Hashtags
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(results.hashtags || []).map((h, i) => (
                      <span key={i} className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    Engagement Questions
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {(results.engagementQuestions || []).map((q, i) => (
                      <p key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        • {q}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-sm text-center space-y-3">
              <Wand2 className="w-10 h-10 text-purple-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">Configure Parameters & Click Generate</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                The content assistant will craft 3 distinctive captions adapted for your platform, audience demographics, and chosen brand voice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
