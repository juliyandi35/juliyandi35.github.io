import { describe, it, expect } from "vitest";
import {
  approachFraming,
  applicationFraming,
  lerpFraming,
  fittingDistance,
  clamp01,
  ARRIVAL_DISTANCE,
  APPROACH_START_DISTANCE,
  FOV,
} from "@/lib/camera";
import { graph } from "@/lib/graph";

const distanceFromOrigin = (p: [number, number, number]) => Math.hypot(p[0], p[1], p[2]);

describe("clamp01", () => {
  it("clamps, passes through, and treats NaN as zero", () => {
    expect(clamp01(-3)).toBe(0);
    expect(clamp01(0.42)).toBe(0.42);
    expect(clamp01(7)).toBe(1);
    expect(clamp01(Number.NaN)).toBe(0);
  });
});

describe("approach", () => {
  it("starts far out and ends at the arrival distance", () => {
    expect(approachFraming(0).position[2]).toBeCloseTo(APPROACH_START_DISTANCE, 5);
    expect(approachFraming(1).position[2]).toBeCloseTo(ARRIVAL_DISTANCE, 5);
  });

  it("never moves backwards as the visitor scrolls in", () => {
    let previous = Number.POSITIVE_INFINITY;
    for (let i = 0; i <= 100; i += 1) {
      const current = approachFraming(i / 100).position[2];
      expect(current).toBeLessThanOrEqual(previous + 1e-9);
      previous = current;
    }
  });

  it("always looks at the core, with finite coordinates throughout", () => {
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      const framing = approachFraming(progress);
      expect(framing.lookAt).toEqual([0, 0, 0]);
      for (const value of [...framing.position, ...framing.lookAt]) {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });

  it("arrives close enough that the graph fills the frame", () => {
    // Inside the exact fitting distance means the graph overflows the
    // viewport slightly rather than sitting neatly inside it.
    expect(ARRIVAL_DISTANCE).toBeLessThan(fittingDistance(graph.radius, FOV));
    expect(ARRIVAL_DISTANCE).toBeGreaterThan(graph.radius);
  });
});

describe("application framing", () => {
  it("frames every application from outside its cluster, looking back at the core", () => {
    for (const app of graph.applications) {
      const framing = applicationFraming(app.index);
      expect(framing).not.toBeNull();
      if (!framing) continue;

      expect(framing.lookAt).toEqual(app.position);
      // Far enough out that the cluster is in view, not inside it.
      const toHub = Math.hypot(
        framing.position[0] - app.position[0],
        framing.position[1] - app.position[1],
        framing.position[2] - app.position[2],
      );
      expect(toHub).toBeGreaterThan(6);
      // Outside the hub's own orbit, so the core stays behind the cluster.
      expect(distanceFromOrigin(framing.position)).toBeGreaterThan(distanceFromOrigin(app.position));
    }
  });

  it("never parks the camera inside a different application's hub", () => {
    for (const app of graph.applications) {
      const framing = applicationFraming(app.index);
      if (!framing) continue;
      for (const other of graph.applications) {
        if (other.index === app.index) continue;
        const separation = Math.hypot(
          framing.position[0] - other.position[0],
          framing.position[1] - other.position[1],
          framing.position[2] - other.position[2],
        );
        expect(separation).toBeGreaterThan(4);
      }
    }
  });

  it("returns null for an index that is not an application", () => {
    expect(applicationFraming(-1)).toBeNull();
    expect(applicationFraming(graph.applications.length)).toBeNull();
  });
});

describe("lerpFraming", () => {
  it("interpolates between two framings and clamps out-of-range factors", () => {
    const from = approachFraming(0);
    const to = approachFraming(1);

    const middle = lerpFraming(from, to, 0.5);
    expect(middle.position[2]).toBeLessThan(from.position[2]);
    expect(middle.position[2]).toBeGreaterThan(to.position[2]);

    expect(lerpFraming(from, to, 5)).toEqual(to);
    expect(lerpFraming(from, to, -5)).toEqual(from);
  });
});
