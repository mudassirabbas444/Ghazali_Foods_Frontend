/**
 * Mobile utility functions for responsive design and touch interactions
 */

/**
 * Check if device is mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

/**
 * Check if device is tablet
 * @returns {boolean}
 */
export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * Check if device is desktop
 * @returns {boolean}
 */
export const isDesktop = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
};

/**
 * Check if device is iOS
 * @returns {boolean}
 */
export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

/**
 * Check if device is Android
 * @returns {boolean}
 */
export const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

/**
 * Check if device supports touch
 * @returns {boolean}
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get safe area insets for notched devices
 * @returns {Object}
 */
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0', 10),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0', 10),
  };
};

/**
 * Prevent zoom on input focus (iOS fix)
 * @param {HTMLElement} element
 */
export const preventZoomOnFocus = (element) => {
  if (!element || !isIOS()) return;
  
  const originalFontSize = window.getComputedStyle(element).fontSize;
  
  element.addEventListener('focus', () => {
    if (parseInt(originalFontSize) < 16) {
      element.style.fontSize = '16px';
    }
  });
  
  element.addEventListener('blur', () => {
    element.style.fontSize = originalFontSize;
  });
};

/**
 * Disable pull-to-refresh on mobile
 * @param {HTMLElement} element
 */
export const disablePullToRefresh = (element) => {
  if (!element) return;
  
  let touchStartY = 0;
  
  element.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  element.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const scrollTop = element.scrollTop;
    
    // If at top and swiping down, prevent default
    if (scrollTop === 0 && touchY > touchStartY) {
      e.preventDefault();
    }
  }, { passive: false });
};

/**
 * Get viewport dimensions
 * @returns {Object}
 */
export const getViewportDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
  };
};

/**
 * Check if device is in landscape mode
 * @returns {boolean}
 */
export const isLandscape = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > window.innerHeight;
};

/**
 * Check if device is in portrait mode
 * @returns {boolean}
 */
export const isPortrait = () => {
  if (typeof window === 'undefined') return true;
  return window.innerHeight > window.innerWidth;
};

/**
 * Add viewport resize listener
 * @param {Function} callback
 * @returns {Function} Cleanup function
 */
export const onViewportResize = (callback) => {
  if (typeof window === 'undefined') return () => {};
  
  let timeoutId;
  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(getViewportDimensions());
    }, 150);
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    clearTimeout(timeoutId);
  };
};

/**
 * Check if PWA is installed
 * @returns {boolean}
 */
export const isPWAInstalled = () => {
  if (typeof window === 'undefined') return false;
  
  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // Check if running in fullscreen mode
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return true;
  }
  
  // Check for iOS standalone mode
  if (window.navigator.standalone === true) {
    return true;
  }
  
  return false;
};

/**
 * Request PWA installation
 */
export const requestPWAInstall = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }
  
  // Check if beforeinstallprompt is supported
  if ('BeforeInstallPromptEvent' in window) {
    return true;
  }
  
  return false;
};

/**
 * Get device pixel ratio
 * @returns {number}
 */
export const getDevicePixelRatio = () => {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
};

/**
 * Check if device has high DPI display
 * @returns {boolean}
 */
export const isHighDPI = () => {
  return getDevicePixelRatio() > 1;
};

export default {
  isMobile,
  isTablet,
  isDesktop,
  isIOS,
  isAndroid,
  isTouchDevice,
  getSafeAreaInsets,
  preventZoomOnFocus,
  disablePullToRefresh,
  getViewportDimensions,
  isLandscape,
  isPortrait,
  onViewportResize,
  isPWAInstalled,
  requestPWAInstall,
  getDevicePixelRatio,
  isHighDPI,
};

