import { getHostOSbasePath } from "./get-platform";
import fs from "fs";
import createDirectory from "./mkdir";
import { writeToDisk } from "./write";
const { readFile } = require("fs/promises");
const path = require("path");

export async function readFileFromDisk(filePath?: string) {
  let __dir = getHostOSbasePath();

  const filePath2 = getHostOSbasePath() + "/dataStore.json";
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
