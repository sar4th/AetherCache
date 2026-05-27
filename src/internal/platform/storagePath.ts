import os from "node:os";
import path from "node:path";

export function getDefaultStorageDir(): string {
  switch (process.platform) {
    case "linux":
      return path.join(os.homedir(), ".local", "share", "aether-cache");
    case "win32":
      return path.join(os.homedir(), "AppData", "Roaming", "aether-cache");
    case "darwin":
      return path.join(
        os.homedir(),
        "Library",
        "Application Support",
        "aether-cache"
      );
    default:
      return path.join(os.homedir(), ".aether-cache");
  }
}
