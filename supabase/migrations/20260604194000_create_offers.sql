create extension if not exists pgcrypto;

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  property_slug text not null,
  amount bigint not null,
  payment_method text,
  conditions text,
  status text not null default 'recibida',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_status_check check (
    status in ('recibida', 'en_revision', 'contraoferta', 'aceptada', 'rechazada', 'retirada')
  ),
  constraint offers_payment_method_check check (
    payment_method is null
    or payment_method in ('contado', 'credito', 'mixto', 'no_definido')
  )
);

create index if not exists offers_created_at_idx
  on public.offers (created_at desc);

create index if not exists offers_lead_id_created_at_idx
  on public.offers (lead_id, created_at desc);

create or replace function public.set_offers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_offers_updated_at on public.offers;

create trigger set_offers_updated_at
before update on public.offers
for each row
execute function public.set_offers_updated_at();

alter table public.offers enable row level security;

comment on table public.offers is
  'Internal CRM buyer offers and negotiation records. Access through server-side service role only.';

comment on column public.offers.status is
  'Allowed values: recibida, en_revision, contraoferta, aceptada, rechazada, retirada.';

comment on column public.offers.payment_method is
  'Allowed values: contado, credito, mixto, no_definido.';
