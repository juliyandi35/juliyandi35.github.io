/**
 * Pure taxonomy parser shared by tests and documentation for
 * scripts/build-manifest.mjs (which intentionally keeps its own copy of this
 * logic in plain Node ESM so the data pipeline has zero build-tool
 * dependencies). Kept here, typed, so the parsing rule itself is unit
 * tested independent of the live GitHub call.
 */

export interface ParsedDescription {
  methods: string[];
  applicationRaw: string;
  applications: string[];
}

/**
 * A repository is only included in the public manifest when its
 * description follows "<Method> [| <Method2>] | <Application(s)>". Anything
 * else (an ordinary free-text description, or no description at all) is
 * treated the way a CSV pipeline would treat a row without
 * Status = "Selesai": excluded, not guessed at.
 */
export function parseDescription(description: string | null | undefined): ParsedDescription | null {
  const trimmed = (description ?? "").trim();
  if (!trimmed.includes("|")) return null;

  const parts = trimmed.split("|").map((p) => p.trim());
  const applicationRaw = parts[parts.length - 1] ?? "";
  const methods = parts.slice(0, -1).filter(Boolean);
  const applications = applicationRaw
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  if (methods.length === 0 || applications.length === 0) return null;

  return { methods, applicationRaw, applications };
}
