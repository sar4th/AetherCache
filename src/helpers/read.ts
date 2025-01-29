import { getHostOSbasePath } from "./get-platform";

const { readFile } = require("fs/promises");
const path = require("path");

export async function readFileFromDisk(filePath?: string) {
  const filePath2 = getHostOSbasePath()+"/dataStore.json"
  try {
    const data = await readFile(filePath2);
    return data.toString();
  } catch (error) {
    console.error(error);
  }
}
