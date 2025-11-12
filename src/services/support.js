import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class SupportService {
  // Create support ticket
  async createSupport(subject, message) {
    try {
      if (!subject || !message) {
        throw new Error('Subject and message are required');
      }

      const response = await apiService.post('/support', {
        subject,
        message
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user's support tickets
  async getMySupport(page = 1, limit = 20, status = null) {
    try {
      let url = `/support/my?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get support ticket by ID
  async getSupportById(id) {
    try {
      const response = await apiService.get(`/support/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Get all support tickets
  async getAllSupport(page = 1, limit = 20, status = null, userId = null, search = null) {
    try {
      let url = `/support?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      if (userId) url += `&userId=${userId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Respond to support ticket
  async respondToSupport(id, adminResponse, status = null) {
    try {
      const response = await apiService.post(`/support/${id}/respond`, {
        adminResponse,
        status
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Update support ticket status
  async updateSupportStatus(id, status) {
    try {
      const response = await apiService.patch(`/support/${id}/status`, {
        status
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Delete support ticket
  async deleteSupport(id) {
    try {
      const response = await apiService.delete(`/support/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Get support statistics
  async getSupportStats() {
    try {
      const response = await apiService.get('/support/admin/stats');
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Create and export support service instance
const supportService = new SupportService();
export default supportService;

