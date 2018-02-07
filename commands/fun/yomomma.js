const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");
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
    const { text } = await get("http://api.yomomma.info/");
    message.channel.send(`_${JSON.parse(text).joke}_`);
  }
}

module.exports = Ping;