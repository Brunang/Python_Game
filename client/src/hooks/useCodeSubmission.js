import { useState } from 'react';
import codeService from '../services/codeService';
import progressService from '../services/progressService';

export const useCodeSubmission = (userId, levelId) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [error, setError] = useState(null);

  const submitCode = async (code, requiredKeywords = []) => {
    setIsSubmitting(true);
    setError(null);
    setSubmissionResult(null);

    try {
      // Validate code locally first
      const validation = codeService.validateCode(code, requiredKeywords);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        setIsSubmitting(false);
        return { success: false, errors: validation.errors };
      }

      // Submit to backend
      const response = await codeService.submitCode(userId, levelId, code);

      // Update progress if correct
      if (response.isCorrect) {
        await progressService.completeLevel(userId, levelId);
      }

      setSubmissionResult(response);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to submit code';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearResult = () => {
    setSubmissionResult(null);
    setError(null);
  };

  return {
    submitCode,
    isSubmitting,
    submissionResult,
    error,
    clearResult,
  };
};

export default useCodeSubmission;
