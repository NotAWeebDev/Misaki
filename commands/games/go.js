const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class Go extends Command {
  constructor(...args) {
    super(...args, {
      name: "go",
      description: "Gets other users to join you in games.",
      category: "Games",
      usage: "go <csgo/dota/pubg/gmod/rocketleague> [steamuser]",
      extended: "Mentions a game title to ask for lobby.",
      cooldown: 10
    });
  }

  async run(message, [name, steamid], level) { // eslint-disable-line no-unused-vars
    let game;
    if (name) {
      const title = name.toLowerCase();
      switch (title) {
        default:
          break;
        case "dota":
          game = {
            title: "DOTA 2",
            img: "http://cdn.edgecast.steamstatic.com/steam/apps/570/header.jpg",
            run: "steam://run/570"
          };
          break;

        case "csgo":
          game = {
            title: "Counter-Strike: Global Offensive",
            img: "http://cdn.edgecast.steamstatic.com/steam/apps/730/header.jpg",
            run: "steam://run/730"
          };
          break;

        case "gmod":
          game = {
            title: "Garry's Mod",
            img: "http://cdn.edgecast.steamstatic.com/steam/apps/4000/header.jpg",
            run: "steam://run/4000"
          };
          break;

        case "pubg":
          game = {
            title: "PLAYERUNKNOWN'S BATTLEGROUNDS",
            img: "http://cdn.edgecast.steamstatic.com/steam/apps/578080/header.jpg",
            run: "steam://run/578080"
          };
          break;
        case "rocketleague":
          game = {
            title: "Rocket League",
            img: "http://cdn.edgecast.steamstatic.com/steam/apps/252950/header.jpg",
            run: "steam://run/252950"
          };
          break;
      }

      const embed = new MessageEmbed()
        .setColor(6192321)
        .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL()}`)
        .setThumbnail(`${message.author.displayAvatarURL()}`)
        .addField("Steam Profile", `${steamid !== undefined ? `[${message.author.username}](https://steamcommunity.com/id/${steamid})` : "Not provided"}`)
        .addField("Launch Game", `**Launch game:** ${game.run}`)
        .setImage(`${game.img}`);

      message.channel.send(this.client.responses.goMessages.random().replaceAll("{{user}}", message.author.username).replaceAll("{{game}}", game.title), { embed });
    } else {
      message.channel.send(`${this.client.responses.goMessages.random().replaceAll("{{user}}", message.author.username).replaceAll("{{game}}", "game")}`);
    }

  }

}

module.exports = Go;
