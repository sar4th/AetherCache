import { PersistenceManager } from "./PersistenceManager";
import { SchemaManager } from "./SchemaManager";

export class microDB<K extends string | number, V> extends PersistenceManager {
  private dataStore: Record<K, V>;
  schemaManager: SchemaManager;
  constructor() {
    super();
    this.schemaManager = new SchemaManager();
    this.dataStore = {} as Record<K, V>;
    let dataFromDisk = this.loadFromDisk();
  }

  insert(key: K, value: V): boolean {
    if (this.dataStore[key]) {
      console.warn("The key already exists");
      return false;
    }
    const { schema }: any = this.schemaManager.getSchema(key);
    this.schemaManager.validate(value, schema);
    this.dataStore[key] = value;
    super.syncToDisk(undefined, this.dataStore as any, "save");
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
    super.syncToDisk(undefined, this.dataStore as any, "save");
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
