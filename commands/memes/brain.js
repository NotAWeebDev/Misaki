const Meme = require("../../structures/Meme.js");

class Brain extends Meme {
  constructor(...args) {
    super(...args, {
      name: "brain",
      description: "Blow your mind",
      usage: "brain <first text ; second text ; third text ; forth text>",
      category: "meme",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** reveals their inner knowledge..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const text = args.join(" ");
    if (!text.length) return Promise.reject(new this.client.methods.errors.UsageError("You must supply text to think about!", loadingMessage));
    return Promise.resolve(text);
  }

  async run(message, args, level, loadingMessage) {
    const text = await this.cmdVerify(message, args, loadingMessage);
    const meme = await this.fourMeme(93895088, text);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": meme,
        "color": 6192321,
        "image": {
          "url": meme
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by imgflip.com`
        }
      }
    });
  }
}
module.exports = Brain;
