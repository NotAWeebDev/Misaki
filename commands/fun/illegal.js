const Social = require("../../structures/Social.js");
const { get, post } = require("snekfetch");

class IsNowIllegal extends Social {
  constructor(...args) {
    super(...args, {
      name: "illegal",
      description: "US President Trump makes something illegal.",
      usage: "illegal <thing>",
      category:"Fun",
      extended: "Powered by IsNowIllegal.com, get US President Trump to make anything illegal.",
      cost: 10,
      cooldown: 10,
      aliases:["trump", "sign"],
      loadingString: "<a:typing:397490442469376001> **President Donald Trump** is making new laws...",
      botPerms: ["EMBED_LINKS"]
    });
    this.inUse = null;
  }

  cmdVerify(message, args, loadingMessage) {
    if (this.inUse) return Promise.reject(new this.client.methods.errors.APIError("Trump is currently making something illegal, please wait.", loadingMessage));
    const word = args.join(" ");
    if (word.length < 1 || word.length > 10) return Promise.reject(new this.client.methods.errors.UsageError("Cannot be longer than 10 characters or shorter than 1 character.", loadingMessage));
    const wordMatch = /^[a-zA-Z\s]{1,10}$/.exec(word);
    if (!wordMatch) return Promise.reject(new this.client.methods.errors.UsageError("oops! Non-standard unicode characters are now illegal.", loadingMessage));
    return Promise.resolve(word);
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const word = await this.cmdVerify(message, args, loadingMessage);
    this.inUse = message.author.id;
    await post("https://is-now-illegal.firebaseio.com/queue/tasks.json").send({ task: "gif", word: word.toUpperCase() });
    const { body } = await get(`https://is-now-illegal.firebaseio.com/gifs/${word.toUpperCase()}.json`);
    this.inUse = null;
    return loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.url,
        "color": 6192321,
        "image": {
          "url": body.url
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by isnowillegal.com`
        }
      }
    });
  }
}

module.exports = IsNowIllegal;