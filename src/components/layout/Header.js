import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  TrendingUp,
  Wallet,
  Users,
  DollarSign,
  LogOut,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../ui';
import { cn } from '../../utils';
import { ROUTES } from '../../constants';
import logo from '../../assets/Logo.png';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <motion.header 
      className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <motion.div 
            className='flex items-center'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to='/' className='flex items-center space-x-2 sm:space-x-3'>
              <motion.img
                src={logo}
                alt='Dreams Life Traders Logo'
                className='h-8 w-8 sm:h-10 sm:w-10 object-contain'
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              />
              <span className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white hidden sm:inline-block'>
                Dreams Life Traders
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <nav className='hidden md:flex items-center space-x-4 flex-1 justify-center'>
            {!isAuthenticated ? (
             <>
               <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                 <Link 
                   to={ROUTES.HOME} 
                   className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                 >
                   Home
                   <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                 </Link>
               </motion.div>
               <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                 <Link 
                   to={ROUTES.ABOUT} 
                   className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                 >
                   About Us
                   <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                 </Link>
               </motion.div>
             </>
            ) : (
              <>
              </>
            )}
            
            
            {isAuthenticated ? (
              <>
               <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link 
                to={ROUTES.DASHBOARD} 
                className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
              >
                Dashboard
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
              </Link>
            </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.PLANS} 
                    className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                  >
                    Plans
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.MY_INVESTMENTS} 
                    className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                  >
                    Investments
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.WITHDRAW} 
                    className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                  >
                    Withdraw
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.TEAM} 
                    className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                  >
                    Team
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.DAILY_EARNINGS} 
                    className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                  >
                    Earnings
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.SUPPORT} 
                    className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                  >
                    Support
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.ABOUT} 
                    className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                  >
                    About Us
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.PLANS} 
                    className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                  >
                    Plans
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.ABOUT} 
                    className='text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 relative group'
                  >
                    About Us
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300'></span>
                  </Link>
                </motion.div>
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className='relative'>
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className='flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.fullName || user?.name || 'User'}
                        className='w-8 h-8 rounded-full object-cover border-2 border-primary-500 dark:border-primary-400 shadow-lg'
                      />
                    ) : (
                      <div className='w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg'>
                        <User className='h-4 w-4 text-white' />
                      </div>
                    )}
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {user?.fullName || user?.name || 'User'}
                    </span>
                  </motion.button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div 
                        className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50'
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to={ROUTES.DASHBOARD}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <TrendingUp className='h-4 w-4 mr-3' />
                          Dashboard
                        </Link>
                        <Link
                          to={ROUTES.PLANS}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Wallet className='h-4 w-4 mr-3' />
                          Investment Plans
                        </Link>
                        <Link
                          to={ROUTES.MY_INVESTMENTS}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <TrendingUp className='h-4 w-4 mr-3' />
                          My Investments
                        </Link>
                        <Link
                          to={ROUTES.WITHDRAW}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <DollarSign className='h-4 w-4 mr-3' />
                          Withdraw
                        </Link>
                        <Link
                          to={ROUTES.TEAM}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Users className='h-4 w-4 mr-3' />
                          My Team
                        </Link>
                        <Link
                          to={ROUTES.DAILY_EARNINGS}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Calendar className='h-4 w-4 mr-3' />
                          Daily Earnings
                        </Link>
                        <Link
                          to={ROUTES.SUPPORT}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <MessageCircle className='h-4 w-4 mr-3' />
                          Support
                        </Link>
                        <Link
                          to={ROUTES.PROFILE}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className='h-4 w-4 mr-3' />
                          View Profile
                        </Link>
                        <Link
                          to={ROUTES.ABOUT}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Users className='h-4 w-4 mr-3' />
                          About Us
                        </Link>
                        <hr className='my-1 border-gray-200 dark:border-gray-700' />
                        <button
                          onClick={handleLogout}
                          className='flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                        >
                          <LogOut className='h-4 w-4 mr-3' />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className='flex items-center space-x-3'>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link
                    to='/login'
                    className='text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300'
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className='md:hidden flex items-center space-x-2'>
            {isAuthenticated && (
              <motion.button
                onClick={() => navigate(ROUTES.PROFILE)}
                className='p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.fullName || user?.name || 'User'}
                    className='w-8 h-8 rounded-full object-cover border-2 border-primary-500 dark:border-primary-400 shadow-lg'
                  />
                ) : (
                  <div className='w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg'>
                    <User className='h-4 w-4 text-white' />
                  </div>
                )}
              </motion.button>
            )}
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className='h-6 w-6 text-gray-600 dark:text-gray-400' />
              ) : (
                <Menu className='h-6 w-6 text-gray-600 dark:text-gray-400' />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className='md:hidden border-t border-gray-200 dark:border-gray-700 py-4'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile User Info */}
              {isAuthenticated && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 }}
                  className='px-4 py-3 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl'
                >
                  <div className='flex items-center space-x-3'>
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.fullName || user?.name || 'User'}
                        className='w-12 h-12 rounded-full object-cover border-2 border-primary-500 dark:border-primary-400 shadow-lg'
                      />
                    ) : (
                      <div className='w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg'>
                        <User className='h-6 w-6 text-white' />
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
                        {user?.fullName || user?.name || 'User'}
                      </p>
                      <p className='text-xs text-gray-600 dark:text-gray-400 truncate'>
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              <div className='space-y-4'>
                {!isAuthenticated && (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        to='/'
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Link
                        to={ROUTES.ABOUT}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        About Us
                      </Link>
                    </motion.div>
                  </>
                )}
                
                {isAuthenticated ? (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        to={ROUTES.DASHBOARD}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        to={ROUTES.PLANS}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Investment Plans
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        to={ROUTES.MY_INVESTMENTS}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Investments
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Link
                        to={ROUTES.WITHDRAW}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Withdraw
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Link
                        to={ROUTES.TEAM}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Team
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Link
                        to={ROUTES.DAILY_EARNINGS}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Daily Earnings
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Link
                        to={ROUTES.SUPPORT}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Support
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.85 }}
                    >
                      <Link
                        to={ROUTES.PROFILE}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.88 }}
                    >
                      <Link
                        to={ROUTES.ABOUT}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        About Us
                      </Link>
                    </motion.div>
                    
                    <hr className='my-2 border-gray-200 dark:border-gray-700' />
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <button
                        onClick={handleLogout}
                        className='block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-300'
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        to={ROUTES.ABOUT}
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        About Us
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Link
                        to='/login'
                        className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        to='/register'
                        className='block px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors duration-300'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay for user menu */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            className='fixed inset-0 z-40'
            onClick={() => setIsUserMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
