import { OBJECTS } from "./config";
import type { ObjectConfig } from "./types";

const NAV_GROUP_ORDER = ["Verkoop", "Inkoop", "Betalingen", "Assemblage", "Voorraad", "Stamgegevens"];

export interface NavGroup {
  name: string;
  objects: ObjectConfig[];
}

export function getNavGroups(): NavGroup[] {
  const navObjects = OBJECTS.filter((o) => o.showInNav);

  return NAV_GROUP_ORDER.map((name) => ({
    name,
    objects: navObjects.filter((o) => o.navGroup === name),
  })).filter((g) => g.objects.length > 0);
}
