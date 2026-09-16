"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import AppNav from "@/components/Graph/AppNav";
import ProjectPopup from "@/components/Graph/ProjectPopup";
import { useSceneContext } from "@/components/Exploration/SceneContext";
import { usePrefersReducedMotion, useWebglSupport } from "@/lib/hooks";
import { clamp01 } from "@/lib/camera";
import { graph, CORE_BACKDROP } from "@/lib/graph";

const GlobalCanvasClient = dynamic(() => import("@/components/Scene3D/GlobalCanvasClient"), {
  ssr: false,
  loading: () => null,
});

/**
 * The destination: the visitor stops travelling through content and arrives
 * at the core, where the graph is the entire screen.
 *
 * The stage is a tall container with a sticky viewport-sized child rather
 * than a GSAP pin — sticky needs no pin-spacer, cannot desynchronise from
 * the document height, and degrades to an ordinary section if anything about
 * the scroll maths goes wrong.
 *
 * The canvas is mounted here, inside the stage, with an explicit background
 * color and an ordinary DOM position (no `fixed`, no negative z-index): it
 * previously lived page-wide in DepthShell behind a negative z-index, which
 * the opaque `html`/`body` background painted over everywhere, so the graph
 * was never actually visible. Being local means it simply doesn't exist
 * until the visitor scrolls this far — nothing to hide behind other
 * sections in the first place.
 *
 * Scroll through the container maps to `arrival`: the first 45% is the
 * approach (the camera closes on the core, the canvas fades in), and the
 * remainder is dwell time, so the graph is not sliding away underneath the
 * visitor while they are trying to click a node.
 */
const APPROACH_FRACTION = 0.45;

export default function GraphStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { arrival, focusedApp, selectedProject, _setArrival } = useSceneContext();
  const reducedMotion = usePrefersReducedMotion();
  const webglSupported = useWebglSupport();

  useEffect(() => {
    const update = () => {
      const element = containerRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const raw = clamp01(-rect.top / travel);
      // Reduced motion gets no approach animation — the graph is simply
      // there once the stage is reached.
      _setArrival(reducedMotion ? (raw > 0.02 ? 1 : 0) : clamp01(raw / APPROACH_FRACTION));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [_setArrival, reducedMotion]);

  const focused = focusedApp === null ? null : graph.applications[focusedApp];
  const arrived = arrival > 0.6;
  const canvasOpacity = Math.min(1, Math.max(0, (arrival - 0.04) * 1.9));

  return (
    <div
      ref={containerRef}
      id="graph"
      className="relative h-[240vh]"
      style={{ backgroundColor: CORE_BACKDROP }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <h2 className="sr-only">Project graph</h2>

        {webglSupported === true && (
          <div className="pointer-events-none absolute inset-0" style={{ opacity: canvasOpacity }}>
            <GlobalCanvasClient active={arrival > 0.001} reducedMotion={reducedMotion} />
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: arrived ? 1 : 0,
            // `visibility`, not opacity alone: until the visitor has actually
            // arrived at the core these controls are invisible, and invisible
            // controls must not be in the tab order or the accessibility tree.
            visibility: arrived ? "visible" : "hidden",
            transition: reducedMotion ? undefined : "opacity 500ms ease",
          }}
        >
          <p className="font-mono-label absolute left-3 top-6 text-[10px] leading-relaxed text-graphite sm:left-6">
            The core
            <br />
            <span className="text-ink">
              {graph.projects.length} projects · {graph.applications.length} applications
            </span>
          </p>

          {webglSupported === false ? (
            <NoWebglFallback />
          ) : (
            <>
              <AppNav />
              <ProjectPopup />

              {/* The popup already covers this ground once a project is
                  selected — showing both risks the two stacking on top of
                  each other on narrow viewports, where they share the same
                  bottom-left corner. */}
              {selectedProject === null && (
                <div className="absolute inset-x-3 bottom-5 sm:inset-x-auto sm:left-6 sm:bottom-8 sm:max-w-xs">
                  {focused ? (
                    <p className="text-[12px] leading-relaxed text-graphite">
                      <span className="text-ink">{focused.name}</span> — {focused.count} projects.{" "}
                      <Link
                        href={`/atlas?app=${encodeURIComponent(focused.name)}`}
                        className="pointer-events-auto text-oxide underline decoration-oxide/40 underline-offset-4 hover:decoration-oxide"
                      >
                        List them in the atlas
                      </Link>
                    </p>
                  ) : (
                    <p className="text-[12px] leading-relaxed text-graphite">
                      One core, {graph.applications.length} applications, {graph.projects.length} projects.
                      Drag to look around, click a node to open its repository, or pick an
                      application on the left.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Without WebGL there is no graph to look at, so the same structure is
 * offered as plain links — the information was never only in the canvas.
 */
function NoWebglFallback() {
  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center p-6">
      <div className="max-w-md rounded-surface border hairline bg-paper p-6 shadow-lg">
        <p className="font-mono-label text-[10px] text-oxide">Project graph</p>
        <p className="mt-3 text-sm leading-relaxed text-graphite">
          The interactive graph needs WebGL, which this browser does not offer. The same
          structure — every application and the projects built with it — is in the project
          atlas.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {graph.applications.map((app) => (
            <li key={app.name}>
              <Link
                href={`/atlas?app=${encodeURIComponent(app.name)}`}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-pill border hairline px-3 py-1.5 text-[13px] text-ink transition-colors duration-200 hover:border-oxide hover:text-oxide"
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: app.color }}
                />
                {app.name}
                <span className="font-mono-label text-[10px] text-graphite">{app.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
