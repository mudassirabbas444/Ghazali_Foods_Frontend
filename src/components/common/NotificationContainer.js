import React, { useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertCircle, Info, X, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast as reactToastify } from 'react-toastify';

const NotificationContainer = () => {
  const { notifications, removeNotification, addNotification } = useApp();

  // Intercept react-toastify calls and convert to AppContext notifications
  useEffect(() => {
    // Override react-toastify's toast methods
    const originalSuccess = reactToastify.success;
    const originalError = reactToastify.error;
    const originalInfo = reactToastify.info;
    const originalWarning = reactToastify.warning;

    reactToastify.success = (message, options = {}) => {
      addNotification({
        type: 'success',
        title: options.title || 'Success',
        message: typeof message === 'string' ? message : message.toString(),
      });
      // Don't call original to prevent double notifications
      return { id: Date.now() };
    };

    reactToastify.error = (message, options = {}) => {
      addNotification({
        type: 'error',
        title: options.title || 'Error',
        message: typeof message === 'string' ? message : message.toString(),
      });
      // Don't call original to prevent double notifications
      return { id: Date.now() };
    };

    reactToastify.info = (message, options = {}) => {
      addNotification({
        type: 'info',
        title: options.title || 'Info',
        message: typeof message === 'string' ? message : message.toString(),
      });
      // Don't call original to prevent double notifications
      return { id: Date.now() };
    };

    reactToastify.warning = (message, options = {}) => {
      addNotification({
        type: 'warning',
        title: options.title || 'Warning',
        message: typeof message === 'string' ? message : message.toString(),
      });
      // Don't call original to prevent double notifications
      return { id: Date.now() };
    };

    return () => {
      // Restore original methods on unmount
      reactToastify.success = originalSuccess;
      reactToastify.error = originalError;
      reactToastify.info = originalInfo;
      reactToastify.warning = originalWarning;
    };
  }, [addNotification]);

  const getIcon = (type) => {
    const iconClass = 'h-10 w-10';
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-green-500`} />;
      default:
        return <Info className={`${iconClass} text-green-500`} />;
    }
  };

  const getTitleColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-green-600';
      default:
        return 'text-green-600';
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-300';
      case 'error':
        return 'border-red-300';
      case 'warning':
        return 'border-green-300';
      default:
        return 'border-green-300';
    }
  };

  // Auto-dismiss notifications after 5 seconds (except errors)
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      if (latestNotification.type !== 'error') {
        const timer = setTimeout(() => {
          if (removeNotification) {
            removeNotification(latestNotification.id);
          }
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications, removeNotification]);

  // Handler to close notification
  const handleClose = useCallback((e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      if (removeNotification && latestNotification?.id) {
        removeNotification(latestNotification.id);
      }
    }
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  // Show only the latest notification
  const latestNotification = notifications[notifications.length - 1];

  if (!latestNotification || !latestNotification.id) return null;

  return (
    <AnimatePresence mode="wait">
      {latestNotification && (
        <>
          {/* Backdrop */}
          <motion.div
            key={`backdrop-${latestNotification.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />

          {/* Popup */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key={`popup-${latestNotification.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
              className={`bg-white rounded-3xl shadow-2xl border-2 ${getBorderColor(latestNotification.type)} max-w-lg w-full pointer-events-auto overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(latestNotification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {latestNotification.title && (
                      <h3 className={`text-2xl font-bold ${getTitleColor(latestNotification.type)} mb-3`}>
                        {latestNotification.title}
                      </h3>
                    )}

                    {latestNotification.message && (
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {latestNotification.message}
                      </p>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-shrink-0 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 -mt-1 -mr-1"
                    aria-label="Close notification"
                  >
                    <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>

                {/* Action Button (Optional) */}
                {latestNotification.action ? (
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e?.stopPropagation?.();
                        e?.preventDefault?.();
                        // Close first to prevent any action from triggering new notifications
                        handleClose(e);
                        // Then execute action if provided
                        if (latestNotification.action?.onClick) {
                          setTimeout(() => {
                            latestNotification.action.onClick();
                          }, 100);
                        }
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {latestNotification.action.label || 'OK'}
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg text-base"
                    >
                      OK
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationContainer;
