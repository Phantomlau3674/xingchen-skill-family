import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {parseRecoveredJson, recoverJsonText} from "./recover-llm-json.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const recoverScript = path.join(here, "recover-llm-json.mjs");

{
  const raw = [
    "Here is the fragment:",
    "```json",
    "{\"scene_id\":\"s1\",\"ok\":true}",
    "```",
  ].join("\n");
  const {value, jsonText} = parseRecoveredJson(raw);
  assert.equal(value.scene_id, "s1");
  assert.equal(value.ok, true);
  assert.equal(jsonText, "{\"scene_id\":\"s1\",\"ok\":true}");
}

{
  const raw = "preface\n[{\"id\":1},{\"id\":2}]\ntrailing note";
  const {value} = parseRecoveredJson(raw);
  assert.equal(value.length, 2);
  assert.equal(value[1].id, 2);
}

{
  const raw = "```json\n{\"broken\": true,\n```";
  assert.throws(() => recoverJsonText(raw), /Expected|JSON|position/i);
}

{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xingchen-recover-json-"));
  const input = path.join(dir, "raw.txt");
  const output = path.join(dir, "clean.json");
  fs.writeFileSync(input, "wrapped {\"a\":1,\"b\":[2]} done", "utf8");

  const result = spawnSync(process.execPath, [
    recoverScript,
    "--input",
    input,
    "--output",
    output,
  ], {encoding: "utf8"});

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const clean = JSON.parse(fs.readFileSync(output, "utf8"));
  assert.deepEqual(clean, {a: 1, b: [2]});
  fs.rmSync(dir, {recursive: true, force: true});
}

console.log("recover-llm-json tests passed");
