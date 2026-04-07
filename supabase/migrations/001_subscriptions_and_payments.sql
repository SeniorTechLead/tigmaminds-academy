-- Subscriptions table
create table if not exists public.subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  plan        text not null check (plan in ('online_monthly', 'online_yearly', 'in_person_monthly')),
  status      text not null default 'active' check (status in ('active', 'cancelled', 'expired', 'pending')),
  currency    text not null default 'INR' check (currency in ('INR', 'USD')),
  amount      numeric(10,2) not null,
  period_start timestamptz not null default now(),
  period_end   timestamptz not null,
  created_at   timestamptz not null default now()
);

create index idx_subscriptions_user_status on public.subscriptions(user_id, status);
create index idx_subscriptions_period_end on public.subscriptions(period_end);

-- Payments table
create table if not exists public.payments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  txnid           text not null unique,
  amount          numeric(10,2) not null,
  currency        text not null default 'INR' check (currency in ('INR', 'USD')),
  status          text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  plan            text not null,
  payu_mihpayid   text,
  payu_response   jsonb,
  created_at      timestamptz not null default now()
);

create index idx_payments_user on public.payments(user_id);
create index idx_payments_txnid on public.payments(txnid);

-- RLS: users can read their own subscriptions
alter table public.subscriptions enable row level security;

create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- RLS: users can read their own payments
alter table public.payments enable row level security;

create policy "Users can read own payments"
  on public.payments for select
  using (auth.uid() = user_id);
