import { manifest } from "@/lib/data";
import { methodColor } from "@/lib/methodPalette";

/**
 * A chord diagram of genuine co-occurrence between method families.
 *
 * `Repo.methods` allows up to two entries — a repository whose description
 * reads "Machine learning, AI & data mining | MCDM, optimasi & riset
 * operasi | Python" carries both families at once. Every link here comes
 * from counting exactly that: it is not a stylistic flourish laid over the
 * method tabs, it is the same manifest, viewed as a graph instead of a list.
 */

export interface ChordNode {
  name: string;
  count: number;
  /** Radians, 0 at the top of the circle, increasing clockwise. */
  angle: number;
  /** Position on the unit circle. */
  position: [number, number];
  color: string;
}

export interface ChordLink {
  /** Index into `nodes`. */
  a: number;
  b: number;
  /** Number of repositories tagged with both families. */
  weight: number;
}

export interface ChordData {
  nodes: ChordNode[];
  links: ChordLink[];
  maxWeight: number;
}

function buildChordData(): ChordData {
  const names = [...manifest.methodFamilies].sort((a, b) => {
    const diff = (manifest.methodCounts[b] ?? 0) - (manifest.methodCounts[a] ?? 0);
    return diff !== 0 ? diff : a.localeCompare(b);
  });
  const indexByName = new Map(names.map((name, i) => [name, i]));

  const nodes: ChordNode[] = names.map((name, i) => {
    const angle = (i / Math.max(1, names.length)) * Math.PI * 2 - Math.PI / 2;
    return {
      name,
      count: manifest.methodCounts[name] ?? 0,
      angle,
      position: [Math.cos(angle), Math.sin(angle)],
      color: methodColor(name),
    };
  });

  const weightByPair = new Map<string, number>();
  for (const repo of manifest.repos) {
    const families = repo.methods.filter((m) => indexByName.has(m));
    for (let i = 0; i < families.length; i += 1) {
      for (let j = i + 1; j < families.length; j += 1) {
        const a = indexByName.get(families[i]!)!;
        const b = indexByName.get(families[j]!)!;
        const key = a < b ? `${a}-${b}` : `${b}-${a}`;
        weightByPair.set(key, (weightByPair.get(key) ?? 0) + 1);
      }
    }
  }

  const links: ChordLink[] = [...weightByPair.entries()].map(([key, weight]) => {
    const parts = key.split("-").map(Number);
    return { a: parts[0] ?? 0, b: parts[1] ?? 0, weight };
  });

  const maxWeight = links.reduce((max, link) => Math.max(max, link.weight), 0);

  return { nodes, links, maxWeight };
}

export const methodChord: ChordData = buildChordData();
