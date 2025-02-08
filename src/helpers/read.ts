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
    createDirectory(__dir).then(() => {
      console.log(`Directory ${__dir} created successfully.`);

      writeToDisk(filePath2, "").then(async () => {
        const data = await readFile(filePath2);
        return JSON.parse(data.toString());
      });
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
