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
  MapPin,
  ChevronDown,
  UserPlus,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocationContext } from '../../context/LocationContext';
import { cn } from '../../utils';
import { ROUTES } from '../../constants';
import cartService from '../../services/cart';
import { getComparison } from '../../utils/productComparison';
import { toast } from 'react-toastify';
import logo from '../../assets/Logo.png';
import UserNotificationBell from '../common/UserNotificationBell';
import AnnouncementBanner from '../common/AnnouncementBanner';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { locationName, getCurrentLocation, updateLocationName, checkLocationPermission } = useLocationContext();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
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

  // Close location menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLocationMenuOpen && !event.target.closest('.location-menu-container')) {
        setIsLocationMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLocationMenuOpen]);

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
    <>
      {/* Announcement Banner */}
      <AnnouncementBanner />
      
    <motion.header 
      className={cn(
          'sticky top-0 z-[60] transition-all duration-500 bg-darkGreen-950/95 backdrop-blur-sm shadow-sm border-b border-gold-950/20 relative'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
        style={{ isolation: 'isolate' }}
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
                className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-gold-950 to-gold-600 flex items-center justify-center shadow-md overflow-hidden'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {logo ? (
                  <motion.img
                    src={logo}
                    alt='Ghazali Food Logo'
                    className='h-full w-full object-cover rounded-full'
                  />
                ) : (
                  <span className='text-darkGreen-950 font-bold text-lg sm:text-xl'>GF</span>
                )}
              </motion.div>
              <span className='text-lg sm:text-xl font-semibold text-gold-950 hidden sm:inline-block'>
                Ghazali Food
              </span>
            </Link>
          </motion.div>

          {/* Location - Desktop */}
          <div className='hidden md:flex items-center mr-4'>
            <div className='relative location-menu-container'>
              <button
                onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                className='flex items-center gap-1 px-3 py-1.5 hover:bg-darkGreen-900 rounded-lg transition-colors'
              >
                <MapPin className='w-4 h-4 text-gray-300' />
                <div className='flex flex-col items-start'>
                  <span className='text-xs text-gray-400'>Deliver to</span>
                  <span className='text-sm font-medium text-gold-950 flex items-center gap-1'>
                    {locationName}
                    <ChevronDown className='w-3 h-3' />
                  </span>
                </div>
              </button>
              
              {isLocationMenuOpen && (
                <div className='absolute top-full left-0 mt-2 w-64 bg-darkGreen-900 border border-gold-950/20 rounded-lg shadow-lg py-2 z-50 location-menu-container'>
                  <button
                    onClick={async () => {
                      try {
                        // Check permission first
                        const permissionCheck = await checkLocationPermission();
                        if (permissionCheck.granted === false) {
                          toast.error(permissionCheck.error || 'Location permission denied. Please enable location access in your browser settings.');
                          setIsLocationMenuOpen(false);
                          return;
                        }
                        
                        await getCurrentLocation();
                        toast.success('Location updated');
                        setIsLocationMenuOpen(false);
                      } catch (error) {
                        const errorMessage = error.message || 'Failed to get location. Please enable location access in your browser settings.';
                        toast.error(errorMessage);
                        setIsLocationMenuOpen(false);
                      }
                    }}
                    className='w-full px-4 py-2 text-left hover:bg-darkGreen-800 flex items-center gap-2 text-gray-300'
                  >
                    <MapPin className='w-4 h-4 text-gold-950' />
                    <span className='text-sm'>Use Current Location</span>
                  </button>
                  <div className='border-t border-gold-950/20 my-1'></div>
                  <div className='px-4 py-2'>
                    <span className='text-xs text-gray-400'>Popular Cities</span>
                  </div>
                  {['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Faisalabad'].map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        updateLocationName(city);
                        setIsLocationMenuOpen(false);
                      }}
                      className='w-full px-4 py-2 text-left hover:bg-darkGreen-800 text-sm text-gray-300'
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className='hidden md:flex items-center space-x-6 flex-1 justify-center'>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link 
                to={ROUTES.HOME}
                className='text-gray-300 hover:text-gold-950 transition-colors duration-300 font-medium'
              >
                Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link 
                to={ROUTES.SHOP}
                className='text-gray-300 hover:text-gold-950 transition-colors duration-300 font-medium'
              >
                Shop
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link 
                to='/about'
                className='text-gray-300 hover:text-gold-950 transition-colors duration-300 font-medium'
              >
                About Us
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link 
                to='/contact'
                className='text-gray-300 hover:text-gold-950 transition-colors duration-300 font-medium'
              >
                Contact
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link 
                to={ROUTES.BLOG}
                className='text-gray-300 hover:text-gold-950 transition-colors duration-300 font-medium'
              >
                Blog
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
                    className='relative p-2.5 rounded-lg text-gray-300 hover:text-gold-950 transition-colors duration-300'
                  >
                    <Heart className='w-5 h-5' />
                  </Link>
                </motion.div>
                <div className='h-6 w-px bg-gold-950/30 mx-2' />
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={ROUTES.CART}
                    className='relative p-2.5 rounded-lg text-gray-300 hover:text-gold-950 transition-colors duration-300 flex flex-col items-center'
                  >
                    <div className='relative'>
                    <ShoppingCart className='w-5 h-5' />
                    </div>
                    {cartCount > 0 && (
                      <span className='absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gold-950 text-darkGreen-950 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center leading-none whitespace-nowrap'>
                        {cartCount > 99 ? '99+' : cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
                <div className='h-6 w-px bg-gold-950/30 mx-2' />
                {/* Notifications */}
                <UserNotificationBell />
                <div className='h-6 w-px bg-gold-950/30 mx-2' />
                {/* User Menu */}
                <div className='relative'>
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className='p-2.5 rounded-lg text-gray-300 hover:text-gold-950 transition-colors duration-300'
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
                      <User className='w-5 h-5 text-gray-300' />
                    )}
                  </motion.button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div 
                        className='absolute right-0 mt-2 w-48 bg-darkGreen-900 border border-gold-950/20 rounded-xl shadow-lg py-1 z-50'
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to={ROUTES.PROFILE}
                          className='flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-darkGreen-800 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className='h-4 w-4 mr-3' />
                          Profile
                        </Link>
                        <Link
                          to={ROUTES.ORDERS}
                          className='flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-darkGreen-800 transition-colors duration-200'
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className='h-4 w-4 mr-3' />
                          Orders
                        </Link>
                        <hr className='my-1 border-gold-950/20' />
                        <button
                          onClick={handleLogout}
                          className='flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors duration-200'
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
                <motion.button
                onClick={() => navigate(ROUTES.LOGIN)}
                className='p-2.5 rounded-lg text-gray-300 hover:text-gold-950 transition-colors duration-300'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                title="Login / Sign Up"
                >
                <UserPlus className='w-5 h-5' />
                </motion.button>
            )}
          </div>

          {/* Mobile Location */}
          <div className='md:hidden flex items-center mr-2 location-menu-container relative'>
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className='flex items-center gap-1 px-2 py-1 hover:bg-darkGreen-900 rounded-lg transition-colors'
            >
              <MapPin className='w-4 h-4 text-gray-300' />
              <div className='flex flex-col items-start'>
                <span className='text-[10px] text-gray-400 leading-none'>Deliver to</span>
                <span className='text-xs font-medium text-gold-950 flex items-center gap-0.5 leading-tight'>
                  {locationName.length > 12 ? locationName.substring(0, 12) + '...' : locationName}
                  <ChevronDown className={`w-3 h-3 transition-transform ${isLocationMenuOpen ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </button>
            
            {isLocationMenuOpen && (
              <>
                {/* Click outside to close */}
                <div 
                  className='fixed inset-0 z-[45]' 
                  onClick={() => setIsLocationMenuOpen(false)}
                  style={{ top: '104px' }}
                />
                {/* Dropdown menu */}
                <div 
                  className='absolute top-full left-0 mt-2 w-64 bg-darkGreen-900 border border-gold-950/20 rounded-lg shadow-2xl py-2 z-[50] location-menu-container'
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={async () => {
                      try {
                        // Check permission first
                        const permissionCheck = await checkLocationPermission();
                        if (permissionCheck.granted === false) {
                          toast.error(permissionCheck.error || 'Location permission denied. Please enable location access in your browser settings.');
                          setIsLocationMenuOpen(false);
                          return;
                        }
                        
                        await getCurrentLocation();
                        toast.success('Location updated');
                        setIsLocationMenuOpen(false);
                      } catch (error) {
                        const errorMessage = error.message || 'Failed to get location. Please enable location access in your browser settings.';
                        toast.error(errorMessage);
                        setIsLocationMenuOpen(false);
                      }
                    }}
                    className='w-full px-4 py-2 text-left hover:bg-darkGreen-800 flex items-center gap-2 text-gray-300'
                  >
                    <MapPin className='w-4 h-4 text-gold-950' />
                    <span className='text-sm'>Use Current Location</span>
                  </button>
                  <div className='border-t border-gold-950/20 my-1'></div>
                  <div className='px-4 py-2'>
                    <span className='text-xs text-gray-400'>Popular Cities</span>
                  </div>
                  {['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Faisalabad'].map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        updateLocationName(city);
                        setIsLocationMenuOpen(false);
                      }}
                      className='w-full px-4 py-2 text-left hover:bg-darkGreen-800 text-sm text-gray-300'
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden flex items-center space-x-2'>
            {isAuthenticated && (
              <>
                <UserNotificationBell />
                <Link to={ROUTES.CART} className='relative p-2 flex flex-col items-center'>
                  <div className='relative'>
                  <ShoppingCart className='w-6 h-6 text-gray-300' />
                  </div>
                  {cartCount > 0 && (
                    <span className='absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gold-950 text-darkGreen-950 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center leading-none whitespace-nowrap'>
                      {cartCount > 99 ? '99+' : cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='p-2 rounded-xl hover:bg-darkGreen-900 transition-colors duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className='h-6 w-6 text-gray-300' />
              ) : (
                <Menu className='h-6 w-6 text-gray-300' />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className='md:hidden border-t border-gold-950/20 py-4'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='space-y-2'>
                <Link
                  to={ROUTES.SHOP}
                  className='block px-4 py-2 text-gray-300 hover:bg-darkGreen-900 rounded-xl transition-colors duration-300'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  to={ROUTES.BLOG}
                  className='block px-4 py-2 text-gray-300 hover:bg-darkGreen-900 rounded-xl transition-colors duration-300'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  to={ROUTES.ABOUT}
                  className='block px-4 py-2 text-gray-300 hover:bg-darkGreen-900 rounded-xl transition-colors duration-300'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to={ROUTES.CONTACT}
                  className='block px-4 py-2 text-gray-300 hover:bg-darkGreen-900 rounded-xl transition-colors duration-300'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to={ROUTES.WISHLIST}
                      className='block px-4 py-2 text-gray-300 hover:bg-darkGreen-900 rounded-xl transition-colors duration-300'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <Link
                      to={ROUTES.ORDERS}
                      className='block px-4 py-2 text-gray-300 hover:bg-darkGreen-900 rounded-xl transition-colors duration-300'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to={ROUTES.PROFILE}
                      className='block px-4 py-2 text-gray-300 hover:bg-darkGreen-900 rounded-xl transition-colors duration-300'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <hr className='my-2 border-gold-950/20' />
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors duration-300'
                    >
                      Logout
                    </button>
                  </>
                ) : (
                    <Link
                      to={ROUTES.LOGIN}
                    className='block px-4 py-2 text-gray-300 hover:bg-darkGreen-900 rounded-xl transition-colors duration-300 flex items-center gap-2'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                    <UserPlus className='w-5 h-5' />
                    Login / Sign Up
                    </Link>
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
    </>
  );
};

export default Header;
