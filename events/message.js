const Event = require("../structures/Event.js");
const monitor = require("../monitors/monitor.js");
const Social = require("../structures/Social.js");
const { Permissions, Collection } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = class extends Event {

  constructor(...args) {
    super(...args);

    this.impliedPermissions = new Permissions([
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "SEND_TTS_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
      "READ_MESSAGE_HISTORY",
      "MENTION_EVERYONE",
      "USE_EXTERNAL_EMOJIS",
      "ADD_REACTIONS"
    ]);
    this.friendlyPerms = Object.keys(Permissions.FLAGS).reduce((obj, key) => {
      obj[key] = key.split("_").join(" ").toProperCase();
      return obj;
    }, {});

    this.ratelimits = new Collection();
  }

  async run(message) {
    if (message.author.bot) return;
    if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user);
    if (message.guild && !message.channel.postable) return;
    message.settings = await this.client.getSettings(message.guild.id);
    if (message.content === this.client.user.toString() || (message.guild && message.content === message.guild.me.toString())) {
      return message.channel.send(`The prefix is \`${message.settings.prefix}\`.`);
    }
    const level = this.client.permlevel(message);
    const userPermLevel = this.client.config.permLevels.find(perm => perm.level === level);
    message.author.permLevel = level;

    if (message.settings.socialSystem === "true") monitor.run(this.client, message, level);

    const prefix = new RegExp(`^<@!?${this.client.user.id}> |^${this.client.methods.util.regExpEsc(message.settings.prefix)}`).exec(message.content);
    if (!prefix) return;
    const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
    const cmd = this.client.commands.get(args.shift().toLowerCase());
    if (!cmd) return;
    const rateLimit = this.ratelimit(message, cmd);

    if (typeof rateLimit === "string") {
      this.client.console.log(`\u001b[43;30m[${userPermLevel.name}]\u001b[49;39m \u001b[44m${message.author.username} (${message.author.id})\u001b[49m got ratelimited while running command ${cmd.name}`);
      return message.channel.send(`Please wait ${rateLimit.toPlural()} to run this command.`); // return stop command from executing
    }

    if (cmd.guildOnly && !message.guild) return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    if (level < this.client.levelCache[cmd.permLevel]) {
      if (message.settings.systemNotice !== "true") return;
      return message.channel.send(`B-Baka! You're only level ${level}, a ${userPermLevel.name.toLowerCase()}, why should I listen to you instead of a ${cmd.permLevel} (level ${this.client.levelCache[cmd.permLevel]}).`);
    }

    while (args[0] && args[0][0] === "-") message.flags.push(args.shift().slice(1));
    await this.runCommand(message, cmd, args);
  }

  botPerms(message, cmd) {
    const missing = message.channel.type === "text" ? message.channel.permissionsFor(this.client.user).missing(cmd.botPerms) : this.impliedPermissions.missing(cmd.botPerms);
    if (missing.length > 0) {
      message.channel.send(`The bot does not have the following permissions \`${missing.map(key => this.friendlyPerms[key]).join(", ")}\``);
      return false;
    }
    return true;
  }

  async runCommand(message, cmd, args) {
    try {
      const hasPerm = this.botPerms(message, cmd);
      if (!hasPerm) return;
      let msg;
      if (cmd instanceof Social) {
        if (cmd.loadingString) msg = await message.channel.send(cmd.loadingString.replaceAll("{{displayName}}", message.member.displayName).replaceAll("{{me}}", message.guild.me.displayName).replaceAll("{{filterName}}", message.flags[0]));
        await cmd.cmdVerify(message, args, msg);
        if (message.settings.socialSystem === "true") await cmd.cmdPay(message, message.author.id, cmd.cost, { msg });
      }
      const userPermLevel = this.client.config.permLevels.find(perm => perm.level === message.author.permLevel);
      this.client.console.log(`\u001b[43;30m[${userPermLevel.name}]\u001b[49;39m \u001b[44m${message.author.username} (${message.author.id})\u001b[49m ran command ${cmd.name}`);
      await cmd.run(message, args, message.author.permLevel, msg);
    } catch (error) {
      this.client.emit("commandError", error, message);
    }
  }

  ratelimit(message, cmd) {
    if (message.author.permLevel > 4) return false;

    const cooldown = cmd.cooldown * 1000;
    const ratelimits = this.ratelimits.get(message.author.id) || {}; // get the ENMAP first.
    if (!ratelimits[cmd.name]) ratelimits[cmd.name] = Date.now() - cooldown; // see if the command has been run before if not, add the ratelimit
    const difference = Date.now() - ratelimits[cmd.name]; // easier to see the difference
    if (difference < cooldown) { // check the if the duration the command was run, is more than the cooldown
      return moment.duration(cooldown - difference).format("D [days], H [hours], m [minutes], s [seconds]", 1); // returns a string to send to a channel
    } else {
      ratelimits[cmd.name] = Date.now(); // set the key to now, to mark the start of the cooldown
      this.ratelimits.set(message.author.id, ratelimits); // set it
      return true;
    }
  }

};