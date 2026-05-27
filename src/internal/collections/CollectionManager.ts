import {
  Collection,
  CollectionMetadata,
  CollectionName,
  DatabaseStore,
  RecordData,
  SchemaDefinition,
  StoredRecord,
} from "../../types";
import {
  CollectionExistsError,
  CollectionNotFoundError,
} from "../../errors";
import { RecordIdentityManager } from "../identity/RecordIdentityManager";

export class CollectionManager<TRecord extends RecordData = RecordData> {
  private collections: DatabaseStore<TRecord>["collections"];
  private readonly onCollectionChange?: () => void;
  private readonly recordIdentityManager: RecordIdentityManager;

  constructor(
    collections: DatabaseStore<TRecord>["collections"] = {},
    onCollectionChange?: () => void
  ) {
    this.collections = collections;
    this.onCollectionChange = onCollectionChange;
    this.recordIdentityManager = new RecordIdentityManager();
  }

  setCollections(collections: DatabaseStore<TRecord>["collections"]): void {
    this.collections = Object.keys(collections).reduce<
      DatabaseStore<TRecord>["collections"]
    >((normalizedCollections, name) => {
      normalizedCollections[name] = this.normalizeCollection(
        name,
        collections[name]
      );
      return normalizedCollections;
    }, {});

    this.onCollectionChange?.();
  }

  getCollections(): DatabaseStore<TRecord>["collections"] {
    return this.collections;
  }

  createCollection(
    name: CollectionName,
    schema: SchemaDefinition,
    metadata: Partial<CollectionMetadata> = {}
  ): Collection<TRecord> {
    if (this.collections[name]) {
      throw new CollectionExistsError(name);
    }

    const collection: Collection<TRecord> = {
      name,
      schema,
      metadata: this.createMetadata(metadata),
      records: {},
      indexes: {},
    };

    this.collections[name] = collection;
    this.onCollectionChange?.();
    return collection;
  }

  deleteCollection(name: CollectionName): boolean {
    if (!this.collections[name]) {
      return false;
    }

    delete this.collections[name];
    this.onCollectionChange?.();
    return true;
  }

  getCollection(name: CollectionName): Collection<TRecord> {
    const collection = this.collections[name];

    if (!collection) {
      throw new CollectionNotFoundError(name);
    }

    return collection;
  }

  hasCollection(name: CollectionName): boolean {
    return Boolean(this.collections[name]);
  }

  updateSchema(name: CollectionName, schema: SchemaDefinition): Collection<TRecord> {
    const collection = this.collections[name];

    if (!collection) {
      return this.createCollection(name, schema);
    }

    collection.schema = schema;
    this.touchCollection(name);
    return collection;
  }

  touchCollection(name: CollectionName): void {
    const collection = this.getCollection(name);
    collection.metadata.updatedAt = new Date().toISOString();
    collection.metadata.recordCount = Object.keys(collection.records).length;
    this.onCollectionChange?.();
  }

  private normalizeCollection(
    name: CollectionName,
    collection: Collection<TRecord>
  ): Collection<TRecord> {
    const records = this.normalizeRecords(collection.records ?? {});
    const metadata = this.createMetadata(collection.metadata);
    metadata.recordCount = Object.keys(records).length;

    return {
      name: collection.name ?? name,
      schema: collection.schema ?? {},
      metadata,
      records,
      indexes: collection.indexes ?? {},
    };
  }

  private normalizeRecords(
    records: Collection<TRecord>["records"]
  ): Collection<TRecord>["records"] {
    return Object.keys(records).reduce<Collection<TRecord>["records"]>(
      (normalizedRecords, id) => {
        normalizedRecords[id] = this.recordIdentityManager.normalizeRecord(
          id,
          records[id] as StoredRecord<TRecord>
        );
        return normalizedRecords;
      },
      {}
    );
  }

  private createMetadata(
    metadata: Partial<CollectionMetadata> = {}
  ): CollectionMetadata {
    const now = new Date().toISOString();

    return {
      createdAt: metadata.createdAt ?? now,
      updatedAt: metadata.updatedAt ?? now,
      recordCount: metadata.recordCount ?? 0,
      ...metadata,
    };
  }
}
