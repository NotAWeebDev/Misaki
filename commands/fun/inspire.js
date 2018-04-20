const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Inspire extends Social {
  constructor(...args) {
    super(...args, {
      name: "inspire",
      description: "Get random inspirational quotes from an AI.",
      category: "Fun",
      usage: "inspire",
      cost: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to be inspired...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const xmas = message.flags[0] === "xmas" ? "&season=xmas" : "";
    const { text } = await get(`http://inspirobot.me/api?generate=true${xmas}`);
    return loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": text,
        "color": message.guild ? message.guild.me.roles.highest.color : 5198940,
        "image": {
          "url": text
        }
      }
    });
  }
}

module.exports = Inspire;