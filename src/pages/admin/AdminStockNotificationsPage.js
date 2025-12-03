import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  Mail,
  Package,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import adminService from '../../services/admin';
import { toast } from 'react-toastify';
import FirebaseImage from '../../components/FirebaseImage';

const AdminStockNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterNotified, setFilterNotified] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, [filterNotified, searchQuery]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const filters = {
        isNotified: filterNotified === 'all' ? undefined : filterNotified === 'notified',
      };
      const response = await adminService.getAllStockNotifications(filters);
      if (response.success) {
        let filtered = response.data || response.notifications || [];
        if (searchQuery) {
          filtered = filtered.filter(notif =>
            notif.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notif.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setNotifications(filtered);
      }
    } catch (error) {
      toast.error('Failed to load stock notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    try {
      await adminService.deleteStockNotification(notificationId);
      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch (error) {
      toast.error(error.message || 'Failed to delete notification');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Notifications</h1>
        <p className="text-gray-600 mt-1">Manage stock notification subscriptions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={filterNotified}
            onChange={(e) => setFilterNotified(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Notifications</option>
            <option value="pending">Pending</option>
            <option value="notified">Notified</option>
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No stock notifications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Variant</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subscribed</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {notification.product?.thumbnail && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <FirebaseImage
                              src={notification.product.thumbnail}
                              alt={notification.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {notification.product?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {notification.user?.fullName || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {notification.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {notification.variant || 'Default'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          notification.isNotified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {notification.isNotified ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Notified
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStockNotificationsPage;

