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
}

const dashboardService = new DashboardService();
export default dashboardService;

