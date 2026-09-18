import { pilinSpiralPoints } from "@/lib/motifs";

/**
 * A paired spiral ("pilin"), a motif common to Nusantara wood carving
 * (Toraja, Minangkabau), drawn from the same family of self-similar curves
 * that space the project graph's application nodes around its core.
 * Decorative only — `aria-hidden` — meant to sit behind the hero copy at low
 * opacity, as texture rather than as an illustration competing with it.
 */
export default function PilinSpiral({ className = "" }: { className?: string }) {
  const size = 480;
  const center = size / 2;
  const turns = 3.2;
  const scale = (size / 2 - 12) / turns;

  const strandA = pilinSpiralPoints(turns, 48, 0);
  const strandB = pilinSpiralPoints(turns, 48, 1);

  const toPath = (points: { x: number; y: number }[]) =>
    points
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${(center + p.x * scale).toFixed(2)} ${(center + p.y * scale).toFixed(2)}`,
      )
      .join(" ");

  return (
    <svg aria-hidden="true" viewBox={`0 0 ${size} ${size}`} className={`text-oxide ${className}`}>
      <path d={toPath(strandA)} fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.16} />
      <path d={toPath(strandB)} fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.1} />
    </svg>
  );
}
