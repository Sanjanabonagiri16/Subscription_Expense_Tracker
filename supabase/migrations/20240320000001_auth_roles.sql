-- Create roles and permissions tables

-- Roles table
create table public.roles (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique check (name in ('admin', 'accountant', 'support', 'user')),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User roles junction table
create table public.user_roles (
  user_id uuid references auth.users not null,
  role_id uuid references public.roles not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, role_id)
);

-- Permissions table
create table public.permissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Role permissions junction table
create table public.role_permissions (
  role_id uuid references public.roles not null,
  permission_id uuid references public.permissions not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (role_id, permission_id)
);

-- Enable RLS
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;

-- Policies
create policy "Allow read access for authenticated users" on public.roles
  for select using (auth.role() = 'authenticated');

create policy "Allow read access for authenticated users" on public.permissions
  for select using (auth.role() = 'authenticated');

create policy "Allow read access for own roles" on public.user_roles
  for select using (auth.uid() = user_id);

create policy "Allow read access for authenticated users" on public.role_permissions
  for select using (auth.role() = 'authenticated');

-- Insert default roles
insert into public.roles (name, description) values
  ('admin', 'Full system access'),
  ('accountant', 'Access to financial data and reports'),
  ('support', 'Customer support access'),
  ('user', 'Basic user access');

-- Insert default permissions
insert into public.permissions (name, description) values
  ('view_dashboard', 'View main dashboard'),
  ('manage_subscriptions', 'Manage subscription plans'),
  ('view_reports', 'View financial reports'),
  ('manage_users', 'Manage user accounts'),
  ('view_support', 'View support tickets'),
  ('manage_billing', 'Manage billing and invoices');

-- Assign permissions to roles
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where
  (r.name = 'admin') or
  (r.name = 'accountant' and p.name in ('view_dashboard', 'view_reports', 'manage_billing')) or
  (r.name = 'support' and p.name in ('view_dashboard', 'view_support')) or
  (r.name = 'user' and p.name in ('view_dashboard'));

-- Function to get user roles
create or replace function public.get_user_roles(user_id uuid)
returns setof public.roles
language sql
security definer
set search_path = public
stable
as $$
  select r.*
  from public.roles r
  join public.user_roles ur on ur.role_id = r.id
  where ur.user_id = user_id;
$$;

-- Function to check if user has permission
create or replace function public.has_permission(user_id uuid, permission_name text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.roles r
    join public.user_roles ur on ur.role_id = r.id
    join public.role_permissions rp on rp.role_id = r.id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = user_id
    and p.name = permission_name
  );
$$;
