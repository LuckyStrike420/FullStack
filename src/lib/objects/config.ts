import { normalTransitions } from "./status-transitions";
import type { EnumOption, ObjectConfig } from "./types";

const INCOTERM_OPTIONS: EnumOption[] = [
  { value: "EXW", label: "EXW", color: "gray" },
  { value: "FOB", label: "FOB", color: "blue" },
];

const VALUTA_OPTIONS: EnumOption[] = [
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
];

export const OBJECTS: ObjectConfig[] = [
  // ---------------------------------------------------------------------
  // Stamgegevens
  // ---------------------------------------------------------------------
  {
    slug: "klanten",
    table: "klanten",
    primaryKey: "klant_id",
    labelSingular: "Klant",
    labelPlural: "Klanten",
    navGroup: "Stamgegevens",
    showInNav: true,
    titleField: "naam",
    defaultSort: { field: "naam", dir: "asc" },
    fields: [
      { name: "naam", label: "Naam", type: "text", listVisible: true, searchable: true, required: true },
      { name: "land", label: "Land", type: "text", listVisible: true, filterable: true, required: true },
      { name: "plaats", label: "Plaats", type: "text", listVisible: true, searchable: true },
      { name: "straat", label: "Straat", type: "text" },
      { name: "postcode", label: "Postcode", type: "text" },
      { name: "telefoon", label: "Telefoon", type: "text" },
      { name: "website", label: "Website", type: "text" },
      { name: "kvk_nummer", label: "KvK-nummer", type: "text" },
      { name: "btw_nummer", label: "BTW-nummer", type: "text" },
    ],
    relatedLists: [
      { object: "contactpersonen", foreignKey: "klant_id", label: "Contactpersonen" },
      { object: "deals", foreignKey: "klant_id", label: "Deals" },
      { object: "verkooporders", foreignKey: "klant_id", label: "Verkooporders" },
    ],
  },
  {
    slug: "contactpersonen",
    table: "contactpersonen",
    primaryKey: "contactpersoon_id",
    labelSingular: "Contactpersoon",
    labelPlural: "Contactpersonen",
    navGroup: "Stamgegevens",
    showInNav: true,
    titleField: "naam",
    defaultSort: { field: "naam", dir: "asc" },
    fields: [
      { name: "klant_id", label: "Klant", type: "fk", references: "klanten", labelField: "naam", listVisible: true, searchable: true, required: true },
      { name: "naam", label: "Naam", type: "text", listVisible: true, searchable: true, required: true },
      { name: "functie", label: "Functie", type: "text", listVisible: true },
      { name: "email", label: "E-mail", type: "text", listVisible: true },
      { name: "telefoon", label: "Telefoon", type: "text", listVisible: true },
      { name: "hoofdcontact", label: "Hoofdcontact", type: "boolean", listVisible: true },
      { name: "notities", label: "Notities", type: "textarea" },
    ],
  },
  {
    slug: "leveranciers",
    table: "leveranciers",
    primaryKey: "leverancier_id",
    labelSingular: "Leverancier",
    labelPlural: "Leveranciers",
    navGroup: "Stamgegevens",
    showInNav: true,
    titleField: "naam",
    defaultSort: { field: "naam", dir: "asc" },
    fields: [
      { name: "naam", label: "Naam", type: "text", listVisible: true, searchable: true, required: true },
      { name: "land", label: "Land", type: "text", listVisible: true, filterable: true, required: true },
    ],
    relatedLists: [{ object: "inkooporders", foreignKey: "leverancier_id", label: "Inkooporders" }],
  },
  {
    slug: "producten",
    table: "producten",
    primaryKey: "product_id",
    labelSingular: "Product",
    labelPlural: "Producten",
    navGroup: "Stamgegevens",
    showInNav: true,
    titleField: "naam",
    defaultSort: { field: "naam", dir: "asc" },
    fields: [
      { name: "naam", label: "Naam", type: "text", listVisible: true, searchable: true, required: true },
      {
        name: "type",
        label: "Type",
        type: "enum",
        listVisible: true,
        filterable: true,
        required: true,
        options: [
          { value: "component", label: "Component", color: "gray" },
          { value: "eindproduct", label: "Eindproduct", color: "blue" },
        ],
      },
      { name: "heeft_maten", label: "Heeft maten", type: "boolean", listVisible: true },
    ],
    relatedLists: [
      { object: "recepturen", foreignKey: "eindproduct_id", label: "Receptuur (als eindproduct)" },
      { object: "recepturen", foreignKey: "component_id", label: "Gebruikt in receptuur (als component)" },
      { object: "assemblages", foreignKey: "eindproduct_id", label: "Assemblages" },
      { object: "deal_regels", foreignKey: "product_id", label: "Dealregels" },
      { object: "verkooporder_regels", foreignKey: "product_id", label: "Verkooporder-regels" },
      { object: "inkooporder_regels", foreignKey: "product_id", label: "Inkooporder-regels" },
    ],
  },

  // ---------------------------------------------------------------------
  // Sales pipeline
  // ---------------------------------------------------------------------
  {
    slug: "deals",
    table: "deals",
    primaryKey: "deal_id",
    labelSingular: "Deal",
    labelPlural: "Deals",
    navGroup: "Verkoop",
    showInNav: true,
    titleField: "deal_id",
    defaultSort: { field: "created_at", dir: "desc" },
    fields: [
      {
        name: "klant_id",
        label: "Klant",
        type: "fk",
        references: "klanten",
        labelField: "naam",
        listVisible: true,
        searchable: true,
        required: true,
      },
      {
        name: "contactpersoon_id",
        label: "Contactpersoon",
        type: "fk",
        references: "contactpersonen",
        labelField: "naam",
        nullable: true,
        dependsOnField: "klant_id",
      },
      {
        name: "stage",
        label: "Stage",
        type: "enum",
        isStatusField: true,
        listVisible: true,
        filterable: true,
        required: true,
        options: [
          { value: "nieuw", label: "Nieuw", color: "gray" },
          { value: "offerte_verstuurd", label: "Offerte verstuurd", color: "blue" },
          { value: "onderhandeling", label: "Onderhandeling", color: "amber" },
          { value: "gewonnen", label: "Gewonnen", color: "green" },
          { value: "verloren", label: "Verloren", color: "red" },
        ],
      },
      { name: "incoterm", label: "Incoterm", type: "enum", listVisible: true, filterable: true, required: true, options: INCOTERM_OPTIONS },
      { name: "verwachte_waarde", label: "Verwachte waarde", type: "currency", currencyFixed: "EUR", listVisible: true },
      { name: "verwachte_afsluitdatum", label: "Verwachte afsluitdatum", type: "date", listVisible: true },
    ],
    relatedLists: [
      { object: "deal_regels", foreignKey: "deal_id", label: "Dealregels" },
      { object: "verkooporders", foreignKey: "deal_id", label: "Verkooporders" },
    ],
    statusTransitions: normalTransitions.deals,
  },
  {
    slug: "deal_regels",
    table: "deal_regels",
    primaryKey: "deal_regel_id",
    labelSingular: "Dealregel",
    labelPlural: "Dealregels",
    navGroup: "Verkoop",
    showInNav: false,
    titleField: "deal_regel_id",
    defaultSort: { field: "created_at", dir: "desc" },
    fields: [
      { name: "deal_id", label: "Deal", type: "fk", references: "deals", labelField: "deal_id", listVisible: true, required: true },
      { name: "product_id", label: "Product", type: "fk", references: "producten", labelField: "naam", listVisible: true, searchable: true, required: true },
      { name: "maat", label: "Maat", type: "text", listVisible: true },
      { name: "verwacht_aantal", label: "Verwacht aantal", type: "integer", listVisible: true, required: true },
    ],
  },

  // ---------------------------------------------------------------------
  // Verkoop
  // ---------------------------------------------------------------------
  {
    slug: "verkooporders",
    table: "verkooporders",
    primaryKey: "so_id",
    labelSingular: "Verkooporder",
    labelPlural: "Verkooporders",
    navGroup: "Verkoop",
    showInNav: true,
    titleField: "so_id",
    defaultSort: { field: "orderdatum", dir: "desc" },
    fields: [
      { name: "klant_id", label: "Klant", type: "fk", references: "klanten", labelField: "naam", listVisible: true, searchable: true, required: true },
      { name: "deal_id", label: "Deal", type: "fk", references: "deals", labelField: "deal_id", nullable: true },
      { name: "contactpersoon_id", label: "Contactpersoon", type: "fk", references: "contactpersonen", labelField: "naam", nullable: true, dependsOnField: "klant_id" },
      { name: "incoterm", label: "Incoterm", type: "enum", listVisible: true, filterable: true, required: true, options: INCOTERM_OPTIONS },
      { name: "orderdatum", label: "Orderdatum", type: "date", listVisible: true, required: true },
      {
        name: "status",
        label: "Status",
        type: "enum",
        isStatusField: true,
        listVisible: true,
        filterable: true,
        required: true,
        options: [
          { value: "open", label: "Open", color: "blue" },
          { value: "deels_geleverd", label: "Deels geleverd", color: "amber" },
          { value: "geleverd", label: "Geleverd", color: "green" },
          { value: "geannuleerd", label: "Geannuleerd", color: "gray" },
        ],
      },
    ],
    relatedLists: [{ object: "verkooporder_regels", foreignKey: "so_id", label: "Orderregels" }],
    statusTransitions: normalTransitions.verkooporders,
  },
  {
    slug: "verkooporder_regels",
    table: "verkooporder_regels",
    primaryKey: "so_regel_id",
    labelSingular: "Verkooporder-regel",
    labelPlural: "Verkooporder-regels",
    navGroup: "Verkoop",
    showInNav: false,
    titleField: "so_regel_id",
    defaultSort: { field: "created_at", dir: "desc" },
    fields: [
      { name: "so_id", label: "Verkooporder", type: "fk", references: "verkooporders", labelField: "so_id", listVisible: true, required: true },
      { name: "product_id", label: "Product", type: "fk", references: "producten", labelField: "naam", listVisible: true, searchable: true, required: true },
      { name: "maat", label: "Maat", type: "text", listVisible: true },
      { name: "aantal", label: "Aantal", type: "integer", listVisible: true, required: true },
      { name: "prijs_per_stuk", label: "Prijs per stuk", type: "currency", currencyField: "valuta", listVisible: true, required: true },
      { name: "valuta", label: "Valuta", type: "enum", required: true, options: VALUTA_OPTIONS },
    ],
    relatedLists: [
      { object: "verzendingen", foreignKey: "so_regel_id", label: "Verzendingen" },
      { object: "matching", foreignKey: "so_regel_id", label: "Matching (inkoop)" },
    ],
  },

  // ---------------------------------------------------------------------
  // Inkoop
  // ---------------------------------------------------------------------
  {
    slug: "inkooporders",
    table: "inkooporders",
    primaryKey: "po_id",
    labelSingular: "Inkooporder",
    labelPlural: "Inkooporders",
    navGroup: "Inkoop",
    showInNav: true,
    titleField: "po_id",
    defaultSort: { field: "orderdatum", dir: "desc" },
    fields: [
      { name: "leverancier_id", label: "Leverancier", type: "fk", references: "leveranciers", labelField: "naam", listVisible: true, searchable: true, required: true },
      { name: "incoterm", label: "Incoterm", type: "enum", listVisible: true, filterable: true, required: true, options: INCOTERM_OPTIONS },
      { name: "leadtime_weken", label: "Leadtime (weken)", type: "integer", listVisible: true },
      { name: "orderdatum", label: "Orderdatum", type: "date", listVisible: true, required: true },
      {
        name: "status",
        label: "Status",
        type: "enum",
        isStatusField: true,
        listVisible: true,
        filterable: true,
        required: true,
        options: [
          { value: "besteld", label: "Besteld", color: "gray" },
          { value: "in_productie", label: "In productie", color: "blue" },
          { value: "onderweg", label: "Onderweg", color: "amber" },
          { value: "aangekomen", label: "Aangekomen", color: "green" },
        ],
      },
    ],
    relatedLists: [
      { object: "inkooporder_regels", foreignKey: "po_id", label: "Orderregels" },
      { object: "betalingen", foreignKey: "po_id", label: "Betalingen" },
    ],
    statusTransitions: normalTransitions.inkooporders,
  },
  {
    slug: "inkooporder_regels",
    table: "inkooporder_regels",
    primaryKey: "po_regel_id",
    labelSingular: "Inkooporder-regel",
    labelPlural: "Inkooporder-regels",
    navGroup: "Inkoop",
    showInNav: false,
    titleField: "po_regel_id",
    defaultSort: { field: "created_at", dir: "desc" },
    fields: [
      { name: "po_id", label: "Inkooporder", type: "fk", references: "inkooporders", labelField: "po_id", listVisible: true, required: true },
      { name: "product_id", label: "Product", type: "fk", references: "producten", labelField: "naam", listVisible: true, searchable: true, required: true },
      { name: "maat", label: "Maat", type: "text", listVisible: true },
      { name: "aantal", label: "Aantal", type: "integer", listVisible: true, required: true },
      { name: "prijs_per_stuk", label: "Prijs per stuk", type: "currency", currencyField: "valuta", listVisible: true, required: true },
      { name: "valuta", label: "Valuta", type: "enum", required: true, options: VALUTA_OPTIONS },
    ],
    relatedLists: [
      { object: "ontvangsten", foreignKey: "po_regel_id", label: "Ontvangsten" },
      { object: "container_regels", foreignKey: "po_regel_id", label: "Containers" },
      { object: "matching", foreignKey: "po_regel_id", label: "Matching (verkoop)" },
    ],
  },
  {
    slug: "ontvangsten",
    table: "ontvangsten",
    primaryKey: "ontvangst_id",
    labelSingular: "Ontvangst",
    labelPlural: "Ontvangsten",
    navGroup: "Inkoop",
    showInNav: false,
    titleField: "ontvangst_id",
    defaultSort: { field: "ontvangstdatum", dir: "desc" },
    fields: [
      { name: "po_regel_id", label: "Inkooporder-regel", type: "fk", references: "inkooporder_regels", labelField: "po_regel_id", listVisible: true, required: true },
      { name: "lotnummer", label: "Lotnummer", type: "text", listVisible: true, required: true },
      { name: "aantal_ontvangen", label: "Aantal ontvangen", type: "integer", listVisible: true, required: true },
      { name: "ontvangstdatum", label: "Ontvangstdatum", type: "date", listVisible: true, required: true },
      { name: "houdbaarheidsdatum", label: "Houdbaarheidsdatum", type: "date", listVisible: true },
    ],
    relatedLists: [{ object: "assemblage_verbruik", foreignKey: "ontvangst_id", label: "Verbruikt in assemblages" }],
  },
  {
    slug: "verzendingen",
    table: "verzendingen",
    primaryKey: "verzending_id",
    labelSingular: "Verzending",
    labelPlural: "Verzendingen",
    navGroup: "Verkoop",
    showInNav: false,
    titleField: "verzending_id",
    defaultSort: { field: "verzenddatum", dir: "desc" },
    fields: [
      { name: "so_regel_id", label: "Verkooporder-regel", type: "fk", references: "verkooporder_regels", labelField: "so_regel_id", listVisible: true, required: true },
      { name: "aantal_verzonden", label: "Aantal verzonden", type: "integer", listVisible: true, required: true },
      { name: "verzenddatum", label: "Verzenddatum", type: "date", listVisible: true, required: true },
    ],
  },

  // ---------------------------------------------------------------------
  // Containers (FOB-logistiek)
  // ---------------------------------------------------------------------
  {
    slug: "containers",
    table: "containers",
    primaryKey: "container_id",
    labelSingular: "Container",
    labelPlural: "Containers",
    navGroup: "Inkoop",
    showInNav: true,
    titleField: "containernummer",
    defaultSort: { field: "etd", dir: "desc" },
    fields: [
      { name: "containernummer", label: "Containernummer", type: "text", listVisible: true, searchable: true, required: true },
      { name: "etd", label: "ETD", type: "date", listVisible: true },
      { name: "eta", label: "ETA", type: "date", listVisible: true },
      {
        name: "status",
        label: "Status",
        type: "enum",
        isStatusField: true,
        listVisible: true,
        filterable: true,
        required: true,
        options: [
          { value: "gepland", label: "Gepland", color: "gray" },
          { value: "onderweg", label: "Onderweg", color: "amber" },
          { value: "aangekomen", label: "Aangekomen", color: "green" },
        ],
      },
    ],
    relatedLists: [{ object: "container_regels", foreignKey: "container_id", label: "Regels" }],
    statusTransitions: normalTransitions.containers,
  },
  {
    slug: "container_regels",
    table: "container_regels",
    primaryKey: "id",
    labelSingular: "Containerregel",
    labelPlural: "Containerregels",
    navGroup: "Inkoop",
    showInNav: false,
    titleField: "id",
    defaultSort: { field: "created_at", dir: "desc" },
    fields: [
      { name: "container_id", label: "Container", type: "fk", references: "containers", labelField: "containernummer", listVisible: true, required: true },
      { name: "po_regel_id", label: "Inkooporder-regel", type: "fk", references: "inkooporder_regels", labelField: "po_regel_id", listVisible: true, required: true },
      { name: "aantal", label: "Aantal", type: "integer", listVisible: true, required: true },
    ],
  },

  // ---------------------------------------------------------------------
  // Betalingen
  // ---------------------------------------------------------------------
  {
    slug: "betalingen",
    table: "betalingen",
    primaryKey: "betaling_id",
    labelSingular: "Betaling",
    labelPlural: "Betalingen",
    navGroup: "Betalingen",
    showInNav: true,
    titleField: "betaling_id",
    defaultSort: { field: "created_at", dir: "desc" },
    fields: [
      { name: "po_id", label: "Inkooporder", type: "fk", references: "inkooporders", labelField: "po_id", listVisible: true, required: true },
      {
        name: "type",
        label: "Type",
        type: "enum",
        listVisible: true,
        filterable: true,
        required: true,
        options: [
          { value: "deposit", label: "Deposit", color: "blue" },
          { value: "restbetaling", label: "Restbetaling", color: "gray" },
        ],
      },
      { name: "bedrag", label: "Bedrag", type: "currency", currencyField: "valuta", listVisible: true, required: true },
      { name: "valuta", label: "Valuta", type: "enum", required: true, options: VALUTA_OPTIONS },
      {
        name: "status",
        label: "Status",
        type: "enum",
        isStatusField: true,
        listVisible: true,
        filterable: true,
        required: true,
        options: [
          { value: "open", label: "Open", color: "gray" },
          { value: "betaald", label: "Betaald", color: "blue" },
          { value: "doorgestuurd_naar_fabriek", label: "Doorgestuurd naar fabriek", color: "green" },
        ],
      },
      { name: "datum_ontvangen", label: "Datum ontvangen", type: "date", listVisible: true },
      { name: "datum_doorgestuurd", label: "Datum doorgestuurd", type: "date", listVisible: true },
    ],
    statusTransitions: normalTransitions.betalingen,
  },

  // ---------------------------------------------------------------------
  // Matching verkoop <-> inkoop
  // ---------------------------------------------------------------------
  {
    slug: "matching",
    table: "matching",
    primaryKey: "id",
    labelSingular: "Matching",
    labelPlural: "Matching",
    navGroup: "Verkoop",
    showInNav: false,
    titleField: "id",
    defaultSort: { field: "created_at", dir: "desc" },
    fields: [
      { name: "so_regel_id", label: "Verkooporder-regel", type: "fk", references: "verkooporder_regels", labelField: "so_regel_id", listVisible: true, required: true },
      { name: "po_regel_id", label: "Inkooporder-regel", type: "fk", references: "inkooporder_regels", labelField: "po_regel_id", listVisible: true, required: true },
      { name: "aantal_toegewezen", label: "Aantal toegewezen", type: "integer", listVisible: true, required: true },
    ],
  },

  // ---------------------------------------------------------------------
  // Receptuur (BOM) & assemblage
  // ---------------------------------------------------------------------
  {
    slug: "recepturen",
    table: "recepturen",
    primaryKey: "receptuur_id",
    labelSingular: "Receptuur",
    labelPlural: "Recepturen",
    navGroup: "Assemblage",
    showInNav: false,
    titleField: "receptuur_id",
    defaultSort: { field: "created_at", dir: "desc" },
    fields: [
      { name: "eindproduct_id", label: "Eindproduct", type: "fk", references: "producten", labelField: "naam", listVisible: true, required: true },
      { name: "component_id", label: "Component", type: "fk", references: "producten", labelField: "naam", listVisible: true, required: true },
      { name: "aantal_per_eenheid", label: "Aantal per eenheid", type: "number", listVisible: true, required: true },
    ],
  },
  {
    slug: "assemblages",
    table: "assemblages",
    primaryKey: "assemblage_id",
    labelSingular: "Assemblage",
    labelPlural: "Assemblages",
    navGroup: "Assemblage",
    showInNav: true,
    titleField: "assemblage_id",
    defaultSort: { field: "datum", dir: "desc" },
    fields: [
      { name: "eindproduct_id", label: "Eindproduct", type: "fk", references: "producten", labelField: "naam", listVisible: true, searchable: true, required: true },
      { name: "aantal_geproduceerd", label: "Aantal geproduceerd", type: "integer", listVisible: true, required: true },
      { name: "datum", label: "Datum", type: "date", listVisible: true, required: true },
      {
        name: "status",
        label: "Status",
        type: "enum",
        isStatusField: true,
        listVisible: true,
        filterable: true,
        required: true,
        options: [
          { value: "gepland", label: "Gepland", color: "gray" },
          { value: "voltooid", label: "Voltooid", color: "green" },
        ],
      },
    ],
    relatedLists: [{ object: "assemblage_verbruik", foreignKey: "assemblage_id", label: "Verbruik" }],
    statusTransitions: normalTransitions.assemblages,
  },
  {
    slug: "assemblage_verbruik",
    table: "assemblage_verbruik",
    primaryKey: "id",
    labelSingular: "Assemblageverbruik",
    labelPlural: "Assemblageverbruik",
    navGroup: "Assemblage",
    showInNav: false,
    titleField: "id",
    defaultSort: { field: "created_at", dir: "desc" },
    fields: [
      { name: "assemblage_id", label: "Assemblage", type: "fk", references: "assemblages", labelField: "assemblage_id", listVisible: true, required: true },
      { name: "ontvangst_id", label: "Ontvangst (partij)", type: "fk", references: "ontvangsten", labelField: "ontvangst_id", listVisible: true, required: true },
      { name: "aantal_verbruikt", label: "Aantal verbruikt", type: "integer", listVisible: true, required: true },
    ],
  },

  // ---------------------------------------------------------------------
  // Voorraad (read-only, afgeleid)
  // ---------------------------------------------------------------------
  {
    slug: "voorraad_actueel",
    table: "voorraad_actueel",
    primaryKey: "product_id",
    labelSingular: "Voorraad",
    labelPlural: "Voorraad",
    navGroup: "Voorraad",
    showInNav: true,
    listOnly: true,
    titleField: "product_id",
    defaultSort: { field: "product_id", dir: "asc" },
    fields: [
      { name: "product_id", label: "Product", type: "fk", references: "producten", labelField: "naam", listVisible: true, searchable: true },
      { name: "maat", label: "Maat", type: "text", listVisible: true },
      { name: "voorraad", label: "Voorraad", type: "integer", listVisible: true },
    ],
  },
];

export function getObjectConfig(slug: string): ObjectConfig | undefined {
  return OBJECTS.find((o) => o.slug === slug);
}
