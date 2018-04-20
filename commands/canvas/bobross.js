const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class BobRoss extends Social {
  constructor(...args) {
    super(...args, {
      name: "bobross",
      description: "Paint a happy little accident.",
      category: "Canvas",
      usage: "bobross @mention",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **Painting** a happy little accident...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const painting = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.bobRoss(painting.displayAvatarURL({ format: "png", size: 512 })), "painting.png"));
    await loadingMessage.delete();
  }
}

module.exports = BobRoss;