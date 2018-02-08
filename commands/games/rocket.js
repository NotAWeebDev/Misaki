const rl = require("rocketleague");
const rocket = new rl.Client("API FROM WEBSITE ->"); //https://developers.rocketleaguestats.com
const { MessageEmbed } = require("discord.js")
const Command = require(`${process.cwd()}/base/Command.js`);

class RocketLeague extends Command {
    constructor(client) {
        super(client, {
            name: "rocket",
            description: "Get's a user's rocket league profile.",
            category: "Games",
            usage: "rocket [pc/xbl/psn] [username]",
            extended: "None.",
            cooldown: 10
        });
    };

    async run(message, args, level) {
        if (!args[0] || !args[1]) return message.response("❗", `Invalid Usage, please do:\`${this.help.usage}\``);
        if (args[0] === "pc" || args[0] === "steam") platform = "steam";
        if (args[0] === "ps4" || args[0] === "psn") platform = "psn";
        if (args[0] === "xbl" || args[0] === "xbox") platform = "xbl";

        try {
            rocket.getPlayer(args.splice(1).join(" "), platform).then(player => {
                const embed = new MessageEmbed()
                .setImage(player.signatureUrl)
                if(player.avatar) embed.setThumbnail(player.avatar)
                embed.setTitle(`${player.displayName}, on ${player.platform.name}`)
                embed.setURL(player.profileUrl)
                embed.addField("Wins", player.stats.wins, true)
                embed.addField("Goals", player.stats.goals, true)
                embed.addField("MVPs", player.stats.mvps, true)
                embed.addField("Saves", player.stats.saves, true)
                embed.addField("Shots", player.stats.shots, true)
                embed.addField("Assists", player.stats.assists, true)
                embed.addBlankField()
                embed.setColor(message.guild.member(client.user.id).roles.highest.color || 0x00AE86);
                message.channel.send(embed)
            });
        } catch (error) {
            message.response("❗", `Player not found or Invalid Usage, please do:\`${this.help.usage}\``);
        };
    };
};

module.exports = RocketLeague;

