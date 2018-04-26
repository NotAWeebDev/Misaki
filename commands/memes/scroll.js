const Meme = require("../../structures/Meme.js");

class Scroll extends Meme {
  constructor(...args) {
    super(...args, {
      name: "scroll",
      description: "Discover the scroll of truth!",
      usage: "scroll <text>",
      category: "meme",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** discovers the scroll of truth..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const text = args.join(" ");
    if (!text.length) return Promise.reject(new this.client.methods.errors.UsageError("You must supply text for this command", loadingMessage));
    return Promise.resolve(text);
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const text = await this.cmdVerify(message, args, loadingMessage);
    const meme = await this.twoMeme(123999232, text);
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
module.exports = Scroll;