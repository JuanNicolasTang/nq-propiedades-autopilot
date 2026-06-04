create extension if not exists pgcrypto;

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  event_type text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists lead_events_lead_id_created_at_idx
  on public.lead_events (lead_id, created_at desc);

alter table public.lead_events enable row level security;

comment on table public.lead_events is
  'Internal CRM timeline for lead status changes and notes. Access through server-side service role only.';

comment on column public.lead_events.event_type is
  'Suggested values: status_changed, note_added.';
