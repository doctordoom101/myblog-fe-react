import axios from 'axios';

// Buat instance axios dengan konfigurasi default
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token otentikasi ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani respons dan refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Jika error 401 (Unauthorized) dan belum mencoba refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Coba refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/users/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        
        // Ulangi request asli dengan token baru
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Jika refresh token juga gagal, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Export fungsi umum untuk API calls
export default {
  // User endpoints
  users: {
    register: (userData) => api.post('/users/register/', userData),
    login: (credentials) => api.post('/users/token/', credentials),
    refreshToken: (refreshToken) => api.post('/users/token/refresh/', { refresh: refreshToken }),
    getCurrentUser: () => api.get('/users/me/'),
    getUserProfile: (username) => api.get(`/users/profile/${username}/`),
  },
  
  // Blog Post endpoints
  posts: {
    getAll: (page = 1) => api.get(`/posts/?page=${page}`),
    get: (id) => api.get(`/posts/${id}/`),
    create: (postData) => api.post('/posts/create/', postData),
    update: (id, postData) => api.put(`/posts/${id}/edit/`, postData),
    delete: (id) => api.delete(`/posts/${id}/edit/`),
    getUserPosts: (username) => api.get(`/posts/user/${username}/`),
  },
  
  // Comment endpoints
  comments: {
    getForPost: (postId) => api.get(`/comments/post/${postId}/`),
    create: (commentData) => api.post('/comments/create/', commentData),
    update: (id, commentData) => api.put(`/comments/${id}/`, commentData),
    delete: (id) => api.delete(`/comments/${id}/`),
  },
};