$ErrorActionPreference = "Continue"

$skillRoot = Split-Path -Parent $PSScriptRoot
$computedSkillsRoot = Split-Path -Parent $skillRoot
$skillsRoot = [Environment]::GetEnvironmentVariable("AGENT_SKILLS_HOME")
if ([string]::IsNullOrWhiteSpace($skillsRoot)) {
  $skillsRoot = $computedSkillsRoot
}
$skillsRoot = [System.IO.Path]::GetFullPath($skillsRoot)

$runtimeRoot = "C:\Users\liuzh\.codex\runtimes\xingchen-next"
$venvPython = Join-Path $runtimeRoot ".venv\Scripts\python.exe"
$nodeTools = Join-Path $runtimeRoot "node-tools"
$modelCache = "C:\Users\liuzh\.codex\models\huggingface"
$sharedBrowserFallback = "C:\Users\liuzh\AppData\Local\ms-playwright\chromium_headless_shell-1217\chrome-headless-shell-win64\chrome-headless-shell.exe"
$sharedBrowser = [Environment]::GetEnvironmentVariable("REMOTION_BROWSER_EXECUTABLE", "User")
if ([string]::IsNullOrWhiteSpace($sharedBrowser)) {
  $sharedBrowser = [Environment]::GetEnvironmentVariable("HYPERFRAMES_BROWSER_PATH", "User")
}
if ([string]::IsNullOrWhiteSpace($sharedBrowser)) {
  $sharedBrowser = $sharedBrowserFallback
}
$remotionHarness = Join-Path $skillsRoot "remotion-render-adapter\templates\director-motion-kernel"
$sparkRoot = "C:\xingchen-spark"
$vendorRoot = "C:\Users\liuzh\.codex\vendor_imports\video-runtimes"

function Add-Status {
  param(
    [string]$Name,
    [string]$Status,
    [string]$Detail
  )
  [pscustomobject]@{
    Name = $Name
    Status = $Status
    Detail = $Detail
  }
}

$rows = New-Object System.Collections.Generic.List[object]

foreach ($cmd in @("ffmpeg", "ffprobe", "node", "npm", "npx", "git")) {
  $found = Get-Command $cmd -ErrorAction SilentlyContinue
  if ($found) {
    $rows.Add((Add-Status $cmd "OK" $found.Source))
  } else {
    $rows.Add((Add-Status $cmd "MISSING" "Required for full Xingchen Next operation"))
  }
}

if (Test-Path $venvPython) {
  $rows.Add((Add-Status "xingchen-next venv" "OK" $venvPython))
  $pkgCheck = @'
import importlib.metadata as md
for package in ["faster-whisper", "ctranslate2", "onnxruntime", "numpy", "soundfile", "av"]:
    try:
        print(f"{package}={md.version(package)}")
    except md.PackageNotFoundError:
        print(f"{package}=MISSING")
'@ | & $venvPython -
  $rows.Add((Add-Status "transcribe packages" "OK" ($pkgCheck -join "; ")))
} else {
  $rows.Add((Add-Status "xingchen-next venv" "MISSING" $venvPython))
}

if (Test-Path $modelCache) {
  $rows.Add((Add-Status "model cache" "OK" $modelCache))
} else {
  $rows.Add((Add-Status "model cache" "MISSING" $modelCache))
}

if (Test-Path -LiteralPath $sharedBrowser) {
  $rows.Add((Add-Status "shared headless browser" "OK" $sharedBrowser))
} else {
  $rows.Add((Add-Status "shared headless browser" "MISSING" $sharedBrowser))
}

$hyperframesBrowser = [Environment]::GetEnvironmentVariable("HYPERFRAMES_BROWSER_PATH", "User")
if ($hyperframesBrowser -eq $sharedBrowser -and (Test-Path -LiteralPath $hyperframesBrowser)) {
  $rows.Add((Add-Status "HYPERFRAMES_BROWSER_PATH" "OK" $hyperframesBrowser))
} else {
  $rows.Add((Add-Status "HYPERFRAMES_BROWSER_PATH" "MISSING" "Set to shared headless browser to avoid repeated Hyperframes downloads"))
}

$remotionBrowser = [Environment]::GetEnvironmentVariable("REMOTION_BROWSER_EXECUTABLE", "User")
if ($remotionBrowser -eq $sharedBrowser -and (Test-Path -LiteralPath $remotionBrowser)) {
  $rows.Add((Add-Status "REMOTION_BROWSER_EXECUTABLE" "OK" $remotionBrowser))
} else {
  $rows.Add((Add-Status "REMOTION_BROWSER_EXECUTABLE" "MISSING" "Set to shared headless browser or use Config.setBrowserExecutable"))
}

$remotionBin = Join-Path $remotionHarness "node_modules\.bin\remotion.cmd"
if (Test-Path $remotionBin) {
  $rows.Add((Add-Status "remotion harness" "OK" $remotionBin))
} else {
  $rows.Add((Add-Status "remotion harness" "MISSING" "Run npm install inside the harness or target render project"))
}

$nodePlaywright = node -e "try { const p=require(process.argv[1] + '/node_modules/playwright/package.json'); console.log(p.version); } catch (e) { process.exit(1); }" $nodeTools 2>$null
if ($LASTEXITCODE -eq 0) {
  $rows.Add((Add-Status "node playwright package" "OK" "$nodePlaywright at $nodeTools"))
} else {
  $rows.Add((Add-Status "node playwright package" "OPTIONAL_MISSING" "Install in $nodeTools for custom browser-capture helpers outside Remotion/browser-use"))
}

$hyperframesPkg = node -e "try { const p=require(process.argv[1] + '/node_modules/hyperframes/package.json'); console.log(p.version); } catch (e) { process.exit(1); }" $nodeTools 2>$null
if ($LASTEXITCODE -eq 0) {
  $rows.Add((Add-Status "hyperframes package" "OK" "$hyperframesPkg at $nodeTools"))
} else {
  $rows.Add((Add-Status "hyperframes package" "OPTIONAL_MISSING" "Install in $nodeTools for persistent Hyperframes candidate generation"))
}

$playwrightBrowsers = "C:\Users\liuzh\AppData\Local\ms-playwright"
if (Test-Path $playwrightBrowsers) {
  $rows.Add((Add-Status "playwright browsers" "OK" $playwrightBrowsers))
} else {
  $rows.Add((Add-Status "playwright browsers" "OPTIONAL_MISSING" "Install before custom browser capture"))
}

if (Test-Path $vendorRoot) {
  $rows.Add((Add-Status "video runtime source snapshots" "OK" $vendorRoot))
} else {
  $rows.Add((Add-Status "video runtime source snapshots" "MISSING" $vendorRoot))
}

if (Test-Path $sparkRoot) {
  $rows.Add((Add-Status "spark route root" "OK" $sparkRoot))
} else {
  $rows.Add((Add-Status "spark route root" "OPTIONAL_MISSING" "Only required for Spark/3DGS scenes"))
}

$rows | Format-Table -AutoSize

$hardMissing = $rows | Where-Object { $_.Status -eq "MISSING" }
if ($hardMissing.Count -gt 0) {
  exit 1
}
exit 0
