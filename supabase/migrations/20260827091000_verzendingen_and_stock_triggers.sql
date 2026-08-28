-- Wholesale Ops — verzendingen + automatische voorraadmutaties
--
-- Ontbrekend stuk t.o.v. de spec: een verkooporder-regel die "verzonden" wordt
-- gemarkeerd moet automatisch een uitgaande voorraadmutatie geven, net zoals
-- een ontvangst op de inkoopkant dat al doet. Er was echter geen tabel om een
-- fysieke verzending (met datum/aantal) tegen een so_regel te registreren.
-- `verzendingen` spiegelt `ontvangsten` één-op-één voor deze rol.
--
-- Daarnaast worden hier de drie triggers toegevoegd die voorraadmutaties.md
-- (§ "Ontwerpkeuzes", punt 2) automatisch laten ontstaan i.p.v. handmatig.

-- =========================================================================
-- verzendingen
-- =========================================================================

create table verzendingen (
  verzending_id     bigint generated always as identity primary key,
  so_regel_id       bigint not null references verkooporder_regels (so_regel_id),
  aantal_verzonden  integer not null check (aantal_verzonden > 0),
  verzenddatum      date not null default current_date,
  created_at        timestamptz not null default now()
);
create index verzendingen_so_regel_id_idx on verzendingen (so_regel_id);

alter table verzendingen enable row level security;
create policy "authenticated_full_access" on verzendingen
  for all to authenticated using (true) with check (true);

-- =========================================================================
-- Trigger 1: ontvangsten insert -> inkomende voorraadmutatie
-- =========================================================================

create function trg_ontvangsten_voorraadmutatie() returns trigger as $$
declare
  v_product_id bigint;
  v_maat       text;
begin
  select product_id, maat into v_product_id, v_maat
  from inkooporder_regels
  where po_regel_id = new.po_regel_id;

  insert into voorraadmutaties (product_id, maat, richting, aantal, bron_type, bron_id, datum)
  values (v_product_id, v_maat, 'in', new.aantal_ontvangen, 'inkoop_ontvangst', new.ontvangst_id, new.ontvangstdatum);

  return new;
end;
$$ language plpgsql;

create trigger ontvangsten_after_insert
  after insert on ontvangsten
  for each row execute function trg_ontvangsten_voorraadmutatie();

-- =========================================================================
-- Trigger 2: verzendingen insert -> uitgaande voorraadmutatie
-- =========================================================================

create function trg_verzendingen_voorraadmutatie() returns trigger as $$
declare
  v_product_id bigint;
  v_maat       text;
begin
  select product_id, maat into v_product_id, v_maat
  from verkooporder_regels
  where so_regel_id = new.so_regel_id;

  insert into voorraadmutaties (product_id, maat, richting, aantal, bron_type, bron_id, datum)
  values (v_product_id, v_maat, 'uit', new.aantal_verzonden, 'verkoop_verzending', new.verzending_id, new.verzenddatum);

  return new;
end;
$$ language plpgsql;

create trigger verzendingen_after_insert
  after insert on verzendingen
  for each row execute function trg_verzendingen_voorraadmutatie();

-- =========================================================================
-- Trigger 3: assemblages.status -> 'voltooid' -> verbruik- en outputmutaties
-- Vuurt alleen bij de overgang náár voltooid, niet bij een herhaalde update
-- terwijl de status al voltooid was (voorkomt dubbele boekingen).
-- =========================================================================

create function trg_assemblages_voltooid_voorraadmutatie() returns trigger as $$
declare
  v_rec record;
begin
  if new.status = 'voltooid' and old.status is distinct from 'voltooid' then

    for v_rec in
      select av.id, av.aantal_verbruikt, ir.product_id, ir.maat
      from assemblage_verbruik av
      join ontvangsten o on o.ontvangst_id = av.ontvangst_id
      join inkooporder_regels ir on ir.po_regel_id = o.po_regel_id
      where av.assemblage_id = new.assemblage_id
    loop
      insert into voorraadmutaties (product_id, maat, richting, aantal, bron_type, bron_id, datum)
      values (v_rec.product_id, v_rec.maat, 'uit', v_rec.aantal_verbruikt, 'assemblage_verbruik', v_rec.id, new.datum);
    end loop;

    -- assemblages heeft geen maat-kolom; eindproduct-output wordt met maat = null
    -- geboekt. Aanvaardbaar zolang samengestelde EXW-eindproducten (supplementen/
    -- cosmetica, per de spec) geen maatvarianten hebben.
    insert into voorraadmutaties (product_id, maat, richting, aantal, bron_type, bron_id, datum)
    values (new.eindproduct_id, null, 'in', new.aantal_geproduceerd, 'assemblage_output', new.assemblage_id, new.datum);

  end if;
  return new;
end;
$$ language plpgsql;

create trigger assemblages_after_update
  after update on assemblages
  for each row execute function trg_assemblages_voltooid_voorraadmutatie();
