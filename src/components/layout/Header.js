import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
  Heart,
  Package,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils';
import { ROUTES } from '../../constants';
import cartService from '../../services/cart';
import { getComparison } from '../../utils/productComparison';
import logo from '../../assets/Logo.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    }
    updateCompareCount();
  }, [isAuthenticated, location.pathname]);

  const updateCompareCount = () => {
    const items = getComparison();
    setCompareCount(items.length);
  };

  const fetchCartCount = async () => {
    try {
      const response = await cartService.getCart();
      if (response.success) {
        // Handle different response formats
        const cartData = response.cart || response.data || response;
        if (cartData && cartData.items) {
          const count = cartData.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <motion.header 
      className={cn(
        'sticky top-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200'
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
              <motion.div
                className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md overflow-hidden'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {logo ? (
                  <motion.img
                    src={logo}
                    alt='Ghazali Foods Logo'
                    className='h-full w-full object-cover rounded-full'
                  />
                ) : (
                  <span className='text-white font-bold text-lg sm:text-xl'>GF</span>
                )}
              </motion.div>
              <span className='text-lg sm:text-xl font-semibold text-gray-900 hidden sm:inline-block'>
                Ghazali Foods
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <nav className='hidden md:flex items-center space-x-6 flex-1 justify-center'>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link 
                to={ROUTES.HOME}
                className='text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium'
              >
                Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link 
                to={ROUTES.SHOP}
                className='text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium'
              >
                Shop
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link 
                to='/about'
                className='text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium'
              >
                About Us
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link 
                to='/contact'
                className='text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium'
              >
                Contact
              </Link>
            </motion.div>
          </nav>

          {/* Icon Buttons - Right Side */}
          <div className='hidden md:flex items-center'>
            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.WISHLIST}
                    className='relative p-2.5 rounded-lg text-gray-700 transition-colors duration-300'
                  >
                    <Heart className='w-5 h-5' />
                  </Link>
                </motion.div>
                <div className='h-6 w-px bg-amber-200 mx-2' />
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.CART}
                    className='relative p-2.5 rounded-lg text-gray-700 transition-colors duration-300'
                  >
                    <ShoppingCart className='w-5 h-5' />
                    {cartCount > 0 && (
                      <span className='absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
                <div className='h-6 w-px bg-amber-200 mx-2' />
                {/* User Menu */}
                <div className='relative'>
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className='p-2.5 rounded-lg text-gray-700 transition-colors duration-300'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.fullName || 'User'}
                        className='w-5 h-5 rounded-full object-cover'
                      />
                    ) : (
                      <User className='w-5 h-5 text-gray-700' />
                    )}
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
                          to={ROUTES.PROFILE}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className='h-4 w-4 mr-3' />
                          Profile
                        </Link>
                        <Link
                          to={ROUTES.ORDERS}
                          className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className='h-4 w-4 mr-3' />
                          Orders
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
              <>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link
                    to={ROUTES.LOGIN}
                    className='text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium'
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className='inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 ml-4'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden flex items-center space-x-2'>
            {isAuthenticated && (
              <>
                <Link to={ROUTES.CART} className='relative p-2'>
                  <ShoppingCart className='w-6 h-6 text-gray-600 dark:text-gray-400' />
                  {cartCount > 0 && (
                    <span className='absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
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
              <div className='space-y-2'>
                <Link
                  to={ROUTES.SHOP}
                  className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to={ROUTES.WISHLIST}
                      className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <Link
                      to={ROUTES.ORDERS}
                      className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to={ROUTES.PROFILE}
                      className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <hr className='my-2 border-gray-200 dark:border-gray-700' />
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-300'
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-300'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      className='block px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors duration-300'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
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
