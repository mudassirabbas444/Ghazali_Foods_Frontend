import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import apiService from '../services/api';
import { API_ENDPOINTS } from '../constants';
import { STORAGE_KEYS } from '../constants';
import { toast } from 'react-toastify';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      setIsLoading(true);
      const token =
        localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) ||
        Cookies.get(STORAGE_KEYS.ADMIN_TOKEN);

      if (!token) {
        setIsAuthenticated(false);
        setAdmin(null);
        return;
      }

      // Verify token by getting profile
      const response = await apiService.get(API_ENDPOINTS.AUTH.PROFILE);
      
      if (response.success && response.user?.isAdmin) {
        setAdmin(response.user);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.success && response.user?.isAdmin) {
        const token = response.token;
        
        // Store admin token separately
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
        Cookies.set(STORAGE_KEYS.ADMIN_TOKEN, token, { expires: 7 });
        
        setAdmin(response.user);
        setIsAuthenticated(true);
        
        return { success: true, user: response.user };
      } else {
        return {
          success: false,
          message: response.message || 'Invalid credentials or not an admin',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    Cookies.remove(STORAGE_KEYS.ADMIN_TOKEN);
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const value = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAdminAuth,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

