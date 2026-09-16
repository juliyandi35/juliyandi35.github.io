import Link from "next/link";
import selectedRaw from "@/data/selected.json";
import { titleFromName, type Repo } from "@/lib/data";
import { glossOf } from "@/lib/methodGlosses";
import Reveal from "@/components/Reveal";

const selected = selectedRaw as Repo[];

function describe(repo: Repo): string {
  const glosses = repo.methods.map(glossOf).join(" combined with ");
  return `${titleFromName(repo.name)} applies ${glosses.toLowerCase()} in ${repo.applicationRaw}.`;
}

/**
 * A handful of flagship repositories, not one card per method family — a
 * briefing, not the catalog. This is the only project-sampling section on
 * the page; the full 301-repository catalog lives one scroll further, inside
 * the interactive graph (and its keyboard/screen-reader-equivalent list).
 */
export default function SelectedInvestigations() {
  const [featured, ...rest] = selected;
  const grid = rest.slice(0, 4);

  if (!featured) return null;

  return (
    <section className="border-b hairline bg-porcelain py-20 sm:py-28">
      <div className="container-editorial">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-mono-label text-xs text-oxide">Flagship investigations</p>
            <h2 className="mt-3 text-3xl font-medium text-ink sm:text-4xl">
              A closer look at select work
            </h2>
            <p className="mt-3 text-graphite">
              A glimpse, not the full list — five projects that represent the range.
            </p>
          </div>
          <Link
            href="#graph"
            className="font-mono-label whitespace-nowrap text-xs text-oxide underline decoration-oxide/40 underline-offset-4 hover:decoration-oxide"
          >
            Explore all 301 in the graph →
          </Link>
        </div>

        {/* Full-bleed case study */}
        <Reveal>
          <a
            href={featured.url}
            target="_blank"
            rel="noreferrer"
            className="mt-10 block rounded-surface border hairline bg-ink p-8 text-paper transition-transform duration-300 ease-atelier hover:-translate-y-1 sm:p-12"
          >
            <p className="font-mono-label text-[11px] text-porcelain/70">{featured.methods.join(" · ")}</p>
            <h3 className="mt-4 max-w-2xl text-2xl font-medium sm:text-3xl">{titleFromName(featured.name)}</h3>
            <p className="mt-4 max-w-xl text-porcelain/80">{describe(featured)}</p>
            <p className="mt-6 font-mono-label text-[11px] text-oxide">
              {featured.applicationRaw} · View repository →
            </p>
          </a>
        </Reveal>

        {/* Remaining flagship projects, evenly weighted */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {grid.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-surface border hairline bg-paper p-7 transition-colors duration-200 hover:border-oxide"
            >
              <p className="font-mono-label text-[11px] text-graphite">{repo.methods.join(" · ")}</p>
              <h3 className="mt-3 text-xl font-medium text-ink">{titleFromName(repo.name)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite">{describe(repo)}</p>
              <p className="mt-4 font-mono-label text-[11px] text-oxide">{repo.applicationRaw} →</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
