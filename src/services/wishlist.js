import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class WishlistService {
  // Get wishlist
  async getWishlist() {
    try {
      const response = await apiService.get(API_ENDPOINTS.WISHLIST.GET);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add to wishlist
  async addToWishlist(productId) {
    try {
      const response = await apiService.post(API_ENDPOINTS.WISHLIST.ADD, {
        productId,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Remove from wishlist
  async removeFromWishlist(productId) {
    try {
      const response = await apiService.delete(
        API_ENDPOINTS.WISHLIST.REMOVE.replace(':productId', productId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Check if product is in wishlist
  async checkWishlist(productId) {
    try {
      const response = await apiService.get(
        API_ENDPOINTS.WISHLIST.CHECK.replace(':productId', productId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const wishlistService = new WishlistService();
export default wishlistService;

