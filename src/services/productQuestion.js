import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class ProductQuestionService {
  // Create a question
  async createQuestion(productId, question) {
    try {
      const response = await apiService.post(API_ENDPOINTS.PRODUCT_QUESTIONS.CREATE, {
        productId,
        question,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get questions for a product
  async getProductQuestions(productId) {
    try {
      const response = await apiService.get(
        API_ENDPOINTS.PRODUCT_QUESTIONS.GET_BY_PRODUCT.replace(':productId', productId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user's questions
  async getMyQuestions() {
    try {
      const response = await apiService.get(API_ENDPOINTS.PRODUCT_QUESTIONS.GET_MY_QUESTIONS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update a question
  async updateQuestion(questionId, question) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.PRODUCT_QUESTIONS.UPDATE.replace(':id', questionId),
        { question }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete a question
  async deleteQuestion(questionId) {
    try {
      const response = await apiService.delete(
        API_ENDPOINTS.PRODUCT_QUESTIONS.DELETE.replace(':id', questionId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mark question as helpful
  async markHelpful(questionId) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.PRODUCT_QUESTIONS.MARK_HELPFUL.replace(':id', questionId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const productQuestionService = new ProductQuestionService();
export default productQuestionService;

