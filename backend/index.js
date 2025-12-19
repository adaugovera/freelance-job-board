// Load .env robustly (handles running from project root or backend folder)
import './loadEnv.js';

// Global process event handlers to surface unexpected errors during development
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err && err.stack ? err.stack : err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason && reason.stack ? reason.stack : reason);
});

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import diagRoutes from './routes/diagRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/diag', diagRoutes);

app.get('/', (req, res) => {
  res.send('Freelance Job Board API running');
});

const PORT = Number(process.env.PORT) || 5000;

// Helpful startup info (non-sensitive)
console.log(`Starting API - environment: ${process.env.NODE_ENV || 'development'}, DB=${process.env.DB_NAME ? 'configured' : 'missing'}`);

// ⬇️ FORCE IPv4 to avoid Node 22 localhost issues
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ error handler LAST
app.use(errorHandler);
