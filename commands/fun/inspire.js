const Social = require("../../base/Social.js");
const { get } = require("snekfetch");

class Inspire extends Social {
  constructor(...args) {
    super(...args, {
      name: "inspire",
      description: "Get random inspirational quotes from an AI.",
      category: "Fun",
      usage: "inspire",
      cost: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to be inspired..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const xmas = message.flags[0] === "xmas" ? "&season=xmas" : "";
    const { text } = await get(`http://inspirobot.me/api?generate=true${xmas}`);
    await message.channel.send({ files: [{ attachment: text, name: "inspire.jpg" }] });
    await loadingMessage.delete();
  }
}

module.exports = Inspire;