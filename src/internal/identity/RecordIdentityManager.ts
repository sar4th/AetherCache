import { Collection, RecordData, RecordId, StoredRecord } from "../../types";
import { DuplicateRecordIdError } from "../../errors";

export class RecordIdentityManager {
  createRecord<TRecord extends RecordData>(
    collection: Collection<TRecord>,
    data: TRecord,
    requestedId?: RecordId
  ): StoredRecord<TRecord> {
    const id = requestedId ?? this.generateId();

    if (collection.records[id]) {
      throw new DuplicateRecordIdError(id);
    }

    return {
      id,
      identity: {
        primaryKey: id,
      },
      data,
    };
  }

  normalizeRecord<TRecord extends RecordData>(
    id: RecordId,
    record: StoredRecord<TRecord> | TRecord
  ): StoredRecord<TRecord> {
    if (this.isStoredRecord(record)) {
      const primaryKey = record.identity?.primaryKey ?? record.id ?? id;

      return {
        ...record,
        id: record.id ?? id,
        identity: {
          primaryKey,
        },
      };
    }

    return {
      id,
      identity: {
        primaryKey: id,
      },
      data: record,
    };
  }

  private generateId(): RecordId {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 12)}`;
  }

  private isStoredRecord<TRecord extends RecordData>(
    record: StoredRecord<TRecord> | TRecord
  ): record is StoredRecord<TRecord> {
    return (
      record !== null &&
      typeof record === "object" &&
      "id" in record &&
      "data" in record
    );
  }
}
