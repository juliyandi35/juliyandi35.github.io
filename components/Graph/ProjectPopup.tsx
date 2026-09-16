"use client";

import { useEffect, useRef } from "react";
import { getProject } from "@/lib/graph";
import { useSceneContext } from "@/components/Exploration/SceneContext";

/**
 * The small window that opens when a project node is clicked: the
 * repository's own name, what it was built with, and a button straight
 * through to the repository on GitHub.
 *
 * It is not a modal — the graph stays live behind it and the visitor can
 * keep clicking other nodes — so it is deliberately `aria-modal="false"` and
 * does not trap focus. It does take focus on open (otherwise a click in the
 * canvas would leave the keyboard stranded on the page body) and closes on
 * Escape.
 */
export default function ProjectPopup() {
  const { selectedProject, setSelectedProject } = useSceneContext();
  const panelRef = useRef<HTMLDivElement>(null);
  const project = selectedProject === null ? null : getProject(selectedProject);

  useEffect(() => {
    if (!project) return;
    panelRef.current?.focus();
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [project, setSelectedProject]);

  if (!project) return null;

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="project-popup-title"
      className="pointer-events-auto absolute inset-x-3 bottom-5 rounded-surface border hairline bg-paper/95 p-5 shadow-lg backdrop-blur-md sm:inset-x-auto sm:bottom-8 sm:right-8 sm:w-[22rem]"
    >
      <p className="font-mono-label text-[10px] text-oxide">Repository</p>

      <h3 id="project-popup-title" className="mt-2 text-lg font-medium leading-snug text-ink">
        {project.title}
      </h3>

      <p className="mt-1 font-mono-label text-[10px] text-graphite">{project.repoName}</p>

      <p className="mt-3 text-[13px] leading-relaxed text-graphite">
        {project.applicationRaw}
        {project.methods.length > 0 ? ` · ${project.methods.join(" · ")}` : ""}
      </p>

      <div className="mt-5 flex items-center gap-2">
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-2 rounded-pill bg-oxide px-4 py-2 text-[13px] font-medium text-paper transition-transform duration-200 ease-atelier hover:-translate-y-0.5"
        >
          Open repository
          <span aria-hidden="true">→</span>
        </a>
        <button
          type="button"
          onClick={() => setSelectedProject(null)}
          className="inline-flex min-h-[40px] items-center justify-center rounded-pill border hairline px-4 py-2 text-[13px] text-graphite transition-colors duration-200 hover:border-oxide hover:text-ink"
        >
          Close
        </button>
      </div>
    </div>
  );
}
