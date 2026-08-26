# Wholesale Ops — Your Products B.V.

Order management systeem (verkoop, inkoop, containers, betalingen, assemblage, voorraad) voor Your Products B.V.

Zie [docs/datamodel-order-management.md](docs/datamodel-order-management.md) voor de volledige spec.

## Status

- [x] Databaseschema geschreven (`supabase/migrations/20260826120000_init_schema.sql`)
- [ ] Toegepast op een Supabase-project
- [ ] Applicatielaag (nog te bouwen)

## Schema toepassen

1. Connect de Supabase MCP-server op een (dev-)project.
2. Laat de migratie in `supabase/migrations/` even nalezen voordat hij wordt toegepast.
3. Pas daarna handmatig door naar productie.

Alternatief zonder MCP: plak de inhoud van de migratie in de Supabase SQL editor, of gebruik `supabase db push` met de Supabase CLI.

## Schemakeuzes (niet expliciet in de spec, hier ingevuld)

- **Primary keys**: `bigint generated always as identity` in plaats van UUID's — dit is een intern tool met weinig gebruikers, oplopende id's zijn prettiger om mee te debuggen/lezen dan UUID's.
- **Status/enum-velden**: `text` + `check`-constraint in plaats van Postgres `enum`-types — statuswaarden zijn expliciet nog open voor iteratie (zie "Openstaande punten" in de spec), en een check-constraint is met een simpele `alter table` aan te passen; een Postgres enum-type vereist vervelendere migraties.
- **created_at**: op elke tabel toegevoegd voor auditing, niet in de spec gevraagd maar standaard en goedkoop.
- **Indexen**: expliciete index op elke foreign-key-kolom, omdat Postgres die niet automatisch indexeert en dit schema veel joins/lookups kent (met name `matching`, `container_regels`, `voorraadmutaties`).
- **bron_id** (in `voorraadmutaties`) heeft bewust geen foreign key, omdat het naar verschillende brontabellen kan wijzen afhankelijk van `bron_type` (polymorfe referentie).
- Geen `rls` (row level security)-policies toegevoegd — "weinig gebruikers nu", en niet gevraagd. Voeg dit toe zodra multi-user/rollen relevant wordt (zie "Openstaande punten" in de spec).
