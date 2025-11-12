import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class InvestmentService {
  // Get all plans
  async getPlans() {
    try {
      const response = await apiService.get(API_ENDPOINTS.INVESTMENT.GET_PLANS);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create investment with receipt upload
  async createInvestment(planId, amount, receiptFile) {
    try {
      const formData = new FormData();
      formData.append('planId', planId);
      formData.append('amount', amount);
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }

      const response = await apiService.upload(
        API_ENDPOINTS.INVESTMENT.CREATE_INVESTMENT,
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user's investments
  async getMyInvestments(status = null) {
    try {
      const url = status 
        ? `${API_ENDPOINTS.INVESTMENT.MY_INVESTMENTS}?status=${status}`
        : API_ENDPOINTS.INVESTMENT.MY_INVESTMENTS;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment accounts
  async getPaymentAccounts() {
    try {
      const response = await apiService.get(API_ENDPOINTS.INVESTMENT.PAYMENT_ACCOUNTS);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const investmentService = new InvestmentService();
export default investmentService;

