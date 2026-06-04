create extension if not exists pgcrypto;

create table if not exists public.showings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  property_slug text not null,
  scheduled_at timestamptz not null,
  status text not null default 'programada',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint showings_status_check check (
    status in ('programada', 'confirmada', 'realizada', 'cancelada', 'no_asistio')
  )
);

create index if not exists showings_scheduled_at_idx
  on public.showings (scheduled_at asc);

create index if not exists showings_lead_id_scheduled_at_idx
  on public.showings (lead_id, scheduled_at desc);

create or replace function public.set_showings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_showings_updated_at on public.showings;

create trigger set_showings_updated_at
before update on public.showings
for each row
execute function public.set_showings_updated_at();

alter table public.showings enable row level security;

comment on table public.showings is
  'Internal CRM showing scheduler. Access through server-side service role only.';

comment on column public.showings.status is
  'Allowed values: programada, confirmada, realizada, cancelada, no_asistio.';
