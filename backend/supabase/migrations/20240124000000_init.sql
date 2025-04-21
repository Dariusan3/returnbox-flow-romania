-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text,
  last_name text,
  email text not null unique,
  phone text,
  address text,
  role text not null check (role in ('customer', 'merchant')),
  store_name text,
  website text,
  business_address text
);

-- Create returns table
create table returns (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_id uuid references profiles(id) on delete cascade not null,
  merchant_id uuid references profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'completed', 'rejected')),
  product_name text not null,
  reason text not null,
  description text,
  tracking_number text
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table returns enable row level security;

-- Create policies for profiles
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Enable insert for authenticated users only"
  on profiles for insert
  with check (true);

-- Create policies for returns
create policy "Customers can view their own returns"
  on returns for select
  using (auth.uid() = customer_id);

create policy "Merchants can view returns assigned to them"
  on returns for select
  using (auth.uid() = merchant_id);

create policy "Customers can create returns"
  on returns for insert
  with check (auth.uid() = customer_id);

create policy "Merchants can update return status"
  on returns for update
  using (auth.uid() = merchant_id)
  with check (auth.uid() = merchant_id);