import { APP_DEFS } from "./apps";
import { OBJECTS } from "./config";
import type { ObjectConfig } from "./types";

export interface App {
  slug: string;
  label: string;
  objects: ObjectConfig[];
}

export function getApps(): App[] {
  return APP_DEFS.map((a) => ({
    slug: a.slug,
    label: a.label,
    objects: a.objectSlugs
      .map((slug) => OBJECTS.find((o) => o.slug === slug))
      .filter((o): o is ObjectConfig => !!o && !!o.showInNav),
  })).filter((a) => a.objects.length > 0);
}

export function getAppForObjectSlug(slug: string): App | undefined {
  return getApps().find((a) => a.objects.some((o) => o.slug === slug));
}

export function objectHref(obj: ObjectConfig): string {
  return obj.slug === "deals" ? "/deals/board" : `/${obj.slug}`;
}
