-- Create refund_policies table
create table if not exists public.refund_policies (
  id uuid default gen_random_uuid() primary key,
  merchant_id uuid not null references auth.users(id),
  condition_description text not null,
  refund_percentage integer not null check (refund_percentage between 0 and 100),
  processing_time_days integer not null default 14,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create pickups table
create table if not exists public.pickups (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id),
  return_id uuid not null references public.returns(id),
  pickup_date date not null,
  time_slot text not null check (time_slot in ('morning', 'afternoon', 'evening')),
  address text not null,
  city text not null,
  postal_code text not null,
  package_size text not null check (package_size in ('small', 'medium', 'large')),
  courier_tracking_number text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'scheduled', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists refund_policies_merchant_id_idx on public.refund_policies(merchant_id);
create index if not exists pickups_user_id_idx on public.pickups(user_id);
create index if not exists pickups_return_id_idx on public.pickups(return_id);