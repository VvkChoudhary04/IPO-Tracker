import { Request, Response, NextFunction } from 'express';
import { getSupabaseAuthClient } from '../config/supabase.js';
import { env } from '../config/env.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Authentication Middleware:
 * Validates Supabase JWT access token on incoming requests.
 * Injects verified user object into req.user.
 *
 * SECURITY DESIGN:
 * - Uses the anon-key Supabase client (NOT the service-role client).
 *   `auth.getUser(token)` validates the JWT signature server-side
 *   and does not require admin privileges.
 * - User ID is derived exclusively from the verified token payload.
 *   The request body is NEVER inspected for user identity.
 * - The service-role key is not loaded or used in this middleware.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or malformed Authorization header. Expected Bearer token.',
      },
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Bearer token is empty.',
      },
    });
    return;
  }

  // Development-only mock tokens when Supabase is not configured
  if (!env.supabaseUrl && !env.isProduction) {
    if (token.startsWith('dev-mock-token-')) {
      req.user = {
        id: token.replace('dev-mock-token-', ''),
        email: 'developer@example.com',
      };
      next();
      return;
    }
  }

  try {
    // Uses the anon-key client — NOT the service-role admin client.
    // auth.getUser(token) sends the token to Supabase Auth which
    // validates the JWT cryptographic signature and returns the user.
    const supabase = getSupabaseAuthClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: error?.message || 'Invalid or expired authentication session.',
        },
      });
      return;
    }

    // User identity is derived strictly from the verified token.
    // No user ID from request body, query params, or headers is trusted.
    req.user = {
      id: user.id,
      email: user.email || '',
    };

    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication verification failure';
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_SERVICE_ERROR',
        message,
      },
    });
  }
}
