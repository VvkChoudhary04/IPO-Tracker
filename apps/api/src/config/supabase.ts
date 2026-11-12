import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * Two distinct Supabase server clients with separate privilege levels.
 *
 * 1. AUTH CLIENT (anon key):
 *    Used for per-request JWT verification via `auth.getUser(token)`.
 *    The anon key is sufficient because `getUser` validates the token's
 *    cryptographic signature against Supabase Auth — it does not require
 *    admin privileges. This client respects RLS policies.
 *
 * 2. ADMIN CLIENT (service-role key):
 *    Reserved strictly for server-initiated administrative operations
 *    that must bypass RLS (e.g., background job writes, system-level
 *    notifications, bulk IPO catalog updates). Never used in ordinary
 *    per-request auth verification or user-facing CRUD handlers.
 */

let authClientInstance: SupabaseClient | null = null;
let adminClientInstance: SupabaseClient | null = null;

/**
 * Returns the Supabase client configured with the PUBLIC anon key.
 * Used by auth middleware to verify user JWT tokens.
 *
 * SECURITY: This client respects RLS and does NOT have admin privileges.
 * auth.getUser(token) works with the anon key — it validates the JWT
 * signature server-side and returns the authenticated user payload.
 */
export function getSupabaseAuthClient(): SupabaseClient {
  if (authClientInstance) {
    return authClientInstance;
  }

  if (!env.supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is missing.');
  }

  if (!env.supabaseAnonKey) {
    throw new Error('SUPABASE_ANON_KEY environment variable is missing.');
  }

  authClientInstance = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return authClientInstance;
}

/**
 * Returns the Supabase client configured with the SERVICE ROLE key.
 * This client BYPASSES Row Level Security.
 *
 * RESTRICTED USAGE:
 * - Background job processing (BullMQ workers writing allotment results)
 * - System-level notifications and IPO catalog management
 * - Admin user management operations
 *
 * NEVER use this client for:
 * - Per-request JWT token verification
 * - Ordinary user-facing CRUD operations
 * - Any handler in the normal request/response cycle
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClientInstance) {
    return adminClientInstance;
  }

  if (!env.supabaseUrl) {
    throw new Error('SUPABASE_URL environment variable is missing.');
  }

  if (!env.supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured. ' +
      'The admin client is only available when the service-role key is set.'
    );
  }

  adminClientInstance = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClientInstance;
}

/**
 * Resets singleton instances. Used in tests only.
 */
export function _resetSupabaseClients(): void {
  authClientInstance = null;
  adminClientInstance = null;
}
