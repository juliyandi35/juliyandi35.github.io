import { methodChord } from "@/lib/methodChord";

/**
 * A chord diagram of genuine co-occurrence: an edge exists only where a real
 * repository is tagged with both method families at once. Edge thickness and
 * opacity are that count, not a stylistic choice. Decorative/`aria-hidden` —
 * the same relationship it shows is stated in text beside it (the
 * most-often-paired families and their shared count), which is the
 * keyboard/screen-reader equivalent, consistent with how the project graph
 * itself is presented.
 */
export default function MethodChord({ className = "" }: { className?: string }) {
  const size = 320;
  const center = size / 2;
  const radius = size / 2 - 40;
  const { nodes, links, maxWeight } = methodChord;

  const point = (angle: number, r: number): [number, number] => [
    center + Math.cos(angle) * r,
    center + Math.sin(angle) * r,
  ];

  return (
    <svg aria-hidden="true" viewBox={`0 0 ${size} ${size}`} className={className}>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-hairline"
        strokeWidth={1}
      />
      {links.map((link) => {
        const a = nodes[link.a];
        const b = nodes[link.b];
        if (!a || !b) return null;
        const [x1, y1] = point(a.angle, radius);
        const [x2, y2] = point(b.angle, radius);
        const strength = maxWeight > 0 ? link.weight / maxWeight : 0;
        return (
          <path
            key={`${link.a}-${link.b}`}
            d={`M ${x1} ${y1} Q ${center} ${center} ${x2} ${y2}`}
            fill="none"
            stroke={a.color}
            strokeWidth={0.75 + strength * 2.5}
            opacity={0.16 + strength * 0.44}
          />
        );
      })}
      {nodes.map((node) => {
        const [x, y] = point(node.angle, radius);
        return <circle key={node.name} cx={x} cy={y} r={2.5 + Math.sqrt(node.count) * 0.55} fill={node.color} />;
      })}
    </svg>
  );
}
