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
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const owners = [
  manifest.router,
  ...manifest.required,
  ...manifest.on_demand,
  ...manifest.optional,
];

const extensions = new Set([
  ".md",
  ".json",
  ".yaml",
  ".yml",
  ".mjs",
  ".js",
  ".ts",
  ".tsx",
  ".py",
  ".ps1",
  ".txt",
]);
const ignoredDirectories = new Set([
  ".git",
  ".claude",
  "node_modules",
  "archives",
]);

function isHistoricalEval(filePath) {
  const normalized = filePath.replaceAll("\\", "/").toLowerCase();
  if (normalized.includes("/eval/") && normalized.includes("/runs/")) return true;
  if (normalized.endsWith("/eval/skillopt-xingchen/latest-report.md")) return true;
  return false;
}

function walk(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const codexSkillsToken = ["." + "codex", "skills"].join("\\");
const claudeSkillsToken = ["." + "claude", "skills"].join("\\");
const agentsSkillsToken = ["." + "agents", "skills"].join("\\");
const violations = [];
let scannedFiles = 0;

for (const owner of owners) {
  const ownerRoot = path.join(skillsRoot, owner);
  if (!fs.existsSync(ownerRoot)) continue;

  for (const filePath of walk(ownerRoot)) {
    if (!extensions.has(path.extname(filePath).toLowerCase())) continue;
    if (isHistoricalEval(filePath)) continue;

    const text = fs.readFileSync(filePath, "utf8");
    scannedFiles += 1;
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      const normalized = line
        .replaceAll("\\\\", "\\")
        .replaceAll("/", "\\")
        .toLowerCase();
      const checks = [
        [codexSkillsToken, "historical .codex skills path"],
        [claudeSkillsToken, "historical .claude skills path"],
        [agentsSkillsToken, "hard-coded .agents skills path"],
      ];
      for (const [token, reason] of checks) {
        if (normalized.includes(token)) {
          violations.push({
            file: filePath,
            line: index + 1,
            reason,
            text: line.trim().slice(0, 240),
          });
        }
      }
    });
  }
}

const jsonOutput = process.argv.includes("--json");
const result = {
  skillsRoot,
  scannedFiles,
  violations,
};

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Xingchen path lint: files=${scannedFiles}`);
  for (const violation of violations) {
    console.log(
      `- ${violation.file}:${violation.line} ${violation.reason}: ${violation.text}`,
    );
  }
  console.log(`SUMMARY violations=${violations.length}`);
}

if (violations.length) process.exit(1);
