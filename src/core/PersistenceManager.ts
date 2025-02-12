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
    this.filePath = getHostOSbasePath();
  }
  syncToDisk<K extends string | number | symbol, V>(
    key?: string,
    data?: Record<K, V>,
    flag?: flags
  ) {
    const stringifyData = <K extends string, V>(
      data: Record<K, V> | undefined
    ): string => {
      // If data is undefined or empty, return an empty string
      if (!data || Object.keys(data).length === 0) {
        return "";
      }
      // Otherwise, return the JSON string
      return JSON.stringify(data);
    };

    const stringifiedData: string = stringifyData(data);
    if (!fs.existsSync(this.filePath)) {
      createDirectory(this.filePath)
        .then(() => {
          writeToDisk(this.filePath, stringifiedData);
        })
        .catch((err) => {
          console.error("Error creating directory:", err.message);
        });
    } else {
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
