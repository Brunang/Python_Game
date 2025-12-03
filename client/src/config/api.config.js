// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // User endpoints
    REGISTER: '/api/users/register',
    LOGIN: '/api/users/login',
    PROFILE: '/api/users/profile',
    
    // Progress endpoints
    GET_PROGRESS: '/api/progress',
    UPDATE_PROGRESS: '/api/progress',
    GET_STATS: '/api/progress/stats',
    
    // Levels endpoints
    GET_LEVELS: '/api/levels',
    GET_LEVEL: '/api/levels',
    CREATE_LEVEL: '/api/levels',
    
    // Code endpoints
    SUBMIT_CODE: '/api/code/submit',
    GET_CODE_HISTORY: '/api/code/history',
  },
};

export default API_CONFIG;
