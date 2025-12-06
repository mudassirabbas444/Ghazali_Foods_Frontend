import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class NotificationService {
  // Create a notification
  async createNotification(notificationData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.NOTIFICATIONS.CREATE, notificationData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.read !== undefined) params.append('read', filters.read);
      if (filters.isAdmin !== undefined) params.append('isAdmin', filters.isAdmin);
      if (filters.type) params.append('type', filters.type);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.category) params.append('category', filters.category);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.skip) params.append('skip', filters.skip);

      const queryString = params.toString();
      const url = queryString
        ? `${API_ENDPOINTS.NOTIFICATIONS.GET_USER_NOTIFICATIONS}?${queryString}`
        : API_ENDPOINTS.NOTIFICATIONS.GET_USER_NOTIFICATIONS;

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get unread count
  async getUnreadCount(isAdmin = false) {
    try {
      const url = `${API_ENDPOINTS.NOTIFICATIONS.GET_UNREAD_COUNT}?isAdmin=${isAdmin}`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ.replace(':id', notificationId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(isAdmin = false) {
    try {
      const response = await apiService.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ, {
        isAdmin,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update notification
  async updateNotification(notificationId, updateData) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.NOTIFICATIONS.UPDATE.replace(':id', notificationId),
        updateData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await apiService.delete(
        API_ENDPOINTS.NOTIFICATIONS.DELETE.replace(':id', notificationId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete all notifications
  async deleteAllNotifications(isAdmin = false) {
    try {
      const params = new URLSearchParams();
      if (isAdmin) params.append('isAdmin', 'true');
      const queryString = params.toString();
      const url = queryString
        ? `${API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL}?${queryString}`
        : API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL;

      const response = await apiService.delete(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete read notifications
  async deleteReadNotifications(isAdmin = false) {
    try {
      const params = new URLSearchParams();
      if (isAdmin) params.append('isAdmin', 'true');
      const queryString = params.toString();
      const url = queryString
        ? `${API_ENDPOINTS.NOTIFICATIONS.DELETE_READ}?${queryString}`
        : API_ENDPOINTS.NOTIFICATIONS.DELETE_READ;

      const response = await apiService.delete(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Get all notifications
  async getAllNotifications(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.user) params.append('user', filters.user);
      if (filters.read !== undefined) params.append('read', filters.read);
      if (filters.isAdmin !== undefined) params.append('isAdmin', filters.isAdmin);
      if (filters.type) params.append('type', filters.type);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.category) params.append('category', filters.category);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.skip) params.append('skip', filters.skip);

      const queryString = params.toString();
      const url = queryString
        ? `${API_ENDPOINTS.NOTIFICATIONS.GET_ALL}?${queryString}`
        : API_ENDPOINTS.NOTIFICATIONS.GET_ALL;

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Create bulk notifications
  async createBulkNotifications(notifications) {
    try {
      const response = await apiService.post(API_ENDPOINTS.NOTIFICATIONS.CREATE_BULK, {
        notifications,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Cleanup expired notifications
  async cleanupExpiredNotifications() {
    try {
      const response = await apiService.post(API_ENDPOINTS.NOTIFICATIONS.CLEANUP);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;

