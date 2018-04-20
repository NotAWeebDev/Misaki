const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class SnapChat extends Social {
  constructor(...args) {
    super(...args, {
      name: "snapchat",
      description: "Creates a snapchat based meme.",
      usage: "snapchat <text>",
      category: "Canvas",
      extended: "This command uses canvas to generate a Snapchat styled image based on the well known statue meme.",
      cost: 10,
      cooldown: 10,
      aliases: ["sc"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is applying filters...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const text = args.join(" ");
    if (text.length < 1) return Promise.reject(new this.client.methods.errors.UsageError("You must give the snap some text.", { msg: loadingMessage}));
    if (text.length > 28) return Promise.reject(new this.client.methods.errors.UsageError("I can only handle a maximum of 28 characters.", { msg: loadingMessage}));
    return Promise.resolve(text);
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    let text = await this.cmdVerify(message, args, loadingMessage);
    if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.snapchat(text), "achievement.png"));
    await loadingMessage.delete();
  }
}

module.exports = SnapChat;