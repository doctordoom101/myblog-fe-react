import api from './api';

// Fungsi autentikasi untuk login dan registrasi
const authService = {
  register: async (username, email, password, passwordConfirm) => {
    try {
      const response = await api.users.register({
        username,
        email,
        password,
        password_confirm: passwordConfirm
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.users.login({ email, password });
      const { access, refresh } = response.data;
      
      // Simpan token di localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      return true;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.users.getCurrentUser();
      return response.data;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};

export default authService;