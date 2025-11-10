import apiService from './api';
import { API_ENDPOINTS, API_CONFIG, STORAGE_KEYS } from '../constants';
import axios from 'axios';
import Cookies from 'js-cookie';

// Create a separate axios instance for admin routes (without /api prefix)
const adminApi = axios.create({
  baseURL: API_CONFIG.BASE_URL.replace('/api', '') || 'http://localhost:5000',
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor for admin API
adminApi.interceptors.request.use(
  (config) => {
    // Try to get token from admin auth storage (localStorage) first, then fallback to regular auth token
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN || 'dreamslife_admin_token') ||
                  localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || 
                  Cookies.get(STORAGE_KEYS.AUTH_TOKEN) ||
                  localStorage.getItem('admin_token') ||
                  Cookies.get('admin_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

class AdminService {
  // Get admin overview
  async getOverview() {
    try {
      const response = await adminApi.get(API_ENDPOINTS.ADMIN.OVERVIEW);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all investments with filters
  async getInvestments(status = null, page = 1, limit = 20) {
    try {
      let url = `${API_ENDPOINTS.ADMIN.INVESTMENTS}?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await adminApi.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Approve investment
  async approveInvestment(investmentId) {
    try {
      const response = await adminApi.patch(
        API_ENDPOINTS.ADMIN.APPROVE_INVESTMENT.replace(':id', investmentId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all withdrawals with filters
  async getWithdrawals(status = null, page = 1, limit = 20) {
    try {
      let url = `${API_ENDPOINTS.ADMIN.WITHDRAWALS}?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await adminApi.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Approve withdrawal
  async approveWithdrawal(withdrawalId, adminNote = '', receiptFile = null) {
    try {
      const formData = new FormData();
      formData.append('adminNote', adminNote || '');
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }
      
      const response = await adminApi.patch(
        API_ENDPOINTS.ADMIN.APPROVE_WITHDRAWAL.replace(':id', withdrawalId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Seed ranks
  async seedRanks() {
    try {
      const response = await adminApi.post(API_ENDPOINTS.ADMIN.SEED_RANKS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all users with filters
  async getUsers(page = 1, limit = 20, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        ...(filters.minInvestment !== undefined && { minInvestment: filters.minInvestment.toString() }),
        ...(filters.maxInvestment !== undefined && { maxInvestment: filters.maxInvestment.toString() }),
        ...(filters.minEarnings !== undefined && { minEarnings: filters.minEarnings.toString() }),
        ...(filters.maxEarnings !== undefined && { maxEarnings: filters.maxEarnings.toString() }),
      });
      const response = await adminApi.get(`${API_ENDPOINTS.ADMIN.GET_USERS}?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user earning details
  async getUserEarnings(userId, page = 1, limit = 20, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.type && { type: filters.type }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });
      const url = API_ENDPOINTS.ADMIN.GET_USER_EARNINGS.replace(':id', userId);
      const response = await adminApi.get(`${url}?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all plans
  async getPlans() {
    try {
      const response = await adminApi.get(API_ENDPOINTS.ADMIN.PLANS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create plan
  async createPlan(planData) {
    try {
      const response = await adminApi.post(API_ENDPOINTS.ADMIN.CREATE_PLAN, planData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update plan
  async updatePlan(planId, planData) {
    try {
      const response = await adminApi.put(
        API_ENDPOINTS.ADMIN.UPDATE_PLAN.replace(':id', planId),
        planData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete plan
  async deletePlan(planId) {
    try {
      const response = await adminApi.delete(
        API_ENDPOINTS.ADMIN.DELETE_PLAN.replace(':id', planId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all ranks
  async getRanks() {
    try {
      const response = await adminApi.get(API_ENDPOINTS.ADMIN.RANKS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create rank
  async createRank(rankData) {
    try {
      const response = await adminApi.post(API_ENDPOINTS.ADMIN.CREATE_RANK, rankData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update rank
  async updateRank(rankId, rankData) {
    try {
      const response = await adminApi.put(
        API_ENDPOINTS.ADMIN.UPDATE_RANK.replace(':id', rankId),
        rankData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete rank
  async deleteRank(rankId) {
    try {
      const response = await adminApi.delete(
        API_ENDPOINTS.ADMIN.DELETE_RANK.replace(':id', rankId)
      );
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
        type: status === 404 ? 'not_found' : status === 401 ? 'unauthorized' : status === 403 ? 'forbidden' : 'server',
        message: data?.message || 'An error occurred',
        status,
      };
    }
    return {
      type: 'network',
      message: 'Network error. Please check your connection.',
      status: 0,
    };
  }
}

const adminService = new AdminService();
export default adminService;

