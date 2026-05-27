export type AetherCacheErrorCode =
  | "COLLECTION_EXISTS"
  | "COLLECTION_NOT_FOUND"
  | "DUPLICATE_RECORD_ID"
  | "RECORD_NOT_FOUND"
  | "SCHEMA_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "PERSISTENCE_ERROR";

export class AetherCacheError extends Error {
  readonly code: AetherCacheErrorCode;

  constructor(code: AetherCacheErrorCode, message: string) {
    super(message);
    this.name = "AetherCacheError";
    this.code = code;
  }
}

export class CollectionExistsError extends AetherCacheError {
  constructor(collectionName: string) {
    super("COLLECTION_EXISTS", `Collection '${collectionName}' already exists`);
  }
}

export class CollectionNotFoundError extends AetherCacheError {
  constructor(collectionName: string) {
    super("COLLECTION_NOT_FOUND", `Collection '${collectionName}' does not exist`);
  }
}

export class DuplicateRecordIdError extends AetherCacheError {
  constructor(recordId: string) {
    super("DUPLICATE_RECORD_ID", `Record '${recordId}' already exists`);
  }
}

export class RecordNotFoundError extends AetherCacheError {
  constructor(recordId: string) {
    super("RECORD_NOT_FOUND", `Record '${recordId}' does not exist`);
  }
}

export class SchemaNotFoundError extends AetherCacheError {
  constructor(collectionName: string) {
    super(
      "SCHEMA_NOT_FOUND",
      `Schema for collection '${collectionName}' does not exist`
    );
  }
}

export class ValidationError extends AetherCacheError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message);
  }
}

export class PersistenceError extends AetherCacheError {
  constructor(message: string) {
    super("PERSISTENCE_ERROR", message);
  }
}
