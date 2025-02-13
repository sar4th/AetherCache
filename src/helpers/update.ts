import { readFileFromDisk } from "./read";

export async function updateDiskData(
  path?: string,
  key?: string,
  value?: string
) {
  const diskData = await readFileFromDisk("db");
  const parsedData = JSON.parse(diskData);
}
