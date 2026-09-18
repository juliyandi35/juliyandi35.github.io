import { manifest } from "@/lib/data";
import { graph } from "@/lib/graph";
import Reveal from "@/components/Reveal";
import ApplicationSpectrum from "@/components/Motifs/ApplicationSpectrum";
import TenunTexture from "@/components/Motifs/TenunTexture";

const languageEntries = Object.entries(manifest.languageCounts).sort((a, b) => b[1] - a[1]);
const noLanguageCount = manifest.languageCounts["None"] ?? 0;
/** Distinct application tools — the same ones the project graph is built around. */
const applicationCount = graph.applications.length;

export default function EvidenceAtScale() {
  return (
    <section className="border-b hairline bg-porcelain py-20 sm:py-28">
      <div className="container-editorial">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Reveal className="relative overflow-hidden rounded-surface border hairline bg-paper p-8 lg:col-span-7">
            <p className="font-mono-label text-xs text-oxide">Evidence at scale</p>
            <h2 className="mt-3 text-3xl font-medium leading-tight text-ink sm:text-4xl">
              {manifest.total} public repositories.
              <br />
              {manifest.methodFamilies.length} method families.
              <br />
              {applicationCount} applications.
            </h2>
            <p className="mt-5 max-w-md text-graphite">
              Every figure on this page is read directly from the public GitHub account at
              build time, not asserted. Each repository&apos;s description encodes its own
              method family and application, so the count below is exactly what is public
              and verifiable today. Those {applicationCount} applications appear in{" "}
              {manifest.applicationCombinations.length} distinct combinations, since some
              projects use two tools together.
            </p>
            <TenunTexture className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5" />
          </Reveal>

          <Reveal
            className="flex flex-col justify-center rounded-surface border hairline bg-oxide/[0.05] p-8 lg:col-span-5"
            delay={0.08}
          >
            <p className="text-6xl font-medium text-ink sm:text-7xl">{manifest.total}</p>
            <p className="mt-2 font-mono-label text-[11px] text-graphite">
              Public repositories, every one of them real
            </p>
          </Reveal>

          <Reveal className="rounded-surface border hairline bg-paper p-6 lg:col-span-4" delay={0.12}>
            <StatCell value={manifest.methodFamilies.length} label="Method families" />
          </Reveal>
          <Reveal className="rounded-surface border hairline bg-paper p-6 lg:col-span-4" delay={0.16}>
            <StatCell value={applicationCount} label="Applications" />
          </Reveal>
          <Reveal className="rounded-surface border hairline bg-paper p-6 lg:col-span-4" delay={0.2}>
            <StatCell value={manifest.applicationCombinations.length} label="Application combinations" />
          </Reveal>

          <Reveal className="rounded-surface border hairline bg-paper p-6 lg:col-span-12" delay={0.24}>
            <p className="font-mono-label text-[11px] text-graphite">
              Every application in use, coloured exactly as it appears in the project graph
            </p>
            <ApplicationSpectrum className="mt-4" />
          </Reveal>

          <Reveal className="rounded-surface border hairline bg-paper p-6 lg:col-span-12" delay={0.28}>
            <p className="font-mono-label text-[11px] text-graphite">
              Language distribution across all {manifest.total} repositories
            </p>
            <ul className="mt-4 space-y-2">
              {languageEntries.map(([lang, count]) => (
                <li key={lang} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-sm text-ink sm:w-40">
                    {lang === "None" ? "No source language detected" : lang}
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-pill bg-hairline/60">
                    <span
                      className="block h-full rounded-pill bg-oxide"
                      style={{ width: `${(count / manifest.total) * 100}%` }}
                    />
                  </span>
                  <span className="font-mono-label w-10 shrink-0 text-right text-xs text-graphite">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-graphite">
              {noLanguageCount} repositories carry no linguist-detected source language
              (typically Excel, SPSS, or Stata project files rather than source code) — a
              real, build-time count, not an estimate.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StatCell({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-4xl font-medium text-ink sm:text-5xl">{value}</p>
      <p className="mt-2 font-mono-label text-[11px] text-graphite">{label}</p>
    </div>
  );
}
