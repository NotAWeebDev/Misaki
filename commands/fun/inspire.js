const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Inspire extends Social {
  constructor(client) {
    super(client, {
      name: "inspire",
      description: "Get random inspirational quotes from an AI.",
      category: "Fun",
      usage: "inspire",
      cost: 10,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to be inspired...`);

      const xmas = message.flags[0] === "xmas" ? "&season=xmas" : "";
      const { text } = await snekfetch.get(`http://inspirobot.me/api?generate=true${xmas}`);
      await message.channel.send({ files: [{ attachment: text, name: "inspire.jpg" }] });
      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Inspire;