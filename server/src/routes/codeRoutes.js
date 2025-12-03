import express from 'express';
import codeController from '../controllers/codeController.js';

const router = express.Router();

// Submit code
router.post('/submit', codeController.submitCode);

// Get submission history for a level
router.get('/history/:userId/:levelId', codeController.getSubmissionHistory);

// Get all user submissions
router.get('/user/:userId', codeController.getUserSubmissions);

export default router;
