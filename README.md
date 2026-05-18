# AetherCache

A custom in-memory database engine built in TypeScript to explore how modern databases handle storage, persistence, schema management, and query execution internally.

---

## Features

- In-memory data storage engine
- Persistent disk storage using a flag-based save/update strategy
- Schema isolation from record storage
- Query execution pipeline for insert, filter, and retrieval operations
- OS-aware file path resolution (Windows, macOS, Linux)
- Modular storage abstraction for future engine extensions

---

## Why I Built This

Most developers use databases every day without understanding what happens beneath the ORM layer.

I built AetherCache to deeply understand:

- How databases persist data to disk
- Storage engine design patterns
- Query execution flow
- Schema management
- Data serialization strategies
- Internal architecture tradeoffs

The goal was not to replicate PostgreSQL or Redis, but to learn core database engineering concepts by building them from scratch.

---

## Tech Stack

- TypeScript
- Node.js

---

## Current Focus

The current implementation focuses on:

- Persistence
- Schema management
- Query execution

Planned improvements include:

- Indexing
- Transactions
- Concurrency handling
- Caching optimizations
- Query optimization

---

## Example Operations

```ts
db.insert("users", {
  id: 1,
  name: "Sarath"
})

db.find("users", {
  name: "Sarath"
})
