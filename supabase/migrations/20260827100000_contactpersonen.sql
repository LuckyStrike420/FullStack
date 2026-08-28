-- Wholesale Ops — CRM-uitbreiding: bedrijf (klanten) vs. contactpersonen
--
-- klanten wordt het bedrijfsniveau; contactpersoon/email verhuizen naar een
-- aparte contactpersonen-tabel (1 bedrijf -> meerdere contactpersonen).
-- Bedrijfsvelden uitgebreid met adres, telefoon, website, KvK/BTW-nummer.

alter table klanten drop column contactpersoon;
alter table klanten drop column email;

alter table klanten add column straat text;
alter table klanten add column postcode text;
alter table klanten add column plaats text;
alter table klanten add column telefoon text;
alter table klanten add column website text;
alter table klanten add column kvk_nummer text;
alter table klanten add column btw_nummer text;

create table contactpersonen (
  contactpersoon_id  bigint generated always as identity primary key,
  klant_id           bigint not null references klanten (klant_id),
  naam               text not null,
  functie            text,
  email              text,
  telefoon           text,
  hoofdcontact       boolean not null default false,
  notities           text,
  created_at         timestamptz not null default now(),
  unique (contactpersoon_id, klant_id)
);
create index contactpersonen_klant_id_idx on contactpersonen (klant_id);

alter table contactpersonen enable row level security;
create policy "authenticated_full_access" on contactpersonen
  for all to authenticated using (true) with check (true);

-- Optioneel contactpersoon-veld op deals en verkooporders. De samengestelde
-- FK (i.p.v. een simpele FK op contactpersoon_id alleen) dwingt af dat de
-- gekozen contactpersoon ook echt bij de klant van de deal/order hoort.
alter table deals add column contactpersoon_id bigint;
alter table deals add constraint deals_contactpersoon_klant_fkey
  foreign key (contactpersoon_id, klant_id) references contactpersonen (contactpersoon_id, klant_id);

alter table verkooporders add column contactpersoon_id bigint;
alter table verkooporders add constraint verkooporders_contactpersoon_klant_fkey
  foreign key (contactpersoon_id, klant_id) references contactpersonen (contactpersoon_id, klant_id);
