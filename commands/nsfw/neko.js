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
      if (!message.channel.nsfw) return message.response(undefined, "I cannot be used outside a NSFW channel!");
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is looking for a feline...`);
      const { body } = await snek.get(`https://nekos.life/api${message.channel.nsfw === true ? "/lewd" : ""}/neko`);
      message.channel.send({ embed: { image: { url: body.neko } } });
      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Neko;