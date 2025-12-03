import { useState, useEffect } from 'react';
import progressService from '../services/progressService';

export const useGameProgress = (userId) => {
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProgress = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const progressData = await progressService.getProgress(userId);
        const statsData = await progressService.getStats(userId);
        setProgress(progressData);
        setStats(statsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  const updateLevelProgress = async (levelId, score, completed) => {
    try {
      await progressService.updateProgress(userId, levelId, score, completed);
      // Refresh progress after update
      const updatedProgress = await progressService.getProgress(userId);
      const updatedStats = await progressService.getStats(userId);
      setProgress(updatedProgress);
      setStats(updatedStats);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeLevelChallenge = async (levelId) => {
    return updateLevelProgress(levelId, 100, true);
  };

  return {
    progress,
    stats,
    isLoading,
    error,
    updateLevelProgress,
    completeLevelChallenge,
  };
};

export default useGameProgress;
