import { describe, it, expect } from "vitest";
import { parseDescription } from "@/lib/manifestParser";

describe("parseDescription", () => {
  it("parses a single method and application", () => {
    const result = parseDescription("Regresi, korelasi & ekonometrika | R / RStudio");
    expect(result).toEqual({
      methods: ["Regresi, korelasi & ekonometrika"],
      applicationRaw: "R / RStudio",
      applications: ["R / RStudio"],
    });
  });

  it("parses two method families sharing one application", () => {
    const result = parseDescription(
      "Machine learning, AI & data mining | MCDM, optimasi & riset operasi | Python",
    );
    expect(result?.methods).toEqual([
      "Machine learning, AI & data mining",
      "MCDM, optimasi & riset operasi",
    ]);
    expect(result?.applicationRaw).toBe("Python");
  });

  it("splits comma-separated application combinations", () => {
    const result = parseDescription("Spasial, geografis & GIS | R / RStudio, QGIS");
    expect(result?.applications).toEqual(["R / RStudio", "QGIS"]);
  });

  it("excludes a description with no pipe, like an untagged legacy repository", () => {
    expect(parseDescription("This repository contains a project about X")).toBeNull();
  });

  it("excludes an empty or missing description", () => {
    expect(parseDescription("")).toBeNull();
    expect(parseDescription(null)).toBeNull();
    expect(parseDescription(undefined)).toBeNull();
  });
});
