const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Achievement extends Social {
  constructor(...args) {
    super(...args, {
      name: "achievement",
      description: "Creates an Achievement.",
      category: "Canvas",
      usage: "achievement",
      extended: "Either mention a user with text to give the achievement their user avatar, or just supply text for your own achievement.",
      cost: 10,
      cooldown: 10,
      aliases: ["get", "achieveget", "achievementget"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is getting an achievement..."
    });
  }

  cmdVerify(message, args, options) {
    const text = args.join(" ");
    if (text.length < 1) return Promise.reject(new this.client.methods.errors.UsageError("You must give an achievement description.", options.msg));
    if (text.length > 22) return Promise.reject(new this.client.methods.errors.UsageError("I can only handle a maximum of 22 characters", options.msg));
    return Promise.resolve();
  }

  async run(message, args, level, loadingMessage) {
    let text = args.join(" ");
    if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.achievement((message.mentions.users.first() || message.author).displayAvatarURL({ format:"png", size:32 }), text), "achievement.png"));
    await loadingMessage.delete();
  }

  
}

module.exports = Achievement;