import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class BlogService {
  // Get all blogs
  async getBlogs(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.isPublished !== undefined) params.append('isPublished', filters.isPublished);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const queryString = params.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.BLOGS.GET}?${queryString}`
        : API_ENDPOINTS.BLOGS.GET;

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get blog by ID
  async getBlogById(blogId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.BLOGS.GET_BY_ID.replace(':id', blogId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get blog by slug
  async getBlogBySlug(slug) {
    try {
      const response = await apiService.get(API_ENDPOINTS.BLOGS.GET_BY_SLUG.replace(':slug', slug));
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const blogService = new BlogService();
export default blogService;

