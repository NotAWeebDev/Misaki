const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Yoda extends Social {
  constructor(...args) {
    super(...args, {
      name: "yoda",
      description: "With this, like Yoda you can speak. Yes",
      category: "Fun",
      usage: "yoda <message>",
      extended: "This command will turn any supplied text into Yoda speech, results may vary.",
      cost: 5
    });
  }

  cmdVerify(message, args) {
    if (args.length < 2) return Promise.reject(new this.client.methods.errors.UsageError("Invalid command usage, you must supply text for Yoda. Yes."));
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { text } = await get(`http://yoda-api.appspot.com/api/v1/yodish?text=${encodeURIComponent(args.join(" ").toLowerCase())}`);
    message.channel.send(JSON.parse(text).yodish);
  }
}

module.exports = Yoda;