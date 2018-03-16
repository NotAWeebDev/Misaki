const { Client, Collection, MessageEmbed, MessageAttachment } = require("discord.js");
const CommandStore = require("./CommandStore.js");
const EventStore = require("./EventStore.js");
const MisakiConsole = require("./MisakiConsole");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const idioticApi = require("idiotic-api");
const moment = require("moment");
require("moment-duration-format");

class MisakiClient extends Client {
  constructor(options) {
    super(options);

    this.config = require(`${process.cwd()}/config.js`);
    this.console = new MisakiConsole(this);
    this.responses = require(`${process.cwd()}/assets/responses.js`);
    this.idiotAPI = new idioticApi.Client(process.env.IDIOTAPI, { dev: true });

    this.commands = new CommandStore(this);
    this.events = new EventStore(this);
    this.upvoters = [];
    this.ratelimits = new Collection();
    this.methods = {
      Embed: MessageEmbed,
      Attachment: MessageAttachment,
      util: require(`${process.cwd()}/util/util.js`),
      errors: require(`${process.cwd()}/util/CustomError`)
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
    const defaults = this.settings.get("default") || this.config.defaultSettings;
    let guild = this.settings.get(id);
    if (typeof guild !== "object") guild = {};
    const returnObject = {};
    Object.keys(defaults).forEach(key => {
      returnObject[key] = guild[key] ? guild[key] : defaults[key];
    });
    return returnObject;
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
    const [commands, events] = await Promise.all([this.commands.loadAll(), this.events.loadAll()]);
    this.console.log(`Loaded a total of ${commands} commands`);
    this.console.log(`Loaded a total of ${events} events`);

    this.levelCache = {};
    for (let i = 0; i < this.config.permLevels.length; i++) {
      const thisLevel = this.config.permLevels[i];
      this.levelCache[thisLevel.name] = thisLevel.level;
    }
  }

  ratelimit(message, level, cmd) {
    if (level > 4) return false;

    const cooldown = cmd.cooldown * 1000;
    const ratelimits = this.ratelimits.get(message.author.id) || {}; // get the ENMAP first.
    if (!ratelimits[cmd.name]) ratelimits[cmd.name] = Date.now() - cooldown; // see if the command has been run before if not, add the ratelimit
    const differnce = Date.now() - ratelimits[cmd.name]; // easier to see the difference
    if (differnce < cooldown) { // check the if the duration the command was run, is more than the cooldown
      return moment.duration(cooldown - differnce).format("D [days], H [hours], m [minutes], s [seconds]", 1); // returns a string to send to a channel
    } else {
      ratelimits[cmd.name] = Date.now(); // set the key to now, to mark the start of the cooldown
      this.ratelimits.set(message.author.id, ratelimits); // set it
      return true;
    }
  }

}

module.exports = MisakiClient;
