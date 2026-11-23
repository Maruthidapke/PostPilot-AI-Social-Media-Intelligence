import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

import { DashboardPage } from './pages/DashboardPage';
import { ConnectAccountsPage } from './pages/ConnectAccountsPage';
import { IntelligenceCenterPage } from './pages/IntelligenceCenterPage';
import { ContentPlannerPage } from './pages/ContentPlannerPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { ScheduledPostsPage } from './pages/ScheduledPostsPage';
import { SentimentAnalyticsPage } from './pages/SentimentAnalyticsPage';
import { PredictiveAnalyticsPage } from './pages/PredictiveAnalyticsPage';
import { BestTimeToPostPage } from './pages/BestTimeToPostPage';
import { EngagementAnalyticsPage } from './pages/EngagementAnalyticsPage';
import { AIContentAssistantPage } from './pages/AIContentAssistantPage';
import { SEPMWorkspacePage } from './pages/SEPMWorkspacePage';
import { ReportsDocsPage } from './pages/ReportsDocsPage';
import { SettingsPage } from './pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Verifying PostPilot AI session...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Application Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="connect-accounts" element={<ConnectAccountsPage />} />
            <Route path="intelligence-center" element={<IntelligenceCenterPage />} />
            <Route path="content-planner" element={<ContentPlannerPage />} />
            <Route path="create-post" element={<CreatePostPage />} />
            <Route path="scheduled-posts" element={<ScheduledPostsPage />} />
            <Route path="sentiment-analytics" element={<SentimentAnalyticsPage />} />
            <Route path="predictive-analytics" element={<PredictiveAnalyticsPage />} />
            <Route path="best-time-to-post" element={<BestTimeToPostPage />} />
            <Route path="engagement-analytics" element={<EngagementAnalyticsPage />} />
            <Route path="ai-content-assistant" element={<AIContentAssistantPage />} />
            <Route path="sepm-workspace" element={<SEPMWorkspacePage />} />
            <Route path="reports-and-docs" element={<ReportsDocsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
