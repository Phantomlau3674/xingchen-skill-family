from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import platform
import subprocess
import sys
from pathlib import Path
from typing import Any


SKILL_ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = Path(os.environ.get("AGENT_SKILLS_HOME", SKILL_ROOT.parent)).resolve()
DEFAULT_SKILLOPT_ROOT = Path(os.environ.get(
    "SKILLOPT_ROOT",
    r"C:\Users\liuzh\.codex\vendor_imports\SkillOpt",
))
REMOTION_HARNESS = Path(
    os.environ.get(
        "REMOTION_HARNESS",
        str(SKILLS_ROOT / "remotion-render-adapter" / "templates" / "director-motion-kernel"),
    )
)
DEFAULT_DOUYIN_ROOT = Path(os.environ.get("DOUYIN_SAMPLE_ROOT", r"C:\Users\liuzh\Videos\douyin"))

if str(DEFAULT_SKILLOPT_ROOT) not in sys.path:
    sys.path.insert(0, str(DEFAULT_SKILLOPT_ROOT))

from skillopt.datasets.base import SplitDataLoader  # type: ignore  # noqa: E402
from skillopt.envs.base import EnvAdapter  # type: ignore  # noqa: E402
from skillopt.utils import compute_score, skill_hash  # type: ignore  # noqa: E402


class XingchenSkillEvalDataLoader(SplitDataLoader):
    """SkillOpt-compatible split loader for deterministic Xingchen skill checks."""


class XingchenSkillEvalAdapter(EnvAdapter):
    """SkillOpt-style adapter that scores Xingchen skill/runtime invariants."""

    def __init__(
        self,
        split_dir: str,
        skill_root: Path,
        remotion_harness: Path,
        timeout_s: int = 120,
    ) -> None:
        self.skill_root = skill_root
        self.remotion_harness = remotion_harness
        self.timeout_s = timeout_s
        self.dataloader = XingchenSkillEvalDataLoader(
            split_dir=split_dir,
            split_mode="split_dir",
        )

    def setup(self, cfg: dict) -> None:
        super().setup(cfg)
        self.dataloader.setup(cfg)

    def get_dataloader(self):
        return self.dataloader

    def build_train_env(self, batch_size: int, seed: int, **kwargs):
        batch = self.dataloader.build_train_batch(batch_size=batch_size, seed=seed, **kwargs)
        return list(batch.payload or [])

    def build_eval_env(self, env_num: int, split: str, seed: int, **kwargs):
        batch = self.dataloader.build_eval_batch(env_num=env_num, split=split, seed=seed, **kwargs)
        return list(batch.payload or [])

    def rollout(self, env_manager, skill_content: str, out_dir: str, **kwargs) -> list[dict]:
        items: list[dict] = list(env_manager)
        pred_root = Path(out_dir) / "predictions"
        pred_root.mkdir(parents=True, exist_ok=True)
        results = []
        for item in items:
            result = self._evaluate_item(item, skill_content)
            item_dir = pred_root / str(item["id"])
            item_dir.mkdir(parents=True, exist_ok=True)
            (item_dir / "result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
            results.append(result)
        return results

    def reflect(self, results: list[dict], skill_content: str, out_dir: str, **kwargs) -> list[dict | None]:
        return []

    def get_task_types(self) -> list[str]:
        return sorted({item.get("type", "unknown") for item in self.dataloader.train_items + self.dataloader.val_items + self.dataloader.test_items})

    def _evaluate_item(self, item: dict, skill_content: str) -> dict:
        item_id = str(item["id"])
        checks: list[dict[str, Any]] = []
        task_type = item.get("type", "unknown")
        output = ""
        exit_code: int | None = None

        try:
            if task_type == "skill_contains":
                text = skill_content
                checks = self._contains_checks(text, item.get("must_contain", []))
            elif task_type == "file_contains":
                file_path = self._resolve_path(item["path"])
                text = file_path.read_text(encoding=item.get("encoding", "utf-8"))
                checks = self._contains_checks(text, item.get("must_contain", []))
            elif task_type == "command":
                exit_code, output = self._run_command(item)
                checks = self._command_checks(item, exit_code, output)
            elif task_type == "project_sample_audit":
                checks, output = self._evaluate_project_sample(item)
            else:
                checks = [{"name": "known task type", "passed": False, "detail": f"unsupported type: {task_type}"}]
        except Exception as exc:  # Keep eval going; failed tasks are the signal.
            checks.append({"name": "exception", "passed": False, "detail": repr(exc)})

        passed = sum(1 for check in checks if check["passed"])
        total = max(1, len(checks))
        raw_hard = 1 if passed == total else 0
        gate = str(item.get("gate", "required"))
        hard = 1 if gate == "observe" else raw_hard
        soft = passed / total
        fail_reason = "; ".join(self._format_failure(check) for check in checks if not check["passed"])
        return {
            "id": item_id,
            "task_type": task_type,
            "category": item.get("category", "uncategorized"),
            "gate": gate,
            "description": item.get("description", ""),
            "hard": hard,
            "raw_hard": raw_hard,
            "soft": soft,
            "checks_passed": passed,
            "checks_total": total,
            "checks": checks,
            "exit_code": exit_code,
            "output_excerpt": output[-3000:] if output else "",
            "fail_reason": fail_reason,
            "agent_ok": hard == 1,
        }

    @staticmethod
    def _format_failure(check: dict[str, Any]) -> str:
        detail = " | ".join(
            line.strip()
            for line in str(check.get("detail", "")).splitlines()
            if line.strip()
        )
        if len(detail) > 500:
            detail = f"{detail[:240]} ... {detail[-240:]}"
        return f"{check.get('name', 'check')}: {detail}"

    @staticmethod
    def _contains_checks(text: str, needles: list[str]) -> list[dict[str, Any]]:
        return [
            {
                "name": f"contains: {needle}",
                "passed": needle in text,
                "detail": "found" if needle in text else f"missing {needle!r}",
            }
            for needle in needles
        ]

    def _run_command(self, item: dict) -> tuple[int, str]:
        command = [self._expand_token(token) for token in item.get("command", [])]
        if not command:
            raise ValueError("command task has empty command")
        if platform.system().lower().startswith("win") and command[0].lower() == "npm":
            command[0] = "npm.cmd"
        cwd = Path(self._expand_token(item.get("cwd", "{skill_root}")))
        completed = subprocess.run(
            command,
            cwd=str(cwd),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=int(item.get("timeout_s", self.timeout_s)),
            shell=False,
        )
        output = (completed.stdout or "") + (completed.stderr or "")
        return int(completed.returncode), output

    @staticmethod
    def _command_checks(item: dict, exit_code: int, output: str) -> list[dict[str, Any]]:
        expected_exit = int(item.get("expect_exit_code", 0))
        checks = [
            {
                "name": f"exit_code == {expected_exit}",
                "passed": exit_code == expected_exit,
                "detail": f"exit_code={exit_code}",
            }
        ]
        for needle in item.get("must_contain", []):
            checks.append({
                "name": f"output contains: {needle}",
                "passed": needle in output,
                "detail": "found" if needle in output else f"missing {needle!r}",
            })
        for needle in item.get("must_not_contain", []):
            checks.append({
                "name": f"output omits: {needle}",
                "passed": needle not in output,
                "detail": "omitted" if needle not in output else f"unexpected {needle!r}",
            })
        return checks

    def _evaluate_project_sample(self, item: dict) -> tuple[list[dict[str, Any]], str]:
        project_root = self._resolve_path(item["project_root"])
        checks: list[dict[str, Any]] = []
        notes: list[str] = []

        def add(name: str, passed: bool, detail: str) -> None:
            checks.append({"name": name, "passed": passed, "detail": detail})

        add("project root exists", project_root.exists() and project_root.is_dir(), str(project_root))
        if not project_root.exists() or not project_root.is_dir():
            return checks, ""

        process_files = self._find_named_files(
            project_root,
            [
                "project-state.json",
                "render-plan.json",
                "video-project.json",
                "visual-director-board.json",
                "visual-director-board.md",
                "art-direction.md",
                "lookdev-gate.yaml",
            ],
        )
        media_files = self._find_media_files(project_root)
        remotion_markers = self._find_named_files(project_root, ["remotion.config.ts", "remotion.config.mts", "remotion.config.js", "package.json"])
        state_files = [path for path in process_files if path.name == "project-state.json"]
        render_plans = [path for path in process_files if path.name == "render-plan.json"]
        board_files = [path for path in process_files if path.name in {"visual-director-board.json", "visual-director-board.md"}]

        add("process artifacts present", len(process_files) > 0, self._relative_list(project_root, process_files))
        add("media output present", len(media_files) > 0, self._relative_list(project_root, media_files))
        add("project-state trace present", len(state_files) > 0, self._relative_list(project_root, state_files))
        add("render-plan trace present", len(render_plans) > 0, self._relative_list(project_root, render_plans))
        add("visual director board trace present", len(board_files) > 0, self._relative_list(project_root, board_files))
        add("remotion or node project marker present", len(remotion_markers) > 0, self._relative_list(project_root, remotion_markers))

        for state_path in state_files[: int(item.get("max_state_files", 2))]:
            state = self._read_json_checked(state_path, checks, project_root, "project-state parses")
            if state is not None:
                self._check_project_state_runtime_traces(state, checks, state_path, project_root)
                self._run_project_state_validator(state_path, checks, project_root)

        for render_plan_path in render_plans[: int(item.get("max_render_plan_files", 3))]:
            render_plan = self._read_json_checked(render_plan_path, checks, project_root, "render-plan parses")
            if render_plan is not None:
                self._check_render_plan_assets(render_plan, render_plan_path, checks, project_root)

        notes.append(f"process_files={len(process_files)}")
        notes.append(f"media_files={len(media_files)}")
        notes.append(f"state_files={len(state_files)}")
        notes.append(f"render_plans={len(render_plans)}")
        return checks, "\n".join(notes)

    def _run_project_state_validator(self, state_path: Path, checks: list[dict[str, Any]], project_root: Path) -> None:
        validator = self.skill_root / "schema" / "validate-project-state.mjs"
        if not validator.exists():
            checks.append({"name": "project-state validator available", "passed": False, "detail": str(validator)})
            return

        completed = subprocess.run(
            ["node", str(validator), str(state_path)],
            cwd=str(self.skill_root),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=self.timeout_s,
            shell=False,
        )
        output = ((completed.stdout or "") + (completed.stderr or "")).strip()
        checks.append({
            "name": f"project-state validator passes: {state_path.relative_to(project_root)}",
            "passed": completed.returncode == 0,
            "detail": "passed" if completed.returncode == 0 else output[-1200:],
        })

    def _check_project_state_runtime_traces(
        self,
        state: dict,
        checks: list[dict[str, Any]],
        state_path: Path,
        project_root: Path,
    ) -> None:
        rel = state_path.relative_to(project_root)
        metadata = state.get("metadata", {}) if isinstance(state, dict) else {}
        active_stage = metadata.get("active_stage")
        checks.append({
            "name": f"project-state active stage: {rel}",
            "passed": isinstance(active_stage, str) and bool(active_stage.strip()),
            "detail": str(active_stage or "missing"),
        })

        scene_specs = state.get("render", {}).get("scene_motion_specs", [])
        checks.append({
            "name": f"scene motion specs present: {rel}",
            "passed": isinstance(scene_specs, list) and len(scene_specs) > 0,
            "detail": f"{len(scene_specs) if isinstance(scene_specs, list) else 0} scene(s)",
        })

        hyperframes_candidates = state.get("render", {}).get("hyperframes_candidates", [])
        html_candidates = [
            candidate for candidate in hyperframes_candidates
            if str(candidate.get("technical_route", "")).lower() in {"hyperframes_html", "hyperframes_canvas"}
        ] if isinstance(hyperframes_candidates, list) else []
        missing_gsap = [
            str(candidate.get("candidate_id") or candidate.get("id") or index)
            for index, candidate in enumerate(html_candidates)
            if not candidate.get("gsap_usage")
        ]
        checks.append({
            "name": f"HyperFrames candidates record GSAP usage: {rel}",
            "passed": len(missing_gsap) == 0,
            "detail": "no HyperFrames HTML/canvas candidates" if not html_candidates else (
                "covered" if not missing_gsap else "missing: " + ", ".join(missing_gsap)
            ),
        })

        runtime_scenes = [
            scene for scene in scene_specs
            if isinstance(scene, dict)
            and scene.get("motion_source") == "hyperframes_runtime"
            and str(scene.get("renderer", "")).lower() in {"html_scene", "canvas_scene"}
        ] if isinstance(scene_specs, list) else []
        missing_scene_gsap = [
            str(scene.get("scene_id") or index)
            for index, scene in enumerate(runtime_scenes)
            if not scene.get("gsap_usage")
        ]
        checks.append({
            "name": f"HyperFrames runtime scenes record GSAP usage: {rel}",
            "passed": len(missing_scene_gsap) == 0,
            "detail": "no HyperFrames runtime scenes" if not runtime_scenes else (
                "covered" if not missing_scene_gsap else "missing: " + ", ".join(missing_scene_gsap)
            ),
        })

    def _check_render_plan_assets(
        self,
        render_plan: dict,
        render_plan_path: Path,
        checks: list[dict[str, Any]],
        project_root: Path,
    ) -> None:
        rel = render_plan_path.relative_to(project_root)
        scenes = render_plan.get("scenes", [])
        checks.append({
            "name": f"render-plan scenes present: {rel}",
            "passed": isinstance(scenes, list) and len(scenes) > 0,
            "detail": f"{len(scenes) if isinstance(scenes, list) else 0} scene(s)",
        })

        local_assets: set[str] = set()
        for scene in scenes if isinstance(scenes, list) else []:
            for layer in scene.get("layers", []) if isinstance(scene, dict) else []:
                if not isinstance(layer, dict):
                    continue
                source = layer.get("asset", {}).get("source") if isinstance(layer.get("asset"), dict) else None
                if isinstance(source, str) and source and not source.lower().startswith(("http://", "https://")):
                    local_assets.add(source.lstrip("/\\"))

        checked = 0
        missing: list[str] = []
        for source in sorted(local_assets):
            checked += 1
            candidates = [
                project_root / "public" / source,
                project_root / source,
                render_plan_path.parent / "public" / source,
                render_plan_path.parent / source,
                self.remotion_harness / "public" / source,
            ]
            if not any(candidate.exists() for candidate in candidates):
                missing.append(source)

        checks.append({
            "name": f"render-plan local assets resolve: {rel}",
            "passed": len(missing) == 0,
            "detail": "no local assets" if checked == 0 else (
                f"{checked} asset(s) resolved" if not missing else "missing: " + ", ".join(missing[:12])
            ),
        })

    def _read_json_checked(
        self,
        path_value: Path,
        checks: list[dict[str, Any]],
        project_root: Path,
        label: str,
    ) -> dict | None:
        try:
            parsed = json.loads(path_value.read_text(encoding="utf-8"))
            checks.append({"name": f"{label}: {path_value.relative_to(project_root)}", "passed": True, "detail": "parsed"})
            return parsed
        except Exception as exc:
            checks.append({"name": f"{label}: {path_value.relative_to(project_root)}", "passed": False, "detail": repr(exc)})
            return None

    def _find_named_files(self, root: Path, names: list[str]) -> list[Path]:
        wanted = {name.lower() for name in names}
        return [
            path for path in self._walk_files(root)
            if path.name.lower() in wanted
        ]

    def _find_media_files(self, root: Path) -> list[Path]:
        media_exts = {".mp4", ".mov", ".m4v", ".webm"}
        return [
            path for path in self._walk_files(root)
            if path.suffix.lower() in media_exts
        ]

    def _walk_files(self, root: Path) -> list[Path]:
        skipped_dirs = {
            ".git",
            ".next",
            ".turbo",
            ".vercel",
            "node_modules",
            "dist",
            "build",
            "cache",
            ".cache",
        }
        files: list[Path] = []
        stack = [root]
        max_files = 6000
        while stack and len(files) < max_files:
            current = stack.pop()
            try:
                entries = list(current.iterdir())
            except OSError:
                continue
            for entry in entries:
                if entry.is_dir():
                    if entry.name.lower() not in skipped_dirs:
                        stack.append(entry)
                elif entry.is_file():
                    files.append(entry)
        return files

    @staticmethod
    def _relative_list(root: Path, paths: list[Path], limit: int = 12) -> str:
        if not paths:
            return "none"
        rels = [str(path.relative_to(root)) for path in paths[:limit]]
        suffix = "" if len(paths) <= limit else f" (+{len(paths) - limit} more)"
        return ", ".join(rels) + suffix

    def _resolve_path(self, value: str) -> Path:
        return Path(self._expand_token(value))

    def _expand_token(self, value: Any) -> str:
        text = str(value)
        return (
            text.replace("{skill_root}", str(self.skill_root))
            .replace("{skillopt_root}", str(DEFAULT_SKILLOPT_ROOT))
            .replace("{remotion_harness}", str(self.remotion_harness))
            .replace("{douyin_root}", str(DEFAULT_DOUYIN_ROOT))
        )


def split_items(adapter: XingchenSkillEvalAdapter, split: str, seed: int) -> list[dict]:
    if split == "all":
        return (
            adapter.build_eval_env(0, "train", seed)
            + adapter.build_eval_env(0, "valid_seen", seed)
            + adapter.build_eval_env(0, "valid_unseen", seed)
        )
    return adapter.build_eval_env(0, split, seed)


def write_report(out_root: Path, summary: dict, results: list[dict]) -> None:
    by_category: dict[str, list[dict]] = {}
    for result in results:
        by_category.setdefault(result["category"], []).append(result)

    lines = [
        "# Xingchen SkillOpt Evaluation",
        "",
        f"- skill: `{summary['skill']}`",
        f"- skill_hash: `{summary['skill_hash']}`",
        f"- split: `{summary['split']}`",
        f"- items: `{summary['n_items']}`",
        f"- hard: `{summary['hard']:.4f}`",
        f"- soft: `{summary['soft']:.4f}`",
        "",
        "## Category Scores",
        "",
    ]
    for category, rows in sorted(by_category.items()):
        hard = sum(float(row["hard"]) for row in rows) / len(rows)
        raw_hard = sum(float(row.get("raw_hard", row["hard"])) for row in rows) / len(rows)
        soft = sum(float(row["soft"]) for row in rows) / len(rows)
        lines.append(f"- `{category}`: gate_hard={hard:.4f}, raw_hard={raw_hard:.4f}, soft={soft:.4f}, n={len(rows)}")

    failures = [row for row in results if row.get("gate") != "observe" and not row["hard"]]
    observations = [row for row in results if row.get("gate") == "observe" and not row.get("raw_hard", row["hard"])]
    lines.extend(["", "## Gate Failures", ""])
    if not failures:
        lines.append("- none")
    else:
        for row in failures:
            lines.append(f"- `{row['id']}` ({row['category']}): {row['fail_reason']}")

    lines.extend(["", "## Observations", ""])
    if not observations:
        lines.append("- none")
    else:
        for row in observations:
            lines.append(f"- `{row['id']}` ({row['category']}): {row['fail_reason']}")

    lines.extend(["", "## Item Results", ""])
    for row in results:
        if row.get("gate") == "observe":
            status = "OBSERVE-PASS" if row.get("raw_hard", row["hard"]) else "OBSERVE"
        else:
            status = "PASS" if row["hard"] else "FAIL"
        lines.append(f"- `{status}` `{row['id']}` soft={row['soft']:.2f} - {row['description']}")

    (out_root / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    latest = SKILL_ROOT / "eval" / "skillopt-xingchen" / "latest-report.md"
    latest.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="SkillOpt-style eval for Xingchen skills")
    parser.add_argument("--skill", default=str(SKILL_ROOT / "SKILL.md"))
    parser.add_argument("--split-dir", default=str(SKILL_ROOT / "eval" / "skillopt-xingchen" / "split"))
    parser.add_argument("--split", default="all", choices=["all", "train", "valid_seen", "valid_unseen", "val", "test"])
    parser.add_argument("--out-root", default="")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--timeout-s", type=int, default=120)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    skill_path = Path(args.skill).resolve()
    split_dir = Path(args.split_dir).resolve()
    timestamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    out_root = Path(args.out_root).resolve() if args.out_root else SKILL_ROOT / "eval" / "skillopt-xingchen" / "runs" / timestamp
    out_root.mkdir(parents=True, exist_ok=True)

    skill_content = skill_path.read_text(encoding="utf-8")
    cfg = {
        "split_mode": "split_dir",
        "split_dir": str(split_dir),
        "out_root": str(out_root),
        "env": "xingchen_skill_eval",
    }
    adapter = XingchenSkillEvalAdapter(
        split_dir=str(split_dir),
        skill_root=SKILL_ROOT,
        remotion_harness=REMOTION_HARNESS,
        timeout_s=args.timeout_s,
    )
    adapter.setup(cfg)
    items = split_items(adapter, args.split, args.seed)
    results = adapter.rollout(items, skill_content, str(out_root))
    hard, soft = compute_score(results)
    summary = {
        "skill": str(skill_path),
        "skill_hash": skill_hash(skill_content),
        "skillopt_root": str(DEFAULT_SKILLOPT_ROOT),
        "split_dir": str(split_dir),
        "split": args.split,
        "n_items": len(results),
        "hard": hard,
        "soft": soft,
        "created_at": dt.datetime.now().isoformat(timespec="seconds"),
    }
    (out_root / "results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    (out_root / "eval_summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    write_report(out_root, summary, results)

    print(f"SkillOpt root: {DEFAULT_SKILLOPT_ROOT}")
    print(f"Output: {out_root}")
    print(f"Results: hard={hard:.4f} soft={soft:.4f} n={len(results)}")
    failures = [row for row in results if row.get("gate") != "observe" and not row["hard"]]
    if failures:
        print("Failures:")
        for row in failures:
            print(f"- {row['id']}: {row['fail_reason']}")
        sys.exit(1)


if __name__ == "__main__":
    main()
