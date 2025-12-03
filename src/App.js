import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationContainer } from './components';
import { ROUTES } from './constants';
import { setAppContext } from './services/toast';

// Home Page
import Home from './pages/Home';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Profile Page
import ProfilePage from './pages/profile/ProfilePage';

// Ecommerce Pages
import ShopPage from './pages/shop/ShopPage';
import ProductDetailPage from './pages/product/ProductDetailPage';
import CategoryPage from './pages/category/CategoryPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import WishlistPage from './pages/wishlist/WishlistPage';
import ProductComparisonPage from './pages/product/ProductComparisonPage';
import AboutPage from './pages/about/AboutPage';
import ContactPage from './pages/contact/ContactPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminBannersPage from './pages/admin/AdminBannersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminStockNotificationsPage from './pages/admin/AdminStockNotificationsPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminLayout from './components/admin/AdminLayout';

// Layout
import Layout from './components/layout/Layout';
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

// Public Route Component (redirect to home if logged in)
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
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  }

  return children;
};

// Admin Public Route (redirect to dashboard if logged in)
const AdminPublicRoute = ({ children }) => {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (admin) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return children;
};

// Inner component that has access to AppContext
function AppWithToast() {
  const appContext = useApp();

  // Initialize toast service with AppContext
  React.useEffect(() => {
    setAppContext(appContext);
  }, [appContext]);

  return (
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

                  {/* Public Ecommerce Routes */}
                  <Route path={ROUTES.SHOP} element={<Layout><ShopPage /></Layout>} />
                  <Route path={ROUTES.PRODUCT_DETAIL} element={<Layout><ProductDetailPage /></Layout>} />
                  <Route path={ROUTES.CATEGORY} element={<Layout><CategoryPage /></Layout>} />
                  <Route path={ROUTES.SEARCH} element={<Layout><ShopPage /></Layout>} />
                  <Route path={ROUTES.ABOUT} element={<Layout><AboutPage /></Layout>} />
                  <Route path={ROUTES.CONTACT} element={<Layout><ContactPage /></Layout>} />

                  {/* Protected Routes with Layout */}
                  <Route
                    path={ROUTES.PROFILE}
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ProfilePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.CART}
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CartPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.CHECKOUT}
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <CheckoutPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ORDERS}
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <OrdersPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ORDER_DETAIL}
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <OrderDetailPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.WISHLIST}
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <WishlistPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.COMPARE}
                    element={
                      <Layout>
                        <ProductComparisonPage />
                      </Layout>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path={ROUTES.ADMIN_LOGIN}
                    element={
                      <AdminPublicRoute>
                        <AdminLoginPage />
                      </AdminPublicRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_DASHBOARD}
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout>
                          <AdminDashboardPage />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_PRODUCTS}
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout>
                          <AdminProductsPage />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_CATEGORIES}
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout>
                          <AdminCategoriesPage />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_ORDERS}
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout>
                          <AdminOrdersPage />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_CUSTOMERS}
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout>
                          <AdminCustomersPage />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_COUPONS}
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout>
                          <AdminCouponsPage />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_BANNERS}
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout>
                          <AdminBannersPage />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_REVIEWS}
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout>
                          <AdminReviewsPage />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_STOCK_NOTIFICATIONS}
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout>
                          <AdminStockNotificationsPage />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.ADMIN_QUESTIONS}
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout>
                          <AdminQuestionsPage />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />

                  {/* 404 - Redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

            {/* Notification Container */}
            <NotificationContainer />
          </div>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <ThemeProvider>
        <AppProvider>
          <AppWithToast />
        </AppProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
