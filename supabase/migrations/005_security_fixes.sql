-- =====================================================================
-- 005: SECURITY & CONSISTENCY FIXES
-- =====================================================================

-- ---------------------------------------------------------------------
-- FIX 1: Privilege escalation on sign-up.
-- The previous handle_new_user() trusted raw_user_meta_data->>'role',
-- which is fully client-controlled (the public registration form sent
-- it). Any anonymous visitor could self-register as 'admin'.
--
-- New behavior:
--   * Role is NEVER taken from client-supplied metadata.
--   * The very first user to register bootstraps as 'admin' so the
--     system is usable; everyone after that defaults to 'sales_agent'.
--   * Admins promote/demote other users from Settings → Users (guarded
--     by the is_admin() RLS policy on profiles).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role user_role;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles) THEN
    assigned_role := 'admin';      -- first user bootstraps as admin
  ELSE
    assigned_role := 'sales_agent';-- never trust client-supplied role
  END IF;

  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    assigned_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- FIX 2: A regular user could escalate their OWN role via the
-- "Users can update own profile" policy (UPDATE profiles SET role=...).
-- Re-scope self-updates so role/is_active can only be changed by admins.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
    AND is_active = (SELECT is_active FROM profiles WHERE id = auth.uid())
  );

-- ---------------------------------------------------------------------
-- FIX 3: generated_contents had no DELETE policy, so the "delete"
-- action in Content History silently failed server-side while the row
-- vanished from the UI. Allow owners to delete their own content and
-- managers to delete any.
-- ---------------------------------------------------------------------
CREATE POLICY "Users can delete own content" ON generated_contents
  FOR DELETE USING (created_by = auth.uid());
CREATE POLICY "Managers can delete any content" ON generated_contents
  FOR DELETE USING (is_admin_or_manager());

-- ---------------------------------------------------------------------
-- FIX 4: Ensure company_settings is a singleton so the Settings page
-- (.single()) can never break and upserts can't create duplicate rows.
-- ---------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS company_settings_singleton
  ON company_settings ((true));
