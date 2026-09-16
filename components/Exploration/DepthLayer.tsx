"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type RevealState = "static" | "hidden" | "revealed";

/**
 * A lightweight scroll reveal: content fades and slides up slightly the
 * first time it enters the viewport, then stays fully visible for good.
 *
 * This used to drive a 3D "depth" travel effect (translateZ from -1150 to
 * 620 through a perspective viewport) via a GSAP ScrollTrigger. That
 * transformed the whole wrapped section — including the anchor target other
 * pages link to — which caused horizontal overflow, anchors landing away
 * from the section they targeted, and a color-contrast failure mid-read.
 *
 * A follow-up attempt kept GSAP but swapped in a plain opacity/translateY
 * reveal, gated by a scroll-triggered "play once" tween. That still relied
 * on GSAP's scroll listener to notice the reveal point had already been
 * passed — which a page loaded straight at an anchor (`/#graph`) never
 * fires, since the browser's native hash-scroll happens before any scroll
 * *event* does. Sections reached that way stayed invisible forever.
 *
 * This version needs no scroll-timing assumptions at all: on mount it
 * synchronously checks the element's actual position. Already on screen
 * (including "reached directly via an anchor") → render plain and visible,
 * matching the server-rendered markup exactly. Below the fold → hide it and
 * reveal via IntersectionObserver, which reports current geometry
 * immediately rather than waiting for a scroll event.
 */
export default function DepthLayer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<RevealState>("static");

  useEffect(() => {
    if (reducedMotion) return;
    const node = layerRef.current;
    if (!node) return;

    // Matches the old "top 85% of viewport" entry point, checked directly
    // instead of inferred from a scroll delta.
    const alreadyVisible = node.getBoundingClientRect().top < window.innerHeight * 0.85;
    if (alreadyVisible) return; // stays "static": plain, always visible.

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("revealed");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={layerRef}
      className={className}
      style={
        state === "static"
          ? undefined
          : {
              opacity: state === "revealed" ? 1 : 0,
              transform: state === "revealed" ? "none" : "translateY(24px)",
              // `visibility`, not opacity alone, while hidden: keeps
              // not-yet-revealed content out of the tab order.
              visibility: state === "revealed" ? "visible" : "hidden",
              transition: "opacity 500ms ease, transform 500ms ease",
            }
      }
    >
      {children}
    </div>
  );
}
