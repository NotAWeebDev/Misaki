const Command = require(`${process.cwd()}/base/Command.js`);
const snek = require("snekfetch");
class Neko extends Command {
  constructor(client) {
    super(client, {
      name: "neko",
      description: "Shows a picture of a neko.",
      category: "Fun",
      usage: "neko",
      extended: "This command will return a Neko, a lewd Neko if used in a NSFW channel",
      cooldown: 10,
      guildOnly: true,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const { body } = await snek.get(`https://nekos.life/api${message.channel.nsfw === true ? "/lewd" : ""}/neko`);
      return message.channel.send({ embed: { image: { url: body.neko } } });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Neko;