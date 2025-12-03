import { useApp } from '../context/AppContext';

// Create a toast utility that uses the custom notification system
let appContextRef = null;

export const setAppContext = (context) => {
  appContextRef = context;
};

export const toast = {
  success: (message, title = 'Success') => {
    if (appContextRef?.addNotification) {
      appContextRef.addNotification({
        type: 'success',
        title,
        message,
      });
    } else {
      console.warn('AppContext not available for toast');
    }
  },

  error: (message, title = 'Error') => {
    if (appContextRef?.addNotification) {
      appContextRef.addNotification({
        type: 'error',
        title,
        message,
      });
    } else {
      console.warn('AppContext not available for toast');
    }
  },

  warning: (message, title = 'Warning') => {
    if (appContextRef?.addNotification) {
      appContextRef.addNotification({
        type: 'warning',
        title,
        message,
      });
    } else {
      console.warn('AppContext not available for toast');
    }
  },

  info: (message, title = 'Info') => {
    if (appContextRef?.addNotification) {
      appContextRef.addNotification({
        type: 'info',
        title,
        message,
      });
    } else {
      console.warn('AppContext not available for toast');
    }
  },
};

export default toast;

