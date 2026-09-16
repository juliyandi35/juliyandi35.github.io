import { describe, it, expect } from "vitest";
import {
  graph,
  rootEdgeVertices,
  projectEdgeVertices,
  getApplication,
  getProject,
  APP_COLORS,
  EXCLUDED_APPLICATIONS,
} from "@/lib/graph";
import { manifest } from "@/lib/data";

describe("graph topology", () => {
  it("is a three-tier hierarchy: one core, every non-excluded application, every non-excluded repository", () => {
    const expectedAppCount = Object.keys(manifest.applicationTokenCounts).filter(
      (name) => !EXCLUDED_APPLICATIONS.has(name),
    ).length;
    const expectedProjectCount = manifest.repos.filter(
      (repo) => !repo.applications.some((app) => EXCLUDED_APPLICATIONS.has(app)),
    ).length;

    expect(graph.root).toEqual([0, 0, 0]);
    expect(graph.applications).toHaveLength(expectedAppCount);
    expect(graph.projects).toHaveLength(expectedProjectCount);
  });

  it("never surfaces an excluded application or one of its repositories", () => {
    for (const app of graph.applications) {
      expect(EXCLUDED_APPLICATIONS.has(app.name)).toBe(false);
    }
    for (const project of graph.projects) {
      for (const excluded of EXCLUDED_APPLICATIONS) {
        expect(project.applicationRaw).not.toContain(excluded);
      }
    }
  });

  it("lists applications most-used first", () => {
    for (let i = 1; i < graph.applications.length; i += 1) {
      expect(graph.applications[i]!.count).toBeLessThanOrEqual(graph.applications[i - 1]!.count);
    }
  });

  it("takes every application count straight from the manifest", () => {
    for (const app of graph.applications) {
      expect(app.count).toBe(manifest.applicationTokenCounts[app.name]);
    }
  });

  it("places every application hub the same distance from the core", () => {
    const distances = graph.applications.map((a) => Math.hypot(...a.position));
    for (const d of distances) expect(d).toBeCloseTo(14, 3);
  });

  it("keeps every project node clear of the core, so the centre stays readable", () => {
    for (const project of graph.projects) {
      expect(Math.hypot(...project.position)).toBeGreaterThan(6);
    }
  });

  it("gives every project a real repository name, title and URL", () => {
    for (const project of graph.projects) {
      expect(project.repoName.length).toBeGreaterThan(0);
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.url).toMatch(/^https:\/\/github\.com\/juliyandi35\//);
    }
  });

  it("attaches every project to at least one real application", () => {
    for (const project of graph.projects) {
      expect(project.appIndices.length).toBeGreaterThan(0);
      for (const index of project.appIndices) {
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(graph.applications.length);
      }
      expect(project.primaryApp).toBeGreaterThanOrEqual(0);
    }
  });

  it("keeps the two-application projects genuinely attached to both", () => {
    const dual = graph.projects.filter((p) => p.appIndices.length > 1);
    expect(dual).toHaveLength(5);
    for (const project of dual) {
      for (const index of project.appIndices) {
        expect(graph.applications[index]!.projectIndices).toContain(project.index);
      }
    }
  });

  it("has back-references that agree with the forward references", () => {
    const backwards = graph.applications.reduce((sum, a) => sum + a.projectIndices.length, 0);
    const forwards = graph.projects.reduce((sum, p) => sum + p.appIndices.length, 0);
    expect(backwards).toBe(forwards);

    const reachable = new Set(graph.applications.flatMap((a) => a.projectIndices));
    expect(reachable.size).toBe(graph.projects.length);
  });

  it("never lists the same project twice under one application", () => {
    for (const app of graph.applications) {
      expect(new Set(app.projectIndices).size).toBe(app.projectIndices.length);
    }
  });

  it("gives every application a distinguishable colour", () => {
    expect(APP_COLORS.length).toBeGreaterThanOrEqual(graph.applications.length);
    const used = graph.applications.map((a) => a.color);
    expect(new Set(used).size).toBe(used.length);
    for (const color of used) expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("reports a radius that actually bounds the graph", () => {
    for (const project of graph.projects) {
      expect(Math.hypot(...project.position)).toBeLessThanOrEqual(graph.radius + 1e-6);
    }
  });
});

describe("edge geometry", () => {
  it("emits one root spoke per application", () => {
    expect(rootEdgeVertices()).toHaveLength(graph.applications.length * 6);
  });

  it("emits one segment per application-project membership", () => {
    const memberships = graph.projects.reduce((sum, p) => sum + p.appIndices.length, 0);
    const { positions, appIndexPerEdge } = projectEdgeVertices();
    expect(positions).toHaveLength(memberships * 6);
    expect(appIndexPerEdge).toHaveLength(memberships);
  });

  it("produces only finite coordinates", () => {
    for (const value of rootEdgeVertices()) expect(Number.isFinite(value)).toBe(true);
    for (const value of projectEdgeVertices().positions) expect(Number.isFinite(value)).toBe(true);
  });
});

describe("lookups", () => {
  it("resolves valid indices and refuses invalid ones", () => {
    expect(getApplication(0)?.name).toBe(graph.applications[0]!.name);
    expect(getProject(0)?.repoName).toBe(graph.projects[0]!.repoName);
    expect(getApplication(-1)).toBeNull();
    expect(getApplication(9999)).toBeNull();
    expect(getProject(-1)).toBeNull();
    expect(getProject(9999)).toBeNull();
  });
});
