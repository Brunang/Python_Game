import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './src/models/database.js';
import userRoutes from './routes/users.js';
import progressRoutes from './routes/progress.js';
import levelsRoutes from './routes/levels.js';
import codeRoutes from './routes/code.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/levels', levelsRoutes);
app.use('/api/code', codeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'SHE<Codes/> Backend is running', 
    timestamp: new Date(),
    endpoints: {
      users: '/api/users',
      progress: '/api/progress',
      levels: '/api/levels',
      code: '/api/code'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎮 Welcome to SHE<Codes/> Backend API',
    version: '1.0.0',
    docs: 'Check /api/health for available endpoints'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🎮 SHE<Codes/> Backend running on http://localhost:${PORT}`);
  console.log(`📚 API Health Check: http://localhost:${PORT}/api/health`);
});
