import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Register
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

// Get user profile
router.get('/:id', userController.getProfile);

export default router;
