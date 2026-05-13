param(
  [string]$TargetRoot = "$env:USERPROFILE\.codex\skills"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceRoot = Join-Path $repoRoot "skills"

if (-not (Test-Path -LiteralPath $sourceRoot)) {
  throw "Missing skills directory: $sourceRoot"
}

New-Item -ItemType Directory -Path $TargetRoot -Force | Out-Null

Get-ChildItem -LiteralPath $sourceRoot -Directory | Sort-Object Name | ForEach-Object {
  $destination = Join-Path $TargetRoot $_.Name
  if (Test-Path -LiteralPath $destination) {
    Remove-Item -LiteralPath $destination -Recurse -Force
  }

  robocopy $_.FullName $destination /E /XD __pycache__ .git node_modules .venv .pytest_cache /XF *.pyc *.pyo /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
  if ($LASTEXITCODE -gt 7) {
    throw "robocopy failed for $($_.Name) with code $LASTEXITCODE"
  }
}

Write-Host "Installed Xingchen skill family to $TargetRoot"
