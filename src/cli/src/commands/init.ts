#!/usr/bin/env node
import { program } from "commander";
import { microDB } from "../../../core/microDB";
//list command
program
  .command("instantiate")
  .alias("init")
  .description("Instantiate database")
  .action(async () => {
    const db = new microDB();
    await db.initialize();
  });

program.parse(process.argv);
