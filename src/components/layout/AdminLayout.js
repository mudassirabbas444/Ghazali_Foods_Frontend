import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FolderTree, 
  LogOut, 
  Menu, 
  X,
  User,
  Settings,
  DollarSign,
  Wallet
} from 'lucide-react';
import NotificationContainer from '../common/NotificationContainer';
import PageTransition from '../common/PageTransition';

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  const navigationItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/investments', label: 'Investments', icon: DollarSign },
    { to: '/admin/withdrawals', label: 'Withdrawals', icon: Wallet },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  ];

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-700'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div 
          className='fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden'
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <div className='flex'>
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Sidebar Header */}
          <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
            <div>
              <h1 className='text-xl font-bold text-gray-900 dark:text-white'>Admin Panel</h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Control Center</p>
            </div>
            <motion.button
              onClick={() => setSidebarOpen(false)}
              className='md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className='w-5 h-5 text-gray-600 dark:text-gray-400' />
            </motion.button>
          </div>

          {/* Profile Section */}
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg'>
                <User className='w-5 h-5 text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>{admin?.fullName || admin?.name || 'Admin'}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>{admin?.email}</p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              className='mt-3 w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className='w-4 h-4' />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className='p-4 space-y-1'>
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-r-2 border-indigo-700 dark:border-indigo-400' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className='w-5 h-5' />
                    <span>{item.label}</span>
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className='flex-1'>
          {/* Top Header */}
          <motion.header 
            className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 md:px-6'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex items-center justify-between'>
              <motion.button
                onClick={() => setSidebarOpen(true)}
                className='md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              </motion.button>
              
              <div className='flex items-center space-x-4'>
                <div className='hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400'>
                  <span>Welcome back,</span>
                  <span className='font-medium text-gray-900 dark:text-white'>{admin?.fullName || admin?.name || 'Admin'}</span>
                </div>
                
                <div className='flex items-center space-x-2'>
                  <motion.button 
                    className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className='w-5 h-5 text-gray-500 dark:text-gray-400' />
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className='hidden md:flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className='w-4 h-4' />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Page Content */}
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default AdminLayout;


