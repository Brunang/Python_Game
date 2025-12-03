import getDatabase from '../models/database.js';

export const codeService = {
  // Submit code for a level
  submitCode: (userId, levelId, code) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.run(
        'INSERT INTO code_submissions (user_id, level_id, code, is_correct) VALUES (?, ?, ?, ?)',
        [userId, levelId, code, 0],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  },

  // Get submission history
  getSubmissionHistory: (userId, levelId) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.all(
        'SELECT * FROM code_submissions WHERE user_id = ? AND level_id = ? ORDER BY submitted_at DESC LIMIT 10',
        [userId, levelId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  },

  // Get all submissions for a user
  getUserSubmissions: (userId) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.all(
        'SELECT * FROM code_submissions WHERE user_id = ? ORDER BY submitted_at DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  },

  // Mark submission as correct
  markSubmissionCorrect: (submissionId) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.run(
        'UPDATE code_submissions SET is_correct = 1 WHERE id = ?',
        [submissionId],
        (err) => {
          if (err) reject(err);
          else resolve({ success: true });
        }
      );
    });
  },

  // Validate code
  validateCode: (code, requiredKeywords = []) => {
    const errors = [];

    if (!code || code.trim().length === 0) {
      errors.push('Code cannot be empty');
      return { isValid: false, errors };
    }

    for (const keyword of requiredKeywords) {
      if (!code.toLowerCase().includes(keyword.toLowerCase())) {
        errors.push(`Code must contain: ${keyword}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default codeService;
