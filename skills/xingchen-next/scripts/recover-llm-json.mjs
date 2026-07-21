#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";

export function recoverJsonText(raw) {
  const text = String(raw ?? "").replace(/^\uFEFF/, "").trim();
  const fenced = extractFencedJson(text);
  if (fenced) return fenced;

  const balanced = extractBalancedJson(text);
  if (balanced) return balanced;

  throw new Error("No recoverable JSON object or array found");
}

export function parseRecoveredJson(raw) {
  const jsonText = recoverJsonText(raw);
  return {
    value: JSON.parse(jsonText),
    jsonText,
  };
}

function extractFencedJson(text) {
  const blocks = [];
  const pattern = /```([^\n`]*)\n([\s\S]*?)```/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const info = match[1].trim().toLowerCase();
    if (!["", "json", "jsonc", "javascript", "js"].includes(info)) continue;
    blocks.push({info, body: match[2].trim()});
  }

  const preferred = blocks.find((block) => block.info === "json") ?? blocks[0];
  if (!preferred) return "";
  JSON.parse(preferred.body);
  return preferred.body;
}

function extractBalancedJson(text) {
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char !== "{" && char !== "[") continue;
    const end = findBalancedEnd(text, i, char);
    if (end < 0) continue;
    const candidate = text.slice(i, end + 1);
    JSON.parse(candidate);
    return candidate;
  }
  return "";
}

function findBalancedEnd(text, start, opener) {
  const closers = {"{": "}", "[": "]"};
  const stack = [closers[opener]];
  let inString = false;
  let escaped = false;

  for (let i = start + 1; i < text.length; i += 1) {
    const char = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === "\"") inString = false;
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{" || char === "[") {
      stack.push(closers[char]);
      continue;
    }
    if (char === "}" || char === "]") {
      if (char !== stack.pop()) return -1;
      if (stack.length === 0) return i;
    }
  }

  return -1;
}

function parseArgs(argv) {
  const args = {input: "", output: ""};
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value for ${flag}`);
      return argv[i];
    };

    if (flag === "--input") args.input = path.resolve(next());
    else if (flag === "--output") args.output = path.resolve(next());
    else if (flag === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${flag}`);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
node scripts/recover-llm-json.mjs --input raw-response.txt --output clean.json

If --input is omitted, stdin is read. If --output is omitted, clean JSON is printed.`);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const raw = args.input ? fs.readFileSync(args.input, "utf8") : await readStdin();
  const {value} = parseRecoveredJson(raw);
  const output = `${JSON.stringify(value, null, 2)}\n`;
  if (args.output) {
    fs.mkdirSync(path.dirname(args.output), {recursive: true});
    fs.writeFileSync(args.output, output, "utf8");
  } else {
    process.stdout.write(output);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
