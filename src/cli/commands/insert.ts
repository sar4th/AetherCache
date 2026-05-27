#!/usr/bin/env node
import { Command } from "commander";
import { AetherCache } from "../../index";

const db = new AetherCache({ persist: true });

export const insertData = new Command()
  .command("insert")
  .argument("<table name>", "table name")
  .argument("<...values>", "values")
  .description("insert data into database")
  .action(async (collection, values) => {
    await db.initialize();
    const id = await db.insert(collection, JSON.parse(values.join(" ")));
    console.log(id);
  });
