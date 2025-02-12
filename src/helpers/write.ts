import fs from "fs";
export async function writeToDisk(path: any, data: any) {
  fs.writeFile(`${path}/dataStore.json`, data, function (err) {
    if (err) throw err;

    return true;
  });
}
