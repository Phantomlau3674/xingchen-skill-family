import fs from "node:fs";
import path from "node:path";

export function loadInvariantManifest(schemaDir, mode) {
  if (!new Set(["lean", "extended"]).has(mode)) {
    throw new Error(`Unsupported invariant mode: ${mode}`);
  }

  const manifestPath = path.resolve(
    schemaDir,
    "..",
    "references",
    `invariants.${mode}.json`,
  );
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.mode !== mode) {
    throw new Error(
      `${manifestPath} declares mode=${manifest.mode}; expected ${mode}`,
    );
  }
  if (!Array.isArray(manifest.blocking_ids) || !manifest.blocking_ids.length) {
    throw new Error(`${manifestPath} must declare non-empty blocking_ids`);
  }

  const ids = manifest.blocking_ids;
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    throw new Error(`${manifestPath} contains duplicate blocking_ids`);
  }
  for (const id of ids) {
    if (!/^INV-[A-Z0-9-]+$/.test(id)) {
      throw new Error(`${manifestPath} contains invalid invariant id: ${id}`);
    }
  }

  const sourcePath = path.resolve(path.dirname(manifestPath), manifest.source);
  const source = fs.readFileSync(sourcePath, "utf8");
  const documentedIds = [...source.matchAll(/^## (INV-[A-Z0-9-]+)\s*$/gm)].map(
    (match) => match[1],
  );
  const documentedSet = new Set(documentedIds);
  const missing = ids.filter((id) => !documentedSet.has(id));
  const extra = documentedIds.filter((id) => !uniqueIds.has(id));
  if (missing.length || extra.length || documentedSet.size !== documentedIds.length) {
    throw new Error(
      `${mode} invariant manifest/docs mismatch: missing=[${missing.join(", ")}], extra=[${extra.join(", ")}]`,
    );
  }

  return Object.freeze({
    ...manifest,
    manifestPath,
    sourcePath,
    blockingIds: Object.freeze([...ids]),
  });
}
