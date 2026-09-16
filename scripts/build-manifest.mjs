#!/usr/bin/env node
/**
 * Build-time data pipeline.
 *
 * Regenerates data/manifest.json from the public GitHub API for
 * GITHUB_USERNAME (default: juliyandi35).
 *
 * Why this exists: the site's "source of truth" is not a CSV export but the
 * repository descriptions themselves, which already encode the taxonomy as
 * "<Method family> [| <second method family>] | <Application(s)>", e.g.
 *   "Regresi, korelasi & ekonometrika | R / RStudio"
 *   "Machine learning, AI & data mining | MCDM, optimasi & riset operasi | Python"
 * Any repository whose description does not follow this pattern is treated
 * as not-yet-classified and excluded from the public manifest, the same way
 * a CSV pipeline would only keep rows with Status = "Selesai".
 *
 * Network reality: unauthenticated GitHub API requests are capped at
 * 60/hour, which is not enough to safely refresh ~300 repositories in one
 * run. Set GITHUB_TOKEN (a fine-grained, public-read-only token) in the
 * environment to raise that to 5,000/hour. The token is read only here, at
 * build time, in this Node process — it is never written to disk, never
 * logged, and never reaches data/manifest.json or the client bundle.
 *
 * Resilience: if the API is unreachable, rate-limited, or returns an
 * unexpected shape, this script leaves the existing data/manifest.json
 * untouched and exits 0, so `next build` always has data to render from.
 */

import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(__dirname, "..", "data", "manifest.json");

const USERNAME = process.env.GITHUB_USERNAME || "juliyandi35";
const TOKEN = process.env.GITHUB_TOKEN || "";

/** @typedef {{ name: string, methods: string[], applicationRaw: string, applications: string[], language: string | null, url: string, updatedAt: string, createdAt: string, sizeKb: number }} Repo */

async function fetchAllRepos() {
  /** @type {any[]} */
  const all = [];
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": `${USERNAME}-portfolio-build`,
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  for (let page = 1; page <= 20; page += 1) {
    const url = `https://api.github.com/users/${USERNAME}/repos?per_page=100&page=${page}&sort=full_name&direction=asc&type=owner`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`GitHub API responded ${res.status} on page ${page}`);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

/**
 * @param {any[]} rawRepos
 */
function parseManifest(rawRepos) {
  /** @type {Repo[]} */
  const repos = [];
  const excludedLegacyRepos = [];

  for (const r of rawRepos) {
    const description = (r.description || "").trim();
    if (!description.includes("|")) {
      excludedLegacyRepos.push(r.name);
      continue;
    }
    const parts = description.split("|").map((p) => p.trim());
    const applicationRaw = parts[parts.length - 1] ?? "";
    const methods = parts.slice(0, -1);
    const applications = applicationRaw
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    repos.push({
      name: r.name,
      methods,
      applicationRaw,
      applications,
      language: r.language ?? null,
      url: r.html_url ?? `https://github.com/${USERNAME}/${r.name}`,
      updatedAt: r.updated_at,
      createdAt: r.created_at,
      sizeKb: r.size ?? 0,
    });
  }

  const methodCounts = {};
  const applicationTokenCounts = {};
  const languageCounts = {};
  const applicationCombinationsSet = new Set();

  for (const repo of repos) {
    for (const m of repo.methods) methodCounts[m] = (methodCounts[m] || 0) + 1;
    for (const a of repo.applications) applicationTokenCounts[a] = (applicationTokenCounts[a] || 0) + 1;
    applicationCombinationsSet.add(repo.applicationRaw);
    const lang = repo.language || "None";
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  }

  return {
    generatedAt: new Date().toISOString().slice(0, 10),
    total: repos.length,
    methodFamilies: Object.keys(methodCounts).sort(),
    methodCounts,
    applicationCombinations: Array.from(applicationCombinationsSet).sort(),
    applicationTokenCounts,
    languageCounts,
    excludedLegacyRepos,
    repos,
  };
}

async function main() {
  try {
    const raw = await fetchAllRepos();
    if (raw.length === 0) {
      throw new Error("GitHub API returned zero repositories");
    }
    const manifest = parseManifest(raw);
    if (manifest.total < 1) {
      throw new Error("Parsed manifest is empty; keeping cached data/manifest.json");
    }
    await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
    console.log(
      `[build-manifest] Refreshed data/manifest.json: ${manifest.total} repositories, ` +
        `${manifest.methodFamilies.length} method families, ${manifest.applicationCombinations.length} application combinations.`,
    );
  } catch (err) {
    let cached = null;
    try {
      cached = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
    } catch {
      // no cache either
    }
    if (cached) {
      console.warn(
        `[build-manifest] Live GitHub enrichment failed (${err instanceof Error ? err.message : String(err)}). ` +
          `Falling back to cached data/manifest.json (${cached.total} repositories, generated ${cached.generatedAt}).`,
      );
    } else {
      console.error(
        `[build-manifest] Live GitHub enrichment failed and no cached manifest exists. ` +
          `The Project Atlas will render empty until data/manifest.json is present.\n${err}`,
      );
    }
  }
}

main();
