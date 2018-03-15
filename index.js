require("dotenv").load();
require(`${process.cwd()}/extenders/Guild.js`);
require(`${process.cwd()}/modules/Prototypes.js`);
if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const { Client, Collection } = require("discord.js");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const klaw = require("klaw");
const path = require("path");
const Idiot = require("idiotic-api");
const BotStatsHandler = require(`${process.cwd()}/util/botStatsHandler`); 

class Misaki extends Client {
  constructor(options) {
    super(options);
    this.config = require(`${process.cwd()}/config.js`);
    this.logger = require(`${process.cwd()}/util/Logger`);
    this.responses = require(`${process.cwd()}/assets/responses.js`);
    this.idiotAPI = new Idiot.Client(process.env.IDIOTAPI, { dev: true });
    this.botStatsHandler = new BotStatsHandler(this);

    this.aliases = new Collection();
    this.commands = new Collection();
    this.upvoters = [];
    this.ratelimits = new Collection();

    this.settings = new Enmap({ provider: new EnmapLevel({ name: "settings" }) });
    
    this.reminders = new Enmap({provider: new EnmapLevel({ name: "reminders" }) });

    this.points = new Enmap({provider: new EnmapLevel({ name: "points" }) });
    this.store = new Enmap({provider: new EnmapLevel({ name: "shop" }) });
    this.inventory = new Enmap({provider: new EnmapLevel({ name: "inventory" }) });
  }

  permlevel(message) {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(client);
      // client.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }

  getSettings(id) {
    const defaults = client.settings.get("default");
    let guild = client.settings.get(id);
    if (typeof guild != "object") guild = {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guild[key] ? guild[key] : defaults[key];
    });
    return returnObject;
  }

  writeSettings(id, newSettings) {
    const defaults = client.settings.get("default");
    let settings = client.settings.get(id);
    if (typeof settings != "object") settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key]) {
        settings[key] = newSettings[key];
      } else {
        delete settings[key];
      }
    }
    client.settings.set(id, settings);
  }
}

const client = new Misaki({
  fetchAllMembers: false,
  disableEveryone: true,
  disabledEvents:["CHANNEL_PINS_UPDATE", "GUILD_BAN_ADD", "GUILD_BAN_REMOVE", "GUILD_SYNC", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE", "TYPING_START", "USER_NOTE_UPDATE", "USER_SETTINGS_UPDATE", "VOICE_SERVER_UPDATE", "VOICE_STATE_UPDATE"],
  messageCacheSize: 100,
  messageCacheLifetime: 300,
  messageSweepInterval: 150
});

require(`${process.cwd()}/modules/functions.js`)(client);

const init = async () => {

  const commandList = [];
  klaw("./commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    commandList.push(cmdFile.name);
    if (response) client.logger.error(response);
  }).on("end", () => {
    client.logger.log(`Loaded a total of ${commandList.length} commands.`);
  }).on("error", (error) => client.logger.error(error));
  
  const extendList = [];
  klaw("./extenders").on("data", (item) => {
    const extFile = path.parse(item.path);
    if (!extFile.ext || extFile.ext !== ".js") return;
    try {
      require(`${extFile.dir}${path.sep}${extFile.base}`);
      extendList.push(extFile.name);
    } catch (error) {
      client.logger.error(`Error loading ${extFile.name} extension: ${error}`);
    }
  }).on("end", () => {
    client.logger.log(`Loaded a total of ${extendList.length} extensions.`);
  }).on("error", (error) => client.logger.error(error));
  
  const eventList = [];
  klaw("./events").on("data", (item) => {  
    const eventFile = path.parse(item.path);
    if (!eventFile.ext || eventFile.ext !== ".js") return;
    const eventName = eventFile.name.split(".")[0];
    try {
      const event = new (require(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`))(client);    
      eventList.push(event);      
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`)];
    } catch (error) {
      client.logger.error(`Error loading event ${eventFile.name}: ${error}`);
    }
  }).on("end", () => {
    client.logger.log(`Loaded a total of ${eventList.length} events.`);
  }).on("error", (error) => client.logger.error(error));

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(process.env.DISCORD);
};

init();

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnect", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));
