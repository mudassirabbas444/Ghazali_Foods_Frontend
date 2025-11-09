import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class AdminService {
  // Get admin overview
  async getOverview() {
    try {
      const response = await apiService.get(API_ENDPOINTS.ADMIN.OVERVIEW);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all investments with filters
  async getInvestments(status = null, page = 1, limit = 20) {
    try {
      let url = `${API_ENDPOINTS.ADMIN.INVESTMENTS}?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Approve investment
  async approveInvestment(investmentId) {
    try {
      const response = await apiService.patch(
        API_ENDPOINTS.ADMIN.APPROVE_INVESTMENT.replace(':id', investmentId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all withdrawals with filters
  async getWithdrawals(status = null, page = 1, limit = 20) {
    try {
      let url = `${API_ENDPOINTS.ADMIN.WITHDRAWALS}?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Approve withdrawal
  async approveWithdrawal(withdrawalId, adminNote = '') {
    try {
      const response = await apiService.patch(
        API_ENDPOINTS.ADMIN.APPROVE_WITHDRAWAL.replace(':id', withdrawalId),
        { adminNote }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Seed ranks
  async seedRanks() {
    try {
      const response = await apiService.post(API_ENDPOINTS.ADMIN.SEED_RANKS);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const adminService = new AdminService();
export default adminService;

