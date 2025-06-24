-- Drop the previous RLS policies for SELECT on public.users to avoid conflicts.
DROP POLICY IF EXISTS "Users can read own data and admins can read all" ON public.users;

-- It's good practice to ensure the old individual policies are also gone.
DROP POLICY IF EXISTS "Admin can read all users" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;


-- Create a function to safely check if the currently authenticated user is an admin.
-- This function is `SECURITY DEFINER`, so it runs with the privileges of the user who created it (the postgres role),
-- bypassing the RLS policies on the `users` table. This prevents the recursion issue.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- Check if the user is an admin by looking up their ID in the users table.
  -- The SECURITY DEFINER context allows this query to succeed without triggering RLS.
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Create a new, non-recursive RLS policy for selecting from the users table.
CREATE POLICY "Users can read own data and admins can read all" ON public.users
  FOR SELECT
  USING (
    -- Rule 1: A user can see their own row.
    auth.uid() = id
    OR
    -- Rule 2: An admin can see any row.
    is_admin()
  );

-- Ensure the update policy is still in place and correctly configured.
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id); 