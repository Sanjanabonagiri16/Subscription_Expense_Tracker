-- Add new fields to subscription_plans table
alter table public.subscription_plans
add column is_active boolean not null default true,
add column trial_days integer;

-- Create plan_discounts table
create table public.plan_discounts (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid references public.subscription_plans not null,
  discount_percent decimal not null,
  discounted_price decimal not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create grace_period_settings table
create table public.grace_period_settings (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid references public.subscription_plans not null,
  grace_period_days integer not null default 3,
  notifications_enabled boolean not null default true,
  auto_suspend_enabled boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.plan_discounts enable row level security;
alter table public.grace_period_settings enable row level security;

-- Policies
create policy "Enable read access for authenticated users" on public.plan_discounts
  for select using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.grace_period_settings
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for admins" on public.plan_discounts
  for all using (auth.jwt() ->> 'role' = 'admin');

create policy "Enable write access for admins" on public.grace_period_settings
  for all using (auth.jwt() ->> 'role' = 'admin');
