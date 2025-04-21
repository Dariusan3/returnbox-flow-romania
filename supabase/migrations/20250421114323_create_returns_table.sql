-- Create returns table
create table if not exists public.returns (
    id uuid default gen_random_uuid() primary key,
    merchant_id uuid not null references public.profiles(id),
    order_id text not null,
    product_name text not null,
    reason text not null,
    customer_email text not null,
    photo_url text,
    status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists returns_merchant_id_idx on public.returns(merchant_id);
create index if not exists returns_customer_email_idx on public.returns(customer_email);
create index if not exists returns_status_idx on public.returns(status);

-- Add RLS policies
alter table public.returns enable row level security;

-- Allow merchants to view their own returns
create policy "Merchants can view their own returns"
    on public.returns for select
    to authenticated
    using (merchant_id = auth.uid() and auth.jwt()->>'role' = 'merchant');

-- Allow customers to view their own returns
create policy "Customers can view their own returns"
    on public.returns for select
    to authenticated
    using (customer_email = auth.jwt()->>'email' and auth.jwt()->>'role' = 'customer');

-- Allow customers to create returns
create policy "Customers can create returns"
    on public.returns for insert
    to authenticated
    with check (auth.jwt()->>'role' = 'customer');

-- Allow merchants to update their own returns
create policy "Merchants can update their own returns"
    on public.returns for update
    to authenticated
    using (merchant_id = auth.uid() and auth.jwt()->>'role' = 'merchant')
    with check (merchant_id = auth.uid() and auth.jwt()->>'role' = 'merchant');