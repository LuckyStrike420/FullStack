-- Singleton settings row for app-wide branding (currently: header logo).
create table if not exists public.app_instellingen (
  id boolean primary key default true,
  logo_url text,
  constraint app_instellingen_singleton check (id = true)
);

insert into public.app_instellingen (id)
values (true)
on conflict (id) do nothing;

alter table public.app_instellingen enable row level security;

create policy authenticated_full_access on public.app_instellingen
  for all to authenticated using (true) with check (true);
