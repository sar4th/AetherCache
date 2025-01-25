import { createDirectory } from "../helpers/mkdir";
import fs from "fs";
import { writeToDisk } from "../helpers/write";
class PersistenceManager {
  private filePath: string;

  constructor() {
    this.filePath = "C:\\Users\\sarat\\microDB";
  }
  saveToDisk<K extends string | number | symbol, V>(data: Record<K, V>) {
    if (!fs.existsSync(this.filePath)) {
      createDirectory(this.filePath);
    } else {
      const stringifiedData = JSON.stringify(data);
      writeToDisk(this.filePath, data);
    }
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
