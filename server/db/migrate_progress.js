import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'shecodes.db');

console.log(' Starting database migration...');
console.log(' Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(' Error opening database:', err);
    process.exit(1);
  }
});

db.serialize(() => {
  // Step 1: Create a new users table with the correct schema
  console.log('📋 Step 1: Creating new users table...');
  db.run(`
    CREATE TABLE IF NOT EXISTS users_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password TEXT NOT NULL,
      progress REAL DEFAULT 0.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error(' Error creating new table:', err);
      process.exit(1);
    }
    console.log(' New users table created');
  });

  // Step 2: Copy data from old table to new table
  // Use progress_percent if it exists, otherwise use progress as 0.0
  console.log('📋 Step 2: Copying data from old table...');
  db.run(`
    INSERT INTO users_new (id, username, email, password, progress, created_at, updated_at)
    SELECT 
      id, 
      username, 
      email, 
      password, 
      COALESCE(progress_percent, CAST(progress AS REAL), 0.0) as progress,
      created_at,
      updated_at
    FROM users
  `, (err) => {
    if (err) {
      console.error(' Error copying data:', err);
      process.exit(1);
    }
    console.log(' Data copied successfully');
  });

  // Step 3: Drop the old table
  console.log('📋 Step 3: Dropping old users table...');
  db.run('DROP TABLE users', (err) => {
    if (err) {
      console.error(' Error dropping old table:', err);
      process.exit(1);
    }
    console.log(' Old users table dropped');
  });

  // Step 4: Rename new table to users
  console.log('📋 Step 4: Renaming new table...');
  db.run('ALTER TABLE users_new RENAME TO users', (err) => {
    if (err) {
      console.error(' Error renaming table:', err);
      process.exit(1);
    }
    console.log(' Table renamed successfully');
  });

  // Step 5: Verify the migration
  console.log('📋 Step 5: Verifying migration...');
  db.all('SELECT id, username, progress FROM users', (err, rows) => {
    if (err) {
      console.error(' Error verifying migration:', err);
      process.exit(1);
    }
    console.log('\n Migration completed successfully!');
    console.log(' Current users in database:');
    console.table(rows);
    
    db.close((err) => {
      if (err) {
        console.error(' Error closing database:', err);
      } else {
        console.log('\n Database migration complete and connection closed.');
      }
    });
  });
});
