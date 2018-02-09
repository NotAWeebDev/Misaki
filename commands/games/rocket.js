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
            usage: "rocket [pc|xbl|psn] [username]",
            extended: "None.",
            cooldown: 10
        });
    };

    async run(message, args, level) {
        if (!args.length || !args[1].length) return message.response("❗", `Invalid Usage, please do:\`${this.help.usage}\``);
        if (args[0] === "pc" || args[0] === "steam") platform = "steam";
        if (args[0] === "ps4" || args[0] === "psn") platform = "psn";
        if (args[0] === "xbl" || args[0] === "xbox") platform = "xbl";

        try {
            const player = await rocket.getPlayer(args.splice(1).join(" "), platform);
                const embed = new MessageEmbed()
                .setImage(player.signatureUrl)
                .setTitle(`${player.displayName}, on ${player.platform.name}`)
                .setURL(player.profileUrl)
                .addField("Wins", player.stats.wins, true)
                .addField("Goals", player.stats.goals, true)
                .addField("MVPs", player.stats.mvps, true)
                .addField("Saves", player.stats.saves, true)
                .addField("Shots", player.stats.shots, true)
                .addField("Assists", player.stats.assists, true)
                .setColor(message.guild.me.roles.highest.color || 0x00AE86);
                if(player.avatar) embed.setThumbnail(player.avatar);
                message.channel.send(embed);
        } catch (error) {
            message.response("❗", `Player not found or Invalid Usage, please do:\`${this.help.usage}\``);
        };
    };
};

module.exports = RocketLeague;

