import apiClient from './api';
import API_CONFIG from '../config/api.config';

export const codeService = {
  // Submit code for a level
  submitCode: async (userId, levelId, code) => {
    return apiClient.post(API_CONFIG.ENDPOINTS.SUBMIT_CODE, {
      userId,
      levelId,
      code,
    });
  },

  // Get submission history for a level
  getSubmissionHistory: async (userId, levelId) => {
    return apiClient.get(
      `${API_CONFIG.ENDPOINTS.GET_CODE_HISTORY}/${userId}/${levelId}`
    );
  },

  // Validate code locally (basic checks before submission)
  validateCode: (code, requiredKeywords = []) => {
    const errors = [];

    if (!code || code.trim().length === 0) {
      errors.push('Code cannot be empty');
      return { isValid: false, errors };
    }

    for (const keyword of requiredKeywords) {
      if (!code.toLowerCase().includes(keyword.toLowerCase())) {
        errors.push(`Code must contain: ${keyword}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Execute code (can be extended for actual execution)
  executeCode: async (code, language = 'python') => {
    // This is a placeholder - you can integrate with a code execution service
    try {
      // Local validation
      if (code.includes('print')) {
        return {
          success: true,
          output: 'Code executed successfully!',
        };
      }
      return {
        success: false,
        output: 'Code did not produce expected output',
      };
    } catch (error) {
      return {
        success: false,
        output: `Error: ${error.message}`,
      };
    }
  },
};

export default codeService;
