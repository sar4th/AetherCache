#!/usr/bin/env node
import { Command } from "commander";
import { AetherCache, CollectionExistsError } from "../../index";

const db = new AetherCache({ persist: true });

export const createNewSchema = new Command()
  .command("schema")
  .argument("<schema>", "collection schema name")
  .argument("<...values>", "values")
  .description("create or update collection schema")
  .action(async (schema, values) => {
    await db.initialize();

    try {
      await db.createCollection(schema, JSON.parse(values.join(" ")));
      console.log(`Collection '${schema}' created`);
    } catch (error) {
      if (error instanceof CollectionExistsError) {
        console.log(`Collection '${schema}' already exists`);
        return;
      }

      throw error;
    }
  });
