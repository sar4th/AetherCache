import fs from "fs";
import { writeToDisk } from "../helpers/write";
import createDirectory from "../helpers/mkdir";

export class PersistenceManager {
  private filePath: string;

  constructor() {
    this.filePath = "C:\\Users\\sarat\\microDB";
  }
  saveToDisk<K extends string | number | symbol, V>(data: Record<K, V>) {
    if (!fs.existsSync(this.filePath)) {
      console.log("Creating directory:", this.filePath);

      // Check if `createDirectory` returns a Promise, as it's async.
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
      writeToDisk(this.filePath, stringifiedData);
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
