import React, { useEffect, useCallback, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertCircle, Info, X, XCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserNotificationContainer = () => {
  const { notifications, removeNotification } = useApp();
  const [pausedNotifications, setPausedNotifications] = useState(new Set());

  // Filter user notifications (not admin-specific)
  const userNotifications = notifications.filter(
    (notif) => !notif.isAdmin || notif.isAdmin === false
  );

  const getIcon = (type) => {
    const iconClass = 'h-5 w-5';
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-orange-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-orange-800';
      default:
        return 'text-blue-800';
    }
  };

  const getProgressColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Auto-dismiss notifications
  useEffect(() => {
    const timers = userNotifications.map((notification) => {
      // Skip if paused or if it's an error with persist flag
      if (
        pausedNotifications.has(notification.id) ||
        (notification.type === 'error' && notification.persist)
      ) {
        return null;
      }

      const duration = notification.duration || (notification.type === 'error' ? 8000 : 5000);
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, duration);

      return { id: notification.id, timer };
    });

    return () => {
      timers.forEach((item) => {
        if (item) clearTimeout(item.timer);
      });
    };
  }, [userNotifications, pausedNotifications, removeNotification]);

  const handleClose = useCallback(
    (id) => {
      removeNotification(id);
      setPausedNotifications((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [removeNotification]
  );

  const handlePause = useCallback((id) => {
    setPausedNotifications((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleResume = useCallback((id) => {
    setPausedNotifications((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Show max 5 notifications at once
  const visibleNotifications = userNotifications.slice(-5);

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[10001] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification, index) => {
          const isPaused = pausedNotifications.has(notification.id);
          const duration = notification.duration || (notification.type === 'error' ? 8000 : 5000);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: index * 0.05,
              }}
              className={`pointer-events-auto ${getBgColor(notification.type)} border-l-4 rounded-lg shadow-lg overflow-hidden`}
              onMouseEnter={() => handlePause(notification.id)}
              onMouseLeave={() => handleResume(notification.id)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {notification.title && (
                      <h4
                        className={`text-sm font-semibold ${getTextColor(notification.type)} mb-1`}
                      >
                        {notification.title}
                      </h4>
                    )}
                    {notification.message && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {notification.message}
                      </p>
                    )}

                    {/* Action Buttons */}
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {notification.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (action.onClick) {
                                action.onClick();
                              }
                              if (action.dismiss !== false) {
                                handleClose(notification.id);
                              }
                            }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                              action.primary
                                ? `${getTextColor(notification.type)} bg-white hover:bg-gray-100`
                                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => handleClose(notification.id)}
                    className="flex-shrink-0 p-1 rounded-md hover:bg-white/50 transition-colors"
                    aria-label="Close notification"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {!isPaused && !notification.persist && (
                <motion.div
                  className={`h-1 ${getProgressColor(notification.type)}`}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: duration / 1000, ease: 'linear' }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default UserNotificationContainer;

