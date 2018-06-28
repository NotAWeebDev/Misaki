const Social = require("../../structures/Social.js");
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
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is getting an achievement...",
      botPerms: ["ATTACH_FILES"]
    });
  }

 
  async run(message, [...text], level, loadingMessage) {
    text = text.join(" ");
    if (message.mentions.users.size !== 0) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
    if (!text) return loadingMessage.edit("You must give an achievement description.");
    if (text.length > 22) return loadingMessage.edit("I can only handle a maximum of 22 characters");
    await loadingMessage.delete();
    return message.channel.send(new MessageAttachment(await this.client.idiotAPI.achievement((message.mentions.users.first() || message.author).displayAvatarURL({ format:"png", size:32 }), text), "achievement.png"));
  }

  
}

module.exports = Achievement;