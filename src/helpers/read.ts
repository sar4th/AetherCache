import { getHostOSbasePath } from "./get-platform";
import fs from "fs";
import createDirectory from "./mkdir";
import { writeToDisk } from "./write";
const { readFile } = require("fs/promises");

export async function readFileFromDisk(variant?: string) {
  let __dir = getHostOSbasePath();
  let subPath = variant == "db" ? "/dataStore.json" : "/schemaStore.json";
  const filePath2 = getHostOSbasePath() + subPath;
  if (!fs.existsSync(filePath2)) {
    try {
      createDirectory(__dir).then(() => {
        writeToDisk(__dir, "").then(async () => {
          const data = await readFile(filePath2);
          return JSON.parse(data.toString());
        });
      });
    } catch (error) {
      console.log("error while creating a new dir", error);
    }
  }
  try {
    const data = await readFile(filePath2);
    return JSON.parse(data.toString());
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
}
