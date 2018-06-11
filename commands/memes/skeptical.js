const Meme = require("../../structures/Meme.js");

class Notsure extends Meme {
  constructor(...args) {
    super(...args, {
      name: "skeptical",
      description: "Express your skepticism with Philip J Fry!",
      usage: "skeptical <top text ; bottom text>",
      category: "meme",
      cost: 5,
      aliases: ["fry", "notsure"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is a tad skeptical..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const text = args.join(" ");
    if (!text.length) return Promise.reject(new this.client.methods.errors.UsageError("You must supply text for this command", loadingMessage));
    return Promise.resolve(text);
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const text = await this.cmdVerify(message, args, loadingMessage);
    const meme = await this.twoMeme(61520, text);
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
module.exports = Notsure;