const { Client, Collection } = require("discord.js");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const klaw = require("klaw");
const path = require("path");
const idioticApi = require("idiotic-api");
const moment = require("moment");
require("moment-duration-format");

class MisakiClient extends Client {
  constructor(options) {
    super(options);

    this.config = require(`${process.cwd()}/config.js`);
    this.logger = require(`${process.cwd()}/util/Logger`);
    this.responses = require(`${process.cwd()}/assets/responses.js`);
    this.idiotAPI = new idioticApi.Client(this.config.apiTokens.idiotToken, { dev: true });

    this.aliases = new Collection();
    this.commands = new Collection();
    this.upvoters = [];
    this.ratelimits = new Collection();

    this.settings = new Enmap({ provider: new EnmapLevel({ name: "settings" }) });

    this.reminders = new Enmap({ provider: new EnmapLevel({ name: "reminders" }) });

    this.points = new Enmap({ provider: new EnmapLevel({ name: "points" }) });
    this.store = new Enmap({ provider: new EnmapLevel({ name: "shop" }) });
    this.inventory = new Enmap({ provider: new EnmapLevel({ name: "inventory" }) });

    this.ready = false;

    this.on("ready", this._ready.bind(this));
  }

  async _ready() {
    await this.init();
    this.ready = true;
    this.emit("misakiReady");
  }

  permlevel(message) {
    let permlvl = 0;

    const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

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
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      // client.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
      props.conf.location = commandPath;
      if (props.init) props.init(this);

      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) await command.shutdown(this);

    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }

  getSettings(id) {
    const defaults = this.settings.get("default");
    let guild = this.settings.get(id);
    if (typeof guild !== "object") guild = {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guild[key] ? guild[key] : defaults[key];
    });
    return returnObject;
  }

  writeSettings(id, newSettings) {
    const defaults = this.settings.get("default");
    let settings = this.settings.get(id);
    if (typeof settings !== "object") settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key]) {
        settings[key] = newSettings[key];
      } else {
        delete settings[key];
      }
    }
    this.settings.set(id, settings);
  }

  async init() {
    const commandList = [];
    klaw("./commands").on("data", (item) => {
      const cmdFile = path.parse(item.path);
      if (!cmdFile.ext || cmdFile.ext !== ".js") return;
      const response = this.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
      commandList.push(cmdFile.name);
      if (response) this.logger.error(response);
    }).on("end", () => {
      this.logger.log(`Loaded a total of ${commandList.length} commands.`);
    }).on("error", (error) => this.logger.error(error));

    const extendList = [];
    klaw("./extenders").on("data", (item) => {
      const extFile = path.parse(item.path);
      if (!extFile.ext || extFile.ext !== ".js") return;
      try {
        require(`${extFile.dir}${path.sep}${extFile.base}`);
        extendList.push(extFile.name);
      } catch (error) {
        this.logger.error(`Error loading ${extFile.name} extension: ${error}`);
      }
    }).on("end", () => {
      this.logger.log(`Loaded a total of ${extendList.length} extensions.`);
    }).on("error", (error) => this.logger.error(error));

    const eventList = [];
    klaw("./events").on("data", (item) => {
      const eventFile = path.parse(item.path);
      if (!eventFile.ext || eventFile.ext !== ".js") return;
      const eventName = eventFile.name.split(".")[0];
      try {
        const event = new (require(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`))(this);
        eventList.push(event);
        this.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`)];
      } catch (error) {
        this.logger.error(`Error loading event ${eventFile.name}: ${error}`);
      }
    }).on("end", () => {
      this.logger.log(`Loaded a total of ${eventList.length} events.`);
    }).on("error", (error) => this.logger.error(error));

    this.levelCache = {};
    for (let i = 0; i < this.config.permLevels.length; i++) {
      const thisLevel = this.config.permLevels[i];
      this.levelCache[thisLevel.name] = thisLevel.level;
    }
  }

  randomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async awaitReply(message, question, filter, limit = 60000, embed) {
    await message.channel.send(question, embed);
    try {
      const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async ratelimit(message, level, key, duration) {
    if (level > 2) return false;

    duration *= 1000;
    const ratelimits = this.ratelimits.get(message.author.id) || {}; // get the ENMAP first.
    if (!ratelimits[key]) ratelimits[key] = Date.now() - duration; // see if the command has been run before if not, add the ratelimit
    const differnce = Date.now() - ratelimits[key]; // easier to see the difference
    if (differnce < duration) { // check the if the duration the command was run, is more than the cooldown
      return moment.duration(duration - differnce).format("D [days], H [hours], m [minutes], s [seconds]", 1); // returns a string to send to a channel
    } else {
      ratelimits[key] = Date.now(); // set the key to now, to mark the start of the cooldown
      this.ratelimits.set(message.author.id, ratelimits); // set it
      return true;
    }
  }

  arrDiff(a, b) {
    if (a === b) return [];

    for (const item of a) {
      const ind = b.indexOf(item);
      if (ind !== -1) b.splice(ind, 1);
    }

    return b;
  }

}

module.exports = MisakiClient;
