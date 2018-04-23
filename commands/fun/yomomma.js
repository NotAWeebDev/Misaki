const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");
class Momma extends Social {
  constructor(...args) {
    super(...args, {
      name: "yomomma",
      description: "Disrespect someone's mother with this.",
      category: "Fun",
      usage: "yomomma",
      cost: 5,
      cooldown: 5,
      aliases: ["yomama", "mum", "mam", "mom"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { text } = await get("http://api.yomomma.info/");
    message.channel.send(`_${JSON.parse(text).joke}_`);
  }
}

module.exports = Momma;