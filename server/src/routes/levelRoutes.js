import express from 'express';
import levelController from '../controllers/levelController.js';

const router = express.Router();

// Get all levels
router.get('/', levelController.getAllLevels);

// Get specific level
router.get('/:id', levelController.getLevel);

// Create new level (admin only)
router.post('/', levelController.createLevel);

// Update level (admin only)
router.put('/:id', levelController.updateLevel);

// Delete level (admin only)
router.delete('/:id', levelController.deleteLevel);

export default router;
