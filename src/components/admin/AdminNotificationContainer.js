import React, { useEffect, useCallback, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  XCircle,
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNotificationContainer = () => {
  const { notifications, removeNotification } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [pausedNotifications, setPausedNotifications] = useState(new Set());

  // Filter admin notifications
  const adminNotifications = notifications.filter((notif) => notif.isAdmin === true);

  // Group notifications by priority
  const groupedNotifications = {
    critical: adminNotifications.filter((n) => n.priority === 'critical' || n.type === 'error'),
    high: adminNotifications.filter((n) => n.priority === 'high' || n.type === 'warning'),
    normal: adminNotifications.filter(
      (n) => !n.priority || (n.priority !== 'critical' && n.priority !== 'high')
    ),
  };

  const totalCount = adminNotifications.length;
  const unreadCount = adminNotifications.filter((n) => !n.read).length;

  const getIcon = (type, priority) => {
    const iconClass = 'h-5 w-5';
    if (priority === 'critical') {
      return <AlertTriangle className={`${iconClass} text-red-600`} />;
    }
    switch (type) {
      case 'success':
        return <CheckCircle2 className={`${iconClass} text-green-600`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-600`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-orange-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  const getBgColor = (type, priority) => {
    if (priority === 'critical') return 'bg-red-50 border-red-300';
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

  const getTextColor = (type, priority) => {
    if (priority === 'critical') return 'text-red-900';
    switch (type) {
      case 'success':
        return 'text-green-900';
      case 'error':
        return 'text-red-900';
      case 'warning':
        return 'text-orange-900';
      default:
        return 'text-blue-900';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

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

  const handleClearAll = useCallback(() => {
    adminNotifications.forEach((notif) => {
      removeNotification(notif.id);
    });
  }, [adminNotifications, removeNotification]);

  // Auto-dismiss notifications (except critical)
  useEffect(() => {
    const timers = adminNotifications.map((notification) => {
      if (
        pausedNotifications.has(notification.id) ||
        notification.priority === 'critical' ||
        (notification.type === 'error' && notification.persist)
      ) {
        return null;
      }

      const duration = notification.duration || (notification.type === 'error' ? 10000 : 6000);
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
  }, [adminNotifications, pausedNotifications, removeNotification]);

  // Always show the bell icon, even if there are no notifications

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-[10000]"
                onClick={() => setIsOpen(false)}
              />

              {/* Panel */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-[10001] max-h-[600px] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {totalCount > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-lg hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                  {totalCount === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {/* Critical Notifications */}
                      {groupedNotifications.critical.length > 0 && (
                        <div>
                          <div className="px-4 py-2 bg-red-50 border-b border-red-100">
                            <p className="text-xs font-semibold text-red-700">CRITICAL</p>
                          </div>
                          {groupedNotifications.critical.map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              getIcon={getIcon}
                              getBgColor={getBgColor}
                              getTextColor={getTextColor}
                              formatTime={formatTime}
                              handleClose={handleClose}
                              handlePause={handlePause}
                              handleResume={handleResume}
                              isPaused={pausedNotifications.has(notification.id)}
                            />
                          ))}
                        </div>
                      )}

                      {/* High Priority Notifications */}
                      {groupedNotifications.high.length > 0 && (
                        <div>
                          {groupedNotifications.critical.length > 0 && (
                            <div className="px-4 py-2 bg-orange-50 border-b border-orange-100">
                              <p className="text-xs font-semibold text-orange-700">HIGH PRIORITY</p>
                            </div>
                          )}
                          {groupedNotifications.high.map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              getIcon={getIcon}
                              getBgColor={getBgColor}
                              getTextColor={getTextColor}
                              formatTime={formatTime}
                              handleClose={handleClose}
                              handlePause={handlePause}
                              handleResume={handleResume}
                              isPaused={pausedNotifications.has(notification.id)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Normal Notifications */}
                      {groupedNotifications.normal.length > 0 && (
                        <div>
                          {(groupedNotifications.critical.length > 0 ||
                            groupedNotifications.high.length > 0) && (
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                              <p className="text-xs font-semibold text-gray-700">OTHER</p>
                            </div>
                          )}
                          {groupedNotifications.normal.map((notification) => (
                            <NotificationItem
                              key={notification.id}
                              notification={notification}
                              getIcon={getIcon}
                              getBgColor={getBgColor}
                              getTextColor={getTextColor}
                              formatTime={formatTime}
                              handleClose={handleClose}
                              handlePause={handlePause}
                              handleResume={handleResume}
                              isPaused={pausedNotifications.has(notification.id)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Notification Item Component
const NotificationItem = ({
  notification,
  getIcon,
  getBgColor,
  getTextColor,
  formatTime,
  handleClose,
  handlePause,
  handleResume,
  isPaused,
}) => {
  const duration = notification.duration || (notification.type === 'error' ? 10000 : 6000);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getBgColor(
        notification.type,
        notification.priority
      )}`}
      onMouseEnter={() => handlePause(notification.id)}
      onMouseLeave={() => handleResume(notification.id)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(notification.type, notification.priority)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            {notification.title && (
              <h4
                className={`text-sm font-semibold ${getTextColor(
                  notification.type,
                  notification.priority
                )}`}
              >
                {notification.title}
              </h4>
            )}
            <button
              onClick={() => handleClose(notification.id)}
              className="flex-shrink-0 p-0.5 rounded hover:bg-gray-200 transition-colors"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          </div>

          {notification.message && (
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              {notification.message}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(notification.timestamp)}
            </span>
            {notification.category && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {notification.category}
              </span>
            )}
          </div>

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
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!isPaused && !notification.persist && notification.priority !== 'critical' && (
        <motion.div
          className="h-0.5 bg-gray-200 mt-2"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

export default AdminNotificationContainer;

