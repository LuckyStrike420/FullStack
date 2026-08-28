# Wholesale Ops — Your Products B.V.

Order management systeem (verkoop, inkoop, containers, betalingen, assemblage, voorraad) voor Your Products B.V.

Zie [docs/datamodel-order-management.md](docs/datamodel-order-management.md) voor de volledige spec.

## Status

- [x] Databaseschema geschreven (`supabase/migrations/20260826120000_init_schema.sql`)
- [x] Toegepast op een Supabase-project
- [x] RLS + `verzendingen`-tabel + automatische voorraadmutaties (triggers) toegepast
- [x] Applicatielaag v1: Next.js-app met generieke object-engine, auth, Salesforce-achtige lijst-/detailweergaven en een deals-Kanban-board

## Applicatie draaien

1. `npm install`
2. `.env.local` moet `NEXT_PUBLIC_SUPABASE_URL` en `NEXT_PUBLIC_SUPABASE_ANON_KEY` bevatten (al aanwezig, gitignored).
3. `npm run dev` en open [http://localhost:3000](http://localhost:3000).
4. Inloggen met een account uit Supabase Auth (Authentication → Users in het dashboard om er meer aan te maken).

De applicatielaag is config-driven: alle objecten (klanten, deals, verkoop/inkooporders, containers, betalingen, assemblage, voorraad, …) worden gerenderd door één generieke list-/detail-/formulier-engine in `src/lib/objects/config.ts`. Nieuw object toevoegen of veld wijzigen? Dat bestand is de enige plek die je hoeft aan te passen.

## Schema toepassen (nieuwe migraties)

1. Connect de Supabase MCP-server op een (dev-)project, of gebruik de Supabase CLI (`supabase login --token …`, `supabase link --project-ref …`).
2. Laat een nieuwe migratie in `supabase/migrations/` even nalezen voordat hij wordt toegepast.
3. `supabase db push` om toe te passen; pas daarna `supabase gen types typescript --linked > src/types/database.ts` opnieuw uit te voeren zodat de types kloppen.

Alternatief zonder CLI/MCP: plak de inhoud van de migratie in de Supabase SQL editor.

## Schemakeuzes (niet expliciet in de spec, hier ingevuld)

- **Primary keys**: `bigint generated always as identity` in plaats van UUID's — dit is een intern tool met weinig gebruikers, oplopende id's zijn prettiger om mee te debuggen/lezen dan UUID's.
- **Status/enum-velden**: `text` + `check`-constraint in plaats van Postgres `enum`-types — statuswaarden zijn expliciet nog open voor iteratie (zie "Openstaande punten" in de spec), en een check-constraint is met een simpele `alter table` aan te passen; een Postgres enum-type vereist vervelendere migraties.
- **created_at**: op elke tabel toegevoegd voor auditing, niet in de spec gevraagd maar standaard en goedkoop.
- **Indexen**: expliciete index op elke foreign-key-kolom, omdat Postgres die niet automatisch indexeert en dit schema veel joins/lookups kent (met name `matching`, `container_regels`, `voorraadmutaties`).
- **bron_id** (in `voorraadmutaties`) heeft bewust geen foreign key, omdat het naar verschillende brontabellen kan wijzen afhankelijk van `bron_type` (polymorfe referentie).
- **RLS**: sinds de applicatielaag er is, staat op elke tabel `for all to authenticated using (true) with check (true)` — elke ingelogde gebruiker heeft volledige toegang, nog zonder rollen/permissies (zie `20260827090000_rls_policies.sql`). Verfijnen zodra rollen relevant worden.
- **`verzendingen`**: toegevoegd in een latere migratie (`20260827091000_...`) — spiegelt `ontvangsten`, want de spec vereist automatische uitgaande voorraadmutaties bij verzending, maar het oorspronkelijke schema had geen tabel om een verkoopregel als "verzonden" te registreren. Drie triggers in diezelfde migratie laten `voorraadmutaties` automatisch ontstaan bij een ontvangst, een verzending, en een assemblage die op `voltooid` gezet wordt.
