const { mkdir } = require("fs/promises");
const path = require("path");

export async function createDirectory(dirPath: string): Promise<boolean> {
  try {
    await mkdir(dirPath, { recursive: true });
    console.log(`Created directory ${dirPath}`);
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

const directoryPath = path.join("C:", "Users", "sarat", "microDB");
createDirectory(directoryPath);
