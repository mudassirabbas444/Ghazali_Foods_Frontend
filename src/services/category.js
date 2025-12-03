import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class CategoryService {
  // Get all categories
  async getCategories(includeSubcategories = true) {
    try {
      const params = new URLSearchParams();
      if (includeSubcategories) params.append('includeSubcategories', 'true');
      
      const queryString = params.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.CATEGORIES.LIST}?${queryString}`
        : API_ENDPOINTS.CATEGORIES.LIST;

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(categoryId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.CATEGORIES.GET_BY_ID.replace(':id', categoryId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug) {
    try {
      const response = await apiService.get(API_ENDPOINTS.CATEGORIES.GET_BY_SLUG.replace(':slug', slug));
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const categoryService = new CategoryService();
export default categoryService;

