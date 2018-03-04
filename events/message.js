const monitor = require(`${process.cwd()}/monitors/monitor.js`);
const Social = require("../base/Social.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    if (message.guild && !message.guild.me) await message.guild.members.fetch(this.client.user);
    if (message.guild && !message.channel.postable) return;

    if (message.content === this.client.user.toString() || (message.guild && message.content === message.guild.me.toString())) {
      return message.channel.send(`The prefix is \`${message.settings.prefix}\`.`);
    }
    const level = this.client.permlevel(message);

    if (message.settings.socialSystem === "true") monitor.run(this.client, message, level);

    const prefix = new RegExp(`^<@!?${this.client.user.id}> |^${this.regExpEsc(message.settings.prefix)}`).exec(message.content);
    if (!prefix) return;
    const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
    const cmd = this.client.commands.get(args.shift().toLowerCase());
    if (!cmd) return;
    const rateLimit = await this.client.ratelimit(message, level, cmd);

    if (typeof rateLimit == "string") {
      this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) got ratelimited while running command ${cmd.help.name}`);
      return message.channel.send(`Please wait ${rateLimit.toPlural()} to run this command.`); //return stop command from executing
    }

    if (cmd.guildOnly && !message.guild) return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    if (level < this.client.levelCache[cmd.conf.permLevel]) {
      if (message.settings.systemNotice === "true") {
        return message.channel.send(`B-Baka! You're only level ${level}, a ${this.client.config.permLevels.find(l => l.level === level).name.toLowerCase()}, why should I listen to you instead of a ${cmd.conf.permLevel} (level ${this.client.levelCache[cmd.conf.permLevel]}).`);
      } else {
        return;
      }
    }

    message.author.permLevel = level;

    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    
    this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");

    try {
      let msg;
      if (cmd instanceof Social) {
        if (cmd.loadingString) msg = await message.channel.send(cmd.loadingString.replaceAll("{{displayName}}", message.member.displayName).replaceAll("{{me}}", message.guild.me.displayName).replaceAll("{{filterName}}", message.flags[0]));
        await cmd.cmdVerify(message, args, msg);
        if (message.settings.socialSystem === "true") {
          await cmd.cmdPay(message, message.author.id, cmd.help.cost, { msg });
        }
      }
      const mPerms = message.channel.permissionsFor(message.guild.me).missing(cmd.conf.botPerms);
      if (mPerms.includes("SEND_MESSAGES")) return;
      if (mPerms.length) return message.channel.send(`The bot does not have the following permissions \`${mPerms.join(", ")}\``);
      await cmd.run(message, args, level, msg);
    } catch (error) {
      this.client.emit("commandError", error, message);
    }
  }

  regExpEsc(str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

};