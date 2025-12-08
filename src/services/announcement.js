import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class AnnouncementService {
  // Get all announcements
  async getAnnouncements(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);

      const queryString = params.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.ANNOUNCEMENTS.GET}?${queryString}`
        : API_ENDPOINTS.ANNOUNCEMENTS.GET;

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get announcement by ID
  async getAnnouncementById(announcementId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.ANNOUNCEMENTS.GET_BY_ID.replace(':id', announcementId));
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const announcementService = new AnnouncementService();
export default announcementService;

