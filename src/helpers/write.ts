import fs from "fs";
export async function writeToDisk(path: any, data: any, variant?: string) {
  let subPath = variant == "db" ? "/dataStore.json" : "/schemaStore.json";
  fs.writeFile(`${path}${subPath}`, data, function (err) {
    if (err) throw err;

    return true;
  });
}
