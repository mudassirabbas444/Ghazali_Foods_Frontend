import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class CouponService {
  // Get all public coupons
  async getCoupons() {
    try {
      const response = await apiService.get(API_ENDPOINTS.COUPONS.GET);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get coupon by ID
  async getCouponById(couponId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.COUPONS.GET_BY_ID.replace(':id', couponId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Validate coupon
  async validateCoupon(couponCode, cartTotal) {
    try {
      const response = await apiService.post(API_ENDPOINTS.COUPONS.VALIDATE, {
        code: couponCode,
        cartTotal,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const couponService = new CouponService();
export default couponService;

