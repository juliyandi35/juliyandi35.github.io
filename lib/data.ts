import manifestJson from "@/data/manifest.json";

export interface Repo {
  name: string;
  methods: string[];
  applicationRaw: string;
  applications: string[];
  language: string | null;
  url: string;
  updatedAt: string;
  createdAt: string;
  sizeKb: number;
}

export interface Manifest {
  generatedAt: string;
  total: number;
  methodFamilies: string[];
  methodCounts: Record<string, number>;
  applicationCombinations: string[];
  applicationTokenCounts: Record<string, number>;
  languageCounts: Record<string, number>;
  excludedLegacyRepos: string[];
  repos: Repo[];
}

export const manifest = manifestJson as Manifest;

/** Human-readable title from a kebab/slug repository name. */
export function titleFromName(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => {
      if (/^[A-Z0-9]+$/.test(word) && word.length <= 5) return word; // keep acronyms (AI, GIS, SEM)
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export const NO_CODE_LANGUAGE = "None";

export function isNoLanguageDetected(repo: Repo): boolean {
  return !repo.language;
}

export function isExcelOnly(repo: Repo): boolean {
  return repo.applications.length === 1 && repo.applications[0] === "Excel";
}

export interface AtlasFilters {
  query?: string;
  method?: string;
  application?: string;
  language?: string;
  noCode?: "excel" | "no-language" | null;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s_-]+/g, " ").trim();
}

export function filterRepos(repos: Repo[], filters: AtlasFilters): Repo[] {
  const query = filters.query ? normalize(filters.query) : "";
  return repos.filter((repo) => {
    if (query) {
      const haystack = normalize(
        [repo.name, titleFromName(repo.name), ...repo.methods, repo.applicationRaw].join(" "),
      );
      if (!haystack.includes(query)) return false;
    }
    if (filters.method && !repo.methods.includes(filters.method)) return false;
    if (filters.application && !repo.applications.includes(filters.application)) return false;
    if (filters.language) {
      const lang = repo.language || NO_CODE_LANGUAGE;
      if (lang !== filters.language) return false;
    }
    if (filters.noCode === "excel" && !isExcelOnly(repo)) return false;
    if (filters.noCode === "no-language" && !isNoLanguageDetected(repo)) return false;
    return true;
  });
}

export function sortByUpdatedDesc(repos: Repo[]): Repo[] {
  return [...repos].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export const PAGE_SIZE = 24;

export function paginate<T>(items: T[], page: number, pageSize: number = PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
