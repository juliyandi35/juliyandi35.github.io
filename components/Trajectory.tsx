"use client";

import { useEffect, useRef, useState } from "react";
import { trajectory } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Pinned scroll narrative across four stages. Uses GSAP ScrollTrigger when
 * motion is allowed; degrades to a simple sequential, unpinned list when
 * `prefers-reduced-motion` is set, per the accessibility requirements.
 *
 * `activeStage` is the single source of truth for both halves: the progress
 * list on the right (which stage is current) and the stage card on the left
 * (which stage's copy is showing) both render straight from it, crossfading
 * with a plain CSS transition. They previously ran two independent
 * scroll-triggered animations pinned to the same trigger element, which could
 * drift out of sync with each other; deriving both from one state value
 * cannot.
 */
export default function Trajectory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    let ctx: { revert: () => void } | undefined;
    let mounted = true;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!mounted || !sectionRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${trajectory.length * 500}`,
          pin: true,
          scrub: 0.4,
          onUpdate: (self) => {
            const index = Math.min(trajectory.length - 1, Math.floor(self.progress * trajectory.length));
            setActiveStage(index);
          },
        });
      }, sectionRef);
    })();

    return () => {
      mounted = false;
      ctx?.revert();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section id="trajectory" className="border-b hairline bg-paper py-20">
        <div className="container-editorial">
          <SectionIntro />
          <ol className="mt-10 space-y-10">
            {trajectory.map((stage) => (
              <li key={stage.id} className="border-t hairline pt-6">
                <StageContent stage={stage} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="trajectory" ref={sectionRef} className="relative border-b hairline bg-paper">
      <div className="container-editorial flex min-h-screen flex-col justify-center py-16">
        <SectionIntro />

        <div className="relative mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="relative min-h-[22rem] lg:col-span-7 lg:min-h-[26rem]">
            {trajectory.map((stage, i) => (
              <div
                key={stage.id}
                className="absolute inset-0 transition-opacity duration-500 ease-atelier"
                style={{
                  opacity: i === activeStage ? 1 : 0,
                  visibility: i === activeStage ? "visible" : "hidden",
                }}
              >
                <StageContent stage={stage} />
              </div>
            ))}
          </div>

          <div className="flex items-center lg:col-span-5">
            <ol className="flex w-full flex-col gap-1" aria-label="Trajectory progress">
              {trajectory.map((stage, i) => (
                <li
                  key={stage.id}
                  className="flex items-center gap-3 border-l-2 py-3 pl-4 transition-colors duration-300"
                  style={{ borderColor: i === activeStage ? "#1E6B55" : "#CED4CE" }}
                  aria-current={i === activeStage ? "step" : undefined}
                >
                  <span className="font-mono-label text-[11px] text-graphite">{stage.year}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: i === activeStage ? "#1E6B55" : "#171B18" }}
                  >
                    {stage.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionIntro() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-medium text-ink sm:text-3xl">From proof to practice</h2>
      <p className="mt-3 text-graphite">
        Four stages carry the same underlying discipline — formal mathematics — into research
        consulting, public-sector data systems, and applied AI and security work.
      </p>
    </div>
  );
}

function StageContent({ stage }: { stage: (typeof trajectory)[number] }) {
  return (
    <div className="max-w-xl rounded-surface border hairline bg-porcelain p-8">
      <p className="font-mono-label text-xs text-oxide">{stage.label}</p>
      <h3 className="mt-3 text-xl font-medium text-ink sm:text-2xl">{stage.title}</h3>
      <p className="mt-2 font-mono-label text-[11px] text-graphite">{stage.year}</p>
      <p className="mt-4 leading-relaxed text-graphite">{stage.body}</p>
    </div>
  );
}
