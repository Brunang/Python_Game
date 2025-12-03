import express from 'express';
import { getDatabase } from '../src/models/database.js';

const router = express.Router();
const db = getDatabase();

// Get user progress
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  db.all(
    `SELECT up.*, l.title, l.level_number, l.difficulty, l.theme, l.character_name
     FROM user_progress up
     JOIN levels l ON up.level_id = l.id
     WHERE up.user_id = ?
     ORDER BY l.level_number ASC`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows || []);
    }
  );
});

// Update progress for a level
router.post('/:userId/level/:levelId', (req, res) => {
  const { userId, levelId } = req.params;
  const { score, completed } = req.body;

  db.run(
    `INSERT INTO user_progress (user_id, level_id, score, completed, completed_at, attempts)
     VALUES (?, ?, ?, ?, ?, 1)
     ON CONFLICT(user_id, level_id) DO UPDATE SET
     score = MAX(score, ?),
     completed = ?,
     attempts = attempts + 1,
     completed_at = CASE WHEN completed = 1 THEN CURRENT_TIMESTAMP ELSE completed_at END`,
    [userId, levelId, score, completed ? 1 : 0, new Date(), score, completed ? 1 : 0],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update progress' });
      }

      res.json({ message: 'Progress updated successfully' });
    }
  );
});

// Get overall stats
router.get('/:userId/stats', (req, res) => {
  const { userId } = req.params;

  db.get(
    `SELECT
      COUNT(*) as total_levels,
      SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_levels,
      SUM(score) as total_score,
      SUM(attempts) as total_attempts
     FROM user_progress
     WHERE user_id = ?`,
    [userId],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(stats || { total_levels: 0, completed_levels: 0, total_score: 0, total_attempts: 0 });
    }
  );
});

export default router;
