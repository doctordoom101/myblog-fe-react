import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor for authentication
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Blog API calls
export const blogApi = {
  getAllBlogs: (page = 1) => apiClient.get(`/blogs/?page=${page}`),
  getBlogById: (id) => apiClient.get(`/blogs/${id}/`),
  createBlog: (data) => apiClient.post('/blogs/', data),
  updateBlog: (id, data) => apiClient.put(`/blogs/${id}/`, data),
  deleteBlog: (id) => apiClient.delete(`/blogs/${id}/`),
  
  // Comments
  getComments: (blogId) => apiClient.get(`/blogs/${blogId}/comments/`),
  addComment: (blogId, data) => apiClient.post(`/blogs/${blogId}/comments/`, data),
  deleteComment: (commentId) => apiClient.delete(`/comments/${commentId}/`)
};

// Auth API calls
export const authApi = {
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  register: (userData) => apiClient.post('/auth/register/', userData),
  getProfile: () => apiClient.get('/auth/profile/'),
  updateProfile: (data) => apiClient.put('/auth/profile/', data)
};

export default apiClient;