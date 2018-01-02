const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Yoda extends Social {
  constructor(client) {
    super(client, {
      name: "yoda",
      description: "With this, like Yoda you can speak. Yes",
      category: "Fun",
      usage: "yoda <message>",
      extended: "This command will turn any supplied text into Yoda speech, results may vary.",
      cost: 1,
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const speech = args.join(" ");
      if (speech.length < 2) {
        message.response(undefined, "Invalid command usage, you must supply text for Yoda. Yes.");
        return;
      }
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      const { text } = await snek.get(`http://yoda-api.appspot.com/api/v1/yodish?text=${encodeURIComponent(speech.toLowerCase())}`);
      message.channel.send(JSON.parse(text).yodish);
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Yoda;