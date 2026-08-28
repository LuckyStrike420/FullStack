-- Wholesale Ops — Row Level Security
-- Geen rollen/permissies in v1: elke ingelogde (authenticated) gebruiker heeft
-- volledige lees-/schrijftoegang tot alle tabellen. Anonieme toegang is dicht.

alter table klanten enable row level security;
create policy "authenticated_full_access" on klanten
  for all to authenticated using (true) with check (true);

alter table leveranciers enable row level security;
create policy "authenticated_full_access" on leveranciers
  for all to authenticated using (true) with check (true);

alter table producten enable row level security;
create policy "authenticated_full_access" on producten
  for all to authenticated using (true) with check (true);

alter table deals enable row level security;
create policy "authenticated_full_access" on deals
  for all to authenticated using (true) with check (true);

alter table deal_regels enable row level security;
create policy "authenticated_full_access" on deal_regels
  for all to authenticated using (true) with check (true);

alter table verkooporders enable row level security;
create policy "authenticated_full_access" on verkooporders
  for all to authenticated using (true) with check (true);

alter table verkooporder_regels enable row level security;
create policy "authenticated_full_access" on verkooporder_regels
  for all to authenticated using (true) with check (true);

alter table inkooporders enable row level security;
create policy "authenticated_full_access" on inkooporders
  for all to authenticated using (true) with check (true);

alter table inkooporder_regels enable row level security;
create policy "authenticated_full_access" on inkooporder_regels
  for all to authenticated using (true) with check (true);

alter table ontvangsten enable row level security;
create policy "authenticated_full_access" on ontvangsten
  for all to authenticated using (true) with check (true);

alter table containers enable row level security;
create policy "authenticated_full_access" on containers
  for all to authenticated using (true) with check (true);

alter table container_regels enable row level security;
create policy "authenticated_full_access" on container_regels
  for all to authenticated using (true) with check (true);

alter table betalingen enable row level security;
create policy "authenticated_full_access" on betalingen
  for all to authenticated using (true) with check (true);

alter table matching enable row level security;
create policy "authenticated_full_access" on matching
  for all to authenticated using (true) with check (true);

alter table recepturen enable row level security;
create policy "authenticated_full_access" on recepturen
  for all to authenticated using (true) with check (true);

alter table assemblages enable row level security;
create policy "authenticated_full_access" on assemblages
  for all to authenticated using (true) with check (true);

alter table assemblage_verbruik enable row level security;
create policy "authenticated_full_access" on assemblage_verbruik
  for all to authenticated using (true) with check (true);

alter table voorraadmutaties enable row level security;
create policy "authenticated_full_access" on voorraadmutaties
  for all to authenticated using (true) with check (true);

-- voorraad_actueel is een view over voorraadmutaties; security_invoker zorgt
-- dat de RLS-policy van voorraadmutaties wordt toegepast op de aanroepende
-- gebruiker, in plaats van met de rechten van de view-eigenaar te draaien.
alter view voorraad_actueel set (security_invoker = true);
