import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class BannerService {
  // Get all banners
  async getBanners(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.position) params.append('position', filters.position);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);

      const queryString = params.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.BANNERS.GET}?${queryString}`
        : API_ENDPOINTS.BANNERS.GET;

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get banner by ID
  async getBannerById(bannerId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.BANNERS.GET_BY_ID.replace(':id', bannerId));
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const bannerService = new BannerService();
export default bannerService;

