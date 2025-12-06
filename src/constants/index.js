// API Configuration
// In production, REACT_APP_API_URL must be set in Vercel environment variables
// For local development, create a .env file with REACT_APP_API_URL=http://localhost:5000/api
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Only use localhost fallback in development
  if (process.env.NODE_ENV === 'development') {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('⚠️  REACT_APP_API_URL not set, using localhost fallback for development');
    }
    return 'http://localhost:5000/api';
  }
  
  // In production, use relative path as fallback (no console warnings in production builds)
  return '/api'; // Fallback to relative path (will use same domain)
};

const apiBaseUrl = getApiBaseUrl();

export const API_CONFIG = {
  BASE_URL: apiBaseUrl,
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
};

// Log API URL for debugging
console.log('🔗 API Base URL:', apiBaseUrl);
console.log('🌍 Environment:', process.env.NODE_ENV);
if (process.env.REACT_APP_API_URL) {
  console.log('✅ REACT_APP_API_URL is set:', process.env.REACT_APP_API_URL);
} else {
  console.log('⚠️  REACT_APP_API_URL is not set, using fallback');
}

// App Configuration
export const APP_CONFIG = {
  NAME: process.env.REACT_APP_NAME || 'Ghazali Foods',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  DESCRIPTION:
    process.env.REACT_APP_DESCRIPTION ||
    'Your trusted ecommerce platform',
  ENV: process.env.REACT_APP_ENV || 'development',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/update-profile',
    DELETE_USER: '/users/delete-user',
    VERIFY_OTP: '/users/verify-otp',
    RESEND_OTP: '/users/resend-otp',
    GOOGLE_AUTH: '/users/google-auth',
    FORGOT_PASSWORD: '/users/forgot-password',
    RESET_PASSWORD: '/users/reset-password',
    // Admin auth endpoints
    ADMIN_LOGIN: '/users/login',
    ADMIN_PROFILE: '/admin/profile',
  },

  // Product endpoints
  PRODUCTS: {
    CREATE: '/products/',
    LIST: '/products/',
    GET_BY_ID: '/products/:id',
    GET_BY_SLUG: '/products/slug/:slug',
    GET_BY_SELLER: '/products/get-products-by-seller',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    SEARCH: '/products/search-products',
    GET_FEATURED: '/products/featured',
    GET_BEST_SELLERS: '/products/bestsellers',
    GET_NEW_ARRIVALS: '/products/new-arrivals',
    GET_LOW_STOCK: '/products/low-stock',
    UPDATE_STOCK: '/products/:id/stock',
  },

  // Category endpoints
  CATEGORIES: {
    CREATE: '/categories/',
    LIST: '/categories/',
    GET_BY_ID: '/categories/:id',
    GET_BY_SLUG: '/categories/slug/:slug',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
  },

  // Cart endpoints
  CART: {
    GET: '/cart/',
    ADD: '/cart/',
    UPDATE_ITEM: '/cart/item/:itemId',
    REMOVE_ITEM: '/cart/item/:itemId',
    CLEAR: '/cart/',
    APPLY_COUPON: '/cart/coupon',
    REMOVE_COUPON: '/cart/coupon',
  },

  // Order endpoints
  ORDERS: {
    CREATE: '/orders/',
    GET: '/orders/:id',
    GET_BY_NUMBER: '/orders/number/:orderNumber',
    GET_MY_ORDERS: '/orders/my-orders',
    CANCEL: '/orders/:id/cancel',
  },

  // Wishlist endpoints
  WISHLIST: {
    GET: '/wishlist/',
    ADD: '/wishlist/',
    REMOVE: '/wishlist/:productId',
    CHECK: '/wishlist/check/:productId',
  },

  // Address endpoints
  ADDRESSES: {
    GET: '/addresses/',
    GET_BY_ID: '/addresses/:id',
    CREATE: '/addresses/',
    UPDATE: '/addresses/:id',
    DELETE: '/addresses/:id',
    GET_DEFAULT: '/addresses/default',
  },

  // Coupon endpoints
  COUPONS: {
    GET: '/coupons/',
    GET_BY_ID: '/coupons/:id',
    VALIDATE: '/coupons/validate',
  },

  // Review endpoints
  REVIEWS: {
    GET_BY_PRODUCT: '/reviews/product/:productId',
    GET_MY_REVIEWS: '/reviews/my-reviews',
    CREATE: '/reviews/',
    UPDATE: '/reviews/:id',
    DELETE: '/reviews/:id',
  },

  // Banner endpoints
  BANNERS: {
    GET: '/banners/',
    GET_BY_ID: '/banners/:id',
  },

  // Stock Notification endpoints
  STOCK_NOTIFICATIONS: {
    SUBSCRIBE: '/stock-notifications/',
    GET_MY_NOTIFICATIONS: '/stock-notifications/my-notifications',
    UNSUBSCRIBE: '/stock-notifications/:id',
  },

  // Notification endpoints
  NOTIFICATIONS: {
    CREATE: '/notifications/',
    GET_USER_NOTIFICATIONS: '/notifications/',
    GET_UNREAD_COUNT: '/notifications/unread-count',
    MARK_AS_READ: '/notifications/:id/read',
    MARK_ALL_AS_READ: '/notifications/read-all',
    UPDATE: '/notifications/:id',
    DELETE: '/notifications/:id',
    DELETE_ALL: '/notifications/',
    DELETE_READ: '/notifications/read',
    GET_ALL: '/notifications/all', // Admin only
    CREATE_BULK: '/notifications/bulk', // Admin only
    CLEANUP: '/notifications/cleanup', // Admin only
  },

  // Product Question endpoints
  PRODUCT_QUESTIONS: {
    CREATE: '/product-questions/',
    GET_BY_PRODUCT: '/product-questions/product/:productId',
    GET_MY_QUESTIONS: '/product-questions/my-questions',
    UPDATE: '/product-questions/:id',
    DELETE: '/product-questions/:id',
    MARK_HELPFUL: '/product-questions/:id/helpful',
  },

  // Message endpoints
  MESSAGES: {
    SEND: '/messages/send-message',
    GET_BETWEEN_USERS: '/messages/get-messages-between-users',
    GET_BY_PRODUCT: '/messages/get-messages-by-product',
    DELETE: '/messages/delete-message',
    MARK_AS_READ: '/messages/mark-as-read',
    GET_UNREAD_COUNT: '/messages/get-unread-count',
    GET_CONVERSATIONS: '/messages/get-conversations',
  },

  // Favorite endpoints
  FAVORITES: {
    ADD: '/favorites/add',
    REMOVE: '/favorites/remove',
    TOGGLE: '/favorites/toggle',
    LIST: '/favorites',
    RECENT: '/favorites/recent',
    COUNT: '/favorites/count',
    CHECK: '/favorites/check',
    CHECK_MULTIPLE: '/favorites/check-multiple',
    CLEAR: '/favorites/clear',
  },

};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  // Ecommerce routes
  SHOP: '/shop',
  PRODUCT_DETAIL: '/product/:slug',
  CATEGORY: '/category/:slug',
  CATEGORIES: '/categories',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/order/:orderNumber',
  WISHLIST: '/wishlist',
  SEARCH: '/search',
  COMPARE: '/compare',
  ABOUT: '/about',
  CONTACT: '/contact',
  // Admin routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_COUPONS: '/admin/coupons',
  ADMIN_BANNERS: '/admin/banners',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_STOCK_NOTIFICATIONS: '/admin/stock-notifications',
  ADMIN_QUESTIONS: '/admin/questions',
};

// Product Status
export const PRODUCT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SOLD: 'sold',
};

// Product Condition
export const PRODUCT_CONDITION = {
  NEW: 'new',
  USED: 'used',
  REFURBISHED: 'refurbished',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Message Status
export const MESSAGE_STATUS = {
  UNREAD: false,
  READ: true,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 10,
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 2000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'dealistaan_auth_token',
  USER_DATA: 'dealistaan_user_data',
  ADMIN_TOKEN: 'dealistaan_admin_token',
  ADMIN_DATA: 'dealistaan_admin_data',
  THEME: 'dealistaan_theme',
  LANGUAGE: 'dealistaan_language',
  CART: 'dealistaan_cart',
  WISHLIST: 'dealistaan_wishlist',
};

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Logged in successfully!',
    REGISTER: 'Account created successfully!',
    LOGOUT: 'Logged out successfully!',
    PROFILE_UPDATE: 'Profile updated successfully!',
    PRODUCT_CREATE: 'Product created successfully!',
    PRODUCT_UPDATE: 'Product updated successfully!',
    PRODUCT_DELETE: 'Product deleted successfully!',
    MESSAGE_SEND: 'Message sent successfully!',
    MESSAGE_DELETE: 'Message deleted successfully!',
  },
  ERROR: {
    LOGIN: 'Login failed. Please check your credentials.',
    REGISTER: 'Registration failed. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
    UPLOAD: 'File upload failed. Please try again.',
    GENERIC: 'Something went wrong. Please try again.',
  },
  INFO: {
    LOADING: 'Loading...',
    SAVING: 'Saving...',
    DELETING: 'Deleting...',
    UPLOADING: 'Uploading...',
  },
};

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Language
export const LANGUAGE = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
};

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Query Keys for React Query
export const QUERY_KEYS = {
  USERS: 'users',
  USER_PROFILE: 'userProfile',
  PRODUCTS: 'products',
  PRODUCT_DETAIL: 'productDetail',
  CATEGORIES: 'categories',
  CATEGORY_DETAIL: 'categoryDetail',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  SEARCH: 'search',
  FAVORITES: 'favorites',
  FAVORITE_STATUS: 'favoriteStatus',
};
