// Custom toast service that uses AppContext
// This should be used instead of react-toastify's toast

let appContextRef = null;

export const setAppContext = (context) => {
  appContextRef = context;
};

const toast = {
  success: (message, title = 'Success') => {
    if (appContextRef?.addNotification) {
      appContextRef.addNotification({
        type: 'success',
        title,
        message: typeof message === 'string' ? message : message.toString(),
      });
    } else {
      console.warn('AppContext not available for toast');
      // Fallback to console
      console.log('✅', title, ':', message);
    }
  },

  error: (message, title = 'Error') => {
    if (appContextRef?.addNotification) {
      appContextRef.addNotification({
        type: 'error',
        title,
        message: typeof message === 'string' ? message : message.toString(),
      });
    } else {
      console.warn('AppContext not available for toast');
      console.error('❌', title, ':', message);
    }
  },

  warning: (message, title = 'Warning') => {
    if (appContextRef?.addNotification) {
      appContextRef.addNotification({
        type: 'warning',
        title,
        message: typeof message === 'string' ? message : message.toString(),
      });
    } else {
      console.warn('AppContext not available for toast');
      console.warn('⚠️', title, ':', message);
    }
  },

  info: (message, title = 'Info') => {
    if (appContextRef?.addNotification) {
      appContextRef.addNotification({
        type: 'info',
        title,
        message: typeof message === 'string' ? message : message.toString(),
      });
    } else {
      console.warn('AppContext not available for toast');
      console.info('ℹ️', title, ':', message);
    }
  },
};

export default toast;

