# LLM JSON Recovery

Use this whenever a Xingchen skill asks an LLM or assistant to return machine-readable JSON for project state, director-board fragments, prompt packs, query plans, scene specs, or lookdev results.

Local helper:

```powershell
node ../scripts/recover-llm-json.mjs --input raw-response.txt --output clean.json
```

## Rule

LLM JSON is accepted only after deterministic recovery and validation:

1. Strip UTF-8 BOM and surrounding whitespace.
2. If the response is fenced, extract the first fenced block whose info string is empty, `json`, `jsonc`, or `javascript`; prefer `json`.
3. If no fenced block exists, locate the first balanced `{...}` or `[...]` span and parse only that span.
4. Remove only wrapper prose. Do not repair missing commas, invent fields, or change values.
5. Parse with the normal JSON parser.
6. Validate with the owning schema, contract, or required-field checklist.
7. If recovery fails, ask for a clean JSON-only retry and keep the current state unchanged.

## Forbidden

- Do not copy Markdown fences into `.json` artifacts.
- Do not save partially parsed objects as project truth.
- Do not silently coerce a list into an object or an object into a list.
- Do not accept JSON-like snippets with comments or trailing commas unless the caller explicitly owns a JSONC parser and records that parser choice.

## Logging

When recovery was needed, record a short note in the artifact or adapter trace:

```json
{
  "llm_json_recovery": {
    "used": true,
    "source_shape": "fenced_json|fenced_unknown|prose_wrapped|balanced_span",
    "validator": "project-state.schema.json|local-required-fields|manual-check",
    "status": "parsed_and_validated"
  }
}
```

The note is audit evidence only. It is not permission to treat unreliable prose as state.
