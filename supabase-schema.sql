-- Job Tracker — Supabase schema
-- Run this in your Supabase SQL editor to set up the database.

-- Enable RLS on all tables (users only see their own data)

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,

  -- Core info
  company text not null,
  role_title text not null,
  role_url text,
  source text, -- linkedin, company_site, referral, cold_outreach, other
  resume_variant text, -- staff_frontend, head_of_fe, em, vp_eng, technical_fellow, staff_platform

  -- Status
  status text not null default 'active', -- active, rejected, withdrawn, offer, accepted

  -- Dates
  applied_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Rejection info
  rejected_at date,
  rejection_stage text, -- application, phone_screen, technical, interview, final
  rejection_reason text, -- free text
  rejection_category text, -- no_feedback, overqualified, underqualified, timezone, compensation, other

  -- Offer info
  offer_date date,
  offer_amount text,
  offer_notes text,

  -- General notes
  notes text,

  -- Salary/comp expectations
  salary_min integer,
  salary_max integer,
  salary_currency text default 'USD'
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,

  stage text not null, -- applied, phone_screen, technical_screen, interview_1, interview_2, interview_3, final_round, offer, rejected, withdrawn
  event_date date,
  notes text,
  created_at timestamptz default now()
);

-- Row level security
alter table public.applications enable row level security;
alter table public.timeline_events enable row level security;

-- Policies: users only see and modify their own rows
create policy "Users can read own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.applications for update
  using (auth.uid() = user_id);

create policy "Users can delete own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

create policy "Users can read own timeline events"
  on public.timeline_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own timeline events"
  on public.timeline_events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own timeline events"
  on public.timeline_events for update
  using (auth.uid() = user_id);

create policy "Users can delete own timeline events"
  on public.timeline_events for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_applications_updated
  before update on public.applications
  for each row execute procedure public.handle_updated_at();
