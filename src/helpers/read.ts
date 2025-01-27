const { readFile } = require("fs/promises");
const path = require("path");

export async function readFileFromDisk(filePath?: string) {
  const filePath2 = path.join(
    "C:",
    "Users",
    "sarat",
    "microDB",
    "dataStore.json"
  );
  try {
    const data = await readFile(filePath2);
    return data.toString();
  } catch (error) {
    console.error(error);
  }
}
