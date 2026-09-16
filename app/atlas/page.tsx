import Link from "next/link";
import type { Metadata } from "next";
import ProjectAtlas from "@/components/ProjectAtlas";

export const metadata: Metadata = {
  title: "Project atlas",
};

/**
 * The full catalog lives on its own route rather than as a homepage section:
 * the homepage's job is to read as a recruiter's decision order, and the
 * graph is where visitors explore every project in full. This page is what
 * the graph's own links (an application's "list them in the atlas", and the
 * no-WebGL fallback) point to — the searchable/filterable list is still the
 * full keyboard and screen-reader equivalent of the graph, just reached
 * deliberately instead of scrolled past.
 */
export default function AtlasPage() {
  return (
    <main id="main-content" className="min-h-screen bg-porcelain">
      <header className="sticky top-0 z-50 h-[64px] border-b hairline bg-porcelain/90 backdrop-blur supports-[backdrop-filter]:bg-porcelain/75">
        <div className="container-editorial flex h-[64px] items-center justify-between">
          <Link href="/" className="font-mono-label text-xs text-ink">
            Juli Yandi Rahman
          </Link>
          {/*
            Not `/#graph`: a hash landing on a cross-route navigation into
            this page's tall, client-rendered graph section is measured
            before layout has settled and lands short (verified: it stops
            around "Skills & Education" instead). Plain `/` is the reliable
            target; fixing the underlying scroll-timing issue belongs with
            the graph section itself, not this link.
          */}
          <Link
            href="/"
            className="font-mono-label text-xs text-graphite transition-colors duration-200 hover:text-ink"
          >
            ← Back to the site
          </Link>
        </div>
      </header>
      <ProjectAtlas />
    </main>
  );
}
