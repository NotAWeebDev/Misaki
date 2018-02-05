const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");
class Yoda extends Social {
  constructor(client) {
    super(client, {
      name: "yoda",
      description: "With this, like Yoda you can speak. Yes",
      category: "Fun",
      usage: "yoda <message>",
      extended: "This command will turn any supplied text into Yoda speech, results may vary.",
      cost: 5
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const speech = args.join(" ");
      if (speech.length < 2) {
        message.response(undefined, "Invalid command usage, you must supply text for Yoda. Yes.");
        return;
      }

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const { text } = await snekfetch.get(`http://yoda-api.appspot.com/api/v1/yodish?text=${encodeURIComponent(speech.toLowerCase())}`);
      message.channel.send(JSON.parse(text).yodish);
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Yoda;