import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDatabase from '../models/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const userService = {
  // Create a new user
  createUser: (username, email, password) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const hashedPassword = bcryptjs.hashSync(password, 10);

      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email || null, hashedPassword],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username, email });
          }
        }
      );
    });
  },

  // Find user by email
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Find user by username
  getUserByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Find user by ID
  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.get(
        'SELECT id, username, email, progress, created_at FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  // Verify password
  verifyPassword: (inputPassword, hashedPassword) => {
    return bcryptjs.compareSync(inputPassword, hashedPassword);
  },

  // Generate JWT token
  generateToken: (userId, username) => {
    return jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
  },
};

export default userService;
