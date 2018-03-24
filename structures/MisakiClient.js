const { Client, Collection, MessageEmbed, MessageAttachment } = require("discord.js");
const CommandStore = require("./CommandStore.js");
const EventStore = require("./EventStore.js");
const MisakiConsole = require("./MisakiConsole");
/* const Enmap = require("enmap");
const EnmapLevel = require("enmap-level"); */
const idioticApi = require("idiotic-api");
const Database = require("./Database");

class MisakiClient extends Client {
  constructor(options) {
    super(options);

    this.config = require("../config.js");
    this.console = new MisakiConsole(this);
    this.responses = require("../assets/responses.js");
    this.idiotAPI = new idioticApi.Client(process.env.IDIOTAPI, { dev: true });
    this.commands = new CommandStore(this);
    this.events = new EventStore(this);
    this.upvoters = [];
    this.levelCache = {};
    this.database = new Database(this);
    this.methods = {
      Embed: MessageEmbed,
      Attachment: MessageAttachment,
      Collection,
      util: require("../util/util.js"),
      errors: require("../util/CustomError")
    };

    /*     // Enmap
    this.settings = new Enmap({ provider: new EnmapLevel({ name: "settings" }) });
    this.reminders = new Enmap({ provider: new EnmapLevel({ name: "reminders" }) });
    this.points = new Enmap({ provider: new EnmapLevel({ name: "points" }) });
    this.store = new Enmap({ provider: new EnmapLevel({ name: "shop" }) });
    this.inventory = new Enmap({ provider: new EnmapLevel({ name: "inventory" }) }); */

    this.settings = this.database.settings;
    this.reminders = this.database.reminders;
    this.points = this.database.points;
    this.store = this.database.store;
    this.inventory = this.database.inventory;

    this.ready = false;
    this.on("ready", this._ready.bind(this));
  }

  async login(token) {
    await this.init();
    return super.login(token);
  }

  _ready() {
    this.database._ready();
    this.ready = true;
    this.emit("misakiReady");
  }

  permlevel(message) {
    let permlvl = 0;

    const permOrder = this.config.permLevels.slice(0).sort((prev, val) => prev.level < val.level ? 1 : -1);

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

  getSettings(id) {
    return this.settings.findOrCreate({ where: { id } });
  }

  writeSettings(id, newSettings) {
    const defaults = this.settings.get("default") || this.config.defaultSettings;
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
    const [commands, events] = await Promise.all([this.commands.loadFiles(), this.events.loadFiles()]);
    this.console.log(`Loaded a total of ${commands} commands`);
    this.console.log(`Loaded a total of ${events} events`);

    for (let i = 0; i < this.config.permLevels.length; i++) {
      const thisLevel = this.config.permLevels[i];
      this.levelCache[thisLevel.name] = thisLevel.level;
    }
  }
}

module.exports = MisakiClient;
