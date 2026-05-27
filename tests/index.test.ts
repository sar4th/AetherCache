import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  AetherCache,
  AetherCacheError,
  CollectionNotFoundError,
} from "../src";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

interface UserRecord {
  name: string;
  age: number;
  email: string;
}

async function runTests(): Promise<void> {
  const storageDir = await mkdtemp(path.join(os.tmpdir(), "aether-cache-"));

  try {
    const db = new AetherCache<UserRecord>({
      persist: true,
      storageDir,
    });
    await db.initialize();

    await db.createCollection("users", {
      age: "number",
      name: "string",
      email: "string",
    });

    const firstId = await db.insert("users", {
      name: "Alice",
      age: 35,
      email: "alice@mail.com",
    });
    const secondId = await db.insert("users", {
      name: "Bob",
      age: 30,
      email: "bob@mail.com",
    });
    const explicitId = await db.insert(
      "users",
      {
        name: "Chris",
        age: 42,
        email: "chris@mail.com",
      },
      "user-primary-key"
    );

    assert(Boolean(firstId), "Expected first insert to return a record id");
    assert(Boolean(secondId), "Expected second insert to return a record id");
    assert(firstId !== secondId, "Expected generated IDs to be unique");
    assert(explicitId === "user-primary-key", "Expected explicit IDs to work");

    const duplicate = await db.insert(
      "users",
      {
        name: "Duplicate",
        age: 50,
        email: "duplicate@mail.com",
      },
      "user-primary-key"
    );
    assert(duplicate === false, "Expected duplicate IDs to return false");

    assert(
      db.getCollection("users").metadata.recordCount === 3,
      "Expected metadata to track record count"
    );
    assert(
      db.get("users", firstId as string)?.data.name === "Alice",
      "Expected primary-key lookup to return inserted records"
    );
    assert(
      db.get("users", "user-primary-key")?.identity.primaryKey ===
        "user-primary-key",
      "Expected records to expose identity"
    );

    const updated = await db.update("users", "user-primary-key", {
      name: "Chris",
      age: 43,
      email: "chris@mail.com",
    });
    assert(updated, "Expected update to succeed");
    assert(
      db.get("users", "user-primary-key")?.data.age === 43,
      "Expected index lookup to reflect updates"
    );

    const deleted = await db.delete("users", secondId as string);
    assert(deleted, "Expected delete to succeed");
    assert(
      db.get("users", secondId as string) === undefined,
      "Expected primary-key index to sync on delete"
    );
    assert(
      db.filter("users", (record) => record.age > 30).length === 2,
      "Expected collection-scoped filtering"
    );

    const restored = new AetherCache<UserRecord>({
      persist: true,
      storageDir,
    });
    await restored.initialize();
    assert(
      restored.get("users", "user-primary-key")?.data.name === "Chris",
      "Expected persisted data to reload"
    );

    const benchmarkDb = new AetherCache<{ value: number; label: string }>();
    await benchmarkDb.createCollection("benchmark", {
      value: "number",
      label: "string",
    });

    const benchmarkIds: string[] = [];
    const benchmarkSize = 1000;
    const insertStart = Date.now();

    for (let index = 0; index < benchmarkSize; index += 1) {
      const id = await benchmarkDb.insert("benchmark", {
        value: index,
        label: `record-${index}`,
      });

      if (id) {
        benchmarkIds.push(id);
      }
    }

    const insertDuration = Date.now() - insertStart;
    const lookupStart = Date.now();

    benchmarkIds.forEach((id) => {
      assert(
        Boolean(benchmarkDb.get("benchmark", id)),
        "Expected benchmark lookup to find record"
      );
    });

    const lookupDuration = Date.now() - lookupStart;
    console.log(
      `Benchmark: inserted ${benchmarkSize} records in ${insertDuration}ms`
    );
    console.log(
      `Benchmark: primary-key lookups for ${benchmarkSize} records in ${lookupDuration}ms`
    );

    const removed = await db.deleteCollection("users");
    assert(removed, "Expected collection deletion to succeed");

    try {
      db.getCollection("users");
      throw new Error("Expected missing collection to throw");
    } catch (error) {
      assert(
        error instanceof CollectionNotFoundError ||
          (error instanceof AetherCacheError &&
            error.code === "COLLECTION_NOT_FOUND"),
        "Expected typed collection-not-found error"
      );
    }
  } finally {
    await rm(storageDir, { force: true, recursive: true });
  }

  console.log("All tests passed");
}

runTests();
