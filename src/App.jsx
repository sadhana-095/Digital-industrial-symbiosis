import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PostWastePage } from './pages/PostWastePage';
import { BrowsePage } from './pages/BrowsePage';
import { MatchesPage } from './pages/MatchesPage';
import { TransactionsListPage } from './pages/TransactionsListPage';
import { TransactionDetailPage } from './pages/TransactionDetailPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { EnvironmentalImpactPage } from './pages/EnvironmentalImpactPage';

// Layout wrapper that hides navbar on login/register
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/post-waste" element={<PostWastePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/transactions" element={<TransactionsListPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailPage />} />
            <Route path="/impact" element={<EnvironmentalImpactPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  );
}
