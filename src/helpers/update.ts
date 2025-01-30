import { readFileFromDisk } from "./read";

export async function updateDiskData(
  path?: string,
  key?: string,
  value?: string
) {
  const diskData = await readFileFromDisk();
  const parsedData = JSON.parse(diskData);
  console.log(parsedData, "parsedData");
}
