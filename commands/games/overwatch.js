const Command = require(`${process.cwd()}/base/Command.js`);
const owjs = require("overwatch-js");
const { MessageEmbed } = require("discord.js");
const locationArray = ["us", "eu", "kr", "cn", "global"]

class Overwatch extends Command {
  constructor(client) {
    super(client, {
      name: "overwatch",
      description: "Find Your Ow Player Stats",
      usage: "overwatch <pc|xbl|psn> [us|eu|kr|cn|global] <full-battle-tag|gamertag>",
      aliases: ["ow"]
    });
  }

  async run(message, [platform, location, player], level) { // eslint-disable-line no-unused-vars
    if (!player || !location || !platform) return message.resonse(undefined, `Ba....Baka! Invalid Usage, please do:\`${this.help.usage}\``);
    if (!locationArray.includes(location)) return message.response(undefined, "Ba....Baka! Invalid Location. Valid Locations are us eu, kr, cn, global");
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
    return message.channel.send({ embed });
  }
}

module.exports = Overwatch;
