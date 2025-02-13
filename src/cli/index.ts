#!/usr/bin/env node

import { program } from "commander";
import { instantiateCommand } from "./commands/init";
import { createNewSchema } from "./commands/new-schema";
import { insertData } from "./commands/insert";

program.addCommand(instantiateCommand);
program.addCommand(createNewSchema);
program.addCommand(insertData);

program.parse(process.argv);
