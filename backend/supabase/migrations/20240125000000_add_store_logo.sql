-- Add store_logo column to profiles table
alter table profiles add column store_logo text;

-- Update RLS policies to include store_logo
create policy "Users can update their own store logo"
  on profiles for update
  using (auth.uid() = id);