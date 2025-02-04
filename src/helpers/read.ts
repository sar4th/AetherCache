import { getHostOSbasePath } from "./get-platform";
import fs from "fs";
import createDirectory from "./mkdir";
const { readFile } = require("fs/promises");
const path = require("path");

export async function readFileFromDisk(filePath?: string) {
  const filePath2 = getHostOSbasePath() + "/dataStore.json";
  if (!fs.existsSync(filePath2)) {
    console.log("Creating directory:", filePath2);
    createDirectory(filePath2).then(async () => {
      const data = await readFile(filePath2);
      return JSON.parse(data.toString());
    });
  }
  try {
    const data = await readFile(filePath2);
    return JSON.parse(data.toString());
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
}
