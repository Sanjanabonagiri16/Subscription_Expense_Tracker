-- Payment Processing Tables

-- Payment Methods
alter table public.payment_methods
add column provider_token text,
add column provider_data jsonb,
add column billing_details jsonb;

-- Payment Intents
create table public.payment_intents (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid references public.subscriptions,
  payment_method_id uuid references public.payment_methods,
  amount decimal not null,
  currency text not null default 'usd',
  status text not null check (status in ('pending', 'processing', 'succeeded', 'failed', 'refunded', 'disputed')),
  error_message text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payment Retries
create table public.payment_retries (
  id uuid primary key default uuid_generate_v4(),
  payment_intent_id uuid references public.payment_intents not null,
  attempt_number integer not null,
  status text not null check (status in ('scheduled', 'processing', 'succeeded', 'failed')),
  next_retry_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Refunds
create table public.refunds (
  id uuid primary key default uuid_generate_v4(),
  payment_intent_id uuid references public.payment_intents not null,
  amount decimal not null,
  reason text,
  status text not null check (status in ('pending', 'succeeded', 'failed')),
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Disputes
create table public.disputes (
  id uuid primary key default uuid_generate_v4(),
  payment_intent_id uuid references public.payment_intents not null,
  amount decimal not null,
  reason text not null,
  status text not null check (status in ('open', 'under_review', 'won', 'lost')),
  evidence jsonb,
  due_by timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dunning Settings
create table public.dunning_settings (
  id uuid primary key default uuid_generate_v4(),
  retry_schedule integer[] not null default '{3,7,14}'::integer[], -- Days to retry
  max_attempts integer not null default 3,
  email_notifications boolean not null default true,
  sms_notifications boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.payment_intents enable row level security;
alter table public.payment_retries enable row level security;
alter table public.refunds enable row level security;
alter table public.disputes enable row level security;
alter table public.dunning_settings enable row level security;

-- Policies
create policy "Enable read access for own payment intents" on public.payment_intents
  for select using (
    auth.uid() in (
      select user_id from public.subscriptions where id = subscription_id
    )
  );

create policy "Enable read access for own payment retries" on public.payment_retries
  for select using (
    auth.uid() in (
      select s.user_id 
      from public.subscriptions s
      join public.payment_intents pi on pi.subscription_id = s.id
      where pi.id = payment_intent_id
    )
  );

create policy "Enable read access for own refunds" on public.refunds
  for select using (
    auth.uid() in (
      select s.user_id 
      from public.subscriptions s
      join public.payment_intents pi on pi.subscription_id = s.id
      where pi.id = payment_intent_id
    )
  );

create policy "Enable read access for own disputes" on public.disputes
  for select using (
    auth.uid() in (
      select s.user_id 
      from public.subscriptions s
      join public.payment_intents pi on pi.subscription_id = s.id
      where pi.id = payment_intent_id
    )
  );

-- Functions
create or replace function process_payment_retry()
returns trigger as $$
begin
  if NEW.status = 'failed' then
    insert into payment_retries (payment_intent_id, attempt_number, status, next_retry_at)
    select 
      NEW.id,
      coalesce((select max(attempt_number) from payment_retries where payment_intent_id = NEW.id), 0) + 1,
      'scheduled',
      now() + interval '1 day' * (
        select retry_schedule[1]
        from dunning_settings
        limit 1
      );
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Triggers
create trigger payment_retry_trigger
after update of status on payment_intents
for each row
when (NEW.status = 'failed')
execute function process_payment_retry();
