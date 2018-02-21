const Social = require(`${process.cwd()}/base/Social.js`);
const { UsageError } = require(`${process.cwd()}/util/CustomError.js`);

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

  cmdVerify(message, args, loadingMessage) {
    if (args.length < 1) return Promise.reject(new UsageError("You need to give the bot a message to send.", loadingMessage));
    return Promise.resolve();
  }

  async run(message, args) {
    await message.channel.send(this.translate(args.join(" ")));
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
