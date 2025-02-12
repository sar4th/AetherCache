const { mkdir } = require("fs/promises");
const path = require("path");

async function createDirectory(dirPath: string): Promise<boolean> {
  try {
    await mkdir(dirPath, { recursive: true });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Got an error trying to create the directory: ${error.message}`
      );
    } else {
      console.error("Got an unknown error", error);
    }
    return false;
  }
}

export default createDirectory;
