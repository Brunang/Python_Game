import getDatabase from '../models/database.js';

export const levelService = {
  // Get all levels
  getAllLevels: () => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.all('SELECT * FROM levels ORDER BY level_number ASC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },

  // Get a specific level
  getLevelById: (levelId) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.get('SELECT * FROM levels WHERE id = ?', [levelId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Create a new level
  createLevel: (title, description, level_number, difficulty, theme, character_name) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.run(
        `INSERT INTO levels (title, description, level_number, difficulty, theme, character_name)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, level_number, difficulty, theme, character_name],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  },

  // Update a level
  updateLevel: (levelId, updateData) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const fields = Object.keys(updateData)
        .map(key => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(updateData), levelId];

      db.run(
        `UPDATE levels SET ${fields} WHERE id = ?`,
        values,
        (err) => {
          if (err) reject(err);
          else resolve({ success: true });
        }
      );
    });
  },

  // Delete a level
  deleteLevel: (levelId) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.run('DELETE FROM levels WHERE id = ?', [levelId], (err) => {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  },
};

export default levelService;
