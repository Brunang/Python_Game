import sqlite3 from 'sqlite3';
import bcryptjs from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../db/shecodes.db');

let db = null;

export const getDatabase = () => {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database at', dbPath);
      }
    });
  }
  return db;
};

export const initializeDatabase = () => {
  const database = getDatabase();

  database.serialize(() => {
    // Users table
    database.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        progress REAL DEFAULT 0.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User Progress table
    database.run(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        level_id INTEGER NOT NULL,
        completed BOOLEAN DEFAULT 0,
        score INTEGER DEFAULT 0,
        attempts INTEGER DEFAULT 0,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, level_id)
      )
    `);

    // Levels table
    database.run(`
      CREATE TABLE IF NOT EXISTS levels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        level_number INTEGER NOT NULL,
        difficulty TEXT,
        theme TEXT,
        character_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Code submissions table
    database.run(`
      CREATE TABLE IF NOT EXISTS code_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        level_id INTEGER NOT NULL,
        code TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT 0,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (level_id) REFERENCES levels(id)
      )
    `);

    console.log(' Database tables initialized');

    // Seed a default test user if not present
    database.get('SELECT id FROM users WHERE username = ?', ['testplayer'], (err, row) => {
      if (err) {
        console.error('Error checking for seed user:', err);
        return;
      }
      if (!row) {
        // Insert with hashed password via bcrypt to be compatible with login
        try {
          const hashed = bcryptjs.hashSync('testplayer', 10);

          database.run(
            'INSERT INTO users (username, password, progress) VALUES (?, ?, ?)',
            ['testplayer', hashed, 0.0],
            function(insertErr) {
              if (insertErr) {
                console.error('Error seeding test user:', insertErr);
              } else {
                console.log('Seeded default user: testplayer (0% progress)');
              }
            }
          );
        } catch (seedErr) {
          console.error('Failed to seed test user due to bcrypt error:', seedErr);
        }
      }
    });
  });
};

export default getDatabase;
