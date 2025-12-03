import express from 'express';
import progressController from '../controllers/progressController.js';

const router = express.Router();

// Get user progress
router.get('/:userId', progressController.getProgress);

// Get user stats
router.get('/:userId/stats', progressController.getStats);

// Update progress for a level
router.post('/:userId/level/:levelId', progressController.updateProgress);

export default router;
