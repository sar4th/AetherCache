import fs from "fs";
import { writeToDisk } from "../helpers/write";
import createDirectory from "../helpers/mkdir";
import { readFileFromDisk } from "../helpers/read";
import { flags } from "../types";
import { updateDiskData } from "../helpers/update";
import { getHostOSbasePath } from "../helpers/get-platform";

export class PersistenceManager {
  private filePath: string;

  constructor() {
    console.log(typeof getHostOSbasePath);

    this.filePath = getHostOSbasePath();
  }
  syncToDisk<K extends string | number | symbol, V>(
    key?: string,
    data?: Record<K, V>,
    flag?: flags
  ) {
    if (!fs.existsSync(this.filePath)) {
      console.log("Creating directory:", this.filePath);

      createDirectory(this.filePath)
        .then(() => {
          console.log(`Directory ${this.filePath} created successfully.`);
          const stringifiedData = JSON.stringify(data);
          writeToDisk(this.filePath, stringifiedData);
        })
        .catch((err) => {
          console.error("Error creating directory:", err.message);
        });
    } else {
      const stringifiedData = JSON.stringify(data);
      switch (flag) {
        case "save":
          writeToDisk(this.filePath, stringifiedData);
          break;
        case "update":
          updateDiskData(this.filePath, key, stringifiedData);
          break;
      }
    }
  }
  async loadFromDisk(): Promise<any> {
    try {
      let data = await readFileFromDisk(this.filePath);
      if (data) {
        return data;
      }
    } catch (error) {
      if (error) throw new Error(error as any);
    }
  }
}
