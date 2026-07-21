import {Config} from "@remotion/cli/config";
import fs from "node:fs";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

const sharedBrowserExecutable =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  process.env.HYPERFRAMES_BROWSER_PATH ??
  "C:\\Users\\liuzh\\AppData\\Local\\ms-playwright\\chromium_headless_shell-1217\\chrome-headless-shell-win64\\chrome-headless-shell.exe";

if (fs.existsSync(sharedBrowserExecutable)) {
  Config.setBrowserExecutable(sharedBrowserExecutable);
}
