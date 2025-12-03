import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class CartService {
  // Get cart
  async getCart() {
    try {
      const response = await apiService.get(API_ENDPOINTS.CART.GET);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add to cart
  async addToCart(productId, variant, quantity) {
    try {
      const response = await apiService.post(API_ENDPOINTS.CART.ADD, {
        productId,
        variant,
        quantity,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update cart item
  async updateCartItem(itemId, quantity) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.CART.UPDATE_ITEM.replace(':itemId', itemId),
        { quantity }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Remove from cart
  async removeFromCart(itemId) {
    try {
      const response = await apiService.delete(
        API_ENDPOINTS.CART.REMOVE_ITEM.replace(':itemId', itemId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Clear cart
  async clearCart() {
    try {
      const response = await apiService.delete(API_ENDPOINTS.CART.CLEAR);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Apply coupon
  async applyCoupon(couponCode) {
    try {
      const response = await apiService.post(API_ENDPOINTS.CART.APPLY_COUPON, {
        code: couponCode,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Remove coupon
  async removeCoupon() {
    try {
      const response = await apiService.delete(API_ENDPOINTS.CART.REMOVE_COUPON);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const cartService = new CartService();
export default cartService;

