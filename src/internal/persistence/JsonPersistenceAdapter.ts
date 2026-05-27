import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { DatabaseStore, RecordData, SchemaRegistration } from "../../types";
import { PersistenceError } from "../../errors";
import { getDefaultStorageDir } from "../platform/storagePath";

export interface PersistenceSnapshot<TRecord extends RecordData = RecordData> {
  data?: DatabaseStore<TRecord>;
  schemas?: SchemaRegistration[];
}

export class JsonPersistenceAdapter<TRecord extends RecordData = RecordData> {
  private readonly storageDir: string;
  private readonly dataFileName = "dataStore.json";
  private readonly schemaFileName = "schemaStore.json";

  constructor(storageDir: string = getDefaultStorageDir()) {
    this.storageDir = storageDir;
  }

  async load(): Promise<PersistenceSnapshot<TRecord>> {
    const [data, schemas] = await Promise.all([
      this.readJson<DatabaseStore<TRecord>>(this.dataPath),
      this.readJson<SchemaRegistration[]>(this.schemaPath),
    ]);

    return {
      data,
      schemas,
    };
  }

  async saveData(data: DatabaseStore<TRecord>): Promise<void> {
    await this.writeJsonAtomic(this.dataPath, data);
  }

  async saveSchemas(schemas: SchemaRegistration[]): Promise<void> {
    await this.writeJsonAtomic(this.schemaPath, schemas);
  }

  async save(snapshot: PersistenceSnapshot<TRecord>): Promise<void> {
    const writes: Promise<void>[] = [];

    if (snapshot.data) {
      writes.push(this.saveData(snapshot.data));
    }

    if (snapshot.schemas) {
      writes.push(this.saveSchemas(snapshot.schemas));
    }

    await Promise.all(writes);
  }

  private get dataPath(): string {
    return path.join(this.storageDir, this.dataFileName);
  }

  private get schemaPath(): string {
    return path.join(this.storageDir, this.schemaFileName);
  }

  private async readJson<TValue>(filePath: string): Promise<TValue | undefined> {
    try {
      const raw = await readFile(filePath, "utf8");

      if (!raw.trim()) {
        return undefined;
      }

      return JSON.parse(raw) as TValue;
    } catch (error) {
      if (isNodeError(error) && error.code === "ENOENT") {
        return undefined;
      }

      throw new PersistenceError(
        `Failed to read '${filePath}': ${formatError(error)}`
      );
    }
  }

  private async writeJsonAtomic(filePath: string, value: unknown): Promise<void> {
    try {
      await mkdir(path.dirname(filePath), { recursive: true });
      const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
      const json = `${JSON.stringify(value, null, 2)}\n`;

      await writeFile(tempPath, json, "utf8");
      await rename(tempPath, filePath);
    } catch (error) {
      throw new PersistenceError(
        `Failed to write '${filePath}': ${formatError(error)}`
      );
    }
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
