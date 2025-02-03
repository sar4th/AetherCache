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
      this.dataStore = dataFromDisk;
    } catch (error) {
      console.warn("Nothing to sync");
    }
  }
  insert(key: K, value: V): boolean {
    if (this.dataStore[key]) {
      console.warn("The key already exists");
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
  filter(query: {}) {
    console.log(this.dataStore);

    let filterKey = "";
    let filterValue: any = "";

    for (const [key, value] of Object.entries(query)) {
      filterKey = key;
      filterValue = value;
    }

    const mappedArray = Object.keys(this.dataStore)
      .map((key) => ({
        id: key,
        ...this.dataStore[key],
      }))
      .find((item: any) => {
        console.log(item.filterKey, "sss");
        return item[filterKey] == item[filterValue];
      });

    // console.log(d, "dd");
  }
}
