import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GenerateIdeasPage from './pages/GenerateIdeasPage';
import TrendsAnalysisPage from './pages/TrendsAnalysisPage';
import ContentCalendarPage from './pages/ContentCalendarPage';
import MyIdeasPage from './pages/MyIdeasPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { selectAuth } from './redux/auth/authSlice';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector(selectAuth);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="generate" element={<GenerateIdeasPage />} />
          <Route path="trends" element={<TrendsAnalysisPage />} />
          <Route path="calendar" element={<ContentCalendarPage />} />
          <Route path="my-ideas" element={<MyIdeasPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
