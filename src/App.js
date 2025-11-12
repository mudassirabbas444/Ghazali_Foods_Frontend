import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { NotificationContainer } from './components';
import { ROUTES } from './constants';

// Home Page
import Home from './pages/Home';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Investment Pages
import PlansPage from './pages/investment/PlansPage';
import BuyPlanPage from './pages/investment/BuyPlanPage';
import MyInvestmentsPage from './pages/investment/MyInvestmentsPage';

// Dashboard & Other Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import DailyEarningsPage from './pages/dashboard/DailyEarningsPage';
import WithdrawPage from './pages/withdrawal/WithdrawPage';
import TeamPage from './pages/team/TeamPage';
import SupportPage from './pages/support/SupportPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminInvestmentsPage from './pages/admin/AdminInvestmentsPage';
import AdminWithdrawalsPage from './pages/admin/AdminWithdrawalsPage';
import AdminPlansPage from './pages/admin/AdminPlansPage';
import AdminRanksPage from './pages/admin/AdminRanksPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSupportPage from './pages/admin/AdminSupportPage';

// Layout
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import { useAuth } from './context/AuthContext';
import { useAdminAuth } from './context/AdminAuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { admin, isLoading, isAuthenticated } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!admin || !isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  }

  return children;
};

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <ThemeProvider>
        <AppProvider>
          <AuthProvider>
            <AdminAuthProvider>
              <Router>
              <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route
                path={ROUTES.LOGIN}
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path={ROUTES.REGISTER}
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
              <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />

              {/* Admin Login (Public - no redirect for regular users) */}
              <Route
                path={ROUTES.ADMIN_LOGIN}
                element={<AdminLoginPage />}
              />

              {/* Protected Routes with Layout */}
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PLANS}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PlansPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buy-plan/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <BuyPlanPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MY_INVESTMENTS}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MyInvestmentsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.WITHDRAW}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <WithdrawPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.TEAM}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TeamPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.DAILY_EARNINGS}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DailyEarningsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.SUPPORT}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SupportPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="investments" element={<AdminInvestmentsPage />} />
                <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="plans" element={<AdminPlansPage />} />
                <Route path="ranks" element={<AdminRanksPage />} />
                <Route path="support" element={<AdminSupportPage />} />
              </Route>

              {/* 404 - Redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Notification Container */}
            <NotificationContainer />
          </div>
        </Router>
        </AdminAuthProvider>
      </AuthProvider>
      </AppProvider>
    </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
