import { authApi } from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await authApi.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: async () => {
    try {
      const response = await authApi.getProfile();
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('token') ? true : false;
  }
};