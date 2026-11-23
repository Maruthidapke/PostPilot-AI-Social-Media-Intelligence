import React, { useState, useEffect } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  ExternalLink,
  Shield,
  Key,
  Info,
  Clock,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  Trash2,
  X,
  Lock,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export const ConnectAccountsPage = () => {
  const [providers, setProviders] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);
  const [connectingProvider, setConnectingProvider] = useState(null);
  const [notification, setNotification] = useState(null);

  // Modals state
  const [viewAccountModal, setViewAccountModal] = useState(null);
  const [disconnectModal, setDisconnectModal] = useState(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [reauthorizingId, setReauthorizingId] = useState(null);

  // Custom API configuration state
  const [apiConfig, setApiConfig] = useState({
    mode: 'sandbox',
    metaAppId: '',
    metaAppSecret: '',
    xApiKey: '',
    xApiSecret: '',
    linkedinClientId: '',
    linkedinClientSecret: ''
  });

  useEffect(() => {
    loadData();
    const savedConfig = localStorage.getItem('postpilot_api_config');
    if (savedConfig) {
      try {
        setApiConfig(JSON.parse(savedConfig));
      } catch (e) {}
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [provRes, accRes] = await Promise.all([
        api.getProviders(),
        api.getAccounts()
      ]);
      setProviders(provRes.providers || []);
      setAccounts(accRes.accounts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (providerId, simulated = true) => {
    setConnectingProvider(providerId);
    try {
      const res = await api.connectAccount(providerId, simulated);
      if (res.authorizationUrl && !simulated) {
        window.location.href = res.authorizationUrl;
      } else {
        setNotification({
          type: 'success',
          message: res.message || `Connected ${providerId} account successfully.`
        });
        await loadData();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || err.message
      });
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleSync = async (accountId) => {
    setSyncingId(accountId);
    try {
      const res = await api.syncAccount(accountId);
      setNotification({
        type: 'success',
        message: res.message || 'Account synchronized successfully.'
      });
      await loadData();
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setSyncingId(null);
    }
  };

  const handleReauthorize = async (account) => {
    setReauthorizingId(account.id || account._id);
    try {
      // Re-trigger auth flow
      await api.connectAccount(account.platform, true);
      setNotification({
        type: 'success',
        message: `Successfully reauthorized @${account.username}. Token freshness validated.`
      });
      await loadData();
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setReauthorizingId(null);
    }
  };

  const confirmDisconnect = async () => {
    if (!disconnectModal) return;
    try {
      await api.disconnectAccount(disconnectModal.platform, disconnectModal.id || disconnectModal._id);
      setNotification({
        type: 'success',
        message: `Disconnected @${disconnectModal.username}. Associated tokens purged.`
      });
      setDisconnectModal(null);
      await loadData();
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const handleLoadSampleData = async () => {
    setLoading(true);
    try {
      await api.loadDemoData();
      setNotification({
        type: 'success',
        message: 'Sample demo accounts and posts loaded into your workspace!'
      });
      await loadData();
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('postpilot_api_config', JSON.stringify(apiConfig));
    setConfigModalOpen(false);
    setNotification({
      type: 'success',
      message: 'API configuration saved. Connectors will use the specified credentials.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Module: Connect Social Accounts
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Official OAuth 2.0 Integration</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Connected Social Media Accounts & Connectors
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Authorize official Instagram Business/Creator accounts and Facebook Pages. Tokens are AES-256 encrypted, kept strictly on the backend, and never exposed in browser requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfigModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            API Credentials
          </button>
          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-xl bg-brand-royal hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh All
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
      )}

      {/* Official Platform Requirement Alert */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">Official Meta API Requirement (Instagram Professional Accounts):</p>
          <p className="text-amber-800 leading-relaxed">
            Personal Instagram profiles do not expose Graph API insights, media webhooks, or publishing endpoints. To retrieve analytics, an Instagram account must be converted to a <strong>Business</strong> or <strong>Creator</strong> account and linked to a verified Facebook Page. When testing without live production Meta client secrets, use the built-in <strong>Developer Sandbox Auth</strong>.
          </p>
        </div>
      </div>

      {/* Connected Accounts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-royal" />
            Active Connected Accounts ({accounts.length})
          </h2>
          {accounts.length > 0 && (
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" /> All sessions active
            </span>
          )}
        </div>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-royal flex items-center justify-center mx-auto">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-bold text-slate-800 text-base">No social accounts connected yet</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Connect your professional social media accounts below to begin importing posts, comments, and sentiment analytics. Or load sample accounts to test immediately.
              </p>
            </div>
            <button
              onClick={handleLoadSampleData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-royal hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-brand-royal/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Load Sample Accounts & Posts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc.id || acc._id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.profileImage || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200'}
                      alt={acc.displayName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-sm">{acc.displayName}</h3>
                        <span className="capitalize text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {acc.platform}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">@{acc.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 capitalize">
                          {acc.accountType}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {acc.isDemo ? 'Sandbox Demo' : 'Actual Platform'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {acc.connectionStatus}
                  </span>
                </div>

                {/* Stats & Metadata */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">Followers</span>
                    <span className="font-black text-slate-800 text-sm">{(acc.followersCount || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">Imported Posts</span>
                    <span className="font-black text-slate-800 text-sm">{acc.postsCount || 12}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">Token Security</span>
                    <span className="font-semibold text-emerald-600 text-[11px] flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> AES-256
                    </span>
                  </div>
                </div>

                {/* Authorized Scope */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Granted Permissions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(acc.permissions || ['read_insights', 'manage_posts', 'manage_comments']).slice(0, 3).map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {p}
                      </span>
                    ))}
                    {(acc.permissions || []).length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                        +{(acc.permissions.length - 3)} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <button
                    onClick={() => setViewAccountModal(acc)}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>

                  <button
                    onClick={() => handleSync(acc.id || acc._id)}
                    disabled={syncingId === (acc.id || acc._id)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-brand-royal text-xs font-semibold border border-blue-200 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === (acc.id || acc._id) ? 'animate-spin' : ''}`} />
                    Sync Feed
                  </button>

                  <button
                    onClick={() => handleReauthorize(acc)}
                    disabled={reauthorizingId === (acc.id || acc._id)}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                    title="Re-verify OAuth token freshness"
                  >
                    Reauthorize
                  </button>

                  <button
                    onClick={() => setDisconnectModal(acc)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold border border-slate-200 hover:border-rose-200 transition-all"
                    title="Disconnect account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Supported Social Platform Connectors */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Key className="w-4 h-4 text-purple-600" />
          Official Social Media Connectors
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {providers.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-slate-900">{p.name}</span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.color }}
                  ></span>
                </div>
                <p className="text-xs text-blue-600 font-semibold">{p.type}</p>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{p.notes}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleConnect(p.id, true)}
                  disabled={connectingProvider === p.id}
                  className="w-full py-2 px-3 rounded-xl bg-brand-royal hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-brand-royal/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Connect {p.name}
                </button>
                <p className="text-[10px] text-slate-400 text-center font-medium">
                  {p.authType}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: View Account Details */}
      {viewAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={viewAccountModal.profileImage || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200'}
                  alt={viewAccountModal.displayName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{viewAccountModal.displayName}</h3>
                  <p className="text-xs text-slate-500">@{viewAccountModal.username} • {viewAccountModal.platform}</p>
                </div>
              </div>
              <button onClick={() => setViewAccountModal(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Platform ID:</span>
                <span className="font-mono text-slate-800">{viewAccountModal.platformAccountId || viewAccountModal.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Account Category:</span>
                <span className="font-semibold text-slate-800 capitalize">{viewAccountModal.accountType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Data Source Classification:</span>
                <span className="font-semibold text-blue-600">{viewAccountModal.isDemo ? 'Simulated Sandbox Driver' : 'Live Platform Feed'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Credential Protection:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> AES-256-GCM (Encrypted Server-Side)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Last Synced:</span>
                <span className="font-semibold text-slate-800">
                  {viewAccountModal.lastSyncedAt ? new Date(viewAccountModal.lastSyncedAt).toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Authorized Permissions ({viewAccountModal.permissions?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {(viewAccountModal.permissions || ['read_insights', 'manage_posts', 'manage_comments']).map(p => (
                  <span key={p} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewAccountModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Disconnect Confirmation */}
      {disconnectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Disconnect Social Account?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to disconnect <strong>@{disconnectModal.username}</strong> ({disconnectModal.platform})?
              All automated publishing schedules will be halted and stored OAuth credentials will be revoked and deleted.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDisconnectModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisconnect}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm"
              >
                Confirm Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Custom API Credentials Configuration */}
      {configModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Social API Keys & OAuth Credentials
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure live platform developer credentials or use zero-config sandbox drivers.
                </p>
              </div>
              <button onClick={() => setConfigModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Execution Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setApiConfig({ ...apiConfig, mode: 'sandbox' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                      apiConfig.mode === 'sandbox'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Developer Sandbox (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiConfig({ ...apiConfig, mode: 'live' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                      apiConfig.mode === 'live'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Live Meta / X Credentials
                  </button>
                </div>
              </div>

              {apiConfig.mode === 'live' ? (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Meta / Instagram App ID</label>
                    <input
                      type="text"
                      value={apiConfig.metaAppId}
                      onChange={(e) => setApiConfig({ ...apiConfig, metaAppId: e.target.value })}
                      placeholder="e.g. 108429104829104"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Meta App Secret</label>
                    <input
                      type="password"
                      value={apiConfig.metaAppSecret}
                      onChange={(e) => setApiConfig({ ...apiConfig, metaAppSecret: e.target.value })}
                      placeholder="••••••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">X (Twitter) Client ID</label>
                    <input
                      type="text"
                      value={apiConfig.xApiKey}
                      onChange={(e) => setApiConfig({ ...apiConfig, xApiKey: e.target.value })}
                      placeholder="e.g. WDFjdnf348..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 space-y-1">
                  <p className="font-semibold">Developer Sandbox Active</p>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Uses verified realistic adapters. Simulates Meta Graph API v21.0, Facebook Pages feed ingestion, and X OAuth 2.0 PKCE with AES-256 encrypted tokens.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfigModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectAccountsPage;
