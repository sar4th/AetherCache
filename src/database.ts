import {
  AetherCacheOptions,
  Collection,
  CollectionName,
  CollectionMetadata,
  DatabaseStore,
  FilterPredicate,
  RecordId,
  RecordData,
  SchemaDefinition,
  SchemaRegistration,
  StoredRecord,
} from "./types";
import { DuplicateRecordIdError, RecordNotFoundError } from "./errors";
import { CollectionManager } from "./internal/collections/CollectionManager";
import { IndexManager } from "./internal/indexing/IndexManager";
import { RecordIdentityManager } from "./internal/identity/RecordIdentityManager";
import { JsonPersistenceAdapter } from "./internal/persistence/JsonPersistenceAdapter";
import { SchemaManager } from "./internal/schema/SchemaManager";

export class AetherCache<TRecord extends RecordData = RecordData> {
  private dataStore: DatabaseStore<TRecord>;
  private readonly persist: boolean;
  private readonly persistence?: JsonPersistenceAdapter<TRecord>;
  private readonly recordIdentityManager: RecordIdentityManager;
  private readonly indexManager: IndexManager<TRecord>;
  private readonly schemaManager: SchemaManager<TRecord>;
  private readonly collectionManager: CollectionManager<TRecord>;

  constructor(options: AetherCacheOptions = {}) {
    this.persist = options.persist ?? false;
    this.persistence = this.persist
      ? new JsonPersistenceAdapter<TRecord>(options.storageDir)
      : undefined;
    this.dataStore = { collections: {} };
    this.recordIdentityManager = new RecordIdentityManager();
    this.indexManager = new IndexManager();
    this.collectionManager = new CollectionManager(this.dataStore.collections);
    this.schemaManager = new SchemaManager();
    this.schemaManager.bindCollectionManager(this.collectionManager);
  }

  async initialize(): Promise<void> {
    if (!this.persistence) {
      return;
    }

    const snapshot = await this.persistence.load();
    this.dataStore = this.normalizeStore(snapshot.data, snapshot.schemas);
    this.collectionManager.setCollections(this.dataStore.collections);
    this.dataStore.collections = this.collectionManager.getCollections();
    this.initializeIndexes();
    this.schemaManager.bindCollectionManager(this.collectionManager);
  }

  async createCollection(
    collectionName: CollectionName,
    schema: SchemaDefinition,
    metadata?: Partial<CollectionMetadata>
  ): Promise<Collection<TRecord>> {
    const collection = this.collectionManager.createCollection(
      collectionName,
      schema,
      metadata
    );
    this.indexManager.initializeCollection(collection);
    await this.persistState();
    return collection;
  }

  async deleteCollection(collectionName: CollectionName): Promise<boolean> {
    const deleted = this.collectionManager.deleteCollection(collectionName);

    if (deleted) {
      this.indexManager.dropCollection(collectionName);
      await this.persistState();
    }

    return deleted;
  }

  getCollection(collectionName: CollectionName): Collection<TRecord> {
    const collection = this.collectionManager.getCollection(collectionName);
    this.indexManager.ensureCollection(collection);
    return collection;
  }

  listCollections(): Collection<TRecord>[] {
    return Object.values(this.collectionManager.getCollections());
  }

  listSchemas(): SchemaRegistration[] {
    return this.schemaManager.listSchemas();
  }

  async insert(
    collectionName: CollectionName,
    value: TRecord,
    recordId?: RecordId
  ): Promise<RecordId | false> {
    const collection = this.getCollection(collectionName);
    this.schemaManager.validate(collectionName, value);

    let record: StoredRecord<TRecord>;

    try {
      record = this.recordIdentityManager.createRecord(
        collection,
        value,
        recordId
      );
    } catch (error) {
      if (error instanceof DuplicateRecordIdError) {
        return false;
      }

      throw error;
    }

    collection.records[record.id] = record;
    this.indexManager.indexRecord(collectionName, record);
    this.collectionManager.touchCollection(collectionName);
    await this.persistState();
    return record.id;
  }

  get(
    collectionName: CollectionName,
    recordId: RecordId
  ): StoredRecord<TRecord> | undefined {
    const collection = this.collectionManager.getCollection(collectionName);
    this.indexManager.ensureCollection(collection);
    return this.indexManager.getByPrimaryKey(collectionName, recordId);
  }

  async update(
    collectionName: CollectionName,
    recordId: RecordId,
    value: TRecord
  ): Promise<boolean> {
    const collection = this.getCollection(collectionName);

    if (!this.indexManager.hasPrimaryKey(collectionName, recordId)) {
      return false;
    }

    this.schemaManager.validate(collectionName, value);

    collection.records[recordId] = this.recordIdentityManager.normalizeRecord(
      recordId,
      {
        ...collection.records[recordId],
        data: value,
      }
    );
    this.indexManager.updateRecord(collectionName, collection.records[recordId]);
    this.collectionManager.touchCollection(collectionName);
    await this.persistState();
    return true;
  }

  async delete(
    collectionName: CollectionName,
    recordId: RecordId
  ): Promise<boolean> {
    const collection = this.getCollection(collectionName);

    if (!this.indexManager.hasPrimaryKey(collectionName, recordId)) {
      throw new RecordNotFoundError(recordId);
    }

    delete collection.records[recordId];
    this.indexManager.deleteRecord(collectionName, recordId);
    this.collectionManager.touchCollection(collectionName);
    await this.persistState();
    return true;
  }

  filter(
    collectionName: CollectionName,
    filterFunction: FilterPredicate<TRecord>
  ): Array<TRecord & { id: RecordId }> {
    const collection = this.getCollection(collectionName);

    return Object.values(collection.records)
      .map((record) => ({
        id: record.id,
        ...record.data,
      }))
      .filter(filterFunction);
  }

  async flush(): Promise<void> {
    await this.persistState();
  }

  private async persistState(): Promise<void> {
    if (!this.persistence) {
      return;
    }

    this.dataStore.collections = this.collectionManager.getCollections();
    await this.persistence.save({
      data: this.dataStore,
      schemas: this.schemaManager.listSchemas(),
    });
  }

  private initializeIndexes(): void {
    Object.values(this.collectionManager.getCollections()).forEach(
      (collection) => {
        this.indexManager.initializeCollection(collection);
      }
    );
  }

  private normalizeStore(
    dataFromDisk?: DatabaseStore<TRecord>,
    schemasFromDisk?: SchemaRegistration[]
  ): DatabaseStore<TRecord> {
    const store: DatabaseStore<TRecord> = { collections: {} };

    if (this.isDatabaseStore(dataFromDisk)) {
      return dataFromDisk;
    }

    if (Array.isArray(schemasFromDisk)) {
      schemasFromDisk.forEach(({ name, schema }) => {
        store.collections[name] = this.createEmptyCollection(name, schema);
      });
    }

    return store;
  }

  private isDatabaseStore(value: unknown): value is DatabaseStore<TRecord> {
    return (
      typeof value === "object" &&
      value !== null &&
      "collections" in value &&
      typeof (value as DatabaseStore<TRecord>).collections === "object"
    );
  }

  private createEmptyCollection(
    name: CollectionName,
    schema: SchemaDefinition
  ): Collection<TRecord> {
    const now = new Date().toISOString();

    return {
      name,
      schema,
      metadata: {
        createdAt: now,
        updatedAt: now,
        recordCount: 0,
      },
      records: {},
      indexes: {},
    };
  }
}

export { AetherCache as microDB };
