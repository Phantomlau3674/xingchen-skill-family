import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const skillsRoot = path.resolve(
  process.env.AGENT_SKILLS_HOME || path.dirname(skillRoot),
);
const manifestPath = path.join(skillsRoot, "xingchen-next", "family.manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const ownerSkills = [
  manifest.router,
  ...manifest.required,
  ...manifest.on_demand,
  ...manifest.optional,
];

const heavyVisualOwners = new Set([
  "xingchen-director-board",
  "xingchen-art-direction",
  "xingchen-vox-collage",
  "xingchen-visual-compiler",
  "xingchen-lookdev",
]);

const parseArgs = (argv) => {
  const args = {json: false, failOnWarning: false};
  for (const token of argv) {
    if (token === "--json") args.json = true;
    if (token === "--fail-on-warning") args.failOnWarning = true;
  }
  return args;
};

const readText = (filePath) => fs.readFileSync(filePath, "utf8");

const countMatches = (text, pattern) => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

const summarizeSkill = (name) => {
  const dir = path.join(skillsRoot, name);
  const skillPath = path.join(dir, "SKILL.md");
  if (!fs.existsSync(skillPath)) {
    return {name, exists: false, skillPath, errors: [`missing skill: ${name}`], warnings: []};
  }

  const text = readText(skillPath);
  const desc = text.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? "";
  const lineCount = text.split(/\r?\n/).length;
  const refCount = countMatches(text, /\[[^\]]+\]\([^)]+\)/g);
  const invCount = countMatches(text, /INV-/g);
  const warnings = [];
  const errors = [];

  if (name === "xingchen-next") {
    if (!text.includes("family-dispatch-contract.md")) {
      errors.push("router does not reference family-dispatch-contract.md");
    }
    if (!text.includes("Dispatch-first rule")) {
      errors.push("router does not state Dispatch-first rule");
    }
    if (lineCount > 360) {
      errors.push(`router SKILL.md too large for gatekeeper role: ${lineCount} lines`);
    } else if (lineCount > 260) {
      warnings.push(`router is still bulky: ${lineCount} lines`);
    }
    if (refCount > 90) {
      errors.push(`router has too many direct references: ${refCount}`);
    } else if (refCount > 70) {
      warnings.push(`router has many direct references: ${refCount}`);
    }
  }

  if (heavyVisualOwners.has(name)) {
    if (lineCount > 750) {
      warnings.push(`visual owner is very large: ${lineCount} lines; preserve design depth but consider progressive disclosure`);
    }
  } else if (name !== "xingchen-next" && lineCount > 320) {
    warnings.push(`non-visual child skill may be too broad: ${lineCount} lines`);
  }

  return {
    name,
    exists: true,
    skillPath,
    lineCount,
    refCount,
    invCount,
    description: desc,
    errors,
    warnings,
  };
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  const summaries = ownerSkills.map(summarizeSkill);
  const errors = summaries.flatMap((item) => item.errors.map((message) => ({skill: item.name, message})));
  const warnings = summaries.flatMap((item) => item.warnings.map((message) => ({skill: item.name, message})));
  const addContractError = (message) =>
    errors.push({skill: "xingchen-next", message: `Lean contract: ${message}`});

  const leanSchema = JSON.parse(
    readText(path.join(skillRoot, "schema", "project-state.lean.schema.json")),
  );
  const leanTemplate = JSON.parse(
    readText(path.join(skillRoot, "templates", "project-state.lean.template.json")),
  );
  const leanInvariants = readText(
    path.join(skillRoot, "references", "lean-invariants.md"),
  );
  const leanValidator = readText(
    path.join(skillRoot, "schema", "validate-lean-project-state.mjs"),
  );

  for (const key of leanSchema.required ?? []) {
    if (!Object.prototype.hasOwnProperty.call(leanTemplate, key)) {
      addContractError(`template is missing schema-required top-level key ${key}`);
    }
  }
  if (!leanTemplate.extensions?.agent_harness) {
    addContractError("Lean template does not instantiate extensions.agent_harness");
  }
  for (const invariantId of [
    "INV-AGENT-HARNESS-TRACE",
    "INV-ANTI-PPT-SEMANTIC-MOTION",
    "INV-VOICE-LED-FACELESS",
    "INV-SOURCE-LED-FILM",
  ]) {
    if (!leanInvariants.includes(invariantId)) {
      addContractError(`Lean invariants are missing ${invariantId}`);
    }
  }

  const expectedStages = [
    "brief-evidence",
    "script-beats",
    "scene-production",
    "preview-revision",
    "final-delivery",
  ];
  const schemaStages = leanSchema.properties?.metadata?.properties?.active_stage?.enum ?? [];
  if (JSON.stringify(schemaStages) !== JSON.stringify(expectedStages)) {
    addContractError("schema stage enum drifted from the five Lean stages");
  }

  const reviewRequired =
    leanSchema.properties?.delivery?.properties?.preview_review?.required ?? [];
  for (const deprecatedField of [
    "technical_10",
    "readability_15",
    "sync_15",
    "proof_15",
    "meaning_10",
    "rhythm_10",
    "visual_craft_10",
  ]) {
    if (reviewRequired.includes(deprecatedField)) {
      addContractError(`preview_review still requires advisory score field ${deprecatedField}`);
    }
  }
  if (!reviewRequired.includes("revision_log")) {
    addContractError("preview_review does not require revision_log");
  }

  const scriptRequired = leanSchema.properties?.script?.required ?? [];
  if (!scriptRequired.includes("timeline_revision")) {
    addContractError("script does not require timeline_revision");
  }
  const sceneSafeRequired =
    leanSchema.properties?.scenes?.items?.properties?.safe_region?.required ?? [];
  if (!sceneSafeRequired.includes("source_must_preserve")) {
    addContractError("scene safe_region does not require source_must_preserve");
  }
  const criticalRequired =
    leanSchema.properties?.delivery?.properties?.critical_previews?.items?.required ?? [];
  for (const field of [
    "timeline_revision",
    "candidates",
    "selected_candidate_id",
    "selection_reason",
  ]) {
    if (!criticalRequired.includes(field)) {
      addContractError(`critical preview does not require ${field}`);
    }
  }

  if (
    /in `sources\.source_pack` before|Media inputs require `?sources\.asset_manifest/i.test(
      leanInvariants,
    )
  ) {
    addContractError("Lean invariants still require Extended source fields");
  }
  if (
    /active_stage\s*>?=\s*["']render|render\.jobs[^\n]+must identify/i.test(
      leanInvariants,
    )
  ) {
    addContractError("Lean invariants still require the Extended render stage or render.jobs");
  }
  for (const token of [
    "inspectMedia",
    "timeline_revision must match",
    "requires two or three rendered candidates",
    "selected_candidate_id must reference a candidate",
    "validateAgentHarness",
    "validateVoiceLedFilm",
    "validateSourceLedFilm",
    "INV-AGENT-HARNESS-TRACE",
    "INV-VOICE-LED-FACELESS",
    "INV-SOURCE-LED-FILM",
  ]) {
    if (!leanValidator.includes(token)) {
      addContractError(`validator is missing quality contract token ${token}`);
    }
  }

  const assetIntake = readText(
    path.join(skillsRoot, "xingchen-asset-intake", "SKILL.md"),
  );
  if (!assetIntake.includes('mode: "lean"') || !assetIntake.includes("brief.sources[]")) {
    addContractError("asset intake does not route Lean mode to brief.sources[]");
  }

  const visualCompiler = readText(
    path.join(skillsRoot, "xingchen-visual-compiler", "SKILL.md"),
  );
  for (const token of [
    "Scene-Specific Checkpoints",
    "source_must_preserve",
    "Audio Roles",
    "Transitions And Effects",
    "implementation.timeline_revision",
  ]) {
    if (!visualCompiler.includes(token)) {
      addContractError(`visual compiler is missing ${token}`);
    }
  }

  const voxCollage = readText(
    path.join(skillsRoot, "xingchen-vox-collage", "SKILL.md"),
  );
  for (const token of [
    "editorial-explainer",
    "metaphor-broll",
    "source-collage",
    "Design The Hero Frame First",
    "Prevent The PPT Failure",
    "validate_vox_branch.py",
    "make_visual_evidence.py",
  ]) {
    if (!voxCollage.includes(token)) {
      addContractError(`Vox collage branch is missing ${token}`);
    }
  }

  const lookdev = readText(path.join(skillsRoot, "xingchen-lookdev", "SKILL.md"));
  for (const token of [
    "Critical Candidate Challenge",
    "weakest semantic interval",
    "Transfer locally by default",
    "verify-media-evidence.mjs",
  ]) {
    if (!lookdev.includes(token)) {
      addContractError(`lookdev is missing ${token}`);
    }
  }
  if (/78\/85|weakest ten-second/i.test(lookdev)) {
    addContractError("lookdev still treats an arbitrary score or fixed ten seconds as a gate");
  }

  const router = readText(path.join(skillRoot, "SKILL.md"));
  if (/must reach `78\/85`|weakest ten seconds/i.test(router)) {
    addContractError("router still treats an arbitrary score or fixed ten seconds as a gate");
  }
  if (!router.includes("output-reconstruction-grammar.md")) {
    addContractError("router does not route public reference-output reconstruction");
  }
  for (const token of [
    "## Workflow Contract",
    "Keep design style orthogonal",
    "An entry prompt is an onboarding macro",
    "agent-harness-contract.md",
    "route -> preflight -> plan -> authorize -> execute -> track -> verify -> commit",
  ]) {
    if (!router.includes(token)) {
      addContractError(`router is missing account-visible workflow rule ${token}`);
    }
  }

  const outputGrammar = readText(
    path.join(skillRoot, "references", "output-reconstruction-grammar.md"),
  );
  for (const token of [
    "## Account-Visible Workflow Study, 2026-07-13",
    "goal + source readiness + decision variables + workflow skill + artifact ladder + review loop",
    "workflow_skill",
    "design_style",
    "output_grammar",
  ]) {
    if (!outputGrammar.includes(token)) {
      addContractError(`output reconstruction grammar is missing ${token}`);
    }
  }

  const director = readText(path.join(skillsRoot, "xingchen-director-board", "SKILL.md"));
  if (!director.includes("candidate_hypotheses") || !director.includes("source_must_preserve")) {
    addContractError("director board does not preserve rendered candidate hypotheses or source protection");
  }

  const artDirection = readText(path.join(skillsRoot, "xingchen-art-direction", "SKILL.md"));
  if (!artDirection.includes("extensions.visual_intent") || !artDirection.includes("speech-rhythm-engine.md")) {
    addContractError("art direction does not route the compact Lean visual intent");
  }

  if (!fs.existsSync(path.join(skillRoot, "scripts", "verify-media-evidence.mjs"))) {
    addContractError("missing real media evidence verifier");
  }
  if (!fs.existsSync(path.join(skillRoot, "scripts", "analyze-reference-output.mjs"))) {
    addContractError("missing public reference-output analyzer");
  }
  if (!fs.existsSync(path.join(skillRoot, "references", "output-reconstruction-grammar.md"))) {
    addContractError("missing public output reconstruction grammar");
  }
  if (!fs.existsSync(path.join(skillRoot, "references", "agent-harness-contract.md"))) {
    addContractError("missing agent harness contract");
  }
  if (!fs.existsSync(path.join(skillRoot, "scripts", "validate-agent-harness.mjs"))) {
    addContractError("missing deterministic agent harness validator");
  }
  if (!fs.existsSync(path.join(skillRoot, "templates", "agent-harness-run.template.json"))) {
    addContractError("missing agent harness run template");
  }
  if (!fs.existsSync(path.join(skillRoot, "references", "voice-led-faceless-contract.md"))) {
    addContractError("missing voice-led faceless contract");
  }
  if (!fs.existsSync(path.join(skillRoot, "scripts", "validate-voice-led-film.mjs"))) {
    addContractError("missing voice-led faceless validator");
  }
  if (!fs.existsSync(path.join(skillRoot, "templates", "voice-led-film.template.json"))) {
    addContractError("missing voice-led film template");
  }
  if (!fs.existsSync(path.join(skillRoot, "references", "source-led-film-contract.md"))) {
    addContractError("missing source-led film contract");
  }
  if (!fs.existsSync(path.join(skillRoot, "scripts", "validate-source-led-film.mjs"))) {
    addContractError("missing source-led film validator");
  }
  if (!fs.existsSync(path.join(skillRoot, "scripts", "analyze-source-events.mjs"))) {
    addContractError("missing source-event analyzer");
  }
  if (!fs.existsSync(path.join(skillRoot, "templates", "source-led-film.template.json"))) {
    addContractError("missing source-led film template");
  }
  const harnessContract = readText(
    path.join(skillRoot, "references", "agent-harness-contract.md"),
  );
  const harnessValidator = readText(
    path.join(skillRoot, "scripts", "validate-agent-harness.mjs"),
  );
  for (const token of [
    "design_style_source",
    "motion-graphic-only cannot be selected as an agent fallback",
    "reconciliation_ref is required before retrying a non-idempotent mutation",
    "composed_frame_verification_ref",
  ]) {
    if (!harnessContract.includes(token) && !harnessValidator.includes(token)) {
      addContractError(`agent harness is missing ${token}`);
    }
  }
  const packageManifest = JSON.parse(readText(path.join(skillRoot, "package.json")));
  if (!packageManifest.scripts?.test?.includes("validate-agent-harness.test.mjs")) {
    addContractError("package test does not execute the agent harness regression suite");
  }
  if (!packageManifest.scripts?.test?.includes("validate-voice-led-film.test.mjs")) {
    addContractError("package test does not execute the voice-led faceless regression suite");
  }
  if (
    !packageManifest.scripts?.test?.includes("validate-source-led-film.test.mjs") ||
    !packageManifest.scripts?.test?.includes("analyze-source-events.test.mjs")
  ) {
    addContractError("package test does not execute source-led film regression suites");
  }

  const transcribe = readText(path.join(skillsRoot, "xingchen-transcribe", "SKILL.md"));
  if (!transcribe.includes("extensions.recording_truth") || !transcribe.includes("omit `--state`")) {
    addContractError("transcribe does not preserve Lean recording truth without Extended writeback");
  }

  const speechRhythm = readText(path.join(skillsRoot, "xingchen-speech-rhythm", "SKILL.md"));
  if (!speechRhythm.includes("Project State Mode") || !speechRhythm.includes("extensions.visual_intent")) {
    addContractError("speech rhythm does not route Lean cues into compact visual intent");
  }

  const result = {
    skillRoot,
    skillsRoot,
    ownerCount: ownerSkills.length,
    errors,
    warnings,
    summaries,
  };

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Xingchen family coupling audit: owners=${ownerSkills.length}`);
    console.log("");
    for (const item of summaries) {
      const status = item.exists ? "OK" : "MISSING";
      const metrics = item.exists
        ? `lines=${item.lineCount} refs=${item.refCount} inv=${item.invCount}`
        : "";
      console.log(`${status.padEnd(8)} ${item.name.padEnd(30)} ${metrics}`);
    }
    if (warnings.length) {
      console.log("\nWARN");
      for (const warning of warnings) {
        console.log(`- ${warning.skill}: ${warning.message}`);
      }
    }
    if (errors.length) {
      console.log("\nFAIL");
      for (const error of errors) {
        console.log(`- ${error.skill}: ${error.message}`);
      }
    }
    console.log(`\nSUMMARY errors=${errors.length} warnings=${warnings.length}`);
  }

  if (errors.length || (args.failOnWarning && warnings.length)) {
    process.exit(1);
  }
};

main();
