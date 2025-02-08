import { PersistenceManager } from "./PersistenceManager";
import { SchemaManager } from "./SchemaManager";

export class microDB<K extends string | number, V> extends PersistenceManager {
  private dataStore: any;
  schemaManager: SchemaManager;
  constructor() {
    super();
    this.schemaManager = new SchemaManager();
    this.dataStore = {} as Record<K, V>;
  }
  async initialize() {
    try {
      let dataFromDisk = await this.loadFromDisk();

      if (dataFromDisk) {
        this.dataStore = dataFromDisk;
      }
    } catch (error) {
      console.warn("Nothing to sync");
    }
  }
  insert(key: K, value: V): boolean {
    if (this.dataStore[key]) {
      console.warn("The key already exists");
      return false;
    }
    console.log(this.schemaManager);
    console.log(key);

    const { schema }: any = this.schemaManager.getSchema(key);
    let errors = this.schemaManager.validate(value, schema);
    // if (errors == false) {
    //   this.dataStore[key] = value;
    //   super.syncToDisk(undefined, this.dataStore as any, "save");
    //   return true;
    // }
    return true;
  }

  get(key: K): V | undefined {
    if (Object.keys(this.dataStore).length > 0 && key) {
      return this.dataStore[key];
    }
  }

  update(key: K, value: V): boolean {
    if (!this.dataStore[key]) {
      console.warn("The key does not exist");
      return false;
    }
    const { schema }: any = this.schemaManager.getSchema(key);
    let errors = this.schemaManager.validate(value, schema);
    if (errors == false) {
      this.dataStore[key] = value;
      super.syncToDisk(undefined, this.dataStore as any, "save");
      return true;
    }
    return true;
  }

  delete(key: K): boolean {
    if (!this.dataStore[key]) {
      throw new Error("The key does not exist");
    }
    delete this.dataStore[key];
    if (Object.keys(this.dataStore).length == 0) {
      super.syncToDisk(undefined, "" as any, "save");
    }
    super.syncToDisk(undefined, this.dataStore as any, "save");
    return true;
  }

  filter(filterFunction: any) {
    let filteredData = Object.keys(this.dataStore)
      .map((key) => ({
        id: key,
        ...this.dataStore[key],
      }))
      .filter((item: any) => {
        return filterFunction(item);
      });
    console.log(filteredData);
  }
}
