const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const FNite = require("fortnite");
const fortnite = new FNite(require(`${process.cwd()}/config.js`).apiTokens.TRN);

class Fortnite extends Command {
  constructor(client) {
    super(client, {
      name: "fortnite",
      description: "Get's a user's fortnite profile.",
      category: "Games",
      usage: "fortnite <pc | xbl | psn> <username>",
      cooldown: 10,
      aliases: ["fort", "nite", "fn"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!args.length) return message.response("❗", `Invalid Usage, please do:\`${this.help.usage}\``);
    try {
      const data = await fortnite.getInfo(args.splice(1).join(" "), args[0]);
      message.channel.send(new MessageEmbed()
        .setTitle(`${data.username}, on ${data.platformNameLong}`)
        .setURL(`https://partybus.gg/player/${data.username}`)
        .addField("Squads", `**Top 6 :** ${data.lifetimeStats[3].value}\n**Top 3 :** ${data.lifetimeStats[2].value}\n**Wins:** ${data.stats.p9.top1.value}\n**KD:** ${data.stats.p9.kd.value}\n**Matches Played:** ${data.stats.p9.matches.value}\n**Kills:** ${data.stats.p9.kills.value}\n**Kills Per Game:** ${data.stats.p9.kpg.value}`, true)
        .addField("Duo", `**Top 12 :** ${data.lifetimeStats[4].value}\n**Top 5 :** ${data.lifetimeStats[1].value}\n**Wins:** ${data.stats.p10.top1.value}\n**KD:** ${data.stats.p10.kd.value}\n**Matches Played:** ${data.stats.p10.matches.value}\n**Kills:** ${data.stats.p10.kills.value}\n**Kills Per Game:** ${data.stats.p10.kpg.value}`, true)
        .addField("Solo", `**Top 25 :** ${data.lifetimeStats[5].value}\n**Top 10 :** ${data.lifetimeStats[0].value}\n**Wins:** ${data.stats.p2.top1.value}\n**KD:** ${data.stats.p2.kd.value}\n**Matches Played:** ${data.stats.p2.matches.value}\n**Kills:** ${data.stats.p2.kills.value}\n**Kills Per Game:** ${data.stats.p2.kpg.value}`, true)
        .addBlankField()
        .addField("Score", data.lifetimeStats[6].value, true)
        .addField("Matches", data.lifetimeStats[7].value, true)
        .addField("Total Wins", data.lifetimeStats[8].value, true)
        .addField("Win Rate", data.lifetimeStats[9].value, true)
        .addField("Kills", data.lifetimeStats[10].value, true)
        .addField("KDR", data.lifetimeStats[11].value, true)
        .addField("Kills Per Minute", data.lifetimeStats[12].value, true)
        .addField("Time Played", data.lifetimeStats[13].value, true)
        .addField("Average Survival Time", data.lifetimeStats[14].value, true)
        .setColor(message.guild.me.roles.highest.color || 5198940));
      
    } catch (error) {
      message.channel.send(`Player Not Found or invalid form type, for correct usage do: \`${this.help.usage}\`.`);
    }   
  }

}
module.exports = Fortnite;
