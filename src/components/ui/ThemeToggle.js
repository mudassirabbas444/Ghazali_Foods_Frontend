import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="relative w-6 h-6"
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.8 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Sun className="w-5 h-5 text-yellow-500" />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.8,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Moon className="w-5 h-5 text-blue-400" />
        </motion.div>
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={false}
        animate={{
          boxShadow: isDark 
            ? '0 0 20px rgba(167, 139, 250, 0.3)' 
            : '0 0 20px rgba(245, 158, 11, 0.3)',
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
