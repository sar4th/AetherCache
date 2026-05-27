import {
  Collection,
  RecordData,
  SchemaDefinition,
  SchemaRegistration,
} from "../../types";
import { CollectionManager } from "../collections/CollectionManager";
import { validateRecord } from "../validation/schema";

export class SchemaManager<TRecord extends RecordData = RecordData> {
  private collectionManager?: CollectionManager<TRecord>;

  bindCollectionManager(collectionManager: CollectionManager<TRecord>): void {
    this.collectionManager = collectionManager;
  }

  registerSchema(
    name: string,
    schema: SchemaDefinition
  ): SchemaRegistration[] {
    if (this.collectionManager) {
      this.collectionManager.updateSchema(name, schema);
    }

    return this.listSchemas();
  }

  validate(collectionName: string, value: unknown): void {
    const schema = this.collectionManager?.getCollection(collectionName).schema;
    validateRecord(collectionName, value, schema);
  }

  getSchema(collectionName: string): SchemaRegistration | undefined {
    const collection = this.collectionManager?.getCollection(collectionName);

    if (!collection) {
      return undefined;
    }

    return {
      name: collection.name,
      schema: collection.schema,
    };
  }

  listSchemas(): SchemaRegistration[] {
    if (!this.collectionManager) {
      return [];
    }

    return Object.values(this.collectionManager.getCollections()).map(
      (collection: Collection<TRecord>) => ({
        name: collection.name,
        schema: collection.schema,
      })
    );
  }
}
