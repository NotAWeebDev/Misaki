const Social = require(`${process.cwd()}/base/Social.js`);
var owjs = require("overwatch-js");
const { MessageEmbed } = require("discord.js");
class Overwatch extends Social {
  constructor(client) {
    super(client, {
      name: "overwatch",
      description: "Find Your Ow Player Stats",
      usage: "OW <pc|xbl|psn> [us|eu|kr|cn|global] <full-battle-tag|gamertag>",
      aliases: ["ow"]
    });
  }

  async run(message, [platform, location, player], level) { // eslint-disable-line no-unused-vars
    player = player.replace(/#/g , "-");
    const data = await owjs.getAll(platform, location, player);
    const embed = new MessageEmbed()
      .setTitle(`${data.profile.nick} Lvl ${data.profile.level} on ${platform}`)
      .setURL(data.profile.url)
      .setThumbnail(data.profile.avatar)
      .addField("Competitive Rank ", isNaN(data.profile.rank) ? "Unranked" : data.profile.rank, true)
      .addField("Competitive Deaths", data.competitive.global.deaths, true)
      .addField("Competitve Record (Current) ", data.competitive.global.games_won, true)
      .addField("Competitive Win Percent ", (data.competitive.global.games_won / data.competitive.global.games_played * 100).toFixed(2), true)
      .addField("Medals ", data.competitive.global.medals)
      .addField("Silver Medals ", data.competitive.global.medals_silver, true)
      .addField("Bronze Medals ", data.competitive.global.medals_bronze, true)
      .addField("Quickplay Wins ", data.quickplay.global.games_won, true)
      .addField("Quickplay Deaths", data.quickplay.global.deaths, true)
      .setColor(message.member.roles.highest.color || 0x00AE86);

    message.channel.send({ embed });
  }
}

module.exports = Overwatch;
