import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle, AlertCircle, Info, X, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserNotificationBell = () => {
  const { notifications, removeNotification } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Filter user notifications (not admin-specific)
  const userNotifications = notifications.filter(
    (notif) => !notif.isAdmin || notif.isAdmin === false
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    const iconClass = 'h-5 w-5';
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-600`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-orange-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
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

  const handleClose = (id) => {
    removeNotification(id);
  };

  const handleClearAll = () => {
    userNotifications.forEach((notif) => {
      removeNotification(notif.id);
    });
  };

  // Show max 10 notifications in dropdown
  const visibleNotifications = userNotifications.slice(-10).reverse();

  // Always show the bell icon, even if there are no notifications

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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

            {/* Panel - Positioned below header */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-4 top-20 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-[10001] flex flex-col"
              style={{
                maxHeight: 'calc(100vh - 6rem)',
                top: '5rem' // 64px header + 16px spacing
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {userNotifications.length > 0 && (
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
                {visibleNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {visibleNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getBgColor(
                          notification.type
                        )}`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              {notification.title && (
                                <h4
                                  className={`text-sm font-semibold ${getTextColor(
                                    notification.type
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
                                        ? 'bg-orange-600 text-white hover:bg-orange-700'
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
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserNotificationBell;

