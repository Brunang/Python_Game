import progressService from '../services/progressService.js';

// Get user progress
export const getProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const progress = await progressService.getUserProgress(userId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

// Update progress for a level
export const updateProgress = async (req, res, next) => {
  try {
    const { userId, levelId } = req.params;
    const { score, completed } = req.body;

    await progressService.updateProgress(userId, levelId, score, completed);
    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Get overall stats
export const getStats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const stats = await progressService.getUserStats(userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export default { getProgress, updateProgress, getStats };
