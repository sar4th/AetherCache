import { writeToDisk } from "../helpers/write";
import { PersistenceManager } from "./PersistenceManager";

export class microDB<K extends string | number, V> extends PersistenceManager {
  private dataStore: Record<K, V>;

  constructor() {
    super();
    this.dataStore = {} as Record<K, V>;
    let dataFromDisk = this.loadFromDisk();
    console.log(dataFromDisk, "dataFromDisk");
  }

  insert(key: K, value: V): boolean {
    if (this.dataStore[key]) {
      console.warn("The key already exists");
      return false;
    }
    this.dataStore[key] = value;
    super.syncToDisk(value as any, "save");
    return true;
  }

  get(key: K): V | undefined {
    return this.dataStore[key];
  }

  update(key: K, value: V): boolean {
    if (!this.dataStore[key]) {
      console.warn("The key does not exist");
      return false;
    }
    this.dataStore[key] = value;
    return true;
  }

  delete(key: K): boolean {
    if (!this.dataStore[key]) {
      console.warn("The key does not exist");
      return false;
    }
    delete this.dataStore[key];
    return true;
  }
}

// class microDB {
//   - private dataStore
//   - private filePath

//   constructor(filePath) {
//     - Assign filePath or use default
//     - Call loadFromDisk()
//   }

//   private loadFromDisk() {
//     - Check if file exists
//     - If yes, read and parse JSON
//     - If no or error, initialize empty dataStore
//   }

//   private saveToDisk() {
//     - Convert dataStore to JSON
//     - Write JSON to file (ensure atomicity)
//   }

//   insert(key, value) {
//     - Add key-value pair to dataStore
//     - Call saveToDisk()
//   }

//   update(key, value) {
//     - Modify value for the key
//     - Call saveToDisk()
//   }

//   delete(key) {
//     - Remove key from dataStore
//     - Call saveToDisk()
//   }
// }
