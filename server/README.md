# SHE<Codes/> Backend API

A Node.js/Express backend for the SHE<Codes/> Digital Time Machine educational game.

## Features

-  User authentication (Register/Login with JWT)
-  Player progress tracking
-  Level management
-  Code submission validation
-  Player statistics and achievements

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

The `.env` file is already set up with defaults:
- `PORT=5000`
- `NODE_ENV=development`
- `JWT_SECRET=your_jwt_secret_key_change_in_production`
- `DATABASE_PATH=./db/shecodes.db`

### 3. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:id` - Get user profile

### Progress
- `GET /api/progress/:userId` - Get user's level progress
- `POST /api/progress/:userId/level/:levelId` - Update progress for a level
- `GET /api/progress/:userId/stats` - Get overall stats

### Levels
- `GET /api/levels` - Get all levels
- `GET /api/levels/:id` - Get specific level
- `POST /api/levels` - Create new level (admin)

### Code
- `POST /api/code/submit` - Submit code for a level
- `GET /api/code/history/:userId/:levelId` - Get submission history

## Database Schema

### Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password TEXT,
  created_at DATETIME,
  updated_at DATETIME
)
```

### User Progress
```sql
CREATE TABLE user_progress (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  level_id INTEGER,
  completed BOOLEAN,
  score INTEGER,
  attempts INTEGER,
  completed_at DATETIME
)
```

### Levels
```sql
CREATE TABLE levels (
  id INTEGER PRIMARY KEY,
  title TEXT,
  description TEXT,
  level_number INTEGER,
  difficulty TEXT,
  theme TEXT,
  character_name TEXT
)
```

### Code Submissions
```sql
CREATE TABLE code_submissions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  level_id INTEGER,
  code TEXT,
  is_correct BOOLEAN,
  submitted_at DATETIME
)
```

## Example Usage

### Register
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "wizard_ada",
    "email": "ada@example.com",
    "password": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com",
    "password": "SecurePass123"
  }'
```

### Submit Code
```bash
curl -X POST http://localhost:5000/api/code/submit \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "levelId": 1,
    "code": "print(\"Hello World\")"
  }'
```

## Next Steps

1. Install dependencies: `npm install`
2. Start the backend: `npm run dev`
3. Update your frontend to call these API endpoints
4. Customize code validation logic for each level
5. Add more sophisticated game logic as needed

## Future Enhancements

- [ ] WebSocket support for real-time multiplayer
- [ ] Advanced code execution engine (Python/JavaScript execution)
- [ ] Leaderboards
- [ ] Achievements and badges
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Social features (friend requests, team challenges)
