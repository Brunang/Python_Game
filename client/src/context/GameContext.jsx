import { createContext, useState, useEffect } from 'react';
import progressService from '../services/progressService';

export const GameContext = createContext();

export const GameProvider = ({ children, userId }) => {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchGameData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const progressData = await progressService.getProgress(userId);
        const statsData = await progressService.getStats(userId);
        setProgress(progressData);
        setStats(statsData);
        if (progressData.length > 0) {
          setCurrentLevel(progressData[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [userId]);

  const updateProgress = async (levelId, score, completed) => {
    try {
      await progressService.updateProgress(userId, levelId, score, completed);
      // Refresh data
      const updatedProgress = await progressService.getProgress(userId);
      const updatedStats = await progressService.getStats(userId);
      setProgress(updatedProgress);
      setStats(updatedStats);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeLevel = (levelId) => {
    return updateProgress(levelId, 100, true);
  };

  const goToLevel = (levelId) => {
    const level = progress.find(l => l.level_id === levelId);
    if (level) {
      setCurrentLevel(level);
    }
  };

  const value = {
    currentLevel,
    progress,
    stats,
    isLoading,
    error,
    updateProgress,
    completeLevel,
    goToLevel,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
