import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const computedSkillsRoot = path.dirname(skillRoot);
const skillsRoot = path.resolve(
  process.env.AGENT_SKILLS_HOME || computedSkillsRoot,
);
const manifestPath = path.join(
  skillsRoot,
  "xingchen-next",
  "family.manifest.json",
);

const args = new Set(process.argv.slice(2));
const strictClaude = args.has("--strict-claude");
const jsonOutput = args.has("--json");

const errors = [];
const warnings = [];

function walkFiles(root, ignored = new Set()) {
  const files = [];
  for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
    if (ignored.has(entry.name)) continue;
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath, ignored));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function activeMarkdownFiles(root) {
  return walkFiles(
    root,
    new Set(["node_modules", ".git", "archives", "runs"]),
  ).filter((filePath) => path.extname(filePath).toLowerCase() === ".md");
}

function relativeMarkdownLinks(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const links = [];
  const pattern = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (const match of text.matchAll(pattern)) {
    const rawTarget = match[1].replace(/^<|>$/g, "");
    if (!rawTarget.startsWith(".") || /[<>]/.test(rawTarget)) continue;
    const target = rawTarget.split("#", 1)[0].split("?", 1)[0];
    if (!target) continue;
    links.push({rawTarget, target});
  }
  return links;
}

if (!fs.existsSync(manifestPath)) {
  console.error(`Family manifest not found: ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const owners = [
  manifest.router,
  ...manifest.required,
  ...manifest.on_demand,
  ...manifest.optional,
];
const uniqueOwners = [...new Set(owners)];

if (owners.length !== uniqueOwners.length) {
  errors.push("family.manifest.json contains duplicate owners");
}

const ownerResults = [];
for (const owner of uniqueOwners) {
  const ownerRoot = path.join(skillsRoot, owner);
  const skillPath = path.join(ownerRoot, "SKILL.md");
  const result = {
    owner,
    ownerRoot,
    exists: fs.existsSync(ownerRoot),
    skillExists: fs.existsSync(skillPath),
    nestedSkills: [],
  };

  if (!result.exists) {
    errors.push(`missing family owner directory: ${owner}`);
  } else if (!result.skillExists) {
    errors.push(`missing top-level SKILL.md: ${owner}`);
  } else {
    const nested = walkFiles(
      ownerRoot,
      new Set(["node_modules", ".git", "eval"]),
    )
      .filter((filePath) => path.basename(filePath) === "SKILL.md")
      .filter((filePath) => path.resolve(filePath) !== path.resolve(skillPath));
    result.nestedSkills = nested;
    for (const nestedPath of nested) {
      errors.push(`nested active SKILL.md is forbidden: ${nestedPath}`);
    }
  }
  ownerResults.push(result);
}

for (const owner of uniqueOwners) {
  const ownerRoot = path.join(skillsRoot, owner);
  if (!fs.existsSync(ownerRoot)) continue;
  for (const markdownPath of activeMarkdownFiles(ownerRoot)) {
    for (const link of relativeMarkdownLinks(markdownPath)) {
      let decodedTarget;
      try {
        decodedTarget = decodeURIComponent(link.target);
      } catch {
        errors.push(`invalid encoded relative link: ${markdownPath} -> ${link.rawTarget}`);
        continue;
      }
      const resolved = path.resolve(path.dirname(markdownPath), decodedTarget);
      if (!fs.existsSync(resolved)) {
        errors.push(`broken relative link: ${markdownPath} -> ${link.rawTarget}`);
      }
    }
  }
}

for (const contractPath of Object.values(manifest.contracts ?? {})) {
  const resolved = path.resolve(
    path.join(skillsRoot, manifest.router),
    contractPath,
  );
  if (!fs.existsSync(resolved)) {
    errors.push(`missing manifest contract: ${resolved}`);
  }
}

const profileRelative =
  manifest.claude_profile?.profile_relative_to_skills_root ??
  "../profiles/claude-skills.txt";
const claudeProfilePath = path.resolve(skillsRoot, profileRelative);
const claudeProfileNames = fs.existsSync(claudeProfilePath)
  ? fs
      .readFileSync(claudeProfilePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
  : [];
const claudeSet = new Set(claudeProfileNames);
const missingClaudeOwners = uniqueOwners.filter((owner) => !claudeSet.has(owner));

if (!fs.existsSync(claudeProfilePath)) {
  warnings.push(`Claude profile not found: ${claudeProfilePath}`);
}
if (missingClaudeOwners.length) {
  const message = `Claude profile is missing ${missingClaudeOwners.length} owner(s): ${missingClaudeOwners.join(", ")}`;
  if (strictClaude) errors.push(message);
  else warnings.push(message);
}

const result = {
  manifestPath,
  skillsRoot,
  ownerCount: uniqueOwners.length,
  owners: ownerResults,
  claudeProfilePath,
  missingClaudeOwners,
  junctionsToAdd: missingClaudeOwners.map((owner) => ({
    name: owner,
    source: path.join(skillsRoot, owner),
    destinationName: owner,
  })),
  errors,
  warnings,
};

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Xingchen dependency preflight: owners=${uniqueOwners.length}`);
  console.log(`skillsRoot=${skillsRoot}`);
  console.log(`claudeProfile=${claudeProfilePath}`);
  if (warnings.length) {
    console.log("WARN");
    for (const warning of warnings) console.log(`- ${warning}`);
  }
  if (errors.length) {
    console.log("FAIL");
    for (const error of errors) console.log(`- ${error}`);
  }
  console.log(
    `SUMMARY errors=${errors.length} warnings=${warnings.length} claude_missing=${missingClaudeOwners.length}`,
  );
}

if (errors.length) process.exit(1);
