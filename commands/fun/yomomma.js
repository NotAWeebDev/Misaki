const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Ping extends Social {
  constructor(client) {
    super(client, {
      name: "yomomma",
      description: "Disrespect someone's mother with this.",
      category: "Fun",
      usage: "yomomma",
      cost: 5,
      cooldown: 5,
      aliases: ["yomama"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }

    const { text } = await snek.get("http://api.yomomma.info/");
    message.channel.send(`_${JSON.parse(text).joke}_`);
  }
}

module.exports = Ping;