-- Fix infinite recursion in profiles RLS policies

-- Drop the problematic policy
DROP POLICY IF EXISTS "Employees can view customer profiles" ON public.profiles;

-- Recreate it using the has_role function (which doesn't cause recursion)
CREATE POLICY "Employees can view customer profiles"
ON public.profiles FOR SELECT
USING (
  public.has_role(auth.uid(), 'employee') 
  OR public.has_role(auth.uid(), 'admin')
);