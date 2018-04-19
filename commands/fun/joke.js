const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Oneliner extends Social {
  constructor(...args) {
    super(...args, {
      name: "joke",
      description: "This command will give you a one liner joke.",
      usage: "joke",
      category: "Fun",
      cost: 5,
      aliases: ["1l", "oneliner"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is thinking of something funny..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("https://dashboard.typicalbot.com/api/v1/joke").set("Authentication", process.env.TYPICAL);
    loadingMessage.edit(body.data);
  }
}

module.exports = Oneliner;
