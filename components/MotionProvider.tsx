"use client";

import { MotionConfig } from "framer-motion";

/**
 * framer-motion's <MotionConfig> reads/writes React context and is not
 * server-renderable, so it cannot be used directly inside app/layout.tsx —
 * that file is a Server Component (it exports `metadata`, which is only
 * allowed in a Server Component) and must stay one. This thin client
 * wrapper is the boundary: layout.tsx renders <MotionProvider>{children}
 * </MotionProvider> instead of <MotionConfig> directly, so every page's
 * Server Component tree still renders on the server as normal, and only
 * this one small provider actually runs on the client.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
