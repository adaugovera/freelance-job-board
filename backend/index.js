import dotenv from 'dotenv';
dotenv.config(); // loads backend/.env when run from backend

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

// ⬇️ FORCE IPv4 to avoid Node 22 localhost issues
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ error handler LAST
app.use(errorHandler);
