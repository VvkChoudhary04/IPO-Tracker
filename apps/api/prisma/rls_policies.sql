-- =========================================================================
-- IPOTrack: Supabase Row Level Security (RLS) Policies
--
-- PURPOSE:
-- These policies enforce data isolation at the PostgreSQL level.
-- They are a DEFENSE-IN-DEPTH layer alongside application-level
-- ownership checks in Prisma queries.
--
-- IMPORTANT:
-- RLS alone does NOT replace application-level ownership enforcement.
-- Prisma connects via the pooler using the database password (not a
-- Supabase client), so Prisma queries bypass RLS by default.
-- Application code MUST include WHERE userId = <authenticated_user_id>
-- in every query. RLS protects against direct Supabase client access
-- and acts as a safety net if application logic has a bug.
--
-- TESTING:
-- After applying these policies, test them explicitly:
--   1. Connect as an authenticated Supabase user via the JS client.
--   2. Attempt to SELECT/INSERT/UPDATE/DELETE rows belonging to
--      a DIFFERENT user.
--   3. Verify that every such cross-tenant operation is denied.
--   4. Verify that legitimate same-user operations succeed.
-- =========================================================================

-- =================================
-- 1. Enable RLS on all tables
-- =================================
-- FORCE ROW LEVEL SECURITY ensures RLS applies even to the table owner role,
-- which is critical because Supabase's postgres role owns these tables.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

ALTER TABLE applicant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicant_profiles FORCE ROW LEVEL SECURITY;

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications FORCE ROW LEVEL SECURITY;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications FORCE ROW LEVEL SECURITY;

ALTER TABLE allotment_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE allotment_audit_logs FORCE ROW LEVEL SECURITY;

ALTER TABLE ipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipos FORCE ROW LEVEL SECURITY;

-- =================================
-- 2. Users Table Policies
-- =================================
-- Users can only read and update their own profile row.
-- INSERT is handled by the backend service when syncing from Supabase Auth.

CREATE POLICY "users_select_own"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- =================================
-- 3. Applicant Profiles Policies
-- =================================
-- Full CRUD scoped to the authenticated user's own rows only.

CREATE POLICY "applicant_profiles_select_own"
  ON applicant_profiles FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "applicant_profiles_insert_own"
  ON applicant_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "applicant_profiles_update_own"
  ON applicant_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "applicant_profiles_delete_own"
  ON applicant_profiles FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- =================================
-- 4. Applications Policies
-- =================================
-- Strict tenant isolation: applications only visible to their owner.

CREATE POLICY "applications_select_own"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "applications_insert_own"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "applications_update_own"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "applications_delete_own"
  ON applications FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- =================================
-- 5. Notifications Policies
-- =================================
-- Users can read their own notifications and mark them as read.
-- INSERT is server-side only (background jobs, system events).

CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- =================================
-- 6. Allotment Audit Logs Policies
-- =================================
-- Read-only for users. INSERT is server-side only (background jobs).

CREATE POLICY "audit_logs_select_own"
  ON allotment_audit_logs FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- =================================
-- 7. IPO Catalog Policies
-- =================================
-- IPO catalog is public read for all authenticated users.
-- Write operations restricted to server-side admin (service-role)
-- which bypasses RLS. No explicit INSERT/UPDATE policy for
-- authenticated users — they cannot modify IPO data.

CREATE POLICY "ipos_select_public"
  ON ipos FOR SELECT
  TO authenticated
  USING (true);

-- =================================
-- 8. Service-role bypass note
-- =================================
-- The service-role key (used by background jobs in the Express API)
-- bypasses RLS automatically. This is intentional for:
--   - BullMQ workers writing allotment results
--   - System notification inserts
--   - IPO catalog data imports
-- The service-role key must NEVER be exposed to frontend code.
