import { getApplications, Toast } from "@raycast/api";
import { execa } from "execa";

async function execFlameShot(args) {
  const applications = await getApplications();
  const installedFlameShot = applications.filter((app) => app.bundleId === "org.flameshot");
  if (installedFlameShot.length === 0) {
    return;
  }
  const installedFlameShotPath = installedFlameShot[0].path;
  return execa(`${installedFlameShotPath}/Contents/MacOS/flameshot`, args);
}

export default async () => {
  await execFlameShot(["gui"]);
};
