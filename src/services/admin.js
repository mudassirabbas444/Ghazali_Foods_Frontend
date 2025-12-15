import apiService from './api';
import { API_ENDPOINTS } from '../constants';

class AdminService {
  // Dashboard Stats
  async getDashboardStats() {
    try {
      const response = await apiService.get('/orders/stats');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Products
  async createProduct(productData, images) {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'variants' || key === 'tags' || key === 'applicableCategories' || key === 'applicableProducts') {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (productData[key] !== undefined && productData[key] !== null) {
          formData.append(key, productData[key]);
        }
      });
      
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      const response = await apiService.upload(API_ENDPOINTS.PRODUCTS.CREATE, formData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(productId, productData, images) {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'variants' || key === 'tags' || key === 'applicableCategories' || key === 'applicableProducts') {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (productData[key] !== undefined && productData[key] !== null) {
          formData.append(key, productData[key]);
        }
      });
      
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await apiService.uploadPut(
        API_ENDPOINTS.PRODUCTS.UPDATE.replace(':id', productId),
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Upload a single product video to Firebase via backend upload endpoint
  async uploadProductVideo(file) {
    try {
      if (!file) {
        throw new Error('No video file provided');
      }

      const formData = new FormData();
      // Reuse upload/single endpoint (expects field name "image")
      formData.append('image', file);
      formData.append('folder', 'product-videos');

      const response = await apiService.upload('/upload/single', formData);
      // Response shape: { success, message, data: { success, url, publicUrl, ... } }
      const data = response?.data || response;
      const inner = data?.data || {};
      const url = inner.url || inner.publicUrl;

      if (!url) {
        throw new Error('Video upload failed: URL not returned from server');
      }

      return { success: true, url };
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.PRODUCTS.DELETE.replace(':id', productId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProductStock(productId, stockData) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.PRODUCTS.UPDATE_STOCK.replace(':id', productId),
        stockData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getLowStockProducts() {
    try {
      const response = await apiService.get(API_ENDPOINTS.PRODUCTS.GET_LOW_STOCK);
      if (response.success) {
        return {
          ...response,
          products: response.products || response.data || []
        };
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Categories
  async createCategory(categoryData, image) {
    try {
      const formData = new FormData();
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] !== undefined && categoryData[key] !== null) {
          formData.append(key, categoryData[key]);
        }
      });
      
      if (image) {
        formData.append('image', image);
      }

      const response = await apiService.upload(API_ENDPOINTS.CATEGORIES.CREATE, formData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(categoryId, categoryData, image) {
    try {
      const formData = new FormData();
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] !== undefined && categoryData[key] !== null) {
          formData.append(key, categoryData[key]);
        }
      });
      
      if (image) {
        formData.append('image', image);
      }

      const response = await apiService.uploadPut(
        API_ENDPOINTS.CATEGORIES.UPDATE.replace(':id', categoryId),
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.CATEGORIES.DELETE.replace(':id', categoryId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Orders
  async getAllOrders(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const queryString = params.toString();
      const url = queryString 
        ? `/orders?${queryString}`
        : '/orders';

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(orderId, status, adminNotes) {
    try {
      const response = await apiService.put(
        `/orders/${orderId}/status`,
        { status, adminNotes }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const response = await apiService.put(
        `/orders/${orderId}/payment-status`,
        { paymentStatus }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Customers
  async getAllUsers(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const queryString = params.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.AUTH.PROFILE.replace('/profile', '')}?${queryString}`
        : API_ENDPOINTS.AUTH.PROFILE.replace('/profile', '');

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.AUTH.DELETE_USER);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Coupons
  async createCoupon(couponData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.COUPONS.GET.replace('/', ''), couponData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateCoupon(couponId, couponData) {
    try {
      const response = await apiService.put(
        API_ENDPOINTS.COUPONS.GET_BY_ID.replace(':id', couponId),
        couponData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteCoupon(couponId) {
    try {
      const response = await apiService.delete(
        API_ENDPOINTS.COUPONS.GET_BY_ID.replace(':id', couponId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllCoupons() {
    try {
      const response = await apiService.get(API_ENDPOINTS.COUPONS.GET);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Banners
  async createBanner(bannerData, image) {
    try {
      const formData = new FormData();
      Object.keys(bannerData).forEach(key => {
        if (bannerData[key] !== undefined && bannerData[key] !== null) {
          formData.append(key, bannerData[key]);
        }
      });
      
      if (image) {
        formData.append('image', image);
      }

      const response = await apiService.upload(API_ENDPOINTS.BANNERS.GET.replace('/', ''), formData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateBanner(bannerId, bannerData, image) {
    try {
      const formData = new FormData();
      Object.keys(bannerData).forEach(key => {
        if (bannerData[key] !== undefined && bannerData[key] !== null) {
          formData.append(key, bannerData[key]);
        }
      });
      
      if (image) {
        formData.append('image', image);
      }

      const response = await apiService.upload(
        API_ENDPOINTS.BANNERS.GET_BY_ID.replace(':id', bannerId),
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteBanner(bannerId) {
    try {
      const response = await apiService.delete(
        API_ENDPOINTS.BANNERS.GET_BY_ID.replace(':id', bannerId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Reviews
  async approveReview(reviewId) {
    try {
      const response = await apiService.put(`/reviews/${reviewId}/approve`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteReview(reviewId) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.REVIEWS.DELETE.replace(':id', reviewId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Stock Notifications
  async getAllStockNotifications(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.isNotified !== undefined) params.append('isNotified', filters.isNotified);

      const queryString = params.toString();
      const url = queryString
        ? `/stock-notifications?${queryString}`
        : '/stock-notifications';

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteStockNotification(notificationId) {
    try {
      const response = await apiService.delete(`/stock-notifications/${notificationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Product Questions
  async getAllQuestions(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.hasAnswer !== undefined) params.append('hasAnswer', filters.hasAnswer);
      if (filters.isApproved !== undefined) params.append('isApproved', filters.isApproved);

      const queryString = params.toString();
      const url = queryString
        ? `/product-questions?${queryString}`
        : '/product-questions';

      const response = await apiService.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async answerQuestion(questionId, answer) {
    try {
      const response = await apiService.put(
        `/product-questions/${questionId}/answer`,
        { answer }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteQuestion(questionId) {
    try {
      const response = await apiService.delete(`/product-questions/${questionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async approveQuestion(questionId) {
    try {
      const response = await apiService.put(`/product-questions/${questionId}/approve`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Announcements
  async createAnnouncement(announcementData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.ANNOUNCEMENTS.GET, announcementData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateAnnouncement(announcementId, announcementData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.ANNOUNCEMENTS.GET_BY_ID.replace(':id', announcementId), announcementData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteAnnouncement(announcementId) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.ANNOUNCEMENTS.GET_BY_ID.replace(':id', announcementId));
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Blogs
  async createBlog(blogData, image) {
    try {
      const formData = new FormData();
      Object.keys(blogData).forEach(key => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(blogData[key]));
        } else if (blogData[key] !== undefined && blogData[key] !== null) {
          formData.append(key, blogData[key]);
        }
      });
      
      if (image) {
        formData.append('featuredImage', image);
      }

      const response = await apiService.upload(API_ENDPOINTS.BLOGS.GET, formData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateBlog(blogId, blogData, image) {
    try {
      const formData = new FormData();
      Object.keys(blogData).forEach(key => {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(blogData[key]));
        } else if (blogData[key] !== undefined && blogData[key] !== null) {
          formData.append(key, blogData[key]);
        }
      });
      
      if (image) {
        formData.append('featuredImage', image);
      }

      const response = await apiService.uploadPut(API_ENDPOINTS.BLOGS.GET_BY_ID.replace(':id', blogId), formData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteBlog(blogId) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.BLOGS.GET_BY_ID.replace(':id', blogId));
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const adminService = new AdminService();
export default adminService;

