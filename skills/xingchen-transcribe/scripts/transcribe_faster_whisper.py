#!/usr/bin/env python
"""Transcribe Xingchen recording takes with the persistent local faster-whisper runtime."""

from __future__ import annotations

import argparse
import csv
import json
import math
import os
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Any


DEFAULT_MODEL_CACHE = Path(r"C:\Users\liuzh\.codex\models\huggingface")
DEFAULT_MODEL = "small"
TSV_FIELDS = [
    "take_id",
    "source_file",
    "start",
    "end",
    "speaker",
    "text",
    "pause_after_ms",
    "speech_rate",
    "scene_break_hint",
    "tone_shift",
    "confidence",
    "cleanup_action",
    "pronunciation_lock",
    "avg_logprob",
    "no_speech_prob",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create transcript.tsv and optional project-state.json writeback for Xingchen Next."
    )
    parser.add_argument("--audio", nargs="*", default=[], help="Audio files to transcribe, in take order.")
    parser.add_argument("--state", help="Optional project-state.json path to update.")
    parser.add_argument("--state-mode", choices=["replace", "append"], default="replace")
    parser.add_argument("--out-dir", default=".", help="Directory for transcript.tsv and report outputs.")
    parser.add_argument("--output-tsv", help="Defaults to <out-dir>/transcript.tsv.")
    parser.add_argument("--report", help="Defaults to <out-dir>/recording-cleanup-report.md.")
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--language", default="zh")
    parser.add_argument("--device", default="cpu")
    parser.add_argument("--compute-type", default="int8")
    parser.add_argument("--model-cache", default=str(DEFAULT_MODEL_CACHE))
    parser.add_argument("--speaker", default="speaker_1")
    parser.add_argument("--beam-size", type=int, default=5)
    parser.add_argument("--initial-prompt", default="")
    parser.add_argument("--no-vad-filter", action="store_true")
    parser.add_argument("--check-runtime", action="store_true")
    args = parser.parse_args()
    if not args.check_runtime and not args.audio:
        parser.error("--audio is required unless --check-runtime is used")
    return args


def set_model_cache(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)
    os.environ.setdefault("HF_HOME", str(path))
    os.environ.setdefault("HUGGINGFACE_HUB_CACHE", str(path / "hub"))


def runtime_status(model_cache: Path) -> dict[str, Any]:
    result: dict[str, Any] = {
        "python": sys.executable,
        "model_cache": str(model_cache),
        "ffmpeg": shutil.which("ffmpeg"),
        "ffprobe": shutil.which("ffprobe"),
        "packages": {},
    }
    try:
        import importlib.metadata as metadata

        for package in ["faster-whisper", "ctranslate2", "onnxruntime", "numpy", "soundfile", "av"]:
            try:
                result["packages"][package] = metadata.version(package)
            except metadata.PackageNotFoundError:
                result["packages"][package] = None
    except Exception as exc:  # pragma: no cover - diagnostic path
        result["package_error"] = repr(exc)
    return result


def sanitize_take_id(path: Path, index: int) -> str:
    value = re.sub(r"[^A-Za-z0-9_.-]+", "-", path.stem).strip("-")
    return value or f"take-{index:02d}"


def speech_units(text: str) -> int:
    return len(re.sub(r"\s+", "", text))


def confidence_from_avg_logprob(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return round(max(0.0, min(1.0, math.exp(float(value)))), 4)
    except (TypeError, ValueError, OverflowError):
        return None


def round_or_none(value: Any, digits: int = 3) -> float | None:
    if value is None:
        return None
    try:
        return round(float(value), digits)
    except (TypeError, ValueError):
        return None


def segment_dict(raw: Any, audio_path: Path, take_id: str, speaker: str) -> dict[str, Any]:
    start = round(float(raw.start), 3)
    end = round(float(raw.end), 3)
    text = raw.text.strip()
    duration = max(0.001, end - start)
    avg_logprob = round_or_none(getattr(raw, "avg_logprob", None), 4)
    no_speech_prob = round_or_none(getattr(raw, "no_speech_prob", None), 4)
    return {
        "take_id": take_id,
        "source_file": str(audio_path.resolve()),
        "start": start,
        "end": end,
        "speaker": speaker,
        "text": text,
        "pause_after_ms": 0,
        "speech_rate": round(speech_units(text) / duration, 3),
        "scene_break_hint": "",
        "tone_shift": False,
        "confidence": confidence_from_avg_logprob(avg_logprob),
        "cleanup_action": "none_raw_transcription",
        "pronunciation_lock": "",
        "avg_logprob": avg_logprob,
        "no_speech_prob": no_speech_prob,
    }


def add_pacing_hints(segments: list[dict[str, Any]]) -> None:
    for index, segment in enumerate(segments):
        if index + 1 < len(segments):
            pause_ms = max(0, round((segments[index + 1]["start"] - segment["end"]) * 1000))
        else:
            pause_ms = 0
        segment["pause_after_ms"] = pause_ms
        if pause_ms >= 1500:
            segment["scene_break_hint"] = "strong"
        elif pause_ms >= 800:
            segment["scene_break_hint"] = "weak"

        if index > 0:
            prev_rate = float(segments[index - 1].get("speech_rate") or 0)
            rate = float(segment.get("speech_rate") or 0)
            if prev_rate > 0:
                segment["tone_shift"] = abs(rate - prev_rate) / prev_rate > 0.3


def load_model(args: argparse.Namespace):
    try:
        from faster_whisper import WhisperModel
    except ImportError as exc:
        raise SystemExit(
            "faster-whisper is not importable. Use the persistent runtime at "
            r"C:\Users\liuzh\.codex\runtimes\xingchen-next\.venv\Scripts\python.exe"
        ) from exc
    return WhisperModel(
        args.model,
        device=args.device,
        compute_type=args.compute_type,
        download_root=args.model_cache,
    )


def transcribe_files(args: argparse.Namespace) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    model = load_model(args)
    all_segments: list[dict[str, Any]] = []
    file_summaries: list[dict[str, Any]] = []
    seen_take_ids: set[str] = set()

    for index, audio in enumerate(args.audio, start=1):
        audio_path = Path(audio).expanduser().resolve()
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        take_id = sanitize_take_id(audio_path, index)
        if take_id in seen_take_ids:
            take_id = f"{take_id}-{index:02d}"
        seen_take_ids.add(take_id)

        raw_segments, info = model.transcribe(
            str(audio_path),
            language=args.language,
            beam_size=args.beam_size,
            vad_filter=not args.no_vad_filter,
            initial_prompt=args.initial_prompt or None,
        )
        take_segments = [
            segment_dict(raw, audio_path, take_id, args.speaker)
            for raw in raw_segments
            if raw.text and raw.text.strip()
        ]
        add_pacing_hints(take_segments)
        all_segments.extend(take_segments)
        file_summaries.append(
            {
                "take_id": take_id,
                "source_file": str(audio_path),
                "segment_count": len(take_segments),
                "language": getattr(info, "language", args.language),
                "language_probability": round_or_none(getattr(info, "language_probability", None), 4),
                "duration": round_or_none(getattr(info, "duration", None), 3),
                "duration_after_vad": round_or_none(getattr(info, "duration_after_vad", None), 3),
            }
        )
    return all_segments, file_summaries


def write_tsv(path: Path, segments: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=TSV_FIELDS, delimiter="\t", extrasaction="ignore")
        writer.writeheader()
        for segment in segments:
            writer.writerow({field: segment.get(field, "") for field in TSV_FIELDS})


def write_report(path: Path, args: argparse.Namespace, file_summaries: list[dict[str, Any]], segment_count: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Recording Cleanup Report",
        "",
        f"- generated_at: {datetime.now().astimezone().isoformat(timespec='seconds')}",
        f"- runtime_python: {sys.executable}",
        f"- model: {args.model}",
        f"- language: {args.language}",
        f"- device: {args.device}",
        f"- compute_type: {args.compute_type}",
        f"- model_cache: {args.model_cache}",
        f"- vad_filter: {not args.no_vad_filter}",
        f"- total_segments: {segment_count}",
        "",
        "## Cleanup posture",
        "",
        "- cleanup_action defaults to `none_raw_transcription`.",
        "- This script does not trim audio destructively; review tails before manual cleanup.",
        "- Pacing hints are derived from pauses and speech-rate shifts only.",
        "",
        "## Source files",
        "",
    ]
    for item in file_summaries:
        lines.append(
            f"- {item['take_id']}: {item['source_file']} "
            f"segments={item['segment_count']} duration={item.get('duration')}"
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def update_state(
    path: Path,
    args: argparse.Namespace,
    segments: list[dict[str, Any]],
    file_summaries: list[dict[str, Any]],
    output_tsv: Path,
    report: Path,
) -> None:
    if not path.exists():
        raise FileNotFoundError(f"State file not found: {path}")
    state = json.loads(path.read_text(encoding="utf-8-sig"))
    sources = state.setdefault("sources", {})
    source_pack = sources.setdefault("source_pack", {})
    transcript = sources.setdefault("transcript", {})

    if args.state_mode == "append":
        transcript["segments"] = list(transcript.get("segments") or []) + segments
    else:
        transcript["segments"] = segments

    transcript["runtime"] = {
        "engine": "faster-whisper",
        "model": args.model,
        "language": args.language,
        "device": args.device,
        "compute_type": args.compute_type,
        "model_cache": args.model_cache,
        "transcript_tsv_path": str(output_tsv.resolve()),
        "updated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
    }
    transcript["source_files"] = file_summaries

    draft_recordings = source_pack.setdefault("draft_recordings", [])
    existing_recording_paths = {
        str(item.get("file_path") if isinstance(item, dict) else item)
        for item in draft_recordings
    }
    asset_manifest = sources.setdefault("asset_manifest", [])
    existing_asset_paths = {
        str(item.get("file_path", ""))
        for item in asset_manifest
        if isinstance(item, dict)
    }
    for item in file_summaries:
        source_file = item["source_file"]
        if source_file not in existing_recording_paths:
            draft_recordings.append({"take_id": item["take_id"], "file_path": source_file})
        if source_file not in existing_asset_paths:
            asset_manifest.append(
                {
                    "asset_id": f"audio-{item['take_id']}",
                    "file_path": source_file,
                    "asset_type": "audio_recording",
                    "summary": "Narration take transcribed by faster-whisper.",
                    "topic_tags": [],
                    "proof_candidate": False,
                    "dedupe_group": item["take_id"],
                    "review_status": "approved" if item.get("segment_count", 0) > 0 else "blocked",
                }
            )

    source_audio_refs = [item["source_file"] for item in file_summaries]
    segment_count = len(segments)
    blocked_files = [
        item["source_file"]
        for item in file_summaries
        if int(item.get("segment_count") or 0) <= 0
    ]
    existing_correction = sources.get("recording_correction") if isinstance(sources.get("recording_correction"), dict) else {}
    existing_notes = existing_correction.get("manual_review_notes", "") if isinstance(existing_correction, dict) else ""
    if isinstance(existing_notes, list):
        existing_notes = "; ".join(str(item) for item in existing_notes if str(item).strip())
    status = "completed" if segment_count > 0 and not blocked_files else "blocked"
    notes = str(existing_notes or "").strip()
    if blocked_files:
        blocked_note = "No transcript segments were produced for: " + ", ".join(blocked_files)
        notes = f"{notes}; {blocked_note}" if notes else blocked_note

    sources["recording_correction"] = {
        "status": status,
        "source_audio_refs": source_audio_refs,
        "cleaned_audio_paths": source_audio_refs,
        "transcript_path": str(output_tsv.resolve()),
        "cleanup_report_path": str(report.resolve()),
        "correction_actions": [
            "accepted original narration audio for visual timing",
            "generated transcript.tsv from faster-whisper segments",
            "recorded pacing hints from pause length and speech-rate shifts",
            "no destructive trim was applied by the helper",
        ],
        "quality_checks": [
            f"transcript_segment_count={segment_count}",
            f"source_audio_count={len(source_audio_refs)}",
            f"vad_filter={not args.no_vad_filter}",
            f"cleanup_report={report.resolve()}",
        ],
        "manual_review_notes": notes,
    }

    state.setdefault("metadata", {})["updated_at"] = datetime.now().astimezone().isoformat(timespec="seconds")
    path.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    model_cache = Path(args.model_cache).expanduser().resolve()
    args.model_cache = str(model_cache)
    set_model_cache(model_cache)

    if args.check_runtime:
        print(json.dumps(runtime_status(model_cache), ensure_ascii=False, indent=2))
        return 0

    out_dir = Path(args.out_dir).expanduser().resolve()
    output_tsv = Path(args.output_tsv).expanduser().resolve() if args.output_tsv else out_dir / "transcript.tsv"
    report = Path(args.report).expanduser().resolve() if args.report else out_dir / "recording-cleanup-report.md"

    segments, file_summaries = transcribe_files(args)
    write_tsv(output_tsv, segments)
    write_report(report, args, file_summaries, len(segments))

    if args.state:
        update_state(Path(args.state).expanduser().resolve(), args, segments, file_summaries, output_tsv, report)

    print(
        json.dumps(
            {
                "transcript_tsv": str(output_tsv),
                "report": str(report),
                "state": str(Path(args.state).expanduser().resolve()) if args.state else None,
                "segments": len(segments),
                "files": file_summaries,
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
