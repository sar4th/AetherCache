import { compareKeys } from "../helpers/compareKeys";

export class SchemaManager {
  private schemaStore: { name: string; schema: Record<string, string> }[] = [];
  this: any;

  constructor() {
    this.schemaStore = [];
  }

  registerSchema(name: string, schema: Record<string, string>) {
    const existingIndex = this.schemaStore.findIndex((s) => s.name === name);

    if (existingIndex !== -1) {
      this.schemaStore[existingIndex].schema = schema;
    } else {
      this.schemaStore.push({ name, schema });
    }
  }
  validate(_userValue: any, userSchema: any) {
    const missingKeys = compareKeys(_userValue, userSchema);
    if (missingKeys.length > 0) {
      throw new Error(
        `validation failed, ${missingKeys.join(",")} are missing `
      );
    }
  }
  getSchema(key: string | number) {
    return this.schemaStore.find((item) => item.name == key);
  }
}
