import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';

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

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
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
