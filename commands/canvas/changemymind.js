const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class CMM extends Social {
  constructor(...args) {
    super(...args, {
      name: "changemymind",
      description: "Change my mind!",
      category: "Canvas",
      usage: "changemymind <text>",
      cost: 10,
      cooldown: 10,
      aliases: ["cmm"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants you to change their mind...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, [...text], level, loadingMessage) { // eslint-disable-line no-unused-vars 
    if (text.length === 0) return loadingMessage.edit("You must supply text baka!");
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.changemymind(message.author.displayAvatarURL({ format: "png", size: 32 }), text.join(" ")), "change-my-mind.jpg"));
    await loadingMessage.delete();
  }
}

module.exports = CMM;