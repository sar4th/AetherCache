#!/usr/bin/env node
import { Command } from "commander";
import { microDB } from "../../core/microDB";
const db = new microDB();
export const createNewSchema = new Command()
  .command("schema")
  .argument("<schema>", "db schema name")
  .argument("<...values>", "values")
  .description("create new schema")
  .action(async (schema, values) => {
    let s = db.schemaManager.registerSchema(schema, JSON.parse(values));
  });
