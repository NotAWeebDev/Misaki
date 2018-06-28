const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Religion extends Social {
  constructor(...args) {
    super(...args, {
      name: "religion",
      description: "Has a religion they want you to join.",
      category: "Canvas",
      usage: "religion [@mention]",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants you to join their religion...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const smsImg = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.religion(smsImg.displayAvatarURL({ format: "png", size: 512 })), "religion.png"));
    await loadingMessage.delete();
  }
}

module.exports = Religion;