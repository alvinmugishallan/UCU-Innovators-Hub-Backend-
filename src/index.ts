import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import seedRoutes from './routes/seed';
import debugRoutes from './routes/debug';
import notificationsRoutes from './routes/notifications';
import metricsRoutes from './routes/metrics';
import managerRoutes from './routes/manager';
import salesRoutes from './routes/sales';
import customerRoutes from './routes/customer';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/analytics', analyticsRoutes);
  app.use('/api/seed', seedRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/metrics', metricsRoutes);
  app.use('/api/manager', managerRoutes);
  app.use('/api/sales', salesRoutes);
  app.use('/api/customer', customerRoutes);
  app.use('/api/debug', debugRoutes);

const start = async () => {
  try {
    await AppDataSource.initialize();
    console.log('DataSource initialized');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server listening on ${port}`));
  } catch (err) {
    console.error('Failed to initialize datasource', err);
    process.exit(1);
  }
};

start();