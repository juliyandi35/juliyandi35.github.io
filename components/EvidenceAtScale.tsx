import { manifest } from "@/lib/data";
import Reveal from "@/components/Reveal";

const languageEntries = Object.entries(manifest.languageCounts).sort((a, b) => b[1] - a[1]);
const noLanguageCount = manifest.languageCounts["None"] ?? 0;
/** Distinct application tools — the same 16 the project graph is built around. */
const applicationCount = Object.keys(manifest.applicationTokenCounts).length;

export default function EvidenceAtScale() {
  return (
    <section className="border-b hairline bg-porcelain py-20 sm:py-28">
      <div className="container-editorial">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
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
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-surface border hairline bg-hairline sm:grid-cols-3">
              <StatCell value={manifest.total} label="Public repositories" />
              <StatCell value={manifest.methodFamilies.length} label="Method families" />
              <StatCell value={applicationCount} label="Applications" />
            </div>

            <div className="mt-6 rounded-surface border hairline bg-paper p-6">
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
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StatCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-paper p-6 sm:p-8">
      <p className="text-4xl font-medium text-ink sm:text-5xl">{value}</p>
      <p className="mt-2 font-mono-label text-[11px] text-graphite">{label}</p>
    </div>
  );
}
