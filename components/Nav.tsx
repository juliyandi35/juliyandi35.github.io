"use client";

import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { useOptionalSceneContext } from "@/components/Exploration/SceneContext";

// Labels are recruiter-facing terms, not the editorial names used inside
// each section (Trajectory, Formation) — a first-time visitor scanning the
// nav should recognize every item immediately.
const links = [
  { href: "#trajectory", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#graph", label: "Projects" },
  { href: "#formation", label: "Skills & Education" },
  { href: "#contact", label: "Discuss a role" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const scene = useOptionalSceneContext();

  // Once the visitor has arrived inside the core, the graph stage is meant to
  // be the graph and nothing else, so the site chrome steps aside. Hiding it
  // with `visibility` rather than opacity alone also takes these links out of
  // the tab order, so nothing focusable is left invisible on the page.
  const hidden = (scene?.arrival ?? 0) > 0.55;

  return (
    <header
      style={{
        visibility: hidden ? "hidden" : "visible",
        opacity: hidden ? 0 : 1,
        transition: "opacity 400ms ease",
      }}
      className="sticky top-0 z-50 h-[64px] border-b hairline bg-porcelain/90 backdrop-blur supports-[backdrop-filter]:bg-porcelain/75">
      <nav
        aria-label="Primary"
        className="container-editorial flex h-[64px] items-center justify-between"
      >
        <a href="#top" className="font-mono-label text-xs text-ink">
          Juli Yandi Rahman
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono-label text-xs text-graphite transition-colors duration-200 hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-surface border hairline text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t hairline bg-porcelain md:hidden">
          <ul className="container-editorial flex flex-col gap-1 py-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block min-h-[44px] py-3 font-mono-label text-sm text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
