import React, { createContext, useContext, useEffect, useState } from 'react';
import adminAuthService from '../services/adminAuth';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize admin authentication state
  useEffect(() => {
    const initAdminAuth = async () => {
      try {
        const token = adminAuthService.getAdminToken();
        const adminData = adminAuthService.getAdminData();

        if (token && adminData) {
          // Verify token is still valid by fetching profile
          try {
            const profileResponse = await adminAuthService.getProfile();
            if (profileResponse.success) {
              setAdmin(profileResponse.user);
              setIsAuthenticated(true);
              setIsAdmin(profileResponse.user?.role === 'admin');
            } else {
              // Token is invalid, clear auth data
              adminAuthService.logout();
              setAdmin(null);
              setIsAuthenticated(false);
              setIsAdmin(false);
            }
          } catch (error) {
            // Token is invalid, clear auth data
            adminAuthService.logout();
            setAdmin(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        } else {
          setAdmin(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error initializing admin auth:', error);
        setAdmin(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAdminAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await adminAuthService.login(credentials);
      
      if (response.success && response.user) {
        setAdmin(response.user);
        setIsAuthenticated(true);
        setIsAdmin(response.user?.role === 'admin');
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      adminAuthService.logout();
      setAdmin(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  const updateAdmin = (adminData) => {
    setAdmin(adminData);
    adminAuthService.setAdminData(adminData);
  };

  const value = {
    admin,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    updateAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
