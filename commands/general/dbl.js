const Command = require(`${process.cwd()}/base/Command.js`);
const snekfetch = require("snekfetch");
class DBL extends Command {
  constructor(client) {
    super(client, {
      name: "dbl",
      description: "This will display it's current listed information from discordbots.org.",
      usage: "dbl",
      category: "General",
      extended: "Pulls up to date information from the Discord Bot List hosted at discordbots.org.",
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { body } = await snekfetch.get(`https://discordbots.org/api/bots/${this.client.user.id}/`);
    
    await message.buildEmbed()
      .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${body.clientid}/${body.avatar}.png`)
      .setTitle("Discord Bot List Information")
      .addField("ID", body.clientid, true)
      .addField("Username", body.username, true)
      .addField("Discriminator", body.discriminator, true)
      .addField("Short Description", body.shortdesc, true)
      .addField("Libray", body.lib, true)
      .addField("Prefix", body.prefix, true)
      .addField("Upvotes", body.points, true)
      .addField("Server Count", body.server_count, true)
      .addField("Owner(s)", `<@${body.owners.join(">, <@")}>`, true)
      .addField("Links", `${body.invite.length !== 0 ? `[Invite](${body.invite}) | ` : ""}${body.website.length !== 0 ? `[Website](${body.website}) | ` : "" }${body.support.length !== 0 ? `[Support Server](https://discord.gg/${body.support})` : ""}`, true)
      .setTimestamp()
      .send();
  }
}

module.exports = DBL;