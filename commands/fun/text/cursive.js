const Social = require("../../../structures/Social.js");

class Cursive extends Social {
  constructor(...args) {
    super(...args, {
      name: "cursive",
      description: "Change your boring text to something fancy.",
      usage: "cursive [-normal | -bold] is it me your looking for?",
      category: "Fun",
      cost: 5,
      aliases: ["fancy"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    if (args.length < 1) return Promise.reject(new this.client.methods.errors.UsageError("You need to give the bot a message to send.", loadingMessage));
    return Promise.resolve();
  }

  async run(message, args) {
    if (!message.flags.length) message.flags.push("normal");
    await message.channel.send(await this.client.idiotAPI.cursive(args.join(" "), message.flags[0]));
  }

}

module.exports = Cursive;
