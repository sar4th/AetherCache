import {
  Collection,
  CollectionIndexes,
  CollectionName,
  RecordData,
  RecordId,
  StoredRecord,
} from "../../types";
import { AetherCacheError } from "../../errors";

export class IndexManager<TRecord extends RecordData = RecordData> {
  private indexes: Record<CollectionName, CollectionIndexes<TRecord>> = {};

  initializeCollection(collection: Collection<TRecord>): void {
    this.indexes[collection.name] = {
      primary: {
        name: "primary",
        kind: "primary",
        field: "identity.primaryKey",
        entries: { ...collection.records },
      },
      secondary: {},
    };

    collection.indexes.primary = {
      name: "primary",
      kind: "primary",
      field: "identity.primaryKey",
    };
  }

  ensureCollection(collection: Collection<TRecord>): void {
    if (!this.indexes[collection.name]) {
      this.initializeCollection(collection);
    }
  }

  dropCollection(collectionName: CollectionName): boolean {
    if (!this.indexes[collectionName]) {
      return false;
    }

    delete this.indexes[collectionName];
    return true;
  }

  indexRecord(collectionName: CollectionName, record: StoredRecord<TRecord>): void {
    const collectionIndexes = this.getCollectionIndexes(collectionName);
    collectionIndexes.primary.entries[record.identity.primaryKey] = record;
  }

  updateRecord(collectionName: CollectionName, record: StoredRecord<TRecord>): void {
    this.indexRecord(collectionName, record);
  }

  deleteRecord(collectionName: CollectionName, recordId: RecordId): boolean {
    const collectionIndexes = this.getCollectionIndexes(collectionName);

    if (!collectionIndexes.primary.entries[recordId]) {
      return false;
    }

    delete collectionIndexes.primary.entries[recordId];
    return true;
  }

  getByPrimaryKey(
    collectionName: CollectionName,
    recordId: RecordId
  ): StoredRecord<TRecord> | undefined {
    return this.indexes[collectionName]?.primary.entries[recordId];
  }

  hasPrimaryKey(collectionName: CollectionName, recordId: RecordId): boolean {
    return Boolean(this.getByPrimaryKey(collectionName, recordId));
  }

  private getCollectionIndexes(
    collectionName: CollectionName
  ): CollectionIndexes<TRecord> {
    const collectionIndexes = this.indexes[collectionName];

    if (!collectionIndexes) {
      throw new AetherCacheError(
        "COLLECTION_NOT_FOUND",
        `Indexes for collection '${collectionName}' do not exist`
      );
    }

    return collectionIndexes;
  }
}
