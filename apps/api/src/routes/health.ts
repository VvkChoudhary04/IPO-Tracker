import { Router, Request, Response } from 'express';
import { HealthResponse } from '@ipotrack/shared';
import { env } from '../config/env.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  const healthData: HealthResponse = {
    status: 'ok',
    service: 'ipotrack-api',
    version: '0.1.0',
    environment: env.nodeEnv,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };

  res.status(200).json({
    success: true,
    data: healthData,
  });
});

export const healthRoutes = router;
