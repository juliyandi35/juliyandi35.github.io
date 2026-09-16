"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  manifest,
  filterRepos,
  sortByUpdatedDesc,
  paginate,
  titleFromName,
  PAGE_SIZE,
  type AtlasFilters,
} from "@/lib/data";

const families = [...manifest.methodFamilies].sort();
/**
 * Individual application tokens, not `applicationCombinations`.
 *
 * `filterRepos` matches with `repo.applications.includes(filters.application)`,
 * and `repo.applications` holds separated tokens — so a compound entry like
 * "Python, Gurobi" or "SPSS, SmartPLS" could never match anything and those
 * options silently returned zero results. Listing the tokens also makes this
 * filter agree with the project graph, whose application hubs (and the
 * "list them in the atlas" links pointing here) are keyed the same way.
 */
const applications = Object.keys(manifest.applicationTokenCounts).sort();
const languages = Object.keys(manifest.languageCounts).sort();

export default function AtlasClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [queryInput, setQueryInput] = useState(searchParams.get("q") ?? "");

  const filters: AtlasFilters = useMemo(
    () => ({
      query: searchParams.get("q") ?? "",
      method: searchParams.get("method") ?? "",
      application: searchParams.get("app") ?? "",
      language: searchParams.get("lang") ?? "",
      noCode: (searchParams.get("nocode") as AtlasFilters["noCode"]) ?? null,
    }),
    [searchParams],
  );

  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  useEffect(() => {
    setQueryInput(filters.query ?? "");
  }, [filters.query]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (resetPage) params.delete("page");
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}#atlas`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const filtered = useMemo(() => sortByUpdatedDesc(filterRepos(manifest.repos, filters)), [filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => paginate(filtered, currentPage), [filtered, currentPage]);

  const hasFilters = Boolean(filters.query || filters.method || filters.application || filters.language || filters.noCode);

  function clearAll() {
    router.replace(`${pathname}#atlas`, { scroll: false });
  }

  return (
    <div>
      <div aria-live="polite" className="sr-only">
        {filtered.length} of {manifest.total} projects shown
      </div>

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          updateParams({ q: queryInput || null });
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label className="sr-only" htmlFor="atlas-search">
          Search projects by name or method
        </label>
        <input
          id="atlas-search"
          type="search"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Search by project or method…"
          className="h-11 flex-1 rounded-surface border hairline bg-paper px-4 text-sm text-ink placeholder:text-graphite/70"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-pill bg-ink px-6 text-sm font-medium text-paper transition-transform duration-200 hover:-translate-y-0.5"
        >
          Search
        </button>
      </form>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Method family"
          value={filters.method ?? ""}
          onChange={(v) => updateParams({ method: v || null })}
          options={families}
        />
        <Select
          label="Application"
          value={filters.application ?? ""}
          onChange={(v) => updateParams({ app: v || null })}
          options={applications}
        />
        <Select
          label="Language"
          value={filters.language ?? ""}
          onChange={(v) => updateParams({ lang: v || null })}
          options={languages}
          renderOption={(l) => (l === "None" ? "No language detected" : l)}
        />
        <Select
          label="Project type"
          value={filters.noCode ?? ""}
          onChange={(v) => updateParams({ nocode: v || null })}
          options={["excel", "no-language"]}
          renderOption={(v) => (v === "excel" ? "Excel only" : "No programming language file")}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t hairline pt-4">
        <p className="text-sm text-graphite">
          <span className="font-medium text-ink">{filtered.length}</span> of {manifest.total} projects
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="min-h-[44px] rounded-pill border hairline px-4 text-sm text-graphite transition-colors duration-200 hover:border-oxide hover:text-oxide"
          >
            Clear all filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-surface border hairline bg-paper p-10 text-center">
          <p className="text-ink">No projects match these filters.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 inline-block min-h-[44px] rounded-pill bg-ink px-5 py-2.5 text-sm font-medium text-paper"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((repo) => (
            <li key={repo.name} className="rounded-surface border hairline bg-paper p-5">
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxide"
              >
                <p className="font-mono-label text-[10px] text-graphite">{repo.methods.join(" · ")}</p>
                <h3 className="mt-1.5 text-sm font-medium leading-snug text-ink">{titleFromName(repo.name)}</h3>
                <p className="mt-2 flex items-center justify-between font-mono-label text-[10px] text-oxide">
                  <span>{repo.applicationRaw}</span>
                  {repo.language && <span className="text-graphite">{repo.language}</span>}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav aria-label="Project Atlas pagination" className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => updateParams({ page: String(currentPage - 1) }, false)}
            className="min-h-[44px] rounded-pill border hairline px-4 text-sm text-ink disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-mono-label text-xs text-graphite">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => updateParams({ page: String(currentPage + 1) }, false)}
            className="min-h-[44px] rounded-pill border hairline px-4 text-sm text-ink disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  renderOption,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  renderOption?: (value: string) => string;
}) {
  const id = `atlas-filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-mono-label text-[10px] text-graphite">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-surface border hairline bg-paper px-3 text-sm text-ink"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {renderOption ? renderOption(opt) : opt}
          </option>
        ))}
      </select>
    </div>
  );
}
