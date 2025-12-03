import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class AddressService {
  // Get all addresses
  async getAddresses() {
    try {
      const response = await apiService.get(API_ENDPOINTS.ADDRESSES.GET);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get address by ID
  async getAddressById(addressId) {
    try {
      const response = await apiService.get(
        API_ENDPOINTS.ADDRESSES.GET_BY_ID.replace(':id', addressId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create address
  async createAddress(addressData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.ADDRESSES.CREATE, addressData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update address
  async updateAddress(addressId, addressData) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.ADDRESSES.UPDATE.replace(':id', addressId),
        addressData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete address
  async deleteAddress(addressId) {
    try {
      const response = await apiService.delete(
        API_ENDPOINTS.ADDRESSES.DELETE.replace(':id', addressId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get default address
  async getDefaultAddress() {
    try {
      const response = await apiService.get(API_ENDPOINTS.ADDRESSES.GET_DEFAULT);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const addressService = new AddressService();
export default addressService;

