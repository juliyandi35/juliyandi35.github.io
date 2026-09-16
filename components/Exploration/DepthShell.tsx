"use client";

import Nav from "@/components/Nav";
import { SceneProvider } from "@/components/Exploration/SceneContext";

/**
 * The page's frame: shared scroll/scene state (arrival at the graph core,
 * focused application, selected project) plus the sticky nav that reads it.
 *
 * The WebGL canvas used to live here too, as one fixed, page-wide surface
 * painted behind every section via a negative z-index — invisible on
 * purpose while scrolling through content, meant to show through once
 * GraphStage supplied no background of its own. In practice the opaque
 * `html`/`body` background painted ahead of that negative-z-index layer, so
 * the canvas was never visible anywhere, including inside GraphStage. The
 * canvas now lives directly in GraphStage (see components/Graph/GraphStage.tsx),
 * scoped to where it is actually meant to be seen.
 */
export default function DepthShell({ children }: { children: React.ReactNode }) {
  return (
    <SceneProvider>
      {/* Rendered without a wrapper element: <Nav> is `position: sticky`, and
          a wrapper would become its containing block — the header would then
          only stick within its own 64px box and scroll away immediately. */}
      <Nav />
      {children}
    </SceneProvider>
  );
}
