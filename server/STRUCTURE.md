# SHE<Codes/> Backend API - Refactored Structure

A well-organized Node.js/Express backend for the SHE<Codes/> Digital Time Machine educational game.

## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── userController.js       # User operations
│   │   ├── progressController.js   # Progress tracking
│   │   ├── levelController.js      # Level management
│   │   └── codeController.js       # Code submissions
│   │
│   ├── services/             # Business logic
│   │   ├── userService.js         # User management
│   │   ├── progressService.js     # Progress logic
│   │   ├── levelService.js        # Level operations
│   │   └── codeService.js         # Code validation
│   │
│   ├── models/               # Database models
│   │   └── database.js        # SQLite setup & initialization
│   │
│   ├── middleware/           # Express middleware
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── errorHandler.js    # Error handling
│   │
│   ├── routes/               # API routes
│   │   ├── userRoutes.js      # User endpoints
│   │   ├── progressRoutes.js  # Progress endpoints
│   │   ├── levelRoutes.js     # Level endpoints
│   │   └── codeRoutes.js      # Code endpoints
│   │
│   ├── utils/                # Utility functions
│   │   ├── validators.js      # Data validation
│   │   └── helpers.js         # Helper functions
│   │
│   └── config/               # Configuration
│       └── constants.js       # App constants
│
├── db/                       # Database files
│   └── shecodes.db           # SQLite database
│
├── app.js                    # Express app setup
├── package.json              # Dependencies
├── .env                      # Environment variables
└── README.md                 # Documentation
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Edit `.env` file with your configuration:
```
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
DATABASE_PATH=./db/shecodes.db
```

### 3. Start the Server
```bash
npm start          # Production
npm run dev        # Development
```

Server will run on `http://localhost:3001`

## 📚 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:id` - Get user profile

### Progress
- `GET /api/progress/:userId` - Get all progress
- `GET /api/progress/:userId/stats` - Get user stats
- `POST /api/progress/:userId/level/:levelId` - Update level progress

### Levels
- `GET /api/levels` - Get all levels
- `GET /api/levels/:id` - Get specific level
- `POST /api/levels` - Create level (admin)
- `PUT /api/levels/:id` - Update level (admin)
- `DELETE /api/levels/:id` - Delete level (admin)

### Code
- `POST /api/code/submit` - Submit code
- `GET /api/code/history/:userId/:levelId` - Get submission history
- `GET /api/code/user/:userId` - Get all user submissions

## 🏗️ Architecture

### Controllers
Handle HTTP requests and responses. They receive requests, validate input, call services, and return responses.

### Services
Contain business logic and database operations. They are independent of HTTP and can be reused by different controllers.

### Models
Define database schema and initialization. The database model handles all SQLite interactions.

### Middleware
Process requests before they reach controllers. Includes authentication, error handling, and validation.

### Routes
Map HTTP methods and paths to controllers. Clean separation of route definitions.

## 🔐 Authentication

JWT tokens are used for authentication. Include the token in request headers:
```
Authorization: Bearer your_jwt_token_here
```

## 📝 Example Usage

### Register
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "wizard_ada",
    "email": "ada@example.com",
    "password": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com",
    "password": "SecurePass123"
  }'
```

### Submit Code
```bash
curl -X POST http://localhost:3001/api/code/submit \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "levelId": 1,
    "code": "print(\"Hello World\")"
  }'
```

## 🗄️ Database

SQLite is used for data persistence. Tables are automatically created on first run:
- **users** - User accounts
- **user_progress** - Level completion tracking
- **levels** - Game levels
- **code_submissions** - Code submission history

## 🛡️ Error Handling

All errors are caught and formatted consistently:
```json
{
  "error": "Error message",
  "details": "Additional details (in development mode)"
}
```

## 📦 Dependencies

- **express** - Web framework
- **cors** - Cross-origin support
- **sqlite3** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **express-validator** - Input validation
- **dotenv** - Environment variables

## 🔄 Development Workflow

1. Define routes in `src/routes/`
2. Create controllers in `src/controllers/`
3. Add business logic in `src/services/`
4. Use database queries in `src/models/`
5. Add middleware as needed in `src/middleware/`

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Update `JWT_SECRET` in `.env`
3. Configure database path
4. Deploy to hosting platform (Heroku, Railway, AWS, etc.)

## 📖 Future Enhancements

- [ ] Implement role-based access control (RBAC)
- [ ] Add code execution engine
- [ ] Implement WebSocket for real-time features
- [ ] Add leaderboards
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Admin dashboard
- [ ] Social features

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License
