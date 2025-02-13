#!/usr/bin/env node
import { Command } from "commander";
import { microDB } from "../../core/microDB";

export const instantiateCommand = new Command()
  .command("instantiate")
  .alias("init")
  .description("Instantiate database")
  .action(async () => {
    const db = new microDB();
    await db.initialize();
  });
