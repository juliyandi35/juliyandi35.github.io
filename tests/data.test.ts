import { describe, it, expect } from "vitest";
import { manifest, filterRepos, sortByUpdatedDesc, paginate, titleFromName } from "@/lib/data";

describe("manifest integrity", () => {
  it("contains exactly the documented totals", () => {
    expect(manifest.total).toBe(301);
    expect(manifest.repos).toHaveLength(301);
    expect(manifest.methodFamilies).toHaveLength(13);
    expect(manifest.applicationCombinations).toHaveLength(19);
  });

  it("every repository has a real GitHub link", () => {
    for (const repo of manifest.repos) {
      expect(repo.url).toMatch(/^https:\/\/github\.com\/juliyandi35\//);
    }
  });

  it("every repository's methods are drawn from the declared method families", () => {
    const familySet = new Set(manifest.methodFamilies);
    for (const repo of manifest.repos) {
      for (const method of repo.methods) {
        expect(familySet.has(method)).toBe(true);
      }
    }
  });
});

describe("filterRepos", () => {
  it("filters by method family", () => {
    const method = manifest.methodFamilies[0]!;
    const result = filterRepos(manifest.repos, { method });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((r) => r.methods.includes(method))).toBe(true);
  });

  it("search is case-insensitive and tolerant of spacing", () => {
    const sample = manifest.repos[0]!;
    const spaced = titleFromName(sample.name).toUpperCase();
    const result = filterRepos(manifest.repos, { query: spaced });
    expect(result.some((r) => r.name === sample.name)).toBe(true);
  });

  it("combines multiple filters", () => {
    const repoWithLanguage = manifest.repos.find((r) => r.language);
    expect(repoWithLanguage).toBeTruthy();
    const result = filterRepos(manifest.repos, {
      method: repoWithLanguage!.methods[0],
      language: repoWithLanguage!.language ?? undefined,
    });
    expect(result.some((r) => r.name === repoWithLanguage!.name)).toBe(true);
  });

  it("returns an empty array when nothing matches", () => {
    const result = filterRepos(manifest.repos, { query: "zzzz-not-a-real-project-zzzz" });
    expect(result).toHaveLength(0);
  });

  it("reproduces the Excel-only and no-language-detected no-code filters", () => {
    const excelOnly = filterRepos(manifest.repos, { noCode: "excel" });
    const noLanguage = filterRepos(manifest.repos, { noCode: "no-language" });
    expect(excelOnly.every((r) => r.applications.length === 1 && r.applications[0] === "Excel")).toBe(true);
    expect(noLanguage.every((r) => !r.language)).toBe(true);
  });
});

describe("sortByUpdatedDesc + paginate", () => {
  it("sorts most recently updated first", () => {
    const sorted = sortByUpdatedDesc(manifest.repos);
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i - 1]!.updatedAt >= sorted[i]!.updatedAt).toBe(true);
    }
  });

  it("paginates without dropping or duplicating items", () => {
    const sorted = sortByUpdatedDesc(manifest.repos);
    const pageSize = 24;
    const page1 = paginate(sorted, 1, pageSize);
    const page2 = paginate(sorted, 2, pageSize);
    expect(page1).toHaveLength(pageSize);
    expect(page1[0]).toEqual(sorted[0]);
    expect(page2[0]).toEqual(sorted[pageSize]);
  });
});
