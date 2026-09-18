import { manifest } from "@/lib/data";
import { methodColor } from "@/lib/methodPalette";

/**
 * Generative Nusantara-inspired pattern data.
 *
 * Every function here is pure and deterministic, in the same spirit as
 * `lib/graph.ts`: nothing is a static asset or a hand-drawn SVG. A pattern
 * either encodes real data (`tenunThreads`, sized from the manifest) or is
 * derived from a fixed, seedable formula (`parangLines`, `pilinSpiralPoints`),
 * so it renders identically on the server and the client and needs no image
 * file to ship, replace, or keep in sync with the catalog.
 */

export interface ParangLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

/**
 * Repeating 45°-diagonal bands in the manner of "parang" (broken-blade)
 * batik — parallel strokes rather than a plain straight rule, with a gentle
 * sine wave through their opacity so the band reads as rhythm rather than a
 * flat hatch fill.
 */
export function parangLines(width: number, height: number, count: number): ParangLine[] {
  const lines: ParangLine[] = [];
  const step = (width + height) / Math.max(1, count);
  for (let i = 0; i < count; i += 1) {
    const offset = i * step - height;
    lines.push({
      x1: offset,
      y1: 0,
      x2: offset + height,
      y2: height,
      opacity: 0.35 + 0.65 * Math.abs(Math.sin((i / count) * Math.PI * 2)),
    });
  }
  return lines;
}

export interface SpiralPoint {
  x: number;
  y: number;
}

/**
 * A single Archimedean spiral strand (radius growing linearly with angle),
 * the same family of self-similar curves that space the project graph's
 * application nodes around its core. Nusantara wood carving (Toraja,
 * Minangkabau) has a paired-spiral motif, "pilin" — `strand` draws either
 * half of that pair, offset by half a turn.
 */
export function pilinSpiralPoints(turns: number, pointsPerTurn: number, strand: 0 | 1 = 0): SpiralPoint[] {
  const totalPoints = Math.max(1, Math.round(turns * pointsPerTurn));
  const rotation = strand === 0 ? 0 : Math.PI;
  const points: SpiralPoint[] = [];
  for (let i = 0; i <= totalPoints; i += 1) {
    const t = i / pointsPerTurn; // elapsed turns, 0..turns
    const angle = t * 2 * Math.PI + rotation;
    const radius = t;
    points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }
  return points;
}

export interface TenunThread {
  name: string;
  weight: number;
  color: string;
}

/**
 * Vertical thread weights for a tenun (handwoven Nusantara cloth)-inspired
 * texture: one thread per method family, sized by its real share of the
 * catalog and coloured with the same palette as the method tabs. The texture
 * is a second rendering of real data, not an image applied on top of it — if
 * the manifest changes, the weave changes with it.
 */
export function tenunThreads(): TenunThread[] {
  const families = [...manifest.methodFamilies].sort((a, b) => {
    const diff = (manifest.methodCounts[b] ?? 0) - (manifest.methodCounts[a] ?? 0);
    return diff !== 0 ? diff : a.localeCompare(b);
  });
  return families.map((name) => ({
    name,
    weight: manifest.methodCounts[name] ?? 0,
    color: methodColor(name),
  }));
}
