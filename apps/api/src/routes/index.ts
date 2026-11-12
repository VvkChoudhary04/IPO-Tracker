import { Router } from 'express';
import { healthRoutes } from './health.js';

const apiRouter = Router();

// Mount sub-routers
apiRouter.use(healthRoutes);

// Root API information endpoint
apiRouter.get('/', (_req, res) => {
  res.json({
    name: 'IPOTrack API Engine',
    version: '0.1.0',
    description: 'Automated Indian IPO allotment tracking and monitoring service',
    endpoints: {
      health: '/health',
    },
  });
});

export { apiRouter };
