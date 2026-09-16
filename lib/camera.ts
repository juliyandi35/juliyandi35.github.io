import { graph, type Vec3 } from "@/lib/graph";

/**
 * Camera framing maths for the graph stage, kept as pure functions so they
 * can be unit-tested (and executed directly against the real graph) without
 * a WebGL context.
 *
 * The scroll journey through the content layers is pure CSS depth — the
 * camera does not move during it. The camera only moves across the final
 * graph stage: it starts far outside the graph (the core is a distant point
 * you have been travelling toward) and arrives at a framing distance where
 * the whole structure fills the viewport.
 */

export const FOV = 45;

/** Distance at which a sphere of the given radius fills the vertical field of view. */
export function fittingDistance(radius: number, fov: number = FOV): number {
  return radius / Math.tan((fov / 2) * (Math.PI / 180));
}

/** Far end of the approach — the core reads as a distant cluster of light. */
export const APPROACH_START_DISTANCE = 140;

/**
 * Near end of the approach. Slightly closer than the exact fitting distance,
 * so the graph overflows the frame a little and feels enveloping rather than
 * neatly contained — "memenuhi seluruh layar".
 */
export const ARRIVAL_DISTANCE = Math.max(24, fittingDistance(graph.radius) * 0.92);

export interface CameraFraming {
  position: Vec3;
  lookAt: Vec3;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Where the camera sits for a given arrival progress (0 = far away and
 * approaching, 1 = arrived and framing the whole graph).
 *
 * The approach is along +Z with a slight downward drift, so the core rises
 * into the middle of the frame as you close in rather than sitting dead
 * centre the whole way.
 */
export function approachFraming(progress: number): CameraFraming {
  const t = easeInOutCubic(clamp01(progress));
  const distance = APPROACH_START_DISTANCE + (ARRIVAL_DISTANCE - APPROACH_START_DISTANCE) * t;
  const height = 16 * (1 - t) + 3 * t;
  return {
    position: [0, height, distance],
    lookAt: [0, 0, 0],
  };
}

/**
 * Framing for a single application cluster: the camera moves outside the
 * cluster along the direction that points away from the core, so the core
 * stays behind the cluster in frame and the hierarchy still reads.
 */
export function applicationFraming(appIndex: number): CameraFraming | null {
  const app = graph.applications[appIndex];
  if (!app) return null;

  const [ax, ay, az] = app.position;
  const length = Math.hypot(ax, ay, az) || 1;
  const outward: Vec3 = [ax / length, ay / length, az / length];

  // Distance chosen so the widest cluster still fits with margin.
  const distance = 17;

  return {
    position: [ax + outward[0] * distance, ay + outward[1] * distance + 2, az + outward[2] * distance],
    lookAt: [ax, ay, az],
  };
}

/** Linear interpolation between two framings, used to ease between camera targets. */
export function lerpFraming(from: CameraFraming, to: CameraFraming, t: number): CameraFraming {
  const k = clamp01(t);
  const mix = (a: Vec3, b: Vec3): Vec3 => [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
  ];
  return { position: mix(from.position, to.position), lookAt: mix(from.lookAt, to.lookAt) };
}
