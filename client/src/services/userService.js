import apiClient from './api';
import API_CONFIG from '../config/api.config';

export const userService = {
  // Register a new user
  register: async (username, email, password) => {
    return apiClient.post(API_CONFIG.ENDPOINTS.REGISTER, {
      username,
      email,
      password,
    });
  },

  // Login user
  login: async (email, password) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email,
      password,
    });

    if (response.token) {
      apiClient.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  },

  // Get user profile
  getProfile: async (userId) => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.PROFILE}/${userId}`);
  },

  // Logout user
  logout: () => {
    apiClient.clearToken();
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default userService;
