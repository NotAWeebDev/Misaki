const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const core = require("game-data");
const rocket = new core.Client({
    steam: "STEAM-API-KEY", // https://steamcommunity.com/dev/apikey
    rocket: "ROCKET-API-KEY" // https://developers.rocketleaguestats.com
});

class RocketLeage extends Command {
    constructor(client) {
      super(client, {
        name: "rocket",
        description: "Get's a user's rocket leage profile.",
        category: "Games",
        usage: "rocket [pc/xbl/psn] [username]",
        extended: "None.",
        cooldown: 10
      });
    }
  
    async run(message, args, level) {
    let gametype;
    let embed;

    if (!args[0] || !args[1]) return message.response("❗", `Invalid Usage, please do:\`${this.help.usage}\``);
    if (args[0] === "pc" || args[0] === "steam") gametype = "1";
    if (args[0] === "ps4" || args[0] === "psn") gametype = "2";
    if (args[0] === "xbl" || args[0] === "xbox") gametype = "3";

    if (args[0] !== "pc" || args[0] !== "ps4" || args[0] !== "xbl") return message.response("❗", `Invalid Usage, please do:\`${this.help.usage}\``); 

        rocket.getRocketLeagueProfile(args.splice(1).join(" "), gametype).then(async data => {
            if (!data.name.length) return message.response("❗", `Invalid Usage, please do:\`${this.help.usage}\``); 
            const embed = new MessageEmbed()
            .setTitle(`${data.name}, on ${data.platform}`)
            .addField("Wins", data.wins, true)
            .addField("Goals", data.goals, true)
            .addField("MVPs", data.mvps, true)
            .addField("Saves", data.saves, true)
            .addField("Shots", data.shots, true)
            .addField("Assists", data.assists, true)
            .setColor(message.guild.member(client.user.id).highestRole.color || 0x00AE86);
            await message.channel.send(embed)
            });    
    }
}
