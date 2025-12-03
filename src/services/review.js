import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class ReviewService {
  // Get reviews by product
  async getReviewsByProduct(productId, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.rating) params.append('rating', filters.rating);

      const queryString = params.toString();
      const url = queryString
        ? `${API_ENDPOINTS.REVIEWS.GET_BY_PRODUCT.replace(':productId', productId)}?${queryString}`
        : API_ENDPOINTS.REVIEWS.GET_BY_PRODUCT.replace(':productId', productId);

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get my reviews
  async getMyReviews() {
    try {
      const response = await apiService.get(API_ENDPOINTS.REVIEWS.GET_MY_REVIEWS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create review
  async createReview(reviewData) {
    try {
      const response = await apiService.upload(API_ENDPOINTS.REVIEWS.CREATE, reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update review
  async updateReview(reviewId, reviewData) {
    try {
      const response = await apiService.upload(
        API_ENDPOINTS.REVIEWS.UPDATE.replace(':id', reviewId),
        reviewData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete review
  async deleteReview(reviewId) {
    try {
      const response = await apiService.delete(
        API_ENDPOINTS.REVIEWS.DELETE.replace(':id', reviewId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const reviewService = new ReviewService();
export default reviewService;

