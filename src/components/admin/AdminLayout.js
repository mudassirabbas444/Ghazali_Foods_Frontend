import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Tag,
  Image,
  Star,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Bell,
  MessageSquare,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ROUTES } from '../../constants';
import { toast } from 'react-toastify';
import logo from '../../assets/Logo.png';
import AdminNotificationContainer from './AdminNotificationContainer';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate(ROUTES.ADMIN_LOGIN);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
    { icon: Package, label: 'Products', path: ROUTES.ADMIN_PRODUCTS },
    { icon: FolderTree, label: 'Categories', path: ROUTES.ADMIN_CATEGORIES },
    { icon: ShoppingCart, label: 'Orders', path: ROUTES.ADMIN_ORDERS },
    { icon: Users, label: 'Customers', path: ROUTES.ADMIN_CUSTOMERS },
    { icon: Tag, label: 'Coupons', path: ROUTES.ADMIN_COUPONS },
    { icon: Image, label: 'Banners', path: ROUTES.ADMIN_BANNERS },
    { icon: Star, label: 'Reviews', path: ROUTES.ADMIN_REVIEWS },
    { icon: Bell, label: 'Stock Notifications', path: ROUTES.ADMIN_STOCK_NOTIFICATIONS },
    { icon: MessageSquare, label: 'Questions', path: ROUTES.ADMIN_QUESTIONS },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 fixed h-screen transition-all duration-300 z-30 hidden lg:block`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                <span className="font-bold text-gray-900">Admin Panel</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                      {active && sidebarOpen && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Admin Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            {sidebarOpen && admin && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-900">{admin.fullName}</p>
                <p className="text-xs text-gray-500">{admin.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                  <span className="font-bold text-gray-900">Admin Panel</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            active
                              ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="p-4 border-t border-gray-200">
                {admin && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-900">{admin.fullName}</p>
                    <p className="text-xs text-gray-500">{admin.email}</p>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <AdminNotificationContainer />
              {admin && (
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900">{admin.fullName}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

