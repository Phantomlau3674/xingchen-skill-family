# GitHub Design Skill Intake

This is a thin intake layer from external GitHub design skills. It strengthens Xingchen visual planning without turning the router into a design-method dump.

Sources studied:

- `jiji262/claude-design-skill`: fact verification, core asset protocol, design direction advisor, anti-slop rules, browser verification.
- `alchaincyf/huashu-design`: HTML-native design workflow, design direction advisor, expert critique, video export pipeline.
- `jezweb/claude-skills/design-review`: practical visual audit for spacing, typography, color, hierarchy, component consistency, interaction, and responsive behavior.
- `jezweb/claude-skills/design-system`: extracting a reusable DESIGN.md from an existing site, screenshot, or project.
- `nexu-io/open-design/critique`: five-dimension critique with keep/fix/quick-win lists.
- `nexu-io/open-design` original skills snapshot: local `SKILL.md` catalogue for web artifacts, frame archetypes, GSAP/HyperFrames candidates, design-system capture, and lookdev review. Use the dedicated [open-design-original-skill-intake.md](./open-design-original-skill-intake.md) before any material adoption.
- `zephyrwang6/brand-design-md`: brand-token lookup through getdesign.md for named brand styles.

## Priority Order

1. Current source material and recording rhythm.
2. Existing project state, director board, and StoryMother lock.
3. Real brand/product/UI assets.
4. Declared or extracted design system.
5. Anti-slop and critique gates.
6. Brand-style token imitation.

Real assets outrank color/font imitation. If assets are missing, use honest placeholders or ask for/source assets. Do not fake a product with a generic CSS silhouette.

## Design Intake Gate

Before Visual Lock on design-heavy scenes, record evidence for:

- Fact check: named products, brands, versions, or recent releases were verified if unstable.
- Core assets: logo, product shots, UI screenshots, source screenshots, or reasoned placeholders are named.
- Design system: tokens or visual rules are declared or extracted, including color roles, type roles, spacing, radius, surface treatment, and motion mood.
- Direction choice: if the brief is vague, at least three distinct directions were considered before locking one.
- Anti-slop bar: the plan rejects generic AI visual patterns such as aggressive purple gradients, decorative orbs, random glass cards, fake SVG product silhouettes, and all-purpose "premium dark tech" surfaces.
- Verification route: the final route names how preview/browser/canvas checks will be done before Lookdev Approval.
- Open Design original skill use: if any installed Open Design skill is used as more than casual inspiration, record source path, snapshot commit, selected traits, rejected traits, Xingchen adaptation, preview route, and proof/subtitle ownership through [open-design-original-skill-intake.md](./open-design-original-skill-intake.md).

## Five-Dimension Review

For lookdev or final preview, score 1-10:

| Dimension | Question |
|---|---|
| Philosophy consistency | Does every visible decision serve one design thesis? |
| Visual hierarchy | Can a viewer know what to read/watch first without narration? |
| Detail execution | Are alignment, spacing, type scale, framing, and safe zones clean? |
| Functionality | Does the scene actually support the spoken proof and platform constraints? |
| Innovation | Is there one memorable, earned visual move beyond template competence? |

If hierarchy, detail, or functionality is below 7, do not approve lookdev.

## Xingchen-Specific Guardrails

- Do not use design templates as scene strategy.
- Do not let brand-style tokens override source-material responsibility.
- UI-heavy scenes need code-owned text, proof, routes, charts, and safe zones.
- Imagegen may create plates and metaphors; Remotion/HTML owns audit-critical information.
- Good design is not "more effects". It is a clear visual job, real assets, disciplined system, and preview-tested execution.
