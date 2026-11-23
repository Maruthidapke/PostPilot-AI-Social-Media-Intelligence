import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('postpilot_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = window.location.pathname.includes('/login') ||
                        window.location.pathname.includes('/register') ||
                        window.location.pathname.includes('/forgot-password') ||
                        window.location.pathname.includes('/reset-password');
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('postpilot_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  register: (data) => client.post('/auth/register', data).then(r => r.data),
  login: (data) => client.post('/auth/login', data).then(r => r.data),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (data) => client.post('/auth/reset-password', data).then(r => r.data),
  getMe: () => client.get('/auth/me').then(r => r.data),
  updateProfile: (data) => client.put('/auth/profile', data).then(r => r.data),

  // Social Connections
  getProviders: () => client.get('/social/providers').then(r => r.data),
  getAccounts: () => client.get('/social/accounts').then(r => r.data),
  connectAccount: (provider, simulated = true) => client.post(`/social/${provider}/connect`, { simulated }).then(r => r.data),
  disconnectAccount: (provider, id) => client.post(`/social/${provider}/disconnect/${id}`).then(r => r.data),
  syncAccount: (id) => client.post(`/social/accounts/${id}/sync`).then(r => r.data),
  loadDemoData: () => client.post('/social/demo/load').then(r => r.data),
  resetDemoData: () => client.post('/social/demo/reset').then(r => r.data),

  // Posts & Scheduling
  getPosts: (params) => client.get('/posts', { params }).then(r => r.data),
  getPostById: (id) => client.get(`/posts/${id}`).then(r => r.data),
  createPost: (data) => client.post('/posts', data).then(r => r.data),
  updatePost: (id, data) => client.put(`/posts/${id}`, data).then(r => r.data),
  deletePost: (id) => client.delete(`/posts/${id}`).then(r => r.data),
  getScheduleEvents: () => client.get('/schedule').then(r => r.data),
  schedulePost: (data) => client.post('/schedule', data).then(r => r.data),
  reschedulePost: (id, scheduledAt) => client.put(`/schedule/${id}`, { scheduledAt }).then(r => r.data),
  cancelSchedule: (id) => client.delete(`/schedule/${id}`).then(r => r.data),

  // Sentiment Analytics
  analyzeText: (text) => client.post('/sentiment/analyze', { text }).then(r => r.data),
  getSentimentHistory: (params) => client.get('/sentiment/history', { params }).then(r => r.data),
  getSentimentAnalytics: () => client.get('/sentiment/analytics').then(r => r.data),
  runSentimentBenchmark: () => client.get('/sentiment/benchmark').then(r => r.data),

  // Predictive Analytics
  generatePrediction: (data) => client.post('/predictions/generate', data).then(r => r.data),
  getBestTimeToPost: () => client.get('/predictions/best-time').then(r => r.data),
  getContentPatterns: () => client.get('/predictions/patterns').then(r => r.data),

  // AI Assistant
  generateCaptions: (data) => client.post('/ai-assistant/generate-captions', data).then(r => r.data),

  // Analytics
  getOverview: () => client.get('/analytics/overview').then(r => r.data),
  getEngagementTrends: (params) => client.get('/analytics/engagement', { params }).then(r => r.data),

  // SEPM Workspace
  getSDLC: () => client.get('/sepm/sdlc').then(r => r.data),
  getRequirements: () => client.get('/sepm/requirements').then(r => r.data),
  getAITools: () => client.get('/sepm/tools').then(r => r.data),
  getSprints: () => client.get('/sepm/sprints').then(r => r.data),
  getKanbanTasks: () => client.get('/sepm/kanban').then(r => r.data),
  createKanbanTask: (data) => client.post('/sepm/kanban', data).then(r => r.data),
  updateKanbanTask: (id, status) => client.put(`/sepm/kanban/${id}`, { status }).then(r => r.data),
  getPlanningPoker: () => client.get('/sepm/planning-poker').then(r => r.data),
  getLeanWaste: () => client.get('/sepm/lean-waste').then(r => r.data),
  getSyllabus: () => client.get('/sepm/syllabus').then(r => r.data),
  updateSyllabusItem: (id, data) => client.put(`/sepm/syllabus/${id}`, data).then(r => r.data),

  // System & Audit
  getHealth: () => client.get('/health').then(r => r.data),
  getMetrics: () => client.get('/metrics').then(r => r.data),
  getAuditLogs: () => client.get('/system/audit-logs').then(r => r.data)
};
