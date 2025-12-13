import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ShoppingCart,
  Search,
  LayoutGrid,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { ROUTES } from '../../constants';
import cartService from '../../services/cart';
import { useAuth } from '../../hooks/useAuth';

const BottomNavigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    }
  }, [isAuthenticated, location.pathname]);

  const fetchCartCount = async () => {
    try {
      const response = await cartService.getCart();
      if (response.success) {
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

  const isActive = (path) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      path: ROUTES.HOME,
    },
    {
      label: 'Categories',
      icon: LayoutGrid,
      path: ROUTES.CATEGORIES,
    },
    {
      label: 'Blog',
      icon: FileText,
      path: ROUTES.BLOG,
    },
    {
      label: 'Cart',
      icon: ShoppingCart,
      path: ROUTES.CART,
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      label: 'Support',
      icon: HelpCircle,
      path: ROUTES.CONTACT,
    },
  ];

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-[200] bg-darkGreen-950 border-t border-gold-950/20 shadow-lg md:hidden'>
      <div className='flex items-center justify-around h-16 px-2'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className='flex flex-col items-center justify-center flex-1 h-full relative'
            >
              <motion.div
                className='flex flex-col items-center justify-center'
                whileTap={{ scale: 0.9 }}
              >
                <div className='relative'>
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      active ? 'text-gold-950' : 'text-gray-400'
                    }`}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className='absolute -top-1 -right-1 bg-gold-950 text-darkGreen-950 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center leading-none'>
                      {item.badge > 99 ? '99+' : item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 transition-colors duration-200 ${
                    active ? 'text-gold-950 font-semibold' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <motion.div
                    className='absolute bottom-0 left-0 right-0 h-0.5 bg-gold-950'
                    layoutId='activeTab'
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

