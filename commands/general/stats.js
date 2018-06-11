const Command = require("../../structures/Command.js");
const { version, MessageEmbed } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

class Stats extends Command {
  constructor(...args) {
    super(...args, {
      name: "stats",
      description: "Gives some useful bot statistics.",
      usage: "stats",
      aliases: ["invite"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const embed = new MessageEmbed()
      .setDescription(`\`\`\`asciidoc\n= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${this.client.users.size.toLocaleString()}
• Servers    :: ${this.client.guilds.size.toLocaleString()}
• Channels   :: ${this.client.channels.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}\`\`\``)
      .setColor(6192321)
      .addField("Invite Me", "If you want to add me to your guild, you can do so by grabbing my invite code from [here](https://discordapp.com/oauth2/authorize/?permissions=268755008&scope=bot&client_id=396323622953680910)")
      .addField("Okami Academy", "If you need help setting me up, you can join the [Okami Academy](https://discord.gg/RasxyYT) to get help with getting me ready on your guild!");
    message.channel.send({ embed });
  }
}

module.exports = Stats;
