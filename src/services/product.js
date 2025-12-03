import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class ProductService {
  // Get all products with filters
  async getProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.subCategory) params.append('subCategory', filters.subCategory);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.isFeatured) params.append('isFeatured', filters.isFeatured);
      if (filters.isBestSeller) params.append('isBestSeller', filters.isBestSeller);
      if (filters.isNewArrival) params.append('isNewArrival', filters.isNewArrival);
      
      // Advanced filters
      if (filters.categories && Array.isArray(filters.categories) && filters.categories.length > 0) {
        filters.categories.forEach(cat => params.append('categories', cat));
      }
      if (filters.brands && Array.isArray(filters.brands) && filters.brands.length > 0) {
        filters.brands.forEach(brand => params.append('brands', brand));
      }
      if (filters.inStock) params.append('inStock', 'true');
      if (filters.onSale) params.append('onSale', 'true');
      if (filters.minRating) params.append('minRating', filters.minRating);

      const queryString = params.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.PRODUCTS.LIST}?${queryString}`
        : API_ENDPOINTS.PRODUCTS.LIST;

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get product by ID
  async getProductById(productId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID.replace(':id', productId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get product by slug
  async getProductBySlug(slug) {
    try {
      const response = await apiService.get(API_ENDPOINTS.PRODUCTS.GET_BY_SLUG.replace(':slug', slug));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      const response = await apiService.get(API_ENDPOINTS.PRODUCTS.GET_FEATURED);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get best sellers
  async getBestSellers() {
    try {
      const response = await apiService.get(API_ENDPOINTS.PRODUCTS.GET_BEST_SELLERS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get new arrivals
  async getNewArrivals() {
    try {
      const response = await apiService.get(API_ENDPOINTS.PRODUCTS.GET_NEW_ARRIVALS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Search products
  async searchProducts(query, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('search', query);
      
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await apiService.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}?${params.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const productService = new ProductService();
export default productService;

