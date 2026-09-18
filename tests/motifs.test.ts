import { describe, it, expect } from "vitest";
import { manifest } from "@/lib/data";
import { METHOD_COLORS, methodColor } from "@/lib/methodPalette";
import { parangLines, pilinSpiralPoints, tenunThreads } from "@/lib/motifs";
import { methodChord } from "@/lib/methodChord";

describe("methodPalette", () => {
  it("gives every method family a valid, distinguishable colour", () => {
    const used = manifest.methodFamilies.map((f) => methodColor(f));
    for (const color of used) expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    if (manifest.methodFamilies.length <= METHOD_COLORS.length) {
      expect(new Set(used).size).toBe(manifest.methodFamilies.length);
    }
  });

  it("assigns the site's own accent colour to the largest family", () => {
    const sorted = [...manifest.methodFamilies].sort(
      (a, b) => (manifest.methodCounts[b] ?? 0) - (manifest.methodCounts[a] ?? 0),
    );
    expect(methodColor(sorted[0]!)).toBe("#1E6B55");
  });

  it("falls back to a neutral colour for an unrecognised family instead of throwing", () => {
    expect(methodColor("Not a real family")).toBe("#59605B");
  });
});

describe("motifs: parangLines", () => {
  it("returns the requested count of finite, 45-degree diagonal strokes", () => {
    const lines = parangLines(1440, 56, 22);
    expect(lines).toHaveLength(22);
    for (const line of lines) {
      for (const v of [line.x1, line.y1, line.x2, line.y2, line.opacity]) {
        expect(Number.isFinite(v)).toBe(true);
      }
      expect(line.opacity).toBeGreaterThanOrEqual(0);
      expect(line.opacity).toBeLessThanOrEqual(1);
      expect(Math.abs(line.x2 - line.x1)).toBe(56);
      expect(Math.abs(line.y2 - line.y1)).toBe(56);
    }
  });

  it("is deterministic, so server and client render the same divider", () => {
    expect(parangLines(1440, 56, 22)).toEqual(parangLines(1440, 56, 22));
  });
});

describe("motifs: pilinSpiralPoints", () => {
  it("grows radius monotonically with elapsed turns and stays finite", () => {
    const points = pilinSpiralPoints(3, 48, 0);
    expect(points.length).toBeGreaterThan(0);
    let previousRadius = -1;
    for (const p of points) {
      const r = Math.hypot(p.x, p.y);
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Number.isFinite(p.y)).toBe(true);
      expect(r).toBeGreaterThanOrEqual(previousRadius - 1e-9);
      previousRadius = r;
    }
    const last = points[points.length - 1]!;
    expect(Math.hypot(last.x, last.y)).toBeCloseTo(3, 6);
  });

  it("draws the paired strand rotated a half turn from the centre", () => {
    const strandA = pilinSpiralPoints(3, 48, 0);
    const strandB = pilinSpiralPoints(3, 48, 1);
    expect(Math.hypot(strandA[0]!.x, strandA[0]!.y)).toBeLessThan(1e-9);
    expect(Math.hypot(strandB[0]!.x, strandB[0]!.y)).toBeLessThan(1e-9);
    const a1 = strandA[10]!;
    const b1 = strandB[10]!;
    expect(a1.x + b1.x).toBeCloseTo(0, 9);
    expect(a1.y + b1.y).toBeCloseTo(0, 9);
  });
});

describe("motifs: tenunThreads", () => {
  it("covers every method family with its real manifest count, most-used first", () => {
    const threads = tenunThreads();
    expect(threads).toHaveLength(manifest.methodFamilies.length);
    const totalWeight = threads.reduce((sum, t) => sum + t.weight, 0);
    const totalCounts = Object.values(manifest.methodCounts).reduce((sum, c) => sum + c, 0);
    expect(totalWeight).toBe(totalCounts);
    for (let i = 1; i < threads.length; i += 1) {
      expect(threads[i]!.weight).toBeLessThanOrEqual(threads[i - 1]!.weight);
    }
    for (const t of threads) expect(t.color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});

describe("methodChord", () => {
  it("places one node per method family on the unit circle, with real counts", () => {
    expect(methodChord.nodes).toHaveLength(manifest.methodFamilies.length);
    for (const node of methodChord.nodes) {
      expect(Math.hypot(node.position[0], node.position[1])).toBeCloseTo(1, 9);
      expect(node.count).toBe(manifest.methodCounts[node.name]);
    }
  });

  it("links only families genuinely co-tagged on a real repository, with correct weights", () => {
    const indexByName = new Map(methodChord.nodes.map((n, i) => [n.name, i]));
    const expected = new Map<string, number>();
    let pairsObserved = 0;
    for (const repo of manifest.repos) {
      const families = repo.methods.filter((m) => indexByName.has(m));
      for (let i = 0; i < families.length; i += 1) {
        for (let j = i + 1; j < families.length; j += 1) {
          pairsObserved += 1;
          const a = indexByName.get(families[i]!)!;
          const b = indexByName.get(families[j]!)!;
          const key = a < b ? `${a}-${b}` : `${b}-${a}`;
          expected.set(key, (expected.get(key) ?? 0) + 1);
        }
      }
    }

    expect(methodChord.links).toHaveLength(expected.size);
    for (const link of methodChord.links) {
      const key = link.a < link.b ? `${link.a}-${link.b}` : `${link.b}-${link.a}`;
      expect(link.weight).toBe(expected.get(key));
      expect(link.a).not.toBe(link.b);
    }
    const totalLinkWeight = methodChord.links.reduce((sum, l) => sum + l.weight, 0);
    expect(totalLinkWeight).toBe(pairsObserved);
  });

  it("reports the true maximum weight", () => {
    const max = methodChord.links.reduce((m, l) => Math.max(m, l.weight), 0);
    expect(methodChord.maxWeight).toBe(max);
  });
});
