-- Drop the existing insert policy
drop policy if exists "Enable insert for authenticated users only" on profiles;

-- Create a new insert policy that allows authenticated users to create profiles
create policy "Enable insert for authenticated users only"
  on profiles for insert
  with check (auth.role() = 'authenticated');