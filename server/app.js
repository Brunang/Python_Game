import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './src/models/database.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import userRoutes from './src/routes/userRoutes.js';
import progressRoutes from './src/routes/progressRoutes.js';
import levelRoutes from './src/routes/levelRoutes.js';
import codeRoutes from './src/routes/codeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// __dirname shim for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initializeDatabase();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/code', codeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ SHE<Codes/> Backend is running',
    timestamp: new Date(),
    endpoints: {
      users: '/api/users',
      progress: '/api/progress',
      levels: '/api/levels',
      code: '/api/code',
    },
  });
});

// Serve static files from client directory
const clientPath = path.resolve(__dirname, '..', 'client');
app.use(express.static(clientPath));

// Root endpoint: serve the client StartScreen if available, otherwise return JSON info
app.get('/', (req, res) => {
  try {
    const startPath = path.resolve(
      __dirname,
      '..', // move to repo root
      'client',
      'src',
      'scenes',
      'StartScreen.html'
    );

    return res.sendFile(startPath, (err) => {
      if (err) {
        console.error('Failed to send StartScreen:', err);
        return res.json({
          message: '🎮 Welcome to SHE<Codes/> Backend API',
          version: '1.0.0',
          environment: process.env.NODE_ENV,
          docs: 'Check /api/health for available endpoints',
          warning: 'StartScreen.html not found or failed to send',
        });
      }
    });
  } catch (err) {
    console.error('Error resolving StartScreen path:', err);
    return res.json({
      message: '🎮 Welcome to SHE<Codes/> Backend API',
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      docs: 'Check /api/health for available endpoints',
      error: err.message,
    });
  }
});

// 404 handler for API routes only (comes after static file serving)
app.use((req, res) => {
  // If the request path starts with /api, return JSON error
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  // Otherwise, send 404 HTML or redirect to home
  res.status(404).send('<h1>Page Not Found</h1><a href="/">Go Home</a>');
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🎮 SHE<Codes/> Backend Server');
  console.log('='.repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📚 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Home: http://localhost:${PORT}`);
  console.log('='.repeat(50) + '\n');
});
