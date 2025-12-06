/**
 * Notification utility functions for easy notification creation
 * Usage:
 *   import { notify } from '../utils/notifications';
 *   import { useApp } from '../context/AppContext';
 *   
 *   const { addNotification } = useApp();
 *   notify.success(addNotification, 'Product created successfully!');
 *   notify.error(addNotification, 'Failed to save', { priority: 'critical' });
 */

export const notify = {
  // User notifications
  success: (addNotification, message, options = {}) => {
    addNotification({
      type: 'success',
      title: options.title || 'Success',
      message,
      isAdmin: options.isAdmin || false,
      priority: options.priority || 'normal',
      duration: options.duration || 5000,
      actions: options.actions || [],
      category: options.category || null,
    });
  },

  error: (addNotification, message, options = {}) => {
    addNotification({
      type: 'error',
      title: options.title || 'Error',
      message,
      isAdmin: options.isAdmin || false,
      priority: options.priority || 'high',
      duration: options.duration || 8000,
      persist: options.persist || false,
      actions: options.actions || [],
      category: options.category || null,
    });
  },

  warning: (addNotification, message, options = {}) => {
    addNotification({
      type: 'warning',
      title: options.title || 'Warning',
      message,
      isAdmin: options.isAdmin || false,
      priority: options.priority || 'high',
      duration: options.duration || 6000,
      actions: options.actions || [],
      category: options.category || null,
    });
  },

  info: (addNotification, message, options = {}) => {
    addNotification({
      type: 'info',
      title: options.title || 'Info',
      message,
      isAdmin: options.isAdmin || false,
      priority: options.priority || 'normal',
      duration: options.duration || 5000,
      actions: options.actions || [],
      category: options.category || null,
    });
  },

  // Admin-specific notifications
  admin: {
    success: (addNotification, message, options = {}) => {
      addNotification({
        type: 'success',
        title: options.title || 'Success',
        message,
        isAdmin: true,
        priority: options.priority || 'normal',
        duration: options.duration || 5000,
        actions: options.actions || [],
        category: options.category || null,
      });
    },

    error: (addNotification, message, options = {}) => {
      addNotification({
        type: 'error',
        title: options.title || 'Error',
        message,
        isAdmin: true,
        priority: options.priority || 'critical',
        duration: options.duration || 10000,
        persist: options.persist || false,
        actions: options.actions || [],
        category: options.category || null,
      });
    },

    warning: (addNotification, message, options = {}) => {
      addNotification({
        type: 'warning',
        title: options.title || 'Warning',
        message,
        isAdmin: true,
        priority: options.priority || 'high',
        duration: options.duration || 8000,
        actions: options.actions || [],
        category: options.category || null,
      });
    },

    info: (addNotification, message, options = {}) => {
      addNotification({
        type: 'info',
        title: options.title || 'Info',
        message,
        isAdmin: true,
        priority: options.priority || 'normal',
        duration: options.duration || 6000,
        actions: options.actions || [],
        category: options.category || null,
      });
    },

    // Critical admin notifications
    critical: (addNotification, message, options = {}) => {
      addNotification({
        type: 'error',
        title: options.title || 'Critical Alert',
        message,
        isAdmin: true,
        priority: 'critical',
        persist: true, // Critical notifications don't auto-dismiss
        duration: 0, // No auto-dismiss
        actions: options.actions || [],
        category: options.category || 'System',
      });
    },
  },
};

export default notify;

