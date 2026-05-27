export { AetherCache, microDB } from "./database";
export {
  AetherCacheError,
  CollectionExistsError,
  CollectionNotFoundError,
  DuplicateRecordIdError,
  PersistenceError,
  RecordNotFoundError,
  SchemaNotFoundError,
  ValidationError,
} from "./errors";
export type {
  AetherCacheOptions,
  Collection,
  CollectionMetadata,
  CollectionName,
  DatabaseStore,
  FilterPredicate,
  IndexKind,
  IndexMetadata,
  PrimitiveSchemaType,
  RecordData,
  RecordId,
  RecordIdentity,
  SchemaDefinition,
  SchemaRegistration,
  StoredRecord,
} from "./types";
