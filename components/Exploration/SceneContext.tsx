"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

interface SceneState {
  /** 0 → 1 across the final graph stage: 0 is far away, 1 is arrived at the core. */
  arrival: number;
  /** Application cluster the camera is framing, or null for the whole graph. */
  focusedApp: number | null;
  /** Project whose detail popup is open, or null. */
  selectedProject: number | null;
  setFocusedApp: (index: number | null) => void;
  setSelectedProject: (index: number | null) => void;
  /** Driven by the graph stage's scroll listener — not for general use. */
  _setArrival: (value: number) => void;
}

const SceneCtx = createContext<SceneState | null>(null);

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const [arrival, setArrival] = useState(0);
  const [focusedApp, setFocusedAppState] = useState<number | null>(null);
  const [selectedProject, setSelectedProjectState] = useState<number | null>(null);
  const lastArrival = useRef(0);

  // Scroll fires far more often than React needs to re-render; ignore
  // sub-threshold changes so the whole content tree is not re-rendered on
  // every single scroll event.
  const _setArrival = useCallback((value: number) => {
    if (Math.abs(value - lastArrival.current) < 0.004) return;
    lastArrival.current = value;
    setArrival(value);
  }, []);

  const setFocusedApp = useCallback((index: number | null) => {
    setFocusedAppState(index);
    // Focusing a different cluster dismisses a popup that belongs elsewhere.
    setSelectedProjectState(null);
  }, []);

  const setSelectedProject = useCallback((index: number | null) => {
    setSelectedProjectState(index);
  }, []);

  const value = useMemo<SceneState>(
    () => ({ arrival, focusedApp, selectedProject, setFocusedApp, setSelectedProject, _setArrival }),
    [arrival, focusedApp, selectedProject, setFocusedApp, setSelectedProject, _setArrival],
  );

  return <SceneCtx.Provider value={value}>{children}</SceneCtx.Provider>;
}

export function useSceneContext(): SceneState {
  const ctx = useContext(SceneCtx);
  if (!ctx) {
    throw new Error("useSceneContext must be used inside <SceneProvider>");
  }
  return ctx;
}

/**
 * Same state, but null instead of an error when there is no provider — for
 * components like the site navigation that respond to the journey when it is
 * present but must still render correctly on their own.
 */
export function useOptionalSceneContext(): SceneState | null {
  return useContext(SceneCtx);
}
