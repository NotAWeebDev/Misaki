const Social = require(`${process.cwd()}/base/Social.js`);

class Hewwo extends Social {
  constructor(client) {
    super(client, {
      name: "hewwo",
      description: "English to hewwo twanswatow.",
      usage: "hewwo is it me your looking for?",
      category: "Fun",
      extended: "Convert your boring English sentences into amazing and exciting Engwish.",
      cost: 5,
      aliases: ["hello", "engwish"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (args.length < 1) return message.response(undefined, "You need to give the bot a message to send.");
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const phrase = args.join(" ");
    try {
      message.channel.send(this.translate(phrase));
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  translate(phrase) {
    const words = phrase.split(" ");
    const finalPhrase = [];
    words.forEach(word => {
      if (Math.random() > 0.7) {
        finalPhrase.push(`${word.charAt(0)}-${word}`);
      } else {
        finalPhrase.push(word);
      }
      if (Math.random() > 0.99) {
        finalPhrase.push("_OwO, what's this?_");
      }
    });
    const x3 = [" x3"," :3", " owo", " OwO", " OWO", " X3"];
    return finalPhrase.join(" ").replaceAll("l", "w").replaceAll("L", "W").replaceAll("r", "w").replaceAll("R", "W") + x3.random();
  }
}

module.exports = Hewwo;
