import { manifest } from "@/lib/data";

/**
 * One colour per method family, drawn from dyes long used in Nusantara
 * textile traditions — indigo (tarum), soga bark brown, kesumba/noni red,
 * turmeric ochre, and so on — rather than an arbitrary design-system ramp.
 * Ordered so the most-practiced family (the busiest tab) gets the most
 * legible tone, the same convention `APP_COLORS` uses for the project graph
 * in `lib/graph.ts`.
 *
 * This palette lives on the light "Scientific Atelier" pages, so — unlike
 * `APP_COLORS`, which is tuned to glow against the graph's dark core — every
 * tone here is chosen to read clearly against porcelain and paper without
 * competing with the single oxidised-green accent used for interactive
 * elements. `#1E6B55` (the accent itself, "oxide") is deliberately first: the
 * largest family is coloured exactly like the rest of the site's UI, and
 * every family after it is a genuinely different hue.
 */
export const METHOD_COLORS: string[] = [
  "#1E6B55", // oxide — the site's own accent, for the largest family
  "#3D5A80", // tarum / indigo
  "#8B5E34", // soga — bark-dyed brown
  "#A63446", // kesumba — noni/morinda red
  "#C08A2E", // kunyit — turmeric ochre
  "#5B7553", // pupus — young-leaf green
  "#6B4E71", // wulung — dark mulberry purple
  "#2E6E73", // deep teal
  "#B4623A", // terracotta clay
  "#4A6741", // moss
  "#8C7A3E", // dried-grass gold
  "#6E5A7A", // dusk violet
  "#3F6B62", // pine
];

const familiesByCount = [...manifest.methodFamilies].sort((a, b) => {
  const diff = (manifest.methodCounts[b] ?? 0) - (manifest.methodCounts[a] ?? 0);
  return diff !== 0 ? diff : a.localeCompare(b);
});

const colorByFamily = new Map<string, string>();
familiesByCount.forEach((family, i) => {
  colorByFamily.set(family, METHOD_COLORS[i % METHOD_COLORS.length] ?? "#1E6B55");
});

/** The colour assigned to a method family, or a neutral fallback for an unrecognised name. */
export function methodColor(family: string): string {
  return colorByFamily.get(family) ?? "#59605B";
}
