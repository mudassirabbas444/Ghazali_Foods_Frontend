import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class DashboardService {
  // Get dashboard summary
  async getDashboard() {
    try {
      const response = await apiService.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get earnings (paginated)
  async getEarnings(page = 1, limit = 20, type = null) {
    try {
      let url = `${API_ENDPOINTS.DASHBOARD.EARNINGS}?page=${page}&limit=${limit}`;
      if (type) {
        url += `&type=${type}`;
      }
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get team data (4 levels)
  async getTeam() {
    try {
      const response = await apiService.get(API_ENDPOINTS.DASHBOARD.TEAM);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get referral code and link
  async getReferralInfo() {
    try {
      const response = await apiService.get(API_ENDPOINTS.DASHBOARD.REFERRAL_INFO);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get daily earnings records
  async getDailyEarnings(startDate = null, endDate = null) {
    try {
      let url = API_ENDPOINTS.DASHBOARD.DAILY_EARNINGS;
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;

