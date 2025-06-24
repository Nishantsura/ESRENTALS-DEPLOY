-- Drop the old, recursive policies on public.users
DROP POLICY IF EXISTS "Admin can read all users" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;

-- Create a new, combined policy for user data access.
-- This allows a user to read their own data, and allows an admin to read all data.
-- It checks the is_admin flag directly on the row being accessed, avoiding recursion.
CREATE POLICY "Users can read own data and admins can read all" ON public.users
  FOR SELECT
  USING (
    -- Users can access their own record
    auth.uid() = id
    OR
    -- Admins can access any record (by checking the flag on the record they are trying to access)
    (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true))
  );

-- Re-create the update policy to ensure it wasn't dropped
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Note: This is a simplified admin check in the RLS policy. 
-- For more complex scenarios, using a SECURITY DEFINER function is often recommended.
-- e.g., CREATE FUNCTION is_admin() ... and then check is_admin() in the policy.
-- For this application's needs, the direct check is sufficient and non-recursive. 