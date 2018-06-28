const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Kirby extends Social {
  constructor(...args) {
    super(...args, {
      name: "kirby",
      description: "Kirby will school you!",
      category: "Canvas",
      usage: "kirby <text>",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to school someone...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, [...text], level, loadingMessage) { // eslint-disable-line no-unused-vars 
    if (text.length === 0) return loadingMessage.edit("You must supply text baka!");
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.kirby(message.author.displayAvatarURL({ format: "png", size: 256 }), text.join(" ")), "change-my-mind.jpg"));
    await loadingMessage.delete();
  }
}

module.exports = Kirby;