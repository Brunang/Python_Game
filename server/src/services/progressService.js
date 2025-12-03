import getDatabase from '../models/database.js';

export const progressService = {
  // Get user progress for all levels
  getUserProgress: (userId) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.all(
        `SELECT up.*, l.title, l.level_number, l.difficulty, l.theme, l.character_name
         FROM user_progress up
         JOIN levels l ON up.level_id = l.id
         WHERE up.user_id = ?
         ORDER BY l.level_number ASC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  },

  // Get progress for a specific level
  getLevelProgress: (userId, levelId) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.get(
        'SELECT * FROM user_progress WHERE user_id = ? AND level_id = ?',
        [userId, levelId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  // Update progress for a level
  updateProgress: (userId, levelId, score, completed) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      
      // First, update the user_progress table
      db.run(
        `INSERT INTO user_progress (user_id, level_id, score, completed, completed_at, attempts)
         VALUES (?, ?, ?, ?, ?, 1)
         ON CONFLICT(user_id, level_id) DO UPDATE SET
         score = MAX(score, ?),
         completed = ?,
         attempts = attempts + 1,
         completed_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE completed_at END`,
        [userId, levelId, score, completed ? 1 : 0, completed ? new Date() : null, score, completed ? 1 : 0, completed],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          
          // If level is completed, update the user's overall progress percentage
          if (completed) {
            // Calculate progress: each level = 12.5% (8 levels total = 100%)
            const progressIncrement = 12.5;
            
            db.run(
              `UPDATE users 
               SET progress = (
                 SELECT COUNT(DISTINCT level_id) * ? 
                 FROM user_progress 
                 WHERE user_id = ? AND completed = 1
               )
               WHERE id = ?`,
              [progressIncrement, userId, userId],
              (updateErr) => {
                if (updateErr) {
                  reject(updateErr);
                } else {
                  resolve({ success: true });
                }
              }
            );
          } else {
            resolve({ success: true });
          }
        }
      );
    });
  },

  // Get user statistics
  getUserStats: (userId) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.get(
        `SELECT
          COUNT(*) as total_levels,
          SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_levels,
          SUM(score) as total_score,
          SUM(attempts) as total_attempts
         FROM user_progress
         WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row || { total_levels: 0, completed_levels: 0, total_score: 0, total_attempts: 0 });
        }
      );
    });
  },
};

export default progressService;
