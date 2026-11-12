import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { ApplicantService } from '../services/applicant.service.js';
import { z } from 'zod';
import { InvestorCategory } from '@prisma/client';

const router = Router();

// Validation schema for creating applicant
const createApplicantSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  plainPan: z
    .string()
    .length(10, 'PAN must be exactly 10 characters')
    .regex(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/, 'Invalid PAN format (e.g. ABCDE1234F)'),
  category: z.nativeEnum(InvestorCategory).optional(),
  dematAccount: z.string().max(30).optional(),
  email: z.string().email().optional(),
  phoneMasked: z.string().max(20).optional(),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'Applicant consent is required' }),
  }),
});

// Validation schema for updating applicant
const updateApplicantSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  category: z.nativeEnum(InvestorCategory).optional(),
  dematAccount: z.string().max(30).optional(),
  email: z.string().email().optional(),
  phoneMasked: z.string().max(20).optional(),
  isActive: z.boolean().optional(),
});

// All applicant routes require verified authentication
router.use(requireAuth);

/**
 * GET /api/applicants
 * List all applicant profiles belonging to authenticated user
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const applicants = await ApplicantService.listApplicants(userId);

    res.json({
      success: true,
      data: applicants,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/applicants
 * Create new applicant profile with encrypted PAN
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const validated = createApplicantSchema.parse(req.body);

    const applicant = await ApplicantService.createApplicant(userId, validated);

    res.status(201).json({
      success: true,
      data: applicant,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: err.errors[0]?.message || 'Invalid input data',
          details: err.errors,
        },
      });
      return;
    }
    next(err);
  }
});

/**
 * GET /api/applicants/:id
 * Retrieve single applicant with ownership check
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const applicant = await ApplicantService.getApplicant(userId, req.params.id);

    res.json({
      success: true,
      data: applicant,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/applicants/:id
 * Update applicant metadata with ownership check
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const validated = updateApplicantSchema.parse(req.body);

    const updated = await ApplicantService.updateApplicant(userId, req.params.id, validated);

    res.json({
      success: true,
      data: updated,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: err.errors[0]?.message || 'Invalid update parameters',
          details: err.errors,
        },
      });
      return;
    }
    next(err);
  }
});

/**
 * DELETE /api/applicants/:id
 * Delete applicant with ownership check
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await ApplicantService.deleteApplicant(userId, req.params.id);

    res.json({
      success: true,
      message: 'Applicant profile removed successfully.',
    });
  } catch (err) {
    next(err);
  }
});

export const applicantRoutes = router;

