const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Butts extends Social {
  constructor(client) {
    super(client, {
      name: "butts",
      description: "Baby got back.",
      category: "Fun",
      usage: "butts",
      extended: "This command will return butts.",
      cooldown: 10,
      guildOnly: true,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

      if (!(await this.cmdPay(message, message.author.id, this.help.cost, this.conf.botPerms))) return;

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is looking for butts...`);
      const { body } = await snek.get("http://api.obutts.ru/butts/0/1/random");
      message.buildEmbed()
        .setImage(`http://media.obutts.ru/${body[0].preview}`)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Butts;