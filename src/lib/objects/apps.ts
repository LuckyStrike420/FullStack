export interface AppDef {
  slug: string;
  label: string;
  objectSlugs: string[];
}

export const APP_DEFS: AppDef[] = [
  { slug: "verkoop", label: "Verkoop", objectSlugs: ["deals", "verkooporders"] },
  { slug: "klanten", label: "Klanten", objectSlugs: ["klanten", "contactpersonen"] },
  { slug: "inkoop", label: "Inkoop", objectSlugs: ["leveranciers", "inkooporders", "containers"] },
  { slug: "productie", label: "Productie", objectSlugs: ["producten", "assemblages"] },
  { slug: "financieel", label: "Financieel", objectSlugs: ["betalingen"] },
  { slug: "voorraad", label: "Voorraad", objectSlugs: ["voorraad_actueel"] },
];
