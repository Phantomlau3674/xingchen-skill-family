import assert from "node:assert/strict";
import {validateVoiceLedFilm} from "./validate-voice-led-film.mjs";

function makeFixture() {
  return {
    version: "1.0.0",
    status: "verified",
    timeline_revision: 1,
    visibility_policy: "faceless",
    animated_a_roll: {
      enabled: true,
      continuity_model: "voice-owned animated primary picture",
      primary_tracks: ["V1"],
      state_machine_required_for_roles: ["diagram", "kinetic-type", "process", "metaphor"],
    },
    voice_beats: [
      {
        voice_beat_id: "voice-01",
        beat_id: "beat-01",
        start_sec: 0,
        end_sec: 8,
        spoken_function: "explain",
        emphasis: "high",
        visual_job: "Turn the causal claim into a staged diagram.",
      },
    ],
    shots: [
      {
        shot_id: "shot-01",
        scene_id: "scene-01",
        voice_beat_refs: ["voice-01"],
        timeline: {start_sec: 0, end_sec: 8},
        visual_role: "diagram",
        visual_source: "local-design",
        viewer_job: "See why speed and context are separate variables.",
        screen_action: "One task token splits into speed and context axes, then reconnects to the result.",
        proof_refs: [],
        sound: {
          sync_anchor: "spoken phrase: separate variables",
          sync_time_sec: 4,
          visual_response: "The task token splits on the emphasized phrase.",
        },
        continuity: {
          incoming_anchor: "task token",
          outgoing_anchor: "resolved task token",
        },
        a_roll_state: {
          opening_state: "A single task token waits in the center.",
          transform: "split",
          settled_state: "The token has become two labeled axes that can be read at phone size.",
          handoff: "The axes reconnect toward the result token.",
          continuity_anchor: "task token",
        },
      },
    ],
    coverage: {
      voice_beat_coverage_ratio: 1,
      script_beat_coverage_ratio: 1,
      scene_coverage_ratio: 1,
      sound_sync_coverage_ratio: 1,
    },
  };
}

const options = {
  phase: "commit",
  timelineRevision: 1,
  scriptBeats: [{beat_id: "beat-01", start_sec: 0, end_sec: 8}],
  scenes: [{scene_id: "scene-01", timing: {start_sec: 0, end_sec: 8}, proof_ref: []}],
};

{
  const result = validateVoiceLedFilm(makeFixture(), options);
  assert.equal(result.ok, true, result.errors.join("\n"));
}

{
  const contract = makeFixture();
  delete contract.shots[0].a_roll_state;
  const result = validateVoiceLedFilm(contract, options);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /a_roll_state is required/);
}

{
  const contract = makeFixture();
  contract.visibility_policy = "talking-head";
  const result = validateVoiceLedFilm(contract, options);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /visibility_policy must be faceless/);
}

{
  const contract = makeFixture();
  contract.shots[0].voice_beat_refs = [];
  contract.coverage.voice_beat_coverage_ratio = 0;
  const result = validateVoiceLedFilm(contract, options);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /voice_beat_refs must not be empty/);
}

{
  const contract = makeFixture();
  contract.shots[0].visual_source = "generated-video";
  contract.shots[0].proof_refs = ["proof-1"];
  const result = validateVoiceLedFilm(contract, options);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /generated material cannot carry proof_refs/);
}

console.log("validate-voice-led-film tests passed");
