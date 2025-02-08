import fs from "fs";
export async function writeToDisk(path: any, data: any) {
  fs.writeFile(`${path}/dataStore.json`, data, function (err) {
    if (err) throw err;
    console.log("Results Received");
    return true;
  });
}
