import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class WithdrawalService {
  // Create withdrawal request
  async createWithdrawal(amount, method, accountDetails) {
    try {
      const response = await apiService.post(API_ENDPOINTS.WITHDRAWAL.CREATE, {
        amount,
        method,
        accountDetails
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user's withdrawals
  async getMyWithdrawals(status = null) {
    try {
      const url = status 
        ? `${API_ENDPOINTS.WITHDRAWAL.MY_WITHDRAWALS}?status=${status}`
        : API_ENDPOINTS.WITHDRAWAL.MY_WITHDRAWALS;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const withdrawalService = new WithdrawalService();
export default withdrawalService;

