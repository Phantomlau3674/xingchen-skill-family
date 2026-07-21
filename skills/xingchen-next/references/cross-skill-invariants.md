# Cross-Skill Invariant Router

Do not load a mixed invariant set.

- Lean projects load [lean-invariants.md](./lean-invariants.md) and [invariants.lean.json](./invariants.lean.json).
- Extended or legacy projects load [extended-invariants.md](./extended-invariants.md) and [invariants.extended.json](./invariants.extended.json).

The machine-readable `blocking_ids` list is authoritative for validator and preflight routing.

Lean validators must not read, import, parse, or enforce the Extended invariant files.
