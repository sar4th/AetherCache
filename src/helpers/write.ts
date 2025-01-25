import fs from "fs";
export function writeToDisk(
  path: any,
  data: string | NodeJS.ArrayBufferView<ArrayBufferLike>
) {
  fs.writeFile(`${path}/dataStore.json`, data, function (err) {
    if (err) throw err;
    console.log("Results Received");
    return true;
  });
}
