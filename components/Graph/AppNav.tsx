"use client";

import { useState } from "react";
import { graph } from "@/lib/graph";
import { useSceneContext } from "@/components/Exploration/SceneContext";

/**
 * The application navigation that sits over the left of the graph stage —
 * deliberately floating buttons rather than a panel, so the graph itself
 * still fills the screen behind them. Collapsible with its own "Hide"/"Show"
 * button, so a visitor who wants an unobstructed view of the graph (or is on
 * a short/narrow viewport) can tuck the list away and bring it back with the
 * same control — nothing about the graph itself depends on it being open.
 *
 * This is also the keyboard-operable equivalent of clicking an application
 * hub in the 3D scene: the canvas is decorative and `aria-hidden`, and every
 * navigation action it offers is reachable here with Tab and Enter.
 */
export default function AppNav() {
  const { focusedApp, setFocusedApp } = useSceneContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav
      aria-label="Applications in the project graph"
      // Bounded between the header caption above and the footer caption
      // below, rather than vertically centred with a max-height — centring
      // let a long application list grow to within a few pixels of the
      // fixed footer text on short viewports, overlapping it. Anchoring to
      // both edges reserves that clearance unconditionally and scrolls
      // internally if the list still doesn't fit.
      className="pointer-events-auto absolute left-3 top-20 bottom-24 w-[13.5rem] sm:left-6 sm:top-24 sm:bottom-28 sm:w-[15rem]"
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="font-mono-label text-[10px] text-graphite">
          {graph.applications.length} applications
        </p>
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls="app-nav-list"
          onClick={() => setCollapsed((value) => !value)}
          className="shrink-0 rounded-pill border hairline bg-paper/90 px-2.5 py-1 text-[10px] font-mono-label text-graphite backdrop-blur-sm transition-colors duration-200 hover:border-oxide hover:text-ink"
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      {!collapsed && (
        <div id="app-nav-list" className="mt-2 h-[calc(100%-1.75rem)] overflow-y-auto">
          <ul className="space-y-1">
            {graph.applications.map((app) => {
              const active = focusedApp === app.index;
              return (
                <li key={app.name}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFocusedApp(active ? null : app.index)}
                    className={`flex min-h-[38px] w-full items-center gap-2.5 rounded-pill border px-3 py-1.5 text-left backdrop-blur-sm transition-colors duration-200 ${
                      active
                        ? "border-oxide bg-oxide/10 text-ink"
                        : "border-hairline bg-paper/90 text-graphite hover:border-oxide hover:text-ink"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: app.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[13px]">{app.name}</span>
                    <span className="font-mono-label shrink-0 text-[10px] text-graphite">{app.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {focusedApp !== null && (
            <button
              type="button"
              onClick={() => setFocusedApp(null)}
              className="mt-2 min-h-[38px] w-full rounded-pill border hairline bg-paper/90 px-3 py-1.5 text-[13px] text-graphite backdrop-blur-sm transition-colors duration-200 hover:border-oxide hover:text-ink"
            >
              Show the whole graph
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
