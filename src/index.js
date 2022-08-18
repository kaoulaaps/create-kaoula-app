#!/usr/bin/env node

/*
Copyright (c) 2022, Kaoula Aps
This file is a part of the Kaoula project.
*/

"use strict";

import chalk from "chalk";
import fs from "fs";
import fsX from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import inquirer from "inquirer";
import figlet from "figlet";

// Figlet
console.log(
  figlet.textSync("Kaoula", {
    horizontalLayout: "default",
    verticalLayout: "default",
  })
);

console.log(chalk.blue("\nWelcome to Kaoula CLI, lets get you started!\n"));

const questions = [
  {
    type: "input",
    name: "name",
    message: "🤠 What is the name of the project?",
    default: "kaoula-project",
  },

  {
    type: "input",
    name: "dir",
    message: "📁 Where do you want to create the project?",
    default: "./",
    validate: function (value) {
      if (!fs.existsSync(value)) {
        return true;
      } else {
        return "📁 " + value + " already exists";
      }
    },
  },

  {
    type: "list",
    name: "template",
    message: "📁 Which template do you want to use?",
    default: "kaoula-fly",
    choices: ["kaoula-fly", "kaoula"],
  },

  {
    type: "list",
    name: "pkgManager",
    message: "📦 Which package manager do you want to use?",
    default: "npm",
    choices: ["npm", "yarn", "pnpm"],
  },

  {
    type: "confirm",
    name: "install",
    message: "📦 Do you want to install dependencies?",
    default: true,
  },

  // Env file
];

let time = Date.now();

inquirer.prompt(questions).then((answers) => {
  console.log();

  if (answers.name) {
    answers.name = answers.name.replace(/ /g, "-");
    console.log(
      chalk.cyanBright(
        `Creating project with name: ${chalk.gray(answers.name)}`
      )
    );
  }

  // Create project
  fsX.mkdirpSync(answers.dir);

  if (answers.template === "kaoula-fly") {
    fsX.copySync(path.join("./templates/kaoula-fly"), path.join(answers.dir));
  } else if (answers.template === "kaoula") {
    fsX.copySync(path.join("./templates/kaoula"), path.join(answers.dir));
  } else {
    console.log(chalk.red("💥 Template not found"));
  }

  // Change directory

  process.chdir(path.join(answers.dir));

  console.log(chalk.cyanBright("📁 Changed directory to: " + answers.dir));
  if (answers.install == true) {
    console.log(chalk.cyanBright("📦 Installing dependencies"));
    if (answers.pkgManager === "npm") {
      execSync("npm install", { stdio: "inherit" });
    } else if (answers.pkgManager === "yarn") {
      execSync("yarn install", { stdio: "inherit" });
    } else if (answers.pkgManager === "pnpm") {
      execSync("pnpm install", { stdio: "inherit" });
    } else {
      console.log(chalk.red("💥 Package manager not found"));
    }
  } else {
    console.log(chalk.cyanBright("📦 Skipping dependencies installation"));
  }

  console.log(
    chalk.cyanBright("📦 Project created in " + (Date.now() - time) + "ms")
  );
});
