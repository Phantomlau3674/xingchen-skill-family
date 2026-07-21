import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {loadInvariantManifest} from "./load-invariant-manifest.mjs";
import {inspectMedia} from "../scripts/verify-media-evidence.mjs";
import {validateAgentHarness} from "../scripts/validate-agent-harness.mjs";
import {validateSourceLedFilm} from "../scripts/validate-source-led-film.mjs";
import {validateVoiceLedFilm} from "../scripts/validate-voice-led-film.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const invariantManifest = loadInvariantManifest(here, "lean");
const statePath = path.resolve(
  process.argv[2] ?? path.resolve(process.cwd(), "project-state.json"),
);
const stateDir = path.dirname(statePath);
const fixedAvatarPath =
  "C:\\Users\\liuzh\\Pictures\\04_AI生成图片\\2026-05\\ChatGPT Image 2026年5月7日 15_14_14.png";

if (!fs.existsSync(statePath)) {
  console.error(`State file not found: ${statePath}`);
  process.exit(1);
}

let state;
try {
  state = JSON.parse(fs.readFileSync(statePath, "utf8"));
} catch (error) {
  console.error(`Invalid JSON: ${error.message}`);
  process.exit(1);
}

const schema = JSON.parse(
  fs.readFileSync(path.join(here, "project-state.lean.schema.json"), "utf8"),
);

const errors = [];
const warnings = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function validateSchemaNode(node, value, label) {
  if (!node) return;

  if (node.const !== undefined) {
    assert(value === node.const, `${label} must equal ${JSON.stringify(node.const)}`);
  }

  if (node.enum) {
    assert(node.enum.includes(value), `${label} must be one of [${node.enum.join(", ")}]`);
  }

  const types = Array.isArray(node.type) ? node.type : node.type ? [node.type] : [];
  if (types.length) {
    const actualType =
      value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
    assert(types.includes(actualType), `${label} must be ${types.join(" or ")}`);
    if (!types.includes(actualType)) return;
  }

  if (typeof value === "string" && node.minLength !== undefined) {
    assert(value.length >= node.minLength, `${label} must have length >= ${node.minLength}`);
  }

  if (typeof value === "number") {
    if (node.minimum !== undefined) {
      assert(value >= node.minimum, `${label} must be >= ${node.minimum}`);
    }
    if (node.maximum !== undefined) {
      assert(value <= node.maximum, `${label} must be <= ${node.maximum}`);
    }
    if (node.exclusiveMinimum !== undefined) {
      assert(value > node.exclusiveMinimum, `${label} must be > ${node.exclusiveMinimum}`);
    }
  }

  if (Array.isArray(value)) {
    if (node.minItems !== undefined) {
      assert(value.length >= node.minItems, `${label} must contain at least ${node.minItems} items`);
    }
    if (node.maxItems !== undefined) {
      assert(value.length <= node.maxItems, `${label} must contain at most ${node.maxItems} items`);
    }
    if (node.items) {
      value.forEach((item, index) =>
        validateSchemaNode(node.items, item, `${label}[${index}]`),
      );
    }
  }

  if (isObject(value)) {
    for (const key of node.required ?? []) {
      assert(
        Object.prototype.hasOwnProperty.call(value, key),
        `${label}.${key} is required`,
      );
    }

    const properties = node.properties ?? {};
    if (node.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        assert(
          Object.prototype.hasOwnProperty.call(properties, key),
          `${label}.${key} is not allowed`,
        );
      }
    }

    for (const [key, child] of Object.entries(properties)) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        validateSchemaNode(child, value[key], `${label}.${key}`);
      }
    }
  }
}

function resolveLocalPath(ref) {
  return path.isAbsolute(ref) ? ref : path.resolve(stateDir, ref);
}

function assertNonEmptyLocalFile(ref, label) {
  assert(hasText(ref), `${label} is required`);
  if (!hasText(ref)) return;

  assert(!/^https?:\/\//i.test(ref), `${label} must be a local file path`);
  if (/^https?:\/\//i.test(ref)) return;

  const resolved = resolveLocalPath(ref);
  assert(fs.existsSync(resolved), `${label} does not exist: ${resolved}`);
  if (!fs.existsSync(resolved)) return;

  const stat = fs.statSync(resolved);
  assert(stat.isFile(), `${label} must point to a file: ${resolved}`);
  assert(stat.size > 0, `${label} must be non-empty: ${resolved}`);
}

const mediaProbeCache = new Map();

function assertDecodableMedia(ref, label, expectedKind, requireAudio = false) {
  assertNonEmptyLocalFile(ref, label);
  if (!hasText(ref) || /^https?:\/\//i.test(ref)) return null;
  const resolved = resolveLocalPath(ref);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) return null;

  const key = `${resolved}|${expectedKind}|${requireAudio}`;
  if (!mediaProbeCache.has(key)) {
    mediaProbeCache.set(
      key,
      inspectMedia(resolved, {expectedKind, requireAudio, deep: false}),
    );
  }
  const result = mediaProbeCache.get(key);
  for (const error of result.errors) {
    assert(false, `${label} is not valid ${expectedKind} evidence: ${error}`);
  }
  return result.ok ? result.metadata : null;
}

validateSchemaNode(schema, state, "state");

const stages = [
  "brief-evidence",
  "script-beats",
  "scene-production",
  "preview-revision",
  "final-delivery",
];
const stage = state.metadata?.active_stage;
const stageIndex = stages.indexOf(stage);
const stageStatus = state.metadata?.stage_status;
const atLeast = (name) => stageIndex >= stages.indexOf(name);
const completing = (name) => stage === name && stageStatus === "completed";

assert(state.mode === "lean", "Lean validator only accepts mode=lean");
assert(stageIndex >= 0, "metadata.active_stage is not a Lean stage");
assert(["active", "completed"].includes(stageStatus), "metadata.stage_status is invalid");
assert(hasText(state.metadata?.project_id), "metadata.project_id is required");
assert(hasText(state.metadata?.title), "metadata.title is required");
assert(hasText(state.metadata?.platform), "metadata.platform is required");

const approvals = asArray(state.workflow?.approvals);
const approvalCounts = new Map();
for (const item of approvals) {
  approvalCounts.set(item?.checkpoint, (approvalCounts.get(item?.checkpoint) ?? 0) + 1);
}
for (const checkpoint of ["Content Lock", "Preview Lock"]) {
  assert(
    approvalCounts.get(checkpoint) === 1,
    `workflow.approvals must contain exactly one ${checkpoint}`,
  );
}
assert(approvals.length === 2, "Lean mode must contain exactly two approvals");
const approval = (checkpoint) =>
  approvals.find((item) => item?.checkpoint === checkpoint);

const sources = asArray(state.brief?.sources);
const claims = asArray(state.brief?.claims);
const sourceIds = new Set();
const sourceById = new Map();
for (const source of sources) {
  assert(hasText(source.source_id), "brief.sources[].source_id is required");
  assert(!sourceIds.has(source.source_id), `duplicate source_id ${source.source_id}`);
  sourceIds.add(source.source_id);
  sourceById.set(source.source_id, source);
  assert(hasText(source.kind), `source ${source.source_id || "<unknown>"} needs kind`);
  assert(hasText(source.ref), `source ${source.source_id || "<unknown>"} needs ref`);

  const generatedKind = /generated|imagegen|ai[-_ ]?video|synthetic/i.test(
    source.kind ?? "",
  );
  assert(
    !(generatedKind && source.proof_eligible === true),
    `INV-PROOF-TRUTH: generated source ${source.source_id} cannot be proof eligible`,
  );
}

const claimIds = new Set();
for (const claim of claims) {
  assert(hasText(claim.claim_id), "brief.claims[].claim_id is required");
  assert(!claimIds.has(claim.claim_id), `duplicate claim_id ${claim.claim_id}`);
  claimIds.add(claim.claim_id);
  assert(hasText(claim.text), `claim ${claim.claim_id || "<unknown>"} needs text`);
  if (claim.factual) {
    assert(
      asArray(claim.source_refs).length > 0,
      `INV-PROOF-TRUTH: factual claim ${claim.claim_id} needs source_refs`,
    );
  }
  for (const sourceRef of asArray(claim.source_refs)) {
    const source = sourceById.get(sourceRef);
    assert(Boolean(source), `claim ${claim.claim_id} references missing source ${sourceRef}`);
    assert(
      source?.proof_eligible === true,
      `INV-PROOF-TRUTH: claim ${claim.claim_id} references non-proof source ${sourceRef}`,
    );
  }
}

const needsBrief = atLeast("script-beats") || completing("brief-evidence");
if (needsBrief) {
  assert(hasText(state.brief?.thesis), "brief.thesis is required before script-beats");
  assert(hasText(state.brief?.audience), "brief.audience is required before script-beats");
  assert(hasText(state.brief?.goal), "brief.goal is required before script-beats");
  assert(sources.length > 0, "INV-SOURCE-PACK-TRACE: add at least one real source");
}

const beats = asArray(state.script?.beats);
const beatIds = new Set();
for (const beat of beats) {
  assert(hasText(beat.beat_id), "script.beats[].beat_id is required");
  assert(!beatIds.has(beat.beat_id), `duplicate beat_id ${beat.beat_id}`);
  beatIds.add(beat.beat_id);
  assert(hasText(beat.text), `beat ${beat.beat_id || "<unknown>"} needs text`);
  assert(
    Number.isFinite(beat.start_sec) &&
      Number.isFinite(beat.end_sec) &&
      beat.end_sec > beat.start_sec,
    `beat ${beat.beat_id || "<unknown>"} has invalid timing`,
  );
}

const needsContentLock = atLeast("scene-production") || completing("script-beats");
if (needsContentLock) {
  assert(
    approval("Content Lock")?.status === "approved",
    "Content Lock must be approved before scene-production",
  );
  assert(state.script?.content_approved === true, "script.content_approved must be true");
  assert(hasText(state.script?.spoken_text), "script.spoken_text is required");
  assert(beats.length > 0, "script.beats must not be empty");
  assert(
    Number.isInteger(state.script?.timeline_revision) &&
      state.script.timeline_revision >= 1,
    "script.timeline_revision must be a positive integer after Content Lock",
  );
}

const creatorAvatar = state.visual_policy?.creator_avatar ?? {};
if (creatorAvatar.decision === "reuse") {
  assert(
    creatorAvatar.asset_path === fixedAvatarPath,
    `INV-CREATOR-AVATAR-DEFAULT: asset_path must be ${fixedAvatarPath}`,
  );
  assertNonEmptyLocalFile(creatorAvatar.asset_path, "visual_policy.creator_avatar.asset_path");
} else if (creatorAvatar.decision === "skipped") {
  assert(
    hasText(creatorAvatar.skip_reason),
    "INV-CREATOR-AVATAR-DEFAULT: skipped avatar needs a concrete skip_reason",
  );
}

const referenceStyle = state.visual_policy?.reference_style ?? {};
if (referenceStyle.selected === true) {
  assert(
    hasText(referenceStyle.source),
    "INV-REFERENCE-STYLE-CONDITIONAL: selected style needs source",
  );
  assert(
    hasText(referenceStyle.selection_reason),
    "INV-REFERENCE-STYLE-CONDITIONAL: selected style needs selection_reason",
  );
  assert(
    asArray(referenceStyle.selected_traits).length > 0,
    "INV-REFERENCE-STYLE-CONDITIONAL: selected style needs selected_traits",
  );
  assert(
    asArray(referenceStyle.avoid_copying).length > 0,
    "INV-REFERENCE-STYLE-CONDITIONAL: selected style needs avoid_copying",
  );
} else if (referenceStyle.selected === false) {
  assert(
    !hasText(referenceStyle.source) &&
      !hasText(referenceStyle.selection_reason) &&
      asArray(referenceStyle.selected_traits).length === 0 &&
      asArray(referenceStyle.avoid_copying).length === 0,
    "INV-REFERENCE-STYLE-CONDITIONAL: unselected style must not inject style fields",
  );
}

const scenes = asArray(state.scenes);
const sceneIds = new Set();
const semanticActions = new Set([
  "reveal",
  "compare",
  "trace",
  "build",
  "transform",
  "hold",
  "resolve",
]);

for (const scene of scenes) {
  const tag = `scene ${scene.scene_id || "<unknown>"}`;
  assert(hasText(scene.scene_id), "scenes[].scene_id is required");
  assert(!sceneIds.has(scene.scene_id), `duplicate scene_id ${scene.scene_id}`);
  sceneIds.add(scene.scene_id);
  assert(beatIds.has(scene.beat_id), `${tag} references missing beat ${scene.beat_id}`);
  assert(
    hasText(scene.knowledge_change),
    `INV-SCENE-COGNITIVE-JOB: ${tag} needs knowledge_change`,
  );
  assert(
    hasText(scene.dominant_visual),
    `INV-SCENE-COGNITIVE-JOB: ${tag} needs dominant_visual`,
  );
  assert(
    hasText(scene.motion_action),
    `INV-SCENE-COGNITIVE-JOB: ${tag} needs motion_action`,
  );
  warn(
    semanticActions.has(scene.motion_action),
    `${tag} uses non-standard motion_action "${scene.motion_action}"; verify its semantic job`,
  );
  assert(isObject(scene.safe_region), `${tag} needs safe_region`);
  assert(
    Array.isArray(scene.safe_region?.must_not_cover),
    `${tag}.safe_region.must_not_cover must be an array`,
  );
  assert(
    Number.isFinite(scene.timing?.start_sec) &&
      Number.isFinite(scene.timing?.end_sec) &&
      scene.timing.end_sec > scene.timing.start_sec,
    `${tag} has invalid timing`,
  );
  assert(hasText(scene.implementation?.route), `${tag} needs implementation.route`);

  const verification = scene.implementation?.verification;
  if (isObject(verification)) {
      assert(
        verification.structural_checked === true,
        `${tag} verification.structural_checked must be true`,
      );
      assert(
        verification.visual_checked === true,
        `${tag} verification.visual_checked must be true`,
      );
      assert(hasText(verification.checked_at), `${tag} verification.checked_at is required`);

      const frames = asArray(verification.frames);
      assert(
        frames.length >= 2 && frames.length <= 5,
        `${tag} verification must contain two to five scene-specific checkpoints`,
      );
      const roles = frames.map((item) => item?.role);
      const paths = frames.map((item) => item?.path);
      const profileRoles = {
        "motion-graphic": ["entry", "settled", "exit"],
        "source-proof": ["context", "detail", "hold"],
        footage: ["cut-in", "action-peak", "exit"],
        "talking-head": ["face", "gesture", "handoff"],
        montage: ["group-open", "rhythm-peak", "group-exit"],
      };
      for (const role of profileRoles[verification.profile] ?? []) {
        assert(
          roles.filter((item) => item === role).length === 1,
          `${tag} ${verification.profile} checkpoint ${role} must appear exactly once`,
        );
      }
      assert(
        new Set(paths).size === paths.length,
        `${tag} verification frame paths must be unique`,
      );
      for (const frame of frames) {
        assert(
          Number.isInteger(frame?.frame) && frame.frame >= 0,
          `${tag} verification frame ${frame?.role ?? "<unknown>"} needs a non-negative integer frame`,
        );
        assertDecodableMedia(
          frame?.path,
          `${tag} verification frame ${frame?.role ?? "<unknown>"}.path`,
          "image",
        );
      }
  }

  if (scene.implementation?.visual_kind === "diagram") {
    assert(
      isObject(scene.semantic_relation) &&
        hasText(scene.semantic_relation.big_question) &&
        hasText(scene.semantic_relation.small_question) &&
        hasText(scene.semantic_relation.relationship),
      `INV-SEMANTIC-RELATION-EXPLICIT: ${tag} diagram must name big_question, small_question, and relationship`,
    );
  }

  for (const proofRef of asArray(scene.proof_ref)) {
    const source = sourceById.get(proofRef);
    assert(Boolean(source), `${tag} references missing proof source ${proofRef}`);
    assert(
      source?.proof_eligible === true,
      `INV-PROOF-TRUTH: ${tag} references non-proof source ${proofRef}`,
    );
  }
}

const needsAgentHarness = atLeast("scene-production") || completing("script-beats");
const agentHarness = state.extensions?.agent_harness;
const harnessPhase = atLeast("preview-revision") || completing("scene-production")
  ? "commit"
  : "plan";
if (needsAgentHarness) {
  assert(
    isObject(agentHarness),
    "INV-AGENT-HARNESS-TRACE: extensions.agent_harness is required before scene-production",
  );
  if (isObject(agentHarness)) {
    const harnessResult = validateAgentHarness(agentHarness, {
      phase: harnessPhase,
      expectedSceneIds: scenes.map((scene) => scene?.scene_id).filter(hasText),
    });
    for (const message of harnessResult.errors) {
      assert(false, `INV-AGENT-HARNESS-TRACE: ${message}`);
    }
    for (const message of harnessResult.warnings) {
      warn(false, `agent_harness: ${message}`);
    }
  }
}

const mediumMode = agentHarness?.route?.medium_strategy?.mode;
const mediumModalities = asArray(agentHarness?.route?.medium_strategy?.modalities);
const needsSourceLedFilm =
  needsAgentHarness &&
  ["source-led", "mixed-media"].includes(mediumMode) &&
  mediumModalities.some((item) =>
    ["real-footage", "source-proof", "screen-capture"].includes(item),
  );
if (needsSourceLedFilm) {
  const sourceLedFilm = state.extensions?.source_led_film;
  assert(
    isObject(sourceLedFilm),
    "INV-SOURCE-LED-FILM: extensions.source_led_film is required for source-led production",
  );
  if (isObject(sourceLedFilm)) {
    for (const inspection of asArray(sourceLedFilm.source_inspections)) {
      if (["analyzed", "inspected", "rejected"].includes(inspection?.status)) {
        assertNonEmptyLocalFile(
          inspection?.analysis_ref,
          `source_led_film inspection ${inspection?.source_ref ?? "<unknown>"}.analysis_ref`,
        );
      }
    }
    const sourceLedResult = validateSourceLedFilm(sourceLedFilm, {
      phase: harnessPhase,
      routeMode: mediumMode,
      scenes,
      briefSources: sources,
      timelineRevision: state.script?.timeline_revision,
    });
    for (const message of sourceLedResult.errors) {
      assert(false, `INV-SOURCE-LED-FILM: ${message}`);
    }
    for (const message of sourceLedResult.warnings) {
      warn(false, `source_led_film: ${message}`);
    }
  }
}

const needsVoiceLedFilm = needsAgentHarness && mediumMode === "narration-led";
if (needsVoiceLedFilm) {
  const voiceLedFilm = state.extensions?.voice_led_film;
  assert(
    isObject(voiceLedFilm),
    "INV-VOICE-LED-FACELESS: extensions.voice_led_film is required for narration-led faceless production",
  );
  if (isObject(voiceLedFilm)) {
    const voiceLedResult = validateVoiceLedFilm(voiceLedFilm, {
      phase: harnessPhase,
      scenes,
      scriptBeats: beats,
      timelineRevision: state.script?.timeline_revision,
    });
    for (const message of voiceLedResult.errors) {
      assert(false, `INV-VOICE-LED-FACELESS: ${message}`);
    }
    for (const message of voiceLedResult.warnings) {
      warn(false, `voice_led_film: ${message}`);
    }
  }
}

const needsImplementedScenes =
  atLeast("preview-revision") || completing("scene-production");
if (needsImplementedScenes) {
  assert(
    ["actual-audio", "accepted-audio"].includes(state.script?.timing_basis),
    "INV-AUDIO-TIMING-TRUTH: preview-revision requires actual or accepted audio timing",
  );
  assert(hasText(state.script?.audio_ref), "script.audio_ref is required for preview");
  assert(scenes.length > 0, "scenes must not be empty before preview-revision");
  for (const scene of scenes) {
    assert(
      ["previewed", "complete"].includes(scene.implementation?.status),
      `scene ${scene.scene_id} must be previewed or complete before preview-revision`,
    );
    assert(
      scene.implementation?.timeline_revision === state.script?.timeline_revision,
      `scene ${scene.scene_id} is stale; implementation.timeline_revision must match script.timeline_revision`,
    );
  }
}

if ((state.metadata?.platform ?? "").toLowerCase().includes("douyin")) {
  const typography = state.metadata?.format?.typography ?? {};
  if (atLeast("scene-production") || completing("script-beats")) {
    warn(
      typography.subtitle_px >= 58 && typography.subtitle_px <= 64,
      "INV-MOBILE-READABILITY: subtitle_px should start around 58-64",
    );
    warn(
      typography.thesis_px >= 44 && typography.thesis_px <= 52,
      "INV-MOBILE-READABILITY: thesis_px should start around 44-52",
    );
    warn(
      typography.important_node_px >= 38 &&
        typography.important_node_px <= 46,
      "INV-MOBILE-READABILITY: important_node_px should start around 38-46",
    );
  }
}

function validatePreviewEvidence() {
  const delivery = state.delivery ?? {};
  const review = delivery.preview_review ?? {};
  const critical = asArray(delivery.critical_previews);
  const full = delivery.full_preview;

  assert(
    approval("Preview Lock")?.status === "approved",
    "Preview Lock must be approved before final-delivery",
  );
  assert(
    ["approved-to-render", "rendering", "rendered", "delivered"].includes(
      delivery.status,
    ),
    "delivery.status must show Preview Lock authorization",
  );

  assert(
    critical.length === 3,
    "INV-REAL-PREVIEW-BEFORE-DELIVERY: exactly three critical previews are required",
  );
  const roles = critical.map((item) => item?.role);
  const paths = critical.map((item) => item?.path);
  for (const role of ["hook", "hardest-proof", "payoff"]) {
    assert(
      roles.filter((item) => item === role).length === 1,
      `INV-REAL-PREVIEW-BEFORE-DELIVERY: critical role ${role} must appear exactly once`,
    );
  }
  assert(
    new Set(paths).size === paths.length,
    "INV-REAL-PREVIEW-BEFORE-DELIVERY: critical preview paths must be unique",
  );

  for (const item of critical) {
    const tag = `critical preview ${item?.role ?? "<unknown>"}`;
    assert(item?.audio_ref === state.script?.audio_ref, `${tag} audio_ref must match script.audio_ref`);
    assert(item?.viewport === "phone-downsample", `${tag} must use phone-downsample`);
    assert(Number.isFinite(item?.duration_sec) && item.duration_sec > 0, `${tag} needs positive duration_sec`);
    assert(hasText(item?.reviewed_at), `${tag} needs reviewed_at`);
    assert(
      item?.timeline_revision === state.script?.timeline_revision,
      `${tag} is stale; timeline_revision must match script.timeline_revision`,
    );

    const candidates = asArray(item?.candidates);
    assert(
      candidates.length >= 2 && candidates.length <= 3,
      `${tag} requires two or three rendered candidates`,
    );
    const candidateIds = candidates.map((candidate) => candidate?.candidate_id);
    const candidatePaths = candidates.map((candidate) => candidate?.path);
    assert(
      new Set(candidateIds).size === candidateIds.length,
      `${tag} candidate_id values must be unique`,
    );
    assert(
      new Set(candidatePaths).size === candidatePaths.length,
      `${tag} candidate paths must be unique`,
    );

    const candidateMetadata = [];
    for (const candidate of candidates) {
      const candidateTag = `${tag} candidate ${candidate?.candidate_id ?? "<unknown>"}`;
      assert(hasText(candidate?.hypothesis), `${candidateTag} needs a visual hypothesis`);
      assert(candidate?.audio_ref === state.script?.audio_ref, `${candidateTag} audio_ref must match script.audio_ref`);
      assert(candidate?.viewport === "phone-downsample", `${candidateTag} must use phone-downsample`);
      assert(Number.isFinite(candidate?.duration_sec) && candidate.duration_sec > 0, `${candidateTag} needs positive duration_sec`);
      const metadata = assertDecodableMedia(candidate?.path, `${candidateTag}.path`, "video", true);
      if (metadata) {
        assert(
          Math.abs(metadata.duration_sec - candidate.duration_sec) <= 0.25,
          `${candidateTag}.duration_sec must match the decoded media duration`,
        );
        candidateMetadata.push({candidate, metadata});
      }
    }

    const selected = candidates.find(
      (candidate) => candidate?.candidate_id === item?.selected_candidate_id,
    );
    assert(Boolean(selected), `${tag} selected_candidate_id must reference a candidate`);
    if (selected) {
      assert(item.path === selected.path, `${tag}.path must equal the selected candidate path`);
      assert(item.audio_ref === selected.audio_ref, `${tag}.audio_ref must equal the selected candidate audio_ref`);
      assert(Math.abs(item.duration_sec - selected.duration_sec) < 0.001, `${tag}.duration_sec must equal the selected candidate duration_sec`);
    }
    assert(hasText(item?.selection_reason), `${tag} needs selection_reason`);

    if (candidateMetadata.length === candidates.length && candidateMetadata.length > 1) {
      const [first, ...rest] = candidateMetadata;
      for (const current of rest) {
        assert(
          current.metadata.width === first.metadata.width &&
            current.metadata.height === first.metadata.height,
          `${tag} candidates must use the same rendered dimensions`,
        );
        assert(
          Math.abs(current.metadata.duration_sec - first.metadata.duration_sec) <= 0.25,
          `${tag} candidates must cover the same speech span`,
        );
      }
    }
  }

  assert(isObject(full), "INV-REAL-PREVIEW-BEFORE-DELIVERY: full_preview is required");
  if (isObject(full)) {
    assert(full.audio_ref === state.script?.audio_ref, "full_preview.audio_ref must match script.audio_ref");
    assert(full.viewport === "phone-downsample", "full_preview must use phone-downsample");
    assert(Number.isFinite(full.duration_sec) && full.duration_sec > 0, "full_preview needs positive duration_sec");
    assert(hasText(full.reviewed_at), "full_preview needs reviewed_at");
    assert(
      full.timeline_revision === state.script?.timeline_revision,
      "full_preview is stale; timeline_revision must match script.timeline_revision",
    );
    const fullMetadata = assertDecodableMedia(
      full.path,
      "delivery.full_preview.path",
      "video",
      true,
    );
    if (fullMetadata) {
      assert(
        Math.abs(fullMetadata.duration_sec - full.duration_sec) <= 0.25,
        "full_preview.duration_sec must match the decoded media duration",
      );
    }
  }

  assertDecodableMedia(state.script?.audio_ref, "script.audio_ref", "audio");
  assert(
    review.completed === true && review.blind_review_completed === true,
    "INV-REAL-PREVIEW-BEFORE-DELIVERY: complete preview and blind review",
  );
  assert(
    hasText(review.notes),
    "preview_review.notes must record blind-review observations",
  );
  for (const revision of asArray(review.revision_log)) {
    const tag = `revision ${revision?.revision_id ?? "<unknown>"}`;
    assert(sceneIds.has(revision?.scene_id), `${tag} references missing scene ${revision?.scene_id}`);
    assert(
      Number.isFinite(revision?.start_sec) &&
        Number.isFinite(revision?.end_sec) &&
        revision.end_sec > revision.start_sec,
      `${tag} must name a positive semantic interval`,
    );
    assert(revision?.before_path !== revision?.after_path, `${tag} before_path and after_path must differ`);
    assertDecodableMedia(revision?.before_path, `${tag}.before_path`, "any");
    assertDecodableMedia(revision?.after_path, `${tag}.after_path`, "any");
  }
  assert(
    asArray(review.blocking_issues).length === 0,
    "preview_review.blocking_issues must be empty",
  );
  assert(
    delivery.platform_draft?.checked === true,
    "real-device platform draft check is required",
  );
  assert(hasText(delivery.platform_draft?.device), "platform_draft.device is required");
  assert(hasText(delivery.platform_draft?.checked_at), "platform_draft.checked_at is required");
}

const needsPreviewEvidence =
  atLeast("final-delivery") || completing("preview-revision");
if (needsPreviewEvidence) {
  validatePreviewEvidence();
}

if (stage === "final-delivery") {
  const delivery = state.delivery ?? {};
  const finalExists = hasText(delivery.final_path);

  if (["rendered", "delivered"].includes(delivery.status) || stageStatus === "completed") {
    assert(finalExists, "INV-FINAL-RENDER-JOB-TRACE: delivery.final_path is required");
    if (finalExists) {
      assertDecodableMedia(delivery.final_path, "delivery.final_path", "video", true);
    }
    if (hasText(delivery.cover_path)) {
      assertDecodableMedia(delivery.cover_path, "delivery.cover_path", "image");
    }
  }

  if (stageStatus === "completed") {
    assert(
      delivery.status === "delivered",
      "completed final-delivery requires delivery.status=delivered",
    );
  }
}

for (const message of warnings) {
  console.warn(`Warning: ${message}`);
}

if (errors.length) {
  console.error(`Lean project state validation failed: ${errors.length} error(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Lean project state validation passed: stage=${stage}, stage_status=${stageStatus}, blocking_invariants=${invariantManifest.blockingIds.length}, warnings=${warnings.length}`,
);
