import { parangLines } from "@/lib/motifs";

/**
 * A thin, tonal section-edge texture built from the "parang" (broken-blade)
 * family of Nusantara batik motifs — repeating diagonal bands instead of a
 * plain straight rule. Purely decorative: `aria-hidden`, since every section
 * around it already has its own heading and landmark carrying the real
 * structure.
 */
export default function ParangDivider({ className = "" }: { className?: string }) {
  const width = 1440;
  const height = 48;
  const lines = parangLines(width, height, 26);

  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-12 w-full text-oxide"
      >
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth={2}
            opacity={line.opacity * 0.16}
          />
        ))}
      </svg>
    </div>
  );
}
