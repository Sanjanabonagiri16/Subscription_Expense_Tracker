-- Create tables for the subscription management system

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Subscription Plans
create table public.subscription_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price decimal not null,
  billing_period text not null check (billing_period in ('monthly', 'quarterly', 'yearly')),
  features jsonb not null default '[]',
  trial_days integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  plan_id uuid references public.subscription_plans not null,
  status text not null check (status in ('active', 'cancelled', 'past_due')),
  current_period_end timestamp with time zone not null,
  cancel_at_period_end boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Invoices
create table public.invoices (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid references public.subscriptions not null,
  amount decimal not null,
  tax decimal not null default 0,
  status text not null check (status in ('draft', 'pending', 'paid', 'failed')),
  due_date timestamp with time zone not null,
  paid_at timestamp with time zone,
  items jsonb not null default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payment Methods
create table public.payment_methods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  type text not null check (type in ('card', 'bank_account', 'paypal')),
  provider text not null check (provider in ('stripe', 'paypal', 'square')),
  last4 text,
  expiry_month integer,
  expiry_year integer,
  is_default boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Revenue Metrics
create table public.revenue_metrics (
  id uuid primary key default uuid_generate_v4(),
  mrr decimal not null,
  arr decimal not null,
  churn_rate decimal not null,
  arpu decimal not null,
  ltv decimal not null,
  revenue_by_plan jsonb not null default '{}',
  historical_revenue jsonb not null default '[]',
  timeframe text not null check (timeframe in ('day', 'week', 'month', 'year')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invoices enable row level security;
alter table public.payment_methods enable row level security;
alter table public.revenue_metrics enable row level security;

-- Policies
create policy "Enable read access for authenticated users" on public.subscription_plans
  for select using (auth.role() = 'authenticated');

create policy "Enable read access for own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Enable read access for own invoices" on public.invoices
  for select using (
    auth.uid() in (
      select user_id from public.subscriptions where id = subscription_id
    )
  );

create policy "Enable read access for own payment methods" on public.payment_methods
  for select using (auth.uid() = user_id);

create policy "Enable read access for authenticated users" on public.revenue_metrics
  for select using (auth.role() = 'authenticated');
