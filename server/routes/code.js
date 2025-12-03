import express from 'express';
import { getDatabase } from '../src/models/database.js';

const router = express.Router();
const db = getDatabase();

// Submit code
router.post('/submit', (req, res) => {
  const { userId, levelId, code } = req.body;

  if (!userId || !levelId || !code) {
    return res.status(400).json({ error: 'userId, levelId, and code are required' });
  }

  // Validate code (basic check)
  let isCorrect = false;
  let feedback = '';

  // Example validation logic for different levels
  // This should be customized based on your specific level requirements
  
  if (levelId === 1) {
    // Level 1: Print spell
    isCorrect = code.toLowerCase().includes('print');
    feedback = isCorrect 
      ? '✨ Great! You\'ve mastered the print spell!' 
      : '❌ The print spell needs work. Try again!';
  } else if (levelId === 2) {
    // Add more level-specific validation
    isCorrect = code.toLowerCase().includes('for') || code.toLowerCase().includes('while');
    feedback = isCorrect 
      ? '🎉 Loop spell working!' 
      : '❌ Try using a loop!';
  }

  // Save submission
  db.run(
    'INSERT INTO code_submissions (user_id, level_id, code, is_correct) VALUES (?, ?, ?, ?)',
    [userId, levelId, code, isCorrect ? 1 : 0],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to submit code' });
      }

      res.json({
        isCorrect,
        feedback,
        message: isCorrect ? 'Code is correct!' : 'Code needs adjustment'
      });
    }
  );
});

// Get code submission history
router.get('/history/:userId/:levelId', (req, res) => {
  const { userId, levelId } = req.params;

  db.all(
    'SELECT * FROM code_submissions WHERE user_id = ? AND level_id = ? ORDER BY submitted_at DESC LIMIT 10',
    [userId, levelId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows || []);
    }
  );
});

export default router;
