$ErrorActionPreference = "Stop"

$SkillRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Python = "C:\Users\liuzh\.codex\runtimes\xingchen-next\.venv\Scripts\python.exe"

if (-not (Test-Path -LiteralPath $Python)) {
  throw "Stable Xingchen Python not found: $Python"
}

& $Python (Join-Path $SkillRoot "scripts\skillopt_xingchen_eval.py") @args
