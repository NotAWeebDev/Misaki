const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Boobs extends Social {
  constructor(client) {
    super(client, {
      name: "boobs",
      description: "Show me boobies!!!",
      category: "Fun",
      usage: "boobs",
      extended: "This command will return boobs.",
      cooldown: 10,
      guildOnly: true,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

      if (!(await this.cmdPay(message, message.author.id, this.help.cost, this.conf.botPerms))) return;

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is looking for boobies...`);
      const { body } = await snek.get("http://api.oboobs.ru/boobs/0/1/random");
      message.buildEmbed()
        .setImage(`http://media.oboobs.ru/${body[0].preview}`)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Boobs;