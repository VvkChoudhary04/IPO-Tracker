import { Request, Response, NextFunction } from 'express';
import { getDbClient } from '../config/db.js';

/**
 * Ownership Middleware:
 * Ensures that the applicant profile referenced by :id belongs
 * to the authenticated user (req.user.id from verified JWT).
 *
 * SECURITY:
 * - User ID comes from req.user (set by requireAuth from verified token).
 * - Queries Prisma with BOTH id AND userId to prevent cross-tenant access.
 * - Returns a uniform "not found" message for both missing records and
 *   ownership violations to avoid enumeration attacks.
 * - Does NOT use the Supabase service-role client.
 */
export async function verifyApplicantOwnership(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const applicantId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
    });
    return;
  }

  if (!applicantId) {
    res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Applicant ID parameter required.' },
    });
    return;
  }

  try {
    const db = getDbClient();

    // Query with BOTH id AND userId in the WHERE clause.
    // This prevents cross-tenant data access at the query level
    // rather than fetching first and comparing after.
    const applicant = await db.applicantProfile.findFirst({
      where: { id: applicantId, userId },
      select: { id: true },
    });

    if (!applicant) {
      // Uniform error for both "does not exist" and "not owned by you"
      // to prevent applicant ID enumeration.
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Applicant profile not found.' },
      });
      return;
    }

    next();
  } catch (err: unknown) {
    next(err);
  }
}
