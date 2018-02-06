const Owner = require(`${process.cwd()}/base/Owner.js`);
const { get } = require("snekfetch");
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
    const { body } = await get(`https://discordbots.org/api/bots/${this.client.user.id}/votes`).set("Authorization", this.client.config.dblToken);
    const voters = [];
    for (const user of body) {
      voters.push(user.id);
    }
    await message.buildEmbed()
      .setColor(message.guild.me.roles.highest.color || 5198940)
      .setThumbnail(this.client.user.displayAvatarURL({format: "png"}))
      .setTitle("Discord Bot List Upvoters")
      .addField("Voter(s)", `<@${voters.join(">, <@")}>`, true)
      .addField("Voter Count", voters.length, true)
      .setTimestamp()
      .send();
  }
}

module.exports = DBLStats;