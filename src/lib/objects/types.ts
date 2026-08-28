export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "integer"
  | "currency"
  | "date"
  | "boolean"
  | "enum"
  | "fk";

export interface BaseFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  listVisible?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  required?: boolean;
  readOnly?: boolean;
}

export interface EnumOption {
  value: string;
  label: string;
  color?: "blue" | "amber" | "green" | "gray" | "red";
}

export interface EnumFieldConfig extends BaseFieldConfig {
  type: "enum";
  options: EnumOption[];
  isStatusField?: boolean;
}

export interface CurrencyFieldConfig extends BaseFieldConfig {
  type: "currency";
  currencyField?: string;
  currencyFixed?: "EUR" | "USD";
}

export interface FkFieldConfig extends BaseFieldConfig {
  type: "fk";
  references: string;
  labelField: string;
  nullable?: boolean;
  /**
   * Name of another fk field on this same object that scopes this field's
   * options — e.g. `contactpersoon_id` depends on `klant_id`, so only
   * contacts belonging to the chosen klant are offered. The referenced
   * table is expected to have a column with the same name as the parent
   * field (matches this schema's FK-naming convention).
   */
  dependsOnField?: string;
}

export type FieldConfig = BaseFieldConfig | EnumFieldConfig | CurrencyFieldConfig | FkFieldConfig;

export function isEnumField(f: FieldConfig): f is EnumFieldConfig {
  return f.type === "enum";
}
export function isCurrencyField(f: FieldConfig): f is CurrencyFieldConfig {
  return f.type === "currency";
}
export function isFkField(f: FieldConfig): f is FkFieldConfig {
  return f.type === "fk";
}

export interface RelatedListConfig {
  object: string;
  foreignKey: string;
  label: string;
}

export type StatusTransitionMap = Record<string, string[]>;

export interface ObjectConfig {
  slug: string;
  table: string;
  primaryKey: string;
  labelSingular: string;
  labelPlural: string;
  navGroup: string;
  showInNav?: boolean;
  /** No create/edit/status UI — used for the read-only voorraad_actueel view. */
  listOnly?: boolean;
  fields: FieldConfig[];
  relatedLists?: RelatedListConfig[];
  titleField: string;
  defaultSort: { field: string; dir: "asc" | "desc" };
  statusTransitions?: StatusTransitionMap;
}
