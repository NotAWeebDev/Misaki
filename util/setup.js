const inquirer = require("inquirer");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const fs = require("fs");

let baseConfig = fs.readFileSync("./util/setup_base.txt", "utf8");

const defaultSettings = `{
  "prefix": "ok!",
  "modRole": "Moderator",
  "adminRole": "Administrator",
  "systemNotice": "true",
  "welcomeEnabled": "false",
  "welcomeChannel": "welcome",
  "scoreTime": "5",
  "dailyTime": "24",
  "pointsReward": "250",
  "minPoints": "1",
  "maxPoints": "50",
  "costMulti": "10"
}`;

const settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

let prompts = [
  {
    type: "list", 
    name: "resetDefaults", 
    message: "Do you want to reset default settings?", 
    choices: ["Yes", "No"]
  },
  {
    type: "input",
    name: "token",
    message: "Please enter the bot token from the application page."
  }
];

(async function() {
  console.log("Setting Up Misaki Configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log("First Start! Inserting default guild settings in the database...");
    await settings.setAsync("default", defaultSettings);
  }

  const answers = await inquirer.prompt(prompts);

  if (answers.resetDefaults && answers.resetDefaults === "Yes") {
    console.log("Resetting default guild settings...");
    await settings.setAsync("default", defaultSettings);
  }

  baseConfig = baseConfig.replace("{{token}}", `"${answers.token}"`);
  
  fs.writeFileSync("./config.js", baseConfig);
  console.log("REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!");
  console.log("Configuration has been written, enjoy!");
  await settings.close();
}());