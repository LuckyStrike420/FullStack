-- Wholesale Ops — Order Management Systeem Your Products B.V.
-- Initial schema, per docs/datamodel-order-management.md

-- =========================================================================
-- Stamgegevens
-- =========================================================================

create table klanten (
  klant_id        bigint generated always as identity primary key,
  naam            text not null,
  land            text not null,
  contactpersoon  text,
  email           text,
  created_at      timestamptz not null default now()
);

create table leveranciers (
  leverancier_id  bigint generated always as identity primary key,
  naam            text not null,
  land            text not null,
  created_at      timestamptz not null default now()
);

create table producten (
  product_id      bigint generated always as identity primary key,
  naam            text not null,
  type            text not null check (type in ('component', 'eindproduct')),
  heeft_maten     boolean not null default false,
  created_at      timestamptz not null default now()
);

-- =========================================================================
-- Sales pipeline
-- =========================================================================

create table deals (
  deal_id                 bigint generated always as identity primary key,
  klant_id                bigint not null references klanten (klant_id),
  stage                   text not null default 'nieuw'
                          check (stage in ('nieuw', 'offerte_verstuurd', 'onderhandeling', 'gewonnen', 'verloren')),
  incoterm                text not null check (incoterm in ('EXW', 'FOB')),
  verwachte_waarde        numeric(14, 2),
  verwachte_afsluitdatum  date,
  created_at              timestamptz not null default now()
);
create index deals_klant_id_idx on deals (klant_id);

create table deal_regels (
  deal_regel_id     bigint generated always as identity primary key,
  deal_id           bigint not null references deals (deal_id),
  product_id        bigint not null references producten (product_id),
  maat              text,
  verwacht_aantal   integer not null check (verwacht_aantal > 0),
  created_at        timestamptz not null default now()
);
create index deal_regels_deal_id_idx on deal_regels (deal_id);
create index deal_regels_product_id_idx on deal_regels (product_id);

-- =========================================================================
-- Verkoop
-- =========================================================================

create table verkooporders (
  so_id       bigint generated always as identity primary key,
  deal_id     bigint references deals (deal_id),
  klant_id    bigint not null references klanten (klant_id),
  incoterm    text not null check (incoterm in ('EXW', 'FOB')),
  orderdatum  date not null default current_date,
  status      text not null default 'open'
              check (status in ('open', 'deels_geleverd', 'geleverd', 'geannuleerd')),
  created_at  timestamptz not null default now()
);
create index verkooporders_deal_id_idx on verkooporders (deal_id);
create index verkooporders_klant_id_idx on verkooporders (klant_id);

create table verkooporder_regels (
  so_regel_id     bigint generated always as identity primary key,
  so_id           bigint not null references verkooporders (so_id),
  product_id      bigint not null references producten (product_id),
  maat            text,
  aantal          integer not null check (aantal > 0),
  prijs_per_stuk  numeric(14, 2) not null,
  valuta          text not null check (valuta in ('EUR', 'USD')),
  created_at      timestamptz not null default now()
);
create index verkooporder_regels_so_id_idx on verkooporder_regels (so_id);
create index verkooporder_regels_product_id_idx on verkooporder_regels (product_id);

-- =========================================================================
-- Inkoop
-- =========================================================================

create table inkooporders (
  po_id            bigint generated always as identity primary key,
  leverancier_id   bigint not null references leveranciers (leverancier_id),
  incoterm         text not null check (incoterm in ('EXW', 'FOB')),
  leadtime_weken   integer,
  orderdatum       date not null default current_date,
  status           text not null default 'besteld'
                   check (status in ('besteld', 'in_productie', 'onderweg', 'aangekomen')),
  created_at       timestamptz not null default now()
);
create index inkooporders_leverancier_id_idx on inkooporders (leverancier_id);

create table inkooporder_regels (
  po_regel_id     bigint generated always as identity primary key,
  po_id           bigint not null references inkooporders (po_id),
  product_id      bigint not null references producten (product_id),
  maat            text,
  aantal          integer not null check (aantal > 0),
  prijs_per_stuk  numeric(14, 2) not null,
  valuta          text not null check (valuta in ('EUR', 'USD')),
  created_at      timestamptz not null default now()
);
create index inkooporder_regels_po_id_idx on inkooporder_regels (po_id);
create index inkooporder_regels_product_id_idx on inkooporder_regels (product_id);

create table ontvangsten (
  ontvangst_id        bigint generated always as identity primary key,
  po_regel_id         bigint not null references inkooporder_regels (po_regel_id),
  lotnummer           text not null,
  aantal_ontvangen    integer not null check (aantal_ontvangen > 0),
  ontvangstdatum      date not null default current_date,
  houdbaarheidsdatum  date,
  created_at          timestamptz not null default now()
);
create index ontvangsten_po_regel_id_idx on ontvangsten (po_regel_id);

-- =========================================================================
-- Containers (FOB-logistiek)
-- =========================================================================

create table containers (
  container_id     bigint generated always as identity primary key,
  containernummer  text not null,
  etd              date,
  eta              date,
  status           text not null default 'gepland'
                   check (status in ('gepland', 'onderweg', 'aangekomen')),
  created_at       timestamptz not null default now()
);

create table container_regels (
  id            bigint generated always as identity primary key,
  container_id  bigint not null references containers (container_id),
  po_regel_id   bigint not null references inkooporder_regels (po_regel_id),
  aantal        integer not null check (aantal > 0),
  created_at    timestamptz not null default now()
);
create index container_regels_container_id_idx on container_regels (container_id);
create index container_regels_po_regel_id_idx on container_regels (po_regel_id);

-- =========================================================================
-- Betalingen
-- =========================================================================

create table betalingen (
  betaling_id          bigint generated always as identity primary key,
  po_id                bigint not null references inkooporders (po_id),
  type                 text not null check (type in ('deposit', 'restbetaling')),
  bedrag               numeric(14, 2) not null,
  valuta               text not null check (valuta in ('EUR', 'USD')),
  status               text not null default 'open'
                       check (status in ('open', 'betaald', 'doorgestuurd_naar_fabriek')),
  datum_ontvangen      date,
  datum_doorgestuurd   date,
  created_at           timestamptz not null default now()
);
create index betalingen_po_id_idx on betalingen (po_id);

-- =========================================================================
-- Matching verkoop <-> inkoop (many-to-many)
-- =========================================================================

create table matching (
  id                 bigint generated always as identity primary key,
  so_regel_id        bigint not null references verkooporder_regels (so_regel_id),
  po_regel_id        bigint not null references inkooporder_regels (po_regel_id),
  aantal_toegewezen  integer not null check (aantal_toegewezen > 0),
  created_at         timestamptz not null default now()
);
create index matching_so_regel_id_idx on matching (so_regel_id);
create index matching_po_regel_id_idx on matching (po_regel_id);

-- =========================================================================
-- Receptuur (BOM) & assemblage
-- =========================================================================

create table recepturen (
  receptuur_id        bigint generated always as identity primary key,
  eindproduct_id      bigint not null references producten (product_id),
  component_id        bigint not null references producten (product_id),
  aantal_per_eenheid  numeric(14, 4) not null check (aantal_per_eenheid > 0),
  created_at          timestamptz not null default now(),
  unique (eindproduct_id, component_id)
);
create index recepturen_eindproduct_id_idx on recepturen (eindproduct_id);
create index recepturen_component_id_idx on recepturen (component_id);

create table assemblages (
  assemblage_id        bigint generated always as identity primary key,
  eindproduct_id       bigint not null references producten (product_id),
  aantal_geproduceerd  integer not null check (aantal_geproduceerd > 0),
  datum                date not null default current_date,
  status               text not null default 'gepland' check (status in ('gepland', 'voltooid')),
  created_at           timestamptz not null default now()
);
create index assemblages_eindproduct_id_idx on assemblages (eindproduct_id);

create table assemblage_verbruik (
  id                bigint generated always as identity primary key,
  assemblage_id     bigint not null references assemblages (assemblage_id),
  ontvangst_id      bigint not null references ontvangsten (ontvangst_id),
  aantal_verbruikt  integer not null check (aantal_verbruikt > 0),
  created_at        timestamptz not null default now()
);
create index assemblage_verbruik_assemblage_id_idx on assemblage_verbruik (assemblage_id);
create index assemblage_verbruik_ontvangst_id_idx on assemblage_verbruik (ontvangst_id);

-- =========================================================================
-- Voorraad (100% afgeleid van mutaties)
-- =========================================================================

create table voorraadmutaties (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references producten (product_id),
  maat        text,
  richting    text not null check (richting in ('in', 'uit')),
  aantal      integer not null check (aantal > 0),
  bron_type   text not null
              check (bron_type in ('inkoop_ontvangst', 'verkoop_verzending', 'assemblage_verbruik', 'assemblage_output')),
  bron_id     bigint not null,
  datum       date not null default current_date,
  created_at  timestamptz not null default now()
);
create index voorraadmutaties_product_id_maat_idx on voorraadmutaties (product_id, maat);
create index voorraadmutaties_bron_idx on voorraadmutaties (bron_type, bron_id);

-- Actuele voorraad per product + maat, als view (geen losse tabel, geen dubbele boekhouding).
create view voorraad_actueel as
select
  product_id,
  maat,
  sum(case when richting = 'in' then aantal else -aantal end) as voorraad
from voorraadmutaties
group by product_id, maat;
