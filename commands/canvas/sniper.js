const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Sniper extends Social {
  constructor(...args) {
    super(...args, {
      name: "sniper",
      description: "Take aim at someone.",
      category: "Canvas",
      usage: "sniper [@mention]",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** takes aim...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const targetImg = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.sniper(targetImg.displayAvatarURL({ format: "png", size: 512 })), "sniper.png"));
    await loadingMessage.delete();
  }
}

module.exports = Sniper;