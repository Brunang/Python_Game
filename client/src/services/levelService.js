import apiClient from './api';
import API_CONFIG from '../config/api.config';

export const levelService = {
  // Get all levels
  getLevels: async () => {
    return apiClient.get(API_CONFIG.ENDPOINTS.GET_LEVELS);
  },

  // Get a specific level
  getLevel: async (levelId) => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.GET_LEVEL}/${levelId}`);
  },

  // Create a new level (admin only)
  createLevel: async (levelData) => {
    return apiClient.post(API_CONFIG.ENDPOINTS.CREATE_LEVEL, levelData);
  },

  // Sample levels data (for initial setup)
  getSampleLevels: () => {
    return [
      {
        id: 1,
        title: '🪄 Welcome, Young Wizard!',
        description: 'Learn the print spell',
        level_number: 1,
        difficulty: 'Easy',
        theme: 'Ada Lovelace',
        character_name: 'Ada Lovelace',
      },
      {
        id: 2,
        title: 'Loop Spell Mastery',
        description: 'Master the power of loops',
        level_number: 2,
        difficulty: 'Easy',
        theme: 'Beginner',
        character_name: 'Grace Hopper',
      },
      {
        id: 3,
        title: 'Conditional Logic',
        description: 'Learn conditional statements',
        level_number: 3,
        difficulty: 'Medium',
        theme: 'Intermediate',
        character_name: 'Alan Turing',
      },
    ];
  },
};

export default levelService;
