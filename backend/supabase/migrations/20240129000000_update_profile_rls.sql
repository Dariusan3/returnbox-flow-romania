-- Drop existing profile policies
drop policy if exists "Enable insert for authenticated users only" on profiles;
drop policy if exists "Users can view their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;

-- Create new policies for profiles
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Enable insert for authenticated users only"
  on profiles for insert
  with check (auth.role() = 'authenticated');