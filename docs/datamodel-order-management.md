# Datamodel — Order Management Systeem Your Products B.V.

Dit document is de brief voor de eerste opzet in Claude Code: alle entiteiten, velden, relaties en ontwerpkeuzes die zijn afgesproken. Doel is een applicatie (aanbevolen: Supabase/Postgres als database, via de Supabase MCP-server) die verkoop, inkoop, containers, betalingen, assemblage en voorraad in één samenhangend systeem bijhoudt.

## Context

Your Products B.V. verkoopt DRTV-producten (long-form infomercial producten), van gezondheidsartikelen tot keukenproducten. Verkoop verloopt via twee sporen:

- **EXW** (ex-warehouse, Nederland): levering vanuit bestaande NL-voorraad, prijs in EUR, standaard 100% net.
- **FOB** (free on board, Shenzhen): levering rechtstreeks vanaf de fabriek via een specifieke container, prijs in USD, standaard 30/70 deposit/restbetaling, prijs geldig 30 dagen.

Sommige EXW-producten (met name supplementen en cosmetica) zijn geen los ingekocht eindproduct, maar worden samengesteld uit meerdere ingekochte componenten (grondstof, verpakking, labels) via een receptuur, in het Nederlandse magazijn.

Weinig gebruikers nu, mogelijk meer in de toekomst. Geen valuta-omrekening nodig; bedragen blijven in hun eigen valuta staan.

Dit is de transactionele kern. Een latere fase (niet in v1) voegt een WholesaleOps-achtige dashboard/CRM-laag toe: cross-suite KPI's, contactenbeheer, taken en een activiteiten-log bovenop dit datamodel.

## Ontwerpkeuzes (belangrijk voor de implementatie)

1. **Voorraad is 100% afgeleid.** Er is geen aparte "huidige voorraad"-tabel. De actuele voorraad per product/maat is een som van `voorraadmutaties`, net zoals de SUMIFS-aanpak in de eerdere Excel-versie.
2. **Voorraadmutaties ontstaan automatisch**, niet via handmatige invoer:
   - Een inkooporder-regel die als "ontvangen" wordt gemarkeerd → automatische inkomende mutatie.
   - Een verkooporder-regel die als "verzonden" wordt gemarkeerd → automatische uitgaande mutatie.
   - Een assemblage die voltooid wordt → uitgaande mutatie voor elk verbruikt component, inkomende mutatie voor het eindproduct.
3. **Matching tussen verkoop en inkoop is many-to-many.** Eén verkooporder kan door meerdere containers/inkooporders gedekt worden en andersom, vooral relevant bij FOB.
4. **Incoterm (EXW/FOB) zit op zowel inkoop- als verkooporders.** Het bepaalt valuta, standaard betaaltermijn, en fulfillmentproces (bestaande voorraad vs. specifieke container).
5. **Receptuur/assemblage** voor producten die zijn samengesteld uit meerdere ingekochte componenten (voornamelijk EXW, supplementen/cosmetica).
6. **Batch-traceerbaarheid**: elke fysieke ontvangst van een inkooporder-regel is een aparte partij met lotnummer en (waar relevant) houdbaarheidsdatum. Assemblages verbruiken specifieke partijen, niet alleen "component X".
7. **Sales pipeline**: deals doorlopen stages voordat ze een geconfirmeerde verkooporder worden. Niet elke verkooporder hoeft uit een deal te ontstaan.
8. **Geen valuta-omrekening.** Bedragen blijven in EUR (EXW) of USD (FOB) staan, geen ingebouwde wisselkoerslogica.

## Entiteiten

### klanten
| Veld | Type | Omschrijving |
|---|---|---|
| klant_id | PK | |
| naam | string | |
| land | string | |
| contactpersoon | string | optioneel |
| email | string | optioneel |

### leveranciers
| Veld | Type | Omschrijving |
|---|---|---|
| leverancier_id | PK | |
| naam | string | |
| land | string | |

### producten
| Veld | Type | Omschrijving |
|---|---|---|
| product_id | PK | |
| naam | string | gelijk aan bestaande productnamen (bijv. eZwell Fluidity Orthotics) |
| type | enum | `component` of `eindproduct` |
| heeft_maten | bool | |

### deals (pipeline)
| Veld | Type | Omschrijving |
|---|---|---|
| deal_id | PK | |
| klant_id | FK → klanten | |
| stage | enum | nieuw, offerte_verstuurd, onderhandeling, gewonnen, verloren |
| incoterm | enum | EXW of FOB |
| verwachte_waarde | decimal | |
| verwachte_afsluitdatum | date | |

### deal_regels
| Veld | Type | Omschrijving |
|---|---|---|
| deal_regel_id | PK | |
| deal_id | FK → deals | |
| product_id | FK → producten | |
| maat | string | |
| verwacht_aantal | int | |

### verkooporders
| Veld | Type | Omschrijving |
|---|---|---|
| so_id | PK | |
| deal_id | FK → deals | optioneel |
| klant_id | FK → klanten | |
| incoterm | enum | EXW of FOB |
| orderdatum | date | |
| status | enum | open, deels_geleverd, geleverd, geannuleerd |

### verkooporder_regels
| Veld | Type | Omschrijving |
|---|---|---|
| so_regel_id | PK | |
| so_id | FK → verkooporders | |
| product_id | FK → producten | |
| maat | string | |
| aantal | int | |
| prijs_per_stuk | decimal | |
| valuta | string | EUR of USD, afgeleid van incoterm |

### inkooporders
| Veld | Type | Omschrijving |
|---|---|---|
| po_id | PK | |
| leverancier_id | FK → leveranciers | |
| incoterm | enum | EXW of FOB |
| leadtime_weken | int | |
| orderdatum | date | |
| status | enum | besteld, in_productie, onderweg, aangekomen |

### inkooporder_regels
| Veld | Type | Omschrijving |
|---|---|---|
| po_regel_id | PK | |
| po_id | FK → inkooporders | |
| product_id | FK → producten | |
| maat | string | |
| aantal | int | |
| prijs_per_stuk | decimal | |
| valuta | string | |

### ontvangsten
| Veld | Type | Omschrijving |
|---|---|---|
| ontvangst_id | PK | |
| po_regel_id | FK → inkooporder_regels | |
| lotnummer | string | |
| aantal_ontvangen | int | |
| ontvangstdatum | date | |
| houdbaarheidsdatum | date | optioneel, relevant voor cosmetica/supplementen |

### containers
| Veld | Type | Omschrijving |
|---|---|---|
| container_id | PK | |
| containernummer | string | |
| etd | date | verwachte vertrekdatum |
| eta | date | verwachte aankomstdatum |
| status | enum | gepland, onderweg, aangekomen |

### container_regels
| Veld | Type | Omschrijving |
|---|---|---|
| id | PK | |
| container_id | FK → containers | |
| po_regel_id | FK → inkooporder_regels | |
| aantal | int | hoeveelheid van deze regel op deze container |

### betalingen
| Veld | Type | Omschrijving |
|---|---|---|
| betaling_id | PK | |
| po_id | FK → inkooporders | |
| type | enum | deposit, restbetaling |
| bedrag | decimal | |
| valuta | string | |
| status | enum | open, betaald, doorgestuurd_naar_fabriek |
| datum_ontvangen | date | |
| datum_doorgestuurd | date | optioneel |

### matching
| Veld | Type | Omschrijving |
|---|---|---|
| id | PK | |
| so_regel_id | FK → verkooporder_regels | |
| po_regel_id | FK → inkooporder_regels | |
| aantal_toegewezen | int | |

### recepturen (BOM)
| Veld | Type | Omschrijving |
|---|---|---|
| receptuur_id | PK | |
| eindproduct_id | FK → producten | |
| component_id | FK → producten | |
| aantal_per_eenheid | decimal | hoeveelheid component per 1 eenheid eindproduct |

### assemblages
| Veld | Type | Omschrijving |
|---|---|---|
| assemblage_id | PK | |
| eindproduct_id | FK → producten | |
| aantal_geproduceerd | int | |
| datum | date | |
| status | enum | gepland, voltooid |

### assemblage_verbruik
| Veld | Type | Omschrijving |
|---|---|---|
| id | PK | |
| assemblage_id | FK → assemblages | |
| ontvangst_id | FK → ontvangsten | specifieke partij die verbruikt is |
| aantal_verbruikt | int | |

### voorraadmutaties
| Veld | Type | Omschrijving |
|---|---|---|
| id | PK | |
| product_id | FK → producten | |
| maat | string | |
| richting | enum | in, uit |
| aantal | int | |
| bron_type | enum | inkoop_ontvangst, verkoop_verzending, assemblage_verbruik, assemblage_output |
| bron_id | int | id in de relevante brontabel |
| datum | date | |

## Aanbevolen technische aanpak

- **Database**: Supabase (Postgres), gratis tier is ruim voldoende om mee te starten.
- **Ontwikkelworkflow**: Claude Code gekoppeld aan Supabase via de Supabase MCP-server, werkend tegen een dev-project. Migraties altijd even nalezen voordat ze worden toegepast; pas los daarvan handmatig doorzetten naar productie.
- **Voorraad-view**: implementeer de actuele voorraad als database-view (`SUM` van `voorraadmutaties` gegroepeerd op product + maat), niet als losse tabel, om dubbele boekhouding te voorkomen.
- **Volgende fase (niet nu)**: dashboard/CRM-laag in de geest van WholesaleOps Hub — cross-suite KPI's, contactenbeheer, taken, activiteitenlog — bovenop dit datamodel.

## Openstaande punten voor latere iteratie

- Precieze statuswaarden en workflows (welke overgangen zijn toegestaan, bijv. kan een verkooporder van "geleverd" terug naar "open"?)
- Multi-user toegang en rollen (nu niet nodig, mogelijk later)
- Rapportage/dashboard-vereisten
