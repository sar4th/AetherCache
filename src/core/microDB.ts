export class microDB<K extends string | number, V> {
  private dataStore: Record<K, V>;

  constructor() {
    this.dataStore = {} as Record<K, V>;
  }

  insert(key: K, value: V): boolean {
    if (this.dataStore[key]) {
      console.warn("The key already exists");
      return false;
    }
    this.dataStore[key] = value;
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
