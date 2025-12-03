import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class StockNotificationService {
  // Subscribe to stock notifications
  async subscribe(productId, email, variant = null) {
    try {
      const response = await apiService.post(API_ENDPOINTS.STOCK_NOTIFICATIONS.SUBSCRIBE, {
        productId,
        email,
        variant,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user's stock notifications
  async getMyNotifications() {
    try {
      const response = await apiService.get(API_ENDPOINTS.STOCK_NOTIFICATIONS.GET_MY_NOTIFICATIONS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Unsubscribe from stock notifications
  async unsubscribe(notificationId) {
    try {
      const response = await apiService.delete(
        API_ENDPOINTS.STOCK_NOTIFICATIONS.UNSUBSCRIBE.replace(':id', notificationId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const stockNotificationService = new StockNotificationService();
export default stockNotificationService;

