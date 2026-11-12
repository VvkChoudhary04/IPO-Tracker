import { Router } from 'express';
import { healthRoutes } from './health.js';
import { applicantRoutes } from './applicant.routes.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.use(healthRoutes);

// Protected applicant CRUD endpoints
apiRouter.use('/applicants', applicantRoutes);

// Root API information endpoint
apiRouter.get('/', (_req, res) => {
  res.json({
    name: 'IPOTrack API Engine',
    version: '0.1.0',
    description: 'Automated Indian IPO allotment tracking and monitoring service',
    endpoints: {
      health: '/api/health',
      applicants: '/api/applicants',
    },
  });
});

export { apiRouter };
