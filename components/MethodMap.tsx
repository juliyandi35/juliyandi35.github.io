"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { manifest, titleFromName, type Repo } from "@/lib/data";
import { glossOf } from "@/lib/methodGlosses";
import { methodColor } from "@/lib/methodPalette";
import { methodChord } from "@/lib/methodChord";
import MethodChord from "@/components/Motifs/MethodChord";
import ParangDivider from "@/components/Motifs/ParangDivider";

const families = [...manifest.methodFamilies].sort(
  (a, b) => (manifest.methodCounts[b] ?? 0) - (manifest.methodCounts[a] ?? 0),
);

const topLink = [...methodChord.links].sort((a, b) => b.weight - a.weight)[0];

export default function MethodMap() {
  const [active, setActive] = useState<string>(families[0] ?? "");

  const sample = useMemo<Repo[]>(() => {
    return manifest.repos.filter((r) => r.methods.includes(active)).slice(0, 4);
  }, [active]);

  return (
    <section id="practice" className="border-b hairline bg-paper py-20 sm:py-28">
      <div className="container-editorial">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="max-w-2xl lg:col-span-7">
            <p className="font-mono-label text-xs text-oxide">Methods as a living practice</p>
            <h2 className="mt-3 text-3xl font-medium text-ink sm:text-4xl">
              Breadth across {families.length} method families
            </h2>
            <p className="mt-4 text-graphite">
              Select a family to see a real sample from the public catalog, drawn straight
              from the manifest below — nothing here is staged.
            </p>
            <p className="mt-2 text-sm text-graphite">
              Currently viewing: <span className="text-ink">{glossOf(active)}</span>
            </p>
            {topLink && topLink.weight > 0 ? (
              <p className="mt-2 text-sm text-graphite">
                Most often combined in one repository:{" "}
                <span className="text-ink">{methodChord.nodes[topLink.a]?.name}</span> with{" "}
                <span className="text-ink">{methodChord.nodes[topLink.b]?.name}</span> (
                {topLink.weight} {topLink.weight === 1 ? "repository" : "repositories"}).
              </p>
            ) : null}
          </div>

          <div className="flex justify-center lg:col-span-5">
            <MethodChord className="h-64 w-64 sm:h-72 sm:w-72" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div
            role="tablist"
            aria-label="Method families"
            className="flex flex-wrap gap-2 lg:col-span-5 lg:flex-col lg:gap-1"
          >
            {families.map((family) => {
              const isActive = family === active;
              const count = manifest.methodCounts[family] ?? 0;
              return (
                <button
                  key={family}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(family)}
                  className={`flex min-h-[44px] items-center justify-between gap-3 rounded-surface border px-4 py-3 text-left text-sm transition-colors duration-200 ${
                    isActive
                      ? "border-oxide bg-oxide/[0.06] text-ink"
                      : "border-transparent text-graphite hover:border-hairline"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: methodColor(family) }}
                    />
                    {family}
                  </span>
                  <span className="font-mono-label shrink-0 text-[11px] text-graphite">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sample.map((repo) => (
                <li key={repo.name} className="rounded-surface border hairline bg-porcelain p-5">
                  <p className="font-medium text-ink">{titleFromName(repo.name)}</p>
                  <p className="mt-1 font-mono-label text-[11px] text-graphite">{repo.applicationRaw}</p>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm text-oxide underline decoration-oxide/40 underline-offset-4 hover:decoration-oxide"
                  >
                    View repository
                  </a>
                </li>
              ))}
            </ul>

            <Link
              href={`/?method=${encodeURIComponent(active)}#atlas`}
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-pill border hairline px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-oxide hover:text-oxide"
            >
              See all {manifest.methodCounts[active] ?? 0} in the Project Atlas
            </Link>
          </div>
        </div>

        <ParangDivider className="mt-16" />
      </div>
    </section>
  );
}
