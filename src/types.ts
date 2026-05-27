export type PrimitiveSchemaType = "string" | "number" | "boolean" | "object";
export type SchemaDefinition = Record<string, PrimitiveSchemaType>;
export type RecordId = string;
export type CollectionName = string;

export interface AetherCacheOptions {
  persist?: boolean;
  storageDir?: string;
}

export interface RecordIdentity {
  primaryKey: RecordId;
}

export type RecordData = object;

export interface StoredRecord<TRecord extends RecordData = RecordData> {
  id: RecordId;
  identity: RecordIdentity;
  data: TRecord;
}

export type IndexKind = "primary" | "secondary";

export interface IndexMetadata {
  name: string;
  kind: IndexKind;
  field: string;
}

export interface PrimaryKeyIndex<TRecord extends RecordData = RecordData> {
  name: string;
  kind: "primary";
  field: "identity.primaryKey";
  entries: Record<RecordId, StoredRecord<TRecord>>;
}

export interface CollectionIndexes<TRecord extends RecordData = RecordData> {
  primary: PrimaryKeyIndex<TRecord>;
  secondary: Record<string, unknown>;
}

export interface CollectionMetadata {
  createdAt: string;
  updatedAt: string;
  recordCount: number;
  [key: string]: unknown;
}

export interface Collection<TRecord extends RecordData = RecordData> {
  name: CollectionName;
  schema: SchemaDefinition;
  metadata: CollectionMetadata;
  records: Record<RecordId, StoredRecord<TRecord>>;
  indexes: Record<string, IndexMetadata>;
}

export interface DatabaseStore<TRecord extends RecordData = RecordData> {
  collections: Record<CollectionName, Collection<TRecord>>;
}

export interface SchemaRegistration {
  name: CollectionName;
  schema: SchemaDefinition;
}

export type FilterPredicate<TRecord extends RecordData> = (
  record: TRecord & { id: RecordId }
) => boolean;
