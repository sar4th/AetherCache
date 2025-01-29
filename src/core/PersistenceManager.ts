import fs from "fs";
import { writeToDisk } from "../helpers/write";
import createDirectory from "../helpers/mkdir";
import { readFileFromDisk } from "../helpers/read";
import { flags } from "../types";
import { updateDiskData } from "../helpers/update";
import {getHostOSbasePath} from "../helpers/get-platform";


export class PersistenceManager {
  private filePath: string;

  constructor() {
    console.log(typeof(getHostOSbasePath));
    
    this.filePath = getHostOSbasePath()
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
    let data = await readFileFromDisk(this.filePath);
    return data;
  }
}

// class PersistenceManager {
//     - private filePath: string

//     constructor(filePath: string) {
//       - Assign the filePath
//     }

//     save(data: object): void {
//       - Serialize data (JSON.stringify)
//       - Write to file (ensure atomicity)
//     }

//     load(): object {
//       - Check if the file exists
//       - If yes, read and parse the file
//       - If no, return an empty object
//     }
//   }
