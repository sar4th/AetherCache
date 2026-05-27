# AetherCache

AetherCache is a lightweight embedded TypeScript database for learning and building
single-process storage engines. It supports collection-based records, schema
validation, primary-key indexing, and optional JSON persistence.

## Install

```sh
npm install aether-cache
```

## Quick Start

```ts
import { AetherCache } from "aether-cache";

interface User {
  name: string;
  age: number;
  email: string;
}

const db = new AetherCache<User>();

await db.createCollection("users", {
  name: "string",
  age: "number",
  email: "string",
});

const id = await db.insert("users", {
  name: "Ada Lovelace",
  age: 36,
  email: "ada@example.com",
});

const user = db.get("users", id as string);
console.log(user?.data);
```

## Persistence

Persistence is opt-in. When enabled, AetherCache writes JSON files using an
atomic temp-file-and-rename strategy.

```ts
const db = new AetherCache<User>({
  persist: true,
  storageDir: "./.aether-cache",
});

await db.initialize();
```

## Public API

### `new AetherCache<TRecord>(options?)`

Creates an embedded database instance.

Options:

- `persist`: enables JSON persistence when `true`.
- `storageDir`: overrides the default OS-specific storage directory.

### `createCollection(name, schema, metadata?)`

Creates a collection and associates a schema with it.

### `deleteCollection(name)`

Deletes a collection, its records, and its live indexes.

### `getCollection(name)`

Returns collection metadata, schema, records, and index metadata.

### `insert(collection, value, id?)`

Validates and inserts a record. Returns the primary key, or `false` when the
requested ID already exists.

### `get(collection, id)`

Reads a record by primary key through the collection primary-key index.

### `update(collection, id, value)`

Validates and replaces record data while preserving record identity.

### `delete(collection, id)`

Deletes a record from storage and synchronizes the primary-key index.

### `filter(collection, predicate)`

Filters records inside a single collection.

## Features

- Collection/table-oriented storage model
- Collection-owned schemas
- Unique record identity with generated or explicit primary keys
- Hash-based primary-key indexing
- Optional JSON persistence
- Typed custom errors
- TypeScript declaration output
- Embedded single-process architecture

## Package Notes

The public package entry point is `src/index.ts`, compiled to `dist/index.js`.
Only stable APIs, errors, and public types are exported. Implementation managers
live under `src/internal` and are not part of the public contract.

## Versioning Recommendation

Use `0.x` versions while the educational API is still evolving. Move to `1.0.0`
after collection, CRUD, persistence, and query APIs are stable.

## License

MIT
