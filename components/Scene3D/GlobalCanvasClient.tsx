"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import GlobalScene from "@/components/Scene3D/GlobalScene";
import { APPROACH_START_DISTANCE, FOV } from "@/lib/camera";

/**
 * The single WebGL surface for the whole page. It is mounted once and kept
 * alive (so the context, shaders and geometry are warm by the time the
 * visitor reaches the core) but only renders frames while the graph stage is
 * actually on screen: elsewhere `frameloop="demand"` means it sits idle
 * instead of burning a GPU budget behind opaque content.
 */
export default function GlobalCanvasClient({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const [documentVisible, setDocumentVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setDocumentVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      frameloop={active && documentVisible ? "always" : "demand"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: FOV, near: 0.1, far: 400, position: [0, 16, APPROACH_START_DISTANCE] }}
    >
      <GlobalScene reducedMotion={reducedMotion} />
    </Canvas>
  );
}
