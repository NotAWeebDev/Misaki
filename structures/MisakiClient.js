const { Client, Collection, MessageEmbed } = require("discord.js");
const CommandStore = require(`${process.cwd()}/structures/CommandStore.js`);
const EventStore = require(`${process.cwd()}/structures/EventStore.js`);
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

    this.commands = new CommandStore(this);
    this.events = new EventStore(this);
    this.upvoters = [];
    this.ratelimits = new Collection();
    this.methods = {
      Embed: MessageEmbed,
      util: require(`${process.cwd()}/util/util.js`)
    };

    // Enmap
    this.settings = new Enmap({ provider: new EnmapLevel({ name: "settings" }) });
    this.reminders = new Enmap({ provider: new EnmapLevel({ name: "reminders" }) });
    this.points = new Enmap({ provider: new EnmapLevel({ name: "points" }) });
    this.store = new Enmap({ provider: new EnmapLevel({ name: "shop" }) });
    this.inventory = new Enmap({ provider: new EnmapLevel({ name: "inventory" }) });

    this.ready = false;

    this.on("ready", this._ready.bind(this));
  }

  async login(token) {
    await this.init();
    return super.login(token);
  }
  _ready() {
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

  async loadCommand(commandPath, commandName) {
    try {
      const command = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      command.location = commandPath;
      if (command.init) await command.init();
      this.commands.set(command);
    } catch (e) {
      this.logger.error(`Unable to load command ${commandName}: ${e}`);
    }
  }

  async unloadCommand(commandPath, commandName) {
    const command = this.commands.get(commandName);
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
    if (command.shutdown) await command.shutdown();
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
  }

  getSettings(id) {
    const defaults = this.settings.get("default") || this.config.defaultSettings;
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

  init() {
    klaw("./commands").on("data", async (item) => {
      const cmdFile = path.parse(item.path);
      if (!cmdFile.ext || cmdFile.ext !== ".js") return;
      await this.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    }).on("end", () => {
      this.logger.log(`Loaded a total of ${this.commands.size} commands.`);
    }).on("error", (error) => this.logger.error(error));

    klaw("./events").on("data", (item) => {
      const eventFile = path.parse(item.path);
      if (!eventFile.ext || eventFile.ext !== ".js") return;
      const event = new (require(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`))(this, eventFile.name);
      this.events.set(event);
      delete require.cache[require.resolve(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`)];
    }).on("end", () => {
      this.logger.log(`Loaded a total of ${this.events.size} events.`);
    }).on("error", (error) => this.logger.error(error));

    this.levelCache = {};
    for (let i = 0; i < this.config.permLevels.length; i++) {
      const thisLevel = this.config.permLevels[i];
      this.levelCache[thisLevel.name] = thisLevel.level;
    }
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

  async ratelimit(message, level, cmd) {
    if (level > 2) return false;

    cmd.cooldown *= 1000;
    const ratelimits = this.ratelimits.get(message.author.id) || {}; // get the ENMAP first.
    if (!ratelimits[cmd.name]) ratelimits[cmd.name] = Date.now() - cmd.cooldown; // see if the command has been run before if not, add the ratelimit
    const differnce = Date.now() - ratelimits[cmd.name]; // easier to see the difference
    if (differnce < cmd.cooldown) { // check the if the duration the command was run, is more than the cooldown
      return moment.duration(cmd.cooldown - differnce).format("D [days], H [hours], m [minutes], s [seconds]", 1); // returns a string to send to a channel
    } else {
      ratelimits[cmd.name] = Date.now(); // set the key to now, to mark the start of the cooldown
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
