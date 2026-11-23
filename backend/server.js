import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { seedDemoData } from './services/demoDataService.js';
import { scheduler } from './services/schedulerEngine.js';

import authRoutes from './routes/authRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import postRoutes from './routes/postRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import sentimentRoutes from './routes/sentimentRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import aiAssistantRoutes from './routes/aiAssistantRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import sepmRoutes from './routes/sepmRoutes.js';
import systemRoutes from './routes/systemRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/ai-assistant', aiAssistantRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sepm', sepmRoutes);
app.use('/api', systemRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    message: 'PostPilot AI API Server Running',
    docs: '/api/health',
    metrics: '/api/metrics'
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('\x1b[31m[Server Error]\x1b[0m', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server and Background Services
const startServer = async () => {
  await connectDB();
  await seedDemoData(false);
  scheduler.start(10000);

  app.listen(PORT, () => {
    console.log(`\n\x1b[32m🚀 PostPilot AI Backend Server running at http://localhost:${PORT}\x1b[0m`);
    console.log(`\x1b[34mℹ Project Code: P59 | Student: Maruthi Dapke (ENG24CS0127) | DSU\x1b[0m\n`);
  });
};

startServer();

export default app;
