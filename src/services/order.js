import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class OrderService {
  // Create order
  async createOrder(orderData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.ORDERS.GET.replace(':id', orderId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order by order number
  async getOrderByNumber(orderNumber) {
    try {
      const response = await apiService.get(
        API_ENDPOINTS.ORDERS.GET_BY_NUMBER.replace(':orderNumber', orderNumber)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get my orders
  async getMyOrders(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const queryString = params.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.ORDERS.GET_MY_ORDERS}?${queryString}`
        : API_ENDPOINTS.ORDERS.GET_MY_ORDERS;

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason) {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.ORDERS.CANCEL.replace(':id', orderId),
        { reason }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const orderService = new OrderService();
export default orderService;

