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
  NAME: process.env.REACT_APP_NAME || 'Dreams Life Traders',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  DESCRIPTION:
    process.env.REACT_APP_DESCRIPTION ||
    'The World\'s Best Investment Opportunity',
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
    CREATE: '/products/add-product',
    LIST: '/products/',
    GET_BY_ID: '/products/get-product',
    GET_BY_SELLER: '/products/get-products-by-seller',
    UPDATE: '/products/update-product',
    DELETE: '/products/delete-product',
    SEARCH: '/products/search-products',
    MARK_SOLD: '/products/mark-sold',
  },

  // Category endpoints
  CATEGORIES: {
    CREATE: '/categories/add-category',
    LIST: '/categories/',
    GET_BY_ID: '/categories/get-category',
    UPDATE: '/categories/update-category',
    DELETE: '/categories/delete-category',
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

  // Investment endpoints
  INVESTMENT: {
    GET_PLANS: '/plans',
    CREATE_INVESTMENT: '/invest',
    MY_INVESTMENTS: '/my/investments',
    PAYMENT_ACCOUNTS: '/payment-accounts',
  },

  // Withdrawal endpoints
  WITHDRAWAL: {
    CREATE: '/withdraw',
    MY_WITHDRAWALS: '/my/withdrawals',
  },

  // Dashboard endpoints
  DASHBOARD: {
    SUMMARY: '/dashboard',
    EARNINGS: '/earnings',
    TEAM: '/team',
    REFERRAL_INFO: '/referral-info',
    DAILY_EARNINGS: '/daily-earnings',
  },

  // Admin endpoints
  ADMIN: {
    OVERVIEW: '/admin/overview',
    INVESTMENTS: '/admin/investments',
    APPROVE_INVESTMENT: '/admin/investments/:id/approve',
    REJECT_INVESTMENT: '/admin/investments/:id/reject',
    WITHDRAWALS: '/admin/withdrawals',
    APPROVE_WITHDRAWAL: '/admin/withdrawals/:id/approve',
    REJECT_WITHDRAWAL: '/admin/withdrawals/:id/reject',
    SEED_RANKS: '/admin/seed-ranks',
    GET_USERS: '/admin/users',
    GET_USER_EARNINGS: '/admin/users/:id/earnings',
    PLANS: '/admin/plans',
    CREATE_PLAN: '/admin/plans',
    UPDATE_PLAN: '/admin/plans/:id',
    DELETE_PLAN: '/admin/plans/:id',
    RANKS: '/admin/ranks',
    CREATE_RANK: '/admin/ranks',
    UPDATE_RANK: '/admin/ranks/:id',
    DELETE_RANK: '/admin/ranks/:id',
    PAYMENT_ACCOUNTS: '/admin/payment-accounts',
    CREATE_PAYMENT_ACCOUNT: '/admin/payment-accounts',
    UPDATE_PAYMENT_ACCOUNT: '/admin/payment-accounts/:id',
    DELETE_PAYMENT_ACCOUNT: '/admin/payment-accounts/:id',
  },
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  HOME_PAGE: '/home',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PLANS: '/plans',
  BUY_PLAN: '/buy-plan/:id',
  MY_INVESTMENTS: '/my-investments',
  WITHDRAW: '/withdraw',
  TEAM: '/team',
  PROFILE: '/profile',
  DAILY_EARNINGS: '/daily-earnings',
  SUPPORT: '/support',
  // Admin routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_INVESTMENTS: '/admin/investments',
  ADMIN_WITHDRAWALS: '/admin/withdrawals',
  ADMIN_SUPPORT: '/admin/support',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  PRODUCT_CREATE: '/products/create',
  PRODUCT_EDIT: '/products/:id/edit',
  CATEGORIES: '/categories',
  MESSAGES: '/messages',
  MESSAGE_DETAIL: '/messages/:id',
  FAVORITES: '/favorites',
  SEARCH: '/search',
  ABOUT: '/about',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  NOT_FOUND: '/404',
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
  AUTH_TOKEN: 'dreamslife_auth_token',
  USER_DATA: 'dreamslife_user_data',
  ADMIN_TOKEN: 'dreamslife_admin_token',
  ADMIN_DATA: 'dreamslife_admin_data',
  THEME: 'dreamslife_theme',
  LANGUAGE: 'dreamslife_language',
  CART: 'dreamslife_cart',
  WISHLIST: 'dreamslife_wishlist',
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
