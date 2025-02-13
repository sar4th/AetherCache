#!/usr/bin/env node
import { Command } from "commander";
import { microDB } from "../../core/microDB";
const db = new microDB();
export const insertData = new Command()
  .command("insert")
  .argument("<table name>", "table name")
  .argument("<...values>", "values")
  .description("insert data into database")
  .action(async (schema, values) => {
    db.insert(schema, values);
  });
