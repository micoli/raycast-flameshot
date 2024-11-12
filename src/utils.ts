import { closeMainWindow, getApplications, showHUD } from "@raycast/api";
import { runAppleScript } from "run-applescript";

/**
 * Builds AppleScript to ensure Flameshot is running and then wraps the passed command(s).
 *
 * @param commandsToRunAfterFlameshotIsRunning - The AppleScript command(s) to run after ensuring Flameshot is running.
 * @returns Generated AppleScript.
 */
export function buildScriptEnsuringFlameshotIsRunning(commandsToRunAfterFlameshotIsRunning: string): string {
  return `
    tell application "Flameshot"
      if not application "Flameshot" is running then
        activate

        set _maxOpenWaitTimeInSeconds to 5
        set _openCounter to 1
        repeat until application "Flameshot" is running
          delay 1
          set _openCounter to _openCounter + 1
          if _openCounter > _maxOpenWaitTimeInSeconds then exit repeat
        end repeat
      end if
      ${commandsToRunAfterFlameshotIsRunning}
    end tell`;
}

/**
 * Runs the AppleScript and closes the main window afterwards.
 *
 * @remarks
 * The main window is before running the AppleScript to keep the UI snappy.
 *
 * @param appleScript - The AppleScript to run
 * @throws An error when the AppleScript fails to run
 * @returns A promise that is resolved when the AppleScript finished running
 */
export async function runAppleScriptSilently(appleScript: string) {
  await closeMainWindow();

  const applications = await getApplications();
  const isFlameshotInstalled = applications.some((app) => app.name === "Flameshot");
  if (!isFlameshotInstalled) {
    await showHUD("Flameshot is not installed");
    return;
  }

  await runAppleScript(appleScript);
}
