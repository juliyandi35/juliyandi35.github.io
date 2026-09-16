import { Suspense } from "react";
import { manifest } from "@/lib/data";
import AtlasClient from "@/components/Atlas/AtlasClient";
import Reveal from "@/components/Reveal";

export default function ProjectAtlas() {
  return (
    <section id="atlas" className="border-b hairline bg-paper py-20 sm:py-28">
      <div className="container-editorial">
        <Reveal className="max-w-2xl">
          <p className="font-mono-label text-xs text-oxide">Full catalog</p>
          <h2 className="mt-3 text-3xl font-medium text-ink sm:text-4xl">
            All {manifest.total} public repositories
          </h2>
          <p className="mt-4 text-graphite">
            The list view of the graph ahead: every repository, searchable and filterable,
            and the full keyboard and screen-reader equivalent of exploring it in 3D.
          </p>
        </Reveal>

        <div className="mt-10">
          <Suspense fallback={<p className="text-graphite">Loading project atlas…</p>}>
            <AtlasClient />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
