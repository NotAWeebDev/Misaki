const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");

class Neko extends Social {
  constructor(client) {
    super(client, {
      name: "neko",
      description: "Shows a picture of a neko.",
      category: "NSFW",
      usage: "neko",
      extended: "This command will return a Neko, a lewd Neko if used in a NSFW channel",
      cost: 40,
      cooldown: 10,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is looking for a feline...`);
      const { body } = await snek.get(`https://nekos.life/api${Math.random() >= 0.5 ? "/lewd" : ""}/neko`);
      message.channel.send({ embed: { image: { url: body.neko } } });
      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Neko;