import apiClient from './api';
import API_CONFIG from '../config/api.config';

export const progressService = {
  // Get user's progress for all levels
  getProgress: async (userId) => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.GET_PROGRESS}/${userId}`);
  },

  // Update progress for a specific level
  updateProgress: async (userId, levelId, score, completed) => {
    return apiClient.post(
      `${API_CONFIG.ENDPOINTS.UPDATE_PROGRESS}/${userId}/level/${levelId}`,
      { score, completed }
    );
  },

  // Get overall stats for a user
  getStats: async (userId) => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.GET_STATS}/${userId}/stats`);
  },

  // Mark level as completed
  completeLevel: async (userId, levelId, score = 100) => {
    return progressService.updateProgress(userId, levelId, score, true);
  },

  // Attempt level without completing
  attemptLevel: async (userId, levelId, score = 0) => {
    return progressService.updateProgress(userId, levelId, score, false);
  },
};

export default progressService;
