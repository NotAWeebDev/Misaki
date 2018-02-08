const Owner = require(`${process.cwd()}/base/Owner.js`);
const snekfetch = require("snekfetch");
class DBLStats extends Owner {
  constructor(client) {
    super(client, {
      name: "dblstats",
      description: "This will display who voted for Misaki.",
      usage: "dblstats",
      category: "General",
      aliases: ["dbls"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { body } = await snekfetch.get(`https://discordbots.org/api/bots/${this.client.user.id}/votes?onlyids=true`).set("Authorization", this.client.config.dblToken);
    await message.buildEmbed()
      .setColor(message.guild.me.roles.highest.color || 5198940)
      .setThumbnail(this.client.user.displayAvatarURL({format: "png"}))
      .setTitle("Discord Bot List Upvoters")
      .setDescription(`Voter(s) <@${body.join(">, <@")}>`)
      .addField("Voter Count", body.length, true)
      .setTimestamp()
      .send();
  }
}

module.exports = DBLStats;