import apiService from './api';
import { API_ENDPOINTS, API_CONFIG, STORAGE_KEYS } from '../constants';
import axios from 'axios';
import Cookies from 'js-cookie';

// Create admin API instance for admin support operations
const adminApi = axios.create({
  baseURL: API_CONFIG.BASE_URL || 'http://localhost:5000/api',
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor for admin API
adminApi.interceptors.request.use(
  (config) => {
    // Try to get token from admin auth storage (localStorage) first, then fallback to regular auth token
    const adminTokenKey = STORAGE_KEYS.ADMIN_TOKEN || 'dreamslife_admin_token';
    const token = localStorage.getItem(adminTokenKey) ||
                  localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || 
                  Cookies.get(STORAGE_KEYS.AUTH_TOKEN) ||
                  localStorage.getItem('admin_token') ||
                  Cookies.get('admin_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No auth token found for admin API request');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for admin API
adminApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

class SupportService {
  // Create support ticket (user operation)
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

  // Get user's support tickets (user operation)
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

  // Get support ticket by ID (user operation)
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

      const response = await adminApi.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admin: Respond to support ticket
  async respondToSupport(id, adminResponse, status = null) {
    try {
      const response = await adminApi.post(`/support/${id}/respond`, {
        adminResponse,
        status
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admin: Update support ticket status
  async updateSupportStatus(id, status) {
    try {
      const response = await adminApi.patch(`/support/${id}/status`, {
        status
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admin: Delete support ticket
  async deleteSupport(id) {
    try {
      const response = await adminApi.delete(`/support/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admin: Get support statistics
  async getSupportStats() {
    try {
      const response = await adminApi.get('/support/admin/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    const { response } = error;

    if (response) {
      const { status, data } = response;
      return {
        type: status === 403 ? 'forbidden' : status === 401 ? 'unauthorized' : 'error',
        message: data?.message || 'An error occurred',
        status,
        response: { data }
      };
    } else if (error.request) {
      return {
        type: 'network',
        message: 'Network error. Please check your connection.',
        status: 0,
      };
    } else {
      return {
        type: 'unknown',
        message: error.message || 'An unexpected error occurred',
        status: 0,
      };
    }
  }
}

// Create and export support service instance
const supportService = new SupportService();
export default supportService;

