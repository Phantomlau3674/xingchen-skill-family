import assert from "node:assert/strict";
import {validateSourceLedFilm} from "./validate-source-led-film.mjs";

function makeFixture() {
  return {
    version: "1.0.0",
    status: "verified",
    timeline_revision: 1,
    source_inspections: [
      {
        source_ref: "screen-main",
        kind: "screen-recording",
        status: "analyzed",
        duration_sec: 12,
        analysis_ref: "analysis/screen-main.json",
      },
      {
        source_ref: "proof-shot",
        kind: "screenshot",
        status: "inspected",
        analysis_ref: "analysis/proof-shot.json",
      },
    ],
    events: [
      {
        event_id: "event-result",
        source_ref: "screen-main",
        source_in_sec: 2,
        source_out_sec: 6,
        action_peak_sec: 4.2,
        visible_change: "The result row appears after the user action.",
        inspectable_region: "center result row",
        narrative_duty: "process",
        selection: "use",
        rejection_reason: "",
      },
      {
        event_id: "event-proof",
        source_ref: "proof-shot",
        source_in_sec: 0,
        source_out_sec: 0,
        action_peak_sec: 0,
        visible_change: "The proof region becomes readable at full scale.",
        inspectable_region: "highlighted source paragraph",
        narrative_duty: "proof",
        selection: "use",
        rejection_reason: "",
      },
    ],
    shots: [
      {
        shot_id: "shot-01",
        scene_id: "scene-01",
        complexity_owner: "source-event",
        source_event_refs: ["event-result"],
        viewer_question: "What changed on the real screen?",
        viewer_answer: "The user action produced the visible result row.",
        timeline: {start_sec: 0, end_sec: 5},
        camera: {
          motivation: "Preserve context, then isolate the changed row.",
          movement: "locked context followed by a restrained push-in",
          landing_region: "center result row",
        },
        sound: {
          dominant_role: "narration",
          sync_anchor: "spoken keyword: result",
          sync_time_sec: 4,
          visual_response: "The crop lands on the result row.",
        },
        continuity: {
          incoming_anchor: "application window",
          outgoing_anchor: "red result highlight",
          representation_layer: "source",
          transition: "continue",
          break_reason: "",
        },
        exception_reason: "",
      },
      {
        shot_id: "shot-02",
        scene_id: "scene-02",
        complexity_owner: "source-event",
        source_event_refs: ["event-proof"],
        viewer_question: "What evidence supports that interpretation?",
        viewer_answer: "The source paragraph states the exact boundary.",
        timeline: {start_sec: 5, end_sec: 10},
        camera: {
          motivation: "Match the red highlight into the source proof.",
          movement: "match-cut followed by a slow proof scan",
          landing_region: "highlighted source paragraph",
        },
        sound: {
          dominant_role: "silence",
          sync_anchor: "300ms narration pause",
          sync_time_sec: 7,
          visual_response: "The proof holds without competing motion.",
        },
        continuity: {
          incoming_anchor: "red result highlight",
          outgoing_anchor: "highlighted source paragraph",
          representation_layer: "source",
          transition: "match-cut",
          break_reason: "",
        },
        exception_reason: "",
      },
    ],
    coverage: {
      source_owned_duration_ratio: 1,
      sound_sync_coverage_ratio: 1,
      scene_coverage_ratio: 1,
    },
  };
}

const options = {
  phase: "commit",
  routeMode: "source-led",
  timelineRevision: 1,
  briefSources: [
    {source_id: "screen-main"},
    {source_id: "proof-shot"},
  ],
  scenes: [
    {scene_id: "scene-01", timing: {start_sec: 0, end_sec: 5}},
    {scene_id: "scene-02", timing: {start_sec: 5, end_sec: 10}},
  ],
};

{
  const result = validateSourceLedFilm(makeFixture(), options);
  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.deepEqual(result.metrics, {
    source_owned_duration_ratio: 1,
    sound_sync_coverage_ratio: 1,
    scene_coverage_ratio: 1,
  });
}

{
  const contract = makeFixture();
  for (const shot of contract.shots) shot.complexity_owner = "designed-bridge";
  contract.coverage.source_owned_duration_ratio = 0;
  const result = validateSourceLedFilm(contract, options);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /source_owned_duration_ratio >= 0.5/);
}

{
  const contract = makeFixture();
  contract.shots[1].timeline.start_sec = 5.2;
  const result = validateSourceLedFilm(contract, options);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /unexplained gap or overlap/);
}

{
  const contract = makeFixture();
  contract.shots[1].sound.sync_anchor = "";
  contract.coverage.sound_sync_coverage_ratio = 0.5;
  const result = validateSourceLedFilm(contract, options);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /sound.sync_anchor is required/);
}

{
  const contract = makeFixture();
  contract.shots[1].sound.sync_time_sec = 4.9;
  contract.coverage.sound_sync_coverage_ratio = 0.5;
  const result = validateSourceLedFilm(contract, options);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /sound.sync_time_sec must fall inside the shot timeline/);
}

{
  const contract = makeFixture();
  contract.shots[1].continuity.representation_layer = "schematic";
  contract.shots[1].continuity.transition = "cut";
  const result = validateSourceLedFilm(contract, options);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /change representation layer without a handoff contract/);
}

console.log("validate-source-led-film tests passed");
