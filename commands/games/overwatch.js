const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const owjs = require("overwatch-js");
const locationArray = ["us", "eu", "kr", "cn", "global"];
const platformArray = ["pc", "xbl", "psn", "xbox"];

class Overwatch extends Command {
  constructor(...args) {
    super(...args, {
      name: "overwatch",
      category: "Games",
      description: "Find Your Ow Player Stats",
      usage: "overwatch <pc|xbl|psn> [us|eu|kr|cn|global] <full-battle-tag|gamertag>",
      aliases: ["ow"],
      cooldown: 10
    });
  }

  async run(message, [platform, location, player], level) { // eslint-disable-line no-unused-vars
    if (!player.length || !location.length || !platform.length) return message.response(undefined, `Ba....Baka! Invalid Usage, please do:\`${this.usage}\``);
    if (!locationArray.includes(location)) return message.response(undefined, "Ba....Baka! Invalid Location. Valid Locations are us eu, kr, cn or global");
    if (!platformArray.includes(platform)) return message.response(undefined, "Ba....Baka! Invalid Platform. Valid Platforms are pc, xbl or psn");
    if (platform === "xbox") platform = "xbl";
    player = player.replace(/#/g , "-");
    const data = await owjs.getAll(platform, location, player).catch(e => {
      this.client.console.error(e);
      return null;
    });
    if (!data) message.response("❗", "Sorry, but something wen't wrong.. try again :<");
    const embed = new MessageEmbed()
      .setTitle(`${data.profile.nick} Lvl ${data.profile.level} on ${platform}`)
      .setURL(data.profile.url)
      .setThumbnail(data.profile.avatar)
      .addField("Competitive Rank ", data.profile.rank ? "Unranked" : data.profile.rank, true)
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
