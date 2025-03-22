import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth';

// Buat context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Cek apakah user terautentikasi saat aplikasi load
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
        } catch (error) {
          console.error('Failed to get user data:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Register function
  const register = async (username, email, password, passwordConfirm) => {
    try {
      await authService.register(username, email, password, passwordConfirm);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  // Login function
  const login = async (email, password) => {
    try {
      await authService.login(email, password);
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk menggunakan AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;