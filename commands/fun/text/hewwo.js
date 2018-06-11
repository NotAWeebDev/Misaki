const Social = require("../../../structures/Social.js");

class Hewwo extends Social {
  constructor(...args) {
    super(...args, {
      name: "hewwo",
      description: "English to hewwo twanswatow.",
      usage: "hewwo is it me your looking for?",
      category: "Fun",
      extended: "Convert your boring English sentences into amazing and exciting Engwish.",
      cost: 5,
      aliases: ["hello", "engwish"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    if (args.length < 1) return Promise.reject(new this.client.methods.errors.UsageError("You need to give the bot a message to send.", loadingMessage));
    return Promise.resolve();
  }

  async run(message, args) {
    await message.channel.send(await this.client.idiotAPI.owoify(args.join(" ")));
  }

}

module.exports = Hewwo;
