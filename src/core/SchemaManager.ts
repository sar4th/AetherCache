import { compareTypes } from "../helpers/compairTypes";
import { compareKeys } from "../helpers/compareKeys";
import { PersistenceManager } from "./PersistenceManager";

export class SchemaManager extends PersistenceManager {
  schemaStore: { name: string; schema: Record<string, string> }[] = [];
  this: any;

  constructor() {
    super();
    this.schemaStore = [];
  }

  registerSchema(name: string, schema: Record<string, string>) {
    try {
      const existingIndex = this.schemaStore.findIndex((s) => s.name === name);

      if (existingIndex !== -1) {
        this.schemaStore[existingIndex].schema = schema;
        super.syncToDisk(
          undefined,
          this.schemaStore as typeof this.schemaStore,
          "save",
          "schema"
        );
        return this.schemaStore;
      } else {
        this.schemaStore.push({ name, schema });
        super.syncToDisk(
          undefined,
          this.schemaStore as typeof this.schemaStore,
          "save",
          "schema"
        );
        return this.schemaStore;
      }
    } catch (error) {
      console.log(error);
    }
  }
  validate(_userValue: any, userSchema: any) {
    const missingKeys = compareKeys(_userValue, userSchema);

    if (!isArrayOfArraysEmpty(missingKeys)) {
      throw new Error(
        `validation failed, ${missingKeys!.join(",")} are missing `
      );
    }
    const differenceInTypes = compareTypes(_userValue, userSchema);
    if (differenceInTypes.length > 0) {
      throw new Error(differenceInTypes.join("\n"));
    }
    return false;
  }
  getSchema(key: string | number) {
    return this.schemaStore.find((item) => item.name == key);
  }
}
function isArrayOfArraysEmpty(arr: any) {
  return (
    Array.isArray(arr) &&
    arr.every((subArray) => Array.isArray(subArray) && subArray.length === 0)
  );
}
