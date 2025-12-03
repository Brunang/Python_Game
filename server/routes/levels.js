import express from 'express';
import { getDatabase } from '../src/models/database.js';

const router = express.Router();
const db = getDatabase();

// Get all levels
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM levels ORDER BY level_number ASC',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows || []);
    }
  );
});

// Get specific level
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM levels WHERE id = ?',
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!row) {
        return res.status(404).json({ error: 'Level not found' });
      }

      res.json(row);
    }
  );
});

// Create a new level (admin only)
router.post('/', (req, res) => {
  const { title, description, level_number, difficulty, theme, character_name } = req.body;

  if (!title || !level_number) {
    return res.status(400).json({ error: 'Title and level_number are required' });
  }

  db.run(
    `INSERT INTO levels (title, description, level_number, difficulty, theme, character_name)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, level_number, difficulty, theme, character_name],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create level' });
      }

      res.status(201).json({
        message: 'Level created successfully',
        id: this.lastID
      });
    }
  );
});

export default router;
