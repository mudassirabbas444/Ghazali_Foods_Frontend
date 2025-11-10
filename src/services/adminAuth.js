import apiService from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';

class AdminAuthService {
  // Admin login
  async login(credentials) {
    try {
      // Validate required fields
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }

      const response = await apiService.post(
        API_ENDPOINTS.AUTH.ADMIN_LOGIN || '/users/login',
        credentials
      );

      console.log('AdminAuthService login response:', response);

      // Set admin token and user data
      if (response.success && response.token) {
        console.log('Setting admin token and user data');
        this.setAdminToken(response.token);
        this.setAdminData(response.user);
      }

      return response;
    } catch (error) {
      // Enhanced error handling
      if (error.type === 'validation') {
        throw new Error(error.message || 'Please check your credentials');
      } else if (error.type === 'unauthorized') {
        throw new Error('Invalid admin credentials');
      } else if (error.type === 'forbidden') {
        throw new Error('You do not have admin privileges');
      } else if (error.type === 'server') {
        throw new Error('Server error. Please try again later.');
      } else if (error.type === 'network') {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error(error.message || 'Admin login failed. Please try again.');
      }
    }
  }

  // Admin logout
  logout() {
    this.removeAdminToken();
    this.removeAdminData();
  }

  // Set admin token
  setAdminToken(token) {
    // Store admin token in localStorage
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN || 'dreamslife_admin_token', token);
  }

  // Get admin token
  getAdminToken() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN || 'dreamslife_admin_token');
  }

  // Remove admin token
  removeAdminToken() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN || 'dreamslife_admin_token');
  }

  // Set admin data
  setAdminData(adminData) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_DATA || 'admin_data', JSON.stringify(adminData));
  }

  // Get admin data
  getAdminData() {
    try {
      const adminData = localStorage.getItem(STORAGE_KEYS.ADMIN_DATA || 'admin_data');
      return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
      console.error('Error parsing admin data:', error);
      return null;
    }
  }

  // Remove admin data
  removeAdminData() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA || 'admin_data');
  }

  // Check if admin is authenticated
  isAuthenticated() {
    return !!this.getAdminToken();
  }

  // Check if user is admin
  isAdmin() {
    const adminData = this.getAdminData();
    return adminData?.isAdmin === true;
  }

  // Get admin ID
  getAdminId() {
    const adminData = this.getAdminData();
    return adminData?.id || adminData?._id;
  }

  // Get admin role (for backward compatibility)
  getAdminRole() {
    const adminData = this.getAdminData();
    return adminData?.isAdmin ? 'admin' : null;
  }

  // Get admin profile
  async getProfile() {
    try {
      const response = await apiService.get('/admin/profile');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update admin profile
  async updateProfile(adminData) {
    try {
      const response = await apiService.put('/admin/profile', adminData);

      if (response.success && response.user) {
        this.setAdminData(response.user);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Create and export admin auth service instance
const adminAuthService = new AdminAuthService();
export default adminAuthService;
