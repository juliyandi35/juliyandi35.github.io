import { graph } from "@/lib/graph";

/**
 * Every application actually used across the catalog, as a proportional
 * spectrum coloured with the same palette and the same order as the project
 * graph's hubs — this and the graph are visibly the same data, not two
 * different colour choices for the same numbers. Colour is never the only
 * channel: the strip is decorative, but the list beneath it names and counts
 * every application in text.
 */
export default function ApplicationSpectrum({ className = "" }: { className?: string }) {
  const apps = graph.applications;

  return (
    <div className={className}>
      <div aria-hidden="true" className="flex h-3 w-full overflow-hidden rounded-pill">
        {apps.map((app) => (
          <span
            key={app.name}
            style={{ flexGrow: app.count, flexBasis: 0, backgroundColor: app.color }}
            className="h-full min-w-[2px]"
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
        {apps.map((app) => (
          <li key={app.name} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: app.color }}
            />
            <span className="truncate text-ink">{app.name}</span>
            <span className="font-mono-label ml-auto shrink-0 text-[10px] text-graphite">{app.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
