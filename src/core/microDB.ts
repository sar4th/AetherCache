import { PersistenceManager } from "./PersistenceManager";
import { SchemaManager } from "./SchemaManager";

export class microDB<K extends string | number, V> extends PersistenceManager {
  private dataStore: Record<K, V>;
  schemaManager: SchemaManager;
  constructor() {
    super();
    this.schemaManager = new SchemaManager();
    this.dataStore = {} as Record<K, V>;
  }
  async initialize() {
    let dataFromDisk = await this.loadFromDisk();
    this.dataStore = dataFromDisk;
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
    // let dataSto: any = {
    //   user1: {
    //     name: "alice",
    //     age: 22,
    //     email: "test@mail.com",
    //   },
    // };
    // console.log(dataSto[key], "this.dataStore[key];");
    if (Object.keys(this.dataStore).length > 0 && key) {
      console.log(this.dataStore[key], "datastore");

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
      console.warn("The key does not exist");
      return false;
    }
    delete this.dataStore[key];
    super.syncToDisk(undefined, this.dataStore as any, "save");
    return true;
  }
}
