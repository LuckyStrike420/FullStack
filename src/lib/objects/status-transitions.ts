import type { StatusTransitionMap } from "./types";

/**
 * Per object: huidige status -> lijst van "normale" vervolgstatussen.
 * Alles buiten deze lijst is technisch toegestaan (geen DB-constraint),
 * maar triggert een bevestigingspop-up (StatusChangeDialog) in de UI.
 */
export const normalTransitions: Record<string, StatusTransitionMap> = {
  deals: {
    nieuw: ["offerte_verstuurd", "verloren"],
    offerte_verstuurd: ["onderhandeling", "gewonnen", "verloren"],
    onderhandeling: ["gewonnen", "verloren"],
    gewonnen: [],
    verloren: [],
  },
  verkooporders: {
    open: ["deels_geleverd", "geleverd", "geannuleerd"],
    deels_geleverd: ["geleverd", "geannuleerd"],
    geleverd: [],
    geannuleerd: [],
  },
  inkooporders: {
    besteld: ["in_productie", "onderweg"],
    in_productie: ["onderweg"],
    onderweg: ["aangekomen"],
    aangekomen: [],
  },
  containers: {
    gepland: ["onderweg"],
    onderweg: ["aangekomen"],
    aangekomen: [],
  },
  betalingen: {
    open: ["betaald"],
    betaald: ["doorgestuurd_naar_fabriek"],
    doorgestuurd_naar_fabriek: [],
  },
  assemblages: {
    gepland: ["voltooid"],
    voltooid: [],
  },
};

export function isNormalTransition(objectSlug: string, from: string, to: string): boolean {
  if (from === to) return true;
  return normalTransitions[objectSlug]?.[from]?.includes(to) ?? false;
}
