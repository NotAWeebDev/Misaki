const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");
const { UsageError } = require(`${process.cwd()}/util/CustomError.js`);

class TheSearch extends Social {
  constructor(client) {
    super(client, {
      name: "thesearch",
      description: "Creates a meme based on a webcomic.",
      category: "Canvas",
      usage: "thesearch <text>",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is searching..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const text = args.join(" ");
    if (text.length < 1) return Promise.reject(new UsageError("You must give some text.", { msg: loadingMessage}));
    return Promise.resolve(text);
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    let text = await this.cmdVerify(message, args, loadingMessage);
    if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.theSearch((message.mentions.users.first() || message.author).displayAvatarURL({ format:"png", size:128 }), text), "thesearch.png"));
    await loadingMessage.delete();
  }
}

module.exports = TheSearch;//