import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, ArrowLeft, Lock, Mail } from 'lucide-react';
import { Button } from '../../components';
import { ThemeToggle } from '../../components/ui';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ROUTES } from '../../constants';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, logout, isLoading, isAuthenticated } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await login({ email, password });
      if (response.success) {
        // Check if user is actually an admin
        if (!response.user?.isAdmin) {
          setError('You do not have admin privileges. Please use the regular login page.');
          // Logout the user since they're not an admin
          logout();
          return;
        }
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Invalid admin credentials. Please check your email and password.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          className='absolute top-20 left-10 w-32 h-32 bg-indigo-500/20 dark:bg-indigo-400/10 rounded-full blur-2xl'
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className='absolute bottom-20 right-10 w-24 h-24 bg-purple-500/20 dark:bg-purple-400/10 rounded-full blur-xl'
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className='absolute top-1/2 left-1/2 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl'
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Theme Toggle - Top Right */}
      <div className='absolute top-4 right-4 z-20'>
        <ThemeToggle />
      </div>

      <motion.div
        className='relative z-10 w-full max-w-md'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back to Home Button */}
        <motion.button
          onClick={() => navigate(ROUTES.HOME)}
          className='mb-6 flex items-center text-white dark:text-gray-300 hover:text-gray-100 dark:hover:text-white transition-colors duration-200'
          variants={itemVariants}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back to Home
        </motion.button>

        {/* Login Card */}
        <motion.div
          className='bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/30 dark:border-slate-700/50'
          variants={itemVariants}
        >
          {/* Header */}
          <motion.div className='text-center mb-8' variants={itemVariants}>
            <motion.div
              className='w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className='w-8 h-8 text-white' />
            </motion.div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Admin Portal</h1>
            <p className='text-gray-600 dark:text-gray-400'>Sign in to access the admin dashboard</p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className='space-y-6' variants={itemVariants}>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500' />
                <input
                  type='email'
                  placeholder='admin@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all'
                />
              </div>
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                >
                  {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                className='text-red-700 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {error}
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg font-semibold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2'></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In as Admin'
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.div className='mt-8 text-center' variants={itemVariants}>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              Authorized personnel only. Unauthorized access is prohibited.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

