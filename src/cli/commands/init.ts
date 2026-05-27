#!/usr/bin/env node
import { Command } from "commander";
import { AetherCache } from "../../index";

export const instantiateCommand = new Command()
  .command("instantiate")
  .alias("init")
  .description("Instantiate database")
  .action(async () => {
    const db = new AetherCache({ persist: true });
    await db.initialize();
    await db.flush();
    console.log("AetherCache initialized");
  });
